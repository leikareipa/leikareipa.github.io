/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/app.js":
/*!*************************!*\
  !*** ./src/core/app.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   app: () => (/* binding */ app)
/* harmony export */ });
/* harmony import */ var _widget_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./widget.js */ "./src/core/widget.js");
/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 *
 * Provides a public interface around the internal interface of a w95 window widget,
 * making it a w95 app.
 * 
 * Sample of usage:
 * 
 *   const sampleApp = app(sampleAppRootWidget);
 * 
 *   console.log("About to run", sampleApp.name);
 *
 *   (function render_loop() {
 *     window.requestAnimationFrame(render_loop);
 * 
 *     if (sampleApp.update()) {
 *       rasterize(sampleApp.mesh());
 *     }
 *   })();
 * 
 */



function app(appMeta, appId, app_render_fn = ()=>({})) {
    w95.debug?.assert(typeof app_render_fn === "function");

    const intf = {
        get id() { return appId },
        get _type() { return "app" },
        get _what() { return "w95-widget" },
        get width() { return intf.window.width },
        get height() { return intf.window.height },
        get rootWidget() { return intf.$childWidgets[0] },
        get appObject() { return intf.rootWidget.$childWidgets[0] },
        get window() { return intf.appObject.$childWidgets[0] },
        x: 0,
        y: 0,
        move(args) {
            w95.windowManager.move_window_to(intf.window, args);
        },
        rerender() {
            intf.rootWidget._remountRequested = true;
        },
        rerasterize() {
            intf.rootWidget._rerenderRequested = true;
        },
        // A polygonal mesh of the app's root window and all its descendant widgets.
        // Note that the polygons are in actuality allowed to be n-sided, from points
        // to lines to multi-sided polygons. All of the mesh's polygons are convex.
        mesh() {
            return (0,_widget_js__WEBPACK_IMPORTED_MODULE_0__.transformed_recursive_mesh)(intf.window, intf.x, intf.y);
        },
        // Checks to see whether any widgets in the app need re-rendering, and returns
        // a list of the re-rendered widgets.
        update(entireApp = false) {
            w95.state.use(intf.state, intf);

            if (entireApp) {
                const w = intf.$childWidgets[0].$childWidgets[0];
                w95.state.move_head(w._stateStartIdx);
                w._remount(intf.$childWidgets[0]);
                return [];
            }
            
            const rerenderedWidgets = [];

            (0,_widget_js__WEBPACK_IMPORTED_MODULE_0__.recurse_descendant_widgets)(intf, (widget, parent)=>{
                if (widget._remountRequested) {
                    w95.state.move_head(widget._stateStartIdx);
                    widget._remount(parent);
                    rerenderedWidgets.push(widget);

                    // Return true to skip recursing this widget's children, since they've
                    // all now been re-rendered.
                    return true;
                }
                else if (widget._rerenderRequested) {
                    rerenderedWidgets.push(widget);
                    widget._rerenderRequested = false;
                }
            }, true);

            return rerenderedWidgets;
        },
        release() {
            intf.rootWidget.BeforeRelease?.();
            (0,_widget_js__WEBPACK_IMPORTED_MODULE_0__.recurse_descendant_widgets)(intf.rootWidget, (child)=>{
                child.BeforeRelease?.();
                child.dom?.remove();
            });
        },
    };

    app_render_fn._name = appMeta.name.replace(/ /g, "-");

    // Internally, we'll expose the app's widget structure under a '$childWidgets' array,
    // which makes the app's interface compatible with the internal widget interface.
    //
    // Note: This is a dynamic array. The render() function will invoke the given app
    // render function whenever the app's root window requires a repaint, which
    // replaces that element in the array with a new root window object. So static
    // references to elements in the array will eventually become stale.
    intf.state = app_render_fn.state = [];
    const renderedChildWidgets = [
        (0,_widget_js__WEBPACK_IMPORTED_MODULE_0__.mount_widget)({
            mount_fn: app_render_fn,
            parentWidget: intf,
        }
    )];
    Object.defineProperty(intf, "$childWidgets", {value: renderedChildWidgets});

    for (const key of Object.keys(intf.rootWidget.Meta)) {
        intf[key] = intf.rootWidget.Meta[key];
    }

    w95.debug?.assert(Array.isArray(intf.$childWidgets));
    w95.debug?.assert(intf.$childWidgets.length === 1);
    w95.debug?.assert(intf.$childWidgets[0]._what === "w95-widget");
    w95.debug?.assert(typeof intf.window === "object");
    w95.debug?.assert(intf.window._what === "w95-widget");
    w95.debug?.assert(intf.window._type === "window");

    return intf;
}


/***/ }),

/***/ "./src/core/clock.js":
/*!***************************!*\
  !*** ./src/core/clock.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clock: () => (/* binding */ clock)
/* harmony export */ });
/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 * 
 * Provides an emulation of a centralized, low-resolution, system-wide "BIOS clock".
 * Subscribing to the clock with a listener callback ensures (more or less) an
 * interval synced with all the other subscribers across the software.
 * 
 * For example, if you're displaying the time inside two different windows and fix
 * the timers' update rate to the clock interval, their time values will update in
 * sync even if they weren't created at exactly the same time.
 * 
 */

setInterval(broadcast_time, 1000);

let timeNow = new Date();
const listeners = [];

const clock = {
    get now() {
        return timeNow;
    },

    // Register a listener callback that will be called when the clock ticks. Note
    // that listener callbacks should return relatively quickly, as long-executing
    // callbacks can delay the timer's interval.
    listen: function(callback_fn = ()=>{}) {
        listeners.push(callback_fn);
    },

    unlisten: function(registered_callback_fn) {
        const idx = listeners.lastIndexOf(registered_callback_fn);

        if (idx >= 0) {
            listeners.splice(idx, 1);
        }
    },
};

function broadcast_time() {
    timeNow = new Date();

    // It's possible for listener callbacks to register new listener callbacks, so
    // we want to iterate over a clone of the listener array as it was at the start
    // of this tick, without the new potential listeners registered during the tick.
    Array.from(listeners).forEach(l=>l(timeNow));
}


/***/ }),

/***/ "./src/core/debug.js":
/*!***************************!*\
  !*** ./src/core/debug.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debug: () => (/* binding */ debug)
/* harmony export */ });
/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

const debug = ((typeof window === "object") && false)? 0
: {
    assert: function(condition, failMessage = "Assertion failure") {
        if (!condition) {
            throw new Error(failMessage);
        }
    },
    throw: function(errorMessage = "") {
        throw new Error(errorMessage);
    }
};


/***/ }),

/***/ "./src/core/desktop.js":
/*!*****************************!*\
  !*** ./src/core/desktop.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   desktopApp: () => (/* binding */ desktopApp)
/* harmony export */ });
/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

function desktopApp(icons = []) {
    w95.debug?.assert(Array.isArray(icons));

    return {
        Meta: {
            name: "Desktop",
            version: "0.1",
            author: "Tarpeeksi Hyvae Soft",
            description: `
                This app renders a screen-wide borderless window to emulate the
                Windows 95 desktop.
            `,
        },
        App() {
            const width = w95.state(w95.shell.display.width);
            const height = w95.state(w95.shell.display.height);
        
            return {
                get x() { return 0 },
                get y() { return 0 },
                get width() { return width.now },
                get height() { return height.now },
                get isDesktop() { return true },
                Message: {
                    fitToDisplay() {
                        width.set(w95.shell.display.width);
                        height.set(w95.shell.display.height);
                    },
                },
                Form() {
                    return w95.widget.window({
                        x: 0,
                        y: 0,
                        width: width.now,
                        height: height.now,
                        backgroundColor: w95.palette.named.transparent,
                        styleHints: [
                            w95.styleHint.desktop,
                        ],
                        children: [
                            ...icons,
                            w95.widget.verticalLayout({
                                x: "pw - 15",
                                height: "ph - 15 - (w95.registry.get('taskbar-height') || 0)",
                                styleHints:  [
                                    w95.styleHint.alignBottom,
                                    w95.styleHint.alignRight,
                                ],
                                children: [
                                    w95.widget.label({
                                        color: w95.palette.named.offwhite,
                                        text: `\bw95\b ${w95.version}`,
                                        styleHints: [
                                            w95.styleHint.alignRight,
                                        ],
                                    }),
                                    w95.widget.label({
                                        color: w95.palette.named.offwhite,
                                        text: "A Windows 95 themed web UI framework",
                                    }),
                                    w95.widget.label({
                                        color: w95.palette.named.offwhite,
                                        text: "https://github.com/leikareipa/w95",
                                        styleHints: [
                                            w95.styleHint.underlined,
                                        ],
                                        onMouseDown() {
                                            window.open("https://github.com/leikareipa/w95", "_blank");
                                            return true;
                                        },
                                    }),
                                ],
                            }),
                        ],
                        onMouseDown({widget}) {
                            w95.$recurseDescendantWidgets(widget, (w)=>{w.Message?.blur?.()});
                        },
                    });
                },
            };
        },
    };
}


/***/ }),

/***/ "./src/core/palette.js":
/*!*****************************!*\
  !*** ./src/core/palette.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   palette: () => (/* binding */ palette)
/* harmony export */ });
/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 * 
 * Provides a centralized palette for coloring the various UI elements. Also helps
 * reduce pressure on garbage collection by statically allocating commonly-used color
 * objects.
 * 
 */

const palette = {
    named: {
        transparent: Rngon.color(0, 0, 0, 0),
        offwhite: Rngon.color(230, 230, 230),
        ...Object.keys(Rngon.color).reduce((colors, key)=>({...colors, [key]:Rngon.color[key]}), {}),
    },
    window: {
        background: Rngon.color(192, 192, 192),
        foreground: Rngon.color(0, 0, 0),
        titleBar: {
            background: Rngon.color(0, 0, 128),
            inactiveBackground: Rngon.color(128, 128, 128),
            foreground: Rngon.color(255, 255, 255),
            inactiveForeground: Rngon.color(192, 192, 192),
        },
    },
    widget: {
        background: Rngon.color(192, 192, 192),
        foreground: Rngon.color(0, 0, 0),
        disabled1: Rngon.color(128, 128, 128),
        disabled2: Rngon.color(255, 255, 255),
    },
    frame: {
        background: Rngon.color(255, 255, 255),
        light: Rngon.color(255, 255, 255),
        dark: Rngon.color(0, 0, 0),
        lighter: Rngon.color(223, 223, 223),
        darker: Rngon.color(128, 128, 128),
    },
};


/***/ }),

/***/ "./src/core/popup.js":
/*!***************************!*\
  !*** ./src/core/popup.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   popupWidget: () => (/* binding */ popupWidget)
/* harmony export */ });
/* harmony import */ var _widget_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./widget.js */ "./src/core/widget.js");
/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */



const popupWidget = (0,_widget_js__WEBPACK_IMPORTED_MODULE_0__.create_widget)(function({
    parent = undefined,
    title = "",
    text = "",
    icon = w95.icon.error,
    buttons = [],
    onReject = undefined,
} = {})
{
    w95.debug?.assert(parent?._what === "w95-widget");
    w95.debug?.assert(typeof title === "string");
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(["function", "undefined"].includes(typeof onReject));
    w95.debug?.assert(Array.isArray(buttons));

    const textWidth = w95.font.stringWidth(text);
    const textHeight = Math.max((2 * w95.font.regular.lineHeight), w95.font.stringHeight(text));
    const width = Math.max(250, (74 + textWidth));
    const height = (87 + textHeight);

    const x = w95.state(0, true);
    const y = w95.state(0, true);
    
    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width },
        get height() { return height },
        Mounted() {
            x.set(parent? ((parent.width / 2) - (width / 2)) : 0);
            y.set(parent? ((parent.height / 2) - height) : 0);
        },
        Form() {
            return w95.widget.dialog({
                width,
                height,
                title,
                move(deltaX, deltaY) {
                    x.set(deltaX + x.now);
                    y.set(deltaY + y.now);
                },
                children: [
                    w95.widget.bitmap({
                        x: 10,
                        y: 10,
                        image: icon,
                    }),
                    w95.widget.label({
                        x: 58,
                        y: 12,
                        height: textHeight,
                        text,
                        styleHints: [
                            w95.styleHint.alignVCenter,
                        ],
                    }),
                    w95.widget.horizontalLayout({
                        y: 29 + textHeight,
                        width: "pw",
                        styleHints:  [
                            w95.styleHint.alignHCenter,
                        ],
                        children: buttons,
                    }),
                ],
                onClose: onReject,
            });
        },
    };
});


/***/ }),

/***/ "./src/core/registry.js":
/*!******************************!*\
  !*** ./src/core/registry.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registry: () => (/* binding */ registry)
/* harmony export */ });
/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

const _registry = {};

const registry = {
    get(key) {
        w95.debug?.assert(typeof key === "string");
        return _registry[key];
    },
    set(key, value) {
        w95.debug?.assert(typeof key === "string");
        if (_registry[key] !== value) {
            _registry[key] = value;
            w95.shell.refresh();
        }
        return _registry[key];
    },
    increment(key) {
        w95.debug?.assert(typeof key === "string");
        w95.debug?.assert(typeof _registry[key] === "number");
        return this.set(key, (this.get(key) + 1));
    },
};


/***/ }),

/***/ "./src/core/render.js":
/*!****************************!*\
  !*** ./src/core/render.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderOptions: () => (/* binding */ renderOptions),
/* harmony export */   renderPipeline: () => (/* binding */ renderPipeline)
/* harmony export */ });
/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 * Software: w95
 * 
 */

// Custom render::pipeline for the retro n-gon renderer.
const renderPipeline = {
    rasterizer: rasterize,
    transformClipLighter: transform_clip_light,
    surfaceWiper: surface_wipe,
};

// Custom render::options for the retro n-gon renderer.
const renderOptions = {
    useFullInterpolation: false,
    farPlane: 1,
};

function rasterize(renderContext)
{
    const fallbackRasterizer = Rngon.default.render.pipeline.rasterizer;

    for (const ngon of renderContext.screenSpaceNgons)
    {
        switch (ngon.vertices.length)
        {
            case 0: continue;
            case 1: fallbackRasterizer.point(renderContext, ngon.vertices[0], ngon.material.color); break;
            case 2: draw_straight_line(renderContext, ngon); break;
            default: draw_rectangular_poly(renderContext, ngon); break;
        }
    }
    
    return;
}

function draw_rectangular_poly(renderContext, ngon) {
    const depthBuffer = renderContext.depthBuffer.data;
    const pixelBuffer32 = renderContext.pixelBuffer32;
    const renderWidth = renderContext.resolution.width;

    const material = ngon.material;
    const texture = (material.texture || null);

    const clipRect = ngon._clipRect;
    const ngonStartY = Math.max(clipRect.top, ngon.vertices[0].y);
    const ngonEndY = Math.min(clipRect.bottom, ngon.vertices[2].y);
    const yOffset = (ngonStartY - ngon.vertices[0].y);

    if (!texture)
    {
        const spanStartX = Math.max(clipRect.left, ngon.vertices[0].x);
        const spanEndX = Math.min(clipRect.right, ngon.vertices[1].x);
        const depth = ngon.vertices[0].z;

        const {red, green, blue, alpha} = material.color;

        for (let y = ngonStartY; y < ngonEndY; y++)
        {
            for (let x = spanStartX; x < spanEndX; x++)
            {
                const pixelBufferIdx = (x + y * renderWidth);

                if (depthBuffer[pixelBufferIdx] <= depth)
                {
                    continue;
                }
                
                pixelBuffer32[pixelBufferIdx] = (
                    (alpha << 24) +
                    (blue << 16) +
                    (green << 8) +
                    ~~red
                );

                depthBuffer[pixelBufferIdx] = depth;
            }
        }
    }
    else
    {
        const spanStartX = Math.max(clipRect.left, ngon.vertices[0].x);
        const spanEndX = Math.min(clipRect.right, ngon.vertices[1].x);
        const xOffset = (spanStartX - ngon.vertices[0].x);
        
        const depth = ngon.vertices[0].z;
        const texels = texture.pixels;
      
        for (let y = ngonStartY; y < ngonEndY; y++)
        {
            let pixelBufferIdx = ((y * renderWidth) + spanStartX);
            let texelIdx = (4 * ~~(((y - ngonStartY + yOffset) * texture.width) + xOffset));

            for (let x = spanStartX; x < spanEndX; x++)
            {
                if (
                    (!material.allowAlphaReject || (texels[texelIdx + 3] > 127)) &&
                    (depthBuffer[pixelBufferIdx] > depth)
                ){
                    let red;
                    let green;
                    let blue;

                    if (texture.boolean) {
                        red   = material.color.red;
                        green = material.color.green;
                        blue  = material.color.blue;
                    }
                    else {
                        red   = (texels[texelIdx + 0] * material.color.unitRange.red);
                        green = (texels[texelIdx + 1] * material.color.unitRange.green);
                        blue  = (texels[texelIdx + 2] * material.color.unitRange.blue);
                    }
                    
                    if (material.isDisabled) {
                        red = green = blue = ((red * 0.5) + (green * 0.3) + (blue * 0.2));
                    }
    
                    if (material.isColorInverted) {
                        red = (255 - red);
                        green = (255 - green);
                        blue = (255 - blue);
                    }

                    pixelBuffer32[pixelBufferIdx] = (
                        (255 << 24) +
                        (blue << 16) +
                        (green << 8) +
                        ~~red
                    );

                    depthBuffer[pixelBufferIdx] = depth;
                }

                pixelBufferIdx++;
                texelIdx += 4;
            }
        }
    }
}

function draw_straight_line(renderContext, ngon) {
    w95.debug?.assert(ngon.vertices.length === 2);

    const color = ngon.material.color;
    if (color.alpha < 255) {
        return;
    }

    const resolution = renderContext.resolution;
    const vert1 = ngon.vertices[0];
    const vert2 = ngon.vertices[1];
    if (
        ((vert1.x < 0) && (vert2.x < 0)) ||
        ((vert1.y < 0) && (vert2.y < 0)) ||
        ((vert1.x >= resolution.width) && (vert2.x >= resolution.width)) ||
        ((vert1.y >= resolution.height) && (vert2.y >= resolution.height))
    ){
        return;
    }
    
    const depthBuffer = (renderContext.useDepthBuffer? renderContext.depthBuffer.data : null);
    const pixelBuffer = new Uint32Array(renderContext.pixelBuffer.data.buffer);
    const renderWidth = renderContext.pixelBuffer.width;
    const clipRect = ngon._clipRect;

    const depth = vert1.z;
    const startX = Math.max(clipRect.left, vert1.x);
    const startY = Math.max(clipRect.top, vert1.y);
    const endX = Math.min(clipRect.right, vert2.x);
    const endY = Math.min(clipRect.bottom, vert2.y);
    const isHorizontal = (startY === endY);

    const color32 = (
        (255 << 24) +
        (color.blue << 16) +
        (color.green << 8) +
        ~~color.red
    );

    let start = (isHorizontal? startX : startY);
    const end = (isHorizontal? endX : endY);

    let pixelIdx = (startX + startY * renderWidth);
    const idxIncrement = (isHorizontal? 1 : renderWidth);

    while (start++ < end) {
        if (depthBuffer[pixelIdx] > depth) {
            pixelBuffer[pixelIdx] = color32;
            depthBuffer[pixelIdx] = depth;
        }
        pixelIdx += idxIncrement;
    }
};

