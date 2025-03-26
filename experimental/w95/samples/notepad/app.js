/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import {icons} from "./assets/icons.js";

export default function({
    file = "",
    isWordWrap = false,
    decoder = (bytes)=>(new TextDecoder("utf-8").decode(bytes)),
} = {}) {
    return {
        Meta: {
            name: "Notepad",
            version: "1.0",
            author: "ArtisaaniSoft",
        },
        App() {
            const minWidth = 100;
            const minHeight = 150;
            const width = w95.state(585);
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
                async Opened() {
                    text.set(decoder(await (await fetch(file)).arrayBuffer()));
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
                                width: "pw",
                                children: [
                                    w95.widget.menuAction({
                                        label: "File",
                                        isTopLevel: true,
                                        isDisabled: !srcFile.now,
                                        submenu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuAction({
                                                    label: "Save",
                                                    isDisabled: true,
                                                }),
                                                w95.widget.menuAction({
                                                    label: "Save As...",
                                                    isDisabled: true,
                                                }),
                                                w95.widget.menuSeparator(),
                                                w95.widget.menuAction({
                                                    label: "Load...",
                                                    isDisabled: true,
                                                }),
                                            ],
                                        }),
                                    }),
                                    w95.widget.menuAction({
                                        label: "Edit",
                                        isTopLevel: true,
                                        isDisabled: !srcFile.now,
                                        submenu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuAction({
                                                    label: "Word wrap",
                                                    isCheckable: true,
                                                    isDisabled: true,
                                                    isChecked: isWordWrapEnabled.now,
                                                    newCheckState: isWordWrapEnabled.set,
                                                }),
                                            ],
                                        }),
                                    }),
                                    w95.widget.menuAction({
                                        label: "Help",
                                        isTopLevel: true,
                                        submenu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuAction({
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
                            w95.widget.textEdit({
                                y: 18,
                                width: "pw",
                                height: "ph - 18",
                                state: text,
                                font: w95.font.fixedsys9,
                                wordWrap: isWordWrapEnabled.now,
                                allowFormatting: false,
                                isEditable: false,
                            }),
                            w95.shell.popup.about({
                                parent: this,
                                onClose() {
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
