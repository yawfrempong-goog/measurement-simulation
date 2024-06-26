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

package com.google.measurement;

import com.google.measurement.util.Util;
import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

/**
 * Class for holding privacy related parameters. All values in this class are temporary and subject
 * to change based on feedback and testing.
 */
public final class PrivacyParams {
  /** Max reports for 'Navigation' {@link Source}. */
  public static final int NAVIGATION_SOURCE_MAX_REPORTS = 3;

  /** Max reports for 'Event' {@link Source}. */
  public static final int EVENT_SOURCE_MAX_REPORTS = 1;

  /** Max reports for Install Attributed 'Navigation' {@link Source}. */
  public static final int INSTALL_ATTR_NAVIGATION_SOURCE_MAX_REPORTS = 3;

  /** Max reports for Install Attributed 'Event' {@link Source}. */
  public static final int INSTALL_ATTR_EVENT_SOURCE_MAX_REPORTS = 2;

  /**
   * Rate limit window for (Source Site, Destination Site, Reporting Site, Window) privacy unit. 30
   * days.
   */
  public static final long RATE_LIMIT_WINDOW_MILLISECONDS = TimeUnit.DAYS.toMillis(30);

  /** Early reporting window for 'Navigation' {@link Source}. 2 days and 7 days. */
  public static final long[] NAVIGATION_EARLY_REPORTING_WINDOW_MILLISECONDS =
      new long[] {TimeUnit.DAYS.toMillis(2), TimeUnit.DAYS.toMillis(7)};

  /** Expire time of the source */
  public static final long EXPIRY = TimeUnit.DAYS.toMillis(30);

  /** Early reporting window for 'Event' {@link Source}. No windows. */
  public static final long[] EVENT_EARLY_REPORTING_WINDOW_MILLISECONDS = new long[] {};

  /**
   * Early reporting window for Install Attributed 'Navigation' {@link Source}. 2 days and 7 days.
   */
  public static final long[] INSTALL_ATTR_NAVIGATION_EARLY_REPORTING_WINDOW_MILLISECONDS =
      NAVIGATION_EARLY_REPORTING_WINDOW_MILLISECONDS;

  /** Early reporting window for Install Attributed 'Event' {@link Source}. 2 days. */
  public static final long[] INSTALL_ATTR_EVENT_EARLY_REPORTING_WINDOW_MILLISECONDS =
      new long[] {TimeUnit.DAYS.toMillis(2)};

  /** {@link Source} Noise probability for 'Event'. */
  public static double EVENT_NOISE_PROBABILITY;

  /** {@link Source} Noise probability for 'Navigation'. */
  public static double NAVIGATION_NOISE_PROBABILITY;

  /** {@link Source} Noise probability for 'Event' which supports install attribution. */
  public static double INSTALL_ATTR_EVENT_NOISE_PROBABILITY;

  /** {@link Source} Noise probability for 'Navigation' which supports install attribution. */
  public static double INSTALL_ATTR_NAVIGATION_NOISE_PROBABILITY;

  /**
   * {@link Source} Noise probability for 'Event', when both destinations (app and web) are
   * available on the source.
   */
  public static double DUAL_DESTINATION_EVENT_NOISE_PROBABILITY;

  /**
   * {@link Source} Noise probability for 'Navigation', when both destinations (app and web) are
   * available on the source.
   */
  public static double DUAL_DESTINATION_NAVIGATION_NOISE_PROBABILITY;

  /**
   * {@link Source} Noise probability for 'Event', when both destinations (app and web) are
   * available on the source and supports install attribution.
   */
  public static double INSTALL_ATTR_DUAL_DESTINATION_EVENT_NOISE_PROBABILITY;

  /**
   * {@link Source} Noise probability for 'Navigation', when both destinations (app and web) are
   * available on the source and supports install attribution.
   */
  public static double INSTALL_ATTR_DUAL_DESTINATION_NAVIGATION_NOISE_PROBABILITY;

  /** Trigger data cardinality for 'Event' {@link Source} attribution. */
  public static final int EVENT_TRIGGER_DATA_CARDINALITY = 2;

  /** Trigger data cardinality for 'Navigation' {@link Source} attribution. */
  public static final int NAVIGATION_TRIGGER_DATA_CARDINALITY = 8;

  /** Min expiration value in seconds for attribution reporting register source. */
  public static final long MIN_REPORTING_REGISTER_SOURCE_EXPIRATION_IN_SECONDS =
      TimeUnit.DAYS.toSeconds(1);

  /**
   * Max expiration value in seconds for attribution reporting register source. This value is also
   * the default no expiration was specified.
   */
  public static final long MAX_REPORTING_REGISTER_SOURCE_EXPIRATION_IN_SECONDS =
      TimeUnit.DAYS.toSeconds(30);

  /** Minimum limit of duration to determine attribution for a verified installation. */
  public static final long MIN_INSTALL_ATTRIBUTION_WINDOW = TimeUnit.DAYS.toSeconds(1);

  /** Maximum limit of duration to determine attribution for a verified installation. */
  public static final long MAX_INSTALL_ATTRIBUTION_WINDOW = TimeUnit.DAYS.toSeconds(30);

  /** Default and minimum value for cooldown period of source which led to installation. */
  public static final long MIN_POST_INSTALL_EXCLUSIVITY_WINDOW = 0;

  /** Maximum acceptable install cooldown period. */
  public static final long MAX_POST_INSTALL_EXCLUSIVITY_WINDOW = TimeUnit.DAYS.toSeconds(30);

  /** Minimum time window after which reporting origin can be migrated */
  public static final long MIN_REPORTING_ORIGIN_UPDATE_WINDOW = TimeUnit.DAYS.toMillis(1);