function transform_clip_light({renderContext, mesh}) {
    // The n-gons are pre-transformed, so we just need to insert them into the
    // renderer context. Note that we expect the entire UI to consist of a single
    // mesh.
    renderContext.screenSpaceNgons = mesh.ngons.filter(ngon=>ngon.vertices.length);

    for (const ngon of renderContext.screenSpaceNgons) {
        for (const vertex of ngon.vertices) {
            vertex.x = Math.floor(vertex.x);
            vertex.y = Math.floor(vertex.y);
        }

        if (!ngon._clipRect) {
            ngon._clipRect = {
                top: 0,
                left: 0,
                right: renderContext.resolution.width,
                bottom: renderContext.resolution.height,
            }
        }

        ngon._clipRect.top = ~~Math.max(ngon._clipRect.top, 0);
        ngon._clipRect.bottom = ~~Math.min(ngon._clipRect.bottom, renderContext.resolution.height);
        ngon._clipRect.left = ~~Math.max(ngon._clipRect.left, 0);
        ngon._clipRect.right = ~~Math.min(ngon._clipRect.right, renderContext.resolution.width);
    }
}

function surface_wipe(renderContext) {
    const depthBuffer = renderContext.depthBuffer;
    const pixelBuffer = renderContext.pixelBuffer32;
    const app = w95.windowManager.apps.find(a=>a.id === renderContext.contextName);

    if (app._dirtyRegion) {
        for (const region of app._dirtyRegion) {
            let idx = (region.x + region.y * depthBuffer.width);
            const yOffs = (depthBuffer.width - region.width);

            if (region.isStatic) {
                for (let y = 0; y < region.height; y++) {
                    for (let x = 0; x < region.width; x++) {
                        depthBuffer.data[idx++] = Infinity;
                    }
                    idx += yOffs;
                }
            }
            else {
                for (let y = 0; y < region.height; y++) {
                    for (let x = 0; x < region.width; x++) {
                        pixelBuffer[idx] = 0;
                        depthBuffer.data[idx] = Infinity;
                        idx++;
                    }
                    idx += yOffs;
                }
            }
        }
    }
    // If there's no specific dirty region, wipe the entire surface.
    else {
        Rngon.default.render.pipeline.surfaceWiper(renderContext);
    }
}


/***/ }),

/***/ "./src/core/rngon.js":
/*!***************************!*\
  !*** ./src/core/rngon.js ***!
  \***************************/
