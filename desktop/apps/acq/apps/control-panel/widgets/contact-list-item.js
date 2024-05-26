/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import chatWindow from "../../chat-window/app.js";
import {appicon16} from "../../textures.js";

export const contactListItem = w95.widget(function contactListItem({
    x = 0,
    y = 0,
    width = 100,
    isOnline = true,
    isSelected = false,
    onClick = undefined,
    onDoubleClick = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof isOnline === "boolean");
    w95.debug?.assert(typeof isSelected === "boolean");
    w95.debug?.assert(["undefined", "function"].includes(typeof onClick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onDoubleClick));

    width = w95.state(width);
    isOnline = w95.state(isOnline);
    isSelected = w95.state(isSelected);
    onClick = w95.state(onClick);
    const contact = w95.state();
    const isHidden = w95.state(true);

    const height = 20;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width.now },
        get height() { return height },
        Form() {
            return w95.widget.frame({
                x: 1,
                height,
                width: (width.now - 2),
                shape: w95.frameShape.none,
                backgroundColor: (
                    isSelected.now
                        ? w95.palette.named.navy
                        : w95.palette.named.transparent
                ),
                onClick: onClick.now,
                onDoubleClick() {
                    w95.shell.run(chatWindow({...contact.now, friend: contact.now.getFriendName()}));
                },
                children: [
                    w95.widget.horizontalLayout({
                        y: 2,
                        width: "pw",
                        styleHints: [
                            w95.styleHint.alignVCenter,
                        ],
                        children: [
                            w95.widget.layoutSpacer({
                                width: 2,
                            }),
                            w95.widget.bitmap({
                                image: appicon16,
                                isDisabled: !isOnline.now,
                            }),
                            w95.widget.label({
                                width: "pw - 24",
                                text: (contact.now?.name || ""),
                                elide: true,
                                color: (
                                    isSelected.now
                                        ? w95.palette.named.white
                                        : w95.palette.window.foreground
                                ),
                            }),
                        ],
                    }),
                ],
            }, {hideIf: isHidden.now});
        },
        Message: {
            setContact(newContact) {
                w95.debug?.assert(typeof newContact === "object");
                contact.set(newContact);
            },
            setWidth(newWidth) {
                w95.debug?.assert(typeof newWidth === "number");
                width.set(newWidth);
            },
            setIsOnline(is) {
                w95.debug?.assert(typeof is === "boolean");
                isOnline.set(is);
            },
            setIsSelected(is) {
                w95.debug?.assert(typeof is === "boolean");
                isSelected.set(is);
            },
            setIsHidden(is) {
                w95.debug?.assert(typeof is === "boolean");
                isHidden.set(is);
            },
            setOnClick(callback) {
                w95.debug?.assert(typeof callback === "function");
                onClick.set(callback);
            },
        },
    };
});
