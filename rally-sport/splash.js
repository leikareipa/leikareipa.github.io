import {icons} from "./icons.js";

let appInstance = null;

/*
 * Any key closes the panel, except those meant for the browser (as in rally.js)
 * and a key still held down (the Esc that quit the game's menu and opened the panel).
 */
function onKeyDown(event) {
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || ["F5", "F11", "F12"].includes(event.code)) {
        return;
    }
    event.preventDefault();
    if (appInstance) {
        w95.windowManager.release_window(appInstance.window);
    }
}

export default {
    Meta: {
        name: "Rally-Sport splash screen",
        version: "1.0",
        author: "Sigmoid Colon",
    },
    App() {
        const minWidth = 286;
        const minHeight = 82;
        const width = w95.state(minWidth);
        const height = w95.state(minHeight);
        const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
        const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Opened() {
                appInstance = this;
                window.addEventListener("keydown", onKeyDown);
            },
            /* However the panel closes, the game starts (the click or key also lets it play sound). */
            Closed() {
                appInstance = null;
                window.removeEventListener("keydown", onKeyDown);
                window.rallyStartGame();
            },
            Message: {
                fitToDisplay() {
                    x.set(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
                    y.set(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);
                },
            },
            Form() {
                return w95.widget.window({
                    parent: this,
                    styleHints: [w95.styleHint.plain],
                    children: [
                        w95.widget.bitmap({
                            x: 5,
                            y: 17,
                            image: icons.grass,
                        }),
                        w95.widget.label({
                            x: 62,
                            y: 8,
                            width: "pw - 57 - 11",
                            styleHints: [w95.styleHint.alignHCenter],
                            text: "\bRally-Sport w/ network multiplayer\b",
                        }),
                        w95.widget.frame({
                            x: 62,
                            y: 30,
                            width: "pw - 57 - 11",
                            height: 41,
                            children: [
                                w95.widget.horizontalLayout({
                                    x: 10,
                                    y: 10,
                                    padding: 5,
                                    width: "pw - 20",
                                    styleHints: [w95.styleHint.alignLeft],
                                    children: [
                                        w95.widget.button({
                                            width: "~~( pw * 0.67 )",
                                            text: "Run the game!",
                                            onClick({widget}) {
                                                w95.windowManager.release_window(widget.$app.window);
                                            },
                                        }),
                                        w95.widget.button({
                                            width: "~~( pw * 0.33 ) - 4",
                                            text: "Help...",
                                            onClick() {
                                                window.open("help.txt", "_blank");
                                            }
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                });
            },
        };
    },
};