/***/ (() => {

(()=>{"use strict";var e={d:(t,r)=>{for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{Rngon:()=>te});const r="object"==typeof window?void 0:function(e,t){if(!e)throw new Error(t)},n="object"==typeof window?void 0:function(e,t,a=t.properties,o=""){r?.(e&&"object"==typeof e,"Schemas can't be evaluated for non-object types."),r?.(t&&"object"==typeof t&&a&&"object"==typeof a&&"string"==typeof o,"Malformed schema.");{const r=Object.keys(e),n=Object.keys(a).filter((e=>!r.includes(e))).filter((e=>!a[e].optional));if(n.length)throw new Error(`Missing property '${n.map((e=>o+e)).join("', '")}' ${t.where}.`)}for(const[r,l]of Object.entries(e)){if(!a.hasOwnProperty(r)){if(t.allowAdditionalProperties)continue;throw new Error(`Unsupported property '${o+r}' ${t.where}.`)}const e=a[r],s=e?.type||e,c=i(l);if(e.hasOwnProperty?.("value")){const n=e.value;switch(typeof n){case"function":{const e=n(l);if("string"==typeof e)throw new Error(e);break}default:if(l!==n)throw new Error(`The property '${o+r}' ${t.where} doesn't evaluate to "${e.value}".`)}}else if(e.hasOwnProperty?.("subschema")){if("object"!==c.toLowerCase())throw new TypeError(`The property '${o+r}' ${t.where} must be of type Object.`);n(l,{...e.subschema,where:t.where},e.subschema.properties||e.subschema,`${o}${r}.`)}else{if(!Array.isArray(s))throw new SyntaxError("Invalid schema");if("array"===c){const e=s.filter((e=>Array.isArray(e)));let n=!1;for(let t of e)if(t=t.map((e=>e.toLowerCase())),n=l.every((e=>t.includes(i(e).toLowerCase()))),n)break;if(!n)throw new TypeError(`The array '${o+r}' ${t.where} contains one or more unsupported element types.`)}else if(!s.filter((e=>"string"==typeof e)).map((e=>e.toLowerCase())).includes(c.toLowerCase()))throw new TypeError(`The property '${o+r}' ${t.where} is of unsupported type "${c}".`)}}function i(e){return null===e?"null":Array.isArray(e)?"array":"string"==typeof e?.$constructor?e.$constructor:"function"==typeof e?.constructor?e.constructor.name:typeof e}},a={arguments:{where:"in arguments to Rngon::matrix()",properties:{data:{type:[["number"]],value(e){if(16!==e.length)return"Matrices must be 4 x 4"}}}},interface:{where:"in the return value of Rngon::matrix()",properties:{$constructor:{value:"Matrix"},data:{type:[["number"]],value(e){if(16!==e.length)return"Matrices must be 4 x 4"}}}}};function o(...e){e.length||(e=o.identity().data),n?.({data:e},a.arguments);const t={$constructor:"Matrix",data:e};return n?.(t,a.interface),t}o.multiply=function(e=o(),t=o()){let r=o();for(let n=0;n<4;n++)for(let a=0;a<16;a+=4)r.data[n+a]=e.data[n]*t.data[a]+e.data[n+4]*t.data[a+1]+e.data[n+8]*t.data[a+2]+e.data[n+12]*t.data[a+3];return r},o.identity=function(){return o(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)},o.scaling=function(e=0,t=0,r=0){return o(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1)},o.translating=function(e=0,t=0,r=0){return o(1,0,0,0,0,1,0,0,0,0,1,0,e,t,r,1)},o.rotating=function(e=0,t=0,r=0){const n=Math.PI/180;e*=n,t*=n,r*=n;const a=Math.sin(e),i=Math.cos(e),l=Math.sin(t),s=Math.cos(t),c=Math.sin(r),f=Math.cos(r),u=o(1,0,0,0,0,i,-a,0,0,a,i,0,0,0,0,1),d=o(s,0,l,0,0,1,0,0,-l,0,s,0,0,0,0,1),h=o(f,-c,0,0,c,f,0,0,0,0,1,0,0,0,0,1);return o.multiply(u,o.multiply(d,h))};const i={arguments:{where:"in arguments to Rngon::vertex()",properties:{x:["number"],y:["number"],z:["number"],u:["number"],v:["number"],w:["number"],shade:["number"],worldX:["number"],worldY:["number"],worldZ:["number"],normalX:["number"],normalY:["number"],normalZ:["number"]}},interface:{where:"in the return value of Rngon::vertex()",properties:{$constructor:{value:"Vertex"},x:["number"],y:["number"],z:["number"],u:["number"],v:["number"],w:["number"],shade:["number"],worldX:["number"],worldY:["number"],worldZ:["number"],normalX:["number"],normalY:["number"],normalZ:["number"]}}};function l(e=0,t=0,r=0,a=0,o=0,l=1,s=0,c=0,f=1,u=1,d=e,h=t,m=r){n?.({x:e,y:t,z:r,u:a,v:o,w:f,shade:u,worldX:d,worldY:h,worldZ:m,normalX:l,normalY:s,normalZ:c},i.arguments);const p={$constructor:"Vertex",x:e,y:t,z:r,u:a,v:o,w:f,shade:u,worldX:d,worldY:h,worldZ:m,normalX:l,normalY:s,normalZ:c};return n?.(p,i.interface),p}l.transform=function(e=l(),t=o()){const r=t.data[0]*e.x+t.data[4]*e.y+t.data[8]*e.z+t.data[12]*e.w,n=t.data[1]*e.x+t.data[5]*e.y+t.data[9]*e.z+t.data[13]*e.w,a=t.data[2]*e.x+t.data[6]*e.y+t.data[10]*e.z+t.data[14]*e.w,i=t.data[3]*e.x+t.data[7]*e.y+t.data[11]*e.z+t.data[15]*e.w;e.x=r,e.y=n,e.z=a,e.w=i};const s={interface:{where:"in the return value of Rngon::vector()",properties:{$constructor:{value:"Vector"},x:["number"],y:["number"],z:["number"]}},arguments:{where:"in arguments to Rngon::vector()",properties:{x:["number"],y:["number"],z:["number"]}}};function c(e=0,t=0,r=0){n?.({x:e,y:t,z:r},s.arguments);const a={$constructor:"Vector",x:e,y:t,z:r};return n?.(a,s.interface),a}c.transform=function(e=c(),t=Matrix()){const r=t.data[0]*e.x+t.data[4]*e.y+t.data[8]*e.z,n=t.data[1]*e.x+t.data[5]*e.y+t.data[9]*e.z,a=t.data[2]*e.x+t.data[6]*e.y+t.data[10]*e.z;e.x=r,e.y=n,e.z=a},c.normalize=function(e=c()){const t=e.x*e.x+e.y*e.y+e.z*e.z;if(0!=t&&1!=t){const r=1/Math.sqrt(t);e.x*=r,e.y*=r,e.z*=r}},c.dot=function(e=c(),t=c()){return e.x*t.x+e.y*t.y+e.z*t.z},c.cross=function(e=c(),t=c()){const r=c();return r.x=e.y*t.z-e.z*t.y,r.y=e.z*t.x-e.x*t.z,r.z=e.x*t.y-e.y*t.x,r},c.invert=function(e=vector()){e.x*=-1,e.y*=-1,e.z*=-1};const f={arguments:{where:"in arguments to Rngon::color()",properties:{red:["number"],green:["number"],blue:["number"],alpha:["number"]}},interface:{where:"in the return value of Rngon::color()",properties:{$constructor:{value:"Color"},red:["number"],green:["number"],blue:["number"],alpha:["number"],unitRange:{subschema:{red:["number"],green:["number"],blue:["number"],alpha:["number"]}}}}};function u(e=0,t=0,a=0,o=255){n?.({red:e,green:t,blue:a,alpha:o},f.arguments),r?.(e>=0&&e<=255&&t>=0&&t<=255&&a>=0&&a<=255&&o>=0&&o<=255,"One or more of the given color values are out of range.");const i={$constructor:"Color",red:e,green:t,blue:a,alpha:o,unitRange:{red:e/255,green:t/255,blue:a/255,alpha:o/255}};return n?.(i,f.interface),i}u.aliceblue=Object.freeze(u(240,248,255)),u.antiquewhite=Object.freeze(u(250,235,215)),u.aqua=Object.freeze(u(0,255,255)),u.aquamarine=Object.freeze(u(127,255,212)),u.azure=Object.freeze(u(240,255,255)),u.beige=Object.freeze(u(245,245,220)),u.bisque=Object.freeze(u(255,228,196)),u.black=Object.freeze(u(0,0,0)),u.blanchedalmond=Object.freeze(u(255,235,205)),u.blue=Object.freeze(u(0,0,255)),u.blueviolet=Object.freeze(u(138,43,226)),u.brown=Object.freeze(u(165,42,42)),u.burlywood=Object.freeze(u(222,184,135)),u.cadetblue=Object.freeze(u(95,158,160)),u.chartreuse=Object.freeze(u(127,255,0)),u.chocolate=Object.freeze(u(210,105,30)),u.coral=Object.freeze(u(255,127,80)),u.cornflowerblue=Object.freeze(u(100,149,237)),u.cornsilk=Object.freeze(u(255,248,220)),u.crimson=Object.freeze(u(220,20,60)),u.cyan=Object.freeze(u(0,255,255)),u.darkblue=Object.freeze(u(0,0,139)),u.darkcyan=Object.freeze(u(0,139,139)),u.darkgoldenrod=Object.freeze(u(184,134,11)),u.darkgray=Object.freeze(u(169,169,169)),u.darkgreen=Object.freeze(u(0,100,0)),u.darkgrey=Object.freeze(u(169,169,169)),u.darkkhaki=Object.freeze(u(189,183,107)),u.darkmagenta=Object.freeze(u(139,0,139)),u.darkolivegreen=Object.freeze(u(85,107,47)),u.darkorange=Object.freeze(u(255,140,0)),u.darkorchid=Object.freeze(u(153,50,204)),u.darkred=Object.freeze(u(139,0,0)),u.darksalmon=Object.freeze(u(233,150,122)),u.darkseagreen=Object.freeze(u(143,188,143)),u.darkslateblue=Object.freeze(u(72,61,139)),u.darkslategray=Object.freeze(u(47,79,79)),u.darkslategrey=Object.freeze(u(47,79,79)),u.darkturquoise=Object.freeze(u(0,206,209)),u.darkviolet=Object.freeze(u(148,0,211)),u.deeppink=Object.freeze(u(255,20,147)),u.deepskyblue=Object.freeze(u(0,191,255)),u.dimgray=Object.freeze(u(105,105,105)),u.dimgrey=Object.freeze(u(105,105,105)),u.dodgerblue=Object.freeze(u(30,144,255)),u.firebrick=Object.freeze(u(178,34,34)),u.floralwhite=Object.freeze(u(255,250,240)),u.forestgreen=Object.freeze(u(34,139,34)),u.fuchsia=Object.freeze(u(255,0,255)),u.gainsboro=Object.freeze(u(220,220,220)),u.ghostwhite=Object.freeze(u(248,248,255)),u.gold=Object.freeze(u(255,215,0)),u.goldenrod=Object.freeze(u(218,165,32)),u.gray=Object.freeze(u(128,128,128)),u.green=Object.freeze(u(0,128,0)),u.greenyellow=Object.freeze(u(173,255,47)),u.grey=Object.freeze(u(128,128,128)),u.honeydew=Object.freeze(u(240,255,240)),u.hotpink=Object.freeze(u(255,105,180)),u.indianred=Object.freeze(u(205,92,92)),u.indigo=Object.freeze(u(75,0,130)),u.ivory=Object.freeze(u(255,255,240)),u.khaki=Object.freeze(u(240,230,140)),u.lavender=Object.freeze(u(230,230,250)),u.lavenderblush=Object.freeze(u(255,240,245)),u.lawngreen=Object.freeze(u(124,252,0)),u.lemonchiffon=Object.freeze(u(255,250,205)),u.lightblue=Object.freeze(u(173,216,230)),u.lightcoral=Object.freeze(u(240,128,128)),u.lightcyan=Object.freeze(u(224,255,255)),u.lightgoldenrodyellow=Object.freeze(u(250,250,210)),u.lightgray=Object.freeze(u(211,211,211)),u.lightgreen=Object.freeze(u(144,238,144)),u.lightgrey=Object.freeze(u(211,211,211)),u.lightpink=Object.freeze(u(255,182,193)),u.lightsalmon=Object.freeze(u(255,160,122)),u.lightseagreen=Object.freeze(u(32,178,170)),u.lightskyblue=Object.freeze(u(135,206,250)),u.lightslategray=Object.freeze(u(119,136,153)),u.lightslategrey=Object.freeze(u(119,136,153)),u.lightsteelblue=Object.freeze(u(176,196,222)),u.lightyellow=Object.freeze(u(255,255,224)),u.lime=Object.freeze(u(0,255,0)),u.limegreen=Object.freeze(u(50,205,50)),u.linen=Object.freeze(u(250,240,230)),u.magenta=Object.freeze(u(255,0,255)),u.maroon=Object.freeze(u(128,0,0)),u.mediumaquamarine=Object.freeze(u(102,205,170)),u.mediumblue=Object.freeze(u(0,0,205)),u.mediumorchid=Object.freeze(u(186,85,211)),u.mediumpurple=Object.freeze(u(147,112,219)),u.mediumseagreen=Object.freeze(u(60,179,113)),u.mediumslateblue=Object.freeze(u(123,104,238)),u.mediumspringgreen=Object.freeze(u(0,250,154)),u.mediumturquoise=Object.freeze(u(72,209,204)),u.mediumvioletred=Object.freeze(u(199,21,133)),u.midnightblue=Object.freeze(u(25,25,112)),u.mintcream=Object.freeze(u(245,255,250)),u.mistyrose=Object.freeze(u(255,228,225)),u.moccasin=Object.freeze(u(255,228,181)),u.navajowhite=Object.freeze(u(255,222,173)),u.navy=Object.freeze(u(0,0,128)),u.oldlace=Object.freeze(u(253,245,230)),u.olive=Object.freeze(u(128,128,0)),u.olivedrab=Object.freeze(u(107,142,35)),u.orange=Object.freeze(u(255,165,0)),u.orangered=Object.freeze(u(255,69,0)),u.orchid=Object.freeze(u(218,112,214)),u.palegoldenrod=Object.freeze(u(238,232,170)),u.palegreen=Object.freeze(u(152,251,152)),u.paleturquoise=Object.freeze(u(175,238,238)),u.palevioletred=Object.freeze(u(219,112,147)),u.papayawhip=Object.freeze(u(255,239,213)),u.peachpuff=Object.freeze(u(255,218,185)),u.peru=Object.freeze(u(205,133,63)),u.pink=Object.freeze(u(255,192,203)),u.plum=Object.freeze(u(221,160,221)),u.powderblue=Object.freeze(u(176,224,230)),u.purple=Object.freeze(u(128,0,128)),u.red=Object.freeze(u(255,0,0)),u.rosybrown=Object.freeze(u(188,143,143)),u.royalblue=Object.freeze(u(65,105,225)),u.saddlebrown=Object.freeze(u(139,69,19)),u.salmon=Object.freeze(u(250,128,114)),u.sandybrown=Object.freeze(u(244,164,96)),u.seagreen=Object.freeze(u(46,139,87)),u.seashell=Object.freeze(u(255,245,238)),u.sienna=Object.freeze(u(160,82,45)),u.silver=Object.freeze(u(192,192,192)),u.skyblue=Object.freeze(u(135,206,235)),u.slateblue=Object.freeze(u(106,90,205)),u.slategray=Object.freeze(u(112,128,144)),u.slategrey=Object.freeze(u(112,128,144)),u.snow=Object.freeze(u(255,250,250)),u.springgreen=Object.freeze(u(0,255,127)),u.steelblue=Object.freeze(u(70,130,180)),u.tan=Object.freeze(u(210,180,140)),u.teal=Object.freeze(u(0,128,128)),u.thistle=Object.freeze(u(216,191,216)),u.tomato=Object.freeze(u(255,99,71)),u.turquoise=Object.freeze(u(64,224,208)),u.violet=Object.freeze(u(238,130,238)),u.wheat=Object.freeze(u(245,222,179)),u.white=Object.freeze(u(255,255,255)),u.whitesmoke=Object.freeze(u(245,245,245)),u.yellow=Object.freeze(u(255,255,0)),u.yellowgreen=Object.freeze(u(154,205,50));const d={color:u.white,wireframeColor:u.black,texture:void 0,textureMapping:"ortho",textureFiltering:"none",uvWrapping:"repeat",vertexShading:"none",renderVertexShade:!0,ambientLightLevel:0,hasWireframe:!1,hasFill:!0,isTwoSided:!1,isInScreenSpace:!1,allowAlphaReject:!1,allowAlphaBlend:!1,depthOffset:0},h={arguments:{where:"in arguments to Rngon::ngon()",properties:{vertices:[["Vertex"]],material:["object"],vertexNormals:[["Vector"],"Vector"]}},interface:{where:"in the return value of Rngon::ngon()",properties:{$constructor:{value:"Ngon"},vertices:[["Vertex"]],vertexNormals:[["Vector"]],normal:["Vector"],material:{subschema:{allowAdditionalProperties:!0,properties:{color:["Color"],wireframeColor:["Color"],texture:["undefined","null","Texture"],textureMapping:["string"],textureFiltering:["string"],uvWrapping:["string"],vertexShading:["string"],renderVertexShade:["boolean"],ambientLightLevel:["number"],hasWireframe:["boolean"],hasFill:["boolean"],isTwoSided:["boolean"],isInScreenSpace:["boolean"],allowAlphaReject:["boolean"],allowAlphaBlend:["boolean"],depthOffset:["number"]}}},mipLevel:["number"]}}};function m(e=[l()],t={},r=c(0,1,0)){for(const e of Object.keys(d))t.hasOwnProperty(e)||(t[e]=d[e]);n?.({vertices:e,material:t,vertexNormals:r},h.arguments),Array.isArray(r)||(r=new Array(e.length).fill().map((e=>c(r.x,r.y,r.z))));const a=r.reduce(((e,t)=>(e.x+=t.x,e.y+=t.y,e.z+=t.z,e)),c(0,0,0));c.normalize(a);{const t=e.map((e=>e.u)).some((e=>e<0)),r=e.map((e=>e.v)).some((e=>e<0));if(t||r)for(const n of e)t&&0===n.u&&(n.u=-Number.EPSILON),r&&0===n.v&&(n.v=-Number.EPSILON)}const o={$constructor:"Ngon",vertices:e,vertexNormals:r,normal:a,material:t,mipLevel:0};return n?.(o,h.interface),o}m.perspective_divide=function(e=m()){for(const t of e.vertices)t.x/=t.w,t.y/=t.w},m.transform=function(e=m(),t=o()){for(const r of e.vertices)l.transform(r,t)};const p=["x","y","z"],g=[1,-1];function x(e,t,r){return e+r*(t-e)}m.clip_to_viewport=function(e){for(const t of p)for(const r of g){if(!e.vertices.length)break;if(1==e.vertices.length){if(e.vertices[0].x<=e.vertices[0].w&&-e.vertices[0].x<=e.vertices[0].w&&e.vertices[0].y<=e.vertices[0].w&&-e.vertices[0].y<=e.vertices[0].w&&e.vertices[0].z<=e.vertices[0].w&&-e.vertices[0].z<=e.vertices[0].w)break;e.vertices.length=0;break}let n=e.vertices[e.vertices.length-(2==e.vertices.length?2:1)],a=n[t]*r,o=a<=n.w,i=0;const s=e.vertices.length;for(let c=0;c<s;c++){const f=e.vertices[c],u=f[t]*r,d=u<=f.w;if(d^o){const t=(n.w-a)/(n.w-a-(f.w-u));e.vertices[s+i++]=l(x(n.x,f.x,t),x(n.y,f.y,t),x(n.z,f.z,t),x(n.u,f.u,t),x(n.v,f.v,t),x(n.normalX,f.normalX,t),x(n.normalY,f.normalY,t),x(n.normalZ,f.normalZ,t),x(n.w,f.w,t),x(n.shade,f.shade,t),x(n.worldX,f.worldX,t),x(n.worldY,f.worldY,t),x(n.worldZ,f.worldZ,t))}d&&(e.vertices[s+i++]=f),n=f,a=u,o=d}e.vertices.splice(0,s)}};const b={enabled:[[[.25,0],[.5,.75]],[[.75,.5],[0,.25]]],disabled:[[[0,0],[0,0]],[[0,0],[0,0]]]};function v({renderContext:e,ngon:t,leftEdges:r,rightEdges:n,numLeftEdges:a,numRightEdges:o}){if(!a||!o)return!0;const i=e.useFullInterpolation,l=e.useFragmentBuffer,s=e.fragments,c=e.fragmentBuffer.data,f=e.useDepthBuffer?e.depthBuffer.data:null,u=e.pixelBuffer.width,d=t.material,h=d.texture||null,m=h&&"dither"===d.textureFiltering?b.enabled:b.disabled;let p=null,g=0;if(h){const e=h.mipLevels.length;g=Math.max(0,Math.min(e-1,Math.round((e-1)*t.mipLevel))),p=h.mipLevels[g]}let x=0,v=0,w=r[x],y=n[v];const z=r[0].top,j=r[a-1].bottom;let O=z-1;for(;++O<j;){const a=Math.min(u,Math.max(0,Math.round(w.x))),o=Math.min(u,Math.max(0,Math.ceil(y.x))),g=o-a+1;if(g>0){const r=i?1:w.invW,n=i?1:y.invW,x=i?(y.invW-w.invW)/g:0,b=i?w.invW:1,v=(y.depth/n-w.depth/r)/g,B=w.depth/r,M=(y.shade/n-w.shade/r)/g,S=w.shade/r,k=(y.u/n-w.u/r)/g,C=w.u/r,P=(y.v/n-w.v/r)/g,W=w.v/r,E=(y.worldX/n-w.worldX/r)/g,A=w.worldX/r,L=(y.worldY/n-w.worldY/r)/g,N=w.worldY/r,X=(y.worldZ/n-w.worldZ/r)/g,Y=w.worldZ/r,Z=(y.normalX/n-w.normalX/r)/g,$=w.normalX/r,R=(y.normalY/n-w.normalY/r)/g,V=w.normalY/r,D=(y.normalZ/n-w.normalZ/r)/g,T=w.normalZ/r;let F=a+O*u-1,I=a-1,U=0;for(;++I<o;){let r=0,n=0;const o=B+v*U,i=S+M*U,u=C+k*U,w=W+P*U,y=b+x*U,q=A+E*U,H=N+L*U,G=Y+X*U,J=$+Z*U,K=V+R*U,Q=T+D*U;F++,U++;const ee=o/y;if(f&&f[F]<=ee)continue;let te=d.renderVertexShade?i/y:1,re=0,ne=0,ae=0;if(h){switch(d.textureMapping){case"affine":switch(r=u/y,n=w/y,d.uvWrapping){case"clamp":{const e=1-Number.EPSILON;r=r<0?e+r:r,n=n<0?e+n:n;const t=m[1&O][1&I];r+=t[0]/p.width,n+=t[1]/p.height,r=p.width*(r<0?0:r>e?e:r),n=p.height*(n<0?0:n>e?e:n);break}case"repeat":{const e=m[1&O][1&I];r+=e[0]/p.width,n+=e[1]/p.height,r=p.width*(r-Math.floor(r)),n=p.height*(n-Math.floor(n));const t=Math.abs(r),a=Math.abs(n),o=t-~~t,i=a-~~a;r=(r&p.width-1)+o,n=(n&p.height-1)+i;break}default:throw new Error("Unrecognized UV wrapping mode.")}break;case"affine-npot":{r=u/y,n=w/y;const e=1-Number.EPSILON;r=r<0?e+r:r,n=n<0?e+n:n;const t=m[1&O][1&I];r+=t[0]/p.width,n+=t[1]/p.height,r=p.width*(r<0?0:r>e?e:r),n=p.height*(n<0?0:n>e?e:n)}break;case"ortho":{const e=j-z,t=I-a+1,o=O-z+1,i=m[1&O][1&I];r+=i[0],n+=i[1],r=t*(p.width/g),n=o*(p.height/e),n=p.height-n;break}default:throw new Error("Unknown texture-mapping mode.")}const e=4*(~~r+~~n*p.width);if(d.allowAlphaReject&&255!==p.pixels[e+3])continue;if(d.allowAlphaBlend&&_.stipple_test(d.color.alpha,I,O))continue;re=p.pixels[e+0],ne=p.pixels[e+1],ae=p.pixels[e+2]}else{if(d.allowAlphaBlend&&_.stipple_test(d.color.alpha,I,O))continue;re=d.color.red*te,ne=d.color.green*te,ae=d.color.blue*te}if(re*=te*d.color.unitRange.red,ne*=te*d.color.unitRange.green,ae*=te*d.color.unitRange.blue,te>1){const t=4*F;e.pixelBuffer8[t+0]=re,e.pixelBuffer8[t+1]=ne,e.pixelBuffer8[t+2]=ae,e.pixelBuffer8[t+3]=255}else e.pixelBuffer32[F]=(255<<24)+(ae<<16)+(ne<<8)+~~re;if(f&&(f[F]=ee),l){const e=c[F];!s.ngon||(e.ngon=t),!s.textureUScaled||(e.textureUScaled=~~r),!s.textureVScaled||(e.textureVScaled=~~n),!s.shade||(e.shade=i/y),!s.worldX||(e.worldX=q/y),!s.worldY||(e.worldY=H/y),!s.worldZ||(e.worldZ=G/y),!s.normalX||(e.normalX=J/y),!s.normalY||(e.normalY=K/y),!s.normalZ||(e.normalZ=Q/y)}}}w.x+=w.delta.x,w.depth+=w.delta.depth,w.shade+=w.delta.shade,w.u+=w.delta.u,w.v+=w.delta.v,w.invW+=w.delta.invW,w.worldX+=w.delta.worldX,w.worldY+=w.delta.worldY,w.worldZ+=w.delta.worldZ,w.normalX+=w.delta.normalX,w.normalY+=w.delta.normalY,w.normalZ+=w.delta.normalZ,y.x+=y.delta.x,y.depth+=y.delta.depth,y.shade+=y.delta.shade,y.u+=y.delta.u,y.v+=y.delta.v,y.invW+=y.delta.invW,y.worldX+=y.delta.worldX,y.worldY+=y.delta.worldY,y.worldZ+=y.delta.worldZ,y.normalX+=y.delta.normalX,y.normalY+=y.delta.normalY,y.normalZ+=y.delta.normalZ,O===w.bottom-1&&(w=r[++x]),O===y.bottom-1&&(y=n[++v])}return!0}function w({renderContext:e,ngon:t,leftEdges:r,rightEdges:n,numLeftEdges:a,numRightEdges:o}){const i=e.useFullInterpolation,l=e.useFragmentBuffer,s=e.fragments,c=e.fragmentBuffer.data,f=e.pixelBuffer.width,u=e.useDepthBuffer?e.depthBuffer.data:null,d=t.material;let h=0,m=0,p=r[h],g=n[m];if(!a||!o)return;const x=r[0].top,b=r[a-1].bottom;let v=x-1;for(;++v<b;){const a=Math.min(f,Math.max(0,Math.round(p.x))),o=Math.min(f,Math.max(0,Math.ceil(g.x))),x=o-a+1;if(x>0){const r=i?1:p.invW,n=i?1:g.invW,h=i?(g.invW-p.invW)/x:0,m=i?p.invW:1,b=(g.depth/n-p.depth/r)/x,w=p.depth/r,y=(g.shade/n-p.shade/r)/x,z=p.shade/r;let j=a+v*f-1,O=a-1,B=0;for(;++O<o;){const r=w+b*B,n=z+y*B,a=m+h*B;j++,B++;const o=r/a;if(!(u[j]<=o)){const r=d.renderVertexShade?n/a:1,i=d.color.red*r,f=d.color.green*r,h=d.color.blue*r;if(r>1){const t=4*j;e.pixelBuffer8[t+0]=i,e.pixelBuffer8[t+1]=f,e.pixelBuffer8[t+2]=h,e.pixelBuffer8[t+3]=255}else e.pixelBuffer32[j]=(255<<24)+(h<<16)+(f<<8)+~~i;if(u[j]=o,l){const e=c[j];!s.ngon||(e.ngon=t),!s.shade||(e.shade=n/a)}}}}p.x+=p.delta.x,p.depth+=p.delta.depth,p.shade+=p.delta.shade,p.invW+=p.delta.invW,g.x+=g.delta.x,g.depth+=g.delta.depth,g.shade+=g.delta.shade,g.invW+=g.delta.invW,v===p.bottom-1&&(p=r[++h]),v===g.bottom-1&&(g=n[++m])}return!0}function y({renderContext:e,ngon:t,leftEdges:r,rightEdges:n,numLeftEdges:a,numRightEdges:o}){if(!a||!o)return!0;const i=e.useFullInterpolation,l=e.useFragmentBuffer,s=e.fragments,c=e.fragmentBuffer.data,f=e.pixelBuffer.width,u=e.useDepthBuffer?e.depthBuffer.data:null,d=t.material,h=d.texture||null;let m=null,p=0;const g=h.mipLevels.length;p=Math.max(0,Math.min(g-1,Math.round((g-1)*t.mipLevel))),m=h.mipLevels[p];let x=0,b=0,v=r[x],w=n[b];const y=r[0].top,z=r[a-1].bottom;let j=y-1;for(;++j<z;){const a=Math.min(f,Math.max(0,Math.round(v.x))),o=Math.min(f,Math.max(0,Math.ceil(w.x))),h=o-a+1;if(h>0){const r=i?1:v.invW,n=i?1:w.invW,p=i?(w.invW-v.invW)/h:0,g=i?v.invW:1,x=(w.depth/n-v.depth/r)/h,b=v.depth/r,y=(w.shade/n-v.shade/r)/h,z=v.shade/r,O=(w.u/n-v.u/r)/h,B=v.u/r,M=(w.v/n-v.v/r)/h,S=v.v/r;let k=a+j*f-1,C=a-1,P=0;for(;++C<o;){const r=b+x*P,n=z+y*P,a=g+p*P,o=B+O*P,i=S+M*P;k++,P++;const f=r/a;if(u[k]<=f)continue;let h=o/a,v=i/a;switch(d.uvWrapping){case"clamp":{const e=1-Number.EPSILON;h=h<0?e+h:h,v=v<0?e+v:v,h=m.width*(h<0?0:h>e?e:h),v=m.height*(v<0?0:v>e?e:v);break}case"repeat":h=m.width*(h-Math.floor(h)),v=m.height*(v-Math.floor(v)),h&=m.width-1,v&=m.height-1;break;default:throw new Error("Unrecognized UV wrapping mode.")}const w=4*(~~h+~~v*m.width);{const r=d.renderVertexShade?n/a:1,o=m.pixels[w+0]*r,i=m.pixels[w+1]*r,p=m.pixels[w+2]*r;if(r>1){const t=4*k;e.pixelBuffer8[t+0]=o,e.pixelBuffer8[t+1]=i,e.pixelBuffer8[t+2]=p,e.pixelBuffer8[t+3]=255}else e.pixelBuffer32[k]=(255<<24)+(p<<16)+(i<<8)+~~o;if(u[k]=f,l){const e=c[k];!s.ngon||(e.ngon=t),!s.textureUScaled||(e.textureUScaled=~~h),!s.textureVScaled||(e.textureVScaled=~~v),!s.shade||(e.shade=n/a)}}}}v.x+=v.delta.x,v.depth+=v.delta.depth,v.shade+=v.delta.shade,v.u+=v.delta.u,v.v+=v.delta.v,v.invW+=v.delta.invW,w.x+=w.delta.x,w.depth+=w.delta.depth,w.shade+=w.delta.shade,w.u+=w.delta.u,w.v+=w.delta.v,w.invW+=w.delta.invW,j===v.bottom-1&&(v=r[++x]),j===w.bottom-1&&(w=n[++b])}return!0}function z({renderContext:e,ngon:t,leftEdges:r,rightEdges:n,numLeftEdges:a,numRightEdges:o}){if(!a||!o)return!0;const i=e.useFullInterpolation,l=e.useFragmentBuffer,s=e.fragments,c=e.fragmentBuffer.data,f=e.pixelBuffer.width,u=e.useDepthBuffer?e.depthBuffer.data:null,d=t.material,h=d.texture||null;let m=null,p=0;const g=h.mipLevels.length;p=Math.max(0,Math.min(g-1,Math.round((g-1)*t.mipLevel))),m=h.mipLevels[p];let x=0,b=0,v=r[x],w=n[b];const y=r[0].top,z=r[a-1].bottom;let j=y-1;for(;++j<z;){const a=Math.min(f,Math.max(0,Math.round(v.x))),o=Math.min(f,Math.max(0,Math.ceil(w.x))),h=o-a+1;if(h>0){const r=i?1:v.invW,n=i?1:w.invW,p=i?(w.invW-v.invW)/h:0,g=i?v.invW:1,x=(w.depth/n-v.depth/r)/h,b=v.depth/r,y=(w.shade/n-v.shade/r)/h,z=v.shade/r,O=(w.u/n-v.u/r)/h,B=v.u/r,M=(w.v/n-v.v/r)/h,S=v.v/r;let k=a+j*f-1,C=a-1,P=0;for(;++C<o;){const r=b+x*P,n=z+y*P,a=g+p*P,o=B+O*P,i=S+M*P;k++,P++;const f=r/a;if(u[k]<=f)continue;let h=o/a,v=i/a;switch(d.uvWrapping){case"clamp":{const e=1-Number.EPSILON;h=h<0?e+h:h,v=v<0?e+v:v,h=m.width*(h<0?0:h>e?e:h),v=m.height*(v<0?0:v>e?e:v);break}case"repeat":{h=m.width*(h-Math.floor(h)),v=m.height*(v-Math.floor(v));const e=Math.abs(h),t=Math.abs(v),r=e-~~e,n=t-~~t;h=(h&m.width-1)+r,v=(v&m.height-1)+n;break}default:throw new Error("Unrecognized UV wrapping mode.")}const w=4*(~~h+~~v*m.width);{const r=d.renderVertexShade?n/a:1,o=m.pixels[w+0]*r*d.color.unitRange.red,i=m.pixels[w+1]*r*d.color.unitRange.green,p=m.pixels[w+2]*r*d.color.unitRange.blue;if(r>1){const t=4*k;e.pixelBuffer8[t+0]=o,e.pixelBuffer8[t+1]=i,e.pixelBuffer8[t+2]=p,e.pixelBuffer8[t+3]=255}else e.pixelBuffer32[k]=(255<<24)+(p<<16)+(i<<8)+~~o;if(u[k]=f,l){const e=c[k];!s.ngon||(e.ngon=t),!s.textureUScaled||(e.textureUScaled=~~h),!s.textureVScaled||(e.textureVScaled=~~v),!s.shade||(e.shade=n/a)}}}}v.x+=v.delta.x,v.depth+=v.delta.depth,v.shade+=v.delta.shade,v.u+=v.delta.u,v.v+=v.delta.v,v.invW+=v.delta.invW,w.x+=w.delta.x,w.depth+=w.delta.depth,w.shade+=w.delta.shade,w.u+=w.delta.u,w.v+=w.delta.v,w.invW+=w.delta.invW,j===v.bottom-1&&(v=r[++x]),j===w.bottom-1&&(w=n[++b])}return!0}function j(e,t=l(),r=l(),n=u(),a=!0){const o=e.useDepthBuffer?e.depthBuffer.data:null,i=e.pixelBuffer.width,s=e.pixelBuffer.height,c=Math.floor(t.x),f=Math.floor(t.y),d=Math.floor(r.x),h=Math.ceil(r.y);let m=Math.ceil(Math.sqrt((d-c)**2+(h-f)**2));const p=(d-c)/m,g=(h-f)/m,x=t.z/e.farPlaneDistance,b=(r.z/e.farPlaneDistance-x)/m,v=a?t.shade:1,w=((a?r.shade:1)-v)/m;let y=0;for(;m--;){const t=c+p*y,r=f+g*y,a=x+b*y,l=v+w*y;y++;const u=~~t,d=~~r,h=u+d*i;if(u>=0&&d>=0&&u<i&&d<s&&(!o||o[h]>=a)){const t=n.red*l,r=n.green*l,i=n.blue*l;if(l>1){const n=4*h;e.pixelBuffer8[n+0]=t,e.pixelBuffer8[n+1]=r,e.pixelBuffer8[n+2]=i,e.pixelBuffer8[n+3]=255}else e.pixelBuffer32[h]=(255<<24)+(i<<16)+(r<<8)+~~t;o&&(o[h]=a)}}return!0}function O(e,t=l(),r=l(),n=u()){const a=e.pixelBuffer.width,o=e.pixelBuffer.height,i=Math.floor(t.x),s=Math.floor(t.y),c=Math.floor(r.x),f=Math.ceil(r.y);let d=Math.ceil(Math.sqrt((c-i)**2+(f-s)**2));const h=(c-i)/d,m=(f-s)/d,p=(255<<24)+(n.blue<<16)+(n.green<<8)+~~n.red;let g=0;for(;d--;){const t=i+h*g,r=s+m*g;g++;const n=~~t,l=~~r;if(n>=0&&l>=0&&n<a&&l<o){const t=n+l*a;e.pixelBuffer32[t]=p}}return!0}function B(e,t=l(),r=u()){const n=e.useDepthBuffer?e.depthBuffer.data:null,a=e.pixelBuffer.width,o=Math.floor(t.x)+Math.floor(t.y)*a,i=t.z/e.farPlaneDistance;if(!(n&&n[o]<=i)){{const a=t.shade,l=r.red*a,s=r.green*a,c=r.blue*a;if(a>1){const t=4*o;e.pixelBuffer8[t+0]=l,e.pixelBuffer8[t+1]=s,e.pixelBuffer8[t+2]=c,e.pixelBuffer8[t+3]=255}else e.pixelBuffer32[o]=(255<<24)+(c<<16)+(s<<8)+~~l;n&&(n[o]=i)}return!0}}function M(e,t=l(),r=u()){return e.pixelBuffer32[Math.floor(t.x)+Math.floor(t.y)*e.pixelBuffer.width]=(255<<24)+(r.blue<<16)+(r.green<<8)+~~r.red,!0}const S=500,k=new Array(S),C=new Array(S),P=new Array(S).fill().map((()=>({top:void 0,bottom:void 0,start:{},delta:{}}))),W=new Array(S).fill().map((()=>({top:void 0,bottom:void 0,start:{},delta:{}}))),E=(e,t)=>e.y===t.y?0:e.y<t.y?-1:1;function _(e){for(const t of e.screenSpaceNgons)switch(r?.(t.vertices.length,"Encountered an n-gon with 0 vertices"),t.vertices.length){case 0:continue;case 1:_.point(e,t.vertices[0],t.material.color);break;case 2:_.line(e,t.vertices[0],t.vertices[1],t.material.color,t.material.renderVertexShade);break;default:_.polygon(e,t)}}_.polygon=function(e,t=m()){r?.(t.vertices.length>=3,"Polygons must have 3 or more vertices"),r?.(t.vertices.length<S,"Overflowing the vertex buffer");const n=e.useFragmentBuffer,a=e.fragments,o=e.useDepthBuffer?e.depthBuffer.data:null,i=e.pixelBuffer.width,l=e.pixelBuffer.height,s=t.material;let c=0,f=0,u=0,d=0;!function(){t.vertices.sort(E);const e=t.vertices[0],r=t.vertices[t.vertices.length-1];k[c++]=e,C[f++]=e;for(let o=1;o<t.vertices.length-1;o++){const i=(n=e.x,a=r.x,n+(t.vertices[o].y-e.y)/(r.y-e.y)*(a-n));t.vertices[o].x>=i?C[f++]=t.vertices[o]:k[c++]=t.vertices[o]}var n,a;k[c++]=r,C[f++]=r}(),function(){for(let e=1;e<c;e++)r(k[e-1],k[e],!0);for(let e=1;e<f;e++)r(C[e-1],C[e],!1);function r(r,a,o){const c=Math.min(l,Math.max(0,Math.floor(r.y))),f=Math.min(l,Math.max(0,Math.floor(a.y))),h=f-c;if(0===h)return;const m=Math.min(i,Math.max(0,Math.floor(r.x))),p=(Math.min(i,Math.max(0,Math.floor(a.x)))-m)/h,g=s.texture?r.u:1,x=s.texture?1-r.v:1,b=s.texture?a.u:1,v=s.texture?1-a.v:1,w=r.w,y=a.w,z=r.z+t.material.depthOffset,j=a.z+t.material.depthOffset,O=o?P[u++]:W[d++];O.top=c,O.bottom=f,O.x=m,O.delta.x=p,O.depth=z/e.farPlaneDistance/w,O.delta.depth=(j/e.farPlaneDistance/y-O.depth)/h,O.shade=r.shade/w,O.delta.shade=(a.shade/y-O.shade)/h,O.u=g/w,O.delta.u=(b/y-O.u)/h,O.v=x/w,O.delta.v=(v/y-O.v)/h,O.invW=1/w,O.delta.invW=(1/y-O.invW)/h,n&&(O.worldX=r.worldX/w,O.delta.worldX=(a.worldX/y-O.worldX)/h,O.worldY=r.worldY/w,O.delta.worldY=(a.worldY/y-O.worldY)/h,O.worldZ=r.worldZ/w,O.delta.worldZ=(a.worldZ/y-O.worldZ)/h,O.normalX=r.normalX/w,O.delta.normalX=(a.normalX/y-O.normalX)/h,O.normalY=r.normalY/w,O.delta.normalY=(a.normalY/y-O.normalY)/h,O.normalZ=r.normalZ/w,O.delta.normalZ=(a.normalZ/y-O.normalZ)/h)}}();const h={renderContext:e,ngon:t,leftEdges:P,rightEdges:W,numLeftEdges:u,numRightEdges:d};if(s.hasFill&&!e.pipeline.raster_path?.(h)){let e=v;!s.texture||!o||a.worldX||a.worldY||a.worldZ||a.normalX||a.normalY||a.normalZ||s.allowAlphaReject||s.allowAlphaBlend||"affine"!==s.textureMapping||"dither"===s.textureFiltering?s.texture||!o||a.worldX||a.worldY||a.worldZ||a.normalX||a.normalY||a.normalZ||s.allowAlphaReject||s.allowAlphaBlend||(e=w):e=255===s.color.red&&255===s.color.green&&255===s.color.blue&&"none"===s.textureFiltering?y:z,e(h)}if(s.hasWireframe){for(let t=1;t<c;t++)_.line(e,k[t-1],k[t],s.wireframeColor,s.renderVertexShade);for(let t=1;t<f;t++)_.line(e,C[t-1],C[t],s.wireframeColor,s.renderVertexShade)}},_.line=function(e,t=l(),r=l(),n=u(),a=!0){if(255!==n.alpha)return;const o=e.pixelBuffer.width,i=e.pixelBuffer.height;if(!(t.x<0&&r.x<0||t.x>=o&&r.x>=o||t.y<0&&r.y<0||t.y>=i&&r.y<i)){let o=j;e.useDepthBuffer||a&&(1!==t.shade||1!==r.shade)||(o=O),o(e,t,r,n,a)}},_.point=function(e,t=l(),r=u()){if(255!=r.alpha)return;const n=e.pixelBuffer.width,a=e.pixelBuffer.height;if(!(t.x<0||t.y<0||t.x>=n||t.y>=a)){let n=B;e.useDepthBuffer||1!==t.shade||(n=M),n(e,t,r)}},_.stipple_test=function(){const e=[{width:8,height:6,pixels:[0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]},{width:4,height:4,pixels:[0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1]},{width:2,height:2,pixels:[1,0,0,1]}];for(let t=e.length-2;t>=0;t--)e.push({width:e[t].width,height:e[t].height,pixels:e[t].pixels.map((e=>Number(!e)))});return function(t,r,n){if(t<=0)return!0;if(t>=255)return!1;{const a=Math.floor(t/(256/e.length)),o=e[a],i=r%o.width+n%o.height*o.width;if(o.pixels[i])return!0}return!1}}();const A={translate:c(0,0,0),rotate:c(0,0,0),scale:c(1,1,1)},L={where:"in arguments to Rngon::mesh()",properties:{ngons:[["Ngon"]],transform:{subschema:{properties:{translate:{optional:!0,type:["Vector"]},rotate:{optional:!0,type:["Vector"]},scale:{optional:!0,type:["Vector"]}}}}}},N={where:"in the return value of Rngon::mesh()",allowAdditionalProperties:!0,properties:{$constructor:{value:"Mesh"},ngons:[["Ngon"]],rotate:["Vector"],translate:["Vector"],scale:["Vector"]}};function X(e,t){r?.(["flat","gouraud"].includes(e.material.vertexShading),`Unrecognized shading mode: ${e.material.vertexShading}`);const n=c();let a=e.material.ambientLightLevel;for(let t=0;t<e.vertices.length;t++)e.vertices[t].shade=e.material.ambientLightLevel;let o=0,i=0,l=0;if("flat"===e.material.vertexShading){for(const t of e.vertices)o+=t.x,i+=t.y,l+=t.z;o/=e.vertices.length,i/=e.vertices.length,l/=e.vertices.length}for(const r of t.lights)if("gouraud"===e.material.vertexShading)for(let t=0;t<e.vertices.length;t++){const a=e.vertices[t],o=1/(1+Math.sqrt((a.x-r.x)**2+(a.y-r.y)**2+(a.z-r.z)**2));n.x=r.x-a.x,n.y=r.y-a.y,n.z=r.z-a.z,c.normalize(n);const i=e.vertices.length<3?1:c.dot(e.vertexNormals[t],n),l=Math.max(0,Math.min(1,i));a.shade=Math.max(a.shade,Math.min(1,l*o*r.intensity))}else if("flat"===e.material.vertexShading){const t=1/(1+Math.sqrt((o-r.x)**2+(i-r.y)**2+(l-r.z)**2));n.x=r.x-o,n.y=r.y-i,n.z=r.z-l,c.normalize(n);const s=e.vertices.length<3?1:c.dot(e.normal,n),f=Math.max(0,Math.min(1,s));a=Math.max(a,Math.min(1,f*t*r.intensity))}if("flat"===e.material.vertexShading)for(let t=0;t<e.vertices.length;t++)e.vertices[t].shade=a}const Y={where:"in arguments to Rngon::surface()",properties:{canvasElement:["HTMLCanvasElement","undefined"],renderContext:["Context"]}},Z={where:"in the return value of Rngon::surface()",properties:{$constructor:{value:"Surface"},width:["number"],height:["number"],display_meshes:["function"],is_in_view:["function"]}};const $="default";function R(e=void 0){return void 0===e&&(e=$),R.list[e]||(R.list[e]=R.instance())}R.instance=function(){return{$constructor:"Context",contextName:void 0,pipeline:{ngon_sorter:void 0,transform_clip_lighter:void 0,surface_wiper:void 0,rasterizer:void 0,vertex_shader:void 0,pixel_shader:void 0,canvas_shader:void 0,raster_path:void 0},resolution:{width:void 0,height:void 0},pixelBuffer:void 0,pixelBuffer8:void 0,pixelBuffer32:void 0,useDepthBuffer:!1,depthBuffer:{width:0,height:0,data:void 0,resize(e,t){this.width=e,this.height=t,this.data=new Float64Array(e*t)},clear(){this.data.fill(1)}},useFragmentBuffer:!1,fragmentBuffer:{width:0,height:0,data:void 0,resize(e,t){this.width=e,this.height=t,this.data=new Array(e*t).fill().map((e=>({})))}},fragments:{ngon:!0,textureUScaled:!0,textureVScaled:!0,shade:!0,worldX:!0,worldY:!0,worldZ:!0,normalX:!0,normalY:!0,normalZ:!0},usePixelShader:!1,pixel_shader:void 0,useVertexShader:!1,vertex_shader:void 0,useCanvasShader:!1,canvas_shader:void 0,renderScale:void 0,useFullInterpolation:!0,nearPlaneDistance:1,farPlaneDistance:1,fov:45,cameraDirection:void 0,cameraPosition:void 0,allowWindowAlert:!1,screenSpaceNgons:[],ngonCache:{count:0,ngons:[]},vertexCache:{count:0,vertices:[]},vertexNormalCache:{count:0,normals:[]},lights:[]}},R.list={[$]:R.instance()};const V={cameraPosition:c(0,0,0),cameraDirection:c(0,0,0),context:void 0,resolution:1,fov:43,nearPlane:1,farPlane:1e3,useDepthBuffer:!0,useFragmentBuffer:!1,useBackfaceCulling:!1,useFullInterpolation:!0,fragments:void 0,hibernateWhenTargetNotVisible:!0,lights:[]},D={ngonSorter:function(e){e.useDepthBuffer&&e.screenSpaceNgons.sort(((e,t)=>{const r=e.vertices.reduce(((e,t)=>e+t.z),0)/e.vertices.length,n=t.vertices.reduce(((e,t)=>e+t.z),0)/t.vertices.length;return r===n?0:r>n?1:-1}))},surfaceWiper:function(e){e.pixelBuffer.data.fill(0),e.useDepthBuffer&&e.depthBuffer.clear()},rasterizer:_,transformClipLighter:function({renderContext:e,mesh:t,cameraMatrix:r,perspectiveMatrix:n,screenSpaceMatrix:a}={}){const i={x:0,y:0,z:0},l=e.ngonCache,s=e.vertexCache,f=e.vertexNormalCache,u=o.multiply(n,r),d=function(e){const t=o.translating(e.translate.x,e.translate.y,e.translate.z),r=o.rotating(e.rotate.x,e.rotate.y,e.rotate.z),n=o.scaling(e.scale.x,e.scale.y,e.scale.z);return o.multiply(o.multiply(t,r),n)}(t);for(const r of t.ngons){if(!r.material.hasWireframe&&r.material.allowAlphaReject&&r.material.color.alpha<=0)continue;const t=l.ngons[l.count++];t.vertices.length=0;for(let e=0;e<r.vertices.length;e++){const n=r.vertices[e],a=t.vertices[e]=s.vertices[s.count++];a.x=n.x,a.y=n.y,a.z=n.z,a.u=n.u,a.v=n.v,a.w=n.w,a.shade=n.shade,t.vertexNormals[e]=f.normals[f.count++],t.vertexNormals[e].x=r.vertexNormals[e].x,t.vertexNormals[e].y=r.vertexNormals[e].y,t.vertexNormals[e].z=r.vertexNormals[e].z}if(t.material=r.material,t.normal.x=r.normal.x,t.normal.y=r.normal.y,t.normal.z=r.normal.z,t.mipLevel=r.mipLevel,m.transform(t,d),e.useFragmentBuffer)for(let e=0;e<t.vertices.length;e++)t.vertices[e].worldX=t.vertices[e].x,t.vertices[e].worldY=t.vertices[e].y,t.vertices[e].worldZ=t.vertices[e].z;for(let e=0;e<t.vertices.length;e++)c.transform(t.vertexNormals[e],d),c.normalize(t.vertexNormals[e]),t.vertices[e].normalX=t.vertexNormals[e].x,t.vertices[e].normalY=t.vertexNormals[e].y,t.vertices[e].normalZ=t.vertexNormals[e].z;if(c.transform(t.normal,d),c.normalize(t.normal),e.useBackfaceCulling&&t.vertices.length>2&&!t.material.isTwoSided&&(i.x=t.vertices[0].x-e.cameraPosition.x,i.y=t.vertices[0].y-e.cameraPosition.y,i.z=t.vertices[0].z-e.cameraPosition.z,c.dot(t.normal,i)>=0))l.count--;else if("none"!==t.material.vertexShading&&X(t,e),e.useVertexShader&&e.pipeline.vertex_shader(t,e),!t.material.isInScreenSpace){if(m.transform(t,u),m.clip_to_viewport(t),!t.vertices.length){l.count--;continue}m.transform(t,a),m.perspective_divide(t)}}e.screenSpaceNgons=l.ngons.slice(0,l.count)},pixelShader:void 0,vertexShader:void 0,canvasShader:void 0,rasterPath:void 0},T={where:"in arguments to Rngon::render()",properties:{target:["HTMLCanvasElement","string","undefined"],meshes:[["Mesh"],"undefined"],options:["object"],pipeline:["object"]}},F={where:"in render({options})",properties:{cameraPosition:["Vector"],cameraDirection:["Vector"],context:["string","number","undefined"],resolution:["number","object"],fov:["number"],nearPlane:["number"],farPlane:["number"],useDepthBuffer:["boolean"],useFragmentBuffer:["boolean"],useBackfaceCulling:["boolean"],useFullInterpolation:["boolean"],fragments:["object","undefined"],hibernateWhenTargetNotVisible:["boolean"],lights:[["Light","object"]]}},I={where:"in render({pipeline})",properties:{ngonSorter:["undefined","function"],surfaceWiper:["undefined","null","function"],rasterizer:["undefined","null","function"],transformClipLighter:["undefined","null","function"],pixelShader:["undefined","function"],vertexShader:["undefined","function"],canvasShader:["undefined","function"],rasterPath:["undefined","function"]}},U={where:"in arguments to Rngon::light()",properties:{x:["number"],y:["number"],z:["number"],options:{subschema:{allowAdditionalProperties:!0,properties:{intensity:["number"]}}}}},q={where:"in the return value of Rngon::light()",allowAdditionalProperties:!0,properties:{$constructor:{value:"Light"},x:["number"],y:["number"],z:["number"]}},H=4,G={width:1,height:1,pixels:void 0,encoding:"none",channels:"rgba:8+8+8+8"},J={arguments:{where:"in arguments to Rngon::texture()",allowAdditionalProperties:!0,properties:{pixels:["Uint8ClampedArray",["number"],"string"],width:{type:["number"],value(e){if(e<1||e>32768)return"Texture width must be in the range [1, 32768]"}},height:{type:["number"],value(e){if(e<1||e>32768)return"Texture height must be in the range [1, 32768]"}},encoding:{type:["string"],value(e){const t=["none","base64"];if(!t.includes(e))return`Texture encoding must be one of ${t.join(", ")}`}},channels:{type:["string"],value(e){const t=["rgba:5+5+5+1","rgba:8+8+8+8"];if(!t.includes(e))return`Texture pixel layout must be one of ${t.join(", ")}`}}}},interface:{where:"in the return value of Rngon::texture()",allowAdditionalProperties:!0,properties:{$constructor:{value:"Texture"},width:["number"],height:["number"],pixels:["Uint8ClampedArray"],mipLevels:[["object","Texture"]]}}};function K(e={}){e=structuredClone(e);for(const t of Object.keys(G))e.hasOwnProperty(t)||(e[t]=G[t]);void 0===e.pixels&&(e.pixels=new Array(e.width*e.height*4)),n?.(e,J.arguments),function(e){if("none"===e.encoding)e.pixels instanceof Uint8ClampedArray||(e.pixels=new Uint8ClampedArray(e.pixels));else if("base64"===e.encoding){const t=atob(e.pixels);switch(e.pixels=new Uint8ClampedArray(e.width*e.height*H),e.channels){case"rgba:8+8+8+8":r?.(t.length===e.width*e.height*H,"Unexpected data length for a Base64-encoded texture; expected 4 bytes per pixel.");for(let r=0;r<e.width*e.height*4;r++)e.pixels[r]=t.charCodeAt(r);break;case"rgba:5+5+5+1":{r?.(t.length===e.width*e.height*2,"Unexpected data length for a Base64-encoded texture; expected 2 bytes per pixel.");let n=0;for(let r=0;r<e.width*e.height*2;r+=2){const a=t.charCodeAt(r)+(t.charCodeAt(r+1)<<8);e.pixels[n++]=8*(31&a),e.pixels[n++]=8*(a>>5&31),e.pixels[n++]=8*(a>>10&31),e.pixels[n++]=255*(a>>15&1)}break}default:throw new Error("Unrecognized value for texture 'channels' attribute.")}}else if("none"!==e.encoding)throw new Error("Unknown texture data encoding '"+e.encoding+"'.");r?.(e.pixels instanceof Uint8ClampedArray,"Expected texture data to be output as a Uint8ClampedArray."),r?.(e.pixels.length===e.width*e.height*H,"The texture's pixel array size doesn't match its width and height.")}(e);const t={$constructor:"Texture",regenerate_mipmaps:Q,...e};return t.regenerate_mipmaps(),n?.(t,J.interface),t}function Q(){if(r?.(this.hasOwnProperty("$constructor")&&"Texture"===this.$constructor,"Expected 'this' to point to a Texture"),this.mipLevels=[this],1!==this.width||1!==this.height)for(let e=1;;e++){const t=Math.max(1,Math.floor(this.width/Math.pow(2,e))),n=Math.max(1,Math.floor(this.height/Math.pow(2,e))),a=[];{const e=this.width/t,r=this.height/n;for(let o=0;o<n;o++)for(let n=0;n<t;n++){const i=(n+o*t)*H,l=(Math.floor(n*e)+Math.floor(o*r)*this.width)*H;for(let e=0;e<H;e++)a[i+e]=this.pixels[l+e]}}if(this.mipLevels.push({width:t,height:n,pixels:a}),1===t&&1===n){r?.(this.mipLevels.length>0,"Failed to generate mip levels for a texture.");break}}}K.load=async function(e){try{const t=await fetch(e);return K(await t.json())}catch(t){throw new Error(`Failed to create a texture with data from file '${e}'. ${t}`)}};const ee={render:{options:V,pipeline:D},mesh:{transform:A},texture:G,ngon:{material:d},context:$},te={version:Object.freeze({major:1,minor:0,isProductionBuild:!0}),default:ee,render:function({target:e,meshes:t,options:a={},pipeline:i={}}={}){n?.({target:e,meshes:t,options:a,pipeline:i},T);const s={renderWidth:0,renderHeight:0,numNgonsRendered:0,totalRenderTimeMs:performance.now()};a=Object.freeze({...V,...a});for(const e of Object.keys(D))void 0===i[e]&&(i[e]=D[e]);if(n?.(a,F),n?.(i,I),void 0===e)r?.("object"==typeof a.resolution&&"number"==typeof a.resolution.width&&"number"==typeof a.resolution.height,"No on-screen render target given. Off-screen rendering requires `options.resolution` to be an object of the form {width, height}.");else if("string"==typeof e){const t=e;e=document.getElementById(e),r?.(e instanceof HTMLCanvasElement,`The render target <canvas id="${t}"> doesn't exist in the document.`)}else r?.(e instanceof HTMLCanvasElement,`The render target ${e} isn't an instance of HTMLCanvasElement.`);const f=function(e={},t={}){const r=R(e.context);if(r.contextName=e.context,r.useDepthBuffer=Boolean(e.useDepthBuffer),r.useBackfaceCulling=Boolean(e.useBackfaceCulling),r.lights=e.lights,r.renderScale="number"==typeof e.resolution?e.resolution:void 0,r.renderWidth=e.resolution.width,r.renderHeight=e.resolution.height,r.nearPlaneDistance=e.nearPlane,r.farPlaneDistance=e.farPlane,r.fov=e.fov,r.cameraDirection=e.cameraDirection,r.cameraPosition=e.cameraPosition,r.useFullInterpolation=Boolean(e.useFullInterpolation),r.useFragmentBuffer=Boolean(e.useFragmentBuffer||r.usePixelShader&&r.pixel_shader?.toString().match(/{(.+)?}/)[1].includes("fragmentBuffer")),"object"==typeof e.fragments)for(const t of Object.keys(r.fragments))r.fragments[t]=e.fragments[t]??!1;else for(const e of Object.keys(r.fragments))r.fragments[e]=r.useFragmentBuffer;return r.pipeline.ngon_sorter=t.ngonSorter,r.pipeline.rasterizer=t.rasterizer,r.pipeline.transform_clip_lighter=t.transformClipLighter,r.pipeline.surface_wiper=t.surfaceWiper,r.usePixelShader=Boolean(t.pixelShader),r.pipeline.pixel_shader=t.pixelShader,r.useVertexShader=Boolean(t.vertexShader),r.pipeline.vertex_shader=t.vertexShader,r.useCanvasShader=Boolean(t.canvasShader),r.pipeline.canvas_shader=t.canvasShader,r.pipeline.raster_path=t.rasterPath,r}(a,i);{const i=function(e,t){n?.({canvasElement:e,renderContext:t},Y);const a=void 0===e;let i,s,f;try{({surfaceWidth:i,surfaceHeight:s,canvasElement:e,canvasContext:f}=a?function(e){return{surfaceWidth:e.renderWidth,surfaceHeight:e.renderHeight,canvasContext:{createImageData:function(e,t){return new ImageData(e,t)}}}}(t):function(e,t){const n=t?.getContext("2d");let a,o;return r?.(t instanceof Element&&n,"Invalid canvas element"),"number"==typeof e.renderScale?(a=Math.floor(parseInt(window.getComputedStyle(t).getPropertyValue("width"))*e.renderScale),o=Math.floor(parseInt(window.getComputedStyle(t).getPropertyValue("height"))*e.renderScale),r?.(a>0&&o>0,"Failed to query the dimensions of the target canvas")):(r?.("number"==typeof e.renderWidth&&"number"==typeof e.renderHeight,"Invalid render resolution"),a=e.renderWidth,o=e.renderHeight),t.setAttribute("width",a),t.setAttribute("height",o),{surfaceWidth:a,surfaceHeight:o,canvasElement:t,canvasContext:n}}(t,e)),function(e,t,r,n){void 0!==t.pixelBuffer&&t.pixelBuffer.width==r&&t.pixelBuffer.height==n||(t.pixelBuffer=e.createImageData(r,n),t.pixelBuffer8=new Uint8ClampedArray(t.pixelBuffer.data.buffer),t.pixelBuffer32=new Uint32Array(t.pixelBuffer.data.buffer)),!t.useFragmentBuffer||t.fragmentBuffer.width==r&&t.fragmentBuffer.height==n||t.fragmentBuffer.resize(r,n),!t.useDepthBuffer||t.depthBuffer.width==r&&t.depthBuffer.height==n&&t.depthBuffer.data.length||t.depthBuffer.resize(r,n)}(f,t,i,s)}catch(e){return console.error(e),null}const u=o.multiply(o.rotating(t.cameraDirection.x,t.cameraDirection.y,t.cameraDirection.z),o.translating(-t.cameraPosition.x,-t.cameraPosition.y,-t.cameraPosition.z)),d=function(e=0,t=0,r=0,n=0){const a=Math.tan(e/2),i=r-n;return o(1/(a*t),0,0,0,0,1/a,0,0,0,0,(-r-n)/i,1,0,0,2*n*(r/i),0)}(t.fov*(Math.PI/180),i/s,t.nearPlaneDistance,t.farPlaneDistance),h=function(e=0,t=0){const r=e/2,n=t/2;return o(r,0,0,0,0,-n,0,0,0,0,1,0,r-.5,n-.5,0,1)}(i+1,s+1),p={$constructor:"Surface",width:i,height:s,display_meshes:function(e=[]){if(t.pipeline.surface_wiper?.(t),e.length){if(function(e,t=[m()]){r?.(t instanceof Array,"Invalid arguments to n-gon cache initialization.");const n=e.vertexCache,a=e.vertexNormalCache;let o=0;for(const e of t)for(const t of e.ngons)o+=t.vertices.length;if(!n||!n.vertices.length||n.vertices.length<o){const e=o-n.vertices.length;n.vertices.push(...new Array(e).fill().map((e=>l())))}if(n.count=0,!a||!a.normals.length||a.normals.length<o){const e=o-a.normals.length;a.normals.push(...new Array(e).fill().map((e=>c())))}a.count=0}(t,e),function(e,t=[m()]){r?.(t instanceof Array,"Invalid arguments to n-gon cache initialization.");const n=e.ngonCache,a=t.reduce(((e,t)=>e+t.ngons.length),0);if(!n||!n.ngons.length||n.ngons.length<a){const e=a-n.ngons.length;n.ngons.push(...new Array(e).fill().map((e=>m())))}n.count=0}(t,e),t.pipeline.transform_clip_lighter)for(const r of e)t.pipeline.transform_clip_lighter({renderContext:t,mesh:r,cameraMatrix:u,perspectiveMatrix:d,screenSpaceMatrix:h});t.pipeline.ngon_sorter?.(t),function(e){for(const t of e)if(t.material.texture&&"affine"===t.material.textureMapping){let e=0==(t.material.texture.width&t.material.texture.width-1),r=0==(t.material.texture.height&t.material.texture.height-1);0===t.material.texture.width&&(e=!1),0===t.material.texture.height&&(r=!1),e&&r||(t.material.textureMapping="affine-npot")}}(t.screenSpaceNgons)}t.pipeline.rasterizer?.(t),t.usePixelShader&&t.pipeline.pixel_shader(t),a||(t.useCanvasShader?t.pipeline.canvas_shader(f,t.pixelBuffer):f.putImageData(t.pixelBuffer,0,0))},is_in_view:function(){if(a)return!0;const t=window.innerHeight,r=e.getBoundingClientRect();return r.top>-r.height&&r.top<t}};return n?.(p,Z),p}(e,f);f.resolution.width=s.renderWidth=i.width,f.resolution.height=s.renderHeight=i.height,!i||a.hibernateWhenTargetNotVisible&&!i.is_in_view()||(i.display_meshes(t),s.numNgonsRendered=f.screenSpaceNgons.length)}return s.totalRenderTimeMs=performance.now()-s.totalRenderTimeMs,s},color:u,context:R.list,light:function(e=0,t=0,r=0,a={}){n?.({x:e,y:t,z:r,options:a},U);const o={$constructor:"Light",x:e,y:t,z:r,...a};return n?.(o,q),o},mesh:function(e=[m()],t={}){n?.({ngons:e,transform:t},L);const r={$constructor:"Mesh",ngons:e,...A,...t};return n?.(r,N),r},matrix:o,ngon:m,texture:K,vector:c,vertex:l};var re=self;for(var ne in t)re[ne]=t[ne];t.__esModule&&Object.defineProperty(re,"__esModule",{value:!0})})();

/***/ }),

/***/ "./src/core/shell.js":
/*!***************************!*\
  !*** ./src/core/shell.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   shell: () => (/* binding */ shell)
