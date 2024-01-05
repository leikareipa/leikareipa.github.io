/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api/widgets/bitmap/widget.js":
/*!******************************************!*\
  !*** ./src/api/widgets/bitmap/widget.js ***!
  \******************************************/
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
    image = Rngon.texture(),
    width = (image?.width || 0),
    height = (image?.height || 0),
    isDisabled = false,
    styleHints = [],
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
    w95.debug?.assert(Array.isArray(styleHints));
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
        Form() {
            if (!image) {
                return [];
            }
            return [
                Rngon.ngon([
                    Rngon.vertex(0, 0),
                    Rngon.vertex(width, 0),
                    Rngon.vertex(width, height),
                    Rngon.vertex(0, height),
                ], {
                    texture: image,
                    color: (
                        styleHints.includes(w95.styleHint.focused)
                            ? Rngon.color(128, 128, 255)
                            : w95.palette.named.white
                    ),
                    allowAlphaReject: true,
                    invertedColor: styleHints.includes(w95.styleHint.inverted),
                    grayscale: isDisabled,
                    blit: true,
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

/***/ "./src/api/widgets/button/widget.js":
/*!******************************************!*\
  !*** ./src/api/widgets/button/widget.js ***!
  \******************************************/
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
    width = 100,
    height = 22,
    text = "",
    icon = undefined,
    color = w95.palette.widget.foreground,
    backgroundColor = w95.palette.widget.background,
    isDisabled = false,
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
    const isVisuallyPressed = (
        styleHints.includes(w95.styleHint.lowered) ||
        (
            isPressed.now &&
            isHovered.now &&
            !isDisabled &&
            !styleHints.includes(w95.styleHint.raised) &&
            (shape !== w95.buttonShape.tabControl)
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
                w95.widget.panel({
                    width,
                    height,
                    color: backgroundColor,
                }),
                
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
                    children: (
                        styleHints.includes(w95.styleHint.vertical)
                            ? [
                                w95.widget.label({
                                    x: ~~isVisuallyPressed,
                                    y: ~~((icon? ((height / 2) - (w95.font.regular.lineHeight / 2) + (icon.height / 2) + 1) : 0) + ~~isVisuallyPressed),
                                    width,
                                    height,
                                    text,
                                    color,
                                    isDisabled,
                                    styleHints: [
                                        w95.styleHint.action,
                                        w95.styleHint.alignHCenter,
                                        styleHints.includes(w95.styleHint.bold)? w95.styleHint.bold : 0,
                                    ],
                                }, {
                                    hideIf: !text.length,
                                }),
    
                                w95.widget.bitmap({
                                    x: ~~((icon? ((width / 2) - (icon.width / 2)) : 0) + ~~isVisuallyPressed),
                                    y: ~~((icon? ((height / 2) - (icon.height / 2) - (w95.font.regular.lineHeight / 2)) : 0) + ~~isVisuallyPressed),
                                    image: icon,
                                    styleHints,
                                }, {
                                    hideIf: !icon,
                                }),
                            ]
                            : [
                                w95.widget.label({
                                    x: ~~((icon? (icon.width + iconSpacing) : 0) + ~~(isVisuallyPressed || styleHints.includes(w95.styleHint.lowered))),
                                    y: ~~(isVisuallyPressed || styleHints.includes(w95.styleHint.lowered)),
                                    width: (width - (icon? (icon.width + iconSpacing) : 0)),
                                    height: height,
                                    text,
                                    color,
                                    isDisabled,
                                    styleHints: [
                                        w95.styleHint.action,
                                        w95.styleHint.alignHCenter,
                                        w95.styleHint.alignVCenter,
                                        styleHints.includes(w95.styleHint.bold)? w95.styleHint.bold : 0,
                                    ],
                                }, {
                                    hideIf: !text.length,
                                }),
    
                                w95.widget.bitmap({
                                    x: ~~((text? iconSpacing : icon? ((width / 2) - (icon.width / 2)) : 0) + ~~isVisuallyPressed),
                                    y: ~~((icon? ((height / 2) - (icon.height / 2)) : 0) + ~~isVisuallyPressed),
                                    image: icon,
                                }, {
                                    hideIf: !icon,
                                }),
                            ]
                    ),
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
                    return;
                }
                
                isPressed.set(false);
                const retval = onMouseUp?.({at, widget:this});
                (!isHovered.now || onClick?.({at, widget:this}));
                return (retval ?? true);
            } 
        },
    };
});


/***/ }),

