const {validateSource} = require('./validate_source');
const {validateTrigger} = require('./validate_trigger');
const {validateRedirect} = require('./validate_redirect');

// Initialize page elements
const validationForm = document.getElementById('validation-form');
const inputTextbox = document.getElementById('input-text');
const outputTextbox = document.getElementById('effective');
const headerOptions = validationForm.elements.namedItem('header');
const copyButton = document.getElementById('linkify');
const errorList = document.getElementById('errors');
const warningList = document.getElementById('warnings');
const noteList = document.getElementById('notes');
const successDiv = document.getElementById('success');
const sourceTypeOptionsContainer = document.getElementById('source-type-options');
const sourceTypeOptions = validationForm.elements.namedItem('source-type');

// Add listeners
validationForm.addEventListener('input', validate);
copyButton.addEventListener('click', copyLink);

// Define functions
function loadUrlParameters() {
  let params = new URLSearchParams(location.search);
  let paramsJSON = params.get('json');
  let paramsHeader = params.get('header');
  let paramsSourceType = params.get('source-type');

  if (paramsJSON) {
    inputTextbox.value = paramsJSON;
  }
  if (paramsHeader) {
    headerOptions.value = paramsHeader;
  }
  if (paramsSourceType) {
    sourceTypeOptions.value = paramsSourceType;
  }
}

async function copyLink() {
  const url = new URL(location.toString());
  url.search = '';
  url.searchParams.set('header', headerOptions.value);
  url.searchParams.set('json', inputTextbox.value);
  if (url.searchParams.get('header') === 'source') {
    url.searchParams.set('source-type', sourceTypeOptions.value);
  }
  await navigator.clipboard.writeText(url.toString());
}

function populateUIList(element, items) {
  element.replaceChildren([]);
  items.forEach(function (item) {
    let listItem = document.createElement('li');
    if (typeof item === "string") {
      listItem.textContent = item;
    } else {
      listItem.textContent = item.msg + ': ' + item.path;
    }
    element.appendChild(listItem);
  })
}

function validate() {
  // Enable/Disable source type option based on header type
  sourceTypeOptionsContainer.disabled = (headerOptions.value != 'source'); 

  // Fetch Flag Values
  let flagValues = {};
  flagValues['feature-lookback-window-filter'] = true;
  flagValues['feature-trigger-data-matching'] = true;
  flagValues['feature-coarse-event-report-destination'] = true;
  flagValues['feature-shared-source-debug-key'] = true;
  flagValues['feature-xna'] = true;
  flagValues['feature-shared-filter-data-keys'] = true;
  flagValues['feature-preinstall-check'] = true;
  flagValues['feature-attribution-scopes'] = false;
  flagValues['feature-aggregation-coordinator-origin'] = true;
  flagValues['feature-source-registration-time-optional-for-agg-reports'] = true;
  flagValues['feature-trigger-context-id'] = true
  flagValues['feature-enable-update-trigger-header-limit'] = false;
  flagValues['feature-enable-reinstall-reattribution'] = false;
  flagValues['max_attribution_filters'] = 50;
  flagValues['max_bytes_per_attribution_filter_string'] = 25;
  flagValues['max_values_per_attribution_filter'] = 50;
  flagValues["max_distinct_web_destinations_in_source_registration"] = 3;
  flagValues["max_web_destination_hostname_character_length"] = 253;
  flagValues["max_web_destination_hostname_parts"] = 127;
  flagValues["min_web_destination_hostname_part_character_length"] = 1;
  flagValues["max_web_destination_hostname_part_character_length"] = 63;
  flagValues["max_aggregate_keys_per_source_registration"] = 50;
  flagValues["max_bytes_per_attribution_aggregate_key_id"] = 25;
  flagValues["min_bytes_per_aggregate_value"] = 3;
  flagValues["max_bytes_per_aggregate_value"] = 34;
  flagValues["max_report_states_per_source_registration"] = (1n << 32n) - 1n;
  flagValues["max_trigger_context_id_string_length"] = 64;
  flagValues["max_bucket_threshold"] = (1n << 32n) - 1n;
  flagValues["max_filter_maps_per_filter_set"] = 20;
  flagValues["max_aggregate_keys_per_trigger_registration"] = 50;
  flagValues["max_sum_of_aggregate_values_per_source"] = 65536;
  flagValues["max_aggregate_deduplication_keys_per_registration"] = 50;
  flagValues["min_reporting_register_source_expiration_in_seconds"] = 1 * 24 * 60 * 60; // 1 day -> secs
  flagValues["max_reporting_register_source_expiration_in_seconds"] = 30 * 24 * 60 * 60; // 30 days -> secs
  flagValues["minimum_event_report_window_in_seconds"] = 1 * 60 * 60; // 1 hour -> secs
  flagValues["minimum_aggregatable_report_window_in_seconds"] = 1 * 60 * 60; // 1 hour -> secs
  flagValues["min_install_attribution_window"] = 1 * 24 * 60 * 60; // 1 day -> secs
  flagValues["max_install_attribution_window"] = 30 * 24 * 60 * 60; // 30 days -> secs
  flagValues["min_post_install_exclusivity_window"] = 0;
  flagValues["max_post_install_exclusivity_window"] = 30 * 24 * 60 * 60; // 30 days -> secs
  flagValues["max_reinstall_reattribution_window_seconds"] = 90 * 24 * 60 * 60; // 90 days -> secs
  flagValues["max_registration_redirects"] = 20;
  flagValues["max_32_bit_integer"] = Math.pow(2, 31) - 1;

  // Validate input
  let metadata = {
    flags: flagValues,
    header_options: {
      header_type: headerOptions.value,
      source_type: null
    },
    expected_value: null
  };
  let result;
  let output;
  if (headerOptions.value === 'source') {
    metadata.header_options.source_type = sourceTypeOptions.value;
    output = validateSource(inputTextbox.value, metadata);
    result = output.result;
  } else if (headerOptions.value === 'trigger') {
    output = validateTrigger(inputTextbox.value, metadata);
    result = output.result;
  } else if (headerOptions.value === 'redirect') {
    output = validateRedirect(inputTextbox.value, metadata);
    result = output.result;
  }

  // Show results
  successDiv.textContent = (result.errors.length === 0) ? 'The header is valid.' : '';
  populateUIList(errorList, result.errors);
  populateUIList(warningList, result.warnings);
  populateUIList(noteList, []);
  if (result.errors.length === 0) {
    outputTextbox.textContent = JSON.stringify(output.expected_value,  null, 2);
  } else {
    outputTextbox.textContent = "";
  }
}

// Load initial state of page
loadUrlParameters();
validate();