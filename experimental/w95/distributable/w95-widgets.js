/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/widgets/bitmap.js":
/*!*******************************!*\
  !*** ./src/widgets/bitmap.js ***!
  \*******************************/
/***/ (() => {

/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("bitmap", function({
    x = 0,
    y = 0,
    image = w95.icon.applicationIcon32x32,
    width = (image?.width || 0),
    height = (image?.height || 0),
    color = w95.palette.named.white,
    children = [],
    isDisabled = false,
    styleHints = [],
    cursor = undefined,
    onMouseDown = undefined,
    onMouseUp = undefined,
    onMouseMove = undefined,
    onMouseLeave = undefined,
    onMouseEnter = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof color === "object");
    w95.debug?.assert(Array.isArray(children));
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "object"].includes(typeof cursor));
    w95.debug?.assert(["undefined", "object"].includes(typeof image));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseMove));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));
    
    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get cursor() { return cursor },
        Form() {
            if (!image) {
                return [];
            }
            return [
                ...children,
                Rngon.ngon([
                    Rngon.vertex(0, 0),
                    Rngon.vertex(width, 0),
                    Rngon.vertex(width, height),
                    Rngon.vertex(0, height),
                ], {
                    texture: image,
                    color,
                    allowAlphaReject: true,
                    isColorInverted: styleHints.includes(w95.styleHint.inverted),
                    isDisabled,
                }),
            ];
        },
        Event: {
            mouseleave({at}) {
                return onMouseLeave?.({at, widget:this});
            },
            mouseenter({at}) {
                return onMouseEnter?.({at, widget:this});
            },
            mousedown({at}) {
                return onMouseDown?.({at, widget:this});
            },
            mouseup({at}) {
                return onMouseUp?.({at, widget:this});
            },
            mousemove({at}) {
                return onMouseMove?.({at, widget:this});
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/button.js":
/*!*******************************!*\
  !*** ./src/widgets/button.js ***!
  \*******************************/
/***/ (() => {

/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("button", function({
    x = 0,
    y = 0,
    width = 200,
    height = 22,
    icon = undefined,
    text = (icon? "" : "Button"),
    color = w95.palette.widget.foreground,
    backgroundColor = w95.palette.widget.background,
    isDisabled = false,
    elide = false,
    shape = w95.buttonShape.regular,
    styleHints = [],
    onClick = undefined,
    onMouseEnter = undefined,
    onMouseLeave = undefined,
    onMouseUp = undefined,
    onMouseDown = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(typeof shape === "string");
    w95.debug?.assert(typeof color === "object");
    w95.debug?.assert(typeof isDisabled === "boolean");
    w95.debug?.assert(typeof elide === "boolean");
    w95.debug?.assert(typeof backgroundColor === "object");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "object"].includes(typeof icon));
    w95.debug?.assert(["undefined", "function"].includes(typeof onClick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    
    const isPressed = w95.state(false);
    const isHovered = w95.state(false);

    const iconSpacing = 4;
    const isLeftAligned = styleHints.includes(w95.styleHint.alignLeft);
    const isTabButton = (shape === w95.buttonShape.tabControl);
    const isVisuallyPressed = (
        styleHints.includes(w95.styleHint.lowered) ||
        (
            isPressed.now &&
            isHovered.now &&
            !isDisabled &&
            !isTabButton &&
            !styleHints.includes(w95.styleHint.raised)
        )
    );

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get isGrabbed() { return isPressed.now },
        get isHovered() { return isHovered.now },
        get text() { return text },
        Form() {
            return [
                w95.widget.frame({
                    width,
                    height,
                    shape: (
                        (shape === w95.buttonShape.regular)
                            ? w95.frameShape.widget
                            : (shape === w95.buttonShape.dropdown)
                                ? w95.frameShape.dropdownButton
                                : ((shape === w95.buttonShape.flat) && styleHints.includes(w95.styleHint.raised))
                                    ? w95.frameShape.box
                                    : (shape === w95.buttonShape.tabControl)
                                        ? w95.frameShape.tabControlButton
                                        : w95.frameShape.none
                    ),
                    styleHints: [
                        ...styleHints,
                        (isVisuallyPressed? w95.styleHint.inverted : 0),
                    ],
                    backgroundColor,
                    children: [
                        w95.widget.label({
                            x: ~~((icon? (icon.width + (iconSpacing * (isLeftAligned + 1))) : 0) + ~~(isVisuallyPressed || styleHints.includes(w95.styleHint.lowered))),
                            y: ~~(isVisuallyPressed || styleHints.includes(w95.styleHint.lowered)),
                            width: ((width - (icon? (icon.width + iconSpacing) : 0)) - (isLeftAligned * (iconSpacing * 2))),
                            height: height,
                            text,
                            color,
                            elide,
                            isDisabled,
                            styleHints: [
                                w95.styleHint.action,
                                w95.styleHint.alignVCenter,
                                isLeftAligned? 0 : w95.styleHint.alignHCenter,
                                styleHints.includes(w95.styleHint.bold)? w95.styleHint.bold : 0,
                            ],
                        }, {
                            hideIf: !text.length,
                        }),

                        w95.widget.bitmap({
                            x: 1+~~((text? iconSpacing : icon? ((width / 2) - (icon.width / 2)) : 0) + ~~isVisuallyPressed),
                            y: 1+~~((icon? ((height / 2) - (icon.height / 2)) : 0) + ~~isVisuallyPressed),
                            image: icon,
                            color: w95.palette.widget.disabled2,
                        }, {
                            hideIf: ((!icon || !icon.boolean) || !isDisabled),
                        }),

                        w95.widget.bitmap({
                            x: ~~((text? iconSpacing : icon? ((width / 2) - (icon.width / 2)) : 0) + ~~isVisuallyPressed),
                            y: ~~((icon? ((height / 2) - (icon.height / 2)) : 0) + ~~isVisuallyPressed),
                            image: icon,
                            isDisabled,
                            color: (
                                !icon?.boolean
                                    ? w95.palette.named.white
                                    : isDisabled
                                        ? w95.palette.widget.disabled1
                                        : w95.palette.widget.foreground
                            ),
                        }, {
                            hideIf: !icon,
                        }),
                    ],
                }),
            ];
        },
        Event: {
            mouseleave({at}) {
                isHovered.set(false);
                return (onMouseLeave?.({at, widget:this}) ?? true);
            },
            mouseenter({at}) {
                isHovered.set(true);
                return (onMouseEnter?.({at, widget:this}) ?? true);
            },
            mousedown({at}) {
                if (isDisabled) {
                    return;
                }

                isPressed.set(true);
                return (onMouseDown?.({at, widget:this}) ?? true);
            },
            mouseup({at}) {
                if (isDisabled) {
                    isPressed.set(false);
                    return;
                }

                if (isHovered.now && isPressed.now) {
                    onClick?.({at, widget:this});
                }
                
                isPressed.set(false);

                return (onMouseUp?.({at, widget:this}) ?? true);
            }
        },
    };
});


/***/ }),

/***/ "./src/widgets/checkbox.js":
/*!*********************************!*\
  !*** ./src/widgets/checkbox.js ***!
  \*********************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("checkbox", function({
    x = 0,
    y = 0,
    label = "Checkbox",
    isChecked = false,
    isDisabled = false,
    color = w95.palette.widget.foreground,
    newCheckState = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof label === "string");
    w95.debug?.assert(typeof isChecked === "boolean");
    w95.debug?.assert(typeof color === "object");
    w95.debug?.assert(["undefined", "function"].includes(typeof newCheckState));

    const isPressed = w95.state(false);
    const isHovered = w95.state(false);
    const width = w95.state(1);

    const height = (w95.font.regular.lineHeight + isDisabled);
    const labelSpacing = 6;
    const checkBoxSideLen = 13;
    
    return {
        get x() { return x },
        get y() { return y },
        get width() { return width.now },
        get height() { return height },
        get isGrabbed() { return isPressed.now },
        get isChecked() { return isChecked },
        get isHovered() { return isHovered.now },
        Mounted() {
             width.set(Math.max(...this.$descendants.map(d=>(d.at.x + d.widget.width))));
        },
        Form() {
            return [
                w95.widget.frame({
                    width: checkBoxSideLen,
                    height: checkBoxSideLen,
                    shape: w95.frameShape.input,
                    backgroundColor: (
                        (isDisabled || (isPressed.now && isHovered.now))
                            ? w95.palette.window.background
                            : w95.palette.named.white
                    ),
                    children: [
                        w95.widget.bitmap({
                            x: 3,
                            y: 3,
                            image: w95.icon.checkmark,
                            color: (
                                isDisabled
                                    ? w95.palette.widget.disabled1
                                    : w95.palette.widget.foreground
                            ),
                        }, {
                            hideIf: !isChecked
                        }),
                    ],
                }),
                w95.widget.label({
                    x: (checkBoxSideLen + labelSpacing),
                    y: 0,
                    width: (label.length? w95.font.stringWidth(label) : 0),
                    height,
                    text: label,
                    color,
                    isDisabled,
                    styleHints: [
                        w95.styleHint.alignVCenter,
                        w95.styleHint.action,
                    ],
                }, {
                    hideIf: !label.length,
                }),
            ];
        },
        Event: {
            mouseleave() {
                isHovered.set(false);
            },
            mouseenter() {
                isHovered.set(true);
            },
            mousedown() {
                if (isDisabled) {
                    return;
                }

                isPressed.set(true);
                return true;
            },
            mouseup() {
                if (isDisabled) {
                    return;
                }

                let retval = true;

                if (isPressed.now && isHovered.now) {
                    retval = (newCheckState?.(!isChecked, this) ?? true);
                }
                
                isPressed.set(false);
                return retval;
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/desktopIcon.js":
/*!************************************!*\
  !*** ./src/widgets/desktopIcon.js ***!
  \************************************/
/***/ (() => {

/*
 * 2023-2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("desktopIcon", function({
    x = 0,
    y = 0,
    width = 74,
    height = 60,
    text = "Desktop icon",
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
        get width() { return this.$form.layout.width },
        get height() { return this.$form.layout.height },
        Mounted() {
            height = this.$childWidgets.reduce((sum, w)=>(sum + w.height), 0);
        },
        Form() {
            return w95.widget.verticalLayout({
                $name: "layout",
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
                                ? Rngon.color(128, 128, 255)
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
                        color: w95.palette.named.white,
                        backgroundColor: (
                            isDisabled
                                ? w95.palette.widget.background
                                : hasFocus.now
                                    ? w95.palette.named.navy
                                    : w95.palette.named.teal
                        ),
                        styleHints: [
                            w95.styleHint.alignHCenter,
                            w95.styleHint.action,
                        ],
                    }),
                ]
            });
        },
        Message: {
            blur() {
                hasFocus.set(false);
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


/***/ }),

/***/ "./src/widgets/dialog.js":
/*!*******************************!*\
  !*** ./src/widgets/dialog.js ***!
  \*******************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("dialog", function({
    x = 0,
    y = 0,
    width = 200,
    height = 100,
    title = "Dialog",
    isBlurred = false,
    backgroundColor = w95.palette.window.background,
    children = [],
    move = undefined,
    onClose = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof title === "string");
    w95.debug?.assert(typeof backgroundColor === "object");
    w95.debug?.assert(Array.isArray(children));
    w95.debug?.assert(["undefined", "function"].includes(typeof move));
    w95.debug?.assert(["undefined", "function"].includes(typeof onClose));

    isBlurred = w95.state(isBlurred);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get isBlurred() { return isBlurred.now },
        get isActiveDialog() { return !this._hideMesh },
        Mounted() {
            this.$form["_titleBar"]?.Message.setParent(this);
        },
        Form() {
            return [
                // Background.
                w95.widget.panel({
                    width: width,
                    height: height,
                    color: backgroundColor,
                }, {hideIf: backgroundColor === w95.palette.named.transparent}),
    
                // Container for the dialog's custom contents.
                w95.widget.frame({
                    $name: "_contents",
                    x: 3, // Width of the window border.
                    y: 22, // Height of the window decorations.
                    width: (width - 6),
                    height: (height - 25),
                    styleHints: [
                        w95.styleHint.noBorder,
                    ],
                    children,
                }),
    
                w95.widget.titleBar({
                    $name: "_titleBar",
                    x: 3,
                    y: 3,
                    width: (width - 6),
                    height: 18,
                    isBlurred: isBlurred.now,
                    title: title,
                    styleHints: [
                        w95.styleHint.dialog,
                    ],
                    onClose,
                }),
    
                w95.widget.frame({
                    $name: "_border",
                    width,
                    height,
                    shape: w95.frameShape.dialog,
                }),
            ];
        },
        Message: {
            move(deltaX = 0, deltaY = 0) {
                w95.debug?.assert(typeof deltaX === "number");
                w95.debug?.assert(typeof deltaY === "number");
                move?.(deltaX, deltaY, {isRelative: true});
            },
            blur() {
                isBlurred.set(true);
            },
            focus() {
                isBlurred.set(false);
            }
        },
    };
});


/***/ }),

/***/ "./src/widgets/domElement.js":
/*!***********************************!*\
  !*** ./src/widgets/domElement.js ***!
  \***********************************/
/***/ (() => {

/*
 * 2023-2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("domElement", function({
    x = 0,
    y = 0,
    width = undefined,
    height = undefined,
    element = undefined,
    className = undefined,
    isDisabled = false,
    addToDom = true,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof isDisabled === "boolean");
    w95.debug?.assert(typeof addToDom === "boolean");
    w95.debug?.assert(element instanceof HTMLElement);
    w95.debug?.assert(["undefined", "string"].includes(typeof className));
    w95.debug?.assert(["undefined", "number"].includes(typeof width));
    w95.debug?.assert(["undefined", "number"].includes(typeof height));

    if (addToDom && !document.body.contains(element)) {
        document.body.prepend(element);
    }

    element.classList.add(...[
        "w95-dom-element",
        className
    ].filter(n=>(typeof n !== "undefined")));

    element.classList[isDisabled? "add" : "remove"]("disabled");

    if (!width || !height) {
        const elRect = element.getBoundingClientRect();
        width = (width || (elRect.width / w95.shell.display.scale));
        height = (height || (elRect.height / w95.shell.display.scale));

        w95.debug?.assert(typeof width === "number");
        w95.debug?.assert(typeof height === "number");
        w95.debug?.assert(width > 0);
        w95.debug?.assert(height > 0);
    }

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get dom() { return element },
        Opened() {
            element.classList.remove("hidden");
        },
        Closed() {
            element.classList.add("hidden");
        },
        Form() {
            return Rngon.ngon([
                Rngon.vertex(0, 0),
                Rngon.vertex(width, 0),
                Rngon.vertex(width, height),
                Rngon.vertex(0, height)], {
                    color: Rngon.color(0, 0, 0, 0),
            });
        },
        Message: {
            setIsSuppressed(isSuppressed) {
                element.style.zIndex = (this.$app._canvas.style.zIndex - (isSuppressed? 1 : -1));
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/dropdownBox.js":
/*!************************************!*\
  !*** ./src/widgets/dropdownBox.js ***!
  \************************************/
/***/ (() => {

/*
 * 2022-2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("dropdownBox", function({
    x = 0,
    y = 0,
    width = 200,
    height = 21,
    isDisabled = false,
    items = {},
    itemIndex = 0,
    newItemIndex = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert((typeof items === "object") || Array.isArray(items));
    w95.debug?.assert(["number", "string"].includes(typeof itemIndex));
    w95.debug?.assert(["undefined", "function"].includes(typeof newItemIndex));

    // The 'items' object can be passed in either as an array or as a set of key-value
    // pairs. For simplicity, we'll process it internally as an array, so convert as
    // needed.
    if (!Array.isArray(items)) {
        items = Object.entries(items).map(e=>({label: e[0], options: e[1]}));
    }

    if (typeof itemIndex === "string") {
        itemIndex = items.findIndex(item=>(item.label === itemIndex));
        w95.debug?.assert(itemIndex >= 0);
    }

    const isOpen = w95.state(false);
    
    const dropdownButtonSize = 16;
    const text = items[itemIndex].label;
    const toggleOpen = (
        isOpen.now
            ? ()=>isOpen.set(false)
            : ()=>isOpen.set(true)
    );

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get text() { return text },
        Form() {
            return [
                // The currently-selected item.
                w95.widget.frame({
                    width,
                    height,
                    shape: w95.frameShape.input,
                    backgroundColor: (
                        isDisabled
                            ? w95.palette.window.background
                            : w95.palette.named.white
                    ),
                    children: [
                        w95.widget.label({
                            x: 5,
                            y: 2,
                            width: (width - dropdownButtonSize - 7),
                            height: (height - 4),
                            text,
                            color: (
                                isDisabled
                                    ? w95.palette.widget.disabled1
                                    : w95.palette.widget.foreground
                            ),
                            styleHints: [
                                w95.styleHint.alignVCenter,
                            ],
                        }),
                    ],
                    onMouseDown: (isDisabled? undefined : toggleOpen),
                }),

                w95.widget.button({
                    x: (width - dropdownButtonSize - 2),
                    y: 2,
                    width: dropdownButtonSize,
                    height: (height - 4),
                    icon: w95.icon.arrowDown,
                    isDisabled,
                    shape: w95.buttonShape.dropdown,
                    onMouseDown: toggleOpen,
                }),
    
                w95.widget.dropdownBoxList({
                    y: height,
                    width,
                    items,
                    itemIndex,
                    isOpen: isOpen.now,
                    newItemIndex(item, idx) {
                        w95.debug?.assert(item._type === "dropdownBoxItem");
                        isOpen.set(false);
                        if (itemIndex !== idx) {
                            newItemIndex?.(idx, item);
                        }
                    },
                    onCloseRequested() {
                        isOpen.set(false);
                    },
                }, {
                    hideIf: !isOpen.now,
                }),
            ];
        },
        Message: {
            open() {
                isOpen.set(true);
            },
            close() {
                isOpen.set(false);
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/dropdownBoxItem.js":
/*!****************************************!*\
  !*** ./src/widgets/dropdownBoxItem.js ***!
  \****************************************/
/***/ (() => {

/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("dropdownBoxItem", function({
    text = "",
    onSelect = undefined,
    onMouseEnter = undefined,
    onMouseLeave = undefined,
} = {})
{
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(["undefined", "function"].includes(typeof onSelect));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));

    const parent = w95.state(undefined);
    const isHighlighted = w95.state(false);
    const isHovered = w95.state(false);
    const x = w95.state(0);
    const y = w95.state(0);
    const leftPadding = 4;
    const width = w95.state(leftPadding + w95.font.stringWidth(text));
    const height = 15;

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width.now },
        get height() { return height },
        get text() { return text },
        get isHighlighted() { return isHighlighted.now },
        get isHovered() { return isHovered.now },
        Form() {
            return [
                ...background_mesh(),
                w95.widget.label({
                    x: leftPadding,
                    width: (width.now - leftPadding),
                    height,
                    text,
                    styleHints: [
                        w95.styleHint.alignVCenter,
                    ],
                    color: (
                        isHighlighted.now
                            ? w95.palette.named.white
                            : w95.palette.named.black
                    ),
                }),
            ];
        },
        Event: {
            mousedown() {
                isHighlighted.set(true);
                return true;
            },
            mouseup() {
                w95.debug?.assert(parent.now._type === "dropdownBoxList");
                onSelect?.(this);
                parent.now.Message.select(this);
                return true;
            },
            mouseenter() {
                isHovered.set(true);
                return onMouseEnter?.(this);
            },
            mouseleave() {
                isHovered.set(false);
                return onMouseLeave?.(this);
            },
        },
        Message: {
            resize(newWidth = 0) {
                w95.debug?.assert(typeof newWidth === "number");
                width.set(newWidth);
            },
            moveTo(newX = 0, newY = 0) {
                w95.debug?.assert(typeof newX === "number");
                w95.debug?.assert(typeof newY === "number");
                x.set(newX);
                y.set(newY);
            },
            setParent(newParent) {
                w95.debug?.assert(typeof newParent === "object");
                w95.debug?.assert(newParent._what === "w95-widget");
                parent.set(newParent);
            },
            highlight(is = false) {
                w95.debug?.assert(typeof is === "boolean");
                isHighlighted.set(is);
            },
        },
    };

    function background_mesh() {
        if (isHighlighted.now) {
            return [
                Rngon.ngon([
                    Rngon.vertex(0, 0),
                    Rngon.vertex(width.now, 0),
                    Rngon.vertex(width.now, height),
                    Rngon.vertex(0, height),
                ], {
                    color: w95.palette.named.navy,
                }),
            ];
        }

        return [];
    }
});


/***/ }),