/* harmony export */ });
/* harmony import */ var _core_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/render.js */ "./src/core/render.js");
/* harmony import */ var _core_tick_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/tick.js */ "./src/core/tick.js");
/* harmony import */ var _core_desktop_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/desktop.js */ "./src/core/desktop.js");
/* harmony import */ var _core_taskbar_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/taskbar.js */ "./src/core/taskbar.js");
/* harmony import */ var _core_popup_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/popup.js */ "./src/core/popup.js");
/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */







let renderScale = 1;
let screen_shader_fn = undefined;
let debugLayerEl = undefined;
let forceAllWidgetsToUpdate = false;
const refreshRate = [];

const geometry = {
    updatedApps: [],
    ngons: 0,
    renderTime: 0,
};

const shell = {
    display: {
        get debugLayer() {
            return debugLayerEl;
        },
        get geometry() {
            return geometry;
        },
        get scale() {
            return renderScale;
        },
        set scale(newScale) {
            w95.debug?.assert(Number.isInteger(newScale));
            renderScale = newScale;
            _core_render_js__WEBPACK_IMPORTED_MODULE_0__.renderOptions.resolution = (1 / renderScale);
            generate_scaled_cursor(w95.icon.cursorArrow, renderScale);
            w95.shell.refresh();
        },
        get width() {
            // Note: We make the dimensions divisible by 2 for integer 2x render downscaling.
            return Math.floor((window.innerWidth - (window.innerWidth & 1)) / renderScale);
        },
        get height() {
            return Math.floor((window.innerHeight - (window.innerHeight & 1)) / renderScale);
        },
        get refreshRate() {
            return (refreshRate.reduce((sum, r)=>(sum + r), 0) / (refreshRate.length || 1));
        },
        get domElements() {
            return Array.from(document.body.querySelectorAll(".w95-dom-element"));
        },
        get screenShader() {
            return screen_shader_fn;
        },
        set screenShader(pixel_shader_fn) {
            w95.debug?.assert(typeof pixel_shader_fn === "function");
            _core_render_js__WEBPACK_IMPORTED_MODULE_0__.renderPipeline.pixelShader = pixel_shader_fn;
        },
    },
    desktop: _core_desktop_js__WEBPACK_IMPORTED_MODULE_2__.desktopApp,
    taskbar: _core_taskbar_js__WEBPACK_IMPORTED_MODULE_3__.taskbarApp,
    popup: _core_popup_js__WEBPACK_IMPORTED_MODULE_4__.popupWidget,
    refresh() {
        window.dispatchEvent(new Event("resize"));
    },
    boot() {
        w95.shell.display.scale = ~~(document.body.dataset.w95Scale || 1);

        if (false) {}
        else if (window.location.hash === "#no-debug") {
            debugLayerEl?.remove?.();
            debugLayerEl = null;
        }
        else {
            debugLayerEl = document.getElementById("w95-debug-layer");
        }

        ["keydown", "keyup", "keypress"].forEach(eventType=>{
            window.addEventListener(eventType, w95.windowManager.user_input);
        });

        window.addEventListener("resize", ()=>{
            forceAllWidgetsToUpdate = true;
            enforce_universal_canvas_properties();
            w95.windowManager.apps.forEach(app=>w95.$recurseDescendantWidgets(app, (widget)=>{
                widget.Message?.fitToDisplay?.();
            }));
        });

        window.requestAnimationFrame(render_loop);
    },
    run(applications, {singleInstance = false} = {}) {
        w95.windowManager.govern(applications, {singleInstance});
        enforce_universal_canvas_properties();
    },
};