/***/ "./src/api/widgets/checkbox/widget.js":
/*!********************************************!*\
  !*** ./src/api/widgets/checkbox/widget.js ***!
  \********************************************/
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
    label = "",
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
                        }, {
                            hideIf: !isChecked
                        }),
                    ],
                }),
                w95.widget.label({
                    x: (checkBoxSideLen + labelSpacing),
                    y: 0,
                    width: (label.length? w95.font.stringWidth(label) : 0),
                    height: height,
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

/***/ "./src/api/widgets/desktop-icon/widget.js":
/*!************************************************!*\
  !*** ./src/api/widgets/desktop-icon/widget.js ***!
  \************************************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("desktopIcon", function({
    x = 0,
    y = 0,
    width = 60,
    height = 60,
    text = "",
    icon = undefined,
    onActivate = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(["undefined", "object"].includes(typeof icon));
    w95.debug?.assert(["undefined", "function"].includes(typeof onActivate));

    const hasFocus = w95.state(false);

    const iconWidth = 32;
    const iconHeight = 32;
    const labelWidth = (w95.font.stringWidth(text) + 2);
    const labelHeight = w95.font.regular.lineHeight;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Form() {
            return [
                w95.widget.label({
                    x: ((width / 2) - (labelWidth / 2)),
                    y: (height - labelHeight * 1.75),
                    width: labelWidth,
                    height: labelHeight,
                    text,
                    color: w95.palette.named.white,
                    backgroundColor: (
                        hasFocus.now
                            ? w95.palette.named.darkBlue
                            : w95.palette.named.teal
                    ),
                    styleHints: [
                        w95.styleHint.alignHCenter,
                    ],
                }),
                w95.widget.bitmap({
                    x: ((width / 2) - (iconWidth / 2)),
                    y: 0,
                    image: icon,
                    width: iconWidth,
                    height: iconHeight,
                    styleHints: [
                        (hasFocus.now? w95.styleHint.focused : w95.styleHint.void),
                    ],
                }),
            ];
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

/***/ "./src/api/widgets/dialog/widget.js":
/*!******************************************!*\
  !*** ./src/api/widgets/dialog/widget.js ***!
  \******************************************/
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
    width = 250,
    height = 150,
    title = "",
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

    const isBlurred = w95.state(false);

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
            moveBy(deltaX = 0, deltaY = 0) {
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

/***/ "./src/api/widgets/dom-element/widget.js":
/*!***********************************************!*\
  !*** ./src/api/widgets/dom-element/widget.js ***!
  \***********************************************/
/***/ (() => {

/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

// NOTE: This component is known to be broken since widget rasterization
// was moved to using multiple canvases. It needs fixing.
w95.widget("domElement", function({
    x = 0,
    y = 0,
    width = undefined,
    height = undefined,
    element = undefined,
    addToDom = true,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(["undefined", "number"].includes(typeof width));
    w95.debug?.assert(["undefined", "number"].includes(typeof height));
    w95.debug?.assert(typeof addToDom === "boolean");
    w95.debug?.assert(element instanceof HTMLElement);

    if (addToDom && !document.body.contains(element)) {
        document.body.prepend(element);
    }

    element.classList.add("w95-dom-element");

    if (!width || !height) {
        const elRect = element.getBoundingClientRect();
        width = (width || (elRect.width / w95.shell.display.scale));
        height = (height || (elRect.height / w95.shell.display.scale));

        w95.debug?.assert(typeof width === "number");
        w95.debug?.assert(typeof height === "number");
        w95.debug?.assert(width > 0);
        w95.debug?.assert(height > 0);
    }

    function relay_event_to_dom({event}) {
        element.dispatchEvent(new event.constructor(event.type, event));
    }
    
    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get dom() { return element },
        Event: {
            mousemove: relay_event_to_dom,
            mouseup: relay_event_to_dom,
            mousedown: relay_event_to_dom,
            mouseenter() {
                if (!w95.windowManager.root_widget(this).isBlurred && !w95.windowManager.isPopupMenuActive) {
                    w95.shell.display.canvas.style.pointerEvents = "none";
                }
            }
        },
        Message: {
            parentWindowRaised() {
                // Raise this widget's DOM element.
                {
                    const allDomEls = w95.shell.display.domElements;

                    const minZ = Math.min(...allDomEls.map(e=>e.style.zIndex)); 
                    for (const el of allDomEls) {
                        el.style.zIndex -= minZ;
                    }

                    const maxZ = Math.max(...allDomEls.map(e=>e.style.zIndex));
                    element.style.zIndex = (1 + maxZ);
                }
            }
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
    };
});


/***/ }),

/***/ "./src/api/widgets/dropdown-box/dropdown-box-item/widget.js":
/*!******************************************************************!*\
  !*** ./src/api/widgets/dropdown-box/dropdown-box-item/widget.js ***!
  \******************************************************************/
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
                    color: w95.palette.named.darkBlue,
                }),
            ];
        }

        return [];
    }
});


/***/ }),

/***/ "./src/api/widgets/dropdown-box/dropdown-box-list/widget.js":
/*!******************************************************************!*\
  !*** ./src/api/widgets/dropdown-box/dropdown-box-list/widget.js ***!
  \******************************************************************/
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
    items = {},
    itemIndex = 0,
    newItemIndex = undefined,
    onCloseRequested = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof isOpen === "boolean");
    w95.debug?.assert(typeof items === "object");
    w95.debug?.assert(typeof itemIndex === "number");
    w95.debug?.assert(["undefined", "function"].includes(typeof onCloseRequested));
    w95.debug?.assert(["undefined", "function"].includes(typeof newItemIndex));

    const height = w95.state(100);
    const highlightedIdx = w95.state(undefined);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height.now },
        get listItems() { return this.$form["_listItemsContainer"].$childWidgets },
        get isActivePopupMenu() { return isOpen },
        Form() {
            const itemWidgets = Object.keys(items).map((k, idx)=>w95.widget.dropdownBoxItem({
                ...items[k],
                text: k,
                onMouseEnter: ()=>{
                    highlight_item(idx, this.listItems);
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
    
            // Size the menu to its contents.
            const totalChildHeight = (1 + this.listItems.reduce((sum, c)=>(sum + (c.height - 1)), 0));
            this.listItems.forEach(child=>child.Message.resize((width - 1)));
            height.set(totalChildHeight);
    
            // Arrange the menu contents vertically.
            let yOffs = 0;
            for (const listItem of this.listItems) {
                listItem.Message.moveTo(0, yOffs);
                yOffs += (listItem.height - 1);
            }

            if (highlightedIdx.now === undefined) {
                this.Message.select(this.listItems[itemIndex]);
            }
            else {
                highlight_item(itemIndex, this.listItems);
            }

            this.listItems.forEach(child=>child.Message.setParent(this));
        },
        Message: {
            select(dropdownItemWidget) {
                w95.debug?.assert(typeof dropdownItemWidget === "object");
                w95.debug?.assert(dropdownItemWidget._type === "dropdownBoxItem");
                const idx = this.listItems.findIndex(item=>item.text === dropdownItemWidget.text);
                highlightedIdx.set(idx);
                newItemIndex?.(dropdownItemWidget, idx);
            },
            close() {
                onCloseRequested?.();
            },
        },
    };
});

function highlight_item(itemIdx, itemWidgets) {
    for (let i = 0; i < itemWidgets.length; i++) {
        itemWidgets[i].Message.highlight(i === itemIdx);
    }
}

/***/ }),

/***/ "./src/api/widgets/dropdown-box/widget.js":
/*!************************************************!*\
  !*** ./src/api/widgets/dropdown-box/widget.js ***!
  \************************************************/