/***/ "./src/widgets/dropdownBoxList.js":
/*!****************************************!*\
  !*** ./src/widgets/dropdownBoxList.js ***!
  \****************************************/
/***/ (() => {

/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("dropdownBoxList", function({
    x = 0,
    y = 0,
    width = 100,
    isOpen = false,
    items = [],
    itemIndex = 0,
    newItemIndex = undefined,
    onCloseRequested = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof isOpen === "boolean");
    w95.debug?.assert(typeof itemIndex === "number");
    w95.debug?.assert(Array.isArray(items));
    w95.debug?.assert(["undefined", "function"].includes(typeof onCloseRequested));
    w95.debug?.assert(["undefined", "function"].includes(typeof newItemIndex));

    const height = w95.state(100);
    const highlightedIdx = w95.state(undefined, ({widget})=>widget.listItems.forEach((w, idx)=>w.Message.highlight(idx === highlightedIdx.now)));

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height.now },
        get listItems() { return this.$form["_listItemsContainer"].$childWidgets },
        get isActivePopupMenu() { return isOpen },
        Form() {
            const itemWidgets = items.map((item, idx)=>w95.widget.dropdownBoxItem({
                ...item.options,
                text: item.label,
                onMouseEnter: ()=>{
                    highlightedIdx.set(idx);
                },
            }));

            return w95.widget.frame({
                $name: "_listItemsContainer",
                width,
                height: height.now,
                shape: w95.frameShape.dropdownList,
                backgroundColor: w95.palette.named.white,
                children: itemWidgets,
            }, {
                hideIf: !itemWidgets.length,
            });
        },
        Mounted() {
            w95.debug?.assert(this.listItems.every(item=>item._type === "dropdownBoxItem"));

            const borderWidth = 1;
    
            // Size the menu to its contents.
            const totalChildHeight = this.listItems.reduce((sum, c)=>(sum + c.height), 0);
            this.listItems.forEach(child=>child.Message.resize((width - (borderWidth * 2))));
            height.set(totalChildHeight + (borderWidth * 2));
    
            // Arrange the menu contents vertically.
            let yOffs = borderWidth;
            for (const listItem of this.listItems) {
                listItem.Message.moveTo(borderWidth, yOffs);
                yOffs += listItem.height;
            }

            if (highlightedIdx.now === undefined) {
                this.Message.select(this.listItems[itemIndex]);
            }

            this.listItems.forEach(child=>child.Message.setParent(this));
        },
        Closed() {
            highlightedIdx.set(itemIndex);
        },
        Message: {
            select(dropdownItemWidget) {
                w95.debug?.assert(typeof dropdownItemWidget === "object");
                w95.debug?.assert(dropdownItemWidget._type === "dropdownBoxItem");
                const idx = this.listItems.findIndex(item=>item.text === dropdownItemWidget.text);
                highlightedIdx.set(idx);
                newItemIndex?.(dropdownItemWidget, idx);
                this.Message.close();
            },
            close() {
                onCloseRequested?.();
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/dynamicWrapper.js":
/*!***************************************!*\
  !*** ./src/widgets/dynamicWrapper.js ***!
  \***************************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("dynamicWrapper", function({
    widget = undefined,
} = {})
{
    const x = w95.state(0);
    const y = w95.state(0);
    const width = w95.state(0);
    const height = w95.state(0);

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width.now },
        get height() { return height.now },
        Mounted() {
            this.Message.resize(this.$childWidgets[0].width, this.$childWidgets[0].height);
        },
        Form() {
            return [widget];
        },
        Message: {
            move(newX, newY) {
                w95.debug?.assert(Number.isInteger(newX));
                w95.debug?.assert(Number.isInteger(newY));
                x.set(newX);
                y.set(newY);
            },
            resize(newWidth, newHeight) {
                w95.debug?.assert(Number.isInteger(newWidth));
                w95.debug?.assert(Number.isInteger(newHeight));
                width.set(newWidth);
                height.set(newHeight);
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/frame.js":
/*!******************************!*\
  !*** ./src/widgets/frame.js ***!
  \******************************/
/***/ (() => {

/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("frame", function({
    x = 0,
    y = 0,
    width = 200,
    height = 100,
    shape = w95.frameShape.box,
    isResizable = false,
    isGrabbable = false,
    styleHints = [],
    children = [],
    backgroundColor = undefined,
    cursor = undefined,
    onMouseDown = undefined,
    onMouseUp = undefined,
    onClick = undefined,
    onDoubleClick = undefined,
    onMouseMove = undefined,
    onMouseLeave = undefined,
    onMouseEnter = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof shape === "string");
    w95.debug?.assert(typeof isResizable === "boolean");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(Array.isArray(children));
    w95.debug?.assert(["undefined", "object"].includes(typeof backgroundColor));
    w95.debug?.assert(["undefined", "object"].includes(typeof cursor));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onClick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onDoubleClick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseMove));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));
    
    const isPressed = w95.state(false, w95.noEffect);
    const isHovered = w95.state(false, w95.noEffect);
    const borderHover = w95.state({}, w95.noEffect);
    const parentWidget = w95.state(undefined, w95.noEffect);
    const isBorderGrabbed = w95.state(false);

    const borderWidth = 4;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get isHovered() { return isHovered.now },
        get isGrabbed() { return (isGrabbable && isPressed.now) },
        get isBorderGrabbed() { return (isResizable && isBorderGrabbed.now) },
        get cursor() {
            if (isResizable) {
                if (borderHover.now.leftTop) return w95.cursor.hvResizeOut;
                if (borderHover.now.rightTop) return w95.cursor.hvResizeIn;
                if (borderHover.now.leftBottom) return w95.cursor.hvResizeIn;
                if (borderHover.now.rightBottom) return w95.cursor.hvResizeOut;
                if (borderHover.now.left || borderHover.now.right) return w95.cursor.hResize;
                if (borderHover.now.top || borderHover.now.bottom) return w95.cursor.vResize;
            }

            if (cursor) {
                return cursor;
            }
        },
        Form() {
            return [
                ...children,
                ...frame_mesh(),
            ];
        },
        Message: {
            setParent(widget) {
                w95.debug?.assert(widget?._what === "w95-widget");
                w95.debug?.assert(widget?._type === "window");
                parentWidget.set(widget);
            },
        },
        Event: {
            mouseleave({at}) {
                isHovered.set(false);
                if (!isBorderGrabbed.now) {
                    borderHover.set({});
                }
                return onMouseLeave?.({at, widget:this});
            },
            mouseenter({at}) {
                isHovered.set(true);
                return onMouseEnter?.({at, widget:this});
            },
            mousedown({at}) {
                isPressed.set(true);

                isBorderGrabbed.set(isResizable && Object.values(borderHover.now).some(v=>v));
                if (isBorderGrabbed.now) {
                    return true;
                }

                return onMouseDown?.({at, widget:this});
            },
            dblclick({at}) {
                return onDoubleClick?.({at, widget: this});
            },
            mouseup({at}) {
                isPressed.set(false);
                borderHover.set({});
                isBorderGrabbed.set(false);
                const retval = onMouseUp?.({at, widget:this});
                (!isHovered.now || onClick?.({at, widget:this}));
                return retval;
            },
            mousemove({event, at}) {
                update_border_hover(at);

                if (isBorderGrabbed.now) {
                    w95.debug?.assert(["window", "dialog"].includes(parentWidget.now._type));
                    w95.debug?.assert(typeof event?.movementX === "number");
                    w95.debug?.assert(typeof event?.movementY === "number");

                    if (borderHover.now.rightBottom) {
                        parentWidget.now.Message.resize(
                            (event.movementX / w95.shell.display.scale),
                            (event.movementY / w95.shell.display.scale),
                        );
                    }
                    else if (borderHover.now.rightTop) {
                        parentWidget.now.Message.resize(
                            (event.movementX / w95.shell.display.scale),
                            -(event.movementY / w95.shell.display.scale),
                        );
                        parentWidget.now.Message.move(
                            0,
                            (event.movementY / w95.shell.display.scale),
                        );
                    }
                    else if (borderHover.now.leftBottom) {
                        parentWidget.now.Message.resize(
                            -(event.movementX / w95.shell.display.scale),
                            (event.movementY / w95.shell.display.scale),
                        );
                        parentWidget.now.Message.move(
                            (event.movementX / w95.shell.display.scale),
                            0,
                        );
                    }
                    else if (borderHover.now.leftTop) {
                        parentWidget.now.Message.resize(
                            -(event.movementX / w95.shell.display.scale),
                            -(event.movementY / w95.shell.display.scale),
                        );
                        parentWidget.now.Message.move(
                            (event.movementX / w95.shell.display.scale),
                            (event.movementY / w95.shell.display.scale),
                        );
                    }
                    else if (
                        borderHover.now.right ||
                        borderHover.now.bottom
                    ){
                        parentWidget.now.Message.resize(
                            borderHover.now.right? (event.movementX / w95.shell.display.scale) : 0,
                            borderHover.now.bottom? (event.movementY / w95.shell.display.scale) : 0,
                        );
                    }
                    else if (
                        borderHover.now.left ||
                        borderHover.now.top
                    ){
                        parentWidget.now.Message.resize(
                            borderHover.now.left? (-event.movementX / w95.shell.display.scale) : 0,
                            borderHover.now.top? (-event.movementY / w95.shell.display.scale) : 0,
                        );
                        parentWidget.now.Message.move(
                            borderHover.now.left? (event.movementX / w95.shell.display.scale) : 0,
                            borderHover.now.top? (event.movementY / w95.shell.display.scale) : 0,
                        );
                    }
                }

                return onMouseMove?.({event, isGrabbed:(isGrabbable && isPressed.now), widget:this});
            },
        },
    };

    function update_border_hover(at) {
        w95.debug?.assert(typeof at.x === "number");
        w95.debug?.assert(typeof at.y === "number");

        if (!isResizable || isBorderGrabbed.now) {
            return;
        }

        const cornerMargin = 18;

        borderHover.set({
            rightTop: (
                ((at.y < cornerMargin) && (at.x >= (width - borderWidth))) ||
                ((at.y < borderWidth) && (at.x >= (width - cornerMargin)))
            ),
            rightBottom: (
                (at.y >= (height - cornerMargin)) && (at.x >= (width - borderWidth)) ||
                (at.y >= (height - borderWidth)) && (at.x >= (width - cornerMargin))
            ),
            leftTop: (
                ((at.y < cornerMargin) && (at.x < borderWidth)) ||
                ((at.y < borderWidth) && (at.x < cornerMargin))
            ),
            leftBottom: (
                ((at.y >= (height - cornerMargin)) && (at.x < borderWidth)) ||
                ((at.y >= (height - borderWidth)) && (at.x < cornerMargin))
            ),
            left: (at.x < borderWidth),
            right: (at.x >= (width - borderWidth)),
            top: (at.y < borderWidth),
            bottom: (at.y >= (height - borderWidth)),
        });
    }

    function frame_mesh() {
        if (
            (backgroundColor === w95.palette.named.transparent) ||
            styleHints.includes(w95.styleHint.noBorder) ||
            styleHints.includes(w95.styleHint.flat)
        ) {
            return [];
        }
    
        const meshes = {
            dialog(width, height) {
                return [
                    // Top inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, 1),
                        Rngon.vertex((width - 2), 1),
                    ], {
                        color: w95.palette.frame.light,
                    }),
            
                    // Right inner border.
                    Rngon.ngon([
                        Rngon.vertex((width - 2), 1),
                        Rngon.vertex((width - 2), (height - 1)),
                    ], {
                        color: w95.palette.frame.darker,
                    }),
            
                    // Bottom inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, (height - 2)),
                        Rngon.vertex((width - 1), (height - 2)),
                    ], {
                        color: w95.palette.frame.darker,
                    }),
            
                    // Left inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, 1),
                        Rngon.vertex(1, (height - 1)),
                    ], {
                        color: w95.palette.frame.light,
                    }),
            
                    // Right outer border.
                    Rngon.ngon([
                        Rngon.vertex((width - 1), 0),
                        Rngon.vertex((width - 1), height),
                    ], {
                        color: w95.palette.frame.dark,
                    }),
            
                    // Bottom outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, (height - 1)),
                        Rngon.vertex(width, (height - 1)),
                    ], {
                        color: w95.palette.frame.dark,
                    }),
            
                    // Top outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(width, 0),
                    ], {
                        color: w95.palette.frame.lighter,
                    }),
            
                    // Left outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(0, height),
                    ], {
                        color: w95.palette.frame.lighter,
                    }),
                ];
            },
            resizableWindow(width, height) {
                return [
                    // Top inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, 1),
                        Rngon.vertex((width - 2), 1),
                    ], {
                        color: w95.palette.frame.light,
                    }),
                    Rngon.ngon([
                        Rngon.vertex(2, 1),
                        Rngon.vertex((width - 3), 2),
                    ], {
                        color: w95.palette.window.background,
                    }),
            
                    // Right inner border.
                    Rngon.ngon([
                        Rngon.vertex((width - 2), 1),
                        Rngon.vertex((width - 2), (height - 1)),
                    ], {
                        color: w95.palette.frame.darker,
                    }),
                    Rngon.ngon([
                        Rngon.vertex((width - 3), 2),
                        Rngon.vertex((width - 3), (height - 2)),
                    ], {
                        color: w95.palette.window.background,
                    }),
            
                    // Bottom inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, (height - 2)),
                        Rngon.vertex((width - 1), (height - 2)),
                    ], {
                        color: w95.palette.frame.darker,
                    }),
                    Rngon.ngon([
                        Rngon.vertex(2, (height - 3)),
                        Rngon.vertex((width - 2), (height - 3)),
                    ], {
                        color: w95.palette.window.background,
                    }),
            
                    // Left inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, 1),
                        Rngon.vertex(1, (height - 1)),
                    ], {
                        color: w95.palette.frame.light,
                    }),
                    Rngon.ngon([
                        Rngon.vertex(2, 2),
                        Rngon.vertex(2, (height - 2)),
                    ], {
                        color: w95.palette.window.background,
                    }),
            
                    // Right outer border.
                    Rngon.ngon([
                        Rngon.vertex((width - 1), 0),
                        Rngon.vertex((width - 1), height),
                    ], {
                        color: w95.palette.frame.dark,
                    }),
            
                    // Bottom outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, (height - 1)),
                        Rngon.vertex(width, (height - 1)),
                    ], {
                        color: w95.palette.frame.dark,
                    }),
            
                    // Top outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(width, 0),
                    ], {
                        color: w95.palette.frame.lighter,
                    }),
            
                    // Left outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(0, height),
                    ], {
                        color: w95.palette.frame.lighter,
                    }),
                ];
            },
            dropdownButton(width, height) {
                const palette = (()=>{
                    let light = w95.palette.frame.light;
                    let lighter = w95.palette.frame.lighter;
                    let darker = w95.palette.frame.darker;
                    let dark = w95.palette.frame.dark;
    
                    return {
                        light,
                        lighter,
                        darker,
                        dark
                    };
                })();
    
                if (styleHints.includes(w95.styleHint.inverted)) {
                    return [
                        // Right outer border.
                        Rngon.ngon([
                            Rngon.vertex((width - 1), 0),
                            Rngon.vertex((width - 1), height),
                        ], {
                            color: palette.darker,
                        }),
                
                        // Bottom outer border.
                        Rngon.ngon([
                            Rngon.vertex(0, (height - 1)),
                            Rngon.vertex(width, (height - 1)),
                        ], {
                            color: palette.darker,
                        }),
                
                        // Top outer border.
                        Rngon.ngon([
                            Rngon.vertex(0, 0),
                            Rngon.vertex(width, 0),
                        ], {
                            color: palette.darker,
                        }),
                
                        // Left outer border.
                        Rngon.ngon([
                            Rngon.vertex(0, 0),
                            Rngon.vertex(0, height),
                        ], {
                            color: palette.darker,
                        }),
                    ];
                }
                else {
                    return [
                        // Top inner border.
                        Rngon.ngon([
                            Rngon.vertex(1, 1),
                            Rngon.vertex((width - 2), 1),
                        ], {
                            color: palette.light,
                        }),
                
                        // Right inner border.
                        Rngon.ngon([
                            Rngon.vertex((width - 2), 1),
                            Rngon.vertex((width - 2), (height - 1)),
                        ], {
                            color: palette.darker,
                        }),
                
                        // Bottom inner border.
                        Rngon.ngon([
                            Rngon.vertex(1, (height - 2)),
                            Rngon.vertex((width - 1), (height - 2)),
                        ], {
                            color: palette.darker,
                        }),
                
                        // Left inner border.
                        Rngon.ngon([
                            Rngon.vertex(1, 1),
                            Rngon.vertex(1, (height - 1)),
                        ], {
                            color: palette.light,
                        }),
                
                        // Right outer border.
                        Rngon.ngon([
                            Rngon.vertex((width - 1), 0),
                            Rngon.vertex((width - 1), height),
                        ], {
                            color: palette.dark,
                        }),
                
                        // Bottom outer border.
                        Rngon.ngon([
                            Rngon.vertex(0, (height - 1)),
                            Rngon.vertex(width, (height - 1)),
                        ], {
                            color: palette.dark,
                        }),
                
                        // Top outer border.
                        Rngon.ngon([
                            Rngon.vertex(0, 0),
                            Rngon.vertex(width, 0),
                        ], {
                            color: palette.lighter,
                        }),
                
                        // Left outer border.
                        Rngon.ngon([
                            Rngon.vertex(0, 0),
                            Rngon.vertex(0, height),
                        ], {
                            color: palette.lighter,
                        }),
                    ];
                }
            },
            widget(width, height) {
                const palette = (()=>{
                    let light = w95.palette.frame.light;
                    let lighter = w95.palette.frame.lighter;
                    let darker = w95.palette.frame.darker;
                    let dark = w95.palette.frame.dark;
    
                    if (styleHints.includes(w95.styleHint.inverted)) {
                        [light, lighter, darker, dark] = [dark, darker, lighter, light];
                    }
    
                    return {
                        light,
                        lighter,
                        darker,
                        dark
                    };
                })();
    
                return [
                    // Top inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, 1),
                        Rngon.vertex((width - 2), 1),
                    ], {
                        color: palette.lighter,
                    }),
            
                    // Right inner border.
                    Rngon.ngon([
                        Rngon.vertex((width - 2), 1),
                        Rngon.vertex((width - 2), (height - 1)),
                    ], {
                        color: palette.darker,
                    }),
            
                    // Bottom inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, (height - 2)),
                        Rngon.vertex((width - 1), (height - 2)),
                    ], {
                        color: palette.darker,
                    }),
            
                    // Left inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, 1),
                        Rngon.vertex(1, (height - 1)),
                    ], {
                        color: palette.lighter,
                    }),
            
                    // Right outer border.
                    Rngon.ngon([
                        Rngon.vertex((width - 1), 0),
                        Rngon.vertex((width - 1), height),
                    ], {
                        color: palette.dark,
                    }),
            
                    // Bottom outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, (height - 1)),
                        Rngon.vertex(width, (height - 1)),
                    ], {
                        color: palette.dark,
                    }),
            
                    // Top outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(width, 0),
                    ], {
                        color: palette.light,
                    }),
            
                    // Left outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(0, height),
                    ], {
                        color: palette.light,
                    }),
                ];
            },
            tabControlButton(width, height) {
                const isFirstTab = styleHints.includes(w95.styleHint.first);
    
                const palette = {
                    light: w95.palette.frame.light,
                    lighter: w95.palette.frame.lighter,
                    darker: w95.palette.frame.darker,
                    dark: w95.palette.frame.dark,
                };
    
                return [
                    // Top right dot.
                    Rngon.ngon([
                        Rngon.vertex((width - 2), 1),
                    ], {
                        color: palette.dark,
                    }),
    
                    // Top left dot.
                    Rngon.ngon([
                        Rngon.vertex(1, 1),
                    ], {
                        color: palette.light,
                    }),
            
                    // Bottom inner border.
                    Rngon.ngon([
                        Rngon.vertex(2, (height - 2)),
                        Rngon.vertex((width - 2), (height - 2)),
                    ], {
                        color: w95.palette.window.background,
                    }),
            
                    // Bottom outer border.
                    Rngon.ngon([
                        Rngon.vertex((isFirstTab? 2 : 0), (height - 1)),
                        Rngon.vertex(width, (height - 1)),
                    ], {
                        color: w95.palette.window.background,
                    }),
    
                    // Top inner border.
                    Rngon.ngon([
                        Rngon.vertex(2, 1),
                        Rngon.vertex((width - 2), 1),
                    ], {
                        color: palette.lighter,
                    }),
            
                    // Right inner border.
                    Rngon.ngon([
                        Rngon.vertex((width - 2), 2),
                        Rngon.vertex((width - 2), (height - 1)),
                    ], {
                        color: palette.darker,
                    }),
    
                    // Left inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, 2),
                        Rngon.vertex(1, (height - (isFirstTab? 0 : 1))),
                    ], {
                        color: palette.lighter,
                    }),
            
                    // Right outer border.
                    Rngon.ngon([
                        Rngon.vertex((width - 1), 2),
                        Rngon.vertex((width - 1), (height - 1)),
                    ], {
                        color: palette.dark,
                    }),
            
                    // Top outer border.
                    Rngon.ngon([
                        Rngon.vertex(2, 0),
                        Rngon.vertex((width - 2), 0),
                    ], {
                        color: palette.light,
                    }),
            
                    // Left outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, 2),
                        Rngon.vertex(0, (height - (isFirstTab? 0 : 1))),
                    ], {
                        color: palette.light,
                    }),
                ];
            },
            inlineWidget(width, height) {
                if (styleHints.includes(w95.styleHint.inverted)) {
                    return [
                        // Right border.
                        Rngon.ngon([
                            Rngon.vertex((width - 1), 0),
                            Rngon.vertex((width - 1), height),
                        ], {
                            color: w95.palette.named.gray,
                        }),
    
                        // Bottom border.
                        Rngon.ngon([
                            Rngon.vertex(0, (height - 1)),
                            Rngon.vertex(width, (height - 1)),
                        ], {
                            color: w95.palette.named.gray,
                        }),
    
                        // Top border.
                        Rngon.ngon([
                            Rngon.vertex(0, 0),
                            Rngon.vertex(width, 0),
                        ], {
                            color: w95.palette.named.gray,
                        }),
    
                        // Left border.
                        Rngon.ngon([
                            Rngon.vertex(0, 0),
                            Rngon.vertex(0, height),
                        ], {
                            color: w95.palette.named.gray,
                        }),
                    ];
                }
                else {
                    return this.widget();
                }
            },
            input(width, height) {
                const palette = (()=>{
                    let light = w95.palette.frame.light;
                    let lighter = w95.palette.frame.lighter;
                    let darker = w95.palette.frame.darker;
                    let dark = w95.palette.frame.dark;
    
                    if (styleHints.includes(w95.styleHint.inverted)) {
                        [light, lighter, darker, dark] = [dark, darker, lighter, light];
                    }
    
                    return {
                        light,
                        lighter,
                        darker,
                        dark
                    };
                })();
    
                return [
                    // Top inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, 1),
                        Rngon.vertex((width - 2), 1),
                    ], {
                        color: palette.dark,
                    }),
            
                    // Right inner border.
                    Rngon.ngon([
                        Rngon.vertex((width - 2), 1),
                        Rngon.vertex((width - 2), (height - 1)),
                    ], {
                        color: palette.lighter,
                    }),
            
                    // Bottom inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, (height - 2)),
                        Rngon.vertex((width - 1), (height - 2)),
                    ], {
                        color: palette.lighter,
                    }),
            
                    // Left inner border.
                    Rngon.ngon([
                        Rngon.vertex(1, 1),
                        Rngon.vertex(1, (height - 1)),
                    ], {
                        color: palette.dark,
                    }),
            
                    // Right outer border.
                    Rngon.ngon([
                        Rngon.vertex((width - 1), 0),
                        Rngon.vertex((width - 1), height),
                    ], {
                        color: palette.light,
                    }),
            
                    // Bottom outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, (height - 1)),
                        Rngon.vertex(width, (height - 1)),
                    ], {
                        color: palette.light,
                    }),
            
                    // Top outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(width, 0),
                    ], {
                        color: palette.darker,
                    }),
            
                    // Left outer border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(0, height),
                    ], {
                        color: palette.darker,
                    }),
                ];
            },
            plain(width, height) {
                const color = w95.palette.frame.darker;
    
                return [
                    // Right border.
                    Rngon.ngon([
                        Rngon.vertex((width - 1), 0),
                        Rngon.vertex((width - 1), height),
                    ], {
                        color,
                    }),
    
                    // Bottom border.
                    Rngon.ngon([
                        Rngon.vertex(0, (height - 1)),
                        Rngon.vertex(width, (height - 1)),
                    ], {
                        color,
                    }),
    
                    // Top border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(width, 0),
                    ], {
                        color,
                    }),
    
                    // Left border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(0, height),
                    ], {
                        color,
                    }),
                ];
            },
            none() {
                return [
                ];
            },
            box(width, height) {
                const palette = (()=>{
                    let color1 = w95.palette.frame.light;
                    let color2 = w95.palette.frame.darker;
                
                    if (styleHints.includes(w95.styleHint.raised)) {
                        [color1, color2] = [color2, color1];
                    }
                    else if (styleHints.includes(w95.styleHint.plain)) {
                        color1 = color2;
                    }
    
                    return [
                        color1,
                        color2,
                    ];
                })();
    
                return [
                    // Right border.
                    Rngon.ngon([
                        Rngon.vertex((width - 1), 0),
                        Rngon.vertex((width - 1), height),
                    ], {
                        color: palette[0],
                    }),
    
                    // Bottom border.
                    Rngon.ngon([
                        Rngon.vertex(0, (height - 1)),
                        Rngon.vertex(width, (height - 1)),
                    ], {
                        color: palette[0],
                    }),
    
                    // Top border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(width, 0),
                    ], {
                        color: palette[1],
                    }),
    
                    // Left border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(0, height),
                    ], {
                        color: palette[1],
                    }),
                ];
            },
            fancyBox(width, height) {
                const palette = [
                    w95.palette.frame.light,
                    w95.palette.frame.darker,
                ];
    
                const box1 = this.box(width, height);
                const box2 = this.box((width - 2), (height - 2));
    
                for (const ngon of box2) {
                    // Align this smaller box inside the larger box.
                    for (const vert of ngon.vertices) {
                        vert.x++;
                        vert.y++;
                    }
    
                    // Flip the line colors.
                    ngon.material.color = palette[(palette.findIndex(c=>c===ngon.material.color) + 1) % 2];
                }
    
                return [...box1, ...box2];
            },
            dropdownList(width, height) {
                return [
                    // Right border.
                    Rngon.ngon([
                        Rngon.vertex((width - 1), 0),
                        Rngon.vertex((width - 1), height),
                    ], {
                        color: w95.palette.named.black,
                    }),
    
                    // Bottom border.
                    Rngon.ngon([
                        Rngon.vertex(0, (height - 1)),
                        Rngon.vertex(width, (height - 1)),
                    ], {
                        color: w95.palette.named.black,
                    }),
    
                    // Top border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(width, 0),
                    ], {
                        color: w95.palette.named.black,
                    }),
    
                    // Left border.
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(0, height),
                    ], {
                        color: w95.palette.named.black,
                    }),
                ];
            },
        }
    
        w95.debug?.assert(typeof meshes[shape] === "function");
        const mesh = meshes[shape](width, height);
    
        if (backgroundColor) {
            mesh.push(
                Rngon.ngon([
                    Rngon.vertex(0, 0),
                    Rngon.vertex(width, 0),
                    Rngon.vertex(width, height),
                    Rngon.vertex(0, height),
                ], {
                    color: backgroundColor,
                })
            );
        }
    
        return mesh;
    }    
});


