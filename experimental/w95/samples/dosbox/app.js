/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import {icons} from "./assets/icons.js";
import dosboxWidget from "./custom-widgets/dosbox-widget.js";

export default function(filename = "", run = "") {
    return {
        Meta: {
            name: "DOSBox for w95",
            version: "1.0",
            author: "Tarpeeksi Hyvae Soft",
        },
        App() {
            const minWidth = 320;
            const minHeight = 200;
            const width = w95.state(640);
            const height = w95.state(400);

            const x = w95.state(
                ~~(0.5 * (w95.shell.display.width - width.now)),
                w95.reRenderOnly
            );
            const y = w95.state(
                ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
                w95.reRenderOnly
            );

            const showAbout = w95.state(false);
            const jsdosInitialized = w95.state(false);
        
            return {
                get x() { return x.now },
                get y() { return y.now },
                get width() { return width.now + 8 },
                get height() { return height.now + 45 },
                Form() {
                    return w95.widget.window({
                        icon: icons.app16,
                        parent: this,
                        title: "DOSBox",
                        resize(deltaWidth, deltaHeight) {
                            width.set(Math.max(minWidth, (width.now + deltaWidth)));
                            height.set(Math.max(minHeight, (height.now + deltaHeight)));
                        },
                        move(deltaX, deltaY) {
                            x.set(x.now + deltaX);
                            y.set(y.now + deltaY);
                        },
                        close: (
                            jsdosInitialized.now
                                ? ()=>w95.windowManager.release_window(this.$app.window)
                                : undefined
                        ),
                        children: [
                            w95.widget.menuBar({
                                width: "pw",
                                children: [
                                    w95.widget.menuAction({
                                        label: "File",
                                        isTopLevel: true,
                                        isDisabled: !jsdosInitialized.now,
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
                                        label: "Output",
                                        isTopLevel: true,
                                        isDisabled: !jsdosInitialized.now,
                                        submenu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuAction({
                                                    label: `Custom: ${width.now} x ${height.now}`,
                                                    group: "output",
                                                    isDisabled: true,
                                                    isChecable: true,
                                                    isChecked: (
                                                        !((width.now === 720) && (height.now === 400)) &&
                                                        !((width.now === 640) && (height.now === 400)) &&
                                                        !((width.now === 640) && (height.now === 480))
                                                    ),
                                                }),
                                                w95.widget.menuSeparator(),
                                                w95.widget.menuAction({
                                                    label: "720 x 400",
                                                    group: "output",
                                                    isChecable: true,
                                                    isChecked: ((width.now === 720) && (height.now === 400)),
                                                    onClick() {
                                                        width.set(720);
                                                        height.set(400);
                                                    },
                                                }),
                                                w95.widget.menuAction({
                                                    label: "640 x 400",
                                                    group: "output",
                                                    isChecable: true,
                                                    isChecked: ((width.now === 640) && (height.now === 400)),
                                                    onClick() {
                                                        width.set(640);
                                                        height.set(400);
                                                    },
                                                }),
                                                w95.widget.menuAction({
                                                    label: "640 x 480",
                                                    group: "output",
                                                    isChecable: true,
                                                    isChecked: ((width.now === 640) && (height.now === 480)),
                                                    onClick() {
                                                        width.set(640);
                                                        height.set(480);
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
                                                        showAbout.set(true);
                                                    },
                                                }),
                                            ],
                                        }),
                                    }),
                                ],
                            }),
                            dosboxWidget({
                                $name: "dosbox",
                                y: 18,
                                width: width.now,
                                height: height.now,
                                filename,
                                run,
                                onInitialized() {
                                     jsdosInitialized.set(true);
                                },
                            }),
                            w95.shell.popup({
                                parent: this,
                                icon: w95.icon.information,
                                title: `About ${this.$app.Meta.name}`,
                                text: "This sample application for w95 demonstrates the integration of\nDOSBox (using js-dos) into the w95 UI.",
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
