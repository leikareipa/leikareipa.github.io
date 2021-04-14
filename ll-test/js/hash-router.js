"use strict";

import { ll_assert, ll_assert_native_type } from "./assert.js";
import { start_app } from "./render/render-app.js";
import { store } from "./redux-store.js";
const routes = [{
  url: new RegExp("^#[a-z]{9}/?"),
  go: route_list
}, {
  url: /.*/,
  go: route_404
}];
export function ll_hash_route(lintulistaUrl = "") {
  ll_assert_native_type("string", lintulistaUrl);
  const route = routes.filter(r => lintulistaUrl.match(r.url))[0];
  ll_assert_native_type("object", route);
  ll_assert_native_type("function", route.go);
  route.go(lintulistaUrl);
  return;
}
export function ll_hash_navigate(parameter, newValue) {
  ll_assert_native_type("string", parameter, newValue);

  switch (parameter) {
    case "language":
      {
        store.dispatch({
          type: "set-language",
          language: newValue
        });
        add_part_to_window_hash("lang", newValue);
        break;
      }
  }

  return;
}

function add_part_to_window_hash(parameter = "", value = "") {
  ll_assert_native_type("string", parameter, value);
  const oldOnHashChangeHandler = window.onhashchange;
  window.onhashchange = undefined;
  window.location.hash = hash_with_parameter(parameter, value);
  setTimeout(() => {
    window.onhashchange = oldOnHashChangeHandler;
  }, 0);
  return;
}

function hash_with_parameter(parameter = "", value = "") {
  ll_assert_native_type("string", parameter, value);
  let hash = window.location.hash.replace("#", "");
  const parameterRegexp = new RegExp(`${parameter}/.*(/|$)`);

  if (hash.match(parameterRegexp)) {
    hash = hash.replace(parameterRegexp, `${parameter}/${value}`);
  } else {
    hash += `/${parameter}/${value}`;
  }

  return hash;
}

function route_list(url) {
  const container = document.querySelector("#lintulista #app-container");
  ll_assert(container, "Invalid DOM tree.");
  const keyRegexp = /#([a-z]{9})/;
  ll_assert(url.match(keyRegexp), "Invalid list URL.");
  const startupOptions = {};
  {
    for (const language of ["fiFI", "enEN", "lat"]) {
      if (url.match(new RegExp(`\/lang\/${language}\/?`))) {
        startupOptions.language = language;
      }
    }

    if (url.match(/\/100\/?/)) startupOptions.is100LajiaMode = true;
  }
  const listKey = url.match(keyRegexp)[1];
  start_app(listKey, container, startupOptions);
  return;
}

function route_404(url) {
  console.log("oops");
  return;
}