  /**
   * L1, the maximum sum of the contributions (values) across all buckets for a given source event.
   */
  public static final int MAX_SUM_OF_AGGREGATE_VALUES_PER_SOURCE = 65536;

  /** Amount of bytes allocated for aggregate histogram bucket */
  public static final int AGGREGATE_HISTOGRAM_BUCKET_BYTE_SIZE = 16;

  /** Amount of bytes allocated for aggregate histogram value */
  public static final int AGGREGATE_HISTOGRAM_VALUE_BYTE_SIZE = 4;

  /** Minimum time an aggregate report is delayed after trigger */
  public static final long AGGREGATE_MIN_REPORT_DELAY = TimeUnit.MINUTES.toMillis(10L);

  /** Maximum time an aggregate report is delayed after trigger */
  public static final long AGGREGATE_MAX_REPORT_DELAY = TimeUnit.MINUTES.toMillis(60L);

  /** Time an event report is delayed after report window */
  public static final long EVENT_REPORT_DELAY = TimeUnit.MINUTES.toMillis(60L);

  /** Max distinct web destinations in source registration. */
  public static final int MAX_DISTINCT_WEB_DESTINATIONS_IN_SOURCE_REGISTRATION = 3;

  /** Max distinct enrollments for attribution per { Publisher X Advertiser X TimePeriod }. */
  public static final int MAX_DISTINCT_ENROLLMENTS_PER_PUBLISHER_X_DESTINATION_IN_SOURCE = 100;

  public static final int MAX_FLEXIBLE_EVENT_REPORTS = 20;

  public static final int MAX_FLEXIBLE_EVENT_TRIGGER_DATA_CARDINALITY = 8;

  public static final int MAX_FLEXIBLE_EVENT_REPORTING_WINDOWS = 5;

  public static final int PRIVACY_EPSILON = 14;

  public static final double NUMBER_EQUAL_THRESHOLD = 0.0000001d;

  public static final double MEASUREMENT_FLEX_API_MAX_INFO_GAIN_EVENT = 1.5849266F;

  public static final double MEASUREMENT_FLEX_API_MAX_INFO_GAIN_NAVIGATION = 11.4617280F;

  // place holder for future change
  public static final double MAX_FLEXIBLE_EVENT_INFORMATION_GAIN = Double.MAX_VALUE;

  /**
   * Maximum early reporting windows configured through {@link
   * Flags#MEASUREMENT_EVENT_REPORTS_VTC_EARLY_REPORTING_WINDOWS} or {@link
   * Flags#MEASUREMENT_EVENT_REPORTS_CTC_EARLY_REPORTING_WINDOWS}.
   */
  public static final int MAX_CONFIGURABLE_EVENT_REPORT_EARLY_REPORTING_WINDOWS = 2;

  static {
    Properties props = new Properties();
    try {
      Util.loadProperties(props, "./config/PrivacyParams.properties");
    } catch (IOException e) {
      throw new RuntimeException(
          "Error with reading file config/PrivacyParams.properties."
              + " Please ensure that it exists and is properly formatted");
    }
    EVENT_NOISE_PROBABILITY = validateDouble(props, "eventNoiseProbability");
    NAVIGATION_NOISE_PROBABILITY = validateDouble(props, "navigationNoiseProbability");
    INSTALL_ATTR_NAVIGATION_NOISE_PROBABILITY = NAVIGATION_NOISE_PROBABILITY;
    INSTALL_ATTR_EVENT_NOISE_PROBABILITY =
        validateDouble(props, "installAttrEventNoiseProbability");
    DUAL_DESTINATION_EVENT_NOISE_PROBABILITY =
        validateDouble(props, "dualDestinationEventNoiseProbability");
    DUAL_DESTINATION_NAVIGATION_NOISE_PROBABILITY =
        validateDouble(props, "dualDestinationNavigationNoiseProbability");
    INSTALL_ATTR_DUAL_DESTINATION_NAVIGATION_NOISE_PROBABILITY =
        DUAL_DESTINATION_NAVIGATION_NOISE_PROBABILITY;
    INSTALL_ATTR_DUAL_DESTINATION_EVENT_NOISE_PROBABILITY =
        validateDouble(props, "installAttrDualDestinationEventNoiseProbability");
  }

  private PrivacyParams() {}

  private static double validateDouble(Properties props, String key) {
    key = validateKey(props, key);
    double d = 0;
    try {
      d = Double.parseDouble(props.getProperty(key));
    } catch (NumberFormatException e) {
      String err =
          String.format("%s with value %s not a valid double", key, props.getProperty(key));
      throw new IllegalArgumentException(err);
    }

    return d;
  }

  private static String validateKey(Properties props, String key) {
    if (!props.containsKey(key)) {
      String err = String.format("%s missing from PrivacyParams.properties", key);
      throw new IllegalArgumentException(err);
    }
    return key;
  }

  public static int getMaxFlexibleEventReports() {
    return MAX_FLEXIBLE_EVENT_REPORTS;
  }

  public static int getMaxFlexibleEventTriggerDataCardinality() {
    return MAX_FLEXIBLE_EVENT_TRIGGER_DATA_CARDINALITY;
  }

  public static int getMaxFlexibleEventReportingWindows() {
    return MAX_FLEXIBLE_EVENT_REPORTING_WINDOWS;
  }

  public static int getPrivacyEpsilon() {
    return PRIVACY_EPSILON;
  }

  public static double getMaxFlexibleEventInformationGain() {
    return MAX_FLEXIBLE_EVENT_INFORMATION_GAIN;
  }
}
