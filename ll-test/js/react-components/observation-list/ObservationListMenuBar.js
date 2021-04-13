"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { open_modal_dialog } from "../../open-modal-dialog.js";
import { QueryLoginCredentials } from "../dialogs/QueryLoginCredentials.js";
import { BirdSearch } from "../bird-search/BirdSearch.js";
import { MenuButton } from "../buttons/MenuButton.js";
import { CheckBoxButton } from "../buttons/CheckBoxButton.js";
import { Button } from "../buttons/Button.js";
import { tr } from "../../translator.js";
import { ll_error_popup } from "../../message-popup.js";
export function ObservationListMenuBar(props = {}) {
  ObservationListMenuBar.validate_props(props);
  const isLoggedIn = ReactRedux.useSelector(state => state.isLoggedIn);
  const is100LajiaMode = ReactRedux.useSelector(state => state.is100LajiaMode);
  const setIs100LajiaMode = ReactRedux.useDispatch();
  const setLanguage = ReactRedux.useDispatch();
  const [isBarSticky, setIsBarSticky] = React.useState(false);
  React.useEffect(() => {
    update_sticky_scroll();
    window.addEventListener("scroll", update_sticky_scroll);
    return () => {
      window.removeEventListener("scroll", update_sticky_scroll);
    };

    function update_sticky_scroll() {
      const stickThresholdY = 220;

      if (!isBarSticky && window.scrollY > stickThresholdY) {
        setIsBarSticky(true);
      } else if (isBarSticky && window.scrollY <= stickThresholdY) {
        setIsBarSticky(false);
      }
    }
  });
  return React.createElement("div", {
    className: `ObservationListMenuBar ${isBarSticky ? "sticky" : ""}`
  }, React.createElement(BirdSearch, {
    backend: props.backend
  }), React.createElement("div", {
    className: "buttons"
  }, React.createElement(CheckBoxButton, {
    iconChecked: "fas fa-check-square fa-fw fa-lg",
    iconUnchecked: "fas fa-square fa-fw fa-lg",
    tooltip: tr("100 Species Challenge"),
    showTooltip: !isBarSticky,
    title: tr("See your standing in the 100 Species Challenge"),
    isChecked: is100LajiaMode,
    callbackOnButtonClick: isChecked => setIs100LajiaMode({
      type: "set-100-lajia-mode",
      isEnabled: isChecked
    })
  }), React.createElement(MenuButton, {
    icon: "fas fa-question fa-fw fa-lg",
    id: "list-info",
    title: tr("Information"),
    menuTitle: "Lintulista",
    items: [{
      text: tr("Image info"),
      callbackOnSelect: () => window.open("./guide/images.html")
    }, {
      text: tr("User's guide"),
      callbackOnSelect: () => window.open("./guide/")
    }, {
      text: "GitHub",
      callbackOnSelect: () => window.open("https://github.com/leikareipa/lintulista/")
    }],
    showTooltip: false
  }), React.createElement(Button, {
    className: `lock ${isLoggedIn ? "unlocked" : "locked"}`,
    title: isLoggedIn ? tr("Log out") : tr("Log in to edit the list"),
    icon: isLoggedIn ? "fas fa-user fa-fw fa-lg" : "fas fa-lock fa-fw fa-lg",
    callbackOnButtonClick: handle_login_button_click
  }), React.createElement(MenuButton, {
    icon: "fas fa-language fa-fw",
    id: "list-sorting",
    title: tr("Language"),
    menuTitle: tr("Language"),
    items: [{
      text: "English",
      callbackOnSelect: () => setLanguage({
        type: "set-language",
        language: "enEN"
      })
    }, {
      text: "Latine",
      callbackOnSelect: () => setLanguage({
        type: "set-language",
        language: "lat"
      })
    }, {
      text: "Suomi",
      callbackOnSelect: () => setLanguage({
        type: "set-language",
        language: "fiFI"
      })
    }],
    showTooltip: false
  })));

  async function handle_login_button_click() {
    if (isLoggedIn) {
      try {
        await props.backend.logout();
      } catch (error) {
        ll_error_popup(error);
      }
    } else {
      await open_modal_dialog(QueryLoginCredentials, {
        onAccept: async function ({
          username,
          password
        }) {
          await props.backend.login(username, password);
        }
      });
    }

    return;
  }
}
ObservationListMenuBar.defaultProps = {
  enabled: true
};

ObservationListMenuBar.validate_props = function (props) {
  ll_assert_native_type("object", props, props.backend);
  return;
};