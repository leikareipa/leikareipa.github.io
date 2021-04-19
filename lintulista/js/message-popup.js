"use strict";

import { tr } from "./translator.js";
import { ll_assert_native_type } from "./assert.js";
export function ll_message_popup(message = "") {
  ll_assert_native_type("string", message);
  popup(tr(message), {
    type: "action"
  });
  return;
}
export function ll_error_popup(errorMessage = "") {
  ll_assert_native_type("string", errorMessage);
  popup(tr(errorMessage), {
    type: "error"
  });
  return;
}

function popup(string = "", args = {}) {
  ll_assert_native_type("string", string);
  ll_assert_native_type("object", args);
  args = {
    type: "action",
    timeoutMs: 5000,
    ...args
  };
  ll_assert_native_type("number", args.timeoutMs);
  ll_assert_native_type("string", args.type);

  const faIcon = (() => {
    const meta = "fa-fw";

    switch (args.type) {
      case "action":
        return `${meta} fas fa-feather-alt`;

      case "error":
        return `${meta} fas fa-exclamation-triangle`;

      default:
        return `${meta} fas fa-comment`;
    }
  })();

  const popupVerticalSpacing = 10;
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
  append_transition_in();
  const removalTimer = args.timeoutMs <= 0 ? false : setTimeout(close_popup, args.timeoutMs);
  const publicInterface = Object.freeze({
    close: () => close_popup(true)
  });
  return publicInterface;

  function close_popup(initiatedByUser = false) {
    if (initiatedByUser && popupElement.classList.contains("transitioning-in")) {
      return;
    }

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

  function append_transition_in() {
    popupElement.classList.add("transitioning-in");
    const bottomMostPopup = Array.from(container.children).filter(p => p.classList.contains("popup-notification")).pop();
    const startOffset = -((bottomMostPopup || popupElement).clientHeight + popupVerticalSpacing);
    const slidein = popupElement.animate([{
      opacity: "0",
      bottom: `${startOffset}px`
    }, {
      opacity: "1",
      bottom: "0"
    }], {
      duration: 300,
      easing: "ease-out"
    });

    slidein.onfinish = () => popupElement.classList.remove("transitioning-in");
  }

  function update_vertical_positions() {
    ll_assert_native_type(Element, container);
    const popups = Array.from(container.children).filter(p => p.classList.contains("popup-notification"));
    ll_assert_native_type("array", popups);

    if (!popups.length) {
      return;
    }

    let totalHeight = popups.reduce((totalHeight, popup) => {
      return totalHeight + popup.offsetHeight + popupVerticalSpacing;
    }, 0);

    for (const popup of popups) {
      popup.style.bottom = `${totalHeight -= popup.offsetHeight + popupVerticalSpacing}px`;
    }
  }
}