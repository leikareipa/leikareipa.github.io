
export default {
    Meta: {
        name: "A sample w95 app",
        version: "0.0",
        author: "Unknown",
        description: "This app was created using create-w95-app.sh",
    },
    App() {
        const minWidth = 200;
        const minHeight = 100;
        const width = w95.state(minWidth);
        const height = w95.state(minHeight);
        const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
        const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);
        
        const isPissed = w95.state(false);

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: this.$app.Meta.name,
                    resize(newWidth, newHeight) {
                        width.set(Math.max(minWidth, (width.now + newWidth)));
                        height.set(Math.max(minHeight, (height.now + newHeight)));
                    },
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },
                    close() {
                        w95.windowManager.release_window(this)
                    },
                    children: [
                        w95.widget.verticalLayout({
                            width: "pw",
                            height: "ph",
                            padding: 6,
                            styleHints: [
                                w95.styleHint.alignHCenter,
                                w95.styleHint.alignVCenter,
                            ],
                            children: [
                                w95.widget.label({
                                    text: (isPissed.now? "Piss off." : "Hello, world!"),
                                }),
                                w95.widget.button({
                                    text: "Tell a joke",
                                    onClick() {
                                        isPissed.set(true);
                                    },
                                }, {hideIf: isPissed.now}),
                            ],
                        }),
                    ],
                });
            },
        };
    },
};

