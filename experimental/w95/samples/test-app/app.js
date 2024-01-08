/*
 * 2023 Tarpeeksi Hyvae Soft
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
        const appWidth = w95.state(404);
        const appHeight = w95.state(500);
        const domEl = w95.state(document.createElement("div"))
    
        const isNameQueryDialogOpen = w95.state(false);
        const isCustomWarningDialogOpen = w95.state(false);
        const isQuestionDialogOpen = w95.state(false);
        const isWarningDialogOpen = w95.state(false);
        const isErrorDialogOpen = w95.state(false);
    
        const sliderValue = w95.state(5);
        const lineEditText = w95.state("Left empty");
        const numEditText = w95.state("123");
        const userName = w95.state("");
        const widgetDisable = w95.state(false);
        const tabIndex = w95.state(1);
        const tab2Index = w95.state(0);
        const radioGroupIndex = w95.state(1);
        const dropdownIndex = w95.state(2);
    
        return {
            get width() { return appWidth.now },
            get height() { return appHeight.now },
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
                        <img src="construction.gif">
                        <a target="_blank" href="https://www.google.com">Under construction</a>
                        <img src="construction.gif">
                    </div>
                `;

                // Center the window on the screen.
                this.move({
                    x: ~~((w95.shell.display.width / 2) - (appWidth.now / 2)),
                    y: Math.max(0, ~~((w95.shell.display.height / 2) - (appHeight.now / 2))),
                });
            },
            Closed() {
                domEl.now.remove();
            },
            Form() {
                return w95.widget.window({
                    width: appWidth.now,
                    height: appHeight.now,
                    title: `${userName.now.length? `${userName.now} - ` : ""}Developer's test app for w95`,
                    resize({height, isRelative}) {
                        (height? appHeight.set(Math.max(100, (isRelative? (appHeight.now + height) : height))) : 0);
                    },
                    maximized() {
                        return {
                            y: 0,
                            height: w95.shell.display.height,
                        };
                    },
                    children: [
                        w95.widget.groupBox({
                            title: `Sliders & progress (${(sliderValue.now * 10)}%)`,
                            x: 10,
                            y: 208,
                            width: 182,
                            height: 105,
                            children: [
                                w95.widget.progressBar({
                                    x: 10,
                                    y: 15,
                                    width: "pw - 20",
                                    progress: (sliderValue.now * 10),
                                    isDisabled: widgetDisable.now,
                                    showLabel: true,
                                }),
                                w95.widget.progressBar({
                                    x: 10,
                                    y: 35,
                                    width: "pw - 20",
                                    progress: (sliderValue.now * 10),
                                    isDisabled: widgetDisable.now,
                                    styleHints: [
                                        w95.styleHint.dashed,
                                    ],
                                }),
                                w95.widget.horizontalSlider({
                                    x: 10,
                                    y: 60,
                                    width: "pw - 20",
                                    minValue: 0,
                                    maxValue: 10,
                                    value: sliderValue.now,
                                    isDisabled: widgetDisable.now,
                                    newValue(value) {
                                        sliderValue.set(value);
                                    },
                                }),
                            ]
                        }),
                        w95.widget.groupBox({
                            title: "Fields",
                            x: 10,
                            y: 28,
                            width: 182,
                            height: 85,
                            children: [
                                w95.widget.dropdownBox({
                                    x: 10,
                                    y: 15,
                                    width: "pw - 20",
                                    isDisabled: widgetDisable.now,
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
                                    isDisabled: widgetDisable.now,
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
                                    isDisabled: widgetDisable.now,
                                    newText(text) {
                                        numEditText.set(text);
                                    },
                                }),
                            ]
                        }),
                        w95.widget.groupBox({
                            title: "Toggleables",
                            x: 10,
                            y: 123,
                            width: 182,
                            height: 75,
                            children: [
                                w95.widget.checkbox({
                                    x: 10,
                                    y: 18,
                                    label: "Debug", 
                                    isChecked: w95.registry.get("is-debug-enabled"),
                                    isDisabled: (widgetDisable.now || !Boolean(w95.shell.display.debugLayer)),
                                    newCheckState(isChecked) {
                                        if (w95.shell.display.debugLayer) {
                                            w95.shell.display.debugLayer.style.visibility = (isChecked? "visible" : "hidden");
                                        }
                                        w95.registry.set("is-debug-enabled", isChecked);
                                    },
                                }),
                                w95.widget.checkbox({
                                    x: 71,
                                    y: 18,
                                    label: "Disable widgets", 
                                    isChecked: widgetDisable.now,
                                    newCheckState(isChecked) {
                                        widgetDisable.set(isChecked);
                                    },
                                }),
                                w95.widget.radioGroup({
                                    x: 10,
                                    y: 44,
                                    itemIndex: radioGroupIndex.now,
                                    newItemIndex(idx) {
                                        radioGroupIndex.set(idx);
                                        w95.shell.display.scale = (idx + 1);
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
                                            isDisabled: widgetDisable.now,
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
                            x: 204,
                            y: 28,
                            width: 182,
                            height: 85,
                            children: [
                                spawnButton({
                                    x: 10,
                                    y: 15,
                                    width: "pw - 20",
                                    isDisabled: widgetDisable.now,
                                }),
                                twoStateButton({
                                    x: 10,
                                    y: 45,
                                    width: "pw - 20",
                                    isDisabled: widgetDisable.now,
                                }),
                            ],
                        }),
                        w95.widget.groupBox({
                            title: "Tab widget",
                            x: 204,
                            y: 123,
                            width: 182,
                            height: 190,
                            children: [
                                w95.widget.tabControl({
                                    x: 10,
                                    y: 15,
                                    width: "pw - 20",
                                    height: 157,
                                    isDisabled: widgetDisable.now,
                                    tabIndex: tabIndex.now,
                                    newTabIndex(idx) {
                                        tabIndex.set(idx);
                                    },
                                    tabs: {
                                        "Stats": {
                                            children: [
                                                statistics({
                                                    width: 158,
                                                    height: 131,
                                                }),
                                            ],
                                        },
                                        "Notes": {
                                            children: [
                                                w95.widget.label({
                                                    x: 9,
                                                    y: 9,
                                                    text: "1.) Use the \b#no-debug\b URL\nhash to disable the DOM\ndebug layer.",
                                                }),
                                                w95.widget.label({
                                                    x: 9,
                                                    y: 57,
                                                    text: "2.) For more info, see the w95\ncode repository on GitHub.*",
                                                }),
                                                w95.widget.label({
                                                    x: 84,
                                                    y: 70,
                                                    text: "on GitHub",
                                                    color: (
                                                        widgetDisable.now
                                                            ? w95.palette.named.darkGray
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
                                                    y: 96,
                                                    width: 144
                                                }),
                                                w95.widget.label({
                                                    x: 7,
                                                    y: 101,
                                                    color: w95.palette.named.darkGray,
                                                    text: "* This software is not associat-\ned with Microsoft.",
                                                }),
                                            ]
                                        },
                                        "3D": {
                                            children: [
                                                rotatingCube({
                                                    width: 158,
                                                    height: 133,
                                                    isDisabled: widgetDisable.now,
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
                                    },
                                }),
                            ]
                        }),
                        w95.widget.tabControl({
                            x: 10,
                            y: 322,
                            width: (appWidth.now - 28),
                            height: Math.max(120, (appHeight.now - 359)),
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
                                            isDisabled: widgetDisable.now,
                                            backgroundColor: w95.palette.named.white,
                                            children: [
                                                w95.widget.label({
                                                    x: 7,
                                                    y: 7,
                                                    isDisabled: widgetDisable.now,
                                                    text: `Stately, plump Buck Mulligan came from the stairhead, bearing a bowl of lather on which a mirror and a razor lay crossed. A yellow dressinggown, ungirdled, was sustained gently behind him by the mild morning air. He held the bowl aloft and intoned:
            
                                                        --Introibo ad altare Dei.
                                                        
                                                        Halted, he peered down the dark winding stairs and called up coarsely:
                                                        
                                                        --Come up, Kinch. Come up, you fearful Jesuit.
                                                        
                                                        Solemnly he came forward and mounted the round gunrest. He faced about and blessed gravely thrice the tower, the surrounding country and the awaking mountains. Then, catching sight of Stephen Dedalus, he bent towards him and made rapid crosses in the air, gurgling in his throat and shaking his head. Stephen Dedalus, displeased and sleepy, leaned his arms on the top of the staircase and looked coldly at the shaking gurgling face that blessed him, equine in its length, and at the light untonsured hair, grained and hued like pale oak.
                                                        
                                                        Buck Mulligan peeped an instant under the mirror and then covered the bowl smartly.
            
                                                        --Back to barracks, he said sternly.
            
                                                        He added in a preacher's tone:
            
                                                        --For this, O dearly beloved, is the genuine Christine: body and soul and blood and ouns. Slow music, please. Shut your eyes, gents. One moment. A little trouble about those white corpuscles. Silence, all.
            
                                                        He peered sideways up and gave a long low whistle of call then paused awhile in rapt attention, his even white teeth glistening here and there with gold points. Chrysostomos. Two strong shrill whistles answered through the calm.
                                                    `.replace(/  +/g, ""),
                                                }),
                                                w95.widget.bitmap({
                                                    x: 114,
                                                    y: 31,
                                                    image: w95.icon.windowsLogo16x16,
                                                    isDisabled: widgetDisable.now,
                                                }),
                                            ],
                                        }),
                                    ],
                                },
                                "Text edit": {
                                    children: [
                                        w95.widget.label({
                                            width: "pw",
                                            height: "ph",
                                            text: "TODO",
                                            styleHints: [
                                                w95.styleHint.alignVCenter,
                                                w95.styleHint.alignHCenter,
                                            ],
                                        }),
                                    ],
                                },
                            },
                        }),
                        w95.widget.menuBar({
                            width: (appWidth.now - 8),
                            children: [
                                w95.widget.menuItem({
                                    text: "Edit",
                                    isTopLevel: true,
                                    isDisabled: widgetDisable.now,
                                    menu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuItem({
                                                text: "Copy",
                                            }),
                                            w95.widget.menuItem({
                                                text: "Paste",
                                            }),
                                        ],
                                    }),
                                }),
                                w95.widget.menuItem({
                                    text: "Dialogs",
                                    isTopLevel: true,
                                    isDisabled: widgetDisable.now,
                                    menu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuItem({
                                                text: "Error",
                                                onClick() {
                                                    isErrorDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuItem({
                                                text: "Question",
                                                onClick() {
                                                    isQuestionDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuItem({
                                                text: "Warning",
                                                onClick() {
                                                    isWarningDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                text: "Custom warning",
                                                onClick() {
                                                    isCustomWarningDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                text: "String query",
                                                onClick() {
                                                    isNameQueryDialogOpen.set(true);
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                                w95.widget.menuItem({
                                    text: "Help",
                                    isTopLevel: true,
                                    isDisabled: widgetDisable.now,
                                    menu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuItem({
                                                text: "Help topics",
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuItem({
                                                text: "About Calculator",
                                            }),
                                        ],
                                    }),
                                }),
                            ],
                        }),
                        nameQuery({
                            x: ((appWidth.now / 2) - 120),
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
                            onReject() {
                                isCustomWarningDialogOpen.set(false);
                            },
                        }, {hideIf: !isCustomWarningDialogOpen.now}),
                        w95.shell.popup({
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
                                    onClick() {
                                        isQuestionDialogOpen.set(false);
                                    },
                                }),
                            ],
                        }, {hideIf: !isQuestionDialogOpen.now}),
                        w95.shell.popup({
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
    const parentApp = w95.windowManager.get_parent_app(widget);
    w95.debug?.assert(parentApp?._type === "app");
    w95.registry.set(`${parentApp.id}-display-color-count`, count);
    parentApp.rerasterize();
}
