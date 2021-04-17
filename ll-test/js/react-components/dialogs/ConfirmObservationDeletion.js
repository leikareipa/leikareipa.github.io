"use strict";

import { ll_assert_native_type, ll_assert_type } from "../../assert.js";
import { BirdThumbnail } from "../misc/BirdThumbnail.js";
import { Dialog } from "./Dialog.js";
import { tr } from "../../translator.js";
import { LL_Observation } from "../../observation.js";
export function ConfirmObservationDeletion(props = {}) {
  ConfirmObservationDeletion.validateProps(props);

  let setButtonEnabled = (button, state) => {};

  return React.createElement(Dialog, {
    component: "ConfirmObservationDeletion",
    title: tr("Delete an observation"),
    acceptButtonIcon: "fas fa-eraser",
    rejectButtonText: tr("Cancel"),
    acceptButtonText: tr("Delete"),
    acceptButtonEnabled: false,
    callbackSetButtonEnabled: callback => {
      setButtonEnabled = callback;
    },
    enterAccepts: true,
    onDialogAccept: props.onAccept,
    onDialogReject: props.onReject
  }, React.createElement(BirdThumbnail, {
    species: props.args.observation.species,
    useLazyLoading: false
  }), React.createElement("div", {
    className: "fields"
  }, React.createElement("div", {
    className: "bird-name"
  }, props.args.observation.species), React.createElement("input", {
    className: "list-id",
    type: "text",
    onChange: update_on_input,
    spellCheck: "false",
    autoFocus: true
  }), React.createElement("div", {
    className: "instruction"
  }, tr("Type \"%1\" to continue", props.args.observation.species))));

  function update_on_input(inputEvent) {
    const doesNameMatch = inputEvent.target.value.toLowerCase() === props.args.observation.species.toLowerCase();
    setButtonEnabled("accept", doesNameMatch);
  }
}

ConfirmObservationDeletion.validateProps = function (props) {
  ll_assert_native_type("object", props, props.args);
  ll_assert_native_type("function", props.onAccept, props.onReject);
  ll_assert_type(LL_Observation, props.args.observation);
  return;
};