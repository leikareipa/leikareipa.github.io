import {icons} from "./icons.js";

export default function(imageUrl = "") {
    return {
        Meta: {
            name: "Image Viewer",
            version: "1.0",
            author: "PippeLeeSoft",
        },
        App() {
            const minWidth = 50;
            const minHeight = 50;
            const maxWidth = (w95.shell.display.width * 0.9);
            const maxHeight = (w95.shell.display.visibleHeight * 0.9);
            const width = w95.state(Math.min(maxWidth, 575));
            const height = w95.state(Math.min(maxHeight, 425));

            const x = w95.state(
                ~~((w95.shell.display.width - width.now) / 2),
                w95.reRenderOnly
            );
            const y = w95.state(
                ~~((w95.shell.display.visibleHeight - height.now) / 2),
                w95.reRenderOnly
            );

            const isImageLoaded = w95.state(false);
            const imageCanvas = w95.state(document.createElement("canvas"));
            const imageTexture = w95.state(undefined);
            const isAboutDialogOpen = w95.state(false);

            return {
                get x() { return x.now },
                get y() { return y.now },
                get width() { return width.now },
                get height() { return height.now },
                Opened() {
                    load_image(imageUrl);
                },
                Form() {
                    return w95.widget.window({
                        parent: this,
                        title: (
                            isImageLoaded.now
                                ? `${imageUrl.split("/").at(-1)} - ${this.$app.Meta.name}`
                                : this.$app.Meta.name
                        ),
                        icon: icons.app16,
                        move(deltaX, deltaY) {
                            x.set(x.now + deltaX);
                            y.set(y.now + deltaY);
                        },
                        resize(deltaWidth, deltaHeight) {
                            width.set(Math.max(minWidth, (width.now + deltaWidth)));
                            height.set(Math.max(minHeight, (height.now + deltaHeight)));
                        },
                        close() {
                            w95.windowManager.release_window(this)
                        },
                        children: [
                            w95.widget.menuBar({
                                width: (width.now - 8),
                                children: [
                                    w95.widget.menuAction({
                                        label: "File",
                                        isTopLevel: true,
                                        submenu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuAction({
                                                    label: "Exit",
                                                    onClick(widget) {
                                                        w95.windowManager.release_window(widget.$app.window);
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
                                                        isAboutDialogOpen.set(true);
                                                    },
                                                }),
                                            ],
                                        }),
                                    }),
                                ],
                            }),
                            w95.widget.scrollArea({
                                y: 18,
                                width: "pw",
                                height: "ph - 18",
                                alwaysShowHorizontalScroll: true,
                                alwaysShowVerticalScroll: true,
                                backgroundColor: Rngon.color(128, 128, 128),
                                children: [
                                    w95.widget.bitmap({
                                        image: imageTexture.now,
                                    }, {hideIf: !imageTexture.now}),
                                ],
                            }),
                            w95.shell.popup.about({
                                parent: this,
                                onClose() {
                                    isAboutDialogOpen.set(false);
                                },
                            }, {hideIf: !isAboutDialogOpen.now}),
                        ],
                    });
                },
            };

            function load_image(url) {
                w95.debug?.assert(typeof url === "string");

                const img = document.createElement("img");
                img.src = url;
                img.onload = ()=>{
                    imageCanvas.now.width = img.width;
                    imageCanvas.now.height = img.height;

                    const ctx = imageCanvas.now.getContext("2d");
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    convert_image_to_texture(ctx.getImageData(0, 0, img.width, img.height));
                };
            }

            function convert_image_to_texture(imageData) {
                w95.debug?.assert(imageData instanceof ImageData);

                imageTexture.set(
                    Rngon.texture({
                        width: imageData.width,
                        height: imageData.height,
                        pixels: imageData.data,
                    })
                );

                isImageLoaded.set(true);
            }
        },
    };
};
