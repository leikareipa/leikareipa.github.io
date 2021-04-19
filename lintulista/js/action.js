"use strict";

import { LL_BaseType } from "./base-type.js";
import { ll_assert_native_type } from "./assert.js";
import { ll_crash_app } from "./crash-app.js";
import { ll_error_popup, ll_message_popup } from "./message-popup.js";
export const LL_Action = function (props = {}) {
  ll_assert_native_type("object", props);
  props = { ...props,
    on_error: typeof props.on_error === "function" ? props.on_error : async () => {},
    finally: typeof props.finally === "function" ? props.finally : async () => {},
    successMessage: typeof props.successMessage === "string" ? props.successMessage : undefined
  };
  ll_assert_native_type("function", props.act, props.on_error, props.finally);
  ll_assert_native_type("string", props.failMessage);
  const publicInterface = Object.freeze({
    async_nocatch: async function (args = {}) {
      return this.async(args, true);
    },
    async: async function (args = {}, noCatch = false) {
      try {
        const actionResult = await props.act(args);

        if (actionResult !== undefined && typeof props.successMessage === "string") {
          ll_message_popup(props.successMessage);
        }

        return actionResult;
      } catch (error) {
        if (noCatch) {
          console.warn("Silently caught in Action:", error);
          throw error;
        } else {
          await props.on_error(error, args);
          console.warn("Caught in Action:", error);
          ll_error_popup(props.failMessage);
        }

        return null;
      } finally {
        try {
          await props.finally(args);
        } catch (error) {
          console.warn("Fatal error in Action's finally:", error);
          ll_crash_app(error);
        }
      }
    },
    ...LL_BaseType(LL_Action)
  });
  return publicInterface;
};