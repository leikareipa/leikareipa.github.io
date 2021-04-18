"use strict";

import { LL_Action } from "./action.js";
import { ll_assert_native_type } from "./assert.js";
import { darken_viewport } from "./darken-viewport.js";
import { store } from "./redux-store.js";
const dialogContainerClass = "ll-dialog-container";
export const lla_open_dialog = LL_Action({
  failMessage: "Failed to execute a dialog",
  act: async function ({
    dialog,
    args = {}
  }) {
    ll_assert_native_type("function", dialog);
    ll_assert_native_type("object", args);
    const dialogContainer = document.createElement("div");
    ll_assert_native_type(Element, dialogContainer);
    dialogContainer.className = `${dialogContainerClass} ${dialog.name}`;
    await darken_viewport({
      z: 110,
      opacity: 0.5
    });
    const dataFromDialog = await new Promise(resolve => {
      const dataReturned = {};
      const dialogElement = React.createElement(dialog, {
        args,
        return: dataReturned,
        onAccept: () => resolve(dataReturned),
        onReject: () => resolve(null)
      });
      document.body.appendChild(dialogContainer);
      ReactDOM.render(React.createElement(ReactRedux.Provider, {
        store: store
      }, dialogElement), dialogContainer);
    });
    return dataFromDialog;
  }
});