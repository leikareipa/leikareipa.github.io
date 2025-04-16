import {icons} from "/desktop/$apps/pillunsaamislaskuri/icons.js";

class RNG {
    constructor(seed = Date.now()) {
        this.state = seed >>> 0;
    }

    next() {
        // Mulberry32 PRNG.
        let t = this.state += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    normal(mean, stddev) {
        // Box-Muller transform.
        let u = 0;
        let v = 0;

        while (u === 0) u = this.next();
        while (v === 0) v = this.next();

        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + z * stddev;
    }
}

const CANVAS_WIDTH = 145;
const CANVAS_HEIGHT = 232;
let RENEWAL_INTERVAL = 0;
const MORPH_DURATION = 900;

export default {
    Meta: {
        name: "Pilluohjelma",
        author: w95.registry["self"],
    },

    App() {
        const width = w95.state(CANVAS_WIDTH + 9);
        const height = w95.state(CANVAS_HEIGHT + 29);

        const x = w95.state(
            ~~(0.5 * (w95.shell.display.width - width.now)),
            w95.reRenderOnly
        );

        const y = w95.state(
            ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
            w95.reRenderOnly
        );

        const rng = new RNG(Date.now());

        const redraw = w95.state(0);
        const tick = w95.state(0);
        const lastRenewal = w95.state(performance.now());
        const isAboutDialogOpen = w95.state(false);

        const initialScene = randomizeScene(rng);

        const scene = w95.state({
            from: initialScene,
            to: initialScene,
            startedAt: performance.now(),
        });

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },

            Opened() {
                update();
                w95.clock.listen(update);
                RENEWAL_INTERVAL = 20;
            },

            Closed() {
                RENEWAL_INTERVAL = 0;
            },

            Mounted() {
                redraw.set(redraw.now+1);
            },

            Form() {
                // Read tick so the render surface updates when update() bumps it.
                tick.now;

                const now = performance.now();

                return w95.widget.window({
                    parent: this,
                    title: "Allsorts",
                    icon: icons.app16,

                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },

                    close() {
                        w95.windowManager.release_window(this);
                    },

                    children: [
                        w95.widget.frame({
                            x: 0,
                            y: 1,
                            width: CANVAS_WIDTH+1,
                            height: CANVAS_HEIGHT+1,
                            shape: w95.frameShape.box,

                            children: [
                                w95.widget.renderSurface({
                                    x: 1,
                                    y: 1,
                                    width: CANVAS_WIDTH-1,
                                    height: CANVAS_HEIGHT,

                                    meshes: [
                                        Rngon.mesh(
                                            buildNgons(
                                                currentMorphedScene(scene.now, now),
                                                now,
                                                lastRenewal.now
                                            )
                                        ),
                                    ],

                                    backgroundColor: w95.palette.named.transparent,

                                    options: {
                                        useDepthBuffer: false,
                                        useBackfaceCulling: false,
                                    },

                                    pipeline: {
                                        // With depth disabled, this keeps the input order acting
                                        // like painter's order.
                                        ngonSorter: undefined,
                                    },
                                }),
                            ],
                        }),

                        w95.shell.popup.about({
                            parent: this,
                            onClose() {
                                isAboutDialogOpen.set(false);
                            },
                        }, {
                            hideIf: !isAboutDialogOpen.now,
                        }),
                    ],
                });
            },
        };

        function update() {
            const now = performance.now();

            if ((now - lastRenewal.now) >= RENEWAL_INTERVAL) {
                const currentScene = currentMorphedScene(scene.now, now);
            
                lastRenewal.set(now);
            
                scene.set({
                    from: currentScene,
                    to: randomizeScene(rng),
                    startedAt: now,
                });
            }

            tick.set(tick.now + 1);
        }
    },
};

