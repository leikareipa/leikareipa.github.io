"use strict";

import { ll_assert_native_type } from "./assert.js";
import { LL_BaseType } from "./base-type.js";
import { ll_error_popup__, ll_message_popup } from "./message-popup.js";
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
          await props.on_error(args);
          console.warn("Caught in Action:", error);
          ll_error_popup__(props.failMessage);
        }

        return null;
      } finally {
        await props.finally(args);
      }
    },
    ...LL_BaseType(LL_Action)
  });
  return publicInterface;
};