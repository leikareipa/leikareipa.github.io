import {icons} from "./icons.js";

export default {
    Meta: {
        name: "Retro n-gon texture converter",
        version: "1.0",
        author: "Tarpeeksi Hyvae Soft",
    },
    App() {
        const width = w95.state(325);
        const height = w95.state(199);

        const x = w95.state(
            ~~((w95.shell.display.width - width.now) / 2),
            w95.reRenderOnly
        );
        const y = w95.state(
            ~~((w95.shell.display.visibleHeight - height.now) / 2),
            w95.reRenderOnly
        );

        const isColorDepthLocked = w95.state(false);
        const hasImageBeenCopied = w95.state(false);
        const conversionIsFinished = w95.state(false);
        const imageIsLoading = w95.state(false);
        const imageSize = w95.state("");
        const imageData = w95.state(undefined);
        const imageCanvas = w95.state(document.createElement("canvas"));
        const imageSelectorEl = w95.state(document.createElement("input"));
        const tabIndex = w95.state(0);
        const colorDepth = w95.state("8888");
        const prevColorDepth = w95.state(undefined);
        const encoding = w95.state("Base64");
        const chromaKey = {
            enabled: w95.state(false),
            red: w95.state("0"),
            green: w95.state("0"),
            blue: w95.state("0"),
            is(red, green, blue) {
                return (
                    this.enabled &&
                    (red == this.red) &&
                    (green == this.green) &&
                    (blue == this.blue)
                )
            },
        };

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Opened() {
                imageCanvas.now.style.width = "100px";
                imageCanvas.now.style.height = "100px";

                imageSelectorEl.now.type = "file";
                imageSelectorEl.now.accept = "image/*";
                imageSelectorEl.now.onchange = async function() {
                    load_image(imageSelectorEl.now.files[0]);
                    imageSelectorEl.now.value = null;
                };
            },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: "Retro n-gon texture converter",
                    icon: icons.app16,
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },
                    close() {
                        w95.windowManager.release_window(this)
                    },
                    children: [
                        w95.widget.tabControl({
                            x: 2,
                            y: 2,
                            width: "pw - 4",
                            height: "ph - 3",
                            state: tabIndex,
                            tabs: {
                                "Image to JSON": {
                                    children: [
                                        w95.widget.frame({
                                            x: 10,
                                            y: 10,
                                            width: 100,
                                            height: 100,
                                            shape: w95.frameShape.input,
                                            children: [
                                                w95.widget.domElement({
                                                    x: 2,
                                                    y: 2,
                                                    width: "pw - 4",
                                                    height: "ph - 4",
                                                    className: "ngon-texture-convert",
                                                    element: imageCanvas.now,
                                                }),
                                            ],
                                        }),
                                        w95.widget.button({
                                            x: 10,
                                            y: 115,
                                            width: 100,
                                            text: "Select image...",
                                            isDisabled: imageIsLoading.now,
                                            onClick() {
                                                imageSelectorEl.now.click();
                                            },
                                        }),
                                        w95.widget.verticalLayout({
                                            x: 120,
                                            y: 10,
                                            padding: 5,
                                            isDisabled: !imageData.now,
                                            children: [
                                                w95.widget.horizontalLayout({
                                                    styleHints: [
                                                        w95.styleHint.alignVCenter,
                                                    ],
                                                    width: 500,
                                                    children: [
                                                        w95.widget.label({
                                                            text: "Color depth",
                                                        }),
                                                        w95.widget.layoutSpacer({
                                                            width: 25,
                                                        }),
                                                        w95.widget.dropdownBox({
                                                            width: 100,
                                                            itemIndex: colorDepth.now,
                                                            isDisabled: isColorDepthLocked.now,
                                                            items: [
                                                                {label: "8888"},
                                                                {label: "5551"},
                                                                {label: "Binary"},
                                                            ],
                                                            newItemIndex(idx, item) {
                                                                colorDepth.set(item.text);
                                                            },
                                                        }),
                                                    ],
                                                }),
                                                w95.widget.horizontalLayout({
                                                    styleHints: [
                                                        w95.styleHint.alignVCenter,
                                                    ],
                                                    width: 500,
                                                    children: [
                                                        w95.widget.label({
                                                            text: "Pixel encoding",
                                                        }),
                                                        w95.widget.layoutSpacer({
                                                            width: 10,
                                                        }),
                                                        w95.widget.dropdownBox({
                                                            width: 100,
                                                            itemIndex: encoding.now,
                                                            items: [
                                                                {label: "Base64"},
                                                                {label: "Array"},
                                                            ],
                                                            newItemIndex(idx, item) {
                                                                encoding.set(item.text);
                                                                if (item.text === "Array") {
                                                                    prevColorDepth.set(colorDepth.now);
                                                                    colorDepth.set("8888");
                                                                    isColorDepthLocked.set(true);
                                                                }
                                                                else {
                                                                    isColorDepthLocked.set(false);
                                                                    if (prevColorDepth.now) {
                                                                        colorDepth.set(prevColorDepth.now);
                                                                        prevColorDepth.set(undefined);
                                                                    }
                                                                }
                                                            },
                                                        }),
                                                    ],
                                                }),
                                                w95.widget.horizontalLayout({
                                                    styleHints: [
                                                        w95.styleHint.alignVCenter,
                                                    ],
                                                    width: 500,
                                                    children: [
                                                        w95.widget.checkbox({
                                                            state: chromaKey.enabled,
                                                            label: "Chroma key",
                                                        }),
                                                        w95.widget.layoutSpacer({
                                                            width: (imageData.now? 4 : 3),
                                                        }),
                                                        w95.widget.lineEdit({
                                                            width: 30,
                                                            state: chromaKey.red,
                                                            validator: /[0-9]/,
                                                            isDisabled: !chromaKey.enabled.now,
                                                        }),
                                                        w95.widget.layoutSpacer({
                                                            width: 2,
                                                        }),
                                                        w95.widget.lineEdit({
                                                            width: 30,
                                                            state: chromaKey.green,
                                                            validator: /[0-9]/,
                                                            isDisabled: !chromaKey.enabled.now,
                                                        }),
                                                        w95.widget.layoutSpacer({
                                                            width: 2,
                                                        }),
                                                        w95.widget.lineEdit({
                                                            width: 30,
                                                            state: chromaKey.blue,
                                                            validator: /[0-9]/,
                                                            isDisabled: !chromaKey.enabled.now,
                                                        }),
                                                    ],
                                                }),
                                                w95.widget.button({
                                                    width: 182,
                                                    text: "Convert",
                                                    onClick() {
                                                        const imageAsJson = {
                                                            width: imageData.now.width,
                                                            height: imageData.now.height,
                                                            pixels: convert_image(),
                                                            encoding: (
                                                                (encoding.now === "Base64")
                                                                    ? "base64"
                                                                    : "none"
                                                            ),
                                                            channels: (
                                                                (colorDepth.now === "8888")
                                                                    ? "rgba:8+8+8+8"
                                                                    : (colorDepth.now === "5551")
                                                                        ? "rgba:5+5+5+1"
                                                                        : "binary"
                                                            ),
                                                        };

                                                        imageData.now.$json = (
                                                            (encoding.now === "Array")
                                                                ? JSON.stringify(imageAsJson)
                                                                : JSON.stringify(imageAsJson, null, 4)
                                                        );
                                                        imageSize.set(byte_size_string(imageData.now.$json.length));

                                                        conversionIsFinished.set(true);
                                                    },
                                                }),
                                                w95.widget.layoutSpacer({
                                                    height: 4,
                                                }),
                                                w95.widget.label({
                                                    cursor: w95.cursor.pointer,
                                                    width: 182,
                                                    text: `Done! Copy to clipboard (${imageSize.now}).`,
                                                    color: (
                                                        hasImageBeenCopied.now
                                                            ? w95.palette.named.purple
                                                            : w95.palette.named.blue
                                                    ),
                                                    styleHints: [
                                                        w95.styleHint.underlined,
                                                    ],
                                                    onMouseDown() {
                                                        navigator.clipboard.writeText(imageData.now.$json);
                                                        hasImageBeenCopied.set(true);
                                                    },
                                                }, {hideIf: !conversionIsFinished.now}),
                                            ],
                                        }),
                                    ],
                                },
                                "JSON to image": {
                                    isDisabled: true,
                                    children: [
                                    ],
                                },
                            },
                        }),
                    ],
                });
            },
        };

        function byte_size_string(bytes) {
            if (!bytes) {
            return "0 B";
            }
            const logValue = Math.floor(Math.log(bytes) / Math.log(1000)); 
            const size = Math.round(bytes / Math.pow(1000, logValue)); 
            return `${size} ${['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][logValue]}`;
        }

        function load_image(imageFile) {
            if (!imageFile) {
                return;
            }

            conversionIsFinished.set(false);
            imageIsLoading.set(true);
            imageData.set(undefined);
            const ctx = imageCanvas.now.getContext("2d");
            ctx.clearRect(0, 0, imageCanvas.now.width, imageCanvas.now.height);
            
            const img = document.createElement("img");
            img.onload = ()=>{
                imageCanvas.now.width = img.width;
                imageCanvas.now.height = img.height;
        
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                imageData.set(ctx.getImageData(0, 0, img.width, img.height));
                imageIsLoading.set(false);
            };

            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = ()=>{
                img.src = fileReader.result;
            };
        }

        function convert_image() {
            hasImageBeenCopied.set(false);
            let convertedPixels = [];

            for (let y = 0; y < imageData.now.height; y++) {
                for (let x = 0; x < imageData.now.width; x++) {
                    const idx = ((x + y * imageData.now.width) * 4);

                    const red = imageData.now.data[idx + 0];
                    const green = imageData.now.data[idx + 1];
                    const blue = imageData.now.data[idx + 2];
                    const alpha = (
                        chromaKey.is(red, green, blue)
                            ? 0
                            : imageData.now.data[idx + 3]
                    );

                    switch (colorDepth.now) {
                        case "8888": {
                            convertedPixels.push(red, green, blue, alpha);
                            break;
                        }
                        case "5551": {
                            convertedPixels.push(
                                (red   / 8)        |
                               ((green / 8) << 5)  |
                               ((blue  / 8) << 10) |
                               ((alpha & 1) << 15)
                           );
                           break;
                        }
                        case "Binary": {
                            convertedPixels.push(~~Boolean(red || green || blue || alpha));
                           break;
                        }
                    }
                }
            }

            switch (encoding.now) {
                case "Array": return convertedPixels;
                case "Base64": {
                    switch (colorDepth.now) {
                        // A depth of "5551" is two bytes per value, while the other depths
                        // are all single byte per value.
                        case "5551": {               
                            convertedPixels = convertedPixels.reduce((arr, val)=>{
                                arr.push((val & 0xff), ((val >> 8) & 0xff));
                                return arr;
                            }, []);
                            // Fall through...
                        }
                        default: {
                            let base64 = "";
                            for (let i = 0; i < convertedPixels.length; i+=600) {
                                base64 += btoa(String.fromCharCode(...convertedPixels.slice(i, i+600)));
                            }
                            return base64;
                        }
                    }
                }
            }
        }
    },
};