function randomizeScene(rng) {
    const w = CANVAS_WIDTH;
    const h = CANVAS_HEIGHT;

    const rand = () => rng.next();
    const rgba = (r, g, b, a255 = 255) => Rngon.color(r, g, b, a255);

    const hairXStdDev = 15 + rand() * 40;
    const hairYStdDev = 40 + rand() * 10;

    const scene = {};

    scene.majoraWidth = 70 + rand() * 80;
    scene.majoraHeight = 200;

    scene.minoraWidth = 10 + rand() * 70;
    scene.minoraHeight = 200;

    if (scene.minoraWidth > scene.majoraWidth) {
        scene.minoraWidth = scene.majoraWidth;
    }

    scene.innerWidth = rand() * 50;
    scene.innerHeight = 200;

    if (scene.innerWidth > scene.minoraWidth) {
        scene.innerWidth = scene.minoraWidth;
    }

    scene.orificeWidth = 5 + rand() * 35;
    scene.orificeHeight = scene.orificeWidth * (1 + rand() * 0.5);
    scene.orificeLocation = 65 + rand() * 20;

    scene.minoraOffset = 6 + rand() * 22;
    scene.minoraOffset = scene.majoraHeight * scene.minoraOffset / 100;

    scene.clitWidth = 7 + rand() * 10;
    scene.clitHeight = scene.clitWidth * (1 + rand() / 2);

    const colorRoll = rand();

    scene.clitColor = Rngon.color.pink;

    if (colorRoll <= 0.1) {
        scene.hairColor = rgba(140, 80, 80);
    } else if (colorRoll <= 0.4) {
        scene.hairColor = rgba(180, 50, 50);
    } else if (colorRoll <= 0.95) {
        scene.hairColor = rgba(160, 80, 80);
    }
    else {
        scene.hairColor = rgba(210, 20, 20);
    }

    scene.hairLines = [];

    let numFollicles = Math.floor(200 + rand() * 1200);
    let hairLength = 1 + rand() * 7;
    hairLength *= 1 + rand();

    for (let i = 0; i < numFollicles; i++) {
        const targetX = w / 2 + rand() * 50 - rand() * 50;
        const targetY = h / 2 + rand() * 50 - rand() * 50;

        const follicleX = rng.normal(w / 2, hairXStdDev);
        const follicleY =
            rng.normal(h / 2, hairYStdDev) -
            scene.majoraHeight / 2 -
            rand() * 10;

        scene.hairLines.push(
            makeLineFromPointToward(
                follicleX,
                follicleY,
                targetX,
                targetY,
                hairLength
            )
        );
    }

    return scene;
}

function makeLineFromPointToward(x1, y1, tx, ty, length) {
    const dx = tx - x1;
    const dy = ty - y1;
    const d = Math.hypot(dx, dy);

    if (d === 0) {
        return {x1, y1, x2: x1, y2: y1};
    }

    return {
        x1,
        y1,
        x2: x1 + dx / d * length,
        y2: y1 + dy / d * length,
    };
}

