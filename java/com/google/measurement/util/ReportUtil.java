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

package com.google.measurement.util;

import java.net.URI;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import org.json.simple.JSONArray;

/** Report related utility methods. */
public class ReportUtil {

  /**
   * Prepares an alphabetical ordered list of attribution destinations for report JSON. If any
   * elements are found to be null, they are added at last.
   *
   * @param destinations a list of attribution destinations
   * @return an Object that is either String or JSONArray
   */
  public static Object serializeAttributionDestinations(List<URI> destinations) {
    if (destinations.size() == 0) {
      throw new IllegalArgumentException("Destinations list is empty");
    }
    if (destinations.size() == 1) {
      return destinations.get(0).toString();
    } else {
      List<URI> sortedDestinations = new ArrayList<>(destinations);
      sortedDestinations.sort(Comparator.comparing(URI::toString));
      JSONArray dests = new JSONArray();
      dests.addAll(sortedDestinations.stream().map(URI::toString).collect(Collectors.toList()));
      return dests;
    }
  }
}
