"use strict";

import { ll_assert, ll_assert_native_type } from "./assert.js";
const typeKey = "__$ll_type";
const knownTypes = [];
export const LL_BaseType = function (type) {
  ll_assert_native_type("function", type);
  knownTypes.push(type);
  return {
    [typeKey]: type
  };
};

LL_BaseType.assign = function (type, dstObject = {}) {
  ll_assert_native_type("function", type);
  ll_assert_native_type("object", dstObject);
  ll_assert(!dstObject.hasOwnProperty(typeKey), "Type key collision.");
  dstObject[typeKey] = type;
  knownTypes.push(type);
  return;
};

LL_BaseType.is_known_type = function (type) {
  return knownTypes.includes(type) && typeof type.is_parent_of === "function";
};

LL_BaseType.type_of = function (object = {}) {
  if (typeof object !== "object" || !object.hasOwnProperty(typeKey)) {
    return null;
  }

  return object[typeKey];
};