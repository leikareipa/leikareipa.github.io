"use strict";

import { ll_assert_native_type } from "./assert.js";
import { LL_BaseType } from "./base-type.js";
import { store } from "./redux-store.js";
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
  const monthNames = {
    fiFI: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
    enEN: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    lat: ["Ianuarius", "Februarius", "Martius", "Aprilis", "Maius", "Iunius", "Iulius", "Augustus", "September", "October", "November", "December"]
  };
  const monthStrings = {
    fiFI: monthNames["fiFI"],
    enEN: monthNames["enEN"],
    lat: monthNames["lat"]
  };
  const monthString = (monthStrings[language] || monthStrings["fiFI"])[observation.month - 1];
  const dateString = {
    fiFI: `${observation.day}. ${monthString}ta ${observation.year}`,
    enEN: `${observation.day} ${monthString} ${observation.year}`,
    lat: `${observation.day} ${monthString} ${observation.year}`
  };
  return dateString[language] || dateString["fiFI"];
};

LL_Observation.clone = function (observation = LL_Observation) {
  return LL_Observation(observation);
};