/***/ }),

/***/ "./src/widgets/groupBox.js":
/*!*********************************!*\
  !*** ./src/widgets/groupBox.js ***!
  \*********************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("groupBox", function({
    x = 0,
    y = 0,
    width = 200,
    height = 100,
    title = "Group box",
    children = [],
    isDisabled = false,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof title === "string");
    w95.debug?.assert(typeof isDisabled === "boolean");
    w95.debug?.assert(Array.isArray(children));

    title = ` ${title} `;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Form() {
            return [
                w95.widget.frame({
                    y: ~~(w95.font.regular.lineHeight / 2),
                    width,
                    height: (height - ~~(w95.font.regular.lineHeight / 2)),
                    shape: w95.frameShape.fancyBox,
                    children,
                }),
                w95.widget.label({
                    x: 7,
                    y: ~~isDisabled,
                    width: w95.font.stringWidth(title),
                    text: title,
                    isDisabled,
                    backgroundColor: w95.palette.window.background,
                    styleHints: [
                        w95.styleHint.action
                    ],
                }),
            ];
        },
    };
});


/***/ }),

/***/ "./src/widgets/horizontalLayout.js":
/*!*****************************************!*\
  !*** ./src/widgets/horizontalLayout.js ***!
  \*****************************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("horizontalLayout", function({
    x = 0,
    y = 0,
    width = 100,
    styleHints = [],
    children = [],
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(Array.isArray(children));

    const adjustedX = w95.state(x);
    const adjustedWidth = w95.state(width);
    const adjustedHeight = w95.state(0);
    
    return {
        get x() { return adjustedX.now },
        get y() { return y },
        get width() { return adjustedWidth.now },
        get height() { return adjustedHeight.now },
        Mounted() {
            const maxChildHeight = this.$childWidgets.reduce((max, w)=>Math.max(max, (w.y + w.height)), 0);
            adjustedHeight.set(maxChildHeight);

            const minChildX = this.$childWidgets.reduce((min, w)=>Math.min(min, w.x), 0);
            const maxChildX = this.$childWidgets.reduce((max, w)=>Math.max(max, (w.x + w.width)), 0);
            adjustedWidth.set(maxChildX - minChildX);

            if (styleHints.includes(w95.styleHint.alignHCenter)) {
                adjustedX.set(x + ~~(width / 2 - ((maxChildX - minChildX) / 2)));
            }
            else if (styleHints.includes(w95.styleHint.alignRight)) {
                adjustedX.set(x + width - maxChildX);
            }
        },
        Form() {
            return children;
        },
    };
});


/***/ }),

/***/ "./src/widgets/horizontalRule.js":
/*!***************************************!*\
  !*** ./src/widgets/horizontalRule.js ***!
  \***************************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("horizontalRule", function({
    x = 0,
    y = 0,
    width = 200,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(width >= 0);

    const ruleHeight = 2;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return ruleHeight },
        Form() {
            return [
                // Top border.
                Rngon.ngon([
                    Rngon.vertex(0, 0),
                    Rngon.vertex(width, 0),
                ], {
                    color: w95.palette.frame.darker,
                }),
    
                // Bottom border.
                Rngon.ngon([
                    Rngon.vertex(0, (ruleHeight - 1)),
                    Rngon.vertex(width, (ruleHeight - 1)),
                ], {
                    color: w95.palette.frame.light,
                }),
            ];
        },
    };
});


/***/ }),

