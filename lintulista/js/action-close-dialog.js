"use strict";

import { LL_Action } from "./action.js";
import { ll_assert_native_type } from "./assert.js";
import { ll_crash_app } from "./crash-app.js";
const dialogContainerClass = "ll-dialog-container";
export const lla_close_dialog = LL_Action({
  failMessage: "Failed to close dialogs",
  act: async function ({
    dialog
  }) {
    ll_assert_native_type("function", dialog);
    const dialogs = document.querySelectorAll(`.${dialogContainerClass}.${dialog.name}`);

    for (let i = 0; i < dialogs.length; i++) {
      dialogs[i].remove();
    }

    {
      const shades = Array.from(document.querySelectorAll("[id^=shades-generated]"));

      for (const shade of shades) {
        shade.remove();
      }
    }
    return;
  },
  on_error: async function (error) {
    ll_crash_app(error);
  }
});