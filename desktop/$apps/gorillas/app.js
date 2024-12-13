/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 */

import {speedQuery} from  "./speed-query-dialog.js";
import gorillaBas from "./assets/gorilla.bas.js";

const dosboxUrl = "/desktop/$apps/gorillas/dosbox.html";

export default {
    Meta: {
        name: "GORILLAS",
    },
    App() {
        const width = w95.state(652);
        const height = w95.state(399);

        const x = w95.state(
            ~~(0.5 * (w95.shell.display.width - width.now)),
            w95.reRenderOnly
        );
        const y = w95.state(
            ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
            w95.reRenderOnly
        );

        const enabled = w95.state(false);
        const isAboutDialogOpen = w95.state(false);
        const isSpeedQueryDialogOpen = w95.state(false);
        const focusTimeout = w95.state(undefined);
        const iframeEl = w95.state(document.createElement("iframe"));
        const speed = w95.state(Number(gorillaBas.match(/\nCONST SPEEDCONST = ([0-9]+)/)[1]), restart);

        function upload_game_src() {
            iframeEl.now.contentWindow.postMessage({
                message: "dosbox:put-file-data",
                payload: {
                    filename: "gorillas/gorilla.bas",
                    data: new TextEncoder().encode(
                        gorillaBas
                        .replace(/\nCONST SPEEDCONST = .*/, `\nCONST SPEEDCONST = ${speed.now}`)
                    ),
                }
            });
        }

        function restart() {
            enabled.set(false);
            iframeEl.now.remove();
            iframeEl.set(document.createElement("iframe"));
            iframeEl.now.src = dosboxUrl;
        }

        function event_listener(event) {
            if (event.origin !== window.location.origin) {
                return;
            }
            switch (event.data.message) {
                case "dosbox:ready": {
                    iframeEl.now.contentWindow.postMessage({
                        message: "dosbox:initialize",
                    });
                    break;
                }
                case "dosbox:initialized": {
                    upload_game_src();
                    iframeEl.now.contentWindow.postMessage({
                        message: "dosbox:start",
                        payload: "qbasic /run gorilla.bas",
                    });
                    break;
                }
                case "dosbox:visible": {
                    enabled.set(true);
                    break;
                }
                default: break;
            }
        }

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Opened() {
                window.addEventListener("message", event_listener, false);

                iframeEl.now.src = dosboxUrl;
                focusTimeout.set(setInterval(()=>{
                    if (
                        !this.window.isBlurred &&
                        !w95.windowManager.isPopupMenuActive &&
                        !w95.windowManager.isDialogActive
                    ){
                        iframeEl.now.focus();
                    }
                }), 100);
            },
            Closed() {
                window.removeEventListener("message", event_listener);
            },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: this.$app.Meta.name,
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },
                    close: (
                        enabled.now
                            ? function(){w95.windowManager.release_window(this)}
                            : undefined
                    ),
                    children: [
                        w95.widget.menuBar({
                            width: "pw",
                            children: [
                                w95.widget.menuAction({
                                    label: "Game",
                                    isTopLevel: true,
                                    isDisabled: !enabled.now,
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Speed...",
                                                onClick() {
                                                    isSpeedQueryDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Restart",
                                                onClick: restart,
                                            }),
                                            w95.widget.menuSeparator(),
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
                                    label: "Resolution",
                                    isTopLevel: true,
                                    isDisabled: !enabled.now,
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "640 x 350",
                                                group: "res",
                                                isCheckable: true,
                                                isChecked: (height.now === 399),
                                                onClick() {
                                                    height.set(399);
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "640 x 400",
                                                group: "res",
                                                isCheckable: true,
                                                isChecked: (height.now === 449),
                                                onClick() {
                                                    height.set(449);
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                            ],
                        }),
                        w95.widget.frame({
                            y: 18,
                            width: "pw",
                            height: "ph - 18",
                            shape: w95.frameShape.input,
                            children: [
                                w95.widget.domElement({
                                    $name: "canvas",
                                    x: 2,
                                    y: 2,
                                    width: "pw - 4",
                                    height: "ph - 4",
                                    element: iframeEl.now,
                                    className: "dosbox",
                                }),
                            ],
                        }),
                        speedQuery({
                            x: ((width.now / 2) - 120),
                            y: 60,
                            width: 240,
                            height: 105,
                            value: `${speed.now}`,
                            onAccept(name) {
                                speed.set(name);
                                isSpeedQueryDialogOpen.set(false);
                            },
                            onReject() {
                                isSpeedQueryDialogOpen.set(false);
                            },
                        }, {hideIf: !isSpeedQueryDialogOpen.now}),
                        w95.shell.popup.about({
                            parent: this,
                            text: "Generate heightmaps using Perlin noise and export\nthem as OBJ/PNG.",
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
