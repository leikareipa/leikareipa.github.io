"use strict";

import { ObservationList } from "./react-components/observation-list/ObservationList.js";
import { LL_Backend } from "./backend.js";
import { LL_Action } from "./action.js";
import { LL_Throwable } from "./throwable.js";
import { ll_assert_native_type } from "./assert.js";
import { ll_crash_app } from "./crash-app.js";
import { ll_hash_route } from "./hash-router.js";
import { store } from "./redux-store.js";
export const lla_start_lintulista = LL_Action({
  failMessage: "Lintulista failed to start",
  act: async ({
    listKey
  }) => {
    const container = document.querySelector("#lintulista #app-container");
    ll_assert_native_type("string", listKey);
    ll_assert_native_type(Element, container);
    const backend = await LL_Backend(listKey, store);
    ReactDOM.render(React.createElement(ReactRedux.Provider, {
      store: store
    }, React.createElement(ObservationList, {
      backend: backend
    })), container);
    document.querySelector("#lintulista").classList.add("app-running");
    return true;
  },
  on_error: async error => {
    if (LL_Throwable.is_parent_of(error) && error.message === "404 Not Found") {
      ll_hash_route("/404");
    } else {
      ll_crash_app(error);
    }
  },
  finally: async () => {
    const headerElement = document.querySelector("#lintulista > header");

    if (headerElement instanceof Element) {
      headerElement.classList.add("paused");
    }

    ;
  }
});