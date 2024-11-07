/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

export const seedQuery = w95.widget(function seedQuery({
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    value = "",
    onAccept = undefined,
    onReject = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof onAccept === "function");
    w95.debug?.assert(typeof onReject === "function");

    const seed = w95.state("");
    const originalX = w95.state(x);
    const originalY = w95.state(y);
    x = w95.state(x);
    y = w95.state(y);

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width },
        get height() { return height },
        Closed() {
            x.set(originalX.now);
            y.set(originalY.now);
            seed.set("");
        },
        Opened() {
            seed.set(value);
        },
        Form() {
            return w95.widget.dialog({
                width,
                height,
                title: "Enter a new seed",
                move(deltaX, deltaY) {
                    x.set(deltaX + x.now);
                    y.set(deltaY + y.now);
                },
                children: [
                    w95.widget.label({
                        x: 11,
                        y: 16,
                        text: "Seed:",
                    }),
                    w95.widget.lineEdit({
                        x: 49,
                        y: 12,
                        width: "pw - 60",
                        autofocus: true,
                        state: seed,
                        validator: /[0-9]/,
                        onSubmit: accept,
                    }),
                    w95.widget.horizontalLayout({
                        y: 46,
                        width: "pw - 11",
                        padding: 6,
                        styleHints:  [
                            w95.styleHint.alignRight,
                        ],
                        children: [
                            w95.widget.label({
                                text: "Too long!",
                                height: 21,
                                styleHints: [
                                    w95.styleHint.alignVCenter,
                                ],
                            }, {hideIf: (seed.now.length < 8)}),
                            w95.widget.button({
                                width: 71,
                                text: "OK",
                                isDisabled: (
                                    !seed.now.length ||
                                    (seed.now.length > 7)
                                ),
                                onClick: accept,
                            }),
                            w95.widget.button({
                                width: 71,
                                text: "Cancel",
                                onClick: reject,
                            }),
                        ]
                    }),
                ],
                onClose() {
                    onReject();
                },
            });
        },
    };

    function accept() {
        onAccept(seed.now);
    }

    function reject() {
        onReject();
    }
});
