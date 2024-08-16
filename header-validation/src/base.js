const uint64Regex = /^[0-9]+$/;
const int64Regex = /^-?[0-9]+$/;
const hexadecimalRegex = /^[0-9a-fA-F]+$/;
const alphaNumericRegex = /^[a-zA-Z0-9-_]+$/;

class State {
  constructor() {
    this.path = [];
    this.errors = [];
    this.warnings = [];
  }

  error(msg) {
    this.errors.push({
      path: [...this.path],
      msg,
      formattedError: `${msg}: \`${[...this.path]}\``,
      });
  }

  warning(msg) {
    this.warnings.push({
      path: [...this.path],
      msg,
      formattedWarning: `${msg}: \`${[...this.path]}\``,
      });
  }

  scope(scope, fn) {
    this.path.push(scope);
    fn();
    this.path.pop();
  }

  result() {
    return {errors: this.errors, warnings: this.warnings};
  }

  validate(obj, checks) {
    Object.entries(checks).forEach(([key, check]) => {
      this.scope(key, () => check(this, key, obj));
    });
  }
}

function getDataType(value) {
  if (value === null) {
    return "null";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  if (typeof value === "number") {
    return "number"
  }
  if (typeof value === "string") {
    return "string";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (value !== null && typeof value === "object" && value.constructor === Object) {
    return "object";
  }
  return "";
}

function optional(fn = () => {}, metadata) {
  return (state, key, object) => {
    if (key in object) {
      if (object[key] !== null) {
        result = (metadata === undefined) ? fn(state, object[key]) : fn(state, object[key], metadata);
        return;
      }
    }
  }
}

function string(fn = () => {}, metadata) {
  return (state, value) => {
    if (getDataType(value) === "string") {
      result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
      return;
    }
    state.error("must be a string");
  }
}

function optString(fn = () => {}, metadata) {
  return (state, value) => {
    if (getDataType(value) === "string") {
      result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
      return;
    } else if (getDataType(value) !== "null") {
      result = (metadata === undefined) ? fn(state, String(value)) : fn(state, String(value), metadata);
      return;
    }
    state.error("must be a string or able to cast to string");
  }
}

function optStringFallback(fn = () => {}, metadata) {
  return (state, value) => {
    if (getDataType(value) === "string") {
      result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
    } else if (getDataType(value) !== "null") {
      result = (metadata === undefined) ? fn(state, String(value)) : fn(state, String(value), metadata);
    } else {
      result = (metadata === undefined) ? fn(state, "") : fn(state, "", metadata);
    }
  }
}

function object(fn = () => {}, metadata) {
  return (state, value) => {
    if (getDataType(value) === "object") {
      result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
      return;
    }
    state.error("must be an object");
  }
}

function array(fn = () => {}, metadata) {
  return (state, value) => {
    if (getDataType(value) === "array") {
      result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
      return;
    }
    state.error("must be an array");
  }
}

function optArray(fn = () => {}, requiredType, metadata) {
  return (state, value) => {
    if (getDataType(value) === "array") {
      result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
      return;
    }

    if (requiredType !== null) {
      if (getDataType(value) === requiredType) {
        result = (metadata === undefined) ? fn(state, [value]) : fn(state, [value], metadata);
        return;
      }
      state.error("must be a " + requiredType + " or an array of " + requiredType);
      return;
    } else {
      if (getDataType(value) !== "null") {
        result = (metadata === undefined) ? fn(state, [value]) : fn(state, [value], metadata);
        return;
      }
      state.error("must be a array or able to cast to array");
      return;
    }
  }
}

function boolean(fn = () => {}, metadata) {
  return (state, value) => {
    if (getDataType(value) === "boolean") {
      result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
      return;
    }
    state.error("must be a boolean");
  }
}

function optBoolean(fn = () => {}, metadata) {
  return (state, value) => {
    if (getDataType(value) === "boolean") {
      result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
      return;
    } else if (getDataType(value) === "string") {
      if (value.toLowerCase() === "true") {
        result = (metadata === undefined) ? fn(state, true) : fn(state, true, metadata);
        return;
      } else if (value.toLowerCase() === "false") {
        result = (metadata === undefined) ? fn(state, false) : fn(state, false, metadata);
        return;
      }
    }
    state.error("must be a boolean");
  }
}

function optBooleanFallback(fn = () => {}, metadata) {
  return (state, value) => {
    if (getDataType(value) === "boolean") {
      result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
      return;
    } else if (getDataType(value) === "string") {
      if (value === "true") {
        result = (metadata === undefined) ? fn(state, true) : fn(state, true, metadata);
        return;
      } else if (value === "false") {
        result = (metadata === undefined) ? fn(state, false) : fn(state, false, metadata);
        return;
      }
    }
    result = (metadata === undefined) ? fn(state, false) : fn(state, false, metadata);
    return;
  }
}

function uint32(fn = () => {}, metadata) {
  return (state, value) => {
    if (!uint64Regex.test(value)) {
      state.error(`must be an uint32 (must match ${uint64Regex})`);
      return;
    }

    const max = 2n ** 32n - 1n;
    if (BigInt(value) > max) {
      state.error("must fit in an unsigned 32-bit integer");
      return;
    }
    result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
  }
}

function uint64(fn = () => {}, metadata) {
  return (state, value) => {
    if (!uint64Regex.test(value)) {
      state.error(`must be an uint64 (must match ${uint64Regex})`);
      return;
    }

    const max = 2n ** 64n - 1n;
    if (BigInt(value) > max) {
      state.error("must fit in an unsigned 64-bit integer");
      return;
    }
    result = (metadata === undefined) ? fn(state, Number(value)) : fn(state, Number(value), metadata);
  }
}

function int32(fn = () => {}, metadata) {
  return (state, value) => {
    if (!int64Regex.test(value)) {
      state.error(`must be an int32 (must match ${int64Regex})`);
      return;
    }

    const max = 2n ** (32n - 1n) - 1n;
    const min = (-2n) ** (32n - 1n);
    if (BigInt(value) < min || BigInt(value) > max) {
      state.error("must fit in a signed 32-bit integer");
      return;
    }
    result = (metadata === undefined) ? fn(state, value) : fn(state, value, metadata);
  }
}

function int64(fn = () => {}, metadata) {
  return (state, value) => {
    if (!int64Regex.test(value)) {
      state.error(`must be an int64 (must match ${int64Regex})`);
      return;
    }

    const max = 2n ** (64n - 1n) - 1n;
    const min = (-2n) ** (64n - 1n);
    if (BigInt(value) < min || BigInt(value) > max) {
      state.error("must fit in a signed 64-bit integer");
      return;
    }
    result = (metadata === undefined) ? fn(state, Number(value)) : fn(state, Number(value), metadata);
  }
}

function isUInt32(value, state, fieldId) {
  fieldId = (fieldId === undefined) ? "" : addQuotes(fieldId, "'");
  value = (getDataType(value) === "number") ? String(value) : value;
  if (!uint64Regex.test(value)) {
    state.error(fieldId + `must be an uint32 (must match ${uint64Regex})`);
    return false;
  }

  const max = 2n ** 32n - 1n;
  if (BigInt(value) > max) {
    state.error(fieldId + "must fit in an unsigned 32-bit integer");
    return false;
  }
  return true;
}

function isUInt64(value, state, fieldId) {
  fieldId = (fieldId === undefined) ? "" : addQuotes(fieldId, "'");
  value = (getDataType(value) === "number") ? String(value) : value;
  if (!uint64Regex.test(value)) {
    state.error(fieldId + `must be an uint64 (must match ${uint64Regex})`);
    return false;
  }

  const max = 2n ** 64n - 1n;
  if (BigInt(value) > max) {
    state.error(fieldId + "must fit in an unsigned 64-bit integer");
    return false;
  }
  return true;
}

function isInt32(value, state, fieldId) {
  fieldId = (fieldId === undefined) ? "" : addQuotes(fieldId, "'");
  value = (getDataType(value) === "number") ? String(value) : value;
  if (!int64Regex.test(value)) {
    state.error(fieldId + `must be an int32 (must match ${int64Regex})`);
    return false;
  }

  const max = 2n ** (32n - 1n) - 1n;
  const min = (-2n) ** (32n - 1n);
  if (BigInt(value) < min || BigInt(value) > max) {
    state.error(fieldId + "must fit in a signed 32-bit integer");
    return false;
  }
  return true;
}

function isInt64(value, state, fieldId) {
  fieldId = (fieldId === undefined) ? "" : addQuotes(fieldId, "'");
  value = (getDataType(value) === "number") ? String(value) : value;
  if (!int64Regex.test(value)) {
    state.error(fieldId + `must be an int64 (must match ${int64Regex})`);
    return false;
  }

  const max = 2n ** (64n - 1n) - 1n;
  const min = (-2n) ** (64n - 1n);
  if (BigInt(value) < min || BigInt(value) > max) {
    state.error(fieldId + "must fit in a signed 64-bit integer");
    return false;
  }
  return true;
}

function addQuotes(str, char) {
  if (str === "") {
    return str;
  }
  str = str.trim();
  if (!str.startsWith(char)) {
    str = char + str;
  }
  if (!str.endsWith(char)) {
    str = str + char;
  }
  return str + " ";
}

function isValidURL(value, state) {
    try {
      return new URL(value);
    } catch (err) {
      state.error("invalid URL format");
    }
}

function isValidSourceFilterData(state, value, metadata) {
  metadata.flags["can_include_lookback_window"] = false;
  metadata.flags["should_check_filter_size"] = true;
  if ("source_type" in value) {
    state.error("filter: source_type is not allowed");
    return;
  }
  isValidFilterData(state, value, metadata);
  if (state.errors.length === 0) {
    metadata.expected_value["filter_data"] = JSON.stringify(value);
  }
}

function isValidFilterDataParent(state, value, metadata, fieldId) {
  fieldId = (fieldId === undefined) ? "" : addQuotes(fieldId, "'");
  if (value.length > metadata.flags["max_filter_maps_per_filter_set"]) {
    state.error(fieldId + "array length exceeds the max filter maps per filter set limit");
    return;
  }
  for (let i = 0; i < value.length; i++) {
    isValidFilterData(state, value[i], metadata, fieldId);
    if (state.errors.length > 0) {
      return;
    }
  }
}

function isValidFilterData(state, value, metadata, fieldId) {
  fieldId = (fieldId === undefined) ? "" : addQuotes(fieldId, "'");
  if (Object.keys(value).length > metadata.flags["max_attribution_filters"]) {
    state.error(fieldId + "exceeded max attribution filters");
    return;
  }
  for (key in value) {
    keyString = addQuotes(key, "'");
    if (metadata.flags["should_check_filter_size"]) {
      let keyByteSize = new Blob([key]).size;
      if (keyByteSize > metadata.flags["max_bytes_per_attribution_filter_string"]) {
        state.error(keyString + "exceeded max bytes per attribution filter string");
        return;
      }
    }
    if (key === "_lookback_window" && metadata.flags["feature-lookback-window-filter"]) {
      if (!metadata.flags["can_include_lookback_window"]) {
        state.error(fieldId + "filter: _lookback_window is not allowed");
        return;
      }
      if(!isInt64(value[key], state, key)) {
        return;
      }
      if(Number(value[key]) < 0) {
        state.error("lookback_window must be a positive number");
        return;
      }
      value[key] = value[key];
      continue;
    }
    if (key.startsWith("_")) {
      state.error(keyString + "filter can not start with underscore");
      return;
    }

    filterValues = value[key];
    if (getDataType(filterValues) !== "array") {
      state.error(keyString + "filter value must be an array");
      return;
    }
    if(filterValues.length > metadata.flags["max_values_per_attribution_filter"]) {
      state.error(keyString + "exceeded max values per attribution filter");
      return;
    }
    for (let i = 0; i < filterValues.length; i++) {
      let filterValue = filterValues[i];
      if (getDataType(filterValue) !== "string") {
        state.error(keyString + "filter values must be strings");
        return;
      }
      let valueByteSize = new Blob([filterValue]).size;
      if (valueByteSize > metadata.flags["max_bytes_per_attribution_filter_string"]) {
        state.error(addQuotes(filterValue, "'") + "exceeded max bytes per attribution filter value string");
        return;
      }
    }
  }
}

function isValidAttributionConfigFilterData(state, value, metadata) {
  for (key in value) {
    let keyString = addQuotes(key, "'");
    if (key === "_lookback_window" && metadata.flags["feature-lookback-window-filter"]) {
      if (getDataType(value[key]) === "null") {
        state.error(keyString + "must be a string or able to cast to string");
        return;
      }
      if(!isInt64(String(value[key]), state, key)) {
        return;
      }
      value[key] = Number(value[key]);
    } else {
      if (getDataType(value[key]) !== "array") {
        state.error(keyString + "filter value must be an array");
        return;
      }
      let filterValues = value[key];
      for (let i = 0; i < filterValues.length; i++) {
        let filterValue = filterValues[i];
        if (getDataType(filterValue) === "null") {
          state.error(keyString + "filter values must be string or able to cast to string");
          return;
        }
        filterValues[i] = String(filterValue);
      }
      value[key] = filterValues;
    }
  }
}

function isValidWebDestinationHost(state, value, metadata) {
  for (element in value) {
    if (getDataType(element) !== "string") {
      state.error("must be a string or an array of strings");
      return;
    }
  }

  if (value.length > metadata.flags["max_distinct_web_destinations_in_source_registration"]) {
    state.error("exceeded max distinct web destinations");
    return;
  }
  if (value.length === 0) {
    state.error("no web destinations present");
    return;
  }

  let webDestinationsArr = [];
  for (let i = 0; i < value.length; i++) {
    let url = isValidURL(value[i], state);
    if (state.errors.length > 0) {
      return;
    }

    if (!url.protocol) {
      state.error("URL is missing scheme/protocol");
      return;
    }
    if (!url.hostname) {
      state.error("URL is missing hostname/domain");
      return;
    }

    let formattedURL = "";
    if (url.protocol === "https:" && (url.hostname === "127.0.0.1" || url.hostname === "localhost")) {
      formattedURL = url.protocol + "//" + url.hostname;
      isValidURL(formattedURL, state);
      if (state.errors.length > 0) {
        return;
      }
    } else {
      // Standardize dot characters and remove trailing dot if present.
      let formattedHostName = url.hostname.toLowerCase().replace(".\u3002\uFF0E\uFF61",".");
      if (formattedHostName.charAt(formattedHostName.length - 1) === ".") {
        formattedHostName = formattedHostName.substring(0, formattedHostName.length - 1);
      }

      if (formattedHostName.length >  metadata.flags["max_web_destination_hostname_character_length"]) {
        state.error("URL hostname/domain exceeds max character length");
        return;
      }

      let hostNameParts = formattedHostName.split(".");
      if (hostNameParts.length > metadata.flags["max_web_destination_hostname_parts"]) {
        state.error("exceeded the max number of URL hostname parts");
        return;
      }

      for (let j = 0; j < hostNameParts.length; j++) {
        let hostNamePart = hostNameParts[j];
        if (hostNamePart.length < metadata.flags["min_web_destination_hostname_part_character_length"] || hostNamePart.length > metadata.flags["max_web_destination_hostname_part_character_length"]) {
          state.error("URL hostname part character length must be in the range of 1-63");
          return;
        }
        if (!hostNamePart.match(alphaNumericRegex)) {
          state.error("URL hostname part character length must alphanumeric, hyphen, or underscore");
          return;
        }

        invalidCharacters = "-_";
        if (invalidCharacters.includes(hostNamePart.charAt(0)) || invalidCharacters.includes(hostNamePart.charAt(hostNamePart.length - 1))) {
          state.error("invalid URL hostname part starting/ending character (hypen/underscore)");
          return;
        }

        if (j === (hostNameParts.length - 1) && hostNamePart.charAt(0).match(uint64Regex)) {
          state.error("last hostname part can not start with a number");
          return;
        }
      }
      formattedURL = url.protocol + "//" + formattedHostName;
      isValidURL(formattedURL, state);
      if (state.errors.length > 0) {
        return;
      }
    }
    webDestinationsArr.push(formattedURL);
  }
  metadata.expected_value["web_destination"] = [...new Set(webDestinationsArr)];
}

function isValidAggregationKeys(state, value, metadata) {
  if (Object.keys(value).length > metadata.flags["max_aggregate_keys_per_source_registration"]) {
    state.error("exceeded max number of aggregation keys per source registration");
    return;
  }

  for (aggregateKey in value) {
    isValidAggregateKeyId(state, aggregateKey, metadata);
    if (state.errors.length > 0) {
      return;
    }

    let aggregateValue = value[aggregateKey];
    if (getDataType(aggregateValue) !== "string" && getDataType(aggregateValue) !== "null") {
      aggregateValue = String(aggregateValue);
    }
    isValidAggregateKeyPiece(state, aggregateValue, metadata);
    if (state.errors.length > 0) {
      return;
    }
  }
  metadata.expected_value["aggregation_keys"] = JSON.stringify(value);
}

function isValidAggregateKeyId(state, value, metadata, fieldId) {
  fieldId = (fieldId === undefined) ? "" : addQuotes(fieldId, "'");
  if (value === null || value === "") {
    state.error(fieldId + "null or empty aggregate key string");
    return;
  }

  let keyByteSize = new Blob([value]).size;
  if (keyByteSize > metadata.flags["max_bytes_per_attribution_aggregate_key_id"]) {
    state.error(fieldId + "exceeded max bytes per attribution aggregate key id string");
    return;
  }
}

function isValidAggregateKeyPiece(state, value, metadata) {
  if (value === null || value === "") {
    state.error("key piece value must not be null or empty string");
    return;
  }

  if (!value.startsWith("0x") && !value.startsWith("0X")) {
    state.error("key piece value must start with '0x' or '0X'");
    return;
  }

  let valueByteSize = new Blob([value]).size;
  if (valueByteSize < metadata.flags["min_bytes_per_aggregate_value"] || valueByteSize > metadata.flags["max_bytes_per_aggregate_value"]) {
    state.error("key piece value string size must be in the byte range (3 bytes - 34 bytes)");
    return;
  }

  if(!value.substring(2).match(hexadecimalRegex)) {
    state.error("key piece values must be hexadecimal");
    return;
  }
}

function isValidTriggerMatchingData(state, value, metadata) {
  if(value.toLowerCase() !== "modulus" && value.toLowerCase() !== "exact") {
    state.error("value must be 'exact' or 'modulus' (case-insensitive)");
    return;
  }
  metadata.expected_value["trigger_data_matching"] = value.toUpperCase();
}

function isValidMaxEventStates(state, value, metadata) {
  if (value <= 0) {
    state.error("must be greater than 0");
  }

  if (value > metadata.flags["max_report_states_per_source_registration"]) {
    state.error("exceeds max report states per source registration");
  }
  metadata.expected_value["max_event_states"] = value;
}

function isValidAttributionScopeLimit(state, value, metadata) {
  if (value <= 0) {
    state.error("must be greater than 0");
  }
  metadata.flags["attribution_scope_limit_value"] = value;
  metadata.expected_value["attribution_scope_limit"] = value;
}

function isValidAttributionScopes(state, value, metadata) {
  if (metadata.header_options.header_type === "source") {
    if (!metadata.flags["attribution_scope_limit_present"] && value.length > 0) {
      state.error("attribution scopes array must be empty if attribution scope limit is not present");
      return;
    }

    if (!metadata.flags["attribution_scope_limit_present"] && metadata.flags["max_event_states_present"]) {
      state.error("max event states must not be present if attribution scope limit is not present");
      return;
    }

    if (metadata.flags["attribution_scope_limit_present"] && value.length > metadata.flags["attribution_scope_limit_value"]) {
      state.error("attribution scopes array size exceeds the provided attribution_scope_limit");
      return;
    }
  }

  for (let i = 0; i < value.length; i++) {
    if (getDataType(value[i]) !== "string") {
      state.error("must be an array of strings");
      return;
    }
  }

  if (value.length > metadata.flags["max_32_bit_integer"]) {
    state.error("exceeded max number of scopes per source");
    return;
  }

  for (let i = 0; i < value.length; i++) {
    let scope = value[i];
    if (scope.length > metadata.flags["max_32_bit_integer"]) {
      state.error("exceeded max scope string length");
      return;
    }
  }
  metadata.expected_value["attribution_scopes"] = (metadata.header_options.header_type === "trigger") ? JSON.stringify(value) : value;
}

function isValidAppDestinationHost(state, value, metadata) {
  let url = isValidURL(value, state);
  if (state.errors.length > 0) {
    return;
  }
  if (url.protocol !== "android-app:") {
      state.error("app URL host/scheme is invalid");
  }
  metadata.expected_value["destination"] = [value];
}

function isValidXNetworkKeyMapping(state, value, metadata) {
  for (key in value) {
    xNetworkValue = value[key];

    if (xNetworkValue === null) {
      state.error("all values must be non-null");
      return;
    }

    if (getDataType(xNetworkValue) !== "string") {
      state.error("all values must be strings");
      return;
    }
    
    if (!xNetworkValue.startsWith("0x")) {
      state.error("all values must start with 0x");
      return;
    }
  }
  metadata.expected_value["x_network_key_mapping"] = JSON.stringify(value);
}

function isValidAggregationCoordinatorOrigin(state, value, metadata) {
  if (value === "") {
    state.error("value must be non-empty");
    return;
  }
  isValidURL(value, state);
  if (state.errors.length > 0) {
    return;
  }
  metadata.expected_value["aggregation_coordinator_origin"] = value;
}

function isValidAggregatableSourceRegistrationTime(state, value, metadata) {
  if ((value.toUpperCase() !== "INCLUDE") && (value.toUpperCase() !== "EXCLUDE")) {
    state.error("must equal 'INCLUDE' or 'EXCLUDE' (case-insensitive)");
    return;
  }
  metadata.flags["aggregatable_source_registration_time_value"] = value.toUpperCase();
  metadata.expected_value["aggregatable_source_registration_time"] = value.toUpperCase();
}

function isValidTriggerContextId(state, value, metadata) {
  if (metadata.flags["aggregatable_source_registration_time_value"] === "INCLUDE") {
    state.error("aggregatable_source_registration_time must not have the value 'INCLUDE'");
    return;
  }

  if (value.length > metadata.flags["max_trigger_context_id_string_length"]) {
    state.error("max string length exceeded");
    return;
  }
  metadata.expected_value["trigger_context_id"] = value;
}

function isValidEventTriggerData(state, value, metadata) {
  metadata.flags["can_include_lookback_window"] = true;
  metadata.flags["should_check_filter_size"] = !metadata.flags["feature-enable-update-trigger-header-limit"];
  for (let i = 0; i < value.length; i++) {
    if (getDataType(value[i]) !== "object") {
      state.error("must be an array of object(s)");
      return;
    }
  }
  let eventTriggerDataArr = [];
  for (let i = 0; i < value.length; i++) {
    let obj = value[i];
    let eventTriggerData = {"trigger_data": 0};
    for (objKey in obj) {
      if (objKey === "trigger_data" && obj[objKey] !== null) {
        if (getDataType(obj[objKey]) !== "string") {
          state.error("'trigger_data' must be a string");
          return;
        }
        if (!isUInt64(obj[objKey], state, objKey)) {
          return;
        }
        eventTriggerData[objKey] = Number(obj[objKey]);
      }
      if (objKey === "priority" && obj[objKey] !== null) {
        if (getDataType(obj[objKey]) !== "string") {
          state.error("'priority' must be a string");
          return;
        }
        if (!isInt64(obj[objKey], state, objKey)) {
          return;
        }
        eventTriggerData[objKey] = Number(obj[objKey]);
      }
      if (objKey === "value" && obj[objKey] !== null) {
        if (getDataType(obj[objKey]) !== "number") {
          state.error("'value' must be a number");
          return;
        }
        if (!isInt64(obj[objKey], state, objKey)) {
          return;
        }
        if (obj[objKey] < 1) {
          state.error("'value' must be greater than 0");
          return;
        }
        if (obj[objKey] > metadata.flags["max_bucket_threshold"]) {
          state.error("'value' exceeds max threshold of " + metadata.flags["max_bucket_threshold"]);
          return;
        }
        eventTriggerData[objKey] = obj[objKey];
      }
      if (objKey === "deduplication_key" && obj[objKey] !== null) {
        if (getDataType(obj[objKey]) !== "string") {
          state.error("'deduplication_key' must be a string");
          return;
        }
        if (!isUInt64(obj[objKey], state, objKey)) {
          return;
        }
        eventTriggerData[objKey] = Number(obj[objKey]);
      }
      if ((objKey === "filters" || objKey === "not_filters") && obj[objKey] !== null) {
        let arr = maybeWrapFilters(obj[objKey], state, objKey);
        if (state.errors.length > 0) {
          return;
        }
        isValidFilterDataParent(state, arr, metadata, objKey);
        if (state.errors.length > 0) {
          return;
        }
        eventTriggerData[objKey] = arr;
      }
    }
    eventTriggerDataArr.push(eventTriggerData);
  }
  metadata.expected_value["event_trigger_data"] = JSON.stringify(eventTriggerDataArr);
}

function isValidAggregatableTriggerData(state, value, metadata) {
  metadata.flags["can_include_lookback_window"] = true;
  metadata.flags["should_check_filter_size"] = !metadata.flags["feature-enable-update-trigger-header-limit"];
  for (let i = 0; i < value.length; i++) {
    if (getDataType(value[i]) !== "object") {
      state.error("must be an array of object(s)");
      return;
    }
  }

  for (let i = 0; i < value.length; i++) {
    if (!("key_piece" in value[i])) {
      state.error("'key_piece' must be present in each element/object of the array");
      return;
    }
    for (objKey in value[i]) {
      if (objKey === "key_piece") {
        isValidAggregateKeyPiece(state, value[i][objKey], metadata);
        if (state.errors.length > 0) {
          return;
        }
      }
      if (objKey === "source_keys" && value[i][objKey] !== null) {
        if (getDataType(value[i][objKey]) !== "array") {
          state.error("'source_keys' must be an array");
          return;
        }
        if (metadata.flags["should_check_filter_size"]) {
          if (value[i][objKey].length > metadata.flags["max_aggregate_keys_per_trigger_registration"]) {
            state.error("'source_keys' array size exceeds max aggregate keys per trigger registration limit");
            return;
          }
        }
        for (let j = 0; j < value[i][objKey].length; j++) {
          if (getDataType(value[i][objKey][j]) !== "string") {
            state.error("each element in 'source_keys' must be a string");
            return;
          }
          isValidAggregateKeyId(state, value[i][objKey][j], metadata, objKey);
          if (state.errors.length > 0) {
            return;
          }
        }
      }
      if (!("source_keys" in value[i])) {
        value[i]["source_keys"] = [];
      }
      if ((objKey === "filters" || objKey === "not_filters") && value[i][objKey] !== null) {
        let arr = maybeWrapFilters(value[i][objKey], state, objKey);
        if (state.errors.length > 0) {
          return;
        }
        isValidFilterDataParent(state, arr, metadata, objKey);
        if (state.errors.length > 0) {
          return;
        }
        value[i][objKey] = arr;
      }
      if (objKey === "x_network_data" && value[i][objKey] !== null) {
        if (getDataType(value[i][objKey]) !== "object") {
          state.error("'x_network_data' must be an object");
          return;
        }
      }
    }
  }
  metadata.expected_value["aggregatable_trigger_data"] = JSON.stringify(value);
}

function isValidAggregatableValues(state, value, metadata) {
  metadata.flags["should_check_filter_size"] = !metadata.flags["feature-enable-update-trigger-header-limit"];
  if(metadata.flags["should_check_filter_size"]) {
    if (Object.keys(value).length > metadata.flags["max_aggregate_keys_per_trigger_registration"]) {
      state.error("exceeds max aggregate keys per trigger registration");
      return;
    }
  }
  for (aggregateKey in value) {
    isValidAggregateKeyId(state, aggregateKey, metadata);
    if (state.errors.length > 0) {
      return;
    }
    if (getDataType(value[aggregateKey]) !== "number") {
      state.error("aggregate key value must be a number");
      return;
    }
    if (!isInt32(value[aggregateKey], state)) {
      return;
    }
    if(value[aggregateKey] < 1) {
      state.error("aggregate key value must be greater than 0");
      return;
    }
    if(value[aggregateKey] > metadata.flags["max_sum_of_aggregate_values_per_source"]) {
      state.error("aggregate key value exceeds the max sum of aggregate values per source");
      return;
    }
  }
  metadata.expected_value["aggregatable_values"] = JSON.stringify(value);
}

function isValidTriggerFilters(state, value, metadata) {
  isValidFilters(state, value, metadata, "filters");
}

function isValidTriggerNotFilters(state, value, metadata) {
  isValidFilters(state, value, metadata, "not_filters");
}

function isValidFilters(state, value, metadata, fieldId) {
  metadata.flags["can_include_lookback_window"] = true;
  metadata.flags["should_check_filter_size"] = !metadata.flags["feature-enable-update-trigger-header-limit"];
  let arr = maybeWrapFilters(value, state);
  if (state.errors.length > 0) {
    return;
  }
  isValidFilterDataParent(state, arr, metadata);
  if (state.errors.length > 0) {
    return;
  }
  metadata.expected_value[fieldId] = JSON.stringify(arr);
}

function isValidAggregatableDeduplicationKey(state, value, metadata) {
  metadata.flags["can_include_lookback_window"] = true;
  metadata.flags["should_check_filter_size"] = !metadata.flags["feature-enable-update-trigger-header-limit"];
  if (value.length > metadata.flags["max_aggregate_deduplication_keys_per_registration"]) {
    state.error("exceeds max aggregate deduplication keys per registration limit");
    return;
  }
  for (let i = 0; i < value.length; i++) {
    if (getDataType(value[i]) !== "object") {
      state.error("must be an array of object(s)");
      return;
    }
  }
  let aggregatableDeduplicationKeyArr = [];
  for (let i = 0; i < value.length; i++) {
    let obj = value[i];
    let aggregatableDeduplicationKeyObj = {};
    for (objKey in obj) {
      if (objKey === "deduplication_key"  && obj[objKey] !== null) {
        if (getDataType(obj[objKey]) !== "string") {
          state.error(addQuotes(objKey, "'") + "must be a string");
          return;
        }
        if (!isUInt64(obj[objKey], state, objKey)) {
          return;
        }
        aggregatableDeduplicationKeyObj[objKey] = Number(obj[objKey]);
      }
      if ((objKey === "filters" || objKey === "not_filters") && obj[objKey] !== null) {
        let arr = maybeWrapFilters(obj[objKey], state, objKey);
        if (state.errors.length > 0) {
          return;
        }
        isValidFilterDataParent(state, arr, metadata, objKey);
        if (state.errors.length > 0) {
          return;
        }
        aggregatableDeduplicationKeyObj[objKey] = arr;
      }
    }
    aggregatableDeduplicationKeyArr.push(aggregatableDeduplicationKeyObj);
  }
  metadata.expected_value["aggregatable_deduplication_keys"] = JSON.stringify(aggregatableDeduplicationKeyArr);
}

function isValidAttributionConfig(state, value, metadata) {
  for (let i = 0; i < value.length; i++) {
    if (getDataType(value[i]) !== "object") {
      state.error("must be an array of object(s)");
      return;
    }
  }

  let minExpiry = metadata.flags["min_reporting_register_source_expiration_in_seconds"];
  let maxExpiry = metadata.flags["max_reporting_register_source_expiration_in_seconds"];
  let attributionConfigArr = [];
  for (let i = 0; i < value.length; i++) {
    let obj = value[i];
    let attributionConfigObj = {};
    if (!("source_network" in obj) || obj["source_network"] === null) {
      state.error("'source_network' must be present and non-null in each element/object of the array");
      return;
    }
    for (objKey in obj) {
      if (objKey === "source_network") {
        if (getDataType(obj[objKey]) === "null") {
          state.error(addQuotes(objKey, "'") + "must be a string or able to cast to string");
          return;
        }
        attributionConfigObj[objKey] = String(obj[objKey]);
      }
      if (objKey === "source_priority_range" && obj[objKey] !== null) {
        if (getDataType(obj[objKey]) !== "object") {
          state.error(addQuotes(objKey, "'") + "must be an object");
          return;
        }
        if (!("start" in obj[objKey]) || !("end" in obj[objKey])) {
          state.error(addQuotes(objKey, "'") + "both keys ('start','end') must be present");
          return;
        }
        if (obj[objKey]["start"] === null || obj[objKey]["end"] === null) {
          state.error(addQuotes(objKey, "'") + "both key values (start, end) must be string or able to cast to string");
          return;
        }
        if (!isInt64(obj[objKey]["start"], state, "start") || !isInt64(obj[objKey]["end"], state, "end")) {
          return;
        }
        attributionConfigObj[objKey] = {"start": Number(obj[objKey]["start"]), "end": Number(obj[objKey]["end"])};
      }
      if ((objKey === "source_filters" || objKey === "source_not_filters" || objKey === "filter_data") && obj[objKey] !== null) {
        let arr = maybeWrapFilters(obj[objKey], state, objKey);
        if (state.errors.length > 0) {
          return;
        }
        for (let i = 0; i < arr.length; i++) {
          isValidAttributionConfigFilterData(state, arr[i], metadata);
          if (state.errors.length > 0) {
            return;
          }
        }
        attributionConfigObj[objKey] = arr;
      }
      if ((objKey === "source_expiry_override" || objKey === "expiry") && obj[objKey] !== null) {
        if (!isInt64(obj[objKey], state, objKey)) {
          return;
        }

        let expiryValue = Number(obj[objKey]);
        if (expiryValue < minExpiry) {
          expiryValue = minExpiry;
        } else if (expiryValue > maxExpiry) {
          expiryValue = maxExpiry;
        }
        attributionConfigObj[objKey] = expiryValue;
      }
      if ((objKey === "priority" || objKey === "post_install_exclusivity_window") && obj[objKey] !== null) {
        if (!isInt64(obj[objKey], state, objKey)) {
          return;
        }
        attributionConfigObj[objKey] = Number(obj[objKey]);
      }
    }
    attributionConfigArr.push(attributionConfigObj);
  }
  metadata.expected_value["attribution_config"] = JSON.stringify(attributionConfigArr);
}

function isValidExpiry(state, value, metadata) {
  let minExpiry = metadata.flags["min_reporting_register_source_expiration_in_seconds"];
  let maxExpiry = metadata.flags["max_reporting_register_source_expiration_in_seconds"];
  if (value < minExpiry) {
    value = minExpiry;
  } else if (value > maxExpiry) {
    value = maxExpiry;
  }
  if (metadata.header_options.source_type === "event") {
    // round to nearest day
    value = roundUp(value, minExpiry);
  }
  metadata.expected_value["expiry"] = value;
  metadata.expected_value["aggregatable_report_window"] = value * 1000; // sec -> millisec
}

function isValidEventReportWindow(state, value, metadata) {
  let minEventReportWindow = metadata.flags["minimum_event_report_window_in_seconds"];
  let maxEventReportWindow = metadata.flags["max_reporting_register_source_expiration_in_seconds"];
  if (value < minEventReportWindow) {
    value = minEventReportWindow;
  } else if (value > maxEventReportWindow) {
    value = maxEventReportWindow;
  }
  value = Math.min(metadata.expected_value["expiry"], value);
  metadata.expected_value["event_report_window"] = value * 1000; // sec -> millisec
  metadata.flags["effective_expiry"] = metadata.expected_value["event_report_window"];
}

function isValidAggregatableReportWindow(state, value, metadata) {
  let minAggregatableReportWindow = metadata.flags["minimum_aggregatable_report_window_in_seconds"];
  let maxAggregatableReportWindow = metadata.flags["max_reporting_register_source_expiration_in_seconds"];
  if (value < minAggregatableReportWindow) {
    value = minAggregatableReportWindow;
  } else if (value > maxAggregatableReportWindow) {
    value = maxAggregatableReportWindow;
  }
  value = Math.min(metadata.expected_value["expiry"], value);
  metadata.expected_value["aggregatable_report_window"] = value * 1000; // sec -> millisec
}

function isValidInstallAttributionWindow(state, value, metadata) {
  let minInstallAttributionWindow = metadata.flags["min_install_attribution_window"];
  let maxInstallAttributionWindow = metadata.flags["max_install_attribution_window"];
  if (value < minInstallAttributionWindow) {
    value = minInstallAttributionWindow;
  } else if (value > maxInstallAttributionWindow) {
    value = maxInstallAttributionWindow;
  }
  metadata.expected_value["install_attribution_window"] = value * 1000; // sec -> millisec
}

function isValidPostInstallExclusivityWindow(state, value, metadata) {
  let minPostInstallExclusivityWindow = metadata.flags["min_post_install_exclusivity_window"];
  let maxPostInstallExclusivityWindow = metadata.flags["max_post_install_exclusivity_window"];
  if (value < minPostInstallExclusivityWindow) {
    value = minPostInstallExclusivityWindow;
  } else if (value > maxPostInstallExclusivityWindow) {
    value = maxPostInstallExclusivityWindow;
  }
  metadata.expected_value["post_install_exclusivity_window"] = value * 1000; // sec -> millisec
}

function isValidReinstallReattributionWindow(state, value, metadata) {
  let minReinstallReattributionWindow = 0;
  let maxReinstallReattributionWindow = metadata.flags["max_reinstall_reattribution_window_seconds"];
  if (value < minReinstallReattributionWindow) {
    value = minReinstallReattributionWindow;
  } else if (value > maxReinstallReattributionWindow) {
    value = maxReinstallReattributionWindow;
  }
  metadata.expected_value["reinstall_reattribution_window"] = value * 1000; // sec -> millisec
}

function isValidDebugAdId(state, value, metadata) {
  metadata.expected_value["debug_ad_id"] = value;
}

function isValidDebugJoinKey(state, value, metadata) {
  metadata.expected_value["debug_join_key"] = value;
}

function isValidSourceEventId(state, value, metadata) {
  metadata.expected_value["source_event_id"] = value;
}

function isValidPriority(state, value, metadata) {
  metadata.expected_value["priority"] = value;
}

function isValidDebugKey(state, value, metadata) {
  metadata.expected_value["debug_key"] = value;
}

function isValidDebugReporting(state, value, metadata) {
  metadata.expected_value["debug_reporting"] = value;
}

function isValidCoarseEventReportDestinations(state, value, metadata) {
  metadata.expected_value["coarse_event_report_destinations"] = value;
}

function isValidSharedDebugKey(state, value, metadata) {
  metadata.expected_value["shared_debug_key"] = value;
}

function isValidSharedAggregationKeys(state, value, metadata) {
  metadata.expected_value["shared_aggregation_keys"] = JSON.stringify(value);
}

function isValidSharedFilterDataKeys(state, value, metadata) {
  metadata.expected_value["shared_filter_data_keys"] = JSON.stringify(value);
}

function isValidDropSourceIfInstalled(state, value, metadata) {
  metadata.expected_value["drop_source_if_installed"] = value;
}

function isValidLocation(state, value, metadata) {
  url = isValidURL(value, state);
  if (state.errors.length > 0) {
    return;
  }
  behavior = "AS_IS";
  if (metadata.expected_value["attribution-reporting-redirect-config"] !== null) {
    if (metadata.expected_value["attribution-reporting-redirect-config"].toLowerCase() === "redirect-302-to-well-known") {
      behavior = "LOCATION_TO_WELL_KNOWN";
      url = formatWellKnownURL(value);
    }
  }
  metadata.expected_value["location"] = [{
    uri: url.toString(),
    redirect_behavior: behavior
  }];
}

function isValidAttributionReportingRedirect(state, value, metadata) {
  if (value.length > metadata.flags["max_registration_redirects"]) {
    state.warning("max allowed reporting redirects: " + metadata.flags["max_registration_redirects"] + ", all other reporting redirects will be ignored");
  }

  let arr = [];
  for (let i = 0; i < Math.min(value.length, metadata.flags["max_registration_redirects"]); i++) {
    if (getDataType(value[i]) !== "string") {
      state.error("must be an array of strings");
      return;
    }
    url = isValidURL(value[i], state);
    if (state.errors.length > 0) {
      return;
    }
    arr.push({
      uri: value[i],
      redirect_behavior: "AS_IS"
    });
  }
  metadata.expected_value["attribution-reporting-redirect"] = arr;
}

function isValidAttributionReportingRedirectConfig(state, value, metadata) {
  metadata.expected_value["attribution-reporting-redirect-config"] = value;
}

function maybeWrapFilters(value, state, fieldId) {
  fieldId = (fieldId === undefined) ? "" : addQuotes(fieldId, "'");
  if (getDataType(value) !== "array" && getDataType(value) !== "object") {
    state.error(fieldId + "must be an object or an array");
    return;
  }
  if (getDataType(value) === "array") {
    for (let i = 0; i < value.length; i++) {
      if (getDataType(value[i]) !== "object") {
        state.error(fieldId + "must be an array of object(s)");
        return;
      }
    }
  }
  let arr = (getDataType(value) === "object") ? [value] : value;
  return arr;
}

function formatKeys(json) {
  newJSON = {};
  for (key in json) {
    newJSON[key.toLowerCase()] = json[key];
  }
  return newJSON;
}

function roundUp(input, base) {
  remainder = input % base;
  shouldRoundUp = (remainder >= (base / 2.0)) || (input == remainder);
return input - remainder + (shouldRoundUp ? base : 0);
}

function formatWellKnownURL(url) {
  wellKnownPathSegment = ".well-known/attribution-reporting/register-redirect";
  wellKnownQueryParam = "302_url";
  return url + "/" + wellKnownPathSegment + "?" + wellKnownQueryParam + "=" + encodeURIComponent(url);
}

module.exports = {
  State,
  boolean,
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
  getDataType,
  formatKeys,
  isValidAppDestinationHost,
  isValidWebDestinationHost,
  isValidSourceFilterData,
  isValidTriggerMatchingData,
  isValidAggregationKeys,
  isValidAttributionScopes,
  isValidAttributionScopeLimit,
  isValidMaxEventStates,
  isValidXNetworkKeyMapping,
  isValidAggregationCoordinatorOrigin,
  isValidAggregatableSourceRegistrationTime,
  isValidTriggerContextId,
  isValidEventTriggerData,
  isValidAggregatableTriggerData,
  isValidAggregatableValues,
  isValidTriggerFilters,
  isValidTriggerNotFilters,
  isValidAggregatableDeduplicationKey,
  isValidAttributionConfig,
  isValidExpiry,
  isValidEventReportWindow,
  isValidAggregatableReportWindow,
  isValidLocation,
  isValidAttributionReportingRedirect,
  isValidAttributionReportingRedirectConfig,
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
};
