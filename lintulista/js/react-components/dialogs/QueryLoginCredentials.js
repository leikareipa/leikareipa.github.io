"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { tr } from "../../translator.js";
import { Dialog } from "./Dialog.js";
export function QueryLoginCredentials(props = {}) {
  QueryLoginCredentials.validateProps(props);
  const usernameRef = React.useRef();
  let password = "";
  let username = "";

  let setButtonEnabled = (button, state) => {};

  return React.createElement(Dialog, {
    component: "QueryLoginCredentials",
    title: tr("Log in"),
    rejectButtonText: tr("Cancel"),
    acceptButtonText: tr("Log in"),
    acceptButtonIcon: "fas fa-shield-alt",
    acceptButtonWaitingText: tr("Logging in..."),
    acceptButtonEnabled: true,
    callbackSetButtonEnabled: callback => {
      setButtonEnabled = callback;
    },
    enterAccepts: true,
    disableTabKey: false,
    onDialogAccept: accept,
    onDialogReject: reject,
    onKeyDown: control_tab_presses
  }, React.createElement("form", {
    className: "fields"
  }, React.createElement("div", {
    className: "username"
  }, tr("Username")), React.createElement("input", {
    ref: usernameRef,
    className: "username",
    type: "text",
    onChange: event => {
      username = event.target.value;
    },
    spellCheck: "false",
    autoComplete: "username",
    autoFocus: true
  }), React.createElement("div", {
    className: "password"
  }, tr("Password")), React.createElement("input", {
    className: "password",
    type: "password",
    onKeyDown: control_tab_presses,
    onChange: event => {
      password = event.target.value;
    },
    spellCheck: "false",
    autoComplete: "current-password"
  }), React.createElement("div", {
    className: "instruction"
  }, tr("Your login will remain active until you log out or reload " + "the page. Otherwise, you'll be logged out automatically after " + "about six hours."))));

  function control_tab_presses(keyDownEvent) {
    if (keyDownEvent.code === "Tab") {
      usernameRef.current.focus();
      keyDownEvent.preventDefault();
    }

    return;
  }

  function accept() {
    props.return.username = username;
    props.return.password = password;
    props.onAccept();
  }

  function reject() {
    props.onReject();
  }
}

QueryLoginCredentials.validateProps = function (props) {
  ll_assert_native_type("object", props, props.return);
  ll_assert_native_type("function", props.onAccept, props.onReject);
  return;
};