async function generate_scaled_cursor(icon, scale) {
    const img = document.createElement("img");
    img.src = icon.dataUrl;
    img.onload = ()=>{
        const canvas = document.createElement("canvas");
        canvas.width = (icon.width * scale);
        canvas.height = (icon.height * scale);

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        document.body.style.cursor = `url(${canvas.toDataURL()}), auto`;
    }
}

function is_rect_fully_inside_other(rect1, rect2) {
    return (
        (rect1.x >= rect2.x) &&
        (rect1.y >= rect2.y) &&
        ((rect1.x + rect1.width) < (rect2.x + rect2.width)) &&
        ((rect1.y + rect1.height) < (rect2.y + rect2.height))
    );
}

function rect_clamped_to_screen(rect) {
    rect.x = ~~Math.max(0, Math.min(w95.shell.display.width, rect.x));
    rect.y = ~~Math.max(0, Math.min(w95.shell.display.height, rect.y));
    rect.width = ~~Math.min((w95.shell.display.width - rect.x), rect.width);
    rect.height = ~~Math.min((w95.shell.display.height - rect.y), rect.height);
    return rect;
}

function enforce_universal_canvas_properties()
{
    for (const canvas of document.body.getElementsByTagName("canvas")) {
        canvas.style.width = `${w95.shell.display.width * w95.shell.display.scale}px`;
        canvas.style.height = `${w95.shell.display.height * w95.shell.display.scale}px`;
    }
}

