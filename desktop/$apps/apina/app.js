/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 */

import {icons} from "./icons.js";
import {obj2mesh} from "./obj2mesh.js";

export default {
    Meta: {
        name: "3D model viewer",
        version: "1.0",
        author: "Tarpeeksi Hyvae Soft",
    },
    App() {
        const minWidth = 200;
        const minHeight = 200;
        const width = w95.state(400);
        const height = w95.state(400);

        const x = w95.state(
            ~~(0.5 * (w95.shell.display.width - width.now)),
            w95.reRenderOnly
        );
        const y = w95.state(
            ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
            w95.reRenderOnly
        );

        const meshes = w95.state([]);
        
        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            async Opened() {
                const obj = await (await fetch("/desktop/$apps/apina/suzanne.obj")).blob();
                meshes.set(Object.values(await obj2mesh(obj)));
            },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: "Pyörivä apina",
                    icon: icons.app16,
                    resize(deltaWidth, deltaHeight) {
                        width.set(Math.max(minWidth, (width.now + deltaWidth)));
                        height.set(Math.max(minHeight, (height.now + deltaHeight)));
                    },
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },
                    close() {
                        w95.windowManager.release_window(this)
                    },
                    children: [
                        w95.widget.frame({
                            y: 1,
                            width: "pw",
                            height: "ph - 1",
                            shape: w95.frameShape.box,
                            children: [
                                w95.widget.renderSurface({
                                    x: 1,
                                    y: 1,
                                    width: "pw - 2",
                                    height: "ph - 2",
                                    meshes: meshes.now,
                                    options: {
                                        nearPlane: 0.1,
                                        farPlane: 10000,
                                        cameraPosition: Rngon.vector(0, 0, -4),
                                    },
                                    onTick(timeDeltaMs) {
                                        const fps = (1000 / (timeDeltaMs || 1000));
                                        for (const mesh of meshes.now) {
                                            mesh.rotate.y = mesh.rotate.z = ((mesh.rotate.y + (40 / fps)) % 359);
                                        }
                                    },
                                }),
                            ],
                        }),
                    ],
                });
            },
        };
    },
};
