/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import {icons} from "./icons.js";
import fileView from "./custom-widgets/fileView.js";

export default function({
    files = {},
    defaultRunners = {},
} = {}) {
    return {
        Meta: {
            name: "File Explorer",
            version: "1.0",
            author: "PippeLeeSoft",
        },
        App() {
            const minWidth = 200;
            const minHeight = 200;
            const maxWidth = (w95.shell.display.width * 0.9);
            const maxHeight = (w95.shell.display.visibleHeight * 0.9);
            const width = w95.state(Math.min(maxWidth, 501));
            const height = w95.state(Math.min(maxHeight, 350));
            const contentHeight = w95.state(height.now);

            const x = w95.state(
                ~~((w95.shell.display.width - width.now) / 2),
                w95.reRenderOnly
            );
            const y = w95.state(
                ~~((w95.shell.display.visibleHeight - height.now) / 2),
                w95.reRenderOnly
            );

            const viewFileCount = w95.state(0);
            const currentPath = w95.state("/");
            const basePath = Object.keys(files)[0].replace(/\/$/, "");
            const fileStructure = Object.values(files)[0];
            const isAboutDialogOpen = w95.state(false);

            return {
                get x() { return x.now },
                get y() { return y.now },
                get width() { return width.now },
                get height() { return height.now },
                Mounted() {
                    const scrollAreaWidget = this.$("_window-contents").$childWidgets[1];
                    contentHeight.set(scrollAreaWidget.height);
                },
                Event: {
                    keydown(event) {
                        switch (event.keyCode) {
                            /* Backspace.*/
                            case 8: {
                                this.$("fileView").Message.navigate_back();
                                break;
                            }
                            /* Enter.*/
                            case 13: {
                                this.$("fileView").Message.activate_current_item();
                                break;
                            }
                        }
                    },
                },
                Form() {
                    return w95.widget.window({
                        $name: "window",
                        parent: this,
                        title: `C:\\${basePath}${currentPath.now}`.replace(/\/$/, "").replace(/\//g, "\\"),
                        icon: icons.app16,
                        move(deltaX, deltaY) {
                            x.set(x.now + deltaX);
                            y.set(y.now + deltaY);
                        },
                        resize(deltaWidth, deltaHeight) {
                            width.set(Math.max(minWidth, (width.now + deltaWidth)));
                            height.set(Math.max(minHeight, (height.now + deltaHeight)));
                        },
                        close() {
                            w95.windowManager.release_window(this)
                        },
                        children: [
                            w95.widget.menuBar({
                                width: (width.now - 8),
                                children: [
                                    w95.widget.menuAction({
                                        label: "File",
                                        isTopLevel: true,
                                        submenu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuAction({
                                                    label: "Exit",
                                                    onClick(widget) {
                                                        w95.windowManager.release_window(widget.$app.window);
                                                    },
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
                                                        isAboutDialogOpen.set(true);
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
                                height: "ph - 38",
                                backgroundColor: Rngon.color.white,
                                styleHints: [
                                    w95.styleHint.hideHorizontalScrollBar,
                                ],
                                children: [
                                    fileView({
                                        $name: "fileView",
                                        x: 1,
                                        y: 1,
                                        width: (width.now - 29),
                                        height: (Math.max(contentHeight.now, height.now) - 70),
                                        files: fileStructure,
                                        externalBasePath: basePath,
                                        defaultRunners,
                                        reportNumIcons(num) {
                                            viewFileCount.set(num);
                                        },
                                        reportPath(path) {
                                            currentPath.set(path);
                                        },
                                    }),
                                ],
                            }), 
                            // Footer field #1.
                            w95.widget.frame({
                                x: 0,
                                y: (height.now - 45),
                                width: "pw",
                                height: 18,
                                shape: w95.frameShape.box,
                                children: [
                                    w95.widget.label({
                                        x: 5,
                                        y: 2,
                                        text: `${viewFileCount.now} object(s)`,
                                    }),
                                ],
                            }),
                            w95.shell.popup.about({
                                parent: this,
                                onClose() {
                                    isAboutDialogOpen.set(false);
                                },
                            }, {hideIf: !isAboutDialogOpen.now}),
                        ],
                    });
                },
            };
        },
    };
};
