/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import "./custom-widgets/spawn-button.js";
import "./custom-widgets/two-state-button.js";
import "./custom-widgets/rotating-cube.js";
import "./custom-widgets/statistics.js";
import "./custom-widgets/name-query.js";
import "./custom-widgets/serious-warning.js";

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
        const width = w95.state(404);
        const height = w95.state(500);
        const x = w95.state(~~((w95.shell.display.width / 2) - (width.now / 2)));
        const y = w95.state(~~((w95.shell.display.height / 2) - (height.now / 2)));
    
        const isNameQueryDialogOpen = w95.state(false);
        const isWarningDialogOpen = w95.state(false);
    
        const sliderValue = w95.state(5);
        const lineEditText = w95.state("Left empty");
        const userName = w95.state("");
        const widgetDisable = w95.state(false);
        const tabIndex = w95.state(1);
        const radioGroupIndex = w95.state(0);
        const dropdownIndex = w95.state(2);
    
        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Form() {
                return w95.widget.window({
                    $name: "main-window",
                    x: x.now,
                    y: y.now,
                    width: width.now,
                    height: height.now,
                    title: `${userName.now.length? `${userName.now} - ` : ""}Test app for w95`,
                    move(newX, newY, {isRelative}) {
                        x.set(newX + (isRelative? x.now : 0));
                        y.set(newY + (isRelative? y.now : 0));
                    },
                    resize(newWidth, newHeight, {isRelative}) {
                        height.set(Math.max(100, (newHeight + (isRelative? height.now : 0))));
                    },
                    maximize() {
                        y.set(0);
                        height.set(w95.shell.display.height);
                    },
                    close(window) {
                        w95.debug?.assert(window?._type === "window");
                        w95.windowManager.release_window(window);
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
                                    width: 162,
                                    progress: (sliderValue.now * 10),
                                    isDisabled: widgetDisable.now,
                                    showLabel: true,
                                }),
                                w95.widget.progressBar({
                                    x: 10,
                                    y: 35,
                                    width: 162,
                                    progress: (sliderValue.now * 10),
                                    isDisabled: widgetDisable.now,
                                    styleHints: [
                                        w95.styleHint.dashed,
                                    ],
                                }),
                                w95.widget.horizontalSlider({
                                    x: 10,
                                    y: 60,
                                    width: 162,
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
                                    width: 162,
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
                                    width: 162,
                                    text: lineEditText.now,
                                    isDisabled: widgetDisable.now,
                                    newText(text) {
                                        lineEditText.set(text);
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
                                    },
                                    items: {
                                        "A": {
                                            isDisabled: widgetDisable.now,
                                        },
                                        "B": {
                                            x: 40,
                                            y: 0,
                                            isDisabled: widgetDisable.now,
                                        },
                                        "C": {
                                            x: 80,
                                            y: 0,
                                            isDisabled: widgetDisable.now,
                                        },
                                        "D": {
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
                                w95.widget.spawnButton({
                                    x: 10,
                                    y: 15,
                                    width: 162,
                                    isDisabled: widgetDisable.now,
                                }),
                                w95.widget.twoStateButton({
                                    x: 10,
                                    y: 45,
                                    width: 162,
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
                                    width: 162,
                                    height: 157,
                                    isDisabled: widgetDisable.now,
                                    tabIndex: tabIndex.now,
                                    newTabIndex(idx) {
                                        tabIndex.set(idx);
                                    },
                                    tabs: {
                                        "Statistics": {
                                            children: [
                                                w95.widget.statistics({
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
                                                w95.widget.rotatingCube({
                                                    width: 158,
                                                    height: 133,
                                                    isDisabled: widgetDisable.now,
                                                }),
                                            ]
                                        },
                                    },
                                }),
                            ]
                        }),
                        w95.widget.groupBox({
                            title: "Scroll area",
                            x: 10,
                            y: 323,
                            width: width.now-28,
                            height: Math.max(100, (height.now - 360)),
                            children: [
                                w95.widget.scrollArea({
                                    x: 10,
                                    y: 15,
                                    width: width.now-48,
                                    height: Math.max(69, (height.now - 360 - 31)),
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
                            ]
                        }),
                        w95.widget.menuBar({
                            width: (width.now - 8),
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
                                                text: "String query",
                                                onClick() {
                                                    isNameQueryDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.menuItem({
                                                text: "Warning",
                                                onClick() {
                                                    isWarningDialogOpen.set(true);
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
                        w95.widget.nameQuery({
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
                        w95.widget.seriousWarning({
                            onReject() {
                                isWarningDialogOpen.set(false);
                            },
                        }, {hideIf: !isWarningDialogOpen.now}),
                    ],
                });
            },
        };
    },
};

function set_color_count(widget, count) {
    const parentApp = w95.windowManager.get_parent_app(widget);
    w95.debug?.assert(parentApp?._type === "app");
    w95.registry.set(`${parentApp.uuid}-display-color-count`, count);
}
