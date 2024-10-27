/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

export const terminal = w95.widget(function terminal({
    x = 0,
    y = 0,
    width = 200,
    height = 100,
    state = w95.StateVariable,
    color = w95.palette.widget.foreground,
    backgroundColor = w95.palette.named.black,
    isEditable = true,
    isDisabled = false,
    showScroll = false,
    wordWrap = true,
    autofocus = false,
    styleHints = [],
    highlighter = undefined,
    onChange = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof isEditable === "boolean");
    w95.debug?.assert(typeof wordWrap === "boolean");
    w95.debug?.assert(typeof color === "object");
    w95.debug?.assert(typeof backgroundColor === "object");
    w95.debug?.assert(state instanceof w95.StateVariable);
    w95.debug?.assert(typeof state.now === "string");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "function"].includes(typeof highlighter));
    w95.debug?.assert(["undefined", "function"].includes(typeof onChange));

    const font = w95.font.vga9x16;

    const hasBorder = (
        styleHints.includes(w95.styleHint.noBorder)
            ? w95.frameShape.none
            : w95.frameShape.input
    );
    
    const fontVariant = (styleHints.includes(w95.styleHint.bold)? font.bold : font.regular);

    let text = state.now;

    const showCursor = w95.state(true);
    const hasFocus = w95.state(false);
    const cursorPosDelta = w95.state(0, w95.noEffect);
    const wordWrappedText = w95.state(text);
    const cursorPos2d = w95.state({}, w95.noEffect);
    const cursorPos = w95.state(undefined, ({widget})=>{
        showCursor.set(true);

        cursorPos2d.now.x = wordWrappedText.now.slice(0, cursorPos.now).split("\n").at(-1).length;
        cursorPos2d.now.y = (wordWrappedText.now.slice(0, cursorPos.now).split("\n").length - 1);
        cursorPos2d.now.globalX = (~~hasBorder + 2 + w95.font.stringWidth(wordWrappedText.now.split("\n")[cursorPos2d.now.y].slice(0, cursorPos2d.now.x), font));
        cursorPos2d.now.globalY = (~~hasBorder + (cursorPos2d.now.y * fontVariant.lineHeight));
    });
    
    const displayText = (highlighter?.(text) || text);

    let cursorBlinkTimeout;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get hasFocus() { return hasFocus.now },
        get autofocus() { return autofocus },
        get displayText() { return this.$("text-display").text; },
        Opened() {
            cursorPos.set(0);
        },
        Mounted() {
            hasFocus.set(true);

            cursorBlinkTimeout = setTimeout(()=>{
                if (hasFocus.now) {
                    showCursor.set(!showCursor.now)
                }
            }, 150);

            this.$("scroll-area").Message.scrollToBottom();

            wordWrappedText.set(wordWrap? this.displayText : text);
            if (cursorPosDelta.now) {
                cursorPos.set(cursorPos.now + cursorPosDelta.now);
                cursorPosDelta.set(0);
            }
        },
        BeforeUnmount() {
            clearTimeout(cursorBlinkTimeout);
        },
        Form() {
            return w95.widget.scrollArea({
                $name: "scroll-area",
                cursor: (
                    showScroll
                        ? w95.cursor.arrow
                        : w95.cursor.none
                ),
                width,
                height,
                frameShape: (
                    styleHints.includes(w95.styleHint.noBorder)
                    ? w95.frameShape.none
                    : w95.frameShape.input
                ),
                styleHints: [
                    (showScroll? w95.styleHint.showVerticalScrollBar : w95.styleHint.hideVerticalScrollBar),
                ],
                backgroundColor: (
                    isDisabled
                        ? w95.palette.window.background
                        : backgroundColor
                ),
                children: [
                    w95.widget.label({
                        $name: "text-display",
                        x: (hasBorder? 2 : 0),
                        text: (font.map_from_unicode?.(displayText) || displayText),
                        font,
                        width: (width - 24),
                        wordWrap,
                        allowFormatting: false,
                        color: (
                            isDisabled
                                ? w95.palette.widget.disabled1
                                : color
                        ),
                    }),

                    // Text cursor.
                    w95.widget.label({
                        x: cursorPos2d.now.globalX,
                        y: cursorPos2d.now.globalY-1,
                        text: "_",
                        font,
                        color: (
                            isDisabled
                                ? w95.palette.widget.disabled1
                                : color
                        ),
                    }, {hideIf: !(showCursor.now && hasFocus.now)}),

                    w95.widget.label({
                        x: cursorPos2d.now.globalX,
                        y: cursorPos2d.now.globalY-2,
                        text: "_",
                        font,
                        color: (
                            isDisabled
                                ? w95.palette.widget.disabled1
                                : color
                        ),
                    }, {hideIf: !(showCursor.now && hasFocus.now)}),
                ],
                onMouseDown: ()=>{
                    this.Message.focus();
                    return true;
                },
            });
        },
        Message: {
            blur() {
                hasFocus.set(false);
            },
            focus() {
                if (isDisabled) {
                    return;
                }

                showCursor.set(true);
                hasFocus.set(true);
            },
            moveCursorToEnd() {
                cursorPos.set(text.length);
            },
        },
        Event: {
            keypress(event) {
                w95.debug?.assert(event instanceof KeyboardEvent);
                w95.debug?.assert(typeof event.key === "string");

                let updatedText = text;

                if (
                    (event.key.length !== 1) ||
                    (event.key === ">")
                 ){
                    return;
                }

                // The w95 framework doesn't handle line wrapping well, so let's prevent it.
                if (cursorPos2d.now.x === 79) {
                    return;
                }

                updatedText = (updatedText.slice(0, cursorPos.now) + event.key + updatedText.slice(cursorPos.now));

                if (isEditable && (text !== updatedText)) {
                    cursorPosDelta.set(1);
                    state.set(updatedText);
                    onChange?.(state.now, this);
                }

                return;
            },
            keydown(event) {
                w95.debug?.assert(event instanceof KeyboardEvent);
                w95.debug?.assert(typeof event.key === "string");

                if (event.key.length === 1) {
                    return;
                }

                let updatedText = text;

                if (isEditable) {
                    if (event.key == "Backspace") {
                        if (
                            (cursorPos.now >= 1) &&
                            (updatedText.at(cursorPos.now - 1) !== ">")
                        ){
                            updatedText = (updatedText.slice(0, (cursorPos.now - 1)) + updatedText.slice(cursorPos.now));
                            cursorPosDelta.set(-1);
                        }
                    }
                    else if (["Enter", "Return"].includes(event.key)) {
                        updatedText = (updatedText.slice(0, cursorPos.now) + "\n" + updatedText.slice(cursorPos.now));
                        cursorPosDelta.set(1);
                    }

                    if ((text !== updatedText)) {
                        showCursor.set(true);
                        state.set(updatedText);
                        onChange?.(state.now, this);
                    }
                }

                return;
            }
        },
    };
});
