/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import {icons} from "./icons.js";

export default {
    Meta: {
        name: "Pillunsaamislaskuri",
        version: "1.0",
        author: "Tarpeeksi Hyvae Soft",
    },
    App() {
        const minWidth = 200;
        const minHeight = 89;
        const width = w95.state(minWidth);
        const height = w95.state(minHeight);

        const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
        const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: "Pillunsaamislaskuri",
                    icon: icons.app16,
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },
                    close() {
                        w95.windowManager.release_window(this)
                    },
                    children: [
                        w95.widget.verticalLayout({
                            x: 4,
                            width: "pw - 8",
                            height: (height.now - 24),
                            padding: 4,
                            styleHints: [
                                w95.styleHint.alignVCenter,
                                w95.styleHint.alignHCenter,
                            ],
                            children: [
                                w95.widget.frame({
                                    width: "pw",
                                    height: 28,
                                    backgroundColor: w95.color(0, 0, 0),
                                    children: [
                                        w95.widget.horizontalLayout({
                                            y: 6,
                                            width: "pw",
                                            padding: 2,
                                            styleHints: [
                                                w95.styleHint.alignVCenter,
                                                w95.styleHint.alignHCenter,
                                            ],
                                            children: String(w95.registry["pillua"]).split("").map((digit, idx)=>(
                                                w95.widget.bitmap({
                                                    image: icons[digit],
                                                    color: w95.color.limegreen,
                                                })
                                            ))
                                        }),
                                    ],
                                }),
                                w95.widget.button({
                                    width: "pw",
                                    text: "Päivitä",
                                    onClick() {
                                        w95.registry["pillua"]++;
                                    },
                                }),
                            ],
                        }),
                    ],
                });
            },
        };
    },
};
