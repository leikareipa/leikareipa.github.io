"use strict";

import { darken_viewport } from "./darken-viewport.js";
import { LL_BaseType } from "./base-type.js";
import { LL_PrivateError } from "./private-error.js";
import { LL_PublicError } from "./public-error.js";
export function ll_assert(condition, failMessage = "") {
  if (!condition) {
    throw LL_PrivateError(failMessage);
  }

  return;
}
export function ll_public_assert(condition, failMessage = "") {
  if (!condition) {
    throw LL_PublicError(failMessage);
  }

  return;
}
export function ll_assert_type(type, ...objects) {
  ll_assert(LL_BaseType.is_known_type(type), "Unrecognized type.");

  for (const object of objects) {
    if (!type.is_parent_of(object)) {
      throw LL_PrivateError(`Unexpected object type. Expected ${type.name}.`);
    }
  }

  return;
}
export function ll_assert_native_type(typeName = "", ...variables) {
  ll_assert(typeof typeName === "string", "Invalid argument.");

  for (const variable of variables) {
    let isOfType = false;

    switch (typeName) {
      case "array":
        isOfType = Array.isArray(variable);
        break;

      default:
        isOfType = typeof variable === typeName;
        break;
    }

    if (!isOfType) {
      throw LL_PrivateError(`Unexpected variable type "${typeof variable}". Expected "${typeName}".`);
    }
  }

  return;
}
export function is_defined(property) {
  return typeof property !== "undefined";
}
export function expect_true(expect = []) {
  ll_assert_native_type("array", expect);
  const expectFailed = expect.map((test, idx) => ({
    run: test,
    idx
  })).filter(test => test.run() !== true);

  if (expectFailed.length) {
    console.error(...["Not strictly true:\n", ...expectFailed.map(failedTest => `#${failedTest.idx + 1}: ${failedTest.run.toString()}\n`)]);
  }

  return !expectFailed.length;
}
export function throw_if_not_true(expect = []) {
  ll_assert_native_type("array", expect);

  if (!expect_true(expect)) {
    throw "assertion failure";
  }

  return;
}