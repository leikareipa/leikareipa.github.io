"use strict";

import { ll_assert_native_type, ll_assert } from "../../assert.js";
export function MenuButton(props = {}) {
  MenuButton.validate_props(props);
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [currentItemText, setCurrentItemText] = React.useState(props.items.length ? props.items[props.initialItemIdx].text : "null");
  React.useEffect(() => {
    window.addEventListener("mousedown", handle_mousedown);
    return () => {
      window.removeEventListener("mousedown", handle_mousedown);
    };

    function handle_mousedown(clickEvent) {
      const clickedOnSelf = (() => {
        let node = clickEvent.target;

        while (node) {
          if (node.dataset && node.dataset.menuButtonId === props.id) {
            return true;
          }

          node = node.parentNode;
        }

        return false;
      })();

      const clickedOnItem = Boolean(clickedOnSelf && clickEvent.target.classList && clickEvent.target.classList.contains("item"));
      const clickedOnTitle = Boolean(clickedOnSelf && clickEvent.target.classList && clickEvent.target.classList.contains("title"));

      const clickedOnCustomMenu = (() => {
        if (!props.customMenu) {
          return false;
        }

        let node = clickEvent.target;

        while (node) {
          if (node.classList && node.classList.contains("custom-menu")) {
            return true;
          }

          node = node.parentNode;
        }

        return false;
      })();

      if (clickedOnSelf) {
        if (!clickedOnItem && !clickedOnTitle && !clickedOnCustomMenu) {
          dropdownVisible ? hide_dropdown() : show_dropdown();
          props.callbackOnButtonClick();
        }
      } else {
        hide_dropdown();
      }
    }
  });
  const itemElements = props.items.map((item, idx) => React.createElement("div", {
    key: item.text + idx,
    className: "item",
    onClick: () => handle_item_click(idx, item.callbackOnSelect)
  }, item.text));

  const dropDownMenu = (() => {
    if (props.customMenu) {
      return React.createElement("div", {
        className: `dropdown custom-menu ${dropdownVisible ? "active" : "inactive"}`
      }, props.customMenu);
    } else {
      if (!props.items.length) {
        return React.createElement(React.Fragment, null);
      } else {
        return React.createElement("div", {
          className: `dropdown ${dropdownVisible ? "active" : "inactive"}`
        }, React.createElement("div", {
          className: "items"
        }, props.menuTitle.length ? React.createElement("div", {
          className: "title"
        }, props.menuTitle) : React.createElement(React.Fragment, null), itemElements));
      }
    }
  })();

  return React.createElement("div", {
    className: `MenuButton ${props.enabled ? "enabled" : "disabled"} ${props.id}`,
    "data-menu-button-id": props.id
  }, React.createElement("div", {
    className: "tooltip",
    style: {
      display: props.showTooltip ? "initial" : "none"
    }
  }, currentItemText), React.createElement("div", {
    className: `icon ${dropdownVisible ? "active" : "inactive"}`.trim(),
    title: props.title
  }, React.createElement("i", {
    className: props.icon
  })), dropDownMenu);

  function handle_item_click(itemIdx, callback) {
    ll_assert(props.items.length, "Received a click on an item even though there are no items.");
    setCurrentItemText(props.items[itemIdx].text);
    setDropdownVisible(false);
    callback();
  }

  function hide_dropdown() {
    setDropdownVisible(false);
  }

  function show_dropdown() {
    if (props.items.length || props.customMenu) {
      setDropdownVisible(true);
    }
  }
}
MenuButton.defaultProps = {
  id: "undefined-menu-button",
  title: "",
  menuTitle: "",
  icon: "fas fa-question",
  items: [],
  enabled: true,
  initialItemIdx: 0,
  showTooltip: true,
  callbackOnButtonClick: () => {},
  customMenu: false
};

MenuButton.validate_props = function (props) {
  ll_assert_native_type("object", props, props.items);
  ll_assert_native_type("string", props.menuTitle, props.id);
  return;
};