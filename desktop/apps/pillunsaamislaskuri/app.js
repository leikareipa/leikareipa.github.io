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
        const minHeight = 90;
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
                        w95.widget.label({
                            y: 10,
                            width: "pw",
                            text: `${w95.registry.get("pillua")}`,
                            styleHints: [
                                w95.styleHint.alignHCenter,
                            ],
                        }),
                        w95.widget.button({
                            x: 10,
                            y: 32,
                            width: "pw - 20",
                            text: "Päivitä",
                            onClick() {
                                w95.registry.increment("pillua");
                            },
                        }),
                    ],
                });
            },
        };
    },
};
