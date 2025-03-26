/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import {icons} from "./assets/icons.js";

export default {
    Meta: {
        name: "HTML editor",
        version: "1.0",
        author: "Tarpeeksi Hyvae Soft",
    },
    App() {
        const minWidth = 467;
        const minHeight = 315;
        const width = w95.state(minWidth);
        const height = w95.state(minHeight);

        const x = w95.state(
            ~~(0.5 * (w95.shell.display.width - width.now)),
            w95.reRenderOnly
        );
        const y = w95.state(
            ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
            w95.reRenderOnly
        );

        const showAbout = w95.state(false);
        const editorFont = w95.state(w95.font.courier8);
        const tabIdx = w95.state(0);
        const html = w95.state(`
<h1>Recent releases</h1>
<table width="100%">
    <tr>
        <td>Transilvanian hunger</td>
        <td>1994</td>
    </tr>
    <tr>
        <td>Varjoissa</td>
        <td>1995</td>
    </tr>
    <tr>
        <td>Wellone aeternitas</td>
        <td>1996</td>
    </tr>
</table>
<hr>
Last updated on 12/22/1996 by <a href="#">metal webmaster</a>.
<br>
<br>
This page best viewed with Netscape <img src="./assets/netscape.gif">`.replace(/^\n/g, ""));

        const previewEl = w95.state(document.createElement("div"));
        previewEl.now.innerHTML = html.now;
    
        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: "HTML Editor",
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
                                    label: "Font",
                                    isTopLevel: true,
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Courier",
                                                group: "font",
                                                isCheckable: true,
                                                isChecked: (editorFont.now === w95.font.courier8),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        editorFont.set(w95.font.courier8);
                                                    }
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Fixedsys",
                                                group: "font",
                                                isCheckable: true,
                                                isChecked: (editorFont.now === w95.font.fixedsys9),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        editorFont.set(w95.font.fixedsys9);
                                                    }
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Sans Serif",
                                                group: "font",
                                                isCheckable: true,
                                                isChecked: (editorFont.now === w95.font.sansSerif8),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        editorFont.set(w95.font.sansSerif8);
                                                    }
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
                                            w95.widget.menuAction({
                                                label: "VGA 9x16",
                                                group: "font",
                                                isCheckable: true,
                                                isChecked: (editorFont.now === w95.font.vga9x16),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        editorFont.set(w95.font.vga9x16);
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
                                                    showAbout.set(true);
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                            ],
                        }),
                        w95.widget.tabControl({
                            tabIndex: tabIdx.now,
                            y: 20,
                            width: "pw",
                            height: "ph - 20",
                            tabs: {
                                "HTML": {
                                    children: [
                                        w95.widget.textEdit({
                                            x: 3,
                                            y: 3,
                                            width: "pw - 6",
                                            height: "ph - 6",
                                            state: html,
                                            font: editorFont.now,
                                            wordWrap: false,
                                            onChange(text) {
                                                previewEl.now.innerHTML = text;
                                            },
                                            highlighter(text) {
                                                return text
                                                    .replace(/>(.*?)<\/a>/g, ">\r{blue}\v$1\v\r{-}</a>")
                                                    .replace(/(<.*?>)/g, "\r{mediumseagreen}$1\r{-}")
                                                    .replace(/(".*?")/g, "\r{hotpink}$1\r{}")
                                            },
                                        }),
                                    ],
                                },
                                "Preview": {
                                    children: [
                                        w95.widget.frame({
                                            x: 3,
                                            y: 3,
                                            width: "pw - 6",
                                            height: "ph - 6",
                                            shape: w95.frameShape.input,
                                            children: [
                                                w95.widget.domElement({
                                                    x: 2,
                                                    y: 2,
                                                    width: "pw - 4",
                                                    height: "ph - 4",
                                                    element: previewEl.now,
                                                    className: "preview",
                                                }),
                                            ],
                                        }),
                                    ],
                                },
                            },
                            state: tabIdx,
                        }),
                        w95.shell.popup({
                            parent: this,
                            icon: w95.icon.information,
                            title: `About ${this.$app.Meta.name} ${this.$app.Meta.version}`,
                            text: "This sample application for w95 demonstrates the use of the\ntextEdit and domElement widgets.",
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
