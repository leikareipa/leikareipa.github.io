"use strict";

import { QueryLoginCredentials } from "./react-components/dialogs/QueryLoginCredentials.js";
import { LL_Action } from "./action.js";
import { LL_Backend } from "./backend.js";
import { lla_open_dialog } from "./action-open-dialog.js";
import { lla_close_dialog } from "./action-close-dialog.js";
import { ll_assert_type } from "./assert.js";
export const lla_log_in = LL_Action({
  failMessage: "Login failed",
  successMessage: "You've logged in",
  act: async function ({
    backend
  }) {
    ll_assert_type(LL_Backend, backend);
    const credentials = await lla_open_dialog.async_nocatch({
      dialog: QueryLoginCredentials
    });

    if (credentials) {
      await backend.login(credentials.username, credentials.password);
      return true;
    }

    return;
  },
  finally: async function () {
    await lla_close_dialog.async({
      dialog: QueryLoginCredentials
    });
  }
});