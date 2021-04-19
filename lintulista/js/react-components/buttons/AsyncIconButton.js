"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { ll_error_popup } from "../../message-popup.js";
import { LL_Throwable } from "../../throwable.js";
export function AsyncIconButton(props = {}) {
  AsyncIconButton.validate_props(props);
  const [currentIcon, setCurrentIcon] = React.useState(props.icon);
  const [currentTitle, setCurrentTitle] = React.useState(props.title);

  const iconSize = (() => {
    const sizeStrings = props.icon.match(/fa-([0-9]+x|xs|sm|lg)/g);
    return sizeStrings ? sizeStrings.join(" ") : "";
  })();

  const [currentState, setCurrentState] = React.useState(props.task && props.enabled ? "enabled" : "disabled");

  if (typeof props.giveCallbackTriggerPress === "function") {
    props.giveCallbackTriggerPress(handle_click);
  }

  return React.createElement("span", {
    className: `AsyncIconButton ${currentState}`,
    onClick: handle_click,
    title: props.titleIsAlwaysVisible ? "" : currentTitle
  }, React.createElement("i", {
    className: currentIcon
  }), props.titleIsAlwaysVisible ? React.createElement(React.Fragment, null, React.createElement("br", null), currentTitle) : React.createElement(React.Fragment, null));

  async function handle_click() {
    if (currentState !== "enabled" || !props.task) {
      return;
    }

    try {
      set_button_state("waiting");
      await props.task({
        resetState: (state = "enabled") => set_button_state(state)
      });
    } catch (error) {
      set_button_state("enabled");
      throw error;
    }
  }

  function set_button_state(newState) {
    ll_assert_native_type("string", newState);

    if (!props.task && newState === "enabled") {
      newState = "disabled";
    }

    switch (newState) {
      case "enabled":
        {
          setCurrentState("enabled");
          setCurrentIcon(props.icon);
          setCurrentTitle(props.title);
          break;
        }

      case "waiting":
        {
          setCurrentState("waiting");
          setCurrentIcon(`fas fa-fw fa-spinner fa-spin ${iconSize}`.trim());
          setCurrentTitle(props.titleWhenClicked);
          break;
        }

      case "disabled":
        {
          setCurrentState("disabled");
          setCurrentIcon(props.icon);
          setCurrentTitle(props.title);
          break;
        }

      default:
        throw LL_Throwable("Unknown button state.");
    }
  }
}
AsyncIconButton.defaultProps = {
  enabled: true,
  title: null,
  titleWhenClicked: null,
  titleIsAlwaysVisible: false,
  icon: "fas fa-question"
};

AsyncIconButton.validate_props = function (props) {
  ll_assert_native_type("object", props);
  return;
};