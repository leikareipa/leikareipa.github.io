/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

export const embeddedIframe = w95.widget(function embeddedIframe({
    x = 0,
    y = 0,
    width = 100,
    height = 22,
    isDisabled = false,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof isDisabled === "boolean");

    const iframeEl = w95.state(document.createElement("iframe"));

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Opened() {
            (iframeEl.now.src? 0 : iframeEl.now.src = "https://en.wikipedia.org/wiki/Windows_95");
        },
        Form() {
            return [
                w95.widget.domElement({
                    width,
                    height,
                    element: iframeEl.now,
                    isDisabled,
                }),
            ];
        },
    };
});
