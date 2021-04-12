"use strict";

import { ll_assert_native_type, ll_assert_type } from "../../assert.js";
import { BirdThumbnail } from "../misc/BirdThumbnail.js";
import { Dialog } from "./Dialog.js";
import { tr } from "../../translator.js";
import { LL_Observation } from "../../observation.js";
export function QueryObservationDeletion(props = {}) {
  QueryObservationDeletion.validateProps(props);

  let setButtonEnabled = (button, state) => {};

  return React.createElement(Dialog, {
    component: "QueryObservationDeletion",
    title: tr("Delete an observation"),
    rejectButtonText: tr("Cancel"),
    acceptButtonText: tr("Delete"),
    acceptButtonEnabled: false,
    callbackSetButtonEnabled: callback => {
      setButtonEnabled = callback;
    },
    enterAccepts: true,
    onDialogAccept: accept,
    onDialogReject: reject
  }, React.createElement(BirdThumbnail, {
    species: props.observation.species,
    useLazyLoading: false
  }), React.createElement("div", {
    className: "fields"
  }, React.createElement("div", {
    className: "bird-name"
  }, props.observation.species, ":"), React.createElement("input", {
    className: "list-id",
    type: "text",
    onChange: update_on_input,
    spellCheck: "false",
    autoFocus: true
  }), React.createElement("div", {
    className: "instruction"
  }, tr("Type \"%1\" to continue", props.observation.species))));

  function update_on_input(inputEvent) {
    const doesNameMatch = inputEvent.target.value.toLowerCase() === props.observation.species.toLowerCase();
    setButtonEnabled("accept", doesNameMatch);
  }

  function accept() {
    props.onDialogAccept();
  }

  function reject() {
    props.onDialogReject();
  }
}

QueryObservationDeletion.validateProps = function (props) {
  ll_assert_native_type("object", props);
  ll_assert_native_type("function", props.onDialogAccept, props.onDialogReject);
  ll_assert_type(LL_Observation, props.observation);
  return;
};