function buildNgons(scene, now, lastRenewal) {
    const w = CANVAS_WIDTH;
    const h = CANVAS_HEIGHT;

    const ngons = [];

    const background = Rngon.color(240, 240, 240);
    const anatomyGrey = Rngon.color(128, 128, 128);
    const lightGrey = Rngon.color(211, 211, 211);
    
    const scale = 0.75;
    const yOffset = 25;

    const cx = w / 2;
    const cy = h / 2;

    const zx = (x) => cx + (x - cx) * scale;
    const zy = (y) => cy + (y - cy) * scale + yOffset;
    const zw = (v) => v * scale;

    const zRect = (r) => ({
        x: zx(r.x),
        y: zy(r.y),
        width: zw(r.width),
        height: zw(r.height),
    });

    const zStroke = (v) => v * scale;

    // Background.
    addNgon(ngons, [
        {x: 0, y: 0},
        {x: w - 1, y: 0},
        {x: w - 1, y: h - 1},
        {x: 0, y: h - 1},
    ], background);

    // Line toward anus.
    addLine(
        ngons,
        zx(w / 2),
        zy(h / 2),
        zx(w / 2),
        zy(h - scene.anusLoc - scene.anusHeight / 2),
        lightGrey
    );

    // Outer labia.
    addEllipse(
        ngons,
        zx(w / 2 - scene.majoraWidth / 2),
        zy(h / 2 - scene.majoraHeight / 2),
        zw(scene.majoraWidth),
        zw(scene.majoraHeight),
        background,
        anatomyGrey,
        zStroke(1),
        [zw(1), zw(4)]
    );

    // Hair.
    for (const line of scene.hairLines) {
        addLine(
            ngons,
            zx(line.x1),
            zy(line.y1),
            zx(line.x2),
            zy(line.y2),
            scene.hairColor
        );
    }

    // Inner labia.
    addEllipse(
        ngons,
        zx(w / 2 - scene.minoraWidth / 2),
        zy(h / 2 - scene.minoraHeight / 2 + scene.minoraOffset),
        zw(scene.minoraWidth),
        zw(scene.minoraHeight - scene.minoraOffset),
        background,
        anatomyGrey,
        zStroke(1),
        [zw(1), zw(4)]
    );

    // Area between inner labia.
    addEllipse(
        ngons,
        zx(w / 2 - scene.innerWidth / 2),
        zy(h / 2 - scene.innerHeight / 2 + scene.minoraOffset),
        zw(scene.innerWidth),
        zw(scene.innerHeight - scene.minoraOffset),
        Rngon.color(242, 233, 233),
        lightGrey,
        zStroke(1)
    );

    // Opening, clipped to the inner region.
    addClippedEllipseFill(
        ngons,
        zRect({
            x: w / 2 - scene.orificeWidth / 2,
            y:
                h / 2 -
                scene.majoraHeight / 2 +
                scene.majoraHeight * scene.orificeLocation / 100,
            width: scene.orificeWidth,
            height: scene.orificeHeight,
        }),
        zRect({
            x: w / 2 - scene.innerWidth / 2 - 1,
            y: h / 2 - scene.innerHeight / 2,
            width: scene.innerWidth + 1,
            height: scene.innerHeight,
        }),
        Rngon.color.pink
    );

    // Clitoral area, clipped to the inner region.
    addClippedEllipseFill(
        ngons,
        zRect({
            x: w / 2 - scene.clitWidth / 2,
            y:
                h / 2 -
                scene.majoraHeight / 2 +
                scene.minoraOffset -
                scene.clitHeight / 2,
            width: scene.clitWidth,
            height: scene.clitHeight,
        }),
        zRect({
            x: w / 2 - scene.innerWidth / 2 - 1,
            y: h / 2 - scene.innerHeight / 2 + scene.minoraOffset,
            width: scene.innerWidth + 1,
            height: scene.innerHeight,
        }),
        scene.clitColor
    );

    // Progress bar.
    /*const elapsed = now - lastRenewal;
    const progress = Math.min(elapsed / RENEWAL_INTERVAL, 1);

    addLine(
        ngons,
        0,
        2,
        w * progress,
        2,
        Rngon.color(0, 0, 0, 199)
    );*/

    return ngons;
}