/***/ "./src/widgets/horizontalSlider.js":
/*!*****************************************!*\
  !*** ./src/widgets/horizontalSlider.js ***!
  \*****************************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("horizontalSlider", function({
    x = 0,
    y = 0,
    width = 200,
    value = 5,
    minValue = 0,
    maxValue = 10,
    isDisabled = false,
    numSteps = (maxValue - minValue),
    newValue = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(Number.isInteger(minValue));
    w95.debug?.assert(Number.isInteger(maxValue));
    w95.debug?.assert(Number.isInteger(value));
    w95.debug?.assert(Number.isInteger(numSteps));
    w95.debug?.assert(["undefined", "function"].includes(typeof newValue));
    w95.debug?.assert(numSteps > 1);
    w95.debug?.assert((maxValue - minValue) > 0);
    w95.debug?.assert((value >= minValue) && (value <= maxValue));

    const isPressed = w95.state(false);
    const isHovered = w95.state(false);
    
    const sliderHandleIcon = (
        (isDisabled || isPressed.now)
            ? w95.icon.horizontalSliderHandlePressed
            : w95.icon.horizontalSliderHandle
    );

    const height = 26;
    const tickHeight = 3;
    const sliderWidth = sliderHandleIcon.width;
    const stepSize = ((width - sliderWidth) / numSteps);

    const sliderX = w95.state(clamped_slider_pos((width - sliderWidth) * ((value - minValue) / (maxValue - minValue))));
    const clickPosExcess = w95.state(0, w95.noEffect);

    const numTicks = Math.min((width / 10), numSteps);
    const ticks = w95.state(
        Array.from({length: numTicks + 1}).map((_, index) => {
            const isFirstOrLast = (!index || (index === numTicks));
            const tickX = ((width - sliderWidth) * (index / numTicks));
            const tickY = (height - tickHeight - 1);
            return Rngon.ngon([
                Rngon.vertex(tickX, tickY),
                Rngon.vertex(tickX, (tickY + (tickHeight + isFirstOrLast))),
            ], {
                color: w95.palette.widget.foreground,
            });
        })
    );

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get value() { return value },
        get isGrabbed() { return isPressed.now },
        get isHovered() { return isHovered.now },
        Form() {
            return [
                // Ticks.
                w95.widget.frame({
                    x: ~~(sliderWidth / 2),
                    width: (width - ~~(sliderWidth / 2)),
                    height,
                    shape: w95.frameShape.none,
                    children: ticks.now,
                }),

                // Track.
                w95.widget.frame({
                    x: 0,
                    y: (~~(sliderHandleIcon.height / 2) - 3),
                    width: width,
                    height: 4,
                    shape: w95.frameShape.input,
                }),

                // Handle.
                w95.widget.bitmap({
                    x: sliderX.now,
                    y: 0,
                    image: sliderHandleIcon,
                }),
            ];
        },
        Event: {
            mouseleave() {
                isHovered.set(false);
                return true;
            },
            mouseenter() {
                isHovered.set(true);
                return true;
            },
            mousedown({at}) {
                if (isDisabled) {
                    return;
                }

                const isClickOnHandle = (at.x >= sliderX.now && at.x < (sliderX.now + sliderWidth));

                // Start dragging the handle.
                if (isClickOnHandle) {
                    isPressed.set(true);
                    clickPosExcess.set(sliderX.now - at.x);
                }
                // The click is on either side of the handle but not on it, so move the handle
                // one tick in that direction.
                else {
                    const side = Math.sign(at.x - sliderX.now)

                    const {closestTick} = ticks.now.reduce((o, tick)=>{
                        const distanceToTick = Math.abs(sliderX.now - tick.vertices[0].x);
                        const istickOnCorrectSide = (((sliderX.now - tick.vertices[0].x) * side) < 0);
                        if (istickOnCorrectSide && (distanceToTick < o.distance)) {
                            o.distance = distanceToTick;
                            o.closestTick = tick;
                        }
                        return o;
                    }, {closestTick: undefined, distance: Infinity});

                    if (closestTick) {
                        set_slider_position(closestTick.vertices[0].x);
                    }
                }
                return true;
            },
            mousemove({at}) {
                if (isPressed.now) {
                    set_slider_position(clamped_slider_pos(at.x + clickPosExcess.now));
                }
                return true;
            },
            mouseup() {
                if (isDisabled) {
                    return;
                }
                
                isPressed.set(false);
                return true;
            },
        },
    };

    function set_slider_position(x) {
        sliderX.set(x);
        const updatedValue = Math.round(((x / (width - sliderWidth)) * (maxValue - minValue)) + minValue);
        if (value !== updatedValue) {
            newValue?.(updatedValue);
        }
    }

    function clamped_slider_pos(x) {
        const snappedX = ~~((x / stepSize) + 0.5) * stepSize;
        const clampedX = Math.max(0, Math.min(snappedX, (width - sliderWidth)));
        return ~~clampedX;
    }
});


/***/ }),

/***/ "./src/widgets/label.js":
/*!******************************!*\
  !*** ./src/widgets/label.js ***!
  \******************************/
/***/ (() => {

/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("label", function({
    x = 0,
    y = 0,
    text = "Label",
    width = undefined,
    height = undefined,
    isDisabled = false,
    elide = false,
    wordWrap = false,
    allowFormatting = true,
    styleHints = [],
    font = w95.font.sansSerif[8],
    color = w95.palette.widget.foreground,
    backgroundColor = w95.palette.named.transparent,
    cursor = undefined,
    onMouseDown = undefined,
    onMouseUp = undefined,
    onMouseMove = undefined,
    onMouseLeave = undefined,
    onMouseEnter = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(typeof color === "object");
    w95.debug?.assert(typeof backgroundColor === "object");
    w95.debug?.assert(typeof isDisabled === "boolean");
    w95.debug?.assert(typeof elide === "boolean");
    w95.debug?.assert(typeof wordWrap === "boolean");
    w95.debug?.assert(typeof allowFormatting === "boolean");
    w95.debug?.assert(typeof font === "object");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "object"].includes(typeof cursor));
    w95.debug?.assert(["undefined", "number"].includes(typeof width));
    w95.debug?.assert(["undefined", "number"].includes(typeof height));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseMove));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));

    isDisabled = (isDisabled && !styleHints.includes(w95.styleHint.noDisable));

    let fontVariant = (styleHints.includes(w95.styleHint.bold)? font.bold : font.regular);
    let isUnderlined = (styleHints.includes(w95.styleHint.underlined));

    if (typeof width === "undefined") {
        width = w95.font.stringWidth(text, font, fontVariant, allowFormatting);
    }
    if (typeof height === "undefined") {
        height = w95.font.stringHeight(text, font, fontVariant, allowFormatting);
    }

    if (
        wordWrap &&
        (w95.font.stringWidth(text, font, fontVariant, allowFormatting) > width)
    ){
        word_wrap_text();
    }

    if (
        elide &&
        text.length &&
        (w95.font.stringWidth(text, font, fontVariant, allowFormatting) > width)
    ){
        elide_text();
    }

    const isDisabledAction = (
        isDisabled &&
        styleHints.includes(w95.styleHint.action)
    );

    if (isUnderlined) {
        height++;
    }

    // Prevent the label with disabled styling from shifting up/right.
    if (isDisabledAction) {
        width += !(width & 1);
        height += !(height & 1);
    }

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get text() { return text },
        get cursor() { return cursor },
        Form() {
            return [
                ...text_mesh(),
                ...background_mesh(),
            ];
        },
        Event: {
            mouseleave({at}) {
                return onMouseLeave?.({at, widget:this});
            },
            mouseenter({at}) {
                return onMouseEnter?.({at, widget:this});
            },
            mousedown({at}) {
                return onMouseDown?.({at, widget:this});
            },
            mouseup({at}) {
                return onMouseUp?.({at, widget:this});
            },
            mousemove({at}) {
                return onMouseMove?.({at, widget:this});
            },
        },
    };
    
    function background_mesh() {
        return (
            (backgroundColor === w95.palette.named.transparent)
                ? []
                : [
                    Rngon.ngon([
                        Rngon.vertex(0, 0),
                        Rngon.vertex(width, 0),
                        Rngon.vertex(width, height),
                        Rngon.vertex(0, height),
                    ], {
                        color: backgroundColor,
                    }),
                ]
        );
    }

    function word_wrap_text() {
        const words = text.split(" ");

        const lines = [];
        let lineIdx = 0;

        while (words.length) {
            const nextCutIdx = words.findIndex((word, idx)=>(
                w95.font.stringWidth(words.slice(0, (idx + 1)).join(" "), font, fontVariant, allowFormatting) >= width
            ));

            // The entire text fits and so doesn't need wrapping.
            if (nextCutIdx < 0) {
                lines[lineIdx] = words.join(" ");
                break;
            }
            // Not even the first word fits, so chop it up.
            else if (nextCutIdx === 0) {
                const interWordCutIdx = words[0].split("").findIndex((word, idx)=>(
                    w95.font.stringWidth(words[0].substring(0, (idx + 1)), font, fontVariant, allowFormatting) >= width
                ));
                lines[lineIdx] = words[0].substring(0, interWordCutIdx);
                words[0] = words[0].substring(interWordCutIdx);
            }
            // Some of the words fit.
            else {
                lines[lineIdx] = words.splice(0, nextCutIdx).join(" ");
            }

            lineIdx++;
        }

        text = lines.join("\n");
        width = w95.font.stringWidth(text, font, fontVariant);
        height = w95.font.stringHeight(text, font, fontVariant);
    }

    function elide_text() {
        const eliderString = "...";
        const eliderWidth = w95.font.stringWidth(eliderString, font, fontVariant, allowFormatting);

        if (eliderWidth < width) {
            // Not the most efficient way to do this, but good enough for now.
            do {
                text = text.slice(0, -1);
            } while (width < (eliderWidth + w95.font.stringWidth(text, font, fontVariant, allowFormatting)));

            text += eliderString;
        }
        else {
            text = "";
        }
    }

    function text_mesh() {
        const ngons = [];
        const textHeight = w95.font.stringHeight(text, font, fontVariant);

        if (isDisabledAction) {
            ngons.push(...to_ngons(text, w95.palette.widget.disabled1, 0, -1));
            ngons.push(...to_ngons(text, w95.palette.widget.disabled2, 1, 0));
        }
        else {
            ngons.push(...to_ngons(text, (isDisabled? w95.palette.widget.disabled1 : color)));
        }

        if (styleHints.includes(w95.styleHint.alignVCenter)) {
            const center = Math.floor((height - textHeight) / 2);
            for (const ngon of ngons) {
                for (const vert of ngon.vertices) {
                    vert.y += center;
                }
            }
        }

        return ngons;

        function to_ngons(text, textColor = color, x = 0, y = 0) {
            const startX = x;
            const ngons = [];
            const letterSpacing = 1;
            const initialColor = textColor;
            let prevColor = textColor

            for (const line of text.split("\n")) {
                const lineWidth = w95.font.stringWidth(line, font, fontVariant, allowFormatting);
                const lineNgons = [];
                const chars = line.split("");

                for (let i = 0; i < chars.length; i++) {
                    const charCode = chars[i].charCodeAt(0);
    
                    if (allowFormatting) {
                        // \b (toggle bold font on/off).
                        if (charCode === 8) {
                            fontVariant = ((fontVariant === font.regular)? font.bold : font.regular);
                            continue;
                        }
        
                        // \v (toggle underlining on/off).
                        if (charCode === 11) {
                            isUnderlined = !isUnderlined;
                            continue;
                        }
        
                        // \r (set text color, e.g. "\r{red}this is in red\r{} back to normal color").
                        if (charCode === 13) {
                            const colorName = line.slice((i + 2), line.indexOf("}", (i + 2)));
                            if (!isDisabled) {
                                // If a color name is given.
                                if (colorName.length > 1) {
                                    prevColor = textColor;
                                    textColor = w95.palette.named[colorName];
                                }
                                else {
                                    textColor = ((colorName === "-")? initialColor : prevColor);
                                }
                            }
                            i += (2 + colorName.length);
                            continue;
                        }
                    }
        
                    // Tab, space.
                    if ([9, 32].includes(charCode)) {
                        const spaceWidth = (fontVariant.spaceWidth * ((charCode === 9)? 4 : 1));
    
                        if (isUnderlined) {
                            lineNgons.push(
                                Rngon.ngon([
                                    Rngon.vertex( x              , (y + fontVariant.lineHeight)),
                                    Rngon.vertex((x + spaceWidth), (y + fontVariant.lineHeight)),
                                ], {
                                    color: textColor,
                                    isColorInverted: styleHints.includes(w95.styleHint.inverted),
                                }),
                            );
                        }
                        
                        x += spaceWidth;
    
                        continue;
                    }
        
                    const glyph = (fontVariant[charCode] || fontVariant[63]);
        
                    x += glyph.leftSpacing;
    
                    lineNgons.push(
                        Rngon.ngon([
                            Rngon.vertex( x,                 y                ), 
                            Rngon.vertex((x + glyph.width),  y                ),
                            Rngon.vertex((x + glyph.width), (y + glyph.height)),
                            Rngon.vertex( x,                (y + glyph.height)),
                        ], {
                            texture: glyph,
                            color: textColor,
                            allowAlphaReject: true,
                            isColorInverted: styleHints.includes(w95.styleHint.inverted),
                            underlined: true,
                        }),
                    );
    
                    if (isUnderlined) {
                        lineNgons.push(
                            Rngon.ngon([
                                Rngon.vertex( x                               , (y + fontVariant.lineHeight)),
                                Rngon.vertex((x + glyph.width + letterSpacing), (y + fontVariant.lineHeight)),
                            ], {
                                color: textColor,
                                isColorInverted: styleHints.includes(w95.styleHint.inverted),
                            }),
                        );
                    }
        
                    x += (glyph.width + letterSpacing);
                }

                x = startX;
                y += fontVariant.lineHeight;

                if (styleHints.includes(w95.styleHint.alignHCenter)) {
                    const center = Math.round((width - lineWidth) / 2);
                    for (const ngon of lineNgons) {
                        for (const vert of ngon.vertices) {
                            vert.x += center;
                        }
                    }
                }

                if (styleHints.includes(w95.styleHint.alignRight)) {
                    const left = (width - lineWidth);
                    for (const ngon of lineNgons) {
                        for (const vert of ngon.vertices) {
                            vert.x += left;
                        }
                    }
                }

                ngons.push(...lineNgons);
            }

            return ngons;
        }
    }
});


/***/ }),

/***/ "./src/widgets/layoutSpacer.js":
/*!*************************************!*\
  !*** ./src/widgets/layoutSpacer.js ***!
  \*************************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("layoutSpacer", function({
    width = 0,
    height = 0,
} = {})
{
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");

    return {
        get x() { return 0 },
        get y() { return 0 },
        get width() { return width },
        get height() { return height },
        Form() {
            return [];
        },
    };
});


/***/ }),

/***/ "./src/widgets/lineEdit.js":
/*!*********************************!*\
  !*** ./src/widgets/lineEdit.js ***!
  \*********************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("lineEdit", function({
    x = 0,
    y = 0,
    text = "Line edit",
    width = 200,
    height = 21,
    isEditable = false,
    isDisabled = false,
    leftPadding = 0,
    autofocus = false,
    validator = /./,
    styleHints = [
        w95.styleHint.alignVCenter,
    ],
    onSubmit = undefined,
    newText = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof isEditable === "boolean");
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(validator instanceof RegExp);
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "function"].includes(typeof onSubmit));
    w95.debug?.assert(["undefined", "function"].includes(typeof newText));

    const textBuffer = w95.state(text, w95.noEffect);
    const showCursor = w95.state(true);
    const cursorPosition = w95.state(textBuffer.now.length);
    const viewBufferStart = w95.state(0);
    const viewBufferEnd = w95.state(textBuffer.now.length);
    const hasFocus = w95.state(false);

    // Reset the internal state if the input text was modified externally.
    if (textBuffer.now !== text) {
        cursorPosition.set(0);
        viewBufferStart.set(0);
        viewBufferEnd.set(text.length);
        textBuffer.set(text);
    }

    let cursorBlinkTimeout;
    const borderWidth = 2;
    const horPadding = 5;
    const visibleText = textBuffer.now.slice(viewBufferStart.now, viewBufferEnd.now);
    const font = w95.font;
    const fontVariant = font.regular;
    const cursorXOffset = (leftPadding + w95.font.stringWidth(textBuffer.now.slice(viewBufferStart.now, cursorPosition.now), font));

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get hasFocus() { return hasFocus.now },
        get autofocus() { return autofocus },
        get cursor() { return w95.cursor.text },
        Mounted() {
            cursorBlinkTimeout = setTimeout(()=>{
                if (hasFocus.now) {
                    showCursor.set(!showCursor.now)
                }
            }, 500);
        },
        BeforeUnmount() {
            clearTimeout(cursorBlinkTimeout);
        },
        Form() {
            return w95.widget.frame({
                x: 0,
                y: 0,
                width,
                height,
                shape: w95.frameShape.input,
                backgroundColor: (
                    isDisabled
                        ? w95.palette.window.background
                        : w95.palette.named.white
                ),
                children: [
                    w95.widget.label({
                        x: (horPadding + leftPadding),
                        y: borderWidth,
                        width: (width - horPadding - borderWidth - leftPadding),
                        height: (height - borderWidth - borderWidth),
                        text: visibleText,
                        color: (
                            isDisabled
                                ? w95.palette.widget.disabled1
                                : w95.palette.widget.foreground
                        ),
                        styleHints,
                    }),

                    // Text cursor.
                    Rngon.ngon([
                        Rngon.vertex((4 + cursorXOffset), 4),
                        Rngon.vertex((4 + cursorXOffset), (height - 4)),
                    ], {
                        color: (
                            (showCursor.now && hasFocus.now)
                                ? w95.palette.widget.foreground
                                : w95.palette.named.transparent
                        ),
                    }),
                ]
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
            replaceText(newText) {
                w95.debug?.assert(typeof newText === "string");

                if (textBuffer.now === newText) {
                    return;
                }

                viewBufferStart.set(0);
                viewBufferEnd.set(newText.length);

                set_cursor_position(0);
                textBuffer.set(remove_text(textBuffer.now.length));
                textBuffer.set(enter_text(newText));

                showCursor.set(true);
                set_cursor_position(textBuffer.length);
                
                newText?.(textBuffer.now, this);
            },
            submit() {
                if (onSubmit) {
                    onSubmit({text:textBuffer.now, widget:this});
                    this.Message.blur();
                }
            }
        },
        Event: {
            mousedown({at}) {
                if (isDisabled) {
                    return;
                }
                
                const clickCharIdx = visibleText.split("").findIndex((ch, idx)=>{
                    const chCode = ch.charCodeAt(0);
                    const chWidth = ((chCode === 32)? fontVariant.spaceWidth : fontVariant[chCode].width);
                    return (w95.font.stringWidth(visibleText.substring(0, idx), font) > (at.x - (chWidth / 2) - horPadding - leftPadding));
                });
                set_cursor_position(viewBufferStart.now + ((clickCharIdx < 0)? visibleText.length : clickCharIdx));

                return true;
            },
            keypress(event) {
                w95.debug?.assert(event instanceof KeyboardEvent);
                w95.debug?.assert(typeof event.key === "string");

                let updatedText = textBuffer.now;

                if (event.key.length !== 1) {
                    return;
                }

                updatedText = enter_text(event.key);

                if (textBuffer.now !== updatedText) {
                    textBuffer.set(updatedText);
                    newText?.(textBuffer.now, this);
                }

                return;
            },
            keydown(event) {
                w95.debug?.assert(event instanceof KeyboardEvent);
                w95.debug?.assert(typeof event.key === "string");

                if (event.key.length === 1) {
                    return;
                }

                let updatedText = textBuffer.now;

                if (event.key == "Backspace") {
                    updatedText = remove_text(-1);
                }
                else if (event.key == "Delete") {
                    updatedText = remove_text(1);
                }
                else if (event.key == "Escape") {
                    this.Message.blur();
                }
                else if (["Enter", "Return"].includes(event.key)) {
                    this.Message.submit();
                }
                else if (event.key == "ArrowLeft") {
                    set_cursor_position(cursorPosition.now - 1);
                    if (cursorPosition.now < viewBufferStart.now) {
                        viewBufferStart.set(viewBufferStart.now - 1);
                        while (!string_fits_widget(textBuffer.now.slice(viewBufferStart.now, viewBufferEnd.now))) {
                            viewBufferEnd.set(viewBufferEnd.now - 1);
                        };
                    }
                }
                else if (event.key == "ArrowRight") {
                    set_cursor_position(cursorPosition.now + 1);
                    if (cursorPosition.now > viewBufferEnd.now) {
                        viewBufferEnd.set(viewBufferEnd.now + 1);
                        while (!string_fits_widget(textBuffer.now.slice(viewBufferStart.now, viewBufferEnd.now))) {
                            viewBufferStart.set(viewBufferStart.now + 1);
                        };
                    }
                }

                if (textBuffer.now !== updatedText) {
                    textBuffer.set(updatedText);
                    newText?.(textBuffer.now);
                }

                return;
            }
        },
    };

    function remove_text(count = 0) {
        w95.debug?.assert(typeof count === "number");

        let updatedText = textBuffer.now;

        switch (Math.sign(count)) {
            case 1: {
                updatedText = (textBuffer.now.slice(0, cursorPosition.now) + textBuffer.now.slice(cursorPosition.now + count));
                
                viewBufferEnd.set(text.length);
                while (!string_fits_widget(updatedText.slice(viewBufferStart.now, viewBufferEnd.now))) {
                    viewBufferEnd.set(viewBufferEnd.now - 1);
                };

                break;
            }
            case -1: {
                if (cursorPosition.now <= 0) {
                    break;
                }

                const oldCursorPos = cursorPosition.now;
                const newCursorPos = set_cursor_position(oldCursorPos + count);

                updatedText = (textBuffer.now.slice(0, newCursorPos) + textBuffer.now.slice(oldCursorPos));

                viewBufferEnd.set(text.length);
                while (!string_fits_widget(updatedText.slice(viewBufferStart.now, viewBufferEnd.now))) {
                    viewBufferEnd.set(viewBufferEnd.now - 1);
                };

                if (cursorPosition.now < viewBufferStart.now) {
                    viewBufferStart.set(Math.max(0, (viewBufferStart.now - 10)));
                    while (!string_fits_widget(updatedText.slice(viewBufferStart.now, viewBufferEnd.now))) {
                        viewBufferEnd.set(viewBufferEnd.now - 1);
                    };
                }

                break;
            }
            default: break;
        }

        showCursor.set(true);

        return updatedText;
    };

    function enter_text(newText = "") {
        w95.debug?.assert(typeof newText === "string");

        newText = newText.split("").filter(ch=>validator.test(ch)).join("");

        if (!newText.length) {
            return textBuffer.now;
        }

        const updatedText = [textBuffer.now.slice(0, cursorPosition.now), newText, textBuffer.now.slice(cursorPosition.now)].join("");
        
        showCursor.set(true);
        set_cursor_position((cursorPosition.now + newText.length), updatedText);

        viewBufferEnd.set(viewBufferEnd.now + 1);
        while (!string_fits_widget(updatedText.slice(viewBufferStart.now, cursorPosition.now))) {
            viewBufferStart.set(viewBufferStart.now + 1);
        };
        while (!string_fits_widget(updatedText.slice(viewBufferStart.now, viewBufferEnd.now))) {
            viewBufferEnd.set(viewBufferEnd.now - 1);
        };

        return updatedText;
    };

    function set_cursor_position(newPosition = 0, referenceText = textBuffer.now) {
        w95.debug?.assert(typeof newPosition === "number");
        newPosition = Math.max(0, Math.min(newPosition, referenceText.length));
        showCursor.set(true);
        cursorPosition.set(newPosition);
        return cursorPosition.now;
    };

    function string_fits_widget(text) {
        return ((w95.font.stringWidth(text) + (horPadding * 2) + leftPadding) <= width);
    }
});


/***/ }),

