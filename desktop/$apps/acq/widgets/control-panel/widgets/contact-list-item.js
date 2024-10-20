/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import {appicon16} from "../../textures.js";

export const contactListItem = w95.widget(function contactListItem({
    x = 0,
    y = 0,
    width = 100,
    isOnline = true,
    isSelected = false,
    contact = undefined,
    onClick = undefined,
    onDoubleClick = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof contact === "object");
    w95.debug?.assert(typeof isOnline === "boolean");
    w95.debug?.assert(typeof isSelected === "boolean");
    w95.debug?.assert(["undefined", "function"].includes(typeof onClick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onDoubleClick));

    const height = 20;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Form() {
            return [
                w95.widget.panel({
                    width,
                    height,
                    color: (
                        isSelected
                            ? w95.palette.named.navy
                            : Rngon.color(235, 235, 235)
                    ),
                    onClick,
                    onDoubleClick,
                }),
                w95.widget.bitmap({
                    x: 1,
                    y: ~~((height - appicon16.height) / 2),
                    image: appicon16,
                    isDisabled: !isOnline,
                }),
                w95.widget.label({
                    x: 20,
                    width: "pw - 21 - 16",
                    height,
                    text: (contact?.name || ""),
                    styleHints: [
                        w95.styleHint.alignVCenter,
                    ],
                    elide: true,
                    color: (
                        isSelected
                            ? w95.palette.named.white
                            : w95.palette.window.foreground
                    ),
                }),
            ];
        },
    };
});
