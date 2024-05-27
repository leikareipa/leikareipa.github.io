/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import textures from "../textures.js";

export const editMessage = w95.widget(function editMessage({
    x = 0,
    y = 0,
    width = 100,
    height = 200,
    from = "Tom",
    message = "",
    onAccept = undefined,
    onReject = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof from === "string");
    w95.debug?.assert(typeof message === "string");
    w95.debug?.assert(typeof onAccept === "function");
    w95.debug?.assert(typeof onReject === "function");

    const editedMessage = w95.state(message);

    const originalX = w95.state(x);
    const originalY = w95.state(y);
    x = w95.state(x);
    y = w95.state(y);

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width },
        get height() { return height },
        Opened() {
            editedMessage.set(message);
        },
        Closed() {
            x.set(originalX.now);
            y.set(originalY.now);
        },
        Form() {
            return w95.widget.dialog({
                width,
                height,
                title: `Edit ${from}'s message`,
                move(deltaX, deltaY) {
                    x.set(deltaX + x.now);
                    y.set(deltaY + y.now);
                },
                children: [
                    w95.widget.verticalLayout({
                        x: 6,
                        y: 6,
                        width: "pw - 12",
                        children: [
                            w95.widget.textEdit({
                                width: "pw",
                                height: 80,
                                state: editedMessage,
                                font: w95.font.sansSerif[8],
                            }),
                            w95.widget.layoutSpacer({
                                height: 1,
                            }),
                            w95.widget.horizontalLayout({
                                width: "pw",
                                height: 16,
                                padding: 4,
                                styleHints: [
                                    w95.styleHint.alignVCenter,
                                    w95.styleHint.alignLeft,
                                ],
                                children: [
                                    w95.widget.button({
                                        width: 16,
                                        height: 16,
                                        icon: textures.clear,
                                        onClick() {
                                            editedMessage.set("");
                                        },
                                    }),
                                ],
                            }),
                            w95.widget.horizontalRule({
                                width: "pw",
                            }),
                            w95.widget.layoutSpacer({
                                height: 3,
                            }),
                            w95.widget.horizontalLayout({
                                width: "pw",
                                padding: 6,
                                styleHints: [
                                    w95.styleHint.alignRight,
                                ],
                                children: [
                                    w95.widget.button({
                                        width: 60,
                                        text: "OK",
                                        onClick: accept,
                                    }),
                                    w95.widget.button({
                                        width: 60,
                                        text: "Cancel",
                                        onClick: reject,
                                    }),
                                ],
                            }),
                        ]
                    }),
                ],
                onClose() {
                    onReject();
                },
            });
        },
    };

    function accept() {
        onAccept(editedMessage.now);
    }

    function reject() {
        onReject();
    }
});
