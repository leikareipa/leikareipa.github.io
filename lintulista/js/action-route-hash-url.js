"use strict";

import { LL_Action } from "./action.js";
import { ll_assert_native_type } from "./assert.js";
import { ll_crash_app } from "./crash-app.js";
export const lla_route_hash_url = LL_Action({
  failMessage: "Unrecognized URL",
  act: async ({
    lintulistaUrl,
    routes
  }) => {
    ll_assert_native_type("string", lintulistaUrl);
    ll_assert_native_type("object", routes);
    const route = routes.filter(r => lintulistaUrl.match(r.url))[0];
    ll_assert_native_type("object", route);
    ll_assert_native_type("function", route.go);
    await route.go(lintulistaUrl);
    return true;
  },
  on_error: async error => {
    ll_crash_app(error);
  }
});