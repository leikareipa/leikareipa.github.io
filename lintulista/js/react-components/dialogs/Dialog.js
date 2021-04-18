"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { AsyncIconButton } from "../buttons/AsyncIconButton.js";
import { tr } from "../../translator.js";
export function Dialog(props = {}) {
  Dialog.validateProps(props);
  const [acceptButtonEnabled, setAcceptButtonEnabled] = React.useState(props.acceptButtonEnabled);
  const [rejectButtonEnabled, setRejectButtonEnabled] = React.useState(props.rejectButtonEnabled);
  const [acceptViaCode, setAcceptViaCode] = React.useState(false);
  const [rejectViaCode, setRejectViaCode] = React.useState(false);
  React.useEffect(() => {
    if (acceptViaCode) {
      setAcceptViaCode(false);

      if (acceptButtonEnabled) {
        triggerAcceptButtonPress();
      }
    }

    if (rejectViaCode && rejectButtonEnabled) {
      setRejectViaCode(false);

      if (rejectButtonEnabled) {
        reject();
      }
    }
  }, [acceptViaCode, rejectViaCode, acceptButtonEnabled, rejectButtonEnabled]);
  React.useEffect(() => {
    window.addEventListener("keydown", handle_key);
    return () => window.removeEventListener("keydown", handle_key);

    function handle_key(keyEvent) {
      if (props.disableTabKey && keyEvent.key === "Tab") {
        keyEvent.preventDefault();
        return;
      }

      if (props.enterAccepts && keyEvent.key === "Enter") {
        setAcceptViaCode(true);
        return;
      }

      if (props.escRejects && keyEvent.key === "Escape") {
        setRejectViaCode(true);
        return;
      }
    }
  }, []);

  if (typeof props.callbackSetButtonEnabled === "function") {
    props.callbackSetButtonEnabled((button, state) => {
      switch (button) {
        case "accept":
          setAcceptButtonEnabled(state);
          break;

        case "reject":
          setRejectButtonEnabled(state);
          break;

        default:
          console.error(`Unknown button "${button}"`);
      }
    });
  }

  if (typeof props.giveCallbackTriggerDialogAccept === "function") {
    props.giveCallbackTriggerDialogAccept(() => setAcceptViaCode(true));
  }

  if (typeof props.giveCallbackTriggerDialogReject === "function") {
    props.giveCallbackTriggerDialogReject(() => setRejectViaCode(true));
  }

  let triggerAcceptButtonPress = () => {};

  const dialogRef = React.useRef();
  return React.createElement("div", {
    className: `Dialog ${props.component}`,
    ref: dialogRef
  }, React.createElement("div", {
    className: "title"
  }, React.createElement("i", {
    className: "title-icon fas fa-feather-alt"
  }), " ", props.title), React.createElement("div", {
    className: "form"
  }, props.children), React.createElement("div", {
    className: "button-bar"
  }, React.createElement("div", {
    className: `reject ${!rejectButtonEnabled ? "disabled" : ""}`.trim(),
    onClick: reject
  }, React.createElement("i", {
    className: `${props.rejectButtonIcon} fa-2x`
  }), React.createElement("br", null), props.rejectButtonText), React.createElement("div", {
    className: `accept ${!acceptButtonEnabled ? "disabled" : ""}`
  }, React.createElement(AsyncIconButton, {
    task: accept,
    icon: `${props.acceptButtonIcon} fa-2x`,
    titleIsAlwaysVisible: true,
    title: props.acceptButtonText,
    titleWhenClicked: props.acceptButtonWaitingText,
    giveCallbackTriggerPress: callback => {
      triggerAcceptButtonPress = callback;
    }
  }))));

  function accept() {
    setRejectButtonEnabled(false);
    props.onDialogAccept();
  }

  function reject() {
    setAcceptButtonEnabled(false);
    setRejectButtonEnabled(false);
    props.onDialogReject();
  }
}

Dialog.validateProps = function (props) {
  ll_assert_native_type("object", props);
  ll_assert_native_type("string", props.component, props.title, props.acceptButtonText, props.rejectButtonText);
  ll_assert_native_type("function", props.onDialogAccept, props.onDialogReject);
  return;
};

Dialog.defaultProps = {
  acceptButtonEnabled: true,
  rejectButtonEnabled: true,
  acceptButtonIcon: "fas fa-check",
  acceptButtonWaitingText: tr("Saving..."),
  rejectButtonIcon: "fas fa-times",
  disableTabKey: true,
  enterAccepts: false,
  escRejects: true
};