function render_loop(timestamp, timeDeltaMs, numTicks = 0) {
    geometry.renderTime = 0;
    geometry.updatedApps = (
        (!numTicks || forceAllWidgetsToUpdate)
            ? w95.windowManager.apps
            : w95.windowManager.apps.filter(app=>app.update().length)
    );

    if (forceAllWidgetsToUpdate) {
        for (const app of w95.windowManager.apps) {
            delete app._dirtyRegion;
            app.update(true);
        }
    }

    if (geometry.updatedApps.length) {
        geometry.ngons = 0;

        const popupParentApp = (
            !w95.windowManager.isPopupMenuActive ||
            w95.windowManager.get_parent_app(w95.windowManager.get_active_popup_menu().popupWidget)
        );

        for (const app of geometry.updatedApps) {
            if (app._dirtyRegion) {
                const region = app._dirtyRegion[0];
                region.isStatic = (
                    (app.x === region.x) &&
                    (app.y === region.y) &&
                    (app.width === region.width) &&
                    (app.height === region.height)
                );
            }

            const isDialogOpen = Boolean(w95.windowManager.get_active_dialog(app).widget);
            const appMesh = Rngon.mesh(app.mesh());
            geometry.ngons += appMesh.ngons.length;
            _core_render_js__WEBPACK_IMPORTED_MODULE_0__.renderOptions.context = app.id;

            Rngon.render({
                target: app._canvas,
                meshes: [appMesh],
                options: _core_render_js__WEBPACK_IMPORTED_MODULE_0__.renderOptions,
                pipeline: _core_render_js__WEBPACK_IMPORTED_MODULE_0__.renderPipeline,
            });

            app._dirtyRegion = [
                rect_clamped_to_screen({
                    x: app.x,
                    y: app.y,
                    width: app.width,
                    height: app.height,
                })
            ];

            // Certain widgets can overflow the app window's rectangle.
            if (isDialogOpen) {
                const {widget, at} = w95.windowManager.get_active_dialog(app);
                w95.debug?.assert(widget?._type === "dialog");
                w95.debug?.assert(typeof at === "object");

                const rect = rect_clamped_to_screen({
                    x: at.x,
                    y: at.y,
                    width: widget.width,
                    height: widget.height,
                });

                if (!is_rect_fully_inside_other(rect, app._dirtyRegion[0])) {
                    app._dirtyRegion.push(rect);
                }
            }
            else if (popupParentApp && (popupParentApp === app)) {
                const {popupWidget, at} = w95.windowManager.get_active_popup_menu();
                w95.debug?.assert(popupWidget?._what === "w95-widget");
                w95.debug?.assert(typeof at === "object");

                const rect = rect_clamped_to_screen({
                    x: at.x,
                    y: at.y,
                    width: popupWidget.width,
                    height: popupWidget.height,
                });

                if (!is_rect_fully_inside_other(rect, app._dirtyRegion[0])) {
                    app._dirtyRegion.push(rect);
                }
            }
        }

        if (w95.shell.display.debugLayer) {
            for (const app of geometry.updatedApps) {
                w95.$recurseDescendantWidgets(app.rootWidget, (widget, parent)=>{
                    parent._domSkeleton.append(widget._domSkeleton);
                });

                // App wrappers (rootWidget and appObject) don't have their position
                // and dimensions available during the widget render cycle, so we
                // need to shoehorn that information into the debug layer here.
                for (const widget of [app.rootWidget, app.appObject]) {
                    const domSkeleton = widget._domSkeleton;
                    domSkeleton.style.width = `${app.width * w95.shell.display.scale}px`;
                    domSkeleton.style.height = `${app.height * w95.shell.display.scale}px`;
                    domSkeleton.style.left = `${app.x * w95.shell.display.scale}px`;
                    domSkeleton.style.top = `${app.y * w95.shell.display.scale}px`;
                }
            }
        }

        geometry.renderTimeMs = (performance.now() - timestamp);
    }

    forceAllWidgetsToUpdate = false;
    (0,_core_tick_js__WEBPACK_IMPORTED_MODULE_1__.signal_system_tick)(timeDeltaMs);
    w95.windowManager.post_tick_inspect();
    window.requestAnimationFrame((newTimestamp)=>render_loop(newTimestamp, (newTimestamp - timestamp), numTicks + 1));

    refreshRate.push(1000 / (timeDeltaMs || 1000));
    if (refreshRate.length > 20) {
        refreshRate.shift();
    }
}


/***/ }),

/***/ "./src/core/state.js":
/*!***************************!*\
  !*** ./src/core/state.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StateVariable: () => (/* binding */ StateVariable),
/* harmony export */   keep: () => (/* binding */ keep),
/* harmony export */   state: () => (/* binding */ state)
/* harmony export */ });
/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 * 
 * Provides a way for widgets to store state across re-renders.
 * 
 * For the end-user, this works about like useState() in React: inside a widget,
 * call state() - or, preferably, its alias, w95.state() - with the state's
 * initial value, and you get in return an object containing the state's current
 * value and a function for modifying the value.
 * 
 * Internally, this is simply a manager of access to a flat array of state values.
 * Each time a component calls state(), the state value at that index in the state
 * array will be returned - or, if it doesn't already exist, it'll be created -
 * and an index pointing to the end of the array will be incremented. When the
 * index pointer is synced with the order in which widgets are rendered,  the
 * correct corresponding state value will always be returned to the caller.
 * 
 * Sample usage in a widget:
 * 
 *   function widget() {
 *       // Creating a persistent value. Its state will be retained across calls to
 *       // this widget function.
 *       const persistentValue = w95.state("Hello there");
 * 
 *       // DO NOT modify a variable directly in the body of the widget function.
 *       // Modifying state triggers a re-rendering of the widget, which involves
 *       // calling its widget function again - so if state is modified directly
 *       // in the function body, the function will be called again indefinitely.
 *       persistentValue.set(1);
 *       // ...Infinite loop...
 * 
 *       // Modifying a state variable after the widget function has exited is fine.
 *       setTimeout(()=>persistentValue.set(1), ...);
 *   }
 * 
 * For the state system to function properly, the following conditions must be met:
 * 
 *   1. Calls to state() must be made during the execution of the widget function,
 *      and not e.g. via setTimeout().
 * 
 *        - The state variable returned from state() CAN be used outside of the
 *          widget function's execution.
 * 
 *   2. Calls to state() must not be conditional. They need to happen in the same
 *      order each time the widget function is called.
 * 
 *   3. Before causing a widget to be rendered (its widget function to be called),
 *      the state index pointer must be set correspondingly so that the same index
 *      value is in effect every time a particular widget's function is entered.
 *      When re-rendering parts of the widget tree, use the state.move_head()
 *      function to set the pointer.
 * 
 */

const _state = {
    activeStore: undefined,
    idx: 0,
};

function keep(initialValue) {
    return state(initialValue, null);
}

// The 'effect' value dictates what happens when the state is mutated:
//
//   null       = nothing
//   true       = the widget's parent is re-rendered
//   undefined  = the widget's parent is re-mounted and then re-rendered
//   ()=>!false = the widget's parent is re-mounted and then re-rendered
//   ()=>false  = the mutation is undone and no re-mounting or re-rendering is done
function state(initialValue, effect) {
    w95.debug?.assert(
        (effect === null) ||
        (effect === true) ||
        ["function", "undefined"].includes(typeof effect)
    );

    const idx = _state.idx++;
    //console.debug(`State/query: [${idx}]`);

    if (!_state.activeStore[idx]) {
        //console.debug(`State/init: [${idx}] => ${initialValue}`);
        _state.activeStore[idx] = new StateVariable(initialValue, effect);
    }

    return _state.activeStore[idx];
};

state.use = function(stateStore, parentApp) {
    w95.debug?.assert(Array.isArray(stateStore));
    _state.activeStore = stateStore;
    _state.idx = 0;
    _state.app = parentApp;
};

state.move_head = function(val) {
    _state.idx = val;
};

state.head = function() {
    return _state.idx;
};

state.mount = function(widgetInterface, mount_fn, render_fn) {
    w95.debug?.assert(typeof widgetInterface === "object");
    w95.debug?.assert(typeof mount_fn === "function");

    //console.debug(`State/mount: ${widgetInterface._type} <=`, Array.from(state.activeStore.slice(widgetInterface._stateStartIdx, state.activestate.idx)));

    for (let i = widgetInterface._stateStartIdx; i < _state.idx; i++) {
        _state.activeStore[i].remount_parent_widget = mount_fn;
        _state.activeStore[i].rerender_parent_widget = render_fn;
        _state.activeStore[i].widget = widgetInterface;
        _state.activeStore[i].app = _state.app;
    }

    return; 
}

// Wraps a regular JavaScript value (e.g. string or number) in an interface that
// provides explicit properties for reading and modifying the value; triggering
// a re-rendering of the parent widget whenever the value is modified.
function StateVariable(initialValue, effect)
{
    this.now = initialValue;
    this.set = function(newValue) {
        //console.debug(`State/set: [${idx}] => ${newValue}`);
        if (newValue !== this.now) {
            const previous = this.now;
            this.now = newValue;

            switch (effect) {
                case null: return;
                case true: return this.rerender_parent_widget();
                default: {
                    switch (effect?.({
                        now: this.now,
                        previous,
                        app: this.app,
                        widget: this.widget
                    })){
                        case false: return (this.now = previous);
                        default: return this.remount_parent_widget();
                    }
                }
            }
        }
    };

    this.remount_parent_widget = function() {
        w95.debug?.throw("No parent widget mount function assigned.");
    };
    this.rerender_parent_widget = function() {
        w95.debug?.throw("No parent widget render function assigned.");
    };
}


/***/ }),

/***/ "./src/core/taskbar.js":
/*!*****************************!*\
  !*** ./src/core/taskbar.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   taskbarApp: () => (/* binding */ taskbarApp)
/* harmony export */ });
/* harmony import */ var _core_widget_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/widget.js */ "./src/core/widget.js");
/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */



const taskbarButton = (0,_core_widget_js__WEBPACK_IMPORTED_MODULE_0__.create_widget)(function taskbarButton({
    x = 0,
    y = 0,
    width = 10,
    height = 22,
    text = "",
    icon = w95.icon.applicationIcon16x16,
    isPressed = false,
    isHidden = true,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof text === "string");
    w95.debug?.assert(typeof isPressed === "boolean");
    w95.debug?.assert(typeof isHidden === "boolean");
    w95.debug?.assert(typeof icon === "object");

    x = w95.state(x);
    width = w95.state(width);
    isHidden = w95.state(isHidden);
    icon = w95.state(icon);
    text = w95.state(text);
    isPressed = w95.state(isPressed);
    const app = w95.state(undefined);

    const iconSpacing = 4;

    return {
        get x() { return x.now },
        get y() { return y },
        get width() { return width.now },
        get height() { return height },
        Form() {
            return w95.widget.frame({
                width: width.now,
                height,
                shape: w95.frameShape.none,
                children: [
                    w95.widget.panel({
                        x: 2,
                        y: 2,
                        width: (width.now - 4),
                        height: (height - 4),
                        color: (
                            isPressed.now
                                ? w95.palette.named.offwhite
                                : w95.palette.widget.background
                        ),
                    }),
    
                    ...frame(),
    
                    w95.widget.bitmap({
                        x: (iconSpacing + ~~isPressed.now),
                        y: (3 + ~~isPressed.now),
                        image: icon.now,
                    }),
                    w95.widget.label({
                        x: (iconSpacing + icon.now.width + iconSpacing + ~~isPressed.now),
                        y: ~~isPressed.now,
                        width: (width.now - icon.now.width - (iconSpacing * 3)),
                        height: height,
                        text: text.now,
                        isElided: true,
                        styleHints: [
                            w95.styleHint.action,
                            w95.styleHint.alignVCenter,
                            isPressed.now? w95.styleHint.bold : 0,
                        ],
                    }, {hideIf: !text.now.length}),
                ],
            }, {hideIf: isHidden.now});
        },
        Event: {
            mousedown() {
                w95.debug?.assert(app.now._type === "app");
                w95.windowManager.raise_window(isPressed.now? w95.windowManager.desktop : app.now.window);
                return true;
            },
        },
        Message: {
            setX(newX) {
                w95.debug?.assert(typeof newX === "number");
                x.set(newX);
            },
            setWidth(newWidth) {
                w95.debug?.assert(typeof newWidth === "number");
                width.set(newWidth);
            },
            setHidden(is) {
                w95.debug?.assert(typeof is === "boolean");
                isHidden.set(is);
            },
            setText(newText) {
                w95.debug?.assert(typeof newText === "string");
                text.set(newText);
            },
            setIcon(newIcon) {
                w95.debug?.assert(typeof newIcon === "object");
                icon.set(newIcon);
            },
            setIsPressed(is) {
                w95.debug?.assert(typeof is === "boolean");
                isPressed.set(is);
            },
            setParentApp(newApp) {
                w95.debug?.assert(newApp._type === "app");
                app.set(newApp);
            },
        },
    };

    function frame() {
        const palette = (()=>{
            let light = w95.palette.frame.light;
            let lighter = w95.palette.frame.lighter;
            let darker = w95.palette.frame.darker;
            let dark = w95.palette.frame.dark;

            if (isPressed.now) {
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
                Rngon.vertex((width.now - 2), 1),
            ], {
                color: palette.lighter,
            }),
    
            // Right inner border.
            Rngon.ngon([
                Rngon.vertex((width.now - 2), 1),
                Rngon.vertex((width.now - 2), (height - 1)),
            ], {
                color: palette.darker,
            }),
    
            // Bottom inner border.
            Rngon.ngon([
                Rngon.vertex(1, (height - 2)),
                Rngon.vertex((width.now - 1), (height - 2)),
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
                Rngon.vertex((width.now - 1), 0),
                Rngon.vertex((width.now - 1), height),
            ], {
                color: palette.dark,
            }),
    
            // Bottom outer border.
            Rngon.ngon([
                Rngon.vertex(0, (height - 1)),
                Rngon.vertex(width.now, (height - 1)),
            ], {
                color: palette.dark,
            }),
    
            // Top outer border.
            Rngon.ngon([
                Rngon.vertex(0, 0),
                Rngon.vertex(width.now, 0),
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
    }
});

function taskbarApp() {
    return {
        Meta: {
            name: "Taskbar",
            version: "0.1",
            author: "Tarpeeksi Hyvae Soft",
            description: `
                This app renders a screen-wide borderless window to emulate the
                Windows 95 desktop.
            `,
        },
        App() {
            w95.registry.set("taskbar-height", 30);

            const width = w95.state(w95.shell.display.width + 4);
            const height = w95.state(w95.registry.get("taskbar-height"), ()=>w95.registry.set("taskbar-height", height.now));

            const y = w95.state((w95.shell.display.height - height.now), ({app})=>app.move({y: y.now + 2}));
            
            const runningApps = w95.state([]);
            const appButtons = w95.state(new Array(25).fill().map(e=>taskbarButton()));

            const tick = w95.state(0);

            const minButtonWidth = 25;
            const maxButtonWidth = 163;
            const buttonAreaWidth = (width.now - 72);

            return {
                get width() { return width },
                get height() { return height },
                get isTaskbar() { return true },
                get buttons() { return this.$childWidgets[0].$childWidgets[1].$form._buttons.$childWidgets },
                Opened() {
                    this.move({x: -2, y: y.now + 2});
                },
                Mounted() {
                    // Reorganize the button row with the currently-active buttons.
                    {
                        const buttonWidth = Math.min(
                            maxButtonWidth,
                            Math.max(
                                minButtonWidth,
                                ~~(buttonAreaWidth / runningApps.now.length)
                            )
                        );

                        this.buttons.forEach(b=>b.Message.setHidden(true));
                        
                        runningApps.now.forEach((app, idx)=>{
                            const button = this.buttons[idx];
                            const dialog = w95.windowManager.get_active_dialog(app).widget;
                            button.Message.setParentApp(app);
                            button.Message.setIsPressed(Boolean(
                                (app === w95.windowManager.apps[0]) &&
                                (!app.window.isBlurred || (dialog && !dialog.isBlurred))
                            ));
                            button.Message.setHidden(false);
                            button.Message.setX(buttonWidth * idx);
                            button.Message.setWidth(buttonWidth - 3);
                            button.Message.setText(app.window.title);
                            button.Message.setIcon(app.window.icon);
                        });
                    }
                },
                Message: {
                    fitToDisplay() {
                        width.set(w95.shell.display.width + 4);
                        y.set((w95.shell.display.height - height.now));
                    },
                    addApp(app) {
                        w95.debug?.assert(app?._type === "app");
                        if (runningApps.now.length < appButtons.now.length) {
                            runningApps.set([...runningApps.now, app]);
                        }
                    },
                    removeApp(app) {
                        w95.debug?.assert(app?._type === "app");
                        runningApps.set(runningApps.now.filter(a=>(a !== app)));
                    },
                    refresh() {
                        tick.set(tick.now + 1);
                    },
                },
                Form() {
                    return w95.widget.window({
                        width: width.now,
                        height: height.now,
                        styleHints: [
                            w95.styleHint.plain,
                        ],
                        children: [
                            // Time.
                            w95.widget.frame({
                                x: "pw - 59",
                                y: 4,
                                width: 58,
                                height: 22,
                                children: [
                                    w95.widget.time({
                                        width: "pw",
                                        height: "ph",
                                        styleHints: [
                                            w95.styleHint.alignHCenter,
                                            w95.styleHint.alignVCenter,
                                        ],
                                    }),
                                ],
                            }),
                            w95.widget.frame({
                                $name: "_buttons",
                                x: 1,
                                y: 4,
                                width: buttonAreaWidth,
                                shape: w95.frameShape.none,
                                height: "ph - 8",
                                children: appButtons.now,
                            }),
                        ],
                    });
                },
            };
        },
    }
}


/***/ }),

/***/ "./src/core/tick.js":
/*!**************************!*\
  !*** ./src/core/tick.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   signal_system_tick: () => (/* binding */ signal_system_tick),
/* harmony export */   tick: () => (/* binding */ tick)
/* harmony export */ });
/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

const listeners = [];

const tick = {
    // Register a listener callback that will be called when the system ticks.
    listen: function(callback_fn = ()=>{}) {
        listeners.push(callback_fn);
    },

    unlisten: function(registered_callback_fn) {
        const idx = listeners.lastIndexOf(registered_callback_fn);

        if (idx >= 0) {
            listeners.splice(idx, 1);
        }
        else {
            console.debug("tick::unlisten: No such callback function.");
        }
    },
};

function signal_system_tick(timeDeltaMs) {
    Array.from(listeners).forEach(l=>l(timeDeltaMs));
}


/***/ }),

/***/ "./src/core/widget.js":
/*!****************************!*\
  !*** ./src/core/widget.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create_widget: () => (/* binding */ create_widget),
/* harmony export */   mount_widget: () => (/* binding */ mount_widget),
/* harmony export */   recurse_descendant_widgets: () => (/* binding */ recurse_descendant_widgets),
/* harmony export */   transformed_recursive_mesh: () => (/* binding */ transformed_recursive_mesh),
/* harmony export */   widget_contains_child: () => (/* binding */ widget_contains_child)
/* harmony export */ });
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug.js */ "./src/core/debug.js");
/*
 * 2022-2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */



// Call with create_widget(string, function) to create a named widget that
// gets appended to w95.widget[].
//
// Call with create_widget(function) to create an unnamed widget that does
// not get appended to w95.widget[].
function create_widget(...args) {
    let widgetName, widget_mount_fn;

    if (typeof args[0] === "string") {
        widgetName = args[0];
        widget_mount_fn = args[1];
    }
    else {
        widget_mount_fn = args[0];
        _debug_js__WEBPACK_IMPORTED_MODULE_0__.debug?.assert(args[1] === undefined);
    }

    _debug_js__WEBPACK_IMPORTED_MODULE_0__.debug?.assert(typeof widget_mount_fn === "function");

    widget_mount_fn._name = widgetName;
    const mounter_fn = (mountOptions, renderOptions)=>(parentWidget)=>mount_widget({
        mount_fn: widget_mount_fn,
        parentWidget,
        mountOptions,
        renderOptions,
    });
    
    if (widgetName === undefined) {
        widget_mount_fn._name = "anonymous";
        return mounter_fn;
    }
    else {
        _debug_js__WEBPACK_IMPORTED_MODULE_0__.debug?.assert(!w95.widget.hasOwnProperty(widgetName));
        w95.widget[widgetName] = mounter_fn;
    }
}

