/*
 * 2023-2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import {flatVerticalButton} from "./custom-widgets/flat-vertical-button.js";
import {icons} from "./assets/icons.js";

export default function({
    url = "about:empty",
    year = 1999,
} = {}) {
    return {
        Meta: {
            name: "Internet Archive browser",
            version: "1.0",
            author: "Tarpeeksi Hyvae Soft",
        },
        App() {
            const minWidth = 300;
            const minHeight = 200;
            const height = w95.state(Math.min(480, (w95.shell.display.visibleHeight * 0.9)));
            const width = w95.state(~~(height.now * 1.25));

            const x = w95.state(
                ~~(0.5 * (w95.shell.display.width - width.now)),
                w95.reRenderOnly
            );
            const y = w95.state(
                ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
                w95.reRenderOnly
            );

            const iframeEl = w95.state(document.createElement("iframe"));
            const address = w95.state(url);
            year = w95.state(year, browse_to_current_address);

            const statusMessages = {
                none: {
                    icon: undefined,
                    text: undefined,
                },
                accessingInternetArchive: {
                    icon: icons.app16,
                    text: "Pinging Internet Archive...",
                },
                pageNotFound: {
                    icon: icons.error16,
                    text: "Page not found.",
                },
            };

            const statusMessageClearoutDelayMs = 2500;
            let statusMessageClearoutTimer = undefined;
            const statusMessageSetTime = w95.state(0, w95.noEffect);
            const statusMessage = w95.state(statusMessages.none, ()=>{
                statusMessageSetTime.set(performance.now());
                statusMessageClearoutTimer = undefined;
            });

            function clear_status_message() {
                const referenceStatusMessage = statusMessage.now;
                statusMessageClearoutTimer = setTimeout(()=>{
                    if (statusMessage.now === referenceStatusMessage) {
                        statusMessage.set(statusMessages.none);
                    }
                }, (statusMessageClearoutDelayMs - (performance.now() - statusMessageSetTime.now)));
            }

            return {
                get x() { return x.now },
                get y() { return y.now },
                get width() { return width.now },
                get height() { return height.now },
                Opened() {
                    browse_to_current_address();
                },
                Form() {
                    return w95.widget.window({
                        $name: "main-window",
                        parent: this,
                        x: x.now,
                        y: y.now,
                        width: width.now,
                        height: height.now,
                        title: "Wayback Explorer",
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
                            // Controls.
                            w95.widget.frame({
                                x: 0,
                                y: 0,
                                width: (width.now - 8),
                                height: 92,
                                shape: w95.frameShape.box,
                                children: [
                                    // Menu bar.
                                    w95.widget.frame({
                                        x: 4,
                                        y: 4,
                                        width: 3,
                                        height: 18,
                                        shape: w95.frameShape.box,
                                        styleHints: [
                                            w95.styleHint.raised,
                                        ],
                                    }),
                                    w95.widget.frame({
                                        x: 1,
                                        y: 1,
                                        width: (width.now - 10),
                                        height: 24,
                                        shape: w95.frameShape.box,
                                        styleHints: [
                                            w95.styleHint.raised,
                                        ],
                                        children: [
                                            w95.widget.menuBar({
                                                x: 8,
                                                y: 3,
                                                width: "pw",
                                                children: [
                                                    w95.widget.menuAction({
                                                        label: "File",
                                                        isTopLevel: true,
                                                    }),
                                                    w95.widget.menuAction({
                                                        label: "Edit",
                                                        isTopLevel: true,
                                                    }),
                                                    w95.widget.menuAction({
                                                        label: "View",
                                                        isTopLevel: true,
                                                    }),
                                                    w95.widget.menuAction({
                                                        label: "Go",
                                                        isTopLevel: true,
                                                    }),
                                                    w95.widget.menuAction({
                                                        label: "Favorites",
                                                        isTopLevel: true,
                                                    }),
                                                    w95.widget.menuAction({
                                                        label: "Help",
                                                        isTopLevel: true,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),

                                    // Button bar.
                                    w95.widget.frame({
                                        x: 4,
                                        y: 28,
                                        width: 3,
                                        height: 36,
                                        shape: w95.frameShape.box,
                                        styleHints: [
                                            w95.styleHint.raised,
                                        ],
                                    }),
                                    w95.widget.frame({
                                        x: 1,
                                        y: 25,
                                        width: (width.now - 10),
                                        height: 42,
                                        shape: w95.frameShape.box,
                                        styleHints: [
                                            w95.styleHint.raised,
                                        ],
                                        children: [
                                            flatVerticalButton({
                                                x: 10,
                                                y: 1,
                                                width: 50,
                                                height: 40,
                                                text: "Back",
                                                icon: icons.buttonLeft,
                                                onClick() {
                                                    window.history.back();
                                                },
                                            }),
                                            flatVerticalButton({
                                                x: 60,
                                                y: 1,
                                                width: 50,
                                                height: 40,
                                                text: "Forward",
                                                icon: icons.buttonRight,
                                                onClick() {
                                                    window.history.forward();
                                                },
                                            }),
                                            flatVerticalButton({
                                                x: 110,
                                                y: 1,
                                                width: 50,
                                                height: 40,
                                                text: "Stop",
                                                icon: icons.buttonStop,
                                                onClick() {
                                                    window.stop();
                                                }
                                            }),
                                            flatVerticalButton({
                                                x: 160,
                                                y: 1,
                                                width: 50,
                                                height: 40,
                                                text: "Home",
                                                icon: icons.buttonHome,
                                                onClick: ()=>{
                                                    address.set("about:empty");
                                                    browse_to_current_address();
                                                },
                                            }),
                                        ]
                                    }),

                                    // Address bar.
                                    w95.widget.frame({
                                        x: 4,
                                        y: 70,
                                        width: 3,
                                        height: 18,
                                        shape: w95.frameShape.box,
                                        styleHints: [
                                            w95.styleHint.raised,
                                        ],
                                    }),
                                    w95.widget.frame({
                                        x: 1,
                                        y: 67,
                                        width: (width.now - 10),
                                        height: 24,
                                        shape: w95.frameShape.box,
                                        styleHints: [
                                            w95.styleHint.raised,
                                        ],
                                        children: [
                                            w95.widget.label({
                                                x: 11,
                                                y: 0,
                                                height: 24,
                                                text: "Address",
                                                styleHints: [
                                                    w95.styleHint.alignVCenter,
                                                ],
                                            }),
                                            w95.widget.lineEdit({
                                                $name: "addressBar",
                                                x: 52,
                                                y: 1,
                                                width: (width.now - 100 - 25),
                                                height: 22, 
                                                leftPadding: 17,
                                                state: address,
                                                autofocus: (url === "about:empty"),
                                                onSubmit: browse_to_current_address,
                                            }),
                                            w95.widget.bitmap({
                                                x: 55,
                                                y: 4,
                                                image: icons.app16,
                                            }),
                                            w95.widget.frame({
                                                x: (width.now - 71),
                                                y: 0,
                                                width: 2,
                                                height: 25,
                                                shape: w95.frameShape.box,
                                            }),
                                            w95.widget.panel({
                                                x: (width.now - 68),
                                                y: 2,
                                                width: 56,
                                                height: 20,
                                                color: w95.color.white,
                                            }),
                                            w95.widget.dropdownBox({
                                                x: (width.now - 67),
                                                y: 4,
                                                width: 53,
                                                height: 22,
                                                itemIndex: String(year.now),
                                                styleHints: [
                                                    w95.styleHint.noBorder,
                                                ],
                                                items: {
                                                    ...(
                                                        new Array(10).fill().map((e, idx)=>({onSelect() { year.set(1996 + idx)}}))
                                                        .reduce((acc, item, idx)=>({...acc, ...{[1996 + idx]: item}}), {})
                                                    )
                                                },
                                            }),
                                        ],
                                    }),
                                ],
                            }),

                            // Iframe.
                            w95.widget.domElement({
                                x: 2,
                                y: 97,
                                width: "pw - 4",
                                height: "ph - 119",
                                className: "ia-browser",
                                element: iframeEl.now,
                            }),
                            w95.widget.frame({
                                x: 0,
                                y: 95,
                                width: (width.now - 8),
                                height: (height.now - 142),
                                shape: w95.frameShape.input,
                            }),

                            // Footer field #1.
                            w95.widget.frame({
                                x: 0,
                                y: (height.now - 45),
                                width: 248,
                                height: 18,
                                shape: w95.frameShape.box,
                                children: [
                                    w95.widget.bitmap({
                                        x: 1,
                                        y: 1,
                                        image: statusMessage.now.icon,
                                    }, {hideIf: !statusMessage.now.icon}),
                                    w95.widget.label({
                                        x: 18,
                                        y: 2,
                                        text: statusMessage.now.text,
                                    }, {hideIf: !statusMessage.now.text}),
                                ],
                            }),

                            // Footer field #2.
                            w95.widget.frame({
                                x: 250,
                                y: (height.now - 45),
                                width: 148,
                                height: 18,
                                shape: w95.frameShape.box,
                                children: [
                                ],
                            }),

                            // Footer field #3.
                            w95.widget.frame({
                                x: 400,
                                y: (height.now - 45),
                                width: 22,
                                height: 18,
                                shape: w95.frameShape.box,
                                children: [
                                ],
                            }),

                            // Footer field #4.
                            w95.widget.frame({
                                x: 424,
                                y: (height.now - 45),
                                width: 22,
                                height: 18,
                                shape: w95.frameShape.box,
                                children: [
                                ],
                            }),

                            // Footer field #5.
                            w95.widget.frame({
                                x: 448,
                                y: (height.now - 45),
                                width: 22,
                                height: 18,
                                shape: w95.frameShape.box,
                                children: [
                                ],
                            }),

                            // Footer field #6.
                            w95.widget.frame({
                                x: 472,
                                y: (height.now - 45),
                                width: (width.now - 472 - 8),
                                height: 18,
                                shape: w95.frameShape.box,
                                children: [
                                    w95.widget.label({
                                        x: 4,
                                        y: 0,
                                        width: "pw - 8",
                                        height: 18,
                                        elide: true,
                                        text: "Internet zone",
                                        styleHints: [
                                            w95.styleHint.alignVCenter,
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    });
                },
            };

            function browse_to_current_address()
            {
                let targetUrl = "";

                switch (address.now) {
                    case "about:empty": {
                        iframeEl.now.src = "";
                        return;
                    }
                    default: targetUrl = address.now; break;
                }

                // Show a blank page while we load the next one.
                iframeEl.now.srcdoc = "";
                statusMessage.set(statusMessages.accessingInternetArchive);

                targetUrl = targetUrl.replace(/[\s\:<>\'\"]/g, "_");

                (async()=>{
                    try {
                        const response = await fetch(`https://archive.org/wayback/available?timestamp=${year.now}0600&url=${targetUrl}`);

                        if (!response.ok) {
                            iframeEl.now.src = "";
                            iframeEl.now.srcdoc = "";
                            statusMessage.set(statusMessages.pageNotFound);
                        }

                        const json = await response.json();

                        if (!json.archived_snapshots.closest.timestamp.startsWith(year.now)) {
                            throw "nope";
                        }

                        const url = json.archived_snapshots.closest.url.replace(/^http:/, "https:");

                        iframeEl.now.removeAttribute("srcdoc");
                        iframeEl.now.src = url;
                        clear_status_message();
                    }
                    catch (error) {
                        console.error("Unhandled error", error);
                        iframeEl.now.src = "";
                        iframeEl.now.srcdoc = "";
                        statusMessage.set(statusMessages.pageNotFound);
                    }
                })();
            }
        },
    };
}
