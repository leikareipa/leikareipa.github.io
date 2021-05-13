/*
 * Most recent known filename: js/color.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 */

"use strict"

const color_n = {};
{
    // Red, green, blue, alpha.
    color_n.rgba_o = function(r = 127, g = 127, b = 127, a = 255)
    {
        k_assert((((r >= 0) && (r <= 255)) &&
                  ((g >= 0) && (g <= 255)) &&
                  ((b >= 0) && (b <= 255)) &&
                  ((a >= 0) && (a <= 255))), "The given color values are out of range.");

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        
        // Returns the color as a "#rrggbb" string. Ignores alpha.
        this.to_hex = function()
        {
            const hex_value = function(value)
            {
                return (((value < 10)? "0" : "") + value.toString(16));
            };

            return ("#" + hex_value(this.r) + hex_value(this.g) + hex_value(this.b));
        }
    }
}