/***/ "./src/widgets/menu.js":
/*!*****************************!*\
  !*** ./src/widgets/menu.js ***!
  \*****************************/
/***/ (() => {

/*
 * 2022-2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("menu", function({
    children = [],
} = {})
{
    w95.debug?.assert(Array.isArray(children));

    const x = w95.state(0);
    const y = w95.state(17);
    const width = w95.state(40);
    const height = w95.state(10);
    const isOpen = w95.state(false);
    const isHovered = w95.state(false, w95.noEffect);
    const subMenuOpenTimer = w95.state(undefined, w95.noEffect);
    const activeItem = w95.state(undefined, w95.noEffect);
    const activeSubMenu = w95.state(undefined, w95.noEffect);

    const subMenuOpenDelayMs = 300;

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width.now },
        get height() { return height.now },
        get isOpen() { return isOpen.now },
        get menuItems() { return this.$form["_menuItemsContainer"].$childWidgets },
        get isActivePopupMenu() { return isOpen.now },
        Mounted() {
            const nonSeparatorItems = this.menuItems.filter(w=>w._type !== "menuSeparator");
            w95.debug?.assert(this.menuItems.every(item=>["menuItem", "menuSeparator"].includes(item._type)));
            w95.debug?.assert(nonSeparatorItems.every(item=>(item._type === "menuItem")));

            for (const child of this.menuItems) {
                child.Message?.setParentMenuWidget?.(this);
            }
    
            // Size the menu to its contents.
            const maxChildWidth = nonSeparatorItems.reduce((max, c)=>Math.max(max, c.width), 0);
            const totalChildHeight = this.menuItems.reduce((sum, c)=>(sum + c.height), 0);
            width.set(maxChildWidth + 6);
            height.set(totalChildHeight + 6);
            this.menuItems.forEach(child=>child.Message.resize(maxChildWidth));
    
            // Arrange the menu contents vertically.
            let yOffs = 3;
            for (const menuItem of this.menuItems) {
                menuItem.Message.moveTo(3, yOffs);
                yOffs += menuItem.height;
            }
        },
        BeforeUnmount() {
            this.menuItems[activeItem.now]?.Message.close?.();
        },
        Form() {
            return [
                w95.widget.panel({
                    width: width.now,
                    height: height.now,
                    color: w95.palette.widget.background,
                }, {
                    hideIf: !isOpen.now,
                }),
    
                w95.widget.frame({
                    $name:  "_menuItemsContainer",
                    width: width.now,
                    height: height.now,
                    shape: w95.frameShape.dialog,
                    children,
                }, {
                    hideIf: !isOpen.now,
                }),
            ];
        },
        Event: {
            mouseenter() {
                isHovered.set(true);
            },
            mouseleave() {
                isHovered.set(false);
            },
            mousedown() {
                return true;
            },
        },
        Message: {
            itemHighlighted(menuItem) {
                w95.debug?.assert(["menuItem", "menuSeparator"].includes(menuItem?._type));

                const subMenuIdx = this.menuItems.findIndex(m=>m === menuItem);
                w95.debug?.assert(subMenuIdx >= 0);

                if (this.menuItems[activeItem.now] !== menuItem) {
                    this.menuItems[activeItem.now]?.Message.close?.();
                }
                clearTimeout(subMenuOpenTimer.now);

                if (menuItem.subMenu) {
                    subMenuOpenTimer.set(setTimeout(()=>{
                        if (this.menuItems[subMenuIdx].isHovered) {
                            activeItem.set(subMenuIdx);
                            activeSubMenu.set(menuItem.subMenu);
                            this.menuItems[subMenuIdx].Message.open?.();
                        }
                    }, subMenuOpenDelayMs));
                }
                else {
                    this.menuItems[activeItem.now]?.Message.close?.();
                }
            },
            move(newX, newY) {
                w95.debug?.assert(Number.isInteger(newX));
                w95.debug?.assert(Number.isInteger(newY));
                x.set(newX);
                y.set(newY);
            },
            open() {
                isOpen.set(true);
            },
            close() {
                isOpen.set(false);
                activeSubMenu.now?.Message.close();
            },
            checkItem(menuItem) {
                w95.debug?.assert(menuItem?._type === "menuItem");

                const menuItems = this.$form["_menuItemsContainer"].$childWidgets;
                w95.debug?.assert(menuItems.includes(menuItem));

                const sameGroupItems = menuItems.filter(w=>((w !== menuItem) && w.isCheckable && (w.group === menuItem.group)));
                for (const child of sameGroupItems) {
                    child.Message.setChecked(false);
                }
                menuItem.Message.setChecked(!menuItem.isChecked);
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/menuBar.js":
/*!********************************!*\
  !*** ./src/widgets/menuBar.js ***!
  \********************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("menuBar", function({
    x = 0,
    y = 0,
    width = 200,
    height = 18,
    children = [
        w95.widget.menuItem({
            isTopLevel: true,
            label: "File"
        }),
    ],
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(Array.isArray(children));

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Form() {
            return [
                ...children,
            ];
        },
        Mounted() {
            // Arrange the menu bar items horizontally on the menu bar.
            let x = 0;
            for (const menuItem of this.$childWidgets) {
                w95.debug?.assert(menuItem._type === "menuItem");
                menuItem.Message.moveTo(x);
                x += menuItem.width;
            }
        },
        Message: {
            update() {
                // If one of the menu items is currently open and the mouse moves over another
                // item on the menu bar, open that item's menu.
                const menuItems = this.$childWidgets;
                const activeItem = menuItems.find(menu=>menu.isOpen);
                const hoveredItem = menuItems.find(menu=>menu.isHovered);
                if (hoveredItem && activeItem && (activeItem !== hoveredItem)) {
                    menuItems.forEach(menu=>menu.Message.close());
                    hoveredItem.Message.open();
                }
            },
            closeMenus() {
                this.$childWidgets.filter(w=>w.isOpen).forEach(w=>w.Message.close());
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/menuItem.js":
/*!*********************************!*\
  !*** ./src/widgets/menuItem.js ***!
  \*********************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("menuItem", function({
    label = "Menu item",
    group = undefined,
    menu = undefined,
    icon = undefined,
    isTopLevel = false,
    isCheckable = false,
    isChecked = false,
    isDisabled = false,
    onClick = undefined,
    onMouseEnter = undefined,
    onMouseLeave = undefined,
    newCheckState = undefined,
} = {})
{
    w95.debug?.assert(typeof label === "string");
    w95.debug?.assert(label.length);
    w95.debug?.assert(typeof isTopLevel === "boolean");
    w95.debug?.assert(typeof isCheckable === "boolean");
    w95.debug?.assert(typeof isChecked === "boolean");
    w95.debug?.assert(typeof isDisabled === "boolean");
    w95.debug?.assert(["string", "undefined"].includes(typeof group));
    w95.debug?.assert(["function", "undefined"].includes(typeof menu));
    w95.debug?.assert(["object", "undefined"].includes(typeof icon));
    w95.debug?.assert(["function", "undefined"].includes(typeof onClick));
    w95.debug?.assert(["function", "undefined"].includes(typeof onMouseEnter));
    w95.debug?.assert(["function", "undefined"].includes(typeof onMouseLeave));
    w95.debug?.assert(["function", "undefined"].includes(typeof newCheckState));
    w95.debug?.assert(!isCheckable || !icon);

    const parentMenuWidget = w95.state(undefined, w95.noEffect);
    const x = w95.state(0);
    const y = w95.state(0);
    const isHovered = w95.state(false);
    const isActive = w95.state(false);
    const leftPadding = (isTopLevel? 6 : 22);
    const rightPadding = (isTopLevel? 6 : 20);
    const width = w95.state(leftPadding + w95.font.stringWidth(label) + rightPadding - 1 + ((!isTopLevel && menu)? 2 : 0));
    const height = 18;
    const styleHints = (
        isTopLevel
            ? [w95.styleHint.alignHCenter, w95.styleHint.alignVCenter]
            : [w95.styleHint.alignVCenter]
    );

    const isOfGroup = (typeof group !== "undefined");

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width.now },
        get height() { return height },
        get group() { return group },
        get subMenu() { return (menu && this.$childWidgets[1]) },
        get isOpen() { return this.subMenu?.isOpen },
        get isChecked() { return isChecked },
        get isCheckabled() { return isCheckable },
        get isHovered() { return isHovered.now },
        Mounted() {
            if (!isTopLevel && this.subMenu) {
                this.subMenu.Message.move((x.now + width.now - 5), -3);
            }
        },
        Form() {
            return [
                w95.widget.panel({
                    width: width.now,
                    height,
                    color: w95.palette.named.navy,
                }, {
                    hideIf: (!isHovered.now && !isTopLevel) || (isTopLevel && !isActive.now) || isDisabled,
                }),
                menu,
                w95.widget.bitmap({
                    x: (6 + isOfGroup),
                    y: 6,
                    image: (
                        isOfGroup
                            ? w95.icon.dotmarkBig
                            : w95.icon.checkmark
                    ),
                    color: (
                        isDisabled
                            ? w95.palette.widget.disabled1
                            : w95.palette.widget.foreground
                    ),
                    styleHints: [
                        isHovered.now? w95.styleHint.inverted : 0,
                    ],
                }, {
                    hideIf: !isChecked,
                }),
                w95.widget.bitmap({
                    x: 1,
                    y: 1,
                    image: icon,
                }, {
                    hideIf: !icon,
                }),
                w95.widget.label({
                    x: (isTopLevel? 0 : leftPadding),
                    width: (width.now - (isTopLevel? 0 : leftPadding)),
                    height,
                    text: label,
                    isDisabled,
                    styleHints: [
                        ...styleHints,
                        w95.styleHint.action,
                        (!isDisabled && (isActive.now || (!isTopLevel && isHovered.now)))? w95.styleHint.inverted : 0,
                    ],
                }),
                // Submenu indicator.
                w95.widget.bitmap({
                    x: (width.now - 10),
                    y: 5,
                    image: w95.icon.arrowRight,
                    color: w95.palette.widget.foreground,
                    styleHints: [
                        (isHovered.now? w95.styleHint.inverted : 0),
                    ],
                }, {
                    hideIf: (!menu || isTopLevel),
                }),
            ];
        },
        Event: {
            mouseenter() {
                isHovered.set(true);
                if (!isTopLevel) {
                    parentMenuWidget.now.Message.itemHighlighted(this);
                }
            },
            mouseleave() {
                if (isTopLevel || !this.isOpen) {
                    isHovered.set(false);
                }
            },
            mousedown() {
                if (isDisabled) {
                    return;
                }

                if (this.subMenu) {
                    this.Message[isTopLevel? "toggle" : "open"]();
                }

                return true;
            },
            mouseup() {
                if (isDisabled) {
                    return;
                }

                if (this.subMenu) {
                    return;
                }
                
                if (!isTopLevel) {
                    isHovered.set(false);
                    w95.windowManager.root_widget(this)?.menuBar?.Message.closeMenus();
                }

                if (isCheckable) {
                    w95.debug?.assert(parentMenuWidget.now?._type === "menu");
                    parentMenuWidget.now?.Message.checkItem(this);
                }

                return (onClick?.(this) ?? true);
            },
            mousemove() {
                w95.windowManager.root_widget(this)?.menuBar?.Message.update();
            },
        },
        Message: {
            resize(newWidth = 0)  {
                w95.debug?.assert(typeof newWidth === "number");
                width.set(newWidth);
            },
            moveTo(newX = 0, newY = 0) {
                w95.debug?.assert(typeof newX === "number");
                w95.debug?.assert(typeof newY === "number");
                x.set(newX);
                y.set(newY);
            },
            open() {
                this.subMenu?.Message.open();
                isActive.set(true);
            },
            close() {
                this.subMenu?.Message.close();
                isHovered.set(false);
                isActive.set(false);
            },
            toggle() {
                this.Message[this.subMenu?.isOpen? "close" : "open"]();
            },
            setChecked(is) {
                w95.debug?.assert(typeof is === "boolean");
                w95.debug?.assert(isCheckable);
                if (isCheckable) {
                    newCheckState?.(is);
                }
            },
            setParentMenuWidget(newParentMenuWidget) {
                w95.debug?.assert(newParentMenuWidget?._type === "menu");
                parentMenuWidget.set(newParentMenuWidget);
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/menuSeparator.js":
/*!**************************************!*\
  !*** ./src/widgets/menuSeparator.js ***!
  \**************************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 *
 * Horizontal separator between MENU_ITEMs in a MENU widget. Will be automatically
 * sized and positioned by the parent MENU widget.
 * 
 */

w95.widget("menuSeparator", function()
{
    const x = w95.state(0);
    const y = w95.state(0);
    const width = w95.state(200);
    const height = 8;
    const parentMenuWidget = w95.state(undefined, w95.noEffect);

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width.now },
        get height() { return height },
        Form() {
            return [
                // Top border.
                Rngon.ngon([
                    Rngon.vertex(0, 3),
                    Rngon.vertex(width.now, 3),
                ], {
                    color: w95.palette.frame.darker,
                }),
    
                // Bottom border.
                Rngon.ngon([
                    Rngon.vertex(0, 4),
                    Rngon.vertex(width.now, 4),
                ], {
                    color: w95.palette.frame.light,
                }),
            ];
        },
        Event: {
            mouseenter() {
                parentMenuWidget.now.Message.itemHighlighted(this);
            },
        },
        Message: {
            resize(newWidth = 0) {
                w95.debug?.assert(typeof newWidth === "number");
                width.set(newWidth);
            },
            moveTo(newX = 0, newY = 0) {
                w95.debug?.assert(typeof newX === "number");
                w95.debug?.assert(typeof newY === "number");
                x.set(newX);
                y.set(newY);
            },
            setParentMenuWidget(newParentMenuWidget) {
                w95.debug?.assert(newParentMenuWidget?._type === "menu");
                parentMenuWidget.set(newParentMenuWidget);
            },
        },
    };
});


/***/ }),

/***/ "./src/widgets/panel.js":
/*!******************************!*\
  !*** ./src/widgets/panel.js ***!
  \******************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("panel", function({
    x = 0,
    y = 0,
    width = 200,
    height = 22,
    color = w95.palette.named.navy,
    cursor = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof color === "object");
    w95.debug?.assert(["undefined", "object"].includes(typeof cursor));
    w95.debug?.assert(width > 0);
    w95.debug?.assert(height > 0);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get cursor() { return cursor },
        Form() {
            return [
                Rngon.ngon([
                    Rngon.vertex(0,     0),
                    Rngon.vertex(width, 0),
                    Rngon.vertex(width, height),
                    Rngon.vertex(0,     height),
                ], {
                    color,
                }),
            ];
        },
    };
});


/***/ }),

