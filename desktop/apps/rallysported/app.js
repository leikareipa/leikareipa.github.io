/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import {icons} from "./icons.js";

export default {
    Meta: {
        name: "RallySportED's track editor in w95",
        version: "1.0",
        author: "Tarpeeksi Hyvae Soft",
        description: "A w95 wrapper for the browser version of RallySportED's track editor.",
    },
    App() {
        const minWidth = 600;
        const minHeight = 420;
        const width = w95.state(minWidth);
        const height = w95.state(minHeight);

        const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
        const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);

        const fileSelectorEl = w95.state(document.createElement("input"));
        const trackFileSelectorEl = w95.state(document.createElement("input"));
        const iframeEl = w95.state(document.createElement("iframe"));
        const projectName = w95.state(undefined);
        const dosboxRunState = w95.state(0);

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Opened() {
                iframeEl.now.src = "/rallysported/track-editor/?w95";
                window.addEventListener("message", (event)=>{
                    if (event.origin !== window.location.origin) {
                        return;
                    }
                    switch (event.data.message) {
                        case "project:loaded": return projectName.set(event.data.payload);
                        case "project:name": return projectName.set(event.data.payload);
                        case "run:starting": return dosboxRunState.set(1); 
                        case "run:started": return dosboxRunState.set(2);
                        case "run:stopped": return dosboxRunState.set(0);
                    }
                }, false);

                fileSelectorEl.now.type = "file";
                fileSelectorEl.now.onchange = async function() {
                    send_message(`import:${fileSelectorEl.now.$assetType}`, fileSelectorEl.now.files[0]);
                };

                trackFileSelectorEl.now.type = "file";
                trackFileSelectorEl.now.accept = ".zip";
                trackFileSelectorEl.now.onchange = async function() {
                    send_message("import:project", trackFileSelectorEl.now.files[0]);
                };
            },
            Form() {
                return w95.widget.window({
                    icon: icons.app16,
                    parent: this,
                    title: (
                        projectName.now
                            ? `${projectName.now} - RallySportED`
                            : "RallySportED"
                    ),
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
                                w95.widget.menuAction({
                                    label: "File",
                                    isTopLevel: true,
                                    isDisabled: (dosboxRunState.now !== 0),
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Save",
                                                isDisabled: !projectName.now,
                                                onClick() {send_message("save:project")},
                                            }),
                                            w95.widget.menuAction({
                                                label: "Rename...",
                                                onClick() {
                                                    send_message("rename:project");
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuAction({
                                                label: "Load track",
                                                submenu: w95.widget.menu({
                                                    children: [
                                                        w95.widget.menuAction({
                                                            label: "From disk...",
                                                            onClick() {trackFileSelectorEl.now.$assetType = "project"; trackFileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuSeparator(),
                                                        w95.widget.menuAction({
                                                            label: "Rally-Sport's demo",
                                                            submenu: w95.widget.menu({
                                                                children: [
                                                                    w95.widget.menuAction({
                                                                        label: "Nurtsi cruising",
                                                                        onClick() {load_track(1)},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Vesistö vedätys",
                                                                        onClick() {load_track(2)},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Ralli-cross",
                                                                        onClick() {load_track(3)},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Yleisö EK",
                                                                        onClick() {load_track(4)},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Very slippery",
                                                                        onClick() {load_track(5)},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "You asked it",
                                                                        onClick() {load_track(6)},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Bumps and jumps",
                                                                        onClick() {load_track(7)},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Short and easy",
                                                                        onClick() {load_track(8)},
                                                                    }),
                                                                ],
                                                            }),
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Fan-made",
                                                            submenu: w95.widget.menu({
                                                                children: [
                                                                    w95.widget.menuAction({
                                                                        label: "Hakkuu",
                                                                        onClick() {load_track("hakkuu")},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Jossain",
                                                                        onClick() {load_track("jossain")},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Klorofyl",
                                                                        onClick() {load_track("klorofyl")},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Lumitaso",
                                                                        onClick() {load_track("lumitaso")},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Naapurit",
                                                                        onClick() {load_track("naapurit")},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Saaristo",
                                                                        onClick() {load_track("saaristo")},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Syyssy",
                                                                        onClick() {load_track("syyssy")},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Suorundi",
                                                                        onClick() {load_track("suorundi")},
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "Jouluke",
                                                                        onClick() {load_track("jouluke")},
                                                                    }),
                                                                ],
                                                            }),
                                                        }),
                                                    ],
                                                }),
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuAction({
                                                label: "Import",
                                                isDisabled: !projectName.now,
                                                submenu: w95.widget.menu({
                                                    children: [
                                                        w95.widget.menuAction({
                                                            label: "Maasto",
                                                            onClick() {fileSelectorEl.now.$assetType = "maasto"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Varimaa",
                                                            onClick() {fileSelectorEl.now.$assetType = "varimaa"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Palat",
                                                            onClick() {fileSelectorEl.now.$assetType = "palat"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Text",
                                                            onClick() {fileSelectorEl.now.$assetType = "text"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Anims",
                                                            onClick() {fileSelectorEl.now.$assetType = "anims"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Kierros",
                                                            onClick() {fileSelectorEl.now.$assetType = "kierros"; fileSelectorEl.now.click();},
                                                        }),
                                                    ],
                                                }),
                                            }),
                                            w95.widget.menuAction({
                                                label: "Export",
                                                isDisabled: !projectName.now,
                                                submenu: w95.widget.menu({
                                                    children: [
                                                        w95.widget.menuAction({
                                                            label: "Maasto",
                                                            onClick() {send_message("export:maasto")},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Varimaa",
                                                            onClick() {send_message("export:varimaa")},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Palat",
                                                            onClick() {send_message("export:palat")},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Text",
                                                            onClick() {send_message("export:text")},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Anims",
                                                            onClick() {send_message("export:anims")},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Kierros",
                                                            onClick() {send_message("export:kierros")},
                                                        }),
                                                    ],
                                                }),
                                            }),
                                        ],
                                    }),
                                }),
                                w95.widget.menuAction({
                                    label: "Run",
                                    isTopLevel: true,
                                    isDisabled: !projectName.now,
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Play",
                                                isDisabled: (dosboxRunState.now !== 0),
                                                onClick() {
                                                    send_message("run:play");
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Test",
                                                isDisabled: (dosboxRunState.now !== 0),
                                                onClick() {
                                                    send_message("run:test");
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Record",
                                                isDisabled: (dosboxRunState.now !== 0),
                                                onClick() {
                                                    send_message("run:record");
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuAction({
                                                label: "Stop",
                                                isDisabled: (dosboxRunState.now !== 2),
                                                onClick() {
                                                    send_message("run:stop");
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
                                                isDisabled: true,
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
                                    x: 2,
                                    y: 2,
                                    width: "pw - 4",
                                    height: "ph - 4",
                                    className: "rsed",
                                    element: iframeEl.now,
                                }),
                            ],
                        }),
                    ],
                });
            },
        };

        function send_message(message, payload) {
            iframeEl.now.contentWindow.postMessage({message, payload});
            iframeEl.now.focus();
        }

        function load_track(trackId) {
            iframeEl.now.src = `/rallysported/track-editor/?w95#${trackId}`;
            iframeEl.now.focus();
        }
    },
};
