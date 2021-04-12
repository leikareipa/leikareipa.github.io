"use strict";

import { ll_assert } from "./assert.js";
const typeKey = "__$ll_type";
const knownTypes = [];
export const LL_BaseType = function (type) {
  ll_assert(typeof type === "function", "Invalid argument.");
  knownTypes.push(type);
  return {
    [typeKey]: type
  };
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