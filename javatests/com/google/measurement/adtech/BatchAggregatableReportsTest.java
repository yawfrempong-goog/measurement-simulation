/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.measurement.adtech;

import java.util.Arrays;
import org.apache.beam.sdk.testing.PAssert;
import org.apache.beam.sdk.testing.TestPipeline;
import org.apache.beam.sdk.transforms.Count;
import org.apache.beam.sdk.transforms.Create;
import org.apache.beam.sdk.transforms.Flatten;
import org.apache.beam.sdk.transforms.Keys;
import org.apache.beam.sdk.transforms.Values;
import org.apache.beam.sdk.values.KV;
import org.apache.beam.sdk.values.PCollection;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.Rule;
import org.junit.Test;

public class BatchAggregatableReportsTest {
  @Rule public final transient TestPipeline p = TestPipeline.create();

  @Test
  public void generateBatches_singleBatch() {
    JSONObject aggregatableReport1 = createTestAggregatableReport(1642333584970L);
    JSONObject aggregatableReport2 = createTestAggregatableReport(1642333584970L);

    PCollection<JSONObject> aggregatablePayloads =
        p.apply(Create.of(Arrays.asList(aggregatableReport1, aggregatableReport2)));
    PCollection<KV<String, Iterable<JSONObject>>> batches =
        BatchAggregatableReports.generateBatches(aggregatablePayloads);

    KV<String, Iterable<JSONObject>> expectedBatches =
        KV.of(
            "https://www.example2.com/d2_1642291200000",
            Arrays.asList(aggregatableReport1, aggregatableReport2));
    PAssert.that(batches).containsInAnyOrder(expectedBatches);
    p.run().waitUntilFinish();
  }

  @Test
  public void generateBatches_multipleBatches() {
    JSONObject aggregatableReport1 = createTestAggregatableReport(1642333584970L);
    JSONObject aggregatableReport2 = createTestAggregatableReport(1642533584970L);

    PCollection<JSONObject> aggregatablePayloads =
        p.apply(Create.of(Arrays.asList(aggregatableReport1, aggregatableReport2)));
    PCollection<KV<String, Iterable<JSONObject>>> batches =
        BatchAggregatableReports.generateBatches(aggregatablePayloads);

    KV<String, Iterable<JSONObject>> expectedBatch1 =
        KV.of("https://www.example2.com/d2_1642291200000", Arrays.asList(aggregatableReport1));
    KV<String, Iterable<JSONObject>> expectedBatch2 =
        KV.of("https://www.example2.com/d2_1642464000000", Arrays.asList(aggregatableReport2));
    PAssert.that(batches).containsInAnyOrder(expectedBatch1, expectedBatch2);
    p.run().waitUntilFinish();
  }

  @Test
  public void generateBatches_multipleReports_singleBatch() {
    JSONObject aggregatableReport1 = createTestAggregatableReport(1642333584970L);
    JSONObject aggregatableReport2 = createTestAggregatableReport(1642333584971L);

    PCollection<JSONObject> aggregatablePayloads =
        p.apply(Create.of(Arrays.asList(aggregatableReport1, aggregatableReport2)));
    PCollection<KV<String, Iterable<JSONObject>>> batches =
        BatchAggregatableReports.generateBatches(aggregatablePayloads);

    String key = "https://www.example2.com/d2_1642291200000";

    KV<String, Iterable<JSONObject>> expectedBatch1 =
        KV.of(key, Arrays.asList(aggregatableReport1, aggregatableReport2));

    assertBatch(batches, 1, expectedBatch1);
    p.run().waitUntilFinish();
  }

  private void assertBatch(
      PCollection<KV<String, Iterable<JSONObject>>> batches,
      long expectedNumElements,
      KV<String, Iterable<JSONObject>> expected) {
    PAssert.thatSingleton(batches.apply(Count.globally())).isEqualTo(expectedNumElements);
    PCollection<String> actualKey = batches.apply(Keys.create());
    // Flatten the batch so that when we call containsInAnyOrder it compares individual JSONObjects
    // instead of Lists of JSONObjects. Otherwise, the comparison happens across Lists, which Beam
    // doesn't guarantee the order of, so we get flaky tests.
    PCollection<JSONObject> actualValues =
        batches.apply(Values.create()).apply(Flatten.iterables());

    PAssert.thatSingleton(actualKey).isEqualTo(expected.getKey());
    PAssert.that(actualValues).containsInAnyOrder(expected.getValue());
  }

  private JSONObject createTestAggregatableReport(long scheduled_report_time) {
    JSONObject aggregatableReport = new JSONObject();
    JSONObject sharedInfo = new JSONObject();
    sharedInfo.put("api", "attribution-reporting");
    sharedInfo.put("attribution_destination", "https://www.example2.com/d2");
    sharedInfo.put("report_id", null);
    sharedInfo.put("reporting_origin", "https://www.example3.com/r1");
    sharedInfo.put("scheduled_report_time", scheduled_report_time);
    sharedInfo.put("source_registration_time", 1642322002000L);
    sharedInfo.put("version", "v1.0");
    aggregatableReport.put("shared_info", sharedInfo.toString());

    JSONArray payloads = new JSONArray();
    JSONObject payload = new JSONObject();
    payload.put("debug_cleartext_payload", "[B@29080a30]");
    payloads.add(payload);

    aggregatableReport.put("aggregation_service_payloads", payloads);
    return aggregatableReport;
  }
}