function mount_widget({
    mount_fn = undefined,
    mountOptions = {},
    renderOptions = {},
    parentWidget = undefined,
} = {}
){
    w95.debug?.assert(typeof mount_fn === "function");
    w95.debug?.assert((typeof parentWidget === "undefined") || (parentWidget._what === "w95-widget"));
    w95.debug?.assert(["function", "object"].includes(typeof renderOptions));
    w95.debug?.assert(["function", "object"].includes(typeof mountOptions));
    w95.debug?.assert(["function", "undefined"].includes(typeof mountOptions.Mounted));
    w95.debug?.assert(["function", "undefined"].includes(typeof mountOptions.Closed));
    w95.debug?.assert(["function", "undefined"].includes(typeof mountOptions.Opened));
    w95.debug?.assert(["function", "undefined"].includes(typeof mountOptions.BeforeRelease));
    w95.debug?.assert(["function", "undefined"].includes(typeof mountOptions.Form));
    w95.debug?.assert(["function", "undefined"].includes(typeof mountOptions.App));
    w95.debug?.assert(["function", "undefined"].includes(typeof mountOptions.Event));
    w95.debug?.assert(["function", "undefined"].includes(typeof mountOptions.Message));

    const expandedOptions = (
        (typeof mountOptions === "function")
            ? mountOptions()
            : mountOptions
    );
    const expandedArgs = (
        (typeof renderOptions === "function")
            ? renderOptions()
            : renderOptions
    );

    ["x", "y", "width", "height"].forEach(key=>{
        if (typeof expandedOptions[key] === "string") {
            expandedOptions[key] = eval(
                expandedOptions[key]
                    .replace("pw", parentWidget.width)
                    .replace("ph", parentWidget.height)
            );
        }
    });

    if (mount_fn.state) {
        w95.state.use(mount_fn.state, parentWidget);
    }

    const stateStartIdx = w95.state.head();
    
    // Render the widget.
    const widgetInterface = mount_fn(expandedOptions);
    {
        w95.debug?.assert(typeof widgetInterface === "object");

        const formGenerator = (widgetInterface.Form || widgetInterface.App);
        w95.debug?.assert(typeof formGenerator === "function");
        const widgetForm = [formGenerator.call(widgetInterface)].flat();

        Object.defineProperty(widgetInterface, "$name", {value: expandedOptions.$name});
        widgetInterface._what = "w95-widget";
        widgetInterface._type = (mount_fn.name || mount_fn._name);
        widgetInterface._mesh = widgetForm.filter(g=>(g?.$constructor === "Ngon"));
        widgetInterface._hideMesh = (expandedArgs.hideIf || false);
        widgetInterface._stateStartIdx = stateStartIdx;
        widgetInterface._remountRequested = false;
        widgetInterface._rerenderRequested = false;
        widgetInterface._autofocus = widgetInterface.autofocus;
        widgetInterface._zIndex = (()=>{
            switch (widgetInterface._type) {
                case "dialog":      return 0;
                case "menuBar":     return 1;
                case "dropdownBox": return 2;
                case "desktopIcon": return 3;
                default:            return 4;
            }
        })();

        widgetInterface._remount = function(parent) {
            w95.debug?.assert(parent._what === "w95-widget");

            if (w95.shell.display.debugLayer) {
                widgetInterface._domSkeleton.remove();
                recurse_descendant_widgets(widgetInterface, (child)=>child._domSkeleton.remove());
            }

            widgetInterface.BeforeRelease?.();
            recurse_descendant_widgets(widgetInterface, (child)=>child.BeforeRelease?.());

            const rerenderedInterface = mount_widget({
                mount_fn,
                parentWidget,
                mountOptions,
                renderOptions,
            });
            w95.debug?.assert(typeof rerenderedInterface === "object");

            w95.debug?.assert(rerenderedInterface.$descendants.length == widgetInterface.$descendants.length);
            for (let i = 0; i < rerenderedInterface.$descendants.length; i++) {
                const w1 = rerenderedInterface.$descendants[i].widget;
                const w2 = widgetInterface.$descendants[i].widget;

                if (w1._hideMesh !== w2._hideMesh) {
                    w1._hiddenStatusChanged = w1._hideMesh;
                }

                if (
                    (w1._type === "window") &&
                    (w1.title !== w2.title)
                ){
                    w1._windowTitleChanged = true;
                }
            }

            // Update cached references to this widget.
            {
                const childIdx = parent.$childWidgets.indexOf(widgetInterface);
                w95.debug?.assert(childIdx >= 0);
                parent.$childWidgets[childIdx] = rerenderedInterface;

                if (widgetInterface.$name) {
                    parent.$form[widgetInterface.$name] = rerenderedInterface;
                }
            }

            return rerenderedInterface;
        };

        // Allow 'this' inside Message and Event handler functions to refer to the widget interface.
        {
            for (const msgFnName of Object.keys(widgetInterface.Message || [])) {
                widgetInterface.Message[msgFnName] = widgetInterface.Message[msgFnName].bind(widgetInterface);
            }
            
            for (const eventFnName of Object.keys(widgetInterface.Event || [])) {
                widgetInterface.Event[eventFnName] = widgetInterface.Event[eventFnName].bind(widgetInterface);
            }
        }

        w95.state.mount(
            widgetInterface,
            ()=>{widgetInterface._remountRequested = true},
            ()=>{widgetInterface._rerenderRequested = true},
        );

        // The renderer doesn't support sub-pixel rasterization, so we'll want all
        // vertex coordinates to be rounded consistently.
        for (const ngon of widgetInterface._mesh) {
            for (const vertex of ngon.vertices) {
                vertex.x = ~~vertex.x;
                vertex.y = ~~vertex.y;
            }
        }

        // Render the widget's descendants. This will recurse down the widget's entire descendant
        // tree.
        {
            const childWidgetMountFuncs = widgetForm.filter(g=>(typeof g === "function"));
            const childWidgets = childWidgetMountFuncs.map(c=>c(widgetInterface));
            Object.defineProperty(widgetInterface, "$childWidgets", {value: childWidgets});
        }

        // Compile lists of the widget's descendants.
        {
            const descendants = [];
            const namedDescendants = {};

            recurse_descendant_widgets(widgetInterface, (child, parent, at)=>{
                descendants.push({
                    widget: child,
                    at,
                });

                child._hideMesh = (child._hideMesh || widgetInterface._hideMesh);
            });

            for (const child of widgetInterface.$childWidgets) {
                const key = child.$name;
                if (key && !namedDescendants.hasOwnProperty(key)) {
                    namedDescendants[key] = child;
                }
            }

            Object.defineProperty(widgetInterface, "$form", {value: namedDescendants});
            Object.defineProperty(widgetInterface, "$descendants", {value: descendants});
        }
        
        if (w95.shell.display.debugLayer) {
            const domSkeleton = widgetInterface._domSkeleton = document.createElement(`${widgetInterface._type.replace("_", "-")}-w95`);
            
            domSkeleton.style.width = `${widgetInterface.width * w95.shell.display.scale}px`;
            domSkeleton.style.height = `${widgetInterface.height * w95.shell.display.scale}px`;
            domSkeleton.style.left = `${widgetInterface.x * w95.shell.display.scale}px`;
            domSkeleton.style.top = `${widgetInterface.y * w95.shell.display.scale}px`;
            domSkeleton.classList.add("rerendered");

            if (widgetInterface._hideMesh) {
                domSkeleton.classList.add("hidden");
            }

            if (widgetInterface.hasFocus) {
                domSkeleton.classList.add("focused");
            }

            if (widgetInterface.$name) {
                domSkeleton.dataset.name = widgetInterface.$name;
            }

            if (["label", "button"].includes(widgetInterface._type)) {
                domSkeleton.innerText = widgetInterface.text;
            }

            clearInterval(domSkeleton.$rerenderInterval);
            domSkeleton.$rerenderInterval = setTimeout(()=>{
                domSkeleton.classList.remove("rerendered");
            }, 500);

            if (widgetInterface.$childWidgets.length && widgetInterface.$childWidgets.every(w=>w._hideMesh)) {
                widgetInterface._domSkeleton.classList.add("hidden");
            }

            if (widgetInterface._domSkeleton.classList.contains("hidden")) {
                recurse_descendant_widgets(widgetInterface, (child)=>{
                    child._domSkeleton.classList.add("hidden");
                });
            }
        }
    }

    widgetInterface.Mounted?.({parentWidget});

    return widgetInterface;
}

function transformed_recursive_mesh(widget, x = 0, y = 0) {
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof widget === "object");

    return recursively_concat_child_meshes(widget);

    function recursively_concat_child_meshes(
        widget,
        clipRect = {
            left: ((widget.x || 0) + x),
            top: ((widget.y || 0) + y),
            right: ((widget.x || 0) + x + (widget.width || 0)),
            bottom: ((widget.y || 0) + y + (widget.height || 0)),
        },
        dstArray = [],
        baseX = x,
        baseY = y
    ){
        w95.debug?.assert(widget?._what === "w95-widget");
        w95.debug?.assert(typeof clipRect === "object");
        w95.debug?.assert(typeof baseX === "number");
        w95.debug?.assert(typeof baseY === "number");
        w95.debug?.assert(Array.isArray(dstArray));

        const widgetX = (widget.x || 0);
        const widgetY = (widget.y || 0);
        const widgetWidth = (widget.width || 0);
        const widgetHeight = (widget.height || 0);

        widget._clipRect = clipRect;
        baseX += widgetX;
        baseY += widgetY;
        const selfMesh = transformed_ngons(widget._mesh, clipRect, baseX, baseY);

        if (widget.dom) {
            const clipWidth = Math.min(widget.width, (widget._clipRect.right -widget._clipRect.left));
            const clipHeight = Math.min(widget.height, (widget._clipRect.bottom - widget._clipRect.top));
            widget.dom.style.left = `${Math.floor(baseX) * w95.shell.display.scale}px`;
            widget.dom.style.top = `${Math.floor(baseY) * w95.shell.display.scale}px`;
            widget.dom.style.width = `${Math.floor(clipWidth) * w95.shell.display.scale}px`;
            widget.dom.style.height = `${Math.floor(clipHeight) * w95.shell.display.scale}px`;
            widget.dom.style.fontSize = `${Math.max(50, ((w95.shell.display.scale - 1) * 100))}%`;
            widget.dom.style.visibility = "visible";
        }

        if (widget._domSkeleton) {
            widget._domSkeleton.style.left = `${Math.floor(baseX) * w95.shell.display.scale}px`;
            widget._domSkeleton.style.top = `${Math.floor(baseY) * w95.shell.display.scale}px`;
        }

        const startIdx = dstArray.length;

        if (!widget._hideMesh) {
            dstArray.unshift(...selfMesh);

            const hasUnlimitedClipRect = (
                !clipRect ||
                widget.isActivePopupMenu ||
                widget.isActiveDialog ||
                widget._type === "verticalLayout" ||
                widget._type === "horizontalLayout" ||
                widget._type === "dynamicWrapper"
            );

            for (const child of widget.$childWidgets) {
                const subClipRect = (
                    hasUnlimitedClipRect
                        ? null
                        : {
                            left: Math.max(clipRect.left, baseX),
                            top: Math.max(clipRect.top, baseY),
                            right: Math.min(clipRect.right, (baseX + widgetWidth)),
                            bottom: Math.min(clipRect.bottom, (baseY + widgetHeight)),
                        }
                );
                recursively_concat_child_meshes(child, subClipRect, dstArray, baseX, baseY);
            }
        }

        // Certain widgets should be rendered above all other widgets, so let's make it so.
        if (widget.isActivePopupMenu || widget.isActiveDialog) {
            for (let i = 0; i < (dstArray.length - startIdx); i++) {
                for (const vert of dstArray[i].vertices) {
                    vert.z--;
                }
            }
        }

        return dstArray;
    }
    
    function transformed_ngons(ngons, clipRect, worldX, worldY) {
        w95.debug?.assert(Array.isArray(ngons));
        w95.debug?.assert(typeof worldX === "number");
        w95.debug?.assert(typeof worldY === "number");

        // Shallowly copy the n-gons, with an additional one-level-deep copy of the vertex data.
        let transformedNgons = ngons.map(ngon=>({
            ...ngon,
            vertices: ngon.vertices.map(v=>({...v})),
        }));

        // Into world space.
        for (const ngon of transformedNgons) {
            for (const vertex of ngon.vertices) {
                vertex.x += worldX;
                vertex.y += worldY;
            }
        }

        // If clipping is allowed.
        if (clipRect) {
            // Remove n-gons that don't intersect the clipping rect at all.
            transformedNgons = transformedNgons.filter(n=>(
                n.vertices.some(v=>(
                    ((v.x >= clipRect.left) && (v.x < clipRect.right)) &&
                    ((v.y >= clipRect.top) && (v.y < clipRect.bottom))
                ))
            ));

            for (const ngon of transformedNgons) {
                ngon._clipRect = clipRect;
            }
        }

        return transformedNgons;
    }
}

function recurse_descendant_widgets(parent, callback_fn = (child, parent, at)=>{}, skipHidden = false, at = {x:0, y:0}) {
    if (!parent) {
        return;
    }

    w95.debug?.assert(typeof parent === "object");

    for (const child of (parent.$childWidgets || [])) {
        const callbackResult = ((skipHidden && child._hideMesh) || callback_fn(child, parent, {x:at.x+child.x, y:at.y+child.y}));

        switch (callbackResult) {
            // Don't recurse the children of this widget.
            case true: continue;

            // Stop recursing entirely.
            case null: return;

            default: break;
        }

        recurse_descendant_widgets(child, callback_fn, skipHidden, {x:at.x+child.x, y:at.y+child.y});
    }
}

// Returns true if the given parent widget contains the given child widget; false
// otherwise.
function widget_contains_child(parentWidget, childWidget) {
    w95.debug?.assert(parentWidget._what === "w95-widget");
    w95.debug?.assert(childWidget._what === "w95-widget");

    let hasChild = false;
            
    recurse_descendant_widgets(parentWidget, (child)=>{
        if (child === childWidget) {
            hasChild = true;
            return null;
        }
    });

    return hasChild;
}


/***/ }),

/***/ "./src/core/window-manager.js":
/*!************************************!*\
  !*** ./src/core/window-manager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   windowManager: () => (/* binding */ windowManager)
/* harmony export */ });
/* harmony import */ var _core_app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/app.js */ "./src/core/app.js");
/* harmony import */ var _core_widget_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/widget.js */ "./src/core/widget.js");
/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */




const runningApps = [];
let numAppsLaunched = 0;
let desktop = undefined;
let taskbar = undefined;