/***/ "./src/widgets/progressBar.js":
/*!************************************!*\
  !*** ./src/widgets/progressBar.js ***!
  \************************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("progressBar", function({
    x = 0,
    y = 0,
    width = 200,
    height = 13,
    color = w95.palette.named.navy,
    progress = 50,
    isDisabled = false,
    styleHints = [
        w95.styleHint.solid,
    ],
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof progress === "number");
    w95.debug?.assert(typeof color === "object");
    w95.debug?.assert(Array.isArray(styleHints));

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Form() {
            return [
                w95.widget.frame({
                    x: 0,
                    y: 0,
                    width,
                    height,
                }),
                ...bar_mesh(),
            ];
        },
    };

    function bar_mesh() {
        const barWidth = Math.min(isDisabled? (width - 2) : width, Math.floor((width / 100) * progress));

        if (barWidth <= 0) {
            return [];
        }
        else if (styleHints.includes(w95.styleHint.solid)) {
            const margin = (isDisabled? 2 : 0);
            return [
                Rngon.ngon([
                    Rngon.vertex(margin,   margin           ),
                    Rngon.vertex(barWidth, margin           ),
                    Rngon.vertex(barWidth, (height - margin)),
                    Rngon.vertex(margin,   (height - margin)),
                ], {
                    color: (isDisabled? w95.palette.widget.disabled1 : color),
                }),
            ];
        }
        else if (styleHints.includes(w95.styleHint.dashed)) {
            const segmentWidth = 6;
            const numDashes = Math.ceil((barWidth - 2) / (segmentWidth + 2));

            if (
                !Number.isFinite(numDashes) ||
                (numDashes < 1) ||
                (numDashes > 4096)
            )
            {
                return [];
            }

            return new Array(numDashes).fill().map((dash, idx)=>{
                const xOffs = (2 + ((segmentWidth + 2) * idx));
                const avoidOverflowWidth = Math.min(segmentWidth, (width - xOffs));
                return Rngon.ngon(
                    [
                        Rngon.vertex(xOffs, 2),
                        Rngon.vertex((xOffs + avoidOverflowWidth), 2),
                        Rngon.vertex((xOffs + avoidOverflowWidth), (height - 2)),
                        Rngon.vertex(xOffs, (height - 2)),
                    ], {
                        color: (isDisabled? w95.palette.widget.disabled1 : color),
                    }
                );
            });
        }
    }
});


/***/ }),

/***/ "./src/widgets/radioGroup.js":
/*!***********************************!*\
  !*** ./src/widgets/radioGroup.js ***!
  \***********************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("radioGroup", function({
    x = 0,
    y = 0,
    items = {
        "Item 1": {},
        "Item 2": {
            y: 18,
            isDisabled: true,
        },
    },
    isDisabled = false,
    itemIndex = 0,
    newItemIndex = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof items === "object");
    w95.debug?.assert(typeof itemIndex === "number");
    w95.debug?.assert(typeof isDisabled === "boolean");
    w95.debug?.assert(["undefined", "function"].includes(typeof newItemIndex));

    const width = w95.state(200);
    const height = w95.state(100);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width.now },
        get height() { return height.now },
        Mounted() {
            width.set(Math.max(...this.$descendants.map(d=>(d.at.x + d.widget.width))));
            height.set(Math.max(...this.$descendants.map(d=>(d.at.y + d.widget.height))));
        },
        Form() {
            const itemWidgets = Object.keys(items).reduce((array, key, idx)=>{
                const item = items[key];
                array.push(
                    w95.widget.radioGroupItem({
                        x: (item.hasOwnProperty("x")? item.x : 0),
                        y: (item.hasOwnProperty("y")? item.y : (idx * 26)),
                        label: key,
                        isChecked: (itemIndex === idx),
                        isDisabled: item.isDisabled,
                        onCheck() {
                            if (itemIndex !== idx) {
                                newItemIndex?.(idx);
                            }
                        },
                    })
                );

                return array;
            }, []);

            return [
                w95.widget.frame({
                    width: width.now,
                    height: height.now,
                    shape: w95.frameShape.none,
                    children: itemWidgets,
                }),
            ];
        },
    };
});


/***/ }),

/***/ "./src/widgets/radioGroupItem.js":
/*!***************************************!*\
  !*** ./src/widgets/radioGroupItem.js ***!
  \***************************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("radioGroupItem", function({
    x = 0,
    y = 0,
    label = "Radio item",
    isChecked = false,
    isDisabled = false,
    onCheck = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof label === "string");
    w95.debug?.assert(typeof isChecked === "boolean");
    w95.debug?.assert(["undefined", "function"].includes(typeof onCheck));

    const isPressed = w95.state(false);
    const isHovered = w95.state(false);
    const width = w95.state(1);

    const height = (w95.font.regular.lineHeight + isDisabled);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width.now },
        get height() { return height },
        get isGrabbed() { return isPressed.now },
        get isHovered() { return isHovered.now },
        Mounted() {
            width.set(Math.max(...this.$descendants.map(d=>(d.at.x + d.widget.width))));
        },
        Form() {
            return [
                w95.widget.frame({
                    width: width.now,
                    height,
                    shape: w95.frameShape.none,
                    children: [
                        w95.widget.panel({
                            width: 12,
                            height: 12,
                            color:  (
                                (isDisabled || (isPressed.now && isHovered.now))
                                    ? w95.palette.window.background
                                    : w95.palette.named.white
                            ),
                        }),

                        w95.widget.bitmap({
                            image: w95.icon.radioButton,
                        }),

                        w95.widget.bitmap({
                            x: 4,
                            y: 4,
                            image: w95.icon.dotmark,
                            color: (
                                isDisabled
                                    ? w95.palette.widget.disabled1
                                    : w95.palette.widget.foreground
                            ),
                        }, {hideIf: !isChecked}),

                        w95.widget.label({
                            x: 18,
                            height,
                            text: label,
                            isDisabled,
                            styleHints: [
                                w95.styleHint.alignVCenter,
                                w95.styleHint.action,
                            ],
                        })
                    ],
                }),
            ];
        },
        Event: {
            mouseleave() {
                isHovered.set(false);
                return true;
            },
            mouseenter() {
                isHovered.set(true);
                return true;
            },
            mousedown() {
                if (isDisabled) {
                    return;
                }

                isPressed.set(true);
                return true;
            },
            mouseup() {
                if (isDisabled) {
                    return;
                }
                
                let retval = true;

                if (isPressed.now && isHovered.now) {
                    retval = (onCheck?.(this) ?? true);
                }
                
                isPressed.set(false);
                return retval;
            } 
        },
    };
});


/***/ }),

/***/ "./src/widgets/renderSurface.js":
/*!**************************************!*\
  !*** ./src/widgets/renderSurface.js ***!
  \**************************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("renderSurface", function({
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    meshes = [Rngon.mesh()],
    backgroundColor = w95.palette.named.black,
    isDisabled = false,
    options = {},
    pipeline = {},
    id = "$w95-render-surface",
    cursor = undefined,
    onTick = undefined,
    onMouseDown = undefined,
    onMouseUp = undefined,
    onMouseMove = undefined,
    onMouseLeave = undefined,
    onMouseEnter = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof options === "object");
    w95.debug?.assert(["undefined", "number"].includes(typeof options.resolution));
    w95.debug?.assert(typeof pipeline === "object");
    w95.debug?.assert(typeof id === "string");
    w95.debug?.assert(Array.isArray(meshes));
    w95.debug?.assert(["undefined", "object"].includes(typeof cursor));
    w95.debug?.assert(["undefined", "function"].includes(typeof onTick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseMove));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));
    w95.debug?.assert(width > 0);
    w95.debug?.assert(height > 0);

    const numTicks = w95.state(0);

    const renderWidth = ~~(width * (options.resolution || 1));
    const renderHeight = ~~(height * (options.resolution || 1));
    
    if (!isDisabled) {
        Rngon.render({
            meshes,
            options: {
                ...options,
                context: id,
                resolution: {
                    width: renderWidth,
                    height: renderHeight,
                },
            },
            pipeline,
        });
    }

    const background = (
        (backgroundColor === w95.palette.named.transparent)
            ? Rngon.ngon([])
            : Rngon.ngon([
                Rngon.vertex(0, 0),
                Rngon.vertex(width, 0),
                Rngon.vertex(width, height),
                Rngon.vertex(0, height),
            ], {
                color: backgroundColor,
            })
    );
    
    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get renderContext() { return Rngon.context[id] },
        get cursor() { return cursor },
        Mounted() {
            if (onTick) {
                w95.tick.listen(tick = tick.bind(this));
            }
        },
        BeforeUnmount() {
            if (onTick) {
                w95.tick.unlisten(tick);
            }
        },
        Form() {
            if (!Rngon.context[id]) {
                return;
            }

            return [
                Rngon.ngon([
                    Rngon.vertex(0, 0),
                    Rngon.vertex(width, 0),
                    Rngon.vertex(width, height),
                    Rngon.vertex(0, height),
                ], {
                    allowAlphaReject: true,
                    allowAlphaBlend: true,
                    texture: {
                        $constructor: "Texture",
                        width: Rngon.context[id].pixelBuffer.width,
                        height: Rngon.context[id].pixelBuffer.height,
                        pixels: Rngon.context[id].pixelBuffer.data,
                    },
                    isDisabled,
                }),
                background
            ];
        },
        Event: {
            mouseleave({at}) {
                return onMouseLeave?.({at, widget:this});
            },
            mouseenter({at}) {
                return onMouseEnter?.({at, widget:this});
            },
            mousedown({at}) {
                return onMouseDown?.({at, widget:this});
            },
            mouseup({at}) {
                return onMouseUp?.({at, widget:this});
            },
            mousemove({at}) {
                return onMouseMove?.({at, widget:this});
            },
        },
    };

    function tick(timeDeltaMs) {
        if (!isDisabled && !this._hideMesh) {
            numTicks.set(numTicks.now + 1);
            onTick(timeDeltaMs, numTicks.now, meshes);
        }
    }
});


/***/ }),

/***/ "./src/widgets/scrollArea.js":
/*!***********************************!*\
  !*** ./src/widgets/scrollArea.js ***!
  \***********************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("scrollArea", function({
    x = 0,
    y = 0,
    width = 200,
    height = 100,
    isDisabled = false,
    frameShape = w95.frameShape.input,
    children = [],
    alwaysShowVerticalScroll = false,
    alwaysShowHorizontalScroll = false,
    backgroundColor = undefined,
    cursor = undefined,
    onMouseDown = undefined,
    onMouseUp = undefined,
    onClick = undefined,
    onDoubleClick = undefined,
    onMouseMove = undefined,
    onMouseLeave = undefined,
    onMouseEnter = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof frameShape === "string");
    w95.debug?.assert(typeof alwaysShowVerticalScroll === "boolean");
    w95.debug?.assert(typeof alwaysShowHorizontalScroll === "boolean");
    w95.debug?.assert(Array.isArray(children));
    w95.debug?.assert(["undefined", "object"].includes(typeof cursor));
    w95.debug?.assert(["undefined", "object"].includes(typeof backgroundColor));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onClick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onDoubleClick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseMove));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));

    const clickPosExcess = w95.state(0);
    const isScrolling = w95.state(false);

    const padding = 2;
    const scrollButtonSize = 16;

    const vertical = {
        hasExcess: w95.state(false),
        scrollPos: w95.state(0),
        handlePos: w95.state(0),
        handleSize: w95.state(16),
        contentLength: w95.state(10),
        isVisible: w95.state(alwaysShowVerticalScroll),
        viewportSize: w95.state(height),
    };

    const horizontal = {
        hasExcess: w95.state(false),
        scrollPos: w95.state(0),
        handlePos: w95.state(0),
        handleSize: w95.state(16),
        contentLength: w95.state(10),
        isVisible: w95.state(alwaysShowHorizontalScroll),
        viewportSize: w95.state(width),
    };

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get isGrabbed() { return Boolean(isScrolling.now) },
        Mounted() {
             const contentsFrame = this.$form["_contents"];

             const horizontalScrollExcess = (horizontal.contentLength.now - horizontal.viewportSize.now);
             horizontal.hasExcess.set(horizontalScrollExcess > 0);
             horizontal.isVisible.set(alwaysShowHorizontalScroll || horizontal.hasExcess.now);
             horizontal.viewportSize.set(width - (padding * 2) - (vertical.isVisible.now? scrollButtonSize : 0));
             horizontal.contentLength.set(Math.max(...contentsFrame.$descendants.map(d=>(d.at.x + d.widget.width))));
             horizontal.handleSize.set(Math.max(scrollButtonSize, (horizontal.viewportSize.now - horizontalScrollExcess - (scrollButtonSize * 2))));

             const verticalScrollExcess = (vertical.contentLength.now - vertical.viewportSize.now);
             vertical.hasExcess.set(verticalScrollExcess > 0);
             vertical.isVisible.set(alwaysShowVerticalScroll || vertical.hasExcess.now);
             vertical.viewportSize.set(height - (padding * 2) - (horizontal.isVisible.now? scrollButtonSize : 0));
             vertical.contentLength.set(Math.max(...contentsFrame.$descendants.map(d=>(d.at.y + d.widget.height))));
             vertical.handleSize.set(Math.max(scrollButtonSize, (vertical.viewportSize.now - verticalScrollExcess - (scrollButtonSize * 2))));

             if (vertical.handlePos.now) {
                vertical.handlePos.set(
                    Math.min((vertical.viewportSize.now - vertical.handleSize.now - scrollButtonSize*2), vertical.handlePos.now)
                );

                if (vertical.handleSize.now > scrollButtonSize) {
                    vertical.scrollPos.set(Math.max(0, ~~vertical.handlePos.now));
                }
             }
             if (horizontal.handlePos.now) {
                horizontal.handlePos.set(
                    Math.min((horizontal.viewportSize.now - horizontal.handleSize.now - scrollButtonSize*2), horizontal.handlePos.now)
                );
                
                if (horizontal.handleSize.now > scrollButtonSize) {
                    horizontal.scrollPos.set(Math.max(0, ~~horizontal.handlePos.now));
                }
             }
        },
        Form() {
            return [
                w95.widget.frame({
                    $name: "_background",
                    cursor,
                    x: padding,
                    y: padding,
                    width: (width - (vertical.isVisible.now * scrollButtonSize) - padding - padding),
                    height: (height - (horizontal.isVisible.now * scrollButtonSize) - padding - padding),
                    shape: w95.frameShape.none,
                    backgroundColor: (
                        isDisabled
                            ? w95.palette.window.background
                            : backgroundColor
                    ),
                    onClick,
                    onDoubleClick,
                    onMouseDown({at, widget}) {
                        at.x += horizontal.scrollPos.now;
                        at.y += vertical.scrollPos.now;
                        onMouseDown?.({at, widget});
                    },
                    onMouseUp,
                    onMouseEnter,
                    onMouseLeave,
                    onMouseMove,
                }),

                w95.widget.frame({
                    $name: "_contents",
                    x: (padding - horizontal.scrollPos.now),
                    y: (padding - vertical.scrollPos.now),
                    width: horizontal.contentLength.now,
                    height: vertical.contentLength.now,
                    shape: w95.frameShape.none,
                    children,
                }),

                w95.widget.frame({
                    width,
                    height,
                    shape: frameShape,
                }),

                // Vertical scroll bar.
                w95.widget.frame({
                    x: (horizontal.viewportSize.now + padding),
                    y: padding,
                    width: scrollButtonSize,
                    height: vertical.viewportSize.now,
                    backgroundColor: w95.palette.named.transparent,
                    shape: w95.frameShape.none,
                    children: [
                        // Background.
                        w95.widget.frame({
                            x: 0,
                            y: scrollButtonSize,
                            width: scrollButtonSize,
                            height: (vertical.viewportSize.now - (scrollButtonSize * 2)),
                            backgroundColor: w95.palette.named.offwhite,
                            shape: w95.frameShape.none,
                            onMouseDown({at}) {
                                if (isDisabled) {
                                    return;
                                }

                                if (at.y < vertical.handlePos.now) {
                                    scroll("vertical", -vertical.handleSize.now);
                                    return true;
                                }
                                else if (at.y >= (vertical.handlePos.now + vertical.handleSize.now)) {
                                    scroll("vertical", vertical.handleSize.now);
                                    return true;
                                }
                            },
                        }),
                        // Handle.
                        w95.widget.frame({
                            x: 0,
                            y: (vertical.handlePos.now + scrollButtonSize),
                            width: scrollButtonSize,
                            height: vertical.handleSize.now,
                            shape: w95.frameShape.dropdownButton,
                            backgroundColor: w95.palette.widget.background,
                            onMouseDown({at}) {
                                if (isDisabled) {
                                    return;
                                }
                                
                                isScrolling.set("vertical");
                                clickPosExcess.set(at.y + scrollButtonSize + 1);
                                return true;
                            },
                        }, {hideIf: !vertical.hasExcess.now }),
                        w95.widget.button({
                            x: 0,
                            y: 0,
                            width: scrollButtonSize,
                            height: scrollButtonSize,
                            icon: w95.icon.arrowUp,
                            shape: w95.buttonShape.dropdown,
                            isDisabled: (isDisabled || !vertical.hasExcess.now),
                            onClick() {
                                scroll("vertical", -1);
                                return true;
                            },
                        }),
                        w95.widget.button({
                            x: 0,
                            y: (vertical.viewportSize.now - scrollButtonSize),
                            width: scrollButtonSize,
                            height: scrollButtonSize,
                            icon: w95.icon.arrowDown,
                            shape: w95.buttonShape.dropdown,
                            isDisabled: (isDisabled || !vertical.hasExcess.now),
                            onClick() {
                                scroll("vertical", 1);
                                return true;
                            },
                        }),
                    ],
                }, {
                    hideIf: !vertical.isVisible.now,
                }),

                // Horizontal scroll bar.
                w95.widget.frame({
                    x: padding,
                    y: (vertical.viewportSize.now + padding),
                    width: horizontal.viewportSize.now,
                    height: scrollButtonSize,
                    backgroundColor: w95.palette.named.transparent,
                    shape: w95.frameShape.none,
                    children: [
                        // Background.
                        w95.widget.frame({
                            x: scrollButtonSize,
                            y: 0,
                            width: (horizontal.viewportSize.now - (scrollButtonSize * 2)),
                            height: scrollButtonSize,
                            backgroundColor: w95.palette.named.offwhite,
                            shape: w95.frameShape.none,
                            onMouseDown({at}) {
                                if (isDisabled) {
                                    return;
                                }
                                
                                if (at.x < horizontal.handlePos.now) {
                                    scroll("horizontal", -horizontal.handleSize.now);
                                    return true;
                                }
                                else if (at.x >= (horizontal.handlePos.now + horizontal.handleSize.now)) {
                                    scroll("horizontal", horizontal.handleSize.now);
                                    return true;
                                }
                            },
                        }),
                        // Handle.
                        w95.widget.frame({
                            x: (horizontal.handlePos.now + scrollButtonSize),
                            y: 0,
                            width: horizontal.handleSize.now,
                            height: scrollButtonSize,
                            shape: w95.frameShape.dropdownButton,
                            backgroundColor: w95.palette.widget.background,
                            onMouseDown({at}) {
                                if (isDisabled) {
                                    return;
                                }
                                
                                isScrolling.set("horizontal");
                                clickPosExcess.set(at.x + scrollButtonSize + 1);
                                return true;
                            },
                        }, {hideIf: !horizontal.hasExcess.now }),
                        w95.widget.button({
                            x: 0,
                            y: 0,
                            width: scrollButtonSize,
                            height: scrollButtonSize,
                            icon: w95.icon.arrowLeft,
                            isDisabled: (isDisabled || !horizontal.hasExcess.now),
                            onClick() {
                                scroll("horizontal", -1);
                            },
                        }),
                        w95.widget.button({
                            x: (horizontal.viewportSize.now - scrollButtonSize),
                            y: 0,
                            width: scrollButtonSize,
                            height: scrollButtonSize,
                            icon: w95.icon.arrowRight,
                            isDisabled: (isDisabled || !horizontal.hasExcess.now),
                            onClick() {
                                scroll("horizontal", 1);
                            },
                        }),
                    ],
                }, {
                    hideIf: !horizontal.isVisible.now,
                }),

                // Corner.
                w95.widget.panel({
                    x: (width - scrollButtonSize - padding),
                    y: (height - scrollButtonSize - padding),
                    width: scrollButtonSize,
                    height: scrollButtonSize,
                    color: w95.palette.window.background,
                }, {
                    hideIf: (!vertical.isVisible.now || !horizontal.isVisible.now),
                }),
            ];
        },
        Event: {
            mousemove({at}) {
                switch (isScrolling.now) {
                    case "horizontal": return scroll("horizontal", (at.x - clickPosExcess.now) - horizontal.handlePos.now);
                    case "vertical": return scroll("vertical", (at.y - clickPosExcess.now) - vertical.handlePos.now);
                    default: return;
                }
            },
            mouseup() {
                isScrolling.set(false);
            },
        }
    };

    function scroll(axis = "vertical", delta) {
        const target = ((axis === "vertical")? vertical : horizontal);

        const scrollSpaceAvailable = (target.viewportSize.now - target.handleSize.now - (scrollButtonSize * 2));
        target.handlePos.set(Math.min(scrollSpaceAvailable, Math.max(0, (target.handlePos.now + delta))));

        const moveAmt = ((target.contentLength.now - target.viewportSize.now) / scrollSpaceAvailable);
        target.scrollPos.set(~~(target.handlePos.now * moveAmt));
    }
});


/***/ }),

