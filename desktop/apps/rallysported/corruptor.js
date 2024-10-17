/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import {icons} from "./icons.js";

export default {
    Meta: {
        name: "RallySportED's corruptor",
        version: "1.0",
        author: "Tarpeeksi Hyvae Soft",
    },
    App() {
        const minWidth = 500;
        const minHeight = 400;
        const width = w95.state(Math.max(minWidth, Math.min(1050, ~~(w95.shell.display.width * 0.95))));
        const height = w95.state(Math.max(minHeight, Math.min(700, ~~(w95.shell.display.height * 0.95))));
        const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
        const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);
        const iframeEl = w95.state(document.createElement("iframe"));

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Opened() {
                iframeEl.now.src = "/rallysported/corruptor/?w95";
            },
            Form() {
                return w95.widget.window({
                    icon: icons.app16,
                    parent: this,
                    title: "Corruptor - RallySportED",
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
                        w95.widget.frame({
                            y: 1,
                            width: "pw",
                            height: "ph - 1",
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
    },
};