/***/ (() => {

/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

// TODOs:
//
// - When the box's drop-down list of items is opened, highlight the currently-
//   selected item. This should also scroll the item into view if it isn't already.
//
// - When the box has focus, highlight the input field.

w95.widget("dropdownBox", function({
    x = 0,
    y = 0,
    width = 155,
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
    w95.debug?.assert(typeof items === "object");
    w95.debug?.assert(typeof itemIndex === "number");
    w95.debug?.assert(["undefined", "function"].includes(typeof newItemIndex));

    const text = w95.state("");
    const isOpen = w95.state(false);
    
    const toggleOpen = (
        isOpen.now
            ? ()=>isOpen.set(false)
            : ()=>isOpen.set(true)
    );

    const dropdownButtonSize = 16;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get text() { return text.now },
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
                            text: text.now,
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
                        text.set(item.text);
                        isOpen.set(false);
                        if (itemIndex !== idx) {
                            newItemIndex?.(idx);
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

/***/ "./src/api/widgets/frame/widget.js":
/*!*****************************************!*\
  !*** ./src/api/widgets/frame/widget.js ***!
  \*****************************************/
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
    width = 100,
    height = 100,
    shape = w95.frameShape.box,
    isResizable = false,
    isGrabbable = false,
    styleHints = [],
    children = [],
    backgroundColor = undefined,
    onMouseDown = undefined,
    onMouseUp = undefined,
    onClick = undefined,
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
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onClick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseMove));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));
    
    const isPressed = w95.state(false, {repaintOnChange: false});
    const isHovered = w95.state(false, {repaintOnChange: false});
    const borderGrab = w95.state({}, {repaintOnChange: false});
    const parentWidget = w95.state(undefined, {repaintOnChange: false});

    let isBorderGrabbed = false;
    update_border_grab_status();
    
    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get isHovered() { return isHovered.now },
        get isGrabbed() { return (isGrabbable && isPressed.now) }, 
        get isBorderGrabbed() { return (isResizable && isBorderGrabbed) },
        Mounted() {
             borderGrab.onChange = update_border_grab_status;
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
                return onMouseLeave?.({at, widget:this});
            },
            mouseenter({at}) {
                isHovered.set(true);
                return onMouseEnter?.({at, widget:this});
            },
            mousedown({at}) {
                const borderWidth = 4;
                
                isPressed.set(true);

                borderGrab.set({
                    left: (at.x < borderWidth),
                    right: (at.x >= (width - borderWidth)),
                    top: (at.y < borderWidth),
                    bottom: (at.y >= (height - borderWidth)),
                });

                if (isBorderGrabbed) {
                    return true;
                }

                return onMouseDown?.({at, widget:this});
            },
            mouseup({at}) {
                isPressed.set(false);
                borderGrab.set({});
                const retval = onMouseUp?.({at, widget:this});
                (!isHovered.now || onClick?.({at, widget:this}));
                return retval;
            },
            mousemove({event}) {
                if (isResizable && isBorderGrabbed) {
                    w95.debug?.assert(["window", "dialog"].includes(parentWidget.now._type));
                    w95.debug?.assert(typeof event?.movementX === "number");
                    w95.debug?.assert(typeof event?.movementY === "number");

                    if (borderGrab.now.right || borderGrab.now.bottom) {
                        parentWidget.now.Message.resizeBy(
                            borderGrab.now.right? (event.movementX / w95.shell.display.scale) : 0,
                            borderGrab.now.bottom? (event.movementY / w95.shell.display.scale) : 0,
                        );
                    }

                    if (borderGrab.now.left || borderGrab.now.top) {
                        parentWidget.now.Message.resizeBy(
                            borderGrab.now.left? (-event.movementX / w95.shell.display.scale) : 0,
                            borderGrab.now.top? (-event.movementY / w95.shell.display.scale) : 0,
                        );
                        parentWidget.now.Message.moveBy(
                            borderGrab.now.left? (event.movementX / w95.shell.display.scale) : 0,
                            borderGrab.now.top? (event.movementY / w95.shell.display.scale) : 0,
                        );
                    }
                }

                return onMouseMove?.({event, isGrabbed:(isGrabbable && isPressed.now), widget:this});
            },
        },
    };

    function update_border_grab_status() {
        isBorderGrabbed = Boolean(
            isResizable && (
                borderGrab.now.left ||
                borderGrab.now.right ||
                borderGrab.now.top ||
                borderGrab.now.bottom
        ));
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

/***/ "./src/api/widgets/group-box/widget.js":
/*!*********************************************!*\
  !*** ./src/api/widgets/group-box/widget.js ***!
  \*********************************************/
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
    width = 100,
    height = 100,
    title = "",
    children = [],
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof title === "string");
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
                    y: 0,
                    width: w95.font.stringWidth(title),
                    backgroundColor: w95.palette.window.background,
                    text: title,
                }),
            ];
        },
    };
});


/***/ }),

/***/ "./src/api/widgets/horizontal-layout/widget.js":
/*!*****************************************************!*\
  !*** ./src/api/widgets/horizontal-layout/widget.js ***!
  \*****************************************************/
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
            else if (styleHints.includes(w95.styleHint.alignHRight)) {
                adjustedX.set(x + width - maxChildX);
            }
        },
        Form() {
            return children;
        },
    };
});


/***/ }),

/***/ "./src/api/widgets/horizontal-rule/widget.js":
/*!***************************************************!*\
  !*** ./src/api/widgets/horizontal-rule/widget.js ***!
  \***************************************************/
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
    width = 100,
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

/***/ "./src/api/widgets/horizontal-slider/widget.js":
/*!*****************************************************!*\
  !*** ./src/api/widgets/horizontal-slider/widget.js ***!
  \*****************************************************/
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
    width = 100,
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
    const clickPosExcess = w95.state(0, {repaintOnChange: false});

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

