/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

export const nameQuery = w95.widget(function({
    x = 0,
    y = 0,
    width = 100,
    height = 100,
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

    const name = w95.state("");
    const acceptedName = w95.state("");
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
        },
        Form() {
            return w95.widget.dialog({
                width,
                height,
                title: "Enter your name",
                move(deltaX, deltaY) {
                    x.set(deltaX + x.now);
                    y.set(deltaY + y.now);
                },
                children: [
                    w95.widget.label({
                        x: 11,
                        y: 16,
                        text: "Name:",
                    }),
                    w95.widget.lineEdit({
                        x: 49,
                        y: 12,
                        width: "pw - 60",
                        text: name.now,
                        autofocus: true,
                        newText(text) {
                            name.set(text);
                        },
                        onSubmit: accept,
                    }),
                    w95.widget.horizontalLayout({
                        y: 46,
                        width: "pw - 11",
                        styleHints:  [
                            w95.styleHint.alignHRight,
                        ],
                        children: [
                            w95.widget.button({
                                x: 0,
                                width: 71,
                                text: "OK",
                                isDisabled: (!name.now.length && !acceptedName.now.length),
                                onClick: accept,
                            }),
                            w95.widget.button({
                                x: 77,
                                width: 71,
                                text: "Cancel",
                                onClick: reject,
                            }),
                        ]
                    }),
                ],
                onClose() {
                    name.set(acceptedName.now);
                    onReject();
                },
            });
        },
    };

    function accept() {
        acceptedName.set(name.now);
        onAccept(acceptedName.now);
    }

    function reject() {
        name.set(acceptedName.now);
        onReject();
    }
});