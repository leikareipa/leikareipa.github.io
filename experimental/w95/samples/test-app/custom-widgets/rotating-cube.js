/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */


import {scene} from "./assets/cube.rngon-model.js";

scene.initialize();

const renderOptions = {
    resolution: 1,
    cameraDirection: Rngon.vector(0, 0, 0),
    cameraPosition: Rngon.vector(0, -0.15, -6.5),
    useDepthBuffer: true,
    useBackfaceCulling: true,
    useFullInterpolation: true,
    lights: [
        Rngon.light(0, 70, -120, {intensity: 150}),
    ],
};

export const rotatingCube = w95.widget(function rotatingCube({
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    isDisabled = false,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");

    const tickCount = w95.state(0);
    const cubeMesh = w95.state(
        Rngon.mesh(scene.ngons, {
            rotate: Rngon.vector(24, 0, 0),
            translate: Rngon.vector(0, 0, 0),
        })
    );

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Form() {
            return [
                w95.widget.frame({
                    width,
                    height,
                    shape: w95.frameShape.box,
                    children: [
                        w95.widget.renderSurface({
                            cursor: w95.cursor.none,
                            x: 1,
                            y: 1,
                            width: (width - 2),
                            height: (height - 2),
                            isDisabled,
                            meshes: [cubeMesh.now],
                            options: renderOptions,
                            backgroundColor: w95.palette.named.black,
                            onTick(timeDeltaMs) {
                                const fps = (1000 / (timeDeltaMs || 1000));
                                cubeMesh.now.rotate.y = cubeMesh.now.rotate.z = ((cubeMesh.now.rotate.y + (80 / fps)) % 359);
                                tickCount.set(tickCount.now + 1);
                            },
                        }),
                    ],
                }),
                w95.widget.label({
                    x: 0,
                    y: 8,
                    width: (width - 8),
                    text: `${Math.round(w95.shell.display.refreshRate)} FPS`,
                    color: w95.palette.named.white,
                    styleHints: [
                        w95.styleHint.alignRight,
                        w95.styleHint.bold,
                    ]
                }, {hideIf: isDisabled}),
            ];
        },
    };
});