/***/ "./src/api/widgets/label/widget.js":
/*!*****************************************!*\
  !*** ./src/api/widgets/label/widget.js ***!
  \*****************************************/
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
    text = "",
    width = undefined,
    height = undefined,
    isDisabled = false,
    styleHints = [],
    letterSpacing = 1,
    wordSpacing = 3,
    font = w95.font.sansSerif[8],
    lineSpacing = w95.font.regular.lineHeight,
    color = w95.palette.widget.foreground,
    backgroundColor = w95.palette.named.transparent,
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
    w95.debug?.assert(typeof wordSpacing === "number");
    w95.debug?.assert(typeof letterSpacing === "number");
    w95.debug?.assert(typeof lineSpacing === "number");
    w95.debug?.assert(typeof font === "object");
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "number"].includes(typeof width));
    w95.debug?.assert(["undefined", "number"].includes(typeof height));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseMove));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));

    let fontVariant = (styleHints.includes(w95.styleHint.bold)? font.bold : font.regular);

    if (typeof width === "undefined") {
        width = w95.font.stringWidth(text, font, fontVariant);
    }
    if (typeof height === "undefined") {
        height = w95.font.stringHeight(text, fontVariant);
    }

    const isDisabledAction = (
        isDisabled &&
        styleHints.includes(w95.styleHint.action)
    );

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
        Form() {
            return [
                ...text_mesh(), 
                ...background_mesh(),
                ...styleHints.includes(w95.styleHint.underlined)? [
                    Rngon.ngon([
                        Rngon.vertex(0, height),
                        Rngon.vertex(width, height),
                    ], {
                        color,
                    })
                ] : [],
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

    function text_mesh() {
        const ngons = [];
        const textWidth = w95.font.stringWidth(text, font, fontVariant);
        const textHeight = w95.font.stringHeight(text, font, fontVariant);

        if (isDisabledAction) {
            ngons.push(...to_ngons(text, w95.palette.widget.disabled1, 0, -1));
            ngons.push(...to_ngons(text, w95.palette.widget.disabled2, 1, 0));
        }
        else {
            ngons.push(...to_ngons(text, (isDisabled? w95.palette.widget.disabled1 : color)));
        }

        if (styleHints.includes(w95.styleHint.alignHCenter)) {
            const center = Math.round((width / 2) - (textWidth / 2));
            for (const ngon of ngons) {
                for (const vert of ngon.vertices) {
                    vert.x += center;
                }
            }
        }

        if (styleHints.includes(w95.styleHint.alignVCenter)) {
            const center = Math.floor((height / 2) - (textHeight / 2));
            for (const ngon of ngons) {
                for (const vert of ngon.vertices) {
                    vert.y += center;
                }
            }
        }

        if (styleHints.includes(w95.styleHint.alignHRight)) {
            const left = (width - textWidth);
            for (const ngon of ngons) {
                for (const vert of ngon.vertices) {
                    vert.x += left;
                }
            }
        }

        return ngons;

        function to_ngons(text, textColor = color, x = 0, y = 0) {
            return text.split("").map(char=>{
                const charCode = char.charCodeAt(0);

                // \b (control character that switches between bold and regular font).
                if (charCode === 8) {
                    fontVariant = ((fontVariant === font.regular)? font.bold : font.regular);
                    return Rngon.ngon([]);
                }
    
                // Space.
                if (charCode === 32) {
                    x += (wordSpacing * letterSpacing);
                    return Rngon.ngon([]);
                }
    
                // Newline.
                if (charCode === 10) {
                    x = 0;
                    y += lineSpacing;
                    return Rngon.ngon([]);
                }
    
                const glyph = (fontVariant[charCode] || fontVariant[63]);
    
                x += glyph.leftSpacing;
    
                const ngon = Rngon.ngon([
                    Rngon.vertex( x,                 y                ), 
                    Rngon.vertex((x + glyph.width),  y                ),
                    Rngon.vertex((x + glyph.width), (y + glyph.height)),
                    Rngon.vertex( x,                (y + glyph.height)),
                ], {
                    texture: glyph,
                    color: textColor,
                    allowAlphaReject: true,
                    invertedColor: styleHints.includes(w95.styleHint.inverted),
                    blit: true,
                });
    
                x += (glyph.width + letterSpacing);
    
                return ngon;
            });
        }
    }
});


/***/ }),

/***/ "./src/api/widgets/line-edit/widget.js":
/*!*********************************************!*\
  !*** ./src/api/widgets/line-edit/widget.js ***!
  \*********************************************/
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
    text = "",
    width = 100,
    height = 21,
    isEditable = false,
    isDisabled = false,
    autofocus = false,
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
    w95.debug?.assert(Array.isArray(styleHints));
    w95.debug?.assert(["undefined", "function"].includes(typeof onSubmit));
    w95.debug?.assert(["undefined", "function"].includes(typeof newText));

    const showCursor = w95.state(true);
    const cursorPosition = w95.state(text.length);
    const viewBufferStart = w95.state(0);
    const viewBufferEnd = w95.state(text.length);
    const hasFocus = w95.state(false);

    let cursorBlinkTimeout;
    const borderWidth = 2;
    const horPadding = 5;
    const visibleText = text.slice(viewBufferStart.now, viewBufferEnd.now);
    const cursorXOffset = w95.font.stringWidth(text.slice(viewBufferStart.now, cursorPosition.now));

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
        BeforeRelease() {
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
                        x: horPadding,
                        y: borderWidth,
                        width: (width - horPadding - borderWidth),
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

                if (text === newText) {
                    return;
                }

                viewBufferStart.set(0);
                viewBufferEnd.set(newText.length);

                set_cursor_position(0);
                text = remove_text(text.length);
                text = enter_text(newText);

                showCursor.set(true);
                set_cursor_position(text.length);
                
                newText?.(text, this);
            },
            submit() {
                if (onSubmit) {
                    onSubmit({text, widget:this});
                    this.Message.blur();
                }
            }
        },
        Event: {
            mousedown() {
                if (isDisabled) {
                    return;
                }

                return true;
            },
            keypress(event) {
                w95.debug?.assert(event instanceof KeyboardEvent);
                w95.debug?.assert(typeof event.key === "string");

                let updatedText = text;

                if (event.key.length !== 1) {
                    return;
                }

                updatedText = enter_text(event.key);

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
                        while (!string_fits_widget(text.slice(viewBufferStart.now, viewBufferEnd.now))) {
                            viewBufferEnd.set(viewBufferEnd.now - 1);
                        };
                    }
                }
                else if (event.key == "ArrowRight") {
                    set_cursor_position(cursorPosition.now + 1);
                    if (cursorPosition.now > viewBufferEnd.now) {
                        viewBufferEnd.set(viewBufferEnd.now + 1);
                        while (!string_fits_widget(text.slice(viewBufferStart.now, viewBufferEnd.now))) {
                            viewBufferStart.set(viewBufferStart.now + 1);
                        };
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

    function remove_text(count = 0) {
        w95.debug?.assert(typeof count === "number");

        let updatedText = text;

        switch (Math.sign(count)) {
            case 1: {
                updatedText = (text.slice(0, cursorPosition.now) + text.slice(cursorPosition.now + count));
                break;
            }
            case -1: {
                if (cursorPosition.now <= 0) {
                    break;
                }

                const oldCursorPos = cursorPosition.now;
                const newCursorPos = set_cursor_position(oldCursorPos + count);

                updatedText = (text.slice(0, newCursorPos) + text.slice(oldCursorPos));
                viewBufferEnd.set(viewBufferEnd.now + count);

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

        const updatedText = [text.slice(0, cursorPosition.now), newText, text.slice(cursorPosition.now)].join("");
        
        showCursor.set(true);
        set_cursor_position((cursorPosition.now + newText.length), updatedText);

        viewBufferEnd.set(viewBufferEnd.now + 1);
        while (!string_fits_widget(updatedText.slice(viewBufferStart.now, viewBufferEnd.now))) {
            viewBufferStart.set(viewBufferStart.now + 1);
        };

        return updatedText;
    };

    function set_cursor_position(newPosition = 0, referenceText = text) {
        w95.debug?.assert(typeof newPosition === "number");
        newPosition = Math.max(0, Math.min(newPosition, referenceText.length));
        showCursor.set(true);
        cursorPosition.set(newPosition);
        return cursorPosition.now;
    };

    function string_fits_widget(text) {
        return ((w95.font.stringWidth(text) + (horPadding * 2)) <= width);
    }
});


/***/ }),

