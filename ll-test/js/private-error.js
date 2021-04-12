"use strict";

import { ll_assert_native_type } from "./assert.js";
import { LL_BaseType } from "./base-type.js";
export const LL_PrivateError = function (message = "Unknown error") {
  ll_assert_native_type("string", message);
  const publicInterface = {
    isPrivate: true,
    message,
    ...LL_BaseType(LL_PrivateError)
  };
  return publicInterface;
};

LL_PrivateError.is_parent_of = function (candidate) {
  return LL_BaseType.type_of(candidate) === LL_PrivateError && candidate.hasOwnProperty("isPrivate") && candidate.hasOwnProperty("message") && candidate.isPrivate === true;
};