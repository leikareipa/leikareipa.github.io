"use strict";

import { tr } from "../../translator.js";
import { ll_assert_native_type, ll_assert_type } from "../../assert.js";
import { lla_log_in } from "../../action-log-in.js";
import { lla_log_out } from "../../action-log-out.js";
import { LL_Backend } from "../../backend.js";
import { AsyncIconButton } from "../../react-components/buttons/AsyncIconButton.js";
export function ObservationList_MenuBar_LoginButton(props = {}) {
  ObservationList_MenuBar_LoginButton.validate_props(props);
  const isLoggedIn = ReactRedux.useSelector(state => state.isLoggedIn);

  if (isLoggedIn) {
    return React.createElement(AsyncIconButton, {
      icon: "fas fa-shield-alt fa-fw fa-lg",
      title: tr("Log out"),
      titleWhenClicked: tr("Logging out..."),
      task: on_click
    });
  }

  return React.createElement("div", {
    className: `Button ObservationList_MenuBar_LoginButton`,
    onClick: on_click,
    title: isLoggedIn ? tr("Log out") : tr("Log in to edit the list")
  }, React.createElement("div", {
    className: "icon"
  }, React.createElement("i", {
    className: isLoggedIn ? "fas fa-shield-alt fa-fw fa-lg" : "fas fa-lock fa-fw fa-lg"
  })));

  async function on_click() {
    if (isLoggedIn) {
      await lla_log_out.async({
        backend: props.backend
      });
    } else {
      await lla_log_in.async({
        backend: props.backend
      });
    }

    return;
  }
}

ObservationList_MenuBar_LoginButton.validate_props = function (props) {
  ll_assert_native_type("object", props);
  ll_assert_type(LL_Backend, props.backend);
  return;
};