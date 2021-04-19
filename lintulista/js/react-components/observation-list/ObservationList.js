"use strict";

import { ll_assert_native_type, ll_assert_type } from "../../assert.js";
import { merge_100_lajia_with } from "../../100-lajia.js";
import { ObservationListFootnotes } from "./ObservationListFootnotes.js";
import { ObservationListMenuBar } from "./ObservationListMenuBar.js";
import { ObservationCard } from "./ObservationCard.js";
import { LL_Observation } from "../../observation.js";
import { LL_Backend } from "../../backend.js";
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
    backend: props.backend
  }), React.createElement("div", {
    className: "observation-cards"
  }, cards_from_observations(is100LajiaMode ? merge_100_lajia_with(observations) : observations)), React.createElement(ObservationListFootnotes, null));

  function cards_from_observations(observations = [Observation]) {
    ll_assert_native_type("array", observations);
    return observations.map(obs => {
      ll_assert_type(LL_Observation, obs);
      return React.createElement(ObservationCard, {
        observation: obs,
        isGhost: obs.isGhost,
        key: obs.species
      });
    });
  }
}

ObservationList.validate_props = function (props) {
  ll_assert_type(LL_Backend, props.backend);
  return;
};