/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

export const contactInfo = w95.widget(function contactInfo({
    x = 0,
    y = 0,
    width = 100,
    height = 200,
    name = "",
    model = "",
    personality = "",
    isPeriodCorrect = true,
    isMessageDelay = true,
    onAccept = undefined,
    onReject = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof model === "string");
    w95.debug?.assert(typeof name === "string");
    w95.debug?.assert(typeof personality === "string");
    w95.debug?.assert(typeof isPeriodCorrect === "boolean");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof onAccept === "function");
    w95.debug?.assert(typeof onReject === "function");

    model = w95.state(model);
    name = w95.state(name);
    personality = w95.state(personality);
    isPeriodCorrect = w95.state(isPeriodCorrect);
    isMessageDelay = w95.state(isMessageDelay);

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
                title: "Contact information",
                move(deltaX, deltaY) {
                    x.set(deltaX + x.now);
                    y.set(deltaY + y.now);
                },
                children: [
                    w95.widget.verticalLayout({
                        x: 6,
                        y: 6,
                        width: "pw - 12",
                        children: [
                            w95.widget.horizontalLayout({
                                width: "pw",
                                styleHints: [
                                    w95.styleHint.alignVCenter,
                                ],
                                children: [
                                    w95.widget.label({
                                        width: "pw / 4",
                                        text: "Name:",
                                    }),
                                    w95.widget.lineEdit({
                                        width: "pw - (pw / 4) - 2",
                                        state: name,
                                        isEditable: false,
                                    }),
                                ],
                            }),
                            w95.widget.horizontalLayout({
                                width: "pw",
                                styleHints: [
                                    w95.styleHint.alignVCenter,
                                ],
                                children: [
                                    w95.widget.label({
                                        width: "pw / 4",
                                        text: "Model:",
                                    }),
                                    w95.widget.lineEdit({
                                        width: "pw - (pw / 4) - 2",
                                        state: model,
                                        isEditable: false,
                                    }),
                                ],
                            }),
                            w95.widget.horizontalLayout({
                                width: "pw",
                                styleHints: [
                                    w95.styleHint.alignTop,
                                ],
                                children: [
                                    w95.widget.label({
                                        width: "pw / 4",
                                        text: "Personality:",
                                    }),
                                    w95.widget.textEdit({
                                        width: "pw - (pw / 4) - 2",
                                        height: 70,
                                        state: personality,
                                        font: w95.font.sansSerif8,
                                        isEditable: false,
                                    }),
                                ],
                            }),
                            w95.widget.horizontalLayout({
                                width: "pw",
                                styleHints: [
                                    w95.styleHint.alignVCenter,
                                ],
                                children: [
                                    w95.widget.layoutSpacer({
                                        width: "pw / 4 + 3",
                                    }),
                                    w95.widget.checkbox({
                                        width: "pw - (pw / 4) - 2",
                                        state: isPeriodCorrect,
                                        label: "Nudge for period correctness",
                                        isEditable: false,
                                    }),
                                ],
                            }),
                            w95.widget.horizontalLayout({
                                width: "pw",
                                styleHints: [
                                    w95.styleHint.alignVCenter,
                                ],
                                children: [
                                    w95.widget.layoutSpacer({
                                        width: "pw / 4 + 3",
                                    }),
                                    w95.widget.checkbox({
                                        width: "pw - (pw / 4) - 2",
                                        state: isMessageDelay,
                                        label: "Delay messages",
                                        isEditable: false,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
                onClose() {
                    onReject();
                },
            });
        },
    };

    function accept() {
        onAccept();
    }

    function reject() {
        onReject();
    }
});
