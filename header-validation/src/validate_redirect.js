const {
  State,
  optional,
  string,
  array,
  isValidLocation,
  isValidAttributionReportingRedirect,
  isValidAttributionReportingRedirectConfig,
  formatKeys,
} = require('./base');

function initializeExpectedValues() {
  let expectedValues = {
    "location": null,
    "attribution-reporting-redirect": null,
    "attribution-reporting-redirect-config": null
  };
  return expectedValues;
}

function validateRedirect(redirect, metadata) {
  try {
    redirectJSON = JSON.parse(redirect);
    redirectJSON = formatKeys(redirectJSON);
  } catch (err) {
    return {
      result: {errors: [err instanceof Error ? err.toString() : 'unknown error'], warnings: []},
      expected_value: {}
    };
  }

  const state = new State();
  let jsonSpec = {};

  metadata.expected_value = initializeExpectedValues(redirectJSON);
  jsonSpec["attribution-reporting-redirect-config"] = optional(string(isValidAttributionReportingRedirectConfig, metadata));
  jsonSpec["attribution-reporting-redirect"] = optional(array(isValidAttributionReportingRedirect, metadata));
  jsonSpec["location"] = optional(string(isValidLocation, metadata));

  state.validate(redirectJSON, jsonSpec);
  return {
    result: state.result(),
    expected_value: metadata.expected_value
  };
}

module.exports = {
  validateRedirect
};