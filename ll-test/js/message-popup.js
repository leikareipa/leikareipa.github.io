"use strict";

import { tr } from "./translator.js";
import { ll_assert_native_type } from "./assert.js";
import { LL_Throwable } from "./throwable.js";
export function ll_message_popup(message = "") {
  ll_assert_native_type("string", message);
  popup(tr(message), {
    type: "action"
  });
  return;
}
export function ll_error_popup__(errorMessage = "") {
  ll_assert_native_type("string", errorMessage);
  popup(tr(errorMessage), {
    type: "error"
  });
  return;
}
export function ll_error_popup(error = {}) {
  const errorMessage = error.message || error.reason.message || "Unknown error";

  if (LL_Throwable.is_parent_of(error)) {
    console.error(`Lintulista: ${errorMessage}`);
  } else {
    console.error(`External error: ${errorMessage}`);
  }
}

function popup(string = "", args = {}) {
  ll_assert_native_type("string", string);
  ll_assert_native_type("object", args);
  args = {
    type: "action",
    timeoutMs: 4500,
    ...args
  };
  ll_assert_native_type("number", args.timeoutMs);
  ll_assert_native_type("string", args.type);

  const faIcon = (() => {
    const meta = "fa-fw";

    switch (args.type) {
      case "action":
        return `${meta} fas fa-check`;

      case "error":
        return `${meta} fas fa-exclamation-triangle`;

      default:
        return `${meta} fas fa-comment`;
    }
  })();

  const popupElement = document.createElement("div");
  const iconElement = document.createElement("i");
  const textContainer = document.createElement("div");
  iconElement.classList.add(...`icon-element ${faIcon}`.split(" "));
  textContainer.classList.add("text-container");
  popupElement.classList.add("popup-notification", args.type);
  textContainer.innerHTML = string;
  popupElement.appendChild(iconElement);
  popupElement.appendChild(textContainer);
  popupElement.onclick = close_popup;
  const container = document.getElementById("popup-notifications-container");
  ll_assert_native_type(Element, container);
  container.appendChild(popupElement);
  update_vertical_positions();
  popupElement.animate([{
    bottom: "-75px"
  }, {
    bottom: "0"
  }], {
    duration: 300,
    easing: "ease-out"
  });
  const removalTimer = args.timeoutMs <= 0 ? false : setTimeout(close_popup, args.timeoutMs);
  const publicInterface = Object.freeze({
    close: close_popup
  });
  return publicInterface;

  function close_popup() {
    clearTimeout(removalTimer);
    const fadeout = popupElement.animate([{
      opacity: "0"
    }], {
      duration: 300,
      easing: "ease-in-out"
    });

    fadeout.onfinish = () => {
      popupElement.remove();
      update_vertical_positions();
    };

    return;
  }

  function update_vertical_positions() {
    ll_assert_native_type(Element, container);
    const popups = container.childNodes;

    for (let i = 1; i < popups.length; i++) {
      popups[i].style.bottom = `${75 * (popups.length - i - 1)}px`;
    }
  }
}