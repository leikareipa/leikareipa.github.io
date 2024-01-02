/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */


w95.widget("twoStateButton", function({
    x = 0,
    y = 0,
    width = 100,
    height = 22,
    isPressed = false,
    isDisabled = false,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof isPressed === "boolean");

    isPressed = w95.state(isPressed);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Form() {
            return [
                w95.widget.button({
                    width,
                    height,
                    text: "Compositing",
                    isDisabled,
                    styleHints: [
                        (isPressed.now? w95.styleHint.lowered : w95.styleHint.raised),
                    ],
                    onMouseDown({widget}) {
                        const app = w95.windowManager.get_parent_app(widget);
                        w95.debug?.assert(app?._type === "app");
                        
                        const canvasEl = document.body.querySelector(`canvas[data-w95-app-id='${app?.uuid}']`);
                        canvasEl?.classList.toggle("composite");

                        isPressed.set(!isPressed.now);
                    },
                }),
            ];
        },
    };
});
