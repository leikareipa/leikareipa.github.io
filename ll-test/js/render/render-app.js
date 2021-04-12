"use strict";

import { ObservationList } from "../react-components/observation-list/ObservationList.js";
import { BackendAccess } from "../backend-access.js";
import { store } from "../redux-store.js";
export async function start_app(listKey, container) {
  const backend = await BackendAccess(listKey, store);
  ReactDOM.render(React.createElement(ReactRedux.Provider, {
    store: store
  }, React.createElement(ObservationList, {
    backend: backend
  })), container);
}