/***/ "./src/widgets/stackedWidget.js":
/*!**************************************!*\
  !*** ./src/widgets/stackedWidget.js ***!
  \**************************************/
/***/ (() => {

/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("stackedWidget", function({
    x = 0,
    y = 0,
    width = 200,
    height = 100,
    isDisabled = false,
    stacks = {
        "default": [
            w95.widget.label({})
        ],
    },
    stackIndex = "default",
    newStackIndex = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert((typeof stacks === "object") && Object.values(stacks).every(s=>Array.isArray(s)));
    w95.debug?.assert(["undefined", "function"].includes(typeof newStackIndex));

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get stackIndex() { return stackIndex },
        Form() {
            const stacksContents = Object.entries(stacks).map(stack=>(
                w95.widget.frame({
                    $name: stack[0],
                    width: width,
                    height: height,
                    shape: w95.frameShape.none,
                    children: stack[1],
                }, {
                    hideIf: (stack[0] !== stackIndex),
                })
            ));

            return w95.widget.frame({
                $name: "_stacks",
                width,
                height,
                shape: w95.frameShape.none,
                isDisabled,
                children: stacksContents,
            });
        },
    };
});



/***/ }),

/***/ "./src/widgets/tabControl.js":
/*!***********************************!*\
  !*** ./src/widgets/tabControl.js ***!
  \***********************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("tabControl", function({
    x = 0,
    y = 0,
    width = 200,
    height = 100,
    isDisabled = false,
    tabs = {
        "Tab control": {},
        "Besides": {
            isDisabled: true,
        },
    },
    tabIndex = 0,
    newTabIndex = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof tabIndex === "number");
    w95.debug?.assert((typeof tabs === "object") || Array.isArray(tabs));
    w95.debug?.assert(["undefined", "function"].includes(typeof newTabIndex));

    // The 'tabs' object can be passed in either as an array or as a set of key-value
    // pairs. For simplicity, we'll process it internally as an array, so convert as
    // needed.
    if (!Array.isArray(tabs)) {
        tabs = Object.entries(tabs).map(e=>({label: e[0], options: e[1]}));
    }

    const tabButtonHeight = 20;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get tabIndex() { return tabIndex },
        Form() {    
            const tabButtons = tabs.reduce((list, tab, idx)=>{
                const isFirstTab = (idx === 0);
                const isActiveTab = (idx === tabIndex);
                const labelWidth = (w95.font.stringWidth(tab.label) + 13);
                list.buttons.push(
                    w95.widget.button({
                        x: (list.x - (isActiveTab? 2 : 0)),
                        y: (isActiveTab? 0 : 2),
                        width: labelWidth + (isActiveTab? 4 : 0),
                        height: tabButtonHeight + (isActiveTab? 2 : 0),
                        text: tab.label,
                        isDisabled: ((isDisabled || tab.options.isDisabled) && (idx !== tabIndex)),
                        shape: w95.buttonShape.tabControl,
                        styleHints: [
                            (isFirstTab? w95.styleHint.first : w95.styleHint.void),
                        ],
                        onMouseDown() {
                            if (tabIndex !== idx) {
                                newTabIndex?.(idx);
                            }
                        },
                    })
                );
                list.x += labelWidth;
                return list;
            }, {x: 2, buttons: []}).buttons;

            const activeTabIdxButton = tabButtons.splice(tabIndex, 1)[0];

            const tabContents = tabs.map((tab, idx)=>{
                return w95.widget.frame({
                    x: 2,
                    y: 2,
                    width: (width - 4),
                    height: (height - tabButtonHeight - 4),
                    shape: w95.frameShape.none,
                    children: tab.options.children,
                }, {
                    hideIf: (idx !== tabIndex),
                });
            });

            return [
                ...tabButtons,
                w95.widget.frame({
                    x: 0,
                    y: tabButtonHeight,
                    width,
                    height: (height - tabButtonHeight),
                    shape: w95.frameShape.widget,
                    children: [
                        ...tabContents,
                    ],
                }),
                activeTabIdxButton,
            ];
        },
    };
});


/***/ }),

/***/ "./src/widgets/textEdit.js":
/*!*********************************!*\
  !*** ./src/widgets/textEdit.js ***!
  \*********************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("textEdit", function({
    x = 0,
    y = 0,
    text = "Text edit",
    font = w95.font.courier[8],
    width = 200,
    height = 100,
    isEditable = false,
    isDisabled = false,
    autofocus = false,
    styleHints = [],
    highlighter = undefined,
    newText = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof isEditable === "boolean");
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "function"].includes(typeof highlighter));
    w95.debug?.assert(["undefined", "function"].includes(typeof newText));

    // This widget doesn't support rich text, so let's strip away any formatting
    // characters that w95.widget.label uses (e.g. "\b" for bold text).
    text = text.replace(/(?![\n])[\x00-\x1f]/g, "");

    const displayText = (highlighter?.(text) || text);
    const fontVariant = (styleHints.includes(w95.styleHint.bold)? font.bold : font.regular);

    const cursorPos = w95.state(0, ()=>showCursor.set(true));
    const showCursor = w95.state(true);
    const hasFocus = w95.state(false);

    const lines = text.split("\n");
    const cursorPos2d = {};
    cursorPos2d.x = text.slice(0, cursorPos.now).split("\n").at(-1).length;
    cursorPos2d.y = (text.slice(0, cursorPos.now).split("\n").length - 1);
    cursorPos2d.globalX = (1 + w95.font.stringWidth(lines[cursorPos2d.y].slice(0, cursorPos2d.x), font));
    cursorPos2d.globalY = (1 + (cursorPos2d.y * fontVariant.lineHeight));
    
    let cursorBlinkTimeout;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get hasFocus() { return hasFocus.now },
        get autofocus() { return autofocus },
        Mounted() {
            cursorBlinkTimeout = setTimeout(()=>{
                if (hasFocus.now) {
                    showCursor.set(!showCursor.now)
                }
            }, 500);
        },
        BeforeUnmount() {
            clearTimeout(cursorBlinkTimeout);
        },
        Form() {
            return w95.widget.scrollArea({
                cursor: w95.cursor.text,
                width,
                height,
                frameShape: w95.frameShape.input,
                backgroundColor: (
                    isDisabled
                        ? w95.palette.window.background
                        : w95.palette.named.white
                ),
                children: [
                    w95.widget.label({
                        x: 2,
                        text: displayText,
                        font,
                        color: (
                            isDisabled
                                ? w95.palette.widget.disabled1
                                : w95.palette.widget.foreground
                        ),
                    }),

                    // Text cursor.
                    Rngon.ngon([
                        Rngon.vertex(cursorPos2d.globalX, cursorPos2d.globalY),
                        Rngon.vertex(cursorPos2d.globalX, (cursorPos2d.globalY + fontVariant.lineHeight - 1)),
                    ], {
                        color: (
                            (showCursor.now && hasFocus.now)
                                ? w95.palette.widget.foreground
                                : w95.palette.named.transparent
                        ),
                    }),
                ],
                onMouseDown: ({at})=>{
                    if (isDisabled) {
                        return;
                    }
    
                    const y = Math.min(~~(at.y / fontVariant.lineHeight), (lines.length - 1));
                    const clickedLine = lines[y];
                    const x = clickedLine.split("").findIndex((ch, idx)=>{
                        const chCode = ch.charCodeAt(0);
                        const chWidth = ((chCode === 32)? fontVariant.spaceWidth : (fontVariant[chCode]?.width || 0));
                        return (w95.font.stringWidth(clickedLine.substring(0, idx), font) > ~~(at.x - (chWidth / 2)));
                    });

                    const clampedX = ((x < 0)? clickedLine.length : x);
                    const startOfClickedLine = lines.slice(0, y).reduce((len, line)=>(len + line.length + 1), 0);

                    cursorPos.set(startOfClickedLine + clampedX);
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
        },
        Event: {
            keypress(event) {
                w95.debug?.assert(event instanceof KeyboardEvent);
                w95.debug?.assert(typeof event.key === "string");

                let updatedText = text;

                if (event.key.length !== 1) {
                    return;
                }

                updatedText = (updatedText.slice(0, cursorPos.now) + event.key + updatedText.slice(cursorPos.now));
                cursorPos.set(cursorPos.now + 1);

                if (text !== updatedText) {
                    text = updatedText;
                    newText?.(text, this);
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

                if (event.key == "Backspace") {
                    if (cursorPos.now) {
                        updatedText = (updatedText.slice(0, (cursorPos.now - 1)) + updatedText.slice(cursorPos.now));
                        cursorPos.set(cursorPos.now - 1);
                    }
                }
                else if (event.key == "Delete") {
                    if (cursorPos.now < text.length) {
                        updatedText = (updatedText.slice(0, cursorPos.now) + updatedText.slice(cursorPos.now + 1));
                    }
                }
                else if (event.key == "Escape") {
                    this.Message.blur();
                }
                else if (["Enter", "Return"].includes(event.key)) {
                    updatedText = (updatedText.slice(0, cursorPos.now) + "\n" + updatedText.slice(cursorPos.now));
                    cursorPos.set(cursorPos.now + 1);
                }
                else if (event.key == "ArrowLeft") {
                    cursorPos.set(Math.max(0, (cursorPos.now - 1)));
                }
                else if (event.key == "ArrowRight") {
                    cursorPos.set(Math.min(text.length, (cursorPos.now + 1)));
                }
                else if (event.key == "ArrowUp") {
                    if (cursorPos2d.y === 0) {
                        cursorPos.set(0);
                    }
                    else {
                        const toPrevLineStart = lines.slice(0, (cursorPos2d.y - 1)).reduce((len, line)=>(len + line.length + 1), 0);
                        cursorPos.set(toPrevLineStart + Math.min(cursorPos2d.x, lines[cursorPos2d.y - 1].length));
                    }
                }
                else if (event.key == "ArrowDown") {
                    if (cursorPos2d.y === (lines.length - 1)) {
                        cursorPos.set(text.length);
                    }
                    else {
                        const toNextLineStart = lines.slice(0, (cursorPos2d.y + 1)).reduce((len, line)=>(len + line.length + 1), 0);
                        cursorPos.set(toNextLineStart + Math.min(cursorPos2d.x, lines[cursorPos2d.y + 1].length));
                    }
                }

                if (text !== updatedText) {
                    text = updatedText;
                    newText?.(text);
                }

                return;
            }
        },
    };
});


/***/ }),

/***/ "./src/widgets/time.js":
/*!*****************************!*\
  !*** ./src/widgets/time.js ***!
  \*****************************/
/***/ (() => {

/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("time", function({
    x = 0,
    y = 0,
    width = 200,
    height = w95.font.regular.lineHeight,
    showSeconds = false,
    isDisabled = false,
    styleHints = [],
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(["undefined", "number"].includes(typeof width));
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof showSeconds === "boolean");
    w95.debug?.assert(Array.isArray(styleHints));

    const timeString = w95.state(time_string(w95.clock.now));
    const clockTickCallback = w95.state((newTime)=>timeString.set(time_string(newTime)));

    width = (width || w95.font.stringWidth(timeString));

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Mounted() {
            w95.clock.listen(clockTickCallback.now);
        },
        BeforeUnmount() {
            w95.clock.unlisten(clockTickCallback.now);
        },
        Form() {
            return w95.widget.label({
                text: timeString.now,
                width,
                height,
                styleHints,
                isDisabled,
            });
        }
    };

    function time_string(timestamp) {
        return timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: (showSeconds? "2-digit" : undefined),
        }).replace(/^0/, "");
    }
});

/***/ }),

/***/ "./src/widgets/titleBar.js":
/*!*********************************!*\
  !*** ./src/widgets/titleBar.js ***!
  \*********************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("titleBar", function({
    x = 0,
    y = 0,
    width = 200,
    height = 18,
    title = "Title bar",
    icon = w95.icon.applicationIcon16x16,
    styleHints = [],
    isBlurred = false,
    onClose = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof isBlurred === "boolean");
    w95.debug?.assert(typeof icon === "object");
    w95.debug?.assert(typeof title === "string");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "function"].includes(typeof onClose));

    const parentWidget = w95.state(undefined, w95.noEffect);

    const isDialog = styleHints.includes(w95.styleHint.dialog);

    if (isDialog) {
        icon = undefined;
    }
    
    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get title() { return title },
        Form() {
            return [
                // Background.
                w95.widget.panel({
                    width,
                    height,
                    color: (
                        isBlurred
                            ? w95.palette.window.titleBar.inactiveBackground
                            : w95.palette.window.titleBar.background
                    ),
                }),
    
                // App icon.
                w95.widget.bitmap({
                    x: 2,
                    y: 1,
                    image: icon,
                }, {hideIf: (!icon || isDialog),}),
    
                // Title.
                w95.widget.label({
                    x: (icon? (5 + icon.width) : 3),
                    y: 0,
                    width: (width - (icon? (5 + icon.width) : 3)) - (isDialog? 22 : 56),
                    height,
                    text: title,
                    elide: true,
                    color: isBlurred
                        ? w95.palette.window.titleBar.inactiveForeground
                        : w95.palette.window.titleBar.foreground,
                    styleHints: [
                        w95.styleHint.bold,
                        w95.styleHint.alignVCenter,
                        w95.styleHint.noDisable,
                    ],
                }, {hideIf: !title.length}),
    
                // Close.
                w95.widget.button({
                    x: (width - 17 - 1),
                    y: 2,
                    width: 16,
                    height: 14,
                    icon: w95.icon.titleBarClose,
                    isDisabled: !onClose,
                    onClick: onClose,
                }),
    
                // Maximize.
                w95.widget.button({
                    x: (width - 17 - 19),
                    y: 2,
                    width: 16,
                    height: 14,
                    isDisabled: true, // Maximizing windows hasn't been implemented yet.
                    icon: w95.icon.titleBarMaximize,
                    onClick: maximize_parent,
                }, {hideIf: isDialog}),
                
                // Minimize.
                w95.widget.button({
                    x: (width - 17 - 35),
                    y: 2,
                    width: 16,
                    height: 14,
                    isDisabled: true, // Minimizing windows hasn't been implemented yet.
                    icon: w95.icon.titleBarMinimize,
                }, {hideIf: isDialog}),

                w95.widget.frame({
                    $name: "_grabber",
                    x: (icon? (5 + icon.width) : 3),
                    y: 0,
                    width: (width - (icon? (5 + icon.width) : 3)) - (isDialog? 22 : 56),
                    height,
                    isGrabbable: true,
                    shape: w95.frameShape.none,
                    backgroundColor: w95.palette.named.transparent,
                    onMouseMove({event, isGrabbed}) {
                        if (!isGrabbed) {
                            return;
                        }
        
                        w95.debug?.assert(typeof event === "object");
                        w95.debug?.assert(typeof event.movementX === "number");
                        w95.debug?.assert(typeof event.movementY === "number");
                        w95.debug?.assert(parentWidget.now._what === "w95-widget");
                        w95.debug?.assert(["window", "dialog"].includes(parentWidget.now._type));
        
                        parentWidget.now.Message?.move?.(
                            (event.movementX / w95.shell.display.scale),
                            (event.movementY / w95.shell.display.scale),
                        );

                        return true;
                    },
                    onDoubleClick: maximize_parent,
                }),
            ];
        },
        Message: {
            setParent(widget) {
                w95.debug?.assert(widget?._what === "w95-widget");
                w95.debug?.assert(["window", "dialog"].includes(widget?._type));
                parentWidget.set(widget);
            },
        },
    };

    function maximize_parent() {
        w95.debug?.assert(parentWidget.now._what === "w95-widget");
        parentWidget.now.Message?.maximize?.();
    }
});


/***/ }),

