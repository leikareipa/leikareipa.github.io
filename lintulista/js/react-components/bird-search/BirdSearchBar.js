"use strict";

import { ll_assert, ll_assert_native_type } from "../../assert.js";
import { tr } from "../../translator.js";
export function BirdSearchBar(props = {}) {
  BirdSearchBar.validateProps(props);
  const searchRef = React.useRef();
  const [state, setState] = React.useState(props.initialState);
  const [currentText, setCurrentText] = React.useState("");
  React.useEffect(() => {
    window.addEventListener("mousedown", handle_search_click);
    return () => window.removeEventListener("mousedown", handle_search_click);

    function handle_search_click(clickEvent) {
      const clickedOnSearchElement = (() => {
        let targetNode = clickEvent.target;

        if (targetNode && targetNode.tagName.toLowerCase() === "html") {
          return true;
        }

        while (targetNode) {
          if (targetNode.classList && (targetNode.classList.contains("BirdSearchResultsDisplay") || targetNode.classList.contains("BirdSearchResult") || targetNode.classList.contains("BirdSearchBar"))) {
            return true;
          }

          targetNode = targetNode.parentNode;
        }

        return false;
      })();

      if (!clickedOnSearchElement) {
        setState("inactive");
      }
    }
  }, []);
  React.useEffect(() => {
    switch (state) {
      case "inactive":
        {
          props.cbOnInactivate();
          break;
        }

      case "active":
        {
          props.cbOnActivate();
          break;
        }

      default:
        console.error(`Unknown state "${state}".`);
        break;
    }
  }, [state]);
  return React.createElement("div", {
    className: "BirdSearchBar"
  }, React.createElement("input", {
    className: `search-field ${state}`.trim(),
    ref: searchRef,
    type: "search",
    onBlur: () => {
      if (!currentText.length) {
        got_focus(false);
      }
    },
    onFocus: () => got_focus(true),
    onChange: handle_input_event,
    spellCheck: "false",
    placeholder: tr("Search for species"),
    autoComplete: "off"
  }), React.createElement("i", {
    className: "icon fas fa-search"
  }));

  function got_focus(gotIt) {
    setState(gotIt ? "active" : "inactive");

    if (gotIt && currentText) {
      props.cbOnChange(currentText);
    }
  }

  function handle_input_event(inputEvent) {
    const inputString = inputEvent.target.value.trim();
    setCurrentText(inputString);
    props.cbOnChange(inputString);
  }
}
BirdSearchBar.defaultProps = {
  initialState: "inactive",
  cbOnChange: () => {},
  cbOnActivate: () => {},
  cbOnInactivate: () => {}
};

BirdSearchBar.validateProps = function (props) {
  ll_assert_native_type("object", props);
  ll_assert_native_type("string", props.initialState);
  ll_assert_native_type("function", props.cbOnChange, props.cbOnActivate, props.cbOnInactivate);
  ll_assert(["active", "inactive"].includes(props.initialState), "Unrecognized state value.");
  return;
};