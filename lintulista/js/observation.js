"use strict";

import { ll_assert_native_type } from "./assert.js";
import { LL_BaseType } from "./base-type.js";
import { store } from "./redux-store.js";
import { tr } from "./translator.js";
import { value2roman } from "./value-to-roman.js";
export const LL_Observation = function ({
  species,
  day,
  month,
  year
}) {
  ll_assert_native_type("string", species);
  return Object.freeze({
    isGhost: !day || !month || !year,
    species,
    day,
    month,
    year,
    ...LL_BaseType(LL_Observation)
  });
};

LL_Observation.is_parent_of = function (candidate) {
  return LL_BaseType.type_of(candidate) === LL_Observation && candidate.hasOwnProperty("isGhost") && candidate.hasOwnProperty("day") && candidate.hasOwnProperty("month") && candidate.hasOwnProperty("year");
};

LL_Observation.date_string = function (observation = LL_Observation) {
  if (observation.isGhost || observation.day === undefined || observation.month === undefined || observation.year === undefined) {
    return "";
  }

  const language = store.getState().language || "fiFI";
  const monthNames = [tr("January"), tr("February"), tr("March"), tr("April"), tr("May"), tr("June"), tr("July"), tr("August"), tr("September"), tr("October"), tr("November"), tr("December")];
  const monthString = monthNames[observation.month - 1];

  switch (language) {
    case "fiFI":
      return `${observation.day}. ${monthString}ta ${observation.year}`;

    case "lat":
      return `${value2roman(observation.day)} ${monthString} ${value2roman(observation.year)}`;

    default:
      return `${observation.day} ${monthString} ${observation.year}`;
  }

  ;
};

LL_Observation.clone = function (observation = LL_Observation) {
  return LL_Observation(observation);
};