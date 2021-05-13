/*
 * Most recent known filename: js/common.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Various functions that may (or might not) be used across the program.
 *
 */

"use strict"

function k_assert(condition = false, explanation = "(no reason given)")
{
    if (!condition)
    {
        throw Error("Assertion failed: " + explanation);
    }
}

// Linear interpolation.
function k_lerp(x = 0, y = 0, interval = 0)
{
    return (x + (interval * (y - x)));
}

// Append the given named property with the given value as a constant property of
// the given object.
function k_const_property(object = {}, propertyName = "", value = 0)
{
    k_assert((object instanceof Object), "Expected an object type.");
    k_assert((propertyName.length > 0), "Did not expect an empty property name.");
    
    Object.defineProperty(object, propertyName,
                          { value: value,
                            writable: false,
                            enumerable: true,
                            configurable: false });
    
    k_assert((object.hasOwnProperty(propertyName) === true), "Failed to make a const property.");
}
