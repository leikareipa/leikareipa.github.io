/*
 * 2023, 2026 Tarpeeksi Hyvae Soft
 *
 * Software: Serlain
 * 
 */

export default {
    Meta: {
        name: "Display Properties",
        version: "0.1",
        author: w95.registry["self"],
    },
    App() {
        const width = w95.state(208);
        const height = w95.state(145);
        const screenWidth = w95.state(w95.shell.display.width);
        const screenHeight = w95.state(w95.shell.display.height);

        const x = w95.state(
            ~~(0.5 * (w95.shell.display.width - width.now)),
            w95.reRenderOnly
        );
        const y = w95.state(
            ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
            w95.reRenderOnly
        );

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Message: {
                fitToDisplay() {
                    screenWidth.set(w95.shell.display.width);
                    screenHeight.set(w95.shell.display.height);
                },
            },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: "Display Properties",
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },
                    close() {
                        w95.windowManager.release_window(this)
                    },
                    children: [
                        w95.widget.groupBox({
                            x: 7,
                            y: 6,
                            width: (width.now - 22),
                            height: 52,
                            title: "Video signal",
                            children: [
                                w95.widget.dropdownBox({
                                    x: 9,
                                    y: 14,
                                    width: (width.now - 40),
                                    itemIndex: ((w95.registry["videoSignal"] == "Analog")? 0 : 1),
                                    items: {
                                        "Analog": {
                                            onSelect() {
                                                w95.shell.display.screenShader = analog_video_pixel_shader;
                                            }
                                        },
                                        "Digital": {
                                            onSelect() {
                                                w95.shell.display.screenShader = undefined;
                                            },
                                        },
                                    },
                                    newItemIndex(idx, item) {
                                        w95.registry["videoSignal"] = item.text;
                                    },
                                }),
                            ]
                        }),
                        w95.widget.groupBox({
                            x: 7,
                            y: 62,
                            width: (width.now - 22),
                            height: 49,
                            title: "Screen geometry",
                            children: [
                                w95.widget.label({
                                    x: 9,
                                    y: 11,
                                    width: (width.now - 40),
                                    height: 21,
                                    text: `${screenWidth.now} x ${screenHeight.now} pixels (upscale: ${w95.shell.display.scale}x)`,
                                    styleHints: [
                                        w95.styleHint.alignVCenter,
                                        w95.styleHint.alignHCenter,
                                    ],
                                }),
                            ]
                        }),
                    ],
                });
            },
        };
    },
};

const analogVideoScratch = new WeakMap();

export function analog_video_pixel_shader(renderContext)
{
    const { width, height, data: pixels } = renderContext.pixelBuffer;

    let source = analogVideoScratch.get(renderContext);
    if (!source || source.length !== pixels.length)
    {
        source = new Uint8ClampedArray(pixels.length);
        analogVideoScratch.set(renderContext, source);
    }

    // Flattened 4x4 matrix.
    const ditherMatrix = [
         1,  9,  3, 11,
        13,  5, 15,  7,
         4, 12,  2, 10,
        16,  8, 14,  6
    ];

    const redBlueDitherScale = 255 / (17 * 31);
    const greenDitherScale   = 255 / (17 * 63);

    // Pass 1: Dither directly into the source buffer.
    for (let y = 0; y < height; ++y)
    {
        let index = y * width * 4;
        const ditherRow = (y & 3) << 2;

        for (let x = 0; x < width; ++x, index += 4)
        {
            const dither = ditherMatrix[ditherRow | (x & 3)];

            source[index]     = pixels[index]     + dither * redBlueDitherScale;
            source[index + 1] = pixels[index + 1] + dither * greenDitherScale;
            source[index + 2] = pixels[index + 2] + dither * redBlueDitherScale;
        }
    }

    const currentBlurWeight  = 1 / 1.37;
    const previousBlurWeight = 1 / (2.7 * 1.37);

    // Pass 2: Channel skew + gain/black level + analog blur.
    for (let y = 0; y < height; ++y)
    {
        const rowStart = y * width * 4;

        for (let x = 0, index = rowStart;
             x < width;
             ++x, index += 4)
        {
            // R samples 0.15 pixels to the right.
            const red = x + 1 < width
                ? source[index] * 0.85 + source[index + 4] * 0.15
                : source[index];

            // G has no timing skew.
            const green = source[index + 1];

            // B samples 0.15 pixels to the left.
            const blue = x > 0
                ? source[index + 2] * 0.85 + source[index - 2] * 0.15
                : source[index + 2];

            // Gain and black-level mismatch.
            let outputRed   = red + 1.2;
            let outputGreen = green * 0.995 - 0.6;
            let outputBlue  = blue + 0.3;

            // Recursive horizontal blur. The first pixel remains unblurred.
            if (x > 0)
            {
                outputRed =
                    outputRed * currentBlurWeight +
                    pixels[index - 4] * previousBlurWeight;

                outputGreen =
                    outputGreen * currentBlurWeight +
                    pixels[index - 3] * previousBlurWeight;

                outputBlue =
                    outputBlue * currentBlurWeight +
                    pixels[index - 2] * previousBlurWeight;
            }

            pixels[index]     = outputRed;
            pixels[index + 1] = outputGreen;
            pixels[index + 2] = outputBlue;
        }
    }
}