function material(color) {
    return {
        color,
        allowAlphaBlend: color.alpha < 255,
        vertexShading: "none",
        renderVertexShade: false,
        isInScreenSpace: true,
        isTwoSided: true,
    };
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function vertex(x, y, z = 0) {
    return Rngon.vertex(
        clamp(Math.round(x), 0, CANVAS_WIDTH - 1),
        clamp(Math.round(y), 0, CANVAS_HEIGHT - 1),
        z
    );
}

function addNgon(ngons, points, color) {
    if (!points || points.length < 3) {
        return;
    }

    const vertices = [];

    for (const p of points) {
        const v = vertex(p.x, p.y);

        const last = vertices[vertices.length - 1];

        if (!last || last.x !== v.x || last.y !== v.y) {
            vertices.push(v);
        }
    }

    if (vertices.length > 1) {
        const first = vertices[0];
        const last = vertices[vertices.length - 1];

        if (first.x === last.x && first.y === last.y) {
            vertices.pop();
        }
    }

    if (vertices.length < 3) {
        return;
    }

    ngons.push(Rngon.ngon(vertices, material(color)));
}

function addLine(ngons, x1, y1, x2, y2, color, lineWidth = 1) {
    if (lineWidth <= 1) {
        const a = vertex(x1, y1);
        const b = vertex(x2, y2);

        if (a.x === b.x && a.y === b.y) {
            return;
        }

        ngons.push(Rngon.ngon([a, b], material(color)));
        return;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);

    if (len === 0) {
        return;
    }

    const px = -dy / len * lineWidth / 2;
    const py = dx / len * lineWidth / 2;

    addNgon(ngons, [
        {x: x1 + px, y: y1 + py},
        {x: x2 + px, y: y2 + py},
        {x: x2 - px, y: y2 - py},
        {x: x1 - px, y: y1 - py},
    ], color);
}

function ellipsePoints(x, y, width, height, steps = 96) {
    if (width <= 0 || height <= 0) {
        return [];
    }

    const points = [];
    const cx = x + width / 2;
    const cy = y + height / 2;
    const rx = width / 2;
    const ry = height / 2;

    for (let i = 0; i < steps; i++) {
        const a = i / steps * Math.PI * 2;

        points.push({
            x: cx + Math.cos(a) * rx,
            y: cy + Math.sin(a) * ry,
        });
    }

    return points;
}

function addPolyline(ngons, points, closed, color, lineWidth = 1) {
    const count = points.length;

    for (let i = 0; i < count - 1; i++) {
        addLine(
            ngons,
            points[i].x,
            points[i].y,
            points[i + 1].x,
            points[i + 1].y,
            color,
            lineWidth
        );
    }

    if (closed && count > 1) {
        addLine(
            ngons,
            points[count - 1].x,
            points[count - 1].y,
            points[0].x,
            points[0].y,
            color,
            lineWidth
        );
    }
}

function addDashedPolyline(ngons, points, closed, color, lineWidth = 1, dash = [1, 4]) {
    const allPoints = closed ? points.concat([points[0]]) : points.slice();

    let dashIndex = 0;
    let dashLeft = dash[0];
    let drawing = true;

    for (let i = 0; i < allPoints.length - 1; i++) {
        const a = allPoints[i];
        const b = allPoints[i + 1];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy);

        if (len === 0) {
            continue;
        }

        let consumed = 0;

        while (consumed < len) {
            const take = Math.min(dashLeft, len - consumed);

            const t0 = consumed / len;
            const t1 = (consumed + take) / len;

            if (drawing) {
                addLine(
                    ngons,
                    a.x + dx * t0,
                    a.y + dy * t0,
                    a.x + dx * t1,
                    a.y + dy * t1,
                    color,
                    lineWidth
                );
            }

            consumed += take;
            dashLeft -= take;

            if (dashLeft <= 1e-6) {
                dashIndex = (dashIndex + 1) % dash.length;
                dashLeft = dash[dashIndex];
                drawing = dashIndex % 2 === 0;
            }
        }
    }
}

function addEllipse(
    ngons,
    x,
    y,
    width,
    height,
    fillColor,
    strokeColor,
    lineWidth = 1,
    dash = []
) {
    const fillPoints = ellipsePoints(x, y, width, height, 96);

    if (fillColor) {
        addNgon(ngons, fillPoints, fillColor);
    }

    if (strokeColor) {
        const strokePoints = ellipsePoints(x, y, width, height, 160);

        if (dash && dash.length) {
            addDashedPolyline(ngons, strokePoints, true, strokeColor, lineWidth, dash);
        } else {
            addPolyline(ngons, strokePoints, true, strokeColor, lineWidth);
        }
    }
}

function signedArea(points) {
    let area = 0;

    for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[(i + 1) % points.length];

        area += a.x * b.y - b.x * a.y;
    }

    return area / 2;
}

