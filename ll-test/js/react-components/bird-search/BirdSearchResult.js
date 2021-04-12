"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { AsyncIconButton } from "../buttons/AsyncIconButton.js";
import { BirdThumbnail } from "../misc/BirdThumbnail.js";
import { LL_Observation } from "../../observation.js";
import { tr } from "../../translator.js";
export function BirdSearchResult(props = {}) {
  BirdSearchResult.validate_props(props);

  const addAndRemoveButton = (() => {
    if (!props.userHasEditRights) {
      return React.createElement(React.Fragment, null);
    } else if (!props.observation) {
      return React.createElement(AsyncIconButton, {
        icon: "fas fa-plus",
        title: tr("Add %1 to the list", props.bird.species),
        titleWhenClicked: tr("Adding..."),
        task: () => props.cbAddObservation(props.bird)
      });
    } else {
      return React.createElement(AsyncIconButton, {
        icon: "fas fa-eraser",
        title: tr("Remove %1 from the list", props.bird.species),
        titleWhenClicked: tr("Removing..."),
        task: () => props.cbRemoveObservation(props.bird)
      });
    }
  })();

  const dateElement = (() => {
    if (props.observation) {
      if (props.userHasEditRights) {
        return React.createElement("span", {
          className: "edit-date",
          onClick: () => props.cbChangeObservationDate(props.bird)
        }, LL_Observation.date_string(props.observation));
      } else {
        return React.createElement(React.Fragment, null, LL_Observation.date_string(props.observation));
      }
    } else {
      return React.createElement(React.Fragment, null, tr("Not on the list yet"));
    }
  })();

  return React.createElement("div", {
    className: `BirdSearchResult ${!props.observation ? "not-previously-observed" : ""}`.trim()
  }, React.createElement(BirdThumbnail, {
    species: props.bird.species,
    useLazyLoading: false
  }), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "bird-name"
  }, props.bird.species), React.createElement("div", {
    className: "date-observed"
  }, dateElement)), addAndRemoveButton);
}
BirdSearchResult.defaultProps = {
  userHasEditRights: false,
  observation: null
};

BirdSearchResult.validate_props = function (props) {
  ll_assert_native_type("object", props);
  ll_assert_native_type("boolean", props.userHasEditRights);
  ll_assert_native_type("function", props.cbAddObservation, props.cbRemoveObservation, props.cbChangeObservationDate);
  return;
};