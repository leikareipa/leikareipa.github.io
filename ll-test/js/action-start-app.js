"use strict";

import { ObservationList } from "./react-components/observation-list/ObservationList.js";
import { BackendAccess } from "./backend-access.js";
import { LL_Action } from "./action.js";
import { tr } from "./translator.js";
export default LL_Action({
  failMessage: "Failed to start Lintulista.",
  act: async ({
    listKey,
    store,
    container
  }) => {
    {
      document.querySelector("#lintulista > header").classList.add("glide");
      ReactDOM.render(React.createElement("div", {
        className: "startup-loading-spinner"
      }, tr("Loading Lintulista. Just a moment...")), container);
    }
    const backend = await BackendAccess(listKey, store);
    ReactDOM.render(React.createElement(ReactRedux.Provider, {
      store: store
    }, React.createElement(ObservationList, {
      backend: backend
    })), container);
    document.querySelector("#lintulista").classList.add("app-running");
  },
  on_error: async ({
    container
  }) => {
    container.innerHTML = "";
  },
  finally: async () => {
    document.querySelector("#lintulista > header").classList.add("paused");
  }
});