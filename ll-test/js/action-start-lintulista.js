"use strict";

import { ObservationList } from "./react-components/observation-list/ObservationList.js";
import { LL_Backend } from "./backend.js";
import { ll_assert_native_type } from "./assert.js";
import { LL_Action } from "./action.js";
import { tr } from "./translator.js";
import { store } from "./redux-store.js";
export const lla_start_lintulista = LL_Action({
  failMessage: "Lintulista couldn't be started",
  act: async ({
    listKey
  }) => {
    const container = document.querySelector("#lintulista #app-container");
    ll_assert_native_type("string", listKey);
    ll_assert_native_type(Element, container);
    {
      document.querySelector("#lintulista > header").classList.add("glide");
      ReactDOM.render(React.createElement("div", {
        className: "startup-loading-spinner"
      }, tr("Loading Lintulista. Just a moment...")), container);
    }
    const backend = await LL_Backend(listKey, store);
    ReactDOM.render(React.createElement(ReactRedux.Provider, {
      store: store
    }, React.createElement(ObservationList, {
      backend: backend
    })), container);
    document.querySelector("#lintulista").classList.add("app-running");
    return true;
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