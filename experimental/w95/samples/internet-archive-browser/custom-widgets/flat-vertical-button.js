/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import {icons} from "../assets/icons.js";

export const flatVerticalButton = w95.widget(function flatVerticalButton({
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    text = "",
    icon = undefined,
    onClick = undefined,
    isDisabled = false,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(["undefined", "object"].includes(typeof icon));
    w95.debug?.assert(["undefined", "function"].includes(typeof onClick));

    const isHovered = w95.state(false);
    const isPressed = w95.state(false);

    const isVisuallyPressed = (
        !isDisabled &&
        isPressed.now &&
        isHovered.now
    );
    
    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Form() {
            return [
                w95.widget.frame({
                    width,
                    height,
                    isGrabbable: true,
                    shape: (
                        (isHovered.now && !isDisabled)
                            ? w95.frameShape.box
                            : w95.frameShape.none
                    ),
                    styleHints: [
                        ((isPressed.now && !isDisabled)? 0 : w95.styleHint.raised),
                    ],
                    onClick: (
                        isDisabled
                            ? undefined
                            : onClick
                    ),
                    onMouseEnter() {
                        isHovered.set(true);
                    },
                    onMouseLeave() {
                        isHovered.set(false);
                    },
                    onMouseDown() {
                        isPressed.set(true);
                    },
                    onMouseUp() {
                        isPressed.set(false);
                    },
                    children: [
                        w95.widget.frame({
                            x: ~~isVisuallyPressed,
                            y: ~~isVisuallyPressed,
                            shape: w95.frameShape.none,
                            width,
                            height,
                            children: [
                                w95.widget.verticalLayout({
                                    y: -1,
                                    width,
                                    height,
                                    styleHints:  [
                                        w95.styleHint.alignVCenter,
                                        w95.styleHint.alignHCenter,
                                    ],
                                    children: [
                                        w95.widget.layoutSpacer({
                                            height: ([icons.buttonLeft, icons.buttonRight].includes(icon)? 6 : 3),
                                        }),
                                        w95.widget.bitmap({
                                            image: icon,
                                            isDisabled: !isHovered.now,
                                        }, {
                                            hideIf: !icon,
                                        }),
                                        w95.widget.layoutSpacer({
                                            height: ([icons.buttonLeft, icons.buttonRight].includes(icon)? 3 : 0),
                                        }),
                                        w95.widget.label({
                                            text,
                                            styleHints: [
                                                w95.styleHint.action,
                                                w95.styleHint.alignHCenter,
                                            ],
                                        }, {
                                            hideIf: !text.length,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ];
        },
    };
});