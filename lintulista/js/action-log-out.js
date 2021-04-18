"use strict";

import { LL_Action } from "./action.js";
import { LL_Backend } from "./backend.js";
import { ll_assert_type } from "./assert.js";
export const lla_log_out = LL_Action({
  failMessage: "Logout failed",
  successMessage: "You've logged out",
  act: async function ({
    backend
  }) {
    ll_assert_type(LL_Backend, backend);
    await backend.logout();
    return true;
  }
});