"use strict";

import { store } from "../redux-store.js";
import { ll_assert_native_type } from "../assert.js";
import start_lintulista from "../action-start-app.js";
export async function start_app(listKey, container, startupOptions = {}) {
  ll_assert_native_type("string", listKey);
  ll_assert_native_type("object", startupOptions);
  set_startup_options(startupOptions);
  await start_lintulista.async({
    container,
    startupOptions,
    listKey,
    store
  });
  return;
}

function set_startup_options(options = {}) {
  ll_assert_native_type("object", options);

  if (options.hasOwnProperty("language")) {
    store.dispatch({
      type: "set-language",
      language: options.language
    });
  }

  if (options.hasOwnProperty("is100LajiaMode")) {
    store.dispatch({
      type: "set-100-lajia-mode",
      isEnabled: options.is100LajiaMode
    });
  }

  return;
}