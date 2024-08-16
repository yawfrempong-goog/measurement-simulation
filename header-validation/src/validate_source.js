const {
  State,
  optBoolean,
  optBooleanFallback,
  uint64,
  int64,
  string,
  optString,
  optStringFallback,
  object,
  array,
  optArray,
  optional,
  formatKeys,
  isValidAppDestinationHost,
  isValidWebDestinationHost,
  isValidSourceFilterData,
  isValidTriggerMatchingData,
  isValidAggregationKeys,
  isValidAttributionScopes,
  isValidAttributionScopeLimit,
  isValidMaxEventStates,
  isValidExpiry,
  isValidEventReportWindow,
  isValidAggregatableReportWindow,
  isValidInstallAttributionWindow,
  isValidPostInstallExclusivityWindow,
  isValidReinstallReattributionWindow,
  isValidDebugAdId,
  isValidDebugJoinKey,
  isValidSourceEventId,
  isValidPriority,
  isValidDebugKey,
  isValidDebugReporting,
  isValidCoarseEventReportDestinations,
  isValidSharedDebugKey,
  isValidSharedAggregationKeys,
  isValidSharedFilterDataKeys,
  isValidDropSourceIfInstalled
} = require('./base');

function initializeExpectedValues(flags) {
  let expectedValues = {
    "source_event_id": 0,
    "debug_key": null,
    "destination": null,
    "expiry": flags["max_reporting_register_source_expiration_in_seconds"],
    "event_report_window": null,
    "aggregatable_report_window": (flags["max_reporting_register_source_expiration_in_seconds"] * 1000),
    "priority": 0,
    "install_attribution_window": (flags["max_install_attribution_window"] * 1000),
    "post_install_exclusivity_window": (flags["min_post_install_exclusivity_window"] * 1000),
    "reinstall_reattribution_window": 0,
    "filter_data": null,
    "web_destination": null,
    "aggregation_keys": null,
    "shared_aggregation_keys": null,
    "debug_reporting": false,
    "debug_join_key": null,
    "debug_ad_id": null,
    "coarse_event_report_destinations": false,
    "shared_debug_key": null,
    "shared_filter_data_keys": null,
    "drop_source_if_installed": false,
    "trigger_data_matching": "MODULUS",
    "attribution_scopes": null,
    "attribution_scope_limit": null,
    "max_event_states": 3
  };
  return expectedValues;
}

function validateSource(source, metadata) {
  try {
    sourceJSON = JSON.parse(source);
    sourceJSON = formatKeys(sourceJSON);
  } catch (err) {
    return {
      result: {errors: [err instanceof Error ? err.toString() : 'unknown error'], warnings: []},
      expected_value: {}
    };
  }

  const state = new State();
  let jsonSpec = {};

  // destination check
  if ((!('destination' in sourceJSON) || sourceJSON['destination'] === null) && (!('web_destination' in sourceJSON) || sourceJSON['web_destination'] === null)) {
    return {
      result: {errors: [{
      path: ["destination or web_destination"],
      msg: "At least one field must be present and non-null",
      formattedError: "at least one field must be present and non-null: `destination or web_destination`"}], warnings: []},
      expected_value: {}
    };
  }

  metadata.expected_value = initializeExpectedValues(metadata.flags);
  jsonSpec["destination"] = optional(optString(isValidAppDestinationHost, metadata));
  jsonSpec["source_event_id"] = optional(string(uint64(isValidSourceEventId, metadata)));
  jsonSpec["expiry"] = optional(optString(uint64(isValidExpiry, metadata))); // must be parsed before dependent fields
  jsonSpec["event_report_window"] = optional(optString(uint64(isValidEventReportWindow, metadata)));
  jsonSpec["aggregatable_report_window"] = optional(optString(uint64(isValidAggregatableReportWindow, metadata)));
  jsonSpec["priority"] = optional(string(int64(isValidPriority, metadata)));
  jsonSpec["debug_key"] = optional(string(uint64(isValidDebugKey, metadata)));
  jsonSpec["debug_reporting"] = optional(optBooleanFallback(isValidDebugReporting, metadata));
  jsonSpec["install_attribution_window"] = optional(optString(int64(isValidInstallAttributionWindow, metadata)));
  jsonSpec["post_install_exclusivity_window"] = optional(optString(int64(isValidPostInstallExclusivityWindow, metadata)));
  jsonSpec["debug_ad_id"] = optional(optStringFallback(isValidDebugAdId, metadata));
  jsonSpec["debug_join_key"] = optional(optStringFallback(isValidDebugJoinKey, metadata));
  jsonSpec["web_destination"] = optional(optArray(isValidWebDestinationHost, 'string', metadata));
  jsonSpec["filter_data"] = optional(object(isValidSourceFilterData, metadata));
  jsonSpec["aggregation_keys"] = optional(object(isValidAggregationKeys, metadata));

  if (metadata.flags['feature-attribution-scopes']) {
    metadata.flags['max_event_states_present'] = ('max_event_states' in sourceJSON);
    metadata.flags['attribution_scope_limit_present'] = ('attribution_scope_limit' in sourceJSON);
    jsonSpec["attribution_scope_limit"] = optional(optString(int64(isValidAttributionScopeLimit, metadata)));
    jsonSpec["max_event_states"] = optional(optString(int64(isValidMaxEventStates, metadata)));
    jsonSpec["attribution_scopes"] = optional(array(isValidAttributionScopes, metadata));
  }
  if (metadata.flags['feature-trigger-data-matching']) {
    jsonSpec["trigger_data_matching"] = optional(optString(isValidTriggerMatchingData, metadata));
  }
  if (metadata.flags['feature-coarse-event-report-destination']) {
    jsonSpec["coarse_event_report_destinations"] = optional(optBoolean(isValidCoarseEventReportDestinations, metadata));
  }
  if (metadata.flags['feature-shared-source-debug-key']) {
    jsonSpec["shared_debug_key"] = optional(optString(uint64(isValidSharedDebugKey, metadata)));
  }
  if (metadata.flags['feature-xna']) {
    jsonSpec["shared_aggregation_keys"] = optional(array(isValidSharedAggregationKeys, metadata));
  }
  if (metadata.flags['feature-shared-filter-data-keys']) {
    jsonSpec["shared_filter_data_keys"] = optional(array(isValidSharedFilterDataKeys, metadata));
  }
  if (metadata.flags['feature-preinstall-check']) {
    jsonSpec["drop_source_if_installed"] = optional(optBoolean(isValidDropSourceIfInstalled, metadata));
  }
  if(metadata.flags['feature-enable-reinstall-reattribution']) {
    jsonSpec["reinstall_reattribution_window"] = optional(optString(int64(isValidReinstallReattributionWindow, metadata)));
  }

  state.validate(sourceJSON, jsonSpec);
  return {
    result: state.result(),
    expected_value: metadata.expected_value
  };
}

module.exports = {
  validateSource
};