/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

export default w95.widget(function largeIcon({
    x = 0,
    y = 0,
    width = 70,
    height = 60,
    text = "Large icon",
    icon = w95.icon.applicationIcon32x32,
    styleHints = [],
    onActivate = undefined,
    isDisabled = false,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(typeof icon === "object");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "object"].includes(typeof icon));
    w95.debug?.assert(["undefined", "function"].includes(typeof onActivate));
    w95.debug?.assert((icon.width === 32) && (icon.height === 32));

    const hasFocus = w95.state(false);

    const labelWidth = Math.min(width, (w95.font.stringWidth(text) + 2));

    return {
        get x() { return x },
        get y() { return y },
        get width() { return this.$("layout").width },
        get height() { return this.$("layout").height },
        get isSelected() { return hasFocus.now },
        Mounted() {
            height = this.$childWidgets.reduce((sum, w)=>(sum + w.height), 0);
        },
        Form() {
            return w95.widget.verticalLayout({
                $name: "layout",
                width,
                height,
                padding: 4,
                styleHints:  [
                    w95.styleHint.alignHCenter,
                ],
                children: [
                    w95.widget.layoutSpacer({
                        width,
                    }),
                    w95.widget.bitmap({
                        image: icon,
                        color: (
                            hasFocus.now
                                ? Rngon.color(127, 127, 191)
                                : w95.palette.named.white
                        ),
                        styleHints: [
                            (hasFocus.now? w95.styleHint.focused : w95.styleHint.void),
                        ],
                        children: [
                            w95.widget.bitmap({
                                y: (icon.height - w95.icon.shortcutArrow.height),
                                image: w95.icon.shortcutArrow,
                            }, {hideIf: !styleHints.includes(w95.styleHint.shortcut)}),
                        ],
                    }),
    
                    w95.widget.label({
                        width: labelWidth,
                        text,
                        wordWrap: true,
                        horizontalPadding: 2,
                        verticalPadding: 1,
                        backgroundColor: (
                            hasFocus.now
                                ? w95.palette.named.navy
                                : w95.palette.widget.transparent
                        ),
                        color: (
                            hasFocus.now
                                ? w95.palette.named.white
                                : w95.palette.widget.foreground
                        ),
                        styleHints: [
                            w95.styleHint.alignHCenter,
                            w95.styleHint.action,
                            w95.styleHint.fitContentsHorizontal,
                        ],
                    }),
                ]
            });
        },
        Message: {
            blur() {
                hasFocus.set(false);
            },
            activate() {
                onActivate?.(this);
            },
        },
        Event: {
            mousedown() {
                w95.$recurseDescendantWidgets(w95.windowManager.root_widget(this), (widget)=>{widget.Message?.blur?.()});
                hasFocus.set(true);
                return true;
            },
            dblclick() {
                onActivate?.(this);
                return true;
            },
        },
    };
});
