/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

export const contactCreator = w95.widget(function contactCreator({
    x = 0,
    y = 0,
    width = 100,
    height = 200,
    models = [],
    onAccept = undefined,
    onReject = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(Array.isArray(models));
    w95.debug?.assert(typeof onAccept === "function");
    w95.debug?.assert(typeof onReject === "function");

    const name = w95.state("");
    const acceptedName = w95.state("");
    const originalX = w95.state(x);
    const originalY = w95.state(y);
    x = w95.state(x);
    y = w95.state(y);

    const modelName = w95.state("yi:1.5-9B-chat");
    const nickName = w95.state("Mike");
    const personality = w95.state("");
    const isPeriodCorrect = w95.state(true);
    const isMessageDelay = w95.state(true);

    const dropdownIndex = w95.state(0);

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
                title: "Add a contact",
                move(deltaX, deltaY) {
                    x.set(deltaX + x.now);
                    y.set(deltaY + y.now);
                },
                children: [
                    w95.widget.verticalLayout({
                        x: 10,
                        y: 10,
                        width: "pw - 20",
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
                                        state: nickName,
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
                                        state: modelName,
                                    }, {hideIf: models.length}),
                                    w95.widget.dropdownBox({
                                        width: "pw - (pw / 4) - 2",
                                        itemIndex: dropdownIndex.now,
                                        items: (models.length? models.reduce((o, i)=>({...o, [i]: {}}), {}) : {"0": {}}),
                                        newItemIndex: dropdownIndex.set,
                                    }, {hideIf: !models.length}),
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
                                        text: "Personality:",
                                    }),
                                    w95.widget.textEdit({
                                        width: "pw - (pw / 4) - 2",
                                        height: 70,
                                        state: personality,
                                        font: w95.font.sansSerif8,
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
                                    }),
                                ],
                            }),
                            w95.widget.layoutSpacer({
                                height: 10,
                            }),
                            w95.widget.horizontalRule({
                                width: "pw",
                            }),
                            w95.widget.layoutSpacer({
                                height: 2,
                            }),
                            w95.widget.horizontalLayout({
                                width: "pw",
                                padding: 6,
                                styleHints: [
                                    w95.styleHint.alignRight,
                                ],
                                children: [
                                    w95.widget.button({
                                        width: 60,
                                        text: "OK",
                                        onClick: accept,
                                    }),
                                    w95.widget.button({
                                        width: 60,
                                        text: "Cancel",
                                        onClick: reject,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
                onClose() {
                    name.set(acceptedName.now);
                    onReject();
                },
            });
        },
    };

    function reset_params() {
        modelName.set("yi:1.5-9B-chat");
        nickName.set("Mike");
        personality.set("");
        isPeriodCorrect.set(true);
        isMessageDelay.set(true);
    }

    function accept() {
        onAccept({
            model: (
                models.length
                    ? models[dropdownIndex.now]
                    : modelName.now
            ),
            name: nickName.now,
            personality: personality.now,
            isPeriodCorrect: isPeriodCorrect.now,
            isMessageDelay: isMessageDelay.now,
        });
        reset_params();
    }

    function reject() {
        reset_params();
        onReject();
    }
});
