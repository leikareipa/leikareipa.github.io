/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import {icons} from "./icons.js";
import notepad from "../../../experimental/w95/samples/notepad/app.js";

export default {
    Meta: {
        name: "RallySportED's track editor",
        author: "ArtisaaniSoft",
        description: "A w95 wrapper for the browser version of RallySportED's track editor.",
    },
    App() {
        const minWidth = 500;
        const minHeight = 300;
        const width = w95.state(Math.max(minWidth, Math.min(900, ~~(w95.shell.display.width * 0.9))));
        const height = w95.state(Math.max(minHeight, Math.min(600, ~~(w95.shell.display.height * 0.9))));

        const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
        const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);

        const currentEditorView = w95.state("terrain-editor", ()=>send_message("view:editor", currentEditorView.now));
        const fileSelectorEl = w95.state(document.createElement("input"));
        const trackFileSelectorEl = w95.state(document.createElement("input"));
        const iframeEl = w95.state(document.createElement("iframe"));
        const projectName = w95.state(undefined);
        const dosboxRunState = w95.state(0);
        const isAboutOpen = w95.state(false);

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
                        case "project:loaded": {
                            let name = event.data.payload;
                            switch (event.data.payload) {
                                case "Demoa": name = "Nurtsi cruising"; break;
                                case "Demob": name = "Vesistö vedätys"; break;
                                case "Democ": name = "Ralli-cross"; break;
                                case "Demod": name = "Yleisö EK"; break;
                                case "Demoe": name = "Very slippery"; break;
                                case "Demof": name = "You asked it"; break;
                                case "Demog": name = "Bumps and jumps"; break;
                                case "Demoh": name = "Short and easy"; break;
                            }
                            return projectName.set(name);
                        }
                        case "project:name": return projectName.set(event.data.payload);
                        case "view:editor": return currentEditorView.set(event.data.payload);
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
                            ? `${projectName.now} - Track Editor - RallySportED`
                            : "Track Editor - RallySportED"
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
                                    isDisabled: (
                                        !projectName.now ||
                                        (dosboxRunState.now !== 0)
                                    ),
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Save",
                                                isDisabled: !projectName.now,
                                                onClick() {send_message("save:project")},
                                            }),
                                            w95.widget.menuAction({
                                                label: "Load",
                                                submenu: w95.widget.menu({
                                                    children: [
                                                        w95.widget.menuAction({
                                                            label: "From disk...",
                                                            onClick() {trackFileSelectorEl.now.$assetType = "project"; trackFileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuSeparator(),
                                                        w95.widget.menuAction({
                                                            label: "Rally-Sport (demo)",
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
                                                            label: "Custom",
                                                            submenu: w95.widget.menu({
                                                                children: [
                                                                    w95.widget.menuAction({
                                                                        label: "2016",
                                                                        submenu: w95.widget.menu({
                                                                            children: [
                                                                                w95.widget.menuAction({
                                                                                    label: "Lumitaso",
                                                                                    onClick() {load_track("lumitaso")},
                                                                                }),
                                                                                w95.widget.menuAction({
                                                                                    label: "Saaristo",
                                                                                    onClick() {load_track("saaristo")},
                                                                                }),
                                                                                w95.widget.menuAction({
                                                                                    label: "Suorundi",
                                                                                    onClick() {load_track("suorundi")},
                                                                                }),
                                                                            ],
                                                                        }),
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "2017",
                                                                        submenu: w95.widget.menu({
                                                                            children: [
                                                                                w95.widget.menuAction({
                                                                                    label: "Haastava",
                                                                                    onClick() {load_track("haastava")},
                                                                                }),
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
                                                                                    label: "Lausturi",
                                                                                    onClick() {load_track("lausturi")},
                                                                                }),
                                                                                w95.widget.menuAction({
                                                                                    label: "Sodantie",
                                                                                    onClick() {load_track("sodantie")},
                                                                                }),
                                                                            ],
                                                                        }),
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "2018",
                                                                        submenu: w95.widget.menu({
                                                                            children: [
                                                                                w95.widget.menuAction({
                                                                                    label: "Suolisto",
                                                                                    onClick() {load_track("suolisto")},
                                                                                }),
                                                                            ],
                                                                        }),
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "2020",
                                                                        submenu: w95.widget.menu({
                                                                            children: [
                                                                                w95.widget.menuAction({
                                                                                    label: "Jouluke",
                                                                                    onClick() {load_track("jouluke")},
                                                                                }),
                                                                                w95.widget.menuAction({
                                                                                    label: "Oivoi",
                                                                                    onClick() {load_track("oivoi")},
                                                                                }),
                                                                                w95.widget.menuAction({
                                                                                    label: "Syyssy",
                                                                                    onClick() {load_track("syyssy")},
                                                                                }),
                                                                            ],
                                                                        }),
                                                                    }),
                                                                    w95.widget.menuAction({
                                                                        label: "2022",
                                                                        submenu: w95.widget.menu({
                                                                            children: [
                                                                                w95.widget.menuAction({
                                                                                    label: "Naapurit",
                                                                                    onClick() {load_track("naapurit")},
                                                                                }),
                                                                            ],
                                                                        }),
                                                                    }),
                                                                ],
                                                            }),
                                                        }),
                                                    ],
                                                }),
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuAction({
                                                label: "Rename...",
                                                onClick() {
                                                    send_message("rename:project");
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                                w95.widget.menuAction({
                                    label: "Data",
                                    isTopLevel: true,
                                    isDisabled: (
                                        !projectName.now ||
                                        (dosboxRunState.now !== 0)
                                    ),
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Import",
                                                isDisabled: !projectName.now,
                                                submenu: w95.widget.menu({
                                                    children: [
                                                        w95.widget.menuAction({
                                                            label: "Maasto...",
                                                            onClick() {fileSelectorEl.now.$assetType = "maasto"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Varimaa...",
                                                            onClick() {fileSelectorEl.now.$assetType = "varimaa"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Palat...",
                                                            onClick() {fileSelectorEl.now.$assetType = "palat"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Text...",
                                                            onClick() {fileSelectorEl.now.$assetType = "text"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Anims...",
                                                            onClick() {fileSelectorEl.now.$assetType = "anims"; fileSelectorEl.now.click();},
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Kierros...",
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
                                                label: "Race",
                                                isDisabled: (dosboxRunState.now !== 0),
                                                onClick() {
                                                    send_message("run:play");
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Debug",
                                                isDisabled: (dosboxRunState.now !== 0),
                                                onClick() {
                                                    send_message("run:test");
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuAction({
                                                label: "Record lap",
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
                                    label: "View",
                                    isTopLevel: true,
                                    isDisabled: (
                                        !projectName.now ||
                                        (dosboxRunState.now !== 0)
                                    ),
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Terrain",
                                                group: "editor",
                                                isCheckable: true,
                                                isChecked: (currentEditorView.now === "terrain-editor"),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        currentEditorView.set("terrain-editor");
                                                    }
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Tilemap",
                                                group: "editor",
                                                isCheckable: true,
                                                isChecked: (currentEditorView.now === "tilemap-editor"),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        currentEditorView.set("tilemap-editor");
                                                    }
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Textures",
                                                group: "editor",
                                                isCheckable: true,
                                                isChecked: (currentEditorView.now === "texture-editor"),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        currentEditorView.set("texture-editor");
                                                    }
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
                                                    isAboutOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuAction({
                                                label: "Manual",
                                                isChecked: (currentEditorView.now === "texture-editor"),
                                                onClick() {
                                                    w95.shell.run(notepad({
                                                        file: "/desktop/$apps/rallysported/manual.txt",
                                                        isWordWrap: false,
                                                    }));
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
                                    x: 2,
                                    y: 2,
                                    width: "pw - 4",
                                    height: "ph - 4",
                                    className: "rsed",
                                    element: iframeEl.now,
                                }),
                            ],
                        }),
                        w95.shell.popup.about({
                            parent: this,
                            text: "Create, edit, and play Rally-Sport tracks.",
                            onClose() {
                                isAboutOpen.set(false);
                            },
                        }, {hideIf: !isAboutOpen.now}),
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
