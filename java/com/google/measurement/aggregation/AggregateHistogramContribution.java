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

package com.google.measurement.aggregation;

import com.google.measurement.util.Util;
import java.math.BigInteger;
import java.util.Objects;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

public class AggregateHistogramContribution {
  static final String BUCKET = "bucket";
  static final String VALUE = "value";
  private BigInteger mKey; // Equivalent to uint128 in C++.
  private int mValue;

  private AggregateHistogramContribution() {
    mKey = BigInteger.valueOf(0L);
  }

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof AggregateHistogramContribution)) {
      return false;
    }
    AggregateHistogramContribution aggregateHistogramContribution =
        (AggregateHistogramContribution) obj;
    return Objects.equals(mKey, aggregateHistogramContribution.mKey)
        && mValue == aggregateHistogramContribution.mValue;
  }

  @Override
  public int hashCode() {
    return Objects.hash(mKey, mValue);
  }

  /** Creates JSONObject for this histogram contribution. */
  public JSONObject toJSONObject() throws ParseException {
    JSONObject jsonObject = new JSONObject();
    jsonObject.put(BUCKET, mKey.toString());
    jsonObject.put(VALUE, mValue);
    return jsonObject;
  }

  /** Encrypted Key for the aggregate histogram contribution. */
  public BigInteger getKey() {
    return mKey;
  }

  /** Value for the aggregate histogram contribution. */
  public int getValue() {
    return mValue;
  }

  /** Builder for {@link AggregateHistogramContribution}. */
  public static final class Builder {
    private final AggregateHistogramContribution mAggregateHistogramContribution;

    public Builder() {
      mAggregateHistogramContribution = new AggregateHistogramContribution();
    }

    /** See {@link AggregateHistogramContribution#getKey()}. */
    public Builder setKey(BigInteger key) {
      mAggregateHistogramContribution.mKey = key;
      return this;
    }

    /** See {@link AggregateHistogramContribution#getValue()}. */
    public Builder setValue(int value) {
      mAggregateHistogramContribution.mValue = value;
      return this;
    }

    /**
     * Builds a {@link AggregateHistogramContribution} from the provided JSONObject.
     *
     * @param jsonObject JSONObject to deserialize
     * @return {@link AggregateHistogramContribution}
     */
    public AggregateHistogramContribution fromJsonObject(JSONObject jsonObject) {
      AggregateHistogramContribution aggregateHistogramContribution =
          new AggregateHistogramContribution();
      aggregateHistogramContribution.mKey = new BigInteger((String) jsonObject.get(BUCKET));
      aggregateHistogramContribution.mValue = Util.parseJsonInt(jsonObject, VALUE);
      return aggregateHistogramContribution;
    }

    /** Build the {@link AggregateHistogramContribution}. */
    public AggregateHistogramContribution build() {
      return mAggregateHistogramContribution;
    }
  }
}
