"use strict";

import { ll_assert_native_type, ll_assert_type } from "../../assert.js";
import { BirdThumbnail } from "../misc/BirdThumbnail.js";
import { LL_Observation } from "../../observation.js";
import { tr } from "../../translator.js";
export function ObservationCard(props = {}) {
  ObservationCard.validate_props(props);
  const storeDispatch = ReactRedux.useDispatch();
  const highlightedSpecies = ReactRedux.useSelector(state => state.highlightedSpecies);
  const isHighlighted = !props.isGhost && props.observation.species === highlightedSpecies;
  React.useEffect(() => {
    if (isHighlighted) {
      const removeHilightTimeout = setTimeout(() => {
        storeDispatch({
          type: "remove-species-highlight"
        });
      }, 3000);
      return () => clearTimeout(removeHilightTimeout);
    }
  });
  return React.createElement("div", {
    className: `ObservationCard${props.isGhost ? "Ghost" : ""}
                                            ${isHighlighted ? "highlighted" : ""}`
  }, props.isGhost ? React.createElement("div", {
    className: "BirdThumbnail"
  }) : React.createElement(BirdThumbnail, {
    species: props.observation.species
  }), React.createElement("div", {
    className: "observation-info"
  }, React.createElement("div", {
    className: "bird-name"
  }, props.observation.species), React.createElement("div", {
    className: "date"
  }, props.isGhost ? tr("100 Species Challenge") : LL_Observation.date_string(props.observation))));
}
ObservationCard.defaultProps = {
  isGhost: false
};

ObservationCard.validate_props = function (props) {
  ll_assert_native_type("object", props);
  ll_assert_native_type("boolean", props.isGhost);
  ll_assert_type(LL_Observation, props.observation);
  return;
};