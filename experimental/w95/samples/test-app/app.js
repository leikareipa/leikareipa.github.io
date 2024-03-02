/*
 * 2023-2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import {spawnButton} from  "./custom-widgets/spawn-button.js";
import {twoStateButton} from  "./custom-widgets/two-state-button.js";
import {rotatingCube} from  "./custom-widgets/rotating-cube.js";
import {statistics} from  "./custom-widgets/statistics.js";
import {nameQuery} from  "./custom-widgets/name-query.js";
import {customWarning} from  "./custom-widgets/custom-warning.js";
import {embeddedIframe} from  "./custom-widgets/embedded-iframe.js";

export default {
    Meta: {
        name: "Test app for w95",
        version: "0.1",
        author: "Tarpeeksi Hyvae Soft",
        description: `
            This app includes all (or most) widgets available in w95, so the user
            can test and debug them.
        `,
    },
    App() {
        const width = w95.state(400);
        const height = w95.state(Math.max(422, ~~(w95.shell.display.height * 0.8)));

        const x = w95.state(
            ~~((w95.shell.display.width - width.now) / 2),
            w95.reRenderOnly
        );
        const y = w95.state(
            ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
            w95.reRenderOnly
        );

        const domEl = w95.state(document.createElement("div"))
    
        const isNameQueryDialogOpen = w95.state(false);
        const isCustomWarningDialogOpen = w95.state(false);
        const isQuestionDialogOpen = w95.state(false);
        const isWarningDialogOpen = w95.state(false);
        const isErrorDialogOpen = w95.state(false);
    
        const sliderValue = w95.state(5);
        const lineEditText = w95.state("Left empty");
        const textEditText = w95.state("Text editing, with some bugs remaining.\n\nMultiline.");
        const numEditText = w95.state("123");
        const userName = w95.state("");
        const widgetDisable = w95.state(false);
        const tabIndex = w95.state(1);
        const tab2Index = w95.state(0);
        const dropdownIndex = w95.state(2);
        const isCheckChecked = w95.state(false);
        const groupItemCheckIdx = w95.state(0);

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Opened() {
                domEl.now.innerHTML = `
                    <table>
                        <tr><td>Final Fantasy VII (1997)</td></tr>
                        <tr><td>Metal Gear Solid (1998)</td></tr>
                        <tr><td>The Legend of Zelda: Ocarina of Time (1998)</td></tr>
                        <tr><td>GoldenEye 007 (1997)</td></tr>
                        <tr><td>Destruction Derby (1995)</td></tr>
                    </table>
                    <br>
                    <div class="main">
                        <img src="./assets/construction.gif">
                        <a target="_blank" href="https://www.google.com">Under construction</a>
                        <img src="./assets/construction.gif">
                    </div>
                `;
            },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: `${userName.now.length? `${userName.now} - ` : ""}Developer's test app for w95`,
                    resize(deltaWidth, deltaHeight) {
                        height.set(Math.max(100, (height.now + deltaHeight)));
                    },
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },
                    close() {
                        w95.windowManager.release_window(this)
                    },
                    children: [
                        w95.widget.groupBox({
                            title: `Sliders & progress (${(sliderValue.now * 10)}%)`,
                            x: 6,
                            y: 185,
                            width: 182,
                            height: 80,
                            isDisabled: widgetDisable.now,
                            children: [
                                w95.widget.progressBar({
                                    x: 10,
                                    y: 15,
                                    width: "pw / 2 - 15",
                                    progress: (sliderValue.now * 10),
                                    showLabel: true,
                                }),
                                w95.widget.progressBar({
                                    x: 94,
                                    y: 15,
                                    width: "pw / 2 - 13",
                                    progress: (sliderValue.now * 10),
                                    styleHints: [
                                        w95.styleHint.dashed,
                                    ],
                                }),
                                w95.widget.horizontalSlider({
                                    x: 10,
                                    y: 36,
                                    width: "pw - 20",
                                    minValue: 0,
                                    maxValue: 10,
                                    value: sliderValue.now,
                                    newValue(value) {
                                        sliderValue.set(value);
                                    },
                                }),
                            ]
                        }),
                        w95.widget.groupBox({
                            title: "Fields",
                            x: 6,
                            y: 22,
                            width: 182,
                            height: 85,
                            isDisabled: widgetDisable.now,
                            children: [
                                w95.widget.dropdownBox({
                                    x: 10,
                                    y: 15,
                                    width: "pw - 20",
                                    itemIndex: dropdownIndex.now,
                                    items: {
                                        "2 Color": {
                                            onSelect(widget) {
                                                set_color_count(widget, 2);
                                            },
                                        },
                                        "16 Color": {
                                            onSelect(widget) {
                                                set_color_count(widget, 16);
                                            },
                                        },
                                        "True Color (32 bit)": {
                                            onSelect(widget) {
                                                set_color_count(widget, 32e6);
                                            },
                                        },
                                    },
                                    newItemIndex(idx) {
                                        dropdownIndex.set(idx);
                                    },
                                }),
                                w95.widget.lineEdit({
                                    x: 10,
                                    y: 45,
                                    width: "pw - 76",
                                    text: lineEditText.now,
                                    newText(text) {
                                        lineEditText.set(text);
                                    },
                                }),
                                w95.widget.lineEdit({
                                    x: "pw - 58",
                                    y: 45,
                                    width: "pw - 134",
                                    validator: /[0-9]/,
                                    text: numEditText.now,
                                    newText(text) {
                                        numEditText.set(text);
                                    },
                                }),
                            ]
                        }),
                        w95.widget.groupBox({
                            title: "Toggleables",
                            x: 6,
                            y: 112,
                            width: 182,
                            height: 68,
                            children: [
                                w95.widget.checkbox({
                                    x: 10,
                                    y: 16,
                                    label: "Disable all widgets", 
                                    isChecked: widgetDisable.now,
                                    newCheckState(isChecked) {
                                        widgetDisable.set(isChecked);
                                    },
                                }),
                                w95.widget.radioGroup({
                                    x: 10,
                                    y: 38,
                                    itemIndex: (w95.registry.get("render-scale") - 1),
                                    newItemIndex(idx) {
                                        w95.registry.set("render-scale", (idx + 1));
                                    },
                                    items: {
                                        "1x": {
                                            isDisabled: widgetDisable.now,
                                        },
                                        "2x": {
                                            x: 40,
                                            y: 0,
                                            isDisabled: widgetDisable.now,
                                        },
                                        "3x": {
                                            x: 80,
                                            y: 0,
                                            isDisabled: true,
                                        },
                                        "4x": {
                                            x: 120,
                                            y: 0,
                                            isDisabled: widgetDisable.now,
                                        },
                                    },
                                }),
                            ]
                        }),
                        w95.widget.groupBox({
                            title: "Buttons",
                            x: 196,
                            y: 22,
                            width: 190,
                            height: 55,
                            isDisabled: widgetDisable.now,
                            children: [
                                spawnButton({
                                    x: 10,
                                    y: 15,
                                    width: "pw - 95",
                                }),
                                twoStateButton({
                                    x: 113,
                                    y: 15,
                                    width: "pw - 123",
                                }),
                            ],
                        }),
                        w95.widget.groupBox({
                            title: "Tab widget",
                            x: 196,
                            y: 82,
                            width: 190,
                            height: 183,
                            isDisabled: widgetDisable.now,
                            children: [
                                w95.widget.tabControl({
                                    x: 10,
                                    y: 15,
                                    width: "pw - 20",
                                    height: "ph - 27",
                                    tabIndex: tabIndex.now,
                                    newTabIndex(idx) {
                                        tabIndex.set(idx);
                                    },
                                    tabs: {
                                        "Status": {
                                            children: [
                                                statistics({
                                                    width: "pw",
                                                    height: 131,
                                                }),
                                            ],
                                        },
                                        "Notes": {
                                            children: [
                                                w95.widget.label({
                                                    x: 9,
                                                    y: 7,
                                                    text: "1.) Use the #no-debug URL\nhash to disable the DOM\ndebug layer.",
                                                }),
                                                w95.widget.label({
                                                    x: 9,
                                                    y: 55,
                                                    text: "2.) For more info, see the w95\ncode repository on GitHub.*",
                                                }),
                                                w95.widget.label({
                                                    cursor: w95.cursor.pointer,
                                                    x: 84,
                                                    y: 68,
                                                    text: "on GitHub",
                                                    color: (
                                                        widgetDisable.now
                                                            ? w95.palette.named.dimgray
                                                            : w95.palette.named.blue
                                                    ),
                                                    styleHints: [
                                                        (widgetDisable.now? 0 : w95.styleHint.underlined),
                                                    ],
                                                    onMouseDown() {
                                                        if (!widgetDisable.now) {
                                                            window.open("https://github.com/leikareipa/w95", "_blank");
                                                            return true;
                                                        }
                                                    },
                                                }),
                                                w95.widget.horizontalRule({
                                                    x: 7,
                                                    y: 90,
                                                    width: "pw - 14"
                                                }),
                                                w95.widget.label({
                                                    x: 7,
                                                    y: 95,
                                                    text: "* This software is not associated\nwith Microsoft.",
                                                }),
                                            ]
                                        },
                                        "HTML": {
                                            children: [
                                                w95.widget.frame({ 
                                                    width: "pw",
                                                    height: "ph",
                                                    shape: w95.frameShape.input,
                                                    children: [
                                                        w95.widget.domElement({
                                                            x: 2,
                                                            y: 2,
                                                            width: "pw - 4",
                                                            height: "ph - 4",
                                                            element: domEl.now,
                                                            className: "html-page",
                                                            isDisabled: widgetDisable.now,
                                                        }),
                                                    ],
                                                }),
                                            ]
                                        },
                                        "3D": {
                                            children: [
                                                rotatingCube({
                                                    width: "pw",
                                                    height: "ph",
                                                    isDisabled: widgetDisable.now,
                                                }),
                                            ]
                                        },
                                    },
                                }),
                            ]
                        }),
                        w95.widget.tabControl({
                            x: 6,
                            y: 271,
                            width: (width.now - 20),
                            height: Math.max(110, (height.now - 307)),
                            isDisabled: widgetDisable.now,
                            tabIndex: tab2Index.now,
                            newTabIndex(idx) {
                                tab2Index.set(idx);
                            },
                            tabs: {
                                "Scroll area": {
                                    children: [
                                        w95.widget.scrollArea({
                                            x: 3,
                                            y: 3,
                                            width: "pw - 6",
                                            height: "ph - 6",
                                            backgroundColor: w95.palette.named.white,
                                            children: [
                                                w95.widget.label({
                                                    x: 2,
                                                    y: 0,
                                                    isDisabled: widgetDisable.now,
                                                    text: `Stately, plump Buck Mulligan came from the stairhead, bearing a bowl of lather on which a mirror and a razor lay crossed. A yellow dressinggown, ungirdled, was sustained gently behind him by the mild morning air. He held the bowl aloft and intoned:
            
                                                        --Introibo ad altare Dei.
                                                        
                                                        Halted, \bhe p\veer\bed down\v the dark winding stairs and called up coarsely:
                                                        
                                                        --Come up, Kinch. \r{red}Come up\r{}, you fearful Jesuit.
                                                        
                                                        Solemnly he came forward and mounted the round gunrest. He faced about and blessed gravely thrice the tower, the surrounding country and the awaking mountains. Then, catching sight of Stephen Dedalus, he bent towards him and made rapid crosses in the air, gurgling in his throat and shaking his head. Stephen Dedalus, displeased and sleepy, leaned his arms on the top of the staircase and looked coldly at the shaking gurgling face that blessed him, equine in its length, and at the light untonsured hair, grained and hued like pale oak.
                                                        
                                                        Buck Mulligan peeped an instant under the mirror and then covered the bowl smartly.
            
                                                        --Back to barracks, he said sternly.
            
                                                        He added in a preacher's tone:
            
                                                        --For this, O dearly beloved, is the genuine Christine: body and soul and blood and ouns. Slow music, please. Shut your eyes, gents. One moment. A little trouble about those white corpuscles. Silence, all.
            
                                                        He peered sideways up and gave a long low whistle of call then paused awhile in rapt attention, his even white teeth glistening here and there with gold points. Chrysostomos. Two strong shrill whistles answered through the calm.
                                                    `.replace(/  +/g, ""),
                                                }),
                                                w95.widget.bitmap({
                                                    x: 109,
                                                    y: 24,
                                                    image: w95.icon.windowsLogo16x16,
                                                    isDisabled: widgetDisable.now,
                                                }),
                                            ],
                                        }),
                                    ],
                                },
                                "Text edit": {
                                    children: [
                                        w95.widget.textEdit({
                                            x: 3,
                                            y: 3,
                                            width: "pw - 6",
                                            height: "ph - 6",
                                            text: textEditText.now,
                                            autofocus: true,
                                            font: w95.font.fixedsys[9],
                                            newText(text) {
                                                textEditText.set(text);
                                            },
                                        }),
                                    ],
                                },
                                "Embedded <iframe>": {
                                    children: [
                                        w95.widget.frame({
                                            x: 3,
                                            y: 3,
                                            width: "pw - 6",
                                            height: "ph - 6",
                                            shape: w95.frameShape.input,
                                            children: [
                                                embeddedIframe({
                                                    x: 2,
                                                    y: 2,
                                                    width: "pw - 4",
                                                    height: "ph - 4",
                                                    isDisabled: widgetDisable.now,
                                                }),
                                            ]
                                        }),
                                    ],
                                },
                            },
                        }),
                        w95.widget.menuBar({
                            width: (width.now - 8),
                            children: [
                                w95.widget.menuItem({
                                    label: "File",
                                    isTopLevel: true,
                                    isDisabled: widgetDisable.now,
                                    menu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuItem({
                                                label: "Cloud it",
                                                onClick() {
                                                    w95.shell.wallpaper = "./assets/clouds.gif";
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                label: "Exit",
                                                onClick(widget) {
                                                    w95.windowManager.release_window(widget.$app.window);
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                                w95.widget.menuItem({
                                    label: "Dialogs",
                                    isTopLevel: true,
                                    isDisabled: widgetDisable.now,
                                    menu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuItem({
                                                label: "Error",
                                                onClick() {
                                                    isErrorDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuItem({
                                                label: "Question",
                                                onClick() {
                                                    isQuestionDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuItem({
                                                label: "Warning",
                                                onClick() {
                                                    isWarningDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                label: "Custom warning",
                                                onClick() {
                                                    isCustomWarningDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                label: "String query",
                                                onClick() {
                                                    isNameQueryDialogOpen.set(true);
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                                w95.widget.menuItem({
                                    label: "Other",
                                    isTopLevel: true,
                                    isDisabled: widgetDisable.now,
                                    menu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuItem({
                                                label: "Check this",
                                                isCheckable: true,
                                                isChecked: isCheckChecked.now,
                                                newCheckState(isChecked) {
                                                    isCheckChecked.set(isChecked);
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                label: "Sub-menu",
                                                menu: w95.widget.menu({
                                                    children: [
                                                        w95.widget.menuItem({
                                                            label: "Sub-sub-menu",
                                                            menu: w95.widget.menu({
                                                                children: [
                                                                    w95.widget.menuItem({
                                                                        label: "Check this",
                                                                        isCheckable: true,
                                                                        isChecked: isCheckChecked.now,
                                                                        newCheckState(isChecked) {
                                                                            isCheckChecked.set(isChecked);
                                                                        },
                                                                    }),
                                                                ],
                                                            }),
                                                        }),
                                                    ],
                                                }),
                                            }),
                                            w95.widget.menuItem({
                                                label: "Sub-menu 2",
                                                menu: w95.widget.menu({
                                                    children: [
                                                        w95.widget.menuItem({
                                                            label: "Nothing",
                                                        }),
                                                        w95.widget.menuItem({
                                                            label: "Nothing 2",
                                                        }),
                                                        w95.widget.menuItem({
                                                            label: "Sub-sub-menu",
                                                            menu: w95.widget.menu({
                                                                children: [
                                                                    w95.widget.menuItem({
                                                                        label: "Check this",
                                                                        isCheckable: true,
                                                                        isChecked: isCheckChecked.now,
                                                                        newCheckState(isChecked) {
                                                                            isCheckChecked.set(isChecked);
                                                                        },
                                                                    }),
                                                                ],
                                                            }),
                                                        }),
                                                    ],
                                                }),
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                label: "Group item 1",
                                                group: "a",
                                                isCheckable: true,
                                                isChecked: (groupItemCheckIdx.now === 0),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        groupItemCheckIdx.set(0);
                                                    }
                                                },
                                            }),
                                            w95.widget.menuItem({
                                                label: "Group item 2",
                                                group: "a",
                                                isCheckable: true,
                                                isChecked: (groupItemCheckIdx.now === 1),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        groupItemCheckIdx.set(1);
                                                    }
                                                },
                                            }),
                                            w95.widget.menuItem({
                                                label: "Group item 3",
                                                group: "a",
                                                isCheckable: true,
                                                isChecked: (groupItemCheckIdx.now === 2),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        groupItemCheckIdx.set(2);
                                                    }
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                label: "Show debug layer",
                                                isDisabled: !Boolean(w95.shell.display.debugLayer),
                                                isCheckable: true,
                                                isChecked: w95.registry.get("is-debug-enabled"),
                                                newCheckState(isChecked) {
                                                    if (w95.shell.display.debugLayer) {
                                                        w95.shell.display.debugLayer.style.visibility = (isChecked? "visible" : "hidden");
                                                    }
                                                    w95.registry.set("is-debug-enabled", isChecked);
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                label: "Out of service",
                                                isDisabled: true,
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                label: "Operating system",
                                                icon: w95.icon.windowsLogo16x16,
                                            }),
                                            w95.widget.menuItem({
                                                label: "Program application",
                                                icon: w95.icon.applicationIcon16x16,
                                            }),
                                        ],
                                    }),
                                }),
                            ],
                        }),
                        nameQuery({
                            x: ((width.now / 2) - 120),
                            y: 60,
                            width: 240,
                            height: 105,
                            onAccept(name) {
                                userName.set(name);
                                isNameQueryDialogOpen.set(false);
                            },
                            onReject() {
                                isNameQueryDialogOpen.set(false);
                            },
                        }, {hideIf: !isNameQueryDialogOpen.now}),
                        customWarning({
                            parent: this,
                            onReject() {
                                isCustomWarningDialogOpen.set(false);
                            },
                        }, {hideIf: !isCustomWarningDialogOpen.now}),
                        w95.shell.popup({
                            parent: this,
                            icon: w95.icon.warning,
                            title: "Warning",
                            text: "Something went wrong, but I'm not sure what.",
                            buttons: [
                                w95.widget.button({
                                    x: 0,
                                    width: 75,
                                    text: "OK",
                                    onClick() {
                                        isWarningDialogOpen.set(false);
                                    },
                                }),
                                w95.widget.button({
                                    x: 81,
                                    width: 75,
                                    text: "Cancel",
                                    onClick() {
                                        isWarningDialogOpen.set(false);
                                    },
                                }),
                            ],
                        }, {hideIf: !isWarningDialogOpen.now}),
                        w95.shell.popup({
                            parent: this,
                            icon: w95.icon.question,
                            title: "Question",
                            text: "He prodded a fork into the kidney and slapped it over: then fitted the\nteapot on the tray. Its hump bumped as he took it up. Everything on it?",
                            buttons: [
                                w95.widget.button({
                                    x: 0,
                                    width: 75,
                                    text: "Yes",
                                    onClick() {
                                        isQuestionDialogOpen.set(false);
                                    },
                                }),
                                w95.widget.button({
                                    x: 81,
                                    width: 75,
                                    text: "No",
                                    isDisabled: true,
                                    onClick() {
                                        isQuestionDialogOpen.set(false);
                                    },
                                }),
                            ],
                        }, {hideIf: !isQuestionDialogOpen.now}),
                        w95.shell.popup({
                            parent: this,
                            icon: w95.icon.error,
                            title: "Error",
                            text: "The NTVDM CPU has encountered an illegal instruction.",
                            buttons: [
                                w95.widget.button({
                                    width: 75,
                                    text: "OK",
                                    onClick() {
                                        isErrorDialogOpen.set(false);
                                    },
                                }),
                            ],
                        }, {hideIf: !isErrorDialogOpen.now}),
                    ],
                });
            },
        };
    },
};

function set_color_count(widget, count) {
    w95.registry.set(`${widget.$app.id}-display-color-count`, count);
    widget.$app.rerasterize();
}
