"use strict";

import { ll_assert_native_type, ll_assert_type } from "../../assert.js";
import { lla_add_observation } from "../../action-add-observation.js";
import { lla_delete_observation } from "../../action-delete-observation.js";
import { lla_change_observation_date } from "../../action-change-observation-date.js";
import { AsyncIconButton } from "../buttons/AsyncIconButton.js";
import { BirdThumbnail } from "../misc/BirdThumbnail.js";
import { LL_Observation } from "../../observation.js";
import { LL_Bird } from "../../bird.js";
import { tr } from "../../translator.js";
export function BirdSearchResult(props = {}) {
  BirdSearchResult.validate_props(props);
  const storeDispatch = ReactRedux.useDispatch();
  const observations = ReactRedux.useSelector(state => state.observations);

  const addAndRemoveButton = (() => {
    if (!props.userHasEditRights) {
      return React.createElement(React.Fragment, null);
    } else if (!props.observation) {
      return React.createElement(AsyncIconButton, {
        icon: "fas fa-plus",
        title: tr("Add %1 to the list", props.bird.species),
        titleWhenClicked: tr("Adding..."),
        task: add_bird_to_list
      });
    } else {
      return React.createElement(AsyncIconButton, {
        icon: "fas fa-eraser",
        title: tr("Remove %1 from the list", props.bird.species),
        titleWhenClicked: tr("Removing..."),
        task: remove_bird_from_list
      });
    }
  })();

  const dateElement = (() => {
    if (props.observation) {
      if (props.userHasEditRights) {
        return React.createElement("span", {
          className: "edit-date",
          onClick: change_observation_date
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

  async function add_bird_to_list() {
    const success = await lla_add_observation.async({
      bird: props.bird,
      backend: props.backend
    });

    if (success) {
      storeDispatch({
        type: "set-highlighted-species",
        species: props.bird.species
      });
    }

    props.cbCloseSelf();
  }

  async function remove_bird_from_list() {
    props.cbCloseSelf();
    await lla_delete_observation.async({
      bird: props.bird,
      backend: props.backend
    });
  }

  async function change_observation_date() {
    props.cbCloseSelf();
    const observation = observations.find(obs => obs.species === props.bird.species);
    const success = await lla_change_observation_date.async({
      observation,
      backend: props.backend
    });

    if (success) {
      storeDispatch({
        type: "set-highlighted-species",
        species: observation.species
      });
    }
  }
}
BirdSearchResult.defaultProps = {
  userHasEditRights: false,
  observation: null
};

BirdSearchResult.validate_props = function (props) {
  ll_assert_native_type("object", props, props.backend);
  ll_assert_native_type("boolean", props.userHasEditRights);
  ll_assert_native_type("function", props.cbCloseSelf);
  ll_assert_type(LL_Bird, props.bird);
  return;
};