function lineIntersection(a, b, c, d) {
    const x1 = a.x;
    const y1 = a.y;
    const x2 = b.x;
    const y2 = b.y;
    const x3 = c.x;
    const y3 = c.y;
    const x4 = d.x;
    const y4 = d.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (Math.abs(denom) < 1e-6) {
        return b;
    }

    const px =
        ((x1 * y2 - y1 * x2) * (x3 - x4) -
        (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;

    const py =
        ((x1 * y2 - y1 * x2) * (y3 - y4) -
        (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;

    return {x: px, y: py};
}

function clipPolygon(subject, clipper) {
    if (subject.length < 3 || clipper.length < 3) {
        return [];
    }

    const orientation = signedArea(clipper);

    if (Math.abs(orientation) < 1e-6) {
        return [];
    }

    const inside = (p, a, b) => {
        const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
        return orientation >= 0 ? cross >= -1e-6 : cross <= 1e-6;
    };

    let output = subject.slice();

    for (let i = 0; i < clipper.length; i++) {
        const cp1 = clipper[i];
        const cp2 = clipper[(i + 1) % clipper.length];

        const input = output.slice();
        output = [];

        if (!input.length) {
            break;
        }

        let s = input[input.length - 1];

        for (const e of input) {
            const eInside = inside(e, cp1, cp2);
            const sInside = inside(s, cp1, cp2);

            if (eInside) {
                if (!sInside) {
                    output.push(lineIntersection(s, e, cp1, cp2));
                }

                output.push(e);
            } else if (sInside) {
                output.push(lineIntersection(s, e, cp1, cp2));
            }

            s = e;
        }
    }

    return output;
}

function addClippedEllipseFill(ngons, ellipseRect, clipRect, color) {
    const subject = ellipsePoints(
        ellipseRect.x,
        ellipseRect.y,
        ellipseRect.width,
        ellipseRect.height,
        80
    );

    const clipper = ellipsePoints(
        clipRect.x,
        clipRect.y,
        clipRect.width,
        clipRect.height,
        120
    );

    const clipped = clipPolygon(subject, clipper);

    addNgon(ngons, clipped, color);
}

function currentMorphedScene(morph, now) {
    const rawT = (now - morph.startedAt) / MORPH_DURATION;
    const t = clamp(rawT, 0, 1);

    // Smoothstep easing.
    const eased = t * t * (3 - 2 * t);

    if (eased >= 1) {
        return morph.to;
    }

    return lerpScene(morph.from, morph.to, eased);
}

function lerpScene(a, b, t) {
    const out = {};

    const keys = new Set([
        ...Object.keys(a),
        ...Object.keys(b),
    ]);

    for (const key of keys) {
        if (key === "hairLines") {
            continue;
        }

        const av = a[key];
        const bv = b[key];

        if (typeof av === "number" || typeof bv === "number") {
            out[key] = lerp(
                typeof av === "number" ? av : bv,
                typeof bv === "number" ? bv : av,
                t
            );
        } else {
            // Keep colors and other object values stable during the morph.
            // Switch to the new one at the end.
            out[key] = t < 1 ? av : bv;
        }
    }

    out.hairColor = lerpColor(a.hairColor, b.hairColor, t);
    out.clitColor = lerpColor(a.clitColor, b.clitColor, t);

    out.hairLines = lerpHairLines(
        a.hairLines || [],
        b.hairLines || [],
        t
    );

    return out;
}

function lerpHairLines(aLines, bLines, t) {
    const count = Math.max(aLines.length, bLines.length);
    const lines = [];

    for (let i = 0; i < count; i++) {
        const a = aLines[i];
        const b = bLines[i];

        // New hair grows from its follicle.
        if (!a && b) {
            const collapsed = {
                x1: b.x1,
                y1: b.y1,
                x2: b.x1,
                y2: b.y1,
            };

            lines.push(lerpLine(collapsed, b, t));
            continue;
        }

        // Removed hair shrinks back to its follicle.
        if (a && !b) {
            const collapsed = {
                x1: a.x1,
                y1: a.y1,
                x2: a.x1,
                y2: a.y1,
            };

            lines.push(lerpLine(a, collapsed, t));
            continue;
        }

        if (a && b) {
            lines.push(lerpLine(a, b, t));
        }
    }

    return lines;
}

function lerpLine(a, b, t) {
    return {
        x1: lerp(a.x1, b.x1, t),
        y1: lerp(a.y1, b.y1, t),
        x2: lerp(a.x2, b.x2, t),
        y2: lerp(a.y2, b.y2, t),
    };
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}
function lerpColor(a, b, t) {
    if (!a) return b;
    if (!b) return a;

    return Rngon.color(
        Math.round(lerp(colorChannel(a, "red", "r", 0), colorChannel(b, "red", "r", 0), t)),
        Math.round(lerp(colorChannel(a, "green", "g", 0), colorChannel(b, "green", "g", 0), t)),
        Math.round(lerp(colorChannel(a, "blue", "b", 0), colorChannel(b, "blue", "b", 0), t)),
        Math.round(lerp(colorChannel(a, "alpha", "a", 255), colorChannel(b, "alpha", "a", 255), t))
    );
}

function colorChannel(color, longName, shortName, fallback) {
    return color[longName] ?? color[shortName] ?? fallback;
}