const windowManager = {
    // Returns as an array all of the apps that are currently running under this window manager.
    get apps() {
        return runningApps;
    },
    get isPopupMenuActive() {
        return Boolean(w95.windowManager.get_active_popup_menu().popupWidget);
    },
    get isDialogActive() {
        return runningApps.some(app=>w95.windowManager.get_active_dialog(app).widget);
    },
    get desktop() {
        return desktop?.window;
    },
    get taskbar() {
        return taskbar?.window;
    },
    // Returns the current active popup menu (e.g. the drop-down list of a combo box).
    get_active_popup_menu: function() {
        let popupWidget = undefined;
        let popupWidgetCoordinates = undefined;

        for (const app of runningApps) {
            w95.$recurseDescendantWidgets(app.window, (widget, parent, at)=>{
                if (widget.isActivePopupMenu) {
                    popupWidget = widget;
                    popupWidgetCoordinates = {
                        x: (at.x + app.x),
                        y: (at.y + app.y),
                    };
                    return null;
                }
            });
        }

        return {
            popupWidget: popupWidget,
            at: popupWidgetCoordinates,
        };
    },
    get_active_dialog: function(app) {
        w95.debug?.assert(app._type === "app");
        
        let dialogWidget = undefined;
        let widgetAt = undefined;

        w95.$recurseDescendantWidgets(app.window, (widget, parent, at)=>{
            if (widget.isActiveDialog) {
                dialogWidget = widget;
                widgetAt = {
                    x: (at.x + app.x),
                    y: (at.y + app.y),
                };
                return null;
            }
        });

        return {
            widget: dialogWidget,
            at: widgetAt,
        };
    },
    raise_window: function(windowWidget, noFocus = false) {
        w95.debug?.assert(windowWidget._what === "w95-widget");
        w95.debug?.assert(windowWidget._type === "window");

        const targetAppIdx = runningApps.findIndex(app=>app.window === windowWidget);

        if (targetAppIdx < 0) {
            console.warn("No such window to raise.");
            return; 
        }

        let raisedIdx = targetAppIdx;

        if (!windowWidget.isDesktop && targetAppIdx) {
            runningApps.unshift(runningApps.splice(targetAppIdx, 1)[0]);
            raisedIdx = 0;
        }

        w95.windowManager.update_z_indices();

        runningApps.forEach((app, idx)=>app.window?.Message?.[(!noFocus && (idx == raisedIdx))? "focus" : "blur"]?.());

        const parentApp = w95.windowManager.get_parent_app(windowWidget);
        w95.debug?.assert(parentApp._type === "app");
        const activeDialog = w95.windowManager.get_active_dialog(parentApp).widget;
        if (activeDialog) {
            w95.debug?.assert(activeDialog?._type === "dialog");
            activeDialog.Message.focus();
        }

        taskbar?.appObject.Message.refresh();
    },
    update_z_indices(suppressDomElements = false) {
        runningApps.forEach((app, idx)=>{
            suppressDomElements = suppressDomElements || app.window.isBlurred || Boolean(
                w95.windowManager.get_active_dialog(app).widget ||
                w95.windowManager.get_active_popup_menu(app).widget
            );
            app._canvas.style.zIndex = -(idx * 2);
            w95.$recurseDescendantWidgets(app.window, (w)=>{
                if (w._type === "domElement") {
                    w.Message.setZIndex(-(idx * 2) - (suppressDomElements? 1 : -1));
                    return null;
                }
            });
        });
    },
    // Ask the window manager to close and release the given window (and its app).
    release_window: function(windowWidget) {
        w95.debug?.assert(windowWidget._what === "w95-widget");
        w95.debug?.assert(windowWidget._type === "window");
        
        const targetAppIdx = runningApps.findIndex(app=>app.window === windowWidget);

        if (targetAppIdx < 0) {
            console.warn("No such running application to release.");
            return; 
        }

        const targetApp = runningApps[targetAppIdx];
        taskbar?.appObject.Message.removeApp(targetApp);
        targetApp.appObject.Closed?.();
        targetApp.release();
        targetApp._canvas.remove();
        targetApp.rootWidget._domSkeleton?.remove();
        runningApps.splice(targetAppIdx, 1);

        if (runningApps.length > (!!taskbar + !!desktop)) {
            w95.windowManager.raise_window(runningApps.filter(a=>![taskbar, desktop].includes(a))[0].window);
        }
        else if (desktop) {
            w95.windowManager.raise_window(desktop.window);
        }
    },
    post_tick_inspect: function() {
        for (const app of runningApps) {
            // If a new dialog has popped up, blur its parent window.
            if (!app.window.isBlurred) {
                w95.$recurseDescendantWidgets(app, w=>{
                    if (w.isActiveDialog) {
                        app.window.Message.blur();
                        w.Message.focus();
                        w95.windowManager.update_autofocus(w);
                        return null;
                    }
                });
            }

            if (app.window._windowTitleChanged) {
                taskbar?.appObject.Message.refresh();
                app.window._windowTitleChanged = false;
            }
        }

        // Detect widget opening/closing.
        w95.$recurseDescendantWidgets(runningApps[0], w=>{
            if (w._hiddenStatusChanged === true) {
                if (w._type === "dialog") {
                    w95.windowManager.raise_window(runningApps[0].window);
                }
                w.Closed?.();
            }
            else if (w._hiddenStatusChanged === false) {
                w.Opened?.();
            }
            w._hiddenStatusChanged = undefined;
        });
    },
    update_autofocus(widget) {
        w95.$recurseDescendantWidgets(widget, w=>{
            if (w._autofocus && !w._hideMesh) {
                w.Message.focus();
                w._autofocus = false;
                return null;
            }
        });
    },
    // Ask the window manager to spawn and manage an instance of the given app(s). The apps'
    // windows will be displayed to the user and the user's input will be directed to the
    // apps' windows.
    //
    // Usage: "govern(app)" or "govern([app1, app2, ...])".
    govern: function(applications, {singleInstance = false} = {}) {
        [applications].flat().forEach(a=>{
            const appInstance = (0,_core_app_js__WEBPACK_IMPORTED_MODULE_0__.app)(a.Meta, numAppsLaunched++, ()=>({
                ...a,
                App: (mountOptions)=>()=>(0,_core_widget_js__WEBPACK_IMPORTED_MODULE_1__.mount_widget)({mount_fn: a.App, mountOptions})
            }));

            if (singleInstance && runningApps.some(a=>a.name === appInstance.name)) {
                w95.windowManager.raise_window(runningApps.find(a=>a.name === appInstance.name ).window);
                return;
            }
            
            appInstance.window.isDesktop
                ? runningApps.push(appInstance)
                : runningApps.unshift(appInstance);

            const canvas = appInstance._canvas = document.createElement("canvas");
            canvas.dataset.w95App = appInstance.name;
            canvas.dataset.w95AppId = appInstance.id;
            document.body.append(canvas);

            ["mousemove", "mousedown", "mouseup", "dblclick"].forEach(eventType=>{
                canvas.addEventListener(eventType, w95.windowManager.user_input);
            });

            w95.shell.display.debugLayer?.append(appInstance.rootWidget._domSkeleton);
            taskbar = (appInstance.appObject.isTaskbar? appInstance : taskbar);
            desktop = (appInstance.appObject.isDesktop? appInstance : desktop);
            appInstance.appObject.Opened?.call(appInstance);

            if (
                !appInstance.appObject.isTaskbar &&
                !appInstance.appObject.isDesktop
            ){
                taskbar?.appObject.Message.addApp(appInstance);
            }
        });

        if (runningApps.length) {
            w95.windowManager.raise_window(runningApps[0].window);
        }

        w95.windowManager.update_autofocus(runningApps[0].window);
    },
    get_parent_app: function(widget) {
        if (!widget) {
            return undefined;
        }

        w95.debug?.assert(widget._what === "w95-widget");

        for (const app of runningApps) {
            if (
                (app.window === widget) ||
                (0,_core_widget_js__WEBPACK_IMPORTED_MODULE_1__.widget_contains_child)(app.window, widget)
            ){
                return app;
            }
        }

        return undefined;
    },
    move_window_to(windowWidget, {x, y}) {
        const app = w95.windowManager.get_parent_app(windowWidget);
        w95.debug?.assert(app?._type === "app");

        w95.windowManager.move_window(windowWidget, {
            x: ((x !== undefined)? (x - app.x) : undefined),
            y: ((y !== undefined)? (y - app.y) : undefined),
        });
    },
    move_window(windowWidget, {x, y}) {
        w95.debug?.assert(windowWidget._type === "window");
        w95.debug?.assert(["undefined", "number"].includes(typeof x));
        w95.debug?.assert(["undefined", "number"].includes(typeof y));

        const app = w95.windowManager.get_parent_app(windowWidget);
        w95.debug?.assert(app?._type === "app");

        (x? app.x += x : 0);
        (y? app.y += y : 0);
        app.rerasterize();
    },
    resize_window(windowWidget, {x, y, width, height}) {
        w95.debug?.assert(windowWidget._type === "window");
        w95.debug?.assert(["undefined", "number"].includes(typeof x));
        w95.debug?.assert(["undefined", "number"].includes(typeof y));
        w95.debug?.assert(["undefined", "number"].includes(typeof width));
        w95.debug?.assert(["undefined", "number"].includes(typeof height));

        const app = w95.windowManager.get_parent_app(windowWidget);
        w95.debug?.assert(app?._type === "app");

        (width? app.width = width : 0);
        (height? app.height = height : 0);
        w95.windowManager.move_window_to(app.window, {x, y});
    },
    root_widget: function(widget) {
        w95.debug?.assert(widget._what === "w95-widget");

        if (widget._type === "window") {
            return widget;
        }

        for (const app of runningApps) {
            if ((0,_core_widget_js__WEBPACK_IMPORTED_MODULE_1__.widget_contains_child)(app.window, widget)) {
                return app.window;
            }
        }

        return undefined;
    },
    user_input: function(event) {
        const intersectionPoint = {
            x: (event.offsetX / w95.shell.display.scale),
            y: (event.offsetY / w95.shell.display.scale),
        };

        const focusedWidget = find_focused_widget();
        const grabbedWidget = find_grabbed_widget();
        const [intersectedWindow, intersectedApp] = find_intersected_window();

        let intersectedWidgets;
        if (intersectedWindow?._type === "dialog") {
            w95.debug?.assert(typeof intersectedWindow._intersectedAt === "object");
            w95.debug?.assert(typeof intersectedWindow._intersectedAt.x === "number");
            w95.debug?.assert(typeof intersectedWindow._intersectedAt.y === "number");
            intersectedWidgets = find_intersected_widgets(
                intersectedWindow,
                intersectedWindow._intersectedAt.x,
                intersectedWindow._intersectedAt.y
            );
        }
        else {
            intersectedWidgets = find_intersected_widgets(
                intersectedWindow,
                (intersectedApp?.x || 0),
                (intersectedApp?.y || 0)
            );
        }

        switch (event.constructor) {
            case KeyboardEvent: {
                (focusedWidget || intersectedWindow)?.Event?.[event.type]?.(event)
                break;
            }
            case MouseEvent: {
                runningApps.forEach(app=>(0,_core_widget_js__WEBPACK_IMPORTED_MODULE_1__.recurse_descendant_widgets)(app.window, (widget)=>{
                    if (!widget.isHovered && intersectedWidgets.includes(widget)) {
                        widget.Event?.mouseenter?.({
                            event,
                            at: widget._intersectedAt,
                        });
                    }
                    else if (widget.isHovered && !intersectedWidgets.includes(widget)) {
                        widget.Event?.mouseleave?.({
                            event,
                            at: widget._intersectedAt,
                        });
                    }
                }, true));

                if (grabbedWidget) {
                    grabbedWidget.Event?.[event.type]?.({
                        event,
                        at: grabbedWidget._intersectedAt,
                    });
                }
                else {
                    switch (event.type) {
                        case "mousedown": {
                            if (!intersectedWidgets.some(w=>w._type === "menuItem")) {
                                runningApps[0]?.window.menuBar?.Message.closeMenus();
                            }

                            (0,_core_widget_js__WEBPACK_IMPORTED_MODULE_1__.recurse_descendant_widgets)(runningApps[0]?.window, (widget)=>{
                                if (
                                    (widget._type === "dropdownBoxList") &&
                                    !intersectedWidgets.some(w=>w === widget)
                                ){ 
                                    widget.Message.close();
                                }
                            });

                            focusedWidget?.Message.blur();

                            if (intersectedWindow?._type === "window") {
                                w95.windowManager.raise_window(intersectedWindow);
                            }
                            else if (intersectedWindow?._type === "dialog") {
                                const parentWindow = w95.windowManager.root_widget(intersectedWindow);
                                w95.debug?.assert(parentWindow?._type === "window");
                                w95.windowManager.raise_window(parentWindow, true);
                            }

                            break;
                        }
                        default: break;
                    }

                    // Note: We assume that if this event is "mousedown" it has already been
                    // processed to the extent that the parent window has been marked as
                    // non-blurred.
                    if (!intersectedWindow?.isBlurred) {
                        let mouseResponders = (
                            intersectedWidgets
                            .filter(w=>typeof w.Event?.[event.type] === "function")
                            .map(w=>({widget: w, handler: w.Event?.[event.type], _intersectedAt: w._intersectedAt}))
                        );

                        mouseResponders.sort((a, b)=>(a.widget._zIndex < b.widget._zIndex? -1 : 1));

                        for (const responder of mouseResponders) {
                            responder.widget.Message?.focus?.();
                            if (responder.handler({event, at: responder._intersectedAt}) === true) {
                                break;
                            }
                        }
                    }
                }
            }
        }

        function debug_report_event(event, targetWidget) {
            const description = (()=>{
                switch (targetWidget._type) {
                    case "label": return targetWidget.text;
                    case "button": return targetWidget.text;
                    default: return targetWidget.$name;
                }
            })();

            console.debug(`Event::${event.type} → ${targetWidget._zIndex}:${targetWidget._type} (${description})`);
        }

        function find_intersected_window() {
            if (w95.windowManager.isPopupMenuActive) {
                return [runningApps[0]?.window, runningApps[0]];
            }

            for (const app of runningApps) {
                const {widget:dialogWidget, at} = w95.windowManager.get_active_dialog(app);
                const appRect = {
                    x: app.x,
                    y: app.y,
                    width: app.window.width,
                    height: app.window.height,
                };
                
                if (
                    dialogWidget &&
                    (
                        is_point_inside_rectangle(intersectionPoint, appRect) ||
                        is_point_inside_rectangle(intersectionPoint, {...dialogWidget, ...at})
                    )
                ){
                    dialogWidget._intersectedAt = at;
                    return [dialogWidget, app];
                }
                else if (is_point_inside_rectangle(intersectionPoint, appRect)) {
                    return [app.window, app];
                }
            }

            return [undefined, undefined];
        }

        function find_grabbed_widget() {
            let grabbedWidget = undefined;
            runningApps.forEach(p=>(0,_core_widget_js__WEBPACK_IMPORTED_MODULE_1__.recurse_descendant_widgets)(p.window, (widget, parent, at)=>{
                if (widget.isGrabbed || widget.isBorderGrabbed) {
                    grabbedWidget = widget;
                    grabbedWidget._intersectedAt = {
                        x: ~~(intersectionPoint.x - p.x - at.x),
                        y: ~~(intersectionPoint.y - p.y - at.y),
                    };
                    return null;
                }
            }, true));
            return grabbedWidget;
        }

        function find_focused_widget() {
            let focusedWidget = undefined;

            for (const p of runningApps) {
                if (p.window.hasFocus) {
                    focusedWidget = p.window;
                    break;
                }

                (0,_core_widget_js__WEBPACK_IMPORTED_MODULE_1__.recurse_descendant_widgets)(p.window, (widget)=>{
                    if (widget.hasFocus) {
                        focusedWidget = widget;
                        return null;
                    }
                }, true);
            }

            return focusedWidget;
        }

        function find_intersected_widgets(
            parentWidget,
            x = 0,
            y = 0,
            dstArray = []
        ){
            if (typeof parentWidget === "undefined") {
                return [];
            }

            w95.debug?.assert(Array.isArray(dstArray));
            w95.debug?.assert(typeof parentWidget === "object");
            w95.debug?.assert(typeof x === "number");
            w95.debug?.assert(typeof y === "number");

            if (!parentWidget._hideMesh) {
                if (
                    is_point_inside_rectangle(intersectionPoint, {...parentWidget, x: (x + parentWidget.x), y: (y + parentWidget.y)}) &&
                    (!parentWidget._clipRect || parentWidget.isActivePopupMenu || is_point_inside_clip_rect(intersectionPoint, parentWidget._clipRect))
                ){
                    parentWidget._intersectedAt = {
                        x: ~~(intersectionPoint.x - x - parentWidget.x),
                        y: ~~(intersectionPoint.y - y - parentWidget.y),
                    };
                    dstArray.push(parentWidget);
                }

                x += parentWidget.x;
                y += parentWidget.y;
                
                const children = [...parentWidget.$childWidgets].sort((a, b)=>(a._zIndex < b._zIndex? -1 : 1));

                for (const child of children) {
                    find_intersected_widgets(child, x, y, dstArray);
                }
            }

            return dstArray;
        }

        function is_point_inside_clip_rect(point, rect) {
            return (
                (point.x >= rect.left && (point.x < rect.right) &&
                (point.y >= rect.top) && (point.y < (rect.bottom - 1)))
            )
        }

        function is_point_inside_rectangle(point, rect) {
            if (!point || !rect) {
                return false;
            }
            return (
                (point.x >= rect.x) &&
                (point.x <= (rect.x + rect.width - 1)) &&
                (point.y >= rect.y) &&
                (point.y <= (rect.y + rect.height - 1))
            )
        }
    },
};


/***/ }),

/***/ "./src/w95.css":
/*!*********************!*\
  !*** ./src/w95.css ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "w95.css";

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/api/api.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   w95: () => (/* binding */ w95)
/* harmony export */ });
/* harmony import */ var _core_rngon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/rngon.js */ "./src/core/rngon.js");
/* harmony import */ var _core_rngon_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_rngon_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _w95_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../w95.css */ "./src/w95.css");
/* harmony import */ var _core_widget_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/widget.js */ "./src/core/widget.js");
/* harmony import */ var _core_palette_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/palette.js */ "./src/core/palette.js");
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/debug.js */ "./src/core/debug.js");
/* harmony import */ var _core_clock_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/clock.js */ "./src/core/clock.js");
/* harmony import */ var _core_state_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/state.js */ "./src/core/state.js");
/* harmony import */ var _core_tick_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/tick.js */ "./src/core/tick.js");
/* harmony import */ var _core_shell_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/shell.js */ "./src/core/shell.js");
/* harmony import */ var _core_registry_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../core/registry.js */ "./src/core/registry.js");
/* harmony import */ var _core_window_manager_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../core/window-manager.js */ "./src/core/window-manager.js");
/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

if (true) {
    console.log(
        "This is a %cdebug build %cof w95.",
        "font-weight: bold;",
        "font-weight: normal;"
    );
}















const w95 = {
    clock: _core_clock_js__WEBPACK_IMPORTED_MODULE_5__.clock,
    tick: _core_tick_js__WEBPACK_IMPORTED_MODULE_7__.tick,
    registry: _core_registry_js__WEBPACK_IMPORTED_MODULE_9__.registry,
    palette: _core_palette_js__WEBPACK_IMPORTED_MODULE_3__.palette,
    state: _core_state_js__WEBPACK_IMPORTED_MODULE_6__.state,
    keep: _core_state_js__WEBPACK_IMPORTED_MODULE_6__.keep,
    debug: _core_debug_js__WEBPACK_IMPORTED_MODULE_4__.debug,
    shell: _core_shell_js__WEBPACK_IMPORTED_MODULE_8__.shell,
    windowManager: _core_window_manager_js__WEBPACK_IMPORTED_MODULE_10__.windowManager,
    StateVariable: _core_state_js__WEBPACK_IMPORTED_MODULE_6__.StateVariable,
    version: `BETA ${"2024-01-15.19:23:10"}`,
    $recurseDescendantWidgets: _core_widget_js__WEBPACK_IMPORTED_MODULE_2__.recurse_descendant_widgets,
    font:  {
        stringWidth(text = "", font = w95.font, initialFontVariant = w95.font.regular, letterSpacing = 1, wordSpacing = 3) {
            w95.debug?.assert(typeof text === "string");
            w95.debug?.assert(typeof font === "object");
            w95.debug?.assert(typeof letterSpacing === "number");
            w95.debug?.assert(typeof wordSpacing === "number");

            let fontVariant = initialFontVariant;

            return text.split("\n").reduce((len, line)=>(Math.max(len, line_length(line))), 0);

            function line_length(line) {
                return line.split("").reduce((len, char)=>{
                    const charCode = char.charCodeAt(0);
                    const glyph = (fontVariant[charCode] || fontVariant[63]);

                    // \v (toggle underlining on/off).
                    if (charCode === 11) {
                        return len;
                    }

                    // \r (set text color).
                    if (charCode === 13) {
                        return len;
                    }

                    // \b (toggle bold font on/off).
                    if (charCode === 8) {
                        fontVariant = ((fontVariant === font.regular)? font.bold : font.regular);
                        return len;
                    }
    
                    // Space.
                    if (charCode === 32) {
                        return (len + (wordSpacing * letterSpacing));
                    }
    
                    return (len + (glyph.leftSpacing + glyph.width + letterSpacing));
                }, 0);
            }
        },
        stringHeight(text = "", font = w95.font, initialFontVariant = w95.font.regular, ) {
            w95.debug?.assert(typeof text === "string");
            w95.debug?.assert(typeof font === "object");

            return (text.split("\n").length * initialFontVariant.lineHeight);
        },
    },
    widget: _core_widget_js__WEBPACK_IMPORTED_MODULE_2__.create_widget,
    styleHint: {
        ...[
            "void",
            "raised",
            "lowered",
            "disabled",
            "action",
            "focused",
            "plain",
            "dialog",
            "noBorder",
            "bold",
            "underlined",
            "alignVCenter",
            "alignTop",
            "alignBottom",
            "alignHCenter",
            "alignLeft",
            "alignRight",
            "vertical",
            "horizontal",
            "solid",
            "dashed",
            "dotted",
            "inverted",
            "resizable",
            "transparent",
            "first",
        ].reduce((acc, flag)=>({...acc, ...{[flag]: flag}}), {})
    },
    frameShape: {
        dialog: "dialog",
        resizableWindow: "resizableWindow",
        widget: "widget",
        inlineWidget: "inlineWidget",
        input: "input",
        box: "box",
        fancyBox: "fancyBox",
        plain: "plain",
        none: "none",
        dropdownList: "dropdownList",
        dropdownButton: "dropdownButton",
        tabControlButton: "tabControlButton",
    },
    buttonShape: {
        regular: "regular",
        dropdown: "dropdown",
        tabControl: "tabControl",
        flat: "flat",
    },
};

})();

var __webpack_export_target__ = self;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;