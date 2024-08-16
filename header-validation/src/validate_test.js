const test = require('node:test');
const assert = require('assert');
const {validateSource} = require('./validate_source');
const {validateTrigger} = require('./validate_trigger');
const {validateRedirect} = require('./validate_redirect');
const {sourceTestCases} = require('./source_tests');
const {triggerTestCases} = require('./trigger_tests');
const {redirectTestCases} = require('./redirect_tests');

test('Source Header Validation Tests', async (t) => {
    for (testCase of sourceTestCases) {
        await t.test(testCase.name, (t) => {
            // Setup
            json = testCase.json;
            let metadata = {
              flags: testCase.flags,
              header_options: {
                header_type: "source",
                source_type: testCase?.source_type
              },
              expected_value: null
            };

            // Test
            output = validateSource(json, metadata);
            result = output.result;
            expected = output.expected_value;

            // Assert
            isValid = (result.errors.length === 0);
            assert.equal(/* actual */ isValid, /* expected */ testCase.result.valid);
            assert.deepEqual(/* actual */ result.warnings.map(warning => warning.formattedWarning), /* expected */ testCase.result.warnings);
            assert.deepEqual(/* actual */ result.errors.map(error => error.formattedError), /* expected */ testCase.result.errors);
            if (testCase?.expected_value !== undefined) {
              assert.deepEqual(/* actual */ expected, /* expected */ testCase.expected_value);
            }
        })
    }
})

test('Trigger Header Validation Tests', async (t) => {
    for (testCase of triggerTestCases) {
        await t.test(testCase.name, (t) => {
            // Setup
            json = testCase.json;
            let metadata = {
              flags: testCase.flags,
              header_options: {
                header_type: "trigger",
                source_type: null
              },
              expected_value: null
            };

            // Test
            output = validateTrigger(json, metadata);
            result = output.result;
            expected = output.expected_value;

            // Assert
            isValid = (result.errors.length === 0);
            assert.equal(/* actual */ isValid, /* expected */ testCase.result.valid);
            assert.deepEqual(/* actual */ result.warnings.map(warning => warning.formattedWarning), /* expected */ testCase.result.warnings);
            assert.deepEqual(/* actual */ result.errors.map(error => error.formattedError), /* expected */ testCase.result.errors);
            if (testCase?.expected_value !== undefined) {
              assert.deepEqual(/* actual */ expected, /* expected */ testCase.expected_value);
            }
        })
    }
})

test('Redirect Headers Validation Tests', async (t) => {
    for (testCase of redirectTestCases) {
        await t.test(testCase.name, (t) => {
            // Setup
            json = testCase.json;
            let metadata = {
              flags: testCase.flags,
              header_options: {
                header_type: "redirect",
                source_type: null
              },
              expected_value: null
            };

            // Test
            output = validateRedirect(json, metadata);
            result = output.result;
            expected = output.expected_value;
            

            // Assert
            isValid = (result.errors.length === 0);
            assert.equal(/* actual */ isValid, /* expected */ testCase.result.valid);
            assert.deepEqual(/* actual */ result.warnings.map(warning => warning.formattedWarning), /* expected */ testCase.result.warnings);
            assert.deepEqual(/* actual */ result.errors.map(error => error.formattedError), /* expected */ testCase.result.errors);
            if (testCase?.expected_value !== undefined) {
              assert.deepEqual(/* actual */ expected, /* expected */ testCase.expected_value);
            }
        })
    }
})