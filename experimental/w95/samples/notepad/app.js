/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import {icons} from "./assets/icons.js";

export default function({
    file = "",
    isWordWrap = true,
} = {}) {
    return {
        Meta: {
            name: "Notepad",
            version: "1.0",
            author: "Tarpeeksi Hyvae Soft",
        },
        App() {
            const minWidth = 100;
            const minHeight = 150;
            const width = w95.state(430);
            const height = w95.state(Math.max(minHeight, Math.min(400, ~~(w95.shell.display.height * 0.9))));

            const x = w95.state(
                ~~(0.5 * (w95.shell.display.width - width.now)),
                w95.reRenderOnly
            );
            const y = w95.state(
                ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
                w95.reRenderOnly
            );

            const isWordWrapEnabled = w95.state(isWordWrap);
            const showAbout = w95.state(false);

            const text = w95.state("");
            const srcFile = w95.state(false);
            
            return {
                get x() { return x.now },
                get y() { return y.now },
                get width() { return width.now },
                get height() { return height.now },
                async Mounted() {
                    text.set(await (await fetch(file)).text());
                    srcFile.set(file.replace(/.*?\//g, ""));
                },
                Form() {
                    return w95.widget.window({
                        parent: this,
                        title: (
                            srcFile.now
                                ? `${srcFile.now} - Notepad`
                                : "Notepad"
                        ),
                        icon: icons.app16,
                        resize(deltaWidth, deltaHeight) {
                            width.set(Math.max(minWidth, (width.now + deltaWidth)));
                            height.set(Math.max(minHeight, (height.now + deltaHeight)));
                        },
                        move(deltaX, deltaY) {
                            x.set(x.now + deltaX);
                            y.set(y.now + deltaY);
                        },
                        close() {
                            w95.windowManager.release_window(this)
                        },
                        children: [
                            w95.widget.menuBar({
                                width: (width.now - 8),
                                children: [
                                    w95.widget.menuItem({
                                        label: "File",
                                        isTopLevel: true,
                                        isDisabled: !srcFile.now,
                                        menu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuItem({
                                                    label: "Save",
                                                    isDisabled: true,
                                                }),
                                                w95.widget.menuItem({
                                                    label: "Save As...",
                                                    isDisabled: true,
                                                }),
                                                w95.widget.menuSeparator(),
                                                w95.widget.menuItem({
                                                    label: "Load...",
                                                    isDisabled: true,
                                                }),
                                            ],
                                        }),
                                    }),
                                    w95.widget.menuItem({
                                        label: "Edit",
                                        isTopLevel: true,
                                        isDisabled: !srcFile.now,
                                        menu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuItem({
                                                    label: "Word wrap",
                                                    isCheckable: true,
                                                    isChecked: isWordWrapEnabled.now,
                                                    newCheckState(isChecked) {
                                                        isWordWrapEnabled.set(isChecked);
                                                    },
                                                }),
                                            ],
                                        }),
                                    }),
                                    w95.widget.menuItem({
                                        label: "Help",
                                        isTopLevel: true,
                                        menu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuItem({
                                                    label: "About...",
                                                    onClick() {
                                                        showAbout.set(true);
                                                    },
                                                }),
                                            ],
                                        }),
                                    }),
                                ],
                            }),
                            w95.widget.scrollArea({
                                y: 18,
                                width: "pw",
                                height: "ph - 18",
                                backgroundColor: w95.palette.named.white,
                                alwaysShowHorizontalScroll: true,
                                alwaysShowVerticalScroll: true,
                                children: [
                                    w95.widget.label({
                                        x: 2,
                                        y: 2,
                                        width: (
                                            isWordWrapEnabled.now
                                            ? (width.now - 30)
                                            : undefined
                                        ),
                                        text: text.now,
                                        font: w95.font.fixedsys[9],
                                        wordWrap: isWordWrapEnabled.now,
                                    }),
                                ],
                            }),
                            w95.shell.popup({
                                parent: this,
                                icon: w95.icon.information,
                                title: `About ${this.$app.Meta.name} ${this.$app.Meta.version}`,
                                text: "This sample application for w95 demonstrates the use of the\nscrollArea and label widgets to create a clone of the Notepad\napplication as seen in Windows 95.",
                                buttons: [
                                    w95.widget.button({
                                        x: 0,
                                        width: 75,
                                        text: "OK",
                                        onClick() {
                                            showAbout.set(false);
                                        },
                                    }),
                                ],
                                onReject() {
                                    showAbout.set(false);
                                },
                            }, {hideIf: !showAbout.now}),
                        ],
                    });
                },
            };
        },
    };
};
