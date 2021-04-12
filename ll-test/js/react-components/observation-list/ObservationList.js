"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { merge_100_lajia_with } from "../../100-lajia-observations.js";
import { ObservationListFootnotes } from "./ObservationListFootnotes.js";
import { ObservationListMenuBar } from "./ObservationListMenuBar.js";
import { ObservationCard } from "./ObservationCard.js";
import { LL_Observation } from "../../observation.js";
import * as FileSaver from "../../filesaver/FileSaver.js";

function cards_from_observations(observations = [Observation]) {
  ll_assert_native_type("array", observations);
  return observations.map(obs => React.createElement(ObservationCard, {
    observation: obs,
    isGhost: obs.isGhost,
    key: obs.species
  }));
}

export function ObservationList(props = {}) {
  ObservationList.validate_props(props);
  const language = ReactRedux.useSelector(state => state.language);
  const observations = ReactRedux.useSelector(state => state.observations);
  const is100LajiaMode = ReactRedux.useSelector(state => state.is100LajiaMode);
  return React.createElement("div", {
    className: "ObservationList",
    "data-language": language
  }, React.createElement(ObservationListMenuBar, {
    enabled: true,
    backend: props.backend,
    callbackSetListSorting: () => {}
  }), React.createElement("div", {
    className: "observation-cards"
  }, cards_from_observations(is100LajiaMode ? merge_100_lajia_with(observations) : observations)), React.createElement(ObservationListFootnotes, {
    numObservationsInList: observations.length,
    callbackDownloadList: save_observations_to_csv_file
  }));

  function save_observations_to_csv_file() {
    let csvString = "Päivämäärä, Laji\n";
    observations.forEach(obs => {
      csvString += `${LL_Observation.date_string(obs)}, ${obs.species || ""},\n`;
    });
    saveAs(new Blob([csvString], {
      type: "text/plain;charset=utf-8"
    }), "lintulista.csv");
  }
}

ObservationList.validate_props = function (props) {
  ll_assert_native_type("object", props.backend);
  return;
};