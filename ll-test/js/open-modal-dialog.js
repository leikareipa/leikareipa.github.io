"use strict";

import { ll_error_popup } from "./message-popup.js";
import { darken_viewport } from "./darken-viewport.js";
import { ll_assert } from "./assert.js";
import { store } from "./redux-store.js";
export function open_modal_dialog(dialog, parameters = {}) {
  const dialogContainer = document.createElement("div");
  let shades = null;
  parameters.onAccept == (parameters.onAccept || (async () => {}));
  parameters.onReject == (parameters.onReject || (async () => {}));
  parameters.onClose == (parameters.onClose || (async () => {}));
  return (async () => {
    ll_assert(dialogContainer, "Can't find a container to put the model dialog into.");
    shades = await darken_viewport({
      z: 110,
      opacity: 0.5
    });
    const dialogElement = React.createElement(dialog, { ...parameters,
      onDialogAccept: async returnData => {
        await run_callback(parameters.onAccept, returnData);
        close_this_dialog();
        return returnData;
      },
      onDialogReject: async () => {
        await run_callback(parameters.onReject);
        close_this_dialog();
        return;
      }
    });
    document.body.appendChild(dialogContainer);
    ReactDOM.render(React.createElement(ReactRedux.Provider, {
      store: store
    }, dialogElement), dialogContainer);
  })();

  async function run_callback(fn = async function () {}, args = {}) {
    try {
      await fn(args);
    } catch (error) {
      ll_error_popup(error);
    }

    return;
  }

  async function close_this_dialog() {
    if (dialogContainer.childElementCount) {
      ReactDOM.unmountComponentAtNode(dialogContainer);
    }

    dialogContainer.remove();
    await run_callback(parameters.onClose);
    await shades.remove();
  }
}