/***/ "./src/api/widgets/menu-bar/widget.js":
/*!********************************************!*\
  !*** ./src/api/widgets/menu-bar/widget.js ***!
  \********************************************/
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
    width = 320,
    height = 18,
    children = [],
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
                this.$childWidgets.forEach(menuItem=>menuItem.Message.close());
            },
        },
    };
});


/***/ }),

/***/ "./src/api/widgets/menu-item/widget.js":
/*!*********************************************!*\
  !*** ./src/api/widgets/menu-item/widget.js ***!
  \*********************************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("menuItem", function({
    text = "",
    group = undefined,
    menu = undefined,
    isTopLevel = false,
    isCheckable = false,
    isChecked = false,
    isDisabled = false,
    onClick = undefined,
    onMouseEnter = undefined,
    onMouseLeave = undefined,
} = {})
{
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(typeof isTopLevel === "boolean");
    w95.debug?.assert(["string", "undefined"].includes(typeof group));
    w95.debug?.assert(["function", "undefined"].includes(typeof menu));
    w95.debug?.assert(["function", "undefined"].includes(typeof onClick));
    w95.debug?.assert(["function", "undefined"].includes(typeof onMouseEnter));
    w95.debug?.assert(["function", "undefined"].includes(typeof onMouseLeave));

    // This will be set automatically by the parent menu.
    let parentMenuWidget = undefined;

    const x = w95.state(0);
    const y = w95.state(0);
    const isHovered = w95.state(false);
    const isActive = w95.state(false);
    isChecked = w95.state(isChecked);
    const leftPadding = (isTopLevel? 6 : 22);
    const rightPadding = (isTopLevel? 6 : 20);
    const width = w95.state(leftPadding + w95.font.stringWidth(text) + rightPadding - 1);
    const height = 18;
    const styleHints = (
        isTopLevel
            ? [w95.styleHint.alignHCenter, w95.styleHint.alignVCenter]
            : [w95.styleHint.alignVCenter]
    );

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width.now },
        get height() { return height },
        get group() { return group },
        get isHovered() { return isHovered.now },
        get isOpen() { return (menu && this.$childWidgets[1])?.isOpen },
        Form() {
            return [
                w95.widget.panel({
                    width: width.now,
                    height,
                    color: w95.palette.named.darkBlue,
                }, {
                    hideIf: (!isHovered.now && !isTopLevel) || (isTopLevel && !isActive.now),
                }),
                menu,
                w95.widget.bitmap({
                    x: 9,
                    y: 10,
                    image: w95.icon.checkmark,
                    styleHints: [
                        isHovered.now? w95.styleHint.inverted : 0,
                    ],
                }, {
                    hideIf: !isChecked.now,
                }),
                w95.widget.label({
                    x: (isTopLevel? 0 : leftPadding),
                    width: (width.now - (isTopLevel? 0 : leftPadding)),
                    height,
                    text,
                    isDisabled,
                    styleHints: [
                        ...styleHints,
                        w95.styleHint.action,
                        (isActive.now || (!isTopLevel && isHovered.now))? w95.styleHint.inverted : 0,
                    ],
                }),
            ];
        },
        Event: {
            mousedown() {
                if (isDisabled) {
                    return;
                }

                const menuItem = (menu && this.$childWidgets[1])
                if (menuItem) {
                    this.Message.toggle();
                }
                return true;
            },
            mouseup() {
                if (isDisabled) {
                    return;
                }
                
                if (!isTopLevel) {
                    w95.windowManager.root_widget(this)?.menuBar?.Message.closeMenus();
                }
                parentMenuWidget?.Message.checkItem(this);
                return (onClick?.(this) ?? true);
            },
            mousemove() {
                isHovered.set(true);
                w95.windowManager.root_widget(this)?.menuBar?.Message.update();
            },
            mouseleave() {
                isHovered.set(false);
            }
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
                const menuItem = (menu && this.$childWidgets[1]);
                menuItem?.Message.open();
                isActive.set(true);
            },
            close() {
                const menuItem = (menu && this.$childWidgets[1]);
                menuItem?.Message.close();
                isHovered.set(false);
                isActive.set(false);
            },
            toggle() {
                const menuItem = (menu && this.$childWidgets[1]);
                this.Message[menuItem?.isOpen? "close" : "open"]();
            },
            setChecked(is = true) {
                w95.debug?.assert(typeof is === "boolean");
                if (isCheckable) {
                    isChecked.set(is);
                }
            },
            setParentMenuWidget(newParentMenuWidget) {
                w95.debug?.assert(typeof newParentMenuWidget === "object");
                w95.debug?.assert(newParentMenuWidget._type === "menu");
                parentMenuWidget = newParentMenuWidget;
            },
        },
    };
});


/***/ }),

/***/ "./src/api/widgets/menu-separator/widget.js":
/*!**************************************************!*\
  !*** ./src/api/widgets/menu-separator/widget.js ***!
  \**************************************************/
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
    const width = w95.state(0);
    const height = 8;

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
        },
    };
});


/***/ }),

/***/ "./src/api/widgets/menu/widget.js":
/*!****************************************!*\
  !*** ./src/api/widgets/menu/widget.js ***!
  \****************************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
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

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width.now },
        get height() { return height.now },
        get isOpen() { return isOpen.now },
        get isActivePopupMenu() { return isOpen.now },
        Mounted() {
            const menuItems = this.$form["_menuItemsContainer"].$childWidgets;
            w95.debug?.assert(menuItems.every(item=>["menuItem", "menuSeparator"].includes(item._type)));

            for (const child of menuItems) {
                child.Message?.setParentMenuWidget?.(this);
            }
    
            // Size the menu to its contents.
            const maxChildWidth = menuItems.reduce((max, c)=>Math.max(max, c.width), 0);
            const totalChildHeight = menuItems.reduce((sum, c)=>(sum + (c.height - 0)), 0);
            width.set(maxChildWidth + 6);
            height.set(totalChildHeight + 6);
            menuItems.forEach(child=>child.Message.resize(maxChildWidth));
    
            // Arrange the menu contents vertically.
            let yOffs = 3;
            for (const menuItem of menuItems) {
                menuItem.Message.moveTo(3, yOffs);
                yOffs += menuItem.height;
            }
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
            mousedown() {
                return true;
            },
        },
        Message: {
            open() {
                isOpen.set(true);
            },
            close() {
                isOpen.set(false);
            },
            checkItem(menuItem) {
                w95.debug?.assert(typeof menuItem === "object");
                w95.debug?.assert(menuItem._type === "menuItem");

                const menuItems = this.$form["_menuItemsContainer"].$childWidgets;
                w95.debug?.assert(menuItems.includes(menuItem));

                const sameGroupItems = menuItems.filter(w=>((w !== menuItem) && (w.group === menuItem.group)));
                menuItem.Message.setChecked(true);
                for (const child of sameGroupItems) {
                    child.Message?.setChecked?.(false);
                }
            },
        },
    };
});


/***/ }),

/***/ "./src/api/widgets/panel/widget.js":
/*!*****************************************!*\
  !*** ./src/api/widgets/panel/widget.js ***!
  \*****************************************/
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
    width = 100,
    height = 100,
    color = w95.palette.widget.foreground,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof color === "object");
    w95.debug?.assert(width > 0);
    w95.debug?.assert(height > 0);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
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

/***/ "./src/api/widgets/progress-bar/widget.js":
/*!************************************************!*\
  !*** ./src/api/widgets/progress-bar/widget.js ***!
  \************************************************/
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
    width = 100,
    height = 13,
    color = w95.palette.named.darkBlue,
    progress = 0,
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