/***/ "./src/widgets/verticalLayout.js":
/*!***************************************!*\
  !*** ./src/widgets/verticalLayout.js ***!
  \***************************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("verticalLayout", function({
    x = 0,
    y = 0,
    width = undefined,
    height = 100,
    padding = 3,
    styleHints = [],
    children = [],
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(Array.isArray(children));

    const adjustedX = w95.state(x);
    const adjustedY = w95.state(y);
    const adjustedWidth = w95.state(width || 0);
    const adjustedHeight = w95.state(height, w95.noEffect);
    
    return {
        get x() { return adjustedX.now },
        get y() { return adjustedY.now },
        get width() { return adjustedWidth.now },
        get height() { return adjustedHeight.now },
        Mounted() {
            const wrappers = this.$childWidgets.filter(w=>!w.$childWidgets[0]._hideMesh);
            
            if (!width) {
                const maxChildWidth = wrappers.map(w=>w.$childWidgets[0]).reduce((max, w)=>Math.max(max, (w.x + w.width)), 0);
                adjustedWidth.set(maxChildWidth);
            }

            // Vertical alignment.
            {
                const contentHeight = wrappers.reduce((height, wrapper)=>{
                    const widget = wrapper.$childWidgets[0];
                    return (height + widget.height + ((widget._type === "layoutSpacer")? 0 : padding));
                }, (-padding * !!children.filter(w=>(w._type !== "layoutSpacer")).length));

                if (styleHints.includes(w95.styleHint.alignVCenter)) {
                    adjustedY.set(y + ~~((height - contentHeight) / 2));
                }
                else {
                    if (styleHints.includes(w95.styleHint.alignBottom)) {
                        adjustedY.set(y + height - contentHeight);
                    }

                    adjustedHeight.set(contentHeight);
                }
            }

            // Horizontal alignment.
            {
                if (styleHints.includes(w95.styleHint.alignRight)) {
                    adjustedX.set(x - adjustedWidth.now);
                }

                let runningHeight = 0;
                
                for (const wrapper of wrappers) {
                    const widget = wrapper.$childWidgets[0];

                    if (widget._type !== "layoutSpacer") {
                        wrapper.Message.resize(widget.width, widget.height);

                        if (styleHints.includes(w95.styleHint.alignRight)) {
                            wrapper.Message.move((adjustedWidth.now - widget.width), runningHeight);
                        }
                        else if (styleHints.includes(w95.styleHint.alignLeft)) {
                            wrapper.Message.move(0, runningHeight);
                        }
                        else if (styleHints.includes(w95.styleHint.alignHCenter)) {
                            wrapper.Message.move(~~((adjustedWidth.now - widget.width) / 2), runningHeight);
                        }
                        else {
                            wrapper.Message.move(0, runningHeight);
                        }
                    }

                    runningHeight += (widget.height + ((widget.height && (widget._type !== "layoutSpacer"))? padding : 0));
                }
            }
        },
        Form() {
            return children.map(c=>(
                w95.widget.dynamicWrapper({
                    widget: c,
                })
            ));
        },
    };
});


/***/ }),

/***/ "./src/widgets/window.js":
/*!*******************************!*\
  !*** ./src/widgets/window.js ***!
  \*******************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("window", function({
    parent = undefined,
    title = "",
    backgroundColor = w95.palette.window.background,
    icon = w95.icon.applicationIcon16x16,
    isBlurred = true,
    styleHints = [],
    children = [],
    onMouseEnter = undefined,
    onMouseLeave = undefined,
    onMouseUp = undefined,
    onMouseDown = undefined,
    onMouseMove = undefined,
    onKeyUp = undefined,
    onKeyDown = undefined,
    onFocus = undefined,
    resize = undefined,
    move = undefined,
    maximize = undefined,
    close = undefined,
} = {})
{
    w95.debug?.assert(parent?._type === "App");
    w95.debug?.assert(typeof title === "string");
    w95.debug?.assert(typeof icon === "object");
    w95.debug?.assert(typeof isBlurred === "boolean");
    w95.debug?.assert(typeof backgroundColor === "object");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(Array.isArray(children));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseMove));
    w95.debug?.assert(["undefined", "function"].includes(typeof onKeyUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onKeyDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onFocus));
    w95.debug?.assert(["undefined", "function"].includes(typeof resize));
    w95.debug?.assert(["undefined", "function"].includes(typeof move));
    w95.debug?.assert(["undefined", "function"].includes(typeof maximize));
    w95.debug?.assert(["undefined", "function"].includes(typeof close));

    const width = parent.width;
    const height = parent.height;

    isBlurred = w95.state(isBlurred);

    if (styleHints.includes(w95.styleHint.desktop)) {
        styleHints.push(w95.styleHint.plain, w95.styleHint.noBorder);
    }

    const isPlain = styleHints.includes(w95.styleHint.plain);
    const isDesktop = styleHints.includes(w95.styleHint.desktop);
    const hasNoBorder = styleHints.includes(w95.styleHint.noBorder);
    const isResizable = (typeof resize === "function");
    let menuBarWidget = undefined;

    return {
        get x() { return 0 },
        get y() { return 0 },
        get width() { return width },
        get height() { return height },
        get menuBar() { return menuBarWidget },
        get isBlurred() { return isBlurred.now },
        get isDesktop() { return isDesktop },
        get isGrabbed() { return this.$form["_titleBar"].$form["_grabber"].isGrabbed },
        get isBorderGrabbed() { return this.$form["_border"].isBorderGrabbed; },
        get title() { return title },
        get icon() { return icon },
        Mounted() {
            const windowContents = this.$form["_contents"].$childWidgets;
            const menuBarIdx = windowContents.findIndex(widget=>widget._type === "menuBar");
            menuBarWidget = windowContents[menuBarIdx];

            this.$form["_titleBar"].Message.setParent(this);
            this.$form["_border"].Message.setParent(this);
        },
        Form() {
            return [
                // Background.
                w95.widget.panel({
                    width: width,
                    height: height,
                    color: backgroundColor,
                }, {hideIf: backgroundColor === w95.palette.named.transparent}),
    
                // Container for the window's custom contents.
                w95.widget.frame({
                    $name: "_contents",
                    x: (3 + isResizable), // Width of the window border.
                    y: (isPlain? 0 : (22 + isResizable)), // Height of the window decorations.
                    width: (width - 6 - (2 * isResizable)),
                    height: (height - (isPlain? 0 : 27)),
                    styleHints: [
                        w95.styleHint.noBorder,
                    ],
                    children,
                }),
    
                w95.widget.titleBar({
                    $name: "_titleBar",
                    x: (3 + isResizable),
                    y: (3 + isResizable),
                    width: (width - 6 - (2 * isResizable)),
                    height: 18,
                    isBlurred: isBlurred.now,
                    title,
                    icon,
                    onClose: (close? ()=>close.call(this) : undefined),
                }, {hideIf: isPlain}),
    
                w95.widget.frame({
                    $name: "_border",
                    width,
                    height,
                    isResizable,
                    shape: (
                        isResizable
                            ? w95.frameShape.resizableWindow
                            : w95.frameShape.dialog
                    ),
                }, {hideIf: hasNoBorder}),
            ];
        },
        Message: {
            resize(deltaWidth = 0, deltaHeight = 0) {
                w95.debug?.assert(["number", "undefined"].includes(typeof deltaWidth));
                w95.debug?.assert(["number", "undefined"].includes(typeof deltaHeight));
                resize?.call(this, deltaWidth, deltaHeight);
            },
            move(deltaX = 0, deltaY = 0) {
                w95.debug?.assert(typeof deltaX === "number");
                w95.debug?.assert(typeof deltaY === "number");
                move?.call(this, deltaX, deltaY);
            },
            maximize() {
                maximize?.call(this);
            },
            blur() {
                isBlurred.set(true);
                w95.$recurseDescendantWidgets(this, (widget)=>{widget.Message?.blur?.()});
            },
            focus() {
                if (isBlurred.now) {
                    w95.$recurseDescendantWidgets(this, (widget)=>{widget.Message?.parentWindowRaised?.()});
                }
                isBlurred.set(false);
                onFocus?.();
            }
        },
        Event: {
            mousedown({at}) {
                return onMouseDown?.({at, widget:this});
            },
            mouseup({at}) {
                return onMouseUp?.({at, widget:this});
            },
            mousemove({at}) {
                return onMouseMove?.({at, widget:this});
            },
            keyup(event) {
                return onKeyUp?.({event, widget:this});
            },
            keydown(event) {
                return onKeyDown?.({event, widget:this});
            },
        },
    };
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/widgets.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _widgets_button_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./widgets/button.js */ "./src/widgets/button.js");
/* harmony import */ var _widgets_button_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_widgets_button_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _widgets_bitmap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widgets/bitmap.js */ "./src/widgets/bitmap.js");
/* harmony import */ var _widgets_bitmap_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_widgets_bitmap_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_panel_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./widgets/panel.js */ "./src/widgets/panel.js");
/* harmony import */ var _widgets_panel_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_widgets_panel_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_window_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./widgets/window.js */ "./src/widgets/window.js");
/* harmony import */ var _widgets_window_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_widgets_window_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _widgets_frame_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./widgets/frame.js */ "./src/widgets/frame.js");
/* harmony import */ var _widgets_frame_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_widgets_frame_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _widgets_label_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./widgets/label.js */ "./src/widgets/label.js");
/* harmony import */ var _widgets_label_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_widgets_label_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _widgets_titleBar_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./widgets/titleBar.js */ "./src/widgets/titleBar.js");
/* harmony import */ var _widgets_titleBar_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_widgets_titleBar_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _widgets_lineEdit_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./widgets/lineEdit.js */ "./src/widgets/lineEdit.js");
/* harmony import */ var _widgets_lineEdit_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_widgets_lineEdit_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _widgets_textEdit_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./widgets/textEdit.js */ "./src/widgets/textEdit.js");
/* harmony import */ var _widgets_textEdit_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_widgets_textEdit_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _widgets_horizontalRule_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./widgets/horizontalRule.js */ "./src/widgets/horizontalRule.js");
/* harmony import */ var _widgets_horizontalRule_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_widgets_horizontalRule_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _widgets_menu_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./widgets/menu.js */ "./src/widgets/menu.js");
/* harmony import */ var _widgets_menu_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_widgets_menu_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _widgets_menuItem_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./widgets/menuItem.js */ "./src/widgets/menuItem.js");
/* harmony import */ var _widgets_menuItem_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_widgets_menuItem_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _widgets_menuSeparator_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./widgets/menuSeparator.js */ "./src/widgets/menuSeparator.js");
/* harmony import */ var _widgets_menuSeparator_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_widgets_menuSeparator_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _widgets_menuBar_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./widgets/menuBar.js */ "./src/widgets/menuBar.js");
/* harmony import */ var _widgets_menuBar_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_widgets_menuBar_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _widgets_dropdownBox_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./widgets/dropdownBox.js */ "./src/widgets/dropdownBox.js");
/* harmony import */ var _widgets_dropdownBox_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_widgets_dropdownBox_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _widgets_dropdownBoxItem_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./widgets/dropdownBoxItem.js */ "./src/widgets/dropdownBoxItem.js");
/* harmony import */ var _widgets_dropdownBoxItem_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_widgets_dropdownBoxItem_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _widgets_dropdownBoxList_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./widgets/dropdownBoxList.js */ "./src/widgets/dropdownBoxList.js");
/* harmony import */ var _widgets_dropdownBoxList_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_widgets_dropdownBoxList_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _widgets_progressBar_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./widgets/progressBar.js */ "./src/widgets/progressBar.js");
/* harmony import */ var _widgets_progressBar_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_widgets_progressBar_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _widgets_renderSurface_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./widgets/renderSurface.js */ "./src/widgets/renderSurface.js");
/* harmony import */ var _widgets_renderSurface_js__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_widgets_renderSurface_js__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _widgets_desktopIcon_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./widgets/desktopIcon.js */ "./src/widgets/desktopIcon.js");
/* harmony import */ var _widgets_desktopIcon_js__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_widgets_desktopIcon_js__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _widgets_domElement_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./widgets/domElement.js */ "./src/widgets/domElement.js");
/* harmony import */ var _widgets_domElement_js__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(_widgets_domElement_js__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var _widgets_groupBox_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./widgets/groupBox.js */ "./src/widgets/groupBox.js");
/* harmony import */ var _widgets_groupBox_js__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(_widgets_groupBox_js__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var _widgets_checkbox_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./widgets/checkbox.js */ "./src/widgets/checkbox.js");
/* harmony import */ var _widgets_checkbox_js__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(_widgets_checkbox_js__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _widgets_tabControl_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./widgets/tabControl.js */ "./src/widgets/tabControl.js");
/* harmony import */ var _widgets_tabControl_js__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/__webpack_require__.n(_widgets_tabControl_js__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */ var _widgets_stackedWidget_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./widgets/stackedWidget.js */ "./src/widgets/stackedWidget.js");
/* harmony import */ var _widgets_stackedWidget_js__WEBPACK_IMPORTED_MODULE_24___default = /*#__PURE__*/__webpack_require__.n(_widgets_stackedWidget_js__WEBPACK_IMPORTED_MODULE_24__);
/* harmony import */ var _widgets_scrollArea_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./widgets/scrollArea.js */ "./src/widgets/scrollArea.js");
/* harmony import */ var _widgets_scrollArea_js__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(_widgets_scrollArea_js__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var _widgets_radioGroup_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./widgets/radioGroup.js */ "./src/widgets/radioGroup.js");
/* harmony import */ var _widgets_radioGroup_js__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(_widgets_radioGroup_js__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var _widgets_radioGroupItem_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./widgets/radioGroupItem.js */ "./src/widgets/radioGroupItem.js");
/* harmony import */ var _widgets_radioGroupItem_js__WEBPACK_IMPORTED_MODULE_27___default = /*#__PURE__*/__webpack_require__.n(_widgets_radioGroupItem_js__WEBPACK_IMPORTED_MODULE_27__);
/* harmony import */ var _widgets_horizontalSlider_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./widgets/horizontalSlider.js */ "./src/widgets/horizontalSlider.js");
/* harmony import */ var _widgets_horizontalSlider_js__WEBPACK_IMPORTED_MODULE_28___default = /*#__PURE__*/__webpack_require__.n(_widgets_horizontalSlider_js__WEBPACK_IMPORTED_MODULE_28__);
/* harmony import */ var _widgets_dialog_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./widgets/dialog.js */ "./src/widgets/dialog.js");
/* harmony import */ var _widgets_dialog_js__WEBPACK_IMPORTED_MODULE_29___default = /*#__PURE__*/__webpack_require__.n(_widgets_dialog_js__WEBPACK_IMPORTED_MODULE_29__);
/* harmony import */ var _widgets_horizontalLayout_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./widgets/horizontalLayout.js */ "./src/widgets/horizontalLayout.js");
/* harmony import */ var _widgets_horizontalLayout_js__WEBPACK_IMPORTED_MODULE_30___default = /*#__PURE__*/__webpack_require__.n(_widgets_horizontalLayout_js__WEBPACK_IMPORTED_MODULE_30__);
/* harmony import */ var _widgets_verticalLayout_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./widgets/verticalLayout.js */ "./src/widgets/verticalLayout.js");
/* harmony import */ var _widgets_verticalLayout_js__WEBPACK_IMPORTED_MODULE_31___default = /*#__PURE__*/__webpack_require__.n(_widgets_verticalLayout_js__WEBPACK_IMPORTED_MODULE_31__);
/* harmony import */ var _widgets_dynamicWrapper_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./widgets/dynamicWrapper.js */ "./src/widgets/dynamicWrapper.js");
/* harmony import */ var _widgets_dynamicWrapper_js__WEBPACK_IMPORTED_MODULE_32___default = /*#__PURE__*/__webpack_require__.n(_widgets_dynamicWrapper_js__WEBPACK_IMPORTED_MODULE_32__);
/* harmony import */ var _widgets_layoutSpacer_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./widgets/layoutSpacer.js */ "./src/widgets/layoutSpacer.js");
/* harmony import */ var _widgets_layoutSpacer_js__WEBPACK_IMPORTED_MODULE_33___default = /*#__PURE__*/__webpack_require__.n(_widgets_layoutSpacer_js__WEBPACK_IMPORTED_MODULE_33__);
/* harmony import */ var _widgets_time_js__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./widgets/time.js */ "./src/widgets/time.js");
/* harmony import */ var _widgets_time_js__WEBPACK_IMPORTED_MODULE_34___default = /*#__PURE__*/__webpack_require__.n(_widgets_time_js__WEBPACK_IMPORTED_MODULE_34__);




































})();

var __webpack_export_target__ = self;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;