/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 */

import {icons} from "./icons.js";

export default function({
    url = "",
    textMode = false,
} = {}) {
    return {
        Meta: {
            name: "MS-DOS Prompt",
            version: "1.0",
            author: "",
        },
        App() {
            const minWidth = 200;
            const minHeight = 200;
            const width = w95.state(653);
            const height = w95.state(textMode? 460 : 540);

            const x = w95.state(
                ~~(0.5 * (w95.shell.display.width - width.now)),
                w95.reRenderOnly
            );
            const y = w95.state(
                ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
                w95.reRenderOnly
            );

            const iframeEl = w95.state(document.createElement("iframe"));
            const focusTimeout = w95.state(undefined);
            
            return {
                get x() { return x.now },
                get y() { return y.now },
                get width() { return width.now },
                get height() { return height.now },
                Opened() {
                    iframeEl.now.src = url;
                    focusTimeout.set(setInterval(()=>{
                        if (!this.window.isBlurred) {
                            iframeEl.now.focus();
                        }
                    }), 100);
                },
                Closed() {
                    clearInterval(focusTimeout.now);
                },
                Form() {
                    return w95.widget.window({
                        parent: this,
                        title: this.$app.Meta.name,
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
                            w95.widget.horizontalRule({
                                width: "pw",
                            }),
                            w95.widget.bitmap({
                                y: 4,
                                image: icons.buttonRow,
                            }),
                            w95.widget.frame({
                                y: 28,
                                width: "pw",
                                height: "ph - 28",
                                shape: w95.frameShape.input,
                                children: [
                                    w95.widget.domElement({
                                        x: 2,
                                        y: 2,
                                        width: "pw - 4",
                                        height: "ph - 4",
                                        element: iframeEl.now,
                                        className: "dosbox",
                                    }),
                                ],
                            }),
                        ],
                    });
                },
            };
        },
    };
};