/***/ "./src/api/widgets/radio-group/radio-group-item/widget.js":
/*!****************************************************************!*\
  !*** ./src/api/widgets/radio-group/radio-group-item/widget.js ***!
  \****************************************************************/
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
    label = "",
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

    const height = (w95.font.regular.lineHeight + 1);

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
                            image: (
                                isChecked
                                    ? w95.icon.radioButtonChecked
                                    : w95.icon.radioButtonUnchecked
                            ),
                        }),
                        w95.widget.label({
                            x: 18,
                            height: (height - 1),
                            text: label,
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

/***/ "./src/api/widgets/radio-group/widget.js":
/*!***********************************************!*\
  !*** ./src/api/widgets/radio-group/widget.js ***!
  \***********************************************/
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
    items = {},
    itemIndex = 0,
    newItemIndex = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof items === "object");
    w95.debug?.assert(typeof itemIndex === "number");
    w95.debug?.assert(["undefined", "function"].includes(typeof newItemIndex));

    const width = w95.state(1);
    const height = w95.state(1);

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

/***/ "./src/api/widgets/render-surface/widget.js":
/*!**************************************************!*\
  !*** ./src/api/widgets/render-surface/widget.js ***!
  \**************************************************/
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
    w95.debug?.assert(["undefined", "function"].includes(typeof onTick));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseDown));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseUp));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseMove));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseLeave));
    w95.debug?.assert(["undefined", "function"].includes(typeof onMouseEnter));
    w95.debug?.assert(width > 0);
    w95.debug?.assert(height > 0);

    const renderWidth = ~~(width * (options.resolution || 1));
    const renderHeight = ~~(height * (options.resolution || 1));

    const numTicks = w95.state(0);
    
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
        Mounted() {
            if (onTick) {
                w95.tick.listen(tick = tick.bind(this));
            }
        },
        BeforeRelease() {
            if (onTick) {
                w95.tick.unlisten(tick);
            }
        },
        Form() {
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
                    grayscale: isDisabled,
                    blit: true,
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

/***/ "./src/api/widgets/scroll-area/widget.js":
/*!***********************************************!*\
  !*** ./src/api/widgets/scroll-area/widget.js ***!
  \***********************************************/
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
    width = 100,
    height = 100,
    isDisabled = false,
    children = [],
    backgroundColor = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(Array.isArray(children));
    w95.debug?.assert(["undefined", "object"].includes(typeof backgroundColor));

    const clickPosExcess = w95.state(0);
    const isScrolling = w95.state(false);

    const padding = 2;
    const scrollButtonSize = 16;

    const vertical = {
        scrollPos: w95.state(0),
        handlePos: w95.state(0),
        handleSize: w95.state(16),
        contentLength: w95.state(10),
        isVisible: w95.state(false),
        viewportSize: w95.state(height),
    };

    const horizontal = {
        scrollPos: w95.state(0),
        handlePos: w95.state(0),
        handleSize: w95.state(16),
        contentLength: w95.state(10),
        isVisible: w95.state(false),
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
             horizontal.isVisible.set(horizontalScrollExcess > 0);
             horizontal.viewportSize.set(width - (padding * 2) - (vertical.isVisible.now? scrollButtonSize : 0));
             horizontal.contentLength.set(Math.max(...contentsFrame.$descendants.map(d=>(d.at.x + d.widget.width))));
             horizontal.handleSize.set(Math.max(scrollButtonSize, (horizontal.viewportSize.now - horizontalScrollExcess - (scrollButtonSize * 2))));

             const verticalScrollExcess = (vertical.contentLength.now - vertical.viewportSize.now);
             vertical.isVisible.set(verticalScrollExcess > 0);
             vertical.viewportSize.set(height - (padding * 2) - (horizontal.isVisible.now? scrollButtonSize : 0));
             vertical.contentLength.set(Math.max(...contentsFrame.$descendants.map(d=>(d.at.y + d.widget.height))));
             vertical.handleSize.set(Math.max(scrollButtonSize, (vertical.viewportSize.now - verticalScrollExcess - (scrollButtonSize * 2))));
        },
        Form() {
            return [
                // Background.
                w95.widget.panel({
                    width,
                    height,
                    color: (
                        isDisabled
                            ? w95.palette.window.background
                            : backgroundColor
                    ),
                }, {
                    hideIf: !backgroundColor,
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
                    shape: w95.frameShape.input,
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
                            backgroundColor: w95.palette.named.offWhite,
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
                        }),
                        w95.widget.button({
                            x: 0,
                            y: 0,
                            width: scrollButtonSize,
                            height: scrollButtonSize,
                            icon: w95.icon.arrowUp,
                            shape: w95.buttonShape.dropdown,
                            isDisabled,
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
                            isDisabled,
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
                            backgroundColor: w95.palette.named.offWhite,
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
                        }),
                        w95.widget.button({
                            x: 0,
                            y: 0,
                            width: scrollButtonSize,
                            height: scrollButtonSize,
                            icon: w95.icon.arrowLeft,
                            isDisabled,
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
                            isDisabled,
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

/***/ "./src/api/widgets/tab-control/widget.js":
/*!***********************************************!*\
  !*** ./src/api/widgets/tab-control/widget.js ***!
  \***********************************************/
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
    width = 300,
    height = 200,
    isDisabled = false,
    tabs = {},
    tabIndex = 0,
    newTabIndex = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof tabIndex === "number");
    w95.debug?.assert(typeof tabs === "object");
    w95.debug?.assert(["undefined", "function"].includes(typeof newTabIndex));

    const tabButtonHeight = 20;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get tabIndex() { return tabIndex },
        Form() {    
            const tabButtons = Object.keys(tabs).reduce((list, tabLabel, idx)=>{
                const isFirstTab = (idx === 0);
                const isActiveTab = (idx === tabIndex);
                const labelWidth = (w95.font.stringWidth(tabLabel) + 13);
                list.buttons.push(
                    w95.widget.button({
                        x: (list.x - (isActiveTab? 2 : 0)),
                        y: (isActiveTab? 0 : 2),
                        width: labelWidth + (isActiveTab? 4 : 0),
                        height: tabButtonHeight + (isActiveTab? 2 : 0),
                        text: tabLabel,
                        isDisabled: (isDisabled && (idx !== tabIndex)),
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

            const tabContents = Object.values(tabs).map((tab, idx)=>{
                return w95.widget.frame({
                    x: 2,
                    y: 2,
                    width: (width - 4),
                    height: (height - tabButtonHeight - 4),
                    shape: w95.frameShape.none,
                    children: tab.children,
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

/***/ "./src/api/widgets/title-bar/widget.js":
/*!*********************************************!*\
  !*** ./src/api/widgets/title-bar/widget.js ***!
  \*********************************************/
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
    width = 100,
    height = 100,
    title = "",
    icon = w95.icon.applicationIcon16x16,
    styleHints = [],
    isBlurred = true,
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

    const parentWidget = w95.state(undefined, {repaintOnChange: false});

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
                    height: height,
                    text: title,
                    color: isBlurred
                        ? w95.palette.window.titleBar.inactiveForeground
                        : w95.palette.window.titleBar.foreground,
                    styleHints: [
                        w95.styleHint.bold,
                        w95.styleHint.alignVCenter,
                    ],
                }, {hideIf: !title.length}),
    
                // Close.
                w95.widget.button({
                    x: (width - 17 - 1),
                    y: 2,
                    width: 16,
                    height: 14,
                    icon: w95.icon.titleBarClose,
                    onClick: onClose,
                }),
    
                // Maximize.
                w95.widget.button({
                    x: (width - 17 - 19),
                    y: 2,
                    width: 16,
                    height: 14,
                    icon: w95.icon.titleBarMaximize,
                    onClick({widget}) {
                        w95.windowManager.root_widget(widget).Message?.maximize();
                    },
                }, {hideIf: isDialog}),
                
                // Minimize.
                w95.widget.button({
                    x: (width - 17 - 35),
                    y: 2,
                    width: 16,
                    height: 14,
                    icon: w95.icon.titleBarMinimize,
                }, {hideIf: isDialog}),

                // Grabber.
                w95.widget.frame({
                    width,
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
        
                        parentWidget.now.Message?.moveBy?.(
                            (event.movementX / w95.shell.display.scale),
                            (event.movementY / w95.shell.display.scale),
                        );

                        return true;
                    }
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
});


/***/ }),

/***/ "./src/api/widgets/window/widget.js":
/*!******************************************!*\
  !*** ./src/api/widgets/window/widget.js ***!
  \******************************************/
/***/ (() => {

/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("window", function({
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    title = "",
    backgroundColor = w95.palette.window.background,
    icon = w95.icon.applicationIcon16x16,
    isBlurred = true,
    styleHints = [
        w95.styleHint.resizable,
    ],
    children = [],
    onMouseEnter = undefined,
    onMouseLeave = undefined,
    onMouseUp = undefined,
    onMouseDown = undefined,
    onMouseMove = undefined,
    onKeyUp = undefined,
    onKeyDown = undefined,
    resize = undefined,
    move = undefined,
    maximize = undefined,
    close = undefined,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
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
    w95.debug?.assert(["undefined", "function"].includes(typeof resize));
    w95.debug?.assert(["undefined", "function"].includes(typeof move));
    w95.debug?.assert(["undefined", "function"].includes(typeof maximize));
    w95.debug?.assert(["undefined", "function"].includes(typeof close));

    isBlurred = w95.state(isBlurred);

    if (styleHints.includes(w95.styleHint.desktop)) {
        styleHints.push(w95.styleHint.plain, w95.styleHint.noBorder);
    }

    const isPlain = styleHints.includes(w95.styleHint.plain);
    const isDesktop = styleHints.includes(w95.styleHint.desktop);
    const hasNoBorder = styleHints.includes(w95.styleHint.noBorder);
    const isResizable = styleHints.includes(w95.styleHint.resizable);
    let menuBarWidget = undefined;

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        get menuBar() { return menuBarWidget },
        get isBlurred() { return isBlurred.now },
        get isDesktop() { return isDesktop },
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
                    onClose: ()=>{
                        close?.(this);
                    },
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
            resizeTo(newWidth = 0, newHeight = 0) {
                w95.debug?.assert(typeof newWidth === "number");
                w95.debug?.assert(typeof newHeight === "number");
                resize?.(newWidth, newHeight);
            },
            resizeBy(deltaWidth = 0, deltaHeight = 0) {
                w95.debug?.assert(typeof deltaWidth === "number");
                w95.debug?.assert(typeof deltaHeight === "number");
                resize?.(deltaWidth, deltaHeight, {isRelative: true});
            },
            moveTo(newX = 0, newY = 0) {
                w95.debug?.assert(typeof newX === "number");
                w95.debug?.assert(typeof newY === "number");
                move?.(newX, newY);
            },
            moveBy(deltaX = 0, deltaY = 0) {
                w95.debug?.assert(typeof deltaX === "number");
                w95.debug?.assert(typeof deltaY === "number");
                move?.(deltaX, deltaY, {isRelative: true});
            },
            maximize() {
                maximize?.();
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
/*!************************************!*\
  !*** ./src/api/widgets/widgets.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _button_widget_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button/widget.js */ "./src/api/widgets/button/widget.js");
/* harmony import */ var _button_widget_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_button_widget_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bitmap_widget_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bitmap/widget.js */ "./src/api/widgets/bitmap/widget.js");
/* harmony import */ var _bitmap_widget_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_bitmap_widget_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _panel_widget_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./panel/widget.js */ "./src/api/widgets/panel/widget.js");
/* harmony import */ var _panel_widget_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_panel_widget_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _window_widget_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./window/widget.js */ "./src/api/widgets/window/widget.js");
/* harmony import */ var _window_widget_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_window_widget_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _frame_widget_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./frame/widget.js */ "./src/api/widgets/frame/widget.js");
/* harmony import */ var _frame_widget_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_frame_widget_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _label_widget_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./label/widget.js */ "./src/api/widgets/label/widget.js");
/* harmony import */ var _label_widget_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_label_widget_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _title_bar_widget_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./title-bar/widget.js */ "./src/api/widgets/title-bar/widget.js");
/* harmony import */ var _title_bar_widget_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_title_bar_widget_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _line_edit_widget_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./line-edit/widget.js */ "./src/api/widgets/line-edit/widget.js");
/* harmony import */ var _line_edit_widget_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_line_edit_widget_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _horizontal_rule_widget_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./horizontal-rule/widget.js */ "./src/api/widgets/horizontal-rule/widget.js");
/* harmony import */ var _horizontal_rule_widget_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_horizontal_rule_widget_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _menu_widget_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./menu/widget.js */ "./src/api/widgets/menu/widget.js");
/* harmony import */ var _menu_widget_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_menu_widget_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _menu_item_widget_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./menu-item/widget.js */ "./src/api/widgets/menu-item/widget.js");
/* harmony import */ var _menu_item_widget_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_menu_item_widget_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _menu_separator_widget_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./menu-separator/widget.js */ "./src/api/widgets/menu-separator/widget.js");
/* harmony import */ var _menu_separator_widget_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_menu_separator_widget_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _menu_bar_widget_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./menu-bar/widget.js */ "./src/api/widgets/menu-bar/widget.js");
/* harmony import */ var _menu_bar_widget_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_menu_bar_widget_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _dropdown_box_widget_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./dropdown-box/widget.js */ "./src/api/widgets/dropdown-box/widget.js");
/* harmony import */ var _dropdown_box_widget_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_dropdown_box_widget_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _dropdown_box_dropdown_box_item_widget_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./dropdown-box/dropdown-box-item/widget.js */ "./src/api/widgets/dropdown-box/dropdown-box-item/widget.js");
/* harmony import */ var _dropdown_box_dropdown_box_item_widget_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_dropdown_box_dropdown_box_item_widget_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _dropdown_box_dropdown_box_list_widget_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./dropdown-box/dropdown-box-list/widget.js */ "./src/api/widgets/dropdown-box/dropdown-box-list/widget.js");
/* harmony import */ var _dropdown_box_dropdown_box_list_widget_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_dropdown_box_dropdown_box_list_widget_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _progress_bar_widget_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./progress-bar/widget.js */ "./src/api/widgets/progress-bar/widget.js");
/* harmony import */ var _progress_bar_widget_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_progress_bar_widget_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _render_surface_widget_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./render-surface/widget.js */ "./src/api/widgets/render-surface/widget.js");
/* harmony import */ var _render_surface_widget_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_render_surface_widget_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _desktop_icon_widget_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./desktop-icon/widget.js */ "./src/api/widgets/desktop-icon/widget.js");
/* harmony import */ var _desktop_icon_widget_js__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_desktop_icon_widget_js__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _dom_element_widget_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./dom-element/widget.js */ "./src/api/widgets/dom-element/widget.js");
/* harmony import */ var _dom_element_widget_js__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_dom_element_widget_js__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _group_box_widget_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./group-box/widget.js */ "./src/api/widgets/group-box/widget.js");
/* harmony import */ var _group_box_widget_js__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(_group_box_widget_js__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var _checkbox_widget_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./checkbox/widget.js */ "./src/api/widgets/checkbox/widget.js");
/* harmony import */ var _checkbox_widget_js__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(_checkbox_widget_js__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var _tab_control_widget_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./tab-control/widget.js */ "./src/api/widgets/tab-control/widget.js");
/* harmony import */ var _tab_control_widget_js__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(_tab_control_widget_js__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _scroll_area_widget_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./scroll-area/widget.js */ "./src/api/widgets/scroll-area/widget.js");
/* harmony import */ var _scroll_area_widget_js__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/__webpack_require__.n(_scroll_area_widget_js__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */ var _radio_group_widget_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./radio-group/widget.js */ "./src/api/widgets/radio-group/widget.js");
/* harmony import */ var _radio_group_widget_js__WEBPACK_IMPORTED_MODULE_24___default = /*#__PURE__*/__webpack_require__.n(_radio_group_widget_js__WEBPACK_IMPORTED_MODULE_24__);
/* harmony import */ var _radio_group_radio_group_item_widget_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./radio-group/radio-group-item/widget.js */ "./src/api/widgets/radio-group/radio-group-item/widget.js");
/* harmony import */ var _radio_group_radio_group_item_widget_js__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(_radio_group_radio_group_item_widget_js__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var _horizontal_slider_widget_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./horizontal-slider/widget.js */ "./src/api/widgets/horizontal-slider/widget.js");
/* harmony import */ var _horizontal_slider_widget_js__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(_horizontal_slider_widget_js__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var _dialog_widget_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./dialog/widget.js */ "./src/api/widgets/dialog/widget.js");
/* harmony import */ var _dialog_widget_js__WEBPACK_IMPORTED_MODULE_27___default = /*#__PURE__*/__webpack_require__.n(_dialog_widget_js__WEBPACK_IMPORTED_MODULE_27__);
/* harmony import */ var _horizontal_layout_widget_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./horizontal-layout/widget.js */ "./src/api/widgets/horizontal-layout/widget.js");
/* harmony import */ var _horizontal_layout_widget_js__WEBPACK_IMPORTED_MODULE_28___default = /*#__PURE__*/__webpack_require__.n(_horizontal_layout_widget_js__WEBPACK_IMPORTED_MODULE_28__);






























})();

var __webpack_export_target__ = self;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;