"use strict";

import { ll_assert_native_type } from "./assert.js";
import { LL_BaseType } from "./base-type.js";
import { ll_error_popup } from "./message-popup.js";
export const LL_Action = function (funcs = {}) {
  ll_assert_native_type("object", funcs);
  funcs = { ...funcs,
    on_error: funcs.hasOwnProperty("on_error") ? funcs.on_error : async () => {},
    finally: funcs.hasOwnProperty("finally") ? funcs.finally : async () => {}
  };
  ll_assert_native_type("function", funcs.act, funcs.on_error, funcs.finally);
  ll_assert_native_type("string", funcs.failMessage);
  let latestError = null;
  const publicInterface = Object.freeze({
    get latestError() {
      return latestError;
    },

    async: async function (args = {}) {
      try {
        await funcs.act(args);
        return true;
      } catch (error) {
        latestError = error;
        await funcs.on_error(args);
        ll_error_popup(error);
        return false;
      } finally {
        await funcs.finally(args);
      }
    },
    ...LL_BaseType(LL_Action)
  });
  return publicInterface;
};