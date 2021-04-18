"use strict";

import { ll_assert_native_type } from "./assert.js";
import { LL_BaseType } from "./base-type.js";
export const LL_Throwable = function (message = "Unspecified error") {
  ll_assert_native_type("string", message);
  const publicInterface = new Error(message);
  LL_BaseType.assign(LL_Throwable, publicInterface);
  return publicInterface;
};

LL_Throwable.is_parent_of = function (candidate) {
  return LL_BaseType.type_of(candidate) === LL_Throwable;
};