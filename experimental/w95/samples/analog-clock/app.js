/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import clockFaceTexture from "./assets/clockface.texture.js";
import {icons} from "/desktop/$apps/pillunsaamislaskuri/icons.js";

export default {
    Meta: {
        name: "Analog clock",
        author: "ArtisaaniSoft",
    },
    App() {
        const width = w95.state(clockFaceTexture.width + 20);
        const height = w95.state(clockFaceTexture.height + 57);

        const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
        const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);
        
        const tick = w95.state(0);
        const isAboutDialogOpen = w95.state(false);

        const clockMesh = w95.state({
            minute: Rngon.mesh([
                Rngon.ngon([
                    Rngon.vertex(-0.07, 0),
                    Rngon.vertex(0, 1.17),
                    Rngon.vertex(0.07, 0),
                    Rngon.vertex(0, -0.3),
                ], {
                    color: Rngon.color.teal,
                }),
            ]),
            minuteShadow1: Rngon.mesh([
                Rngon.ngon([
                    Rngon.vertex(-0.07, 0),
                    Rngon.vertex(0, 1.17),
                    Rngon.vertex(0.07, 0),
                    Rngon.vertex(0, -0.3),
                ], {
                    color: Rngon.color.white,
                }),
            ], {
                translate: Rngon.vector(-0.05, 0.05, 0),
            }),
            minuteShadow2: Rngon.mesh([
                Rngon.ngon([
                    Rngon.vertex(-0.07, 0),
                    Rngon.vertex(0, 1.17),
                    Rngon.vertex(0.07, 0),
                    Rngon.vertex(0, -0.3),
                ], {
                    color: Rngon.color(128, 128, 128),
                }),
            ], {
                translate: Rngon.vector(0.05, -0.05, 0),
            }),
            hour: Rngon.mesh([
                Rngon.ngon([
                    Rngon.vertex(-0.11, 0),
                    Rngon.vertex(0, 0.92),
                    Rngon.vertex(0.11, 0),
                    Rngon.vertex(0, -0.3),
                ], {
                    color: Rngon.color.teal,
                }),
            ]),
            hourShadow1: Rngon.mesh([
                Rngon.ngon([
                    Rngon.vertex(-0.11, 0),
                    Rngon.vertex(0, 0.92),
                    Rngon.vertex(0.11, 0),
                    Rngon.vertex(0, -0.3),
                ], {
                    color: Rngon.color.white,
                }),
            ], {
                translate: Rngon.vector(-0.05, 0.05, 0),
            }),
            hourShadow2: Rngon.mesh([
                Rngon.ngon([
                    Rngon.vertex(-0.11, 0),
                    Rngon.vertex(0, 0.92),
                    Rngon.vertex(0.11, 0),
                    Rngon.vertex(0, -0.3),
                ], {
                    color: Rngon.color(128, 128, 128),
                }),
            ], {
                translate: Rngon.vector(0.05, -0.05, 0),
            }),
            background: Rngon.mesh([
                Rngon.ngon([
                    Rngon.vertex(-5, -5),
                    Rngon.vertex(5, -5),
                    Rngon.vertex(5, 5),
                    Rngon.vertex(0, 5),
                ], {
                    color: Rngon.color(192, 192, 192),
                }),
            ]),
            second: Rngon.mesh([
                Rngon.ngon([
                    Rngon.vertex(0, 0),
                    Rngon.vertex(0, 1.17),
                ], {
                    invertBackground: true,
                    bypassPixelBuffer: true,
                }),
            ]),
        });

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Opened() {
                update_clock(w95.clock.now);
                w95.clock.listen(update_clock);
            },
            Form() {
                return w95.widget.window({
                    icon: icons.app16,
                    parent: this,
                    title: "A-Clock",
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },
                    close() {
                        w95.windowManager.release_window(this)
                    },
                    children: [
                        w95.widget.menuBar({
                            width: "pw",
                            children: [
                                w95.widget.menuAction({
                                    label: "File",
                                    isTopLevel: true,
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Exit",
                                                onClick(widget) {
                                                    w95.windowManager.release_window(widget.$app.window);
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                                w95.widget.menuAction({
                                    label: "Help",
                                    isTopLevel: true,
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "About...",
                                                onClick() {
                                                    isAboutDialogOpen.set(true);
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                            ],
                        }),
                        w95.widget.frame({
                            x: 0,
                            y: 18,
                            width: clockFaceTexture.width+12,
                            height: clockFaceTexture.height+12,
                            shape: w95.frameShape.none,
                            children: [
                                w95.widget.renderSurface({
                                    x: 6,
                                    y: 6,
                                    width: "pw - 12",
                                    height: "ph - 12",
                                    meshes: Object.values(clockMesh.now),
                                    backgroundColor: w95.palette.named.transparent,
                                    options: {
                                        cameraPosition: Rngon.vector(0, 0, -4),
                                        fragments: {
                                            ngon: true,
                                        },
                                        useFragmentBuffer: true,
                                    },
                                    pipeline: {
                                        // Invert the second hand's background.
                                        pixelShader(renderContext) {
                                            const {width, height, data:pixels} = renderContext.pixelBuffer;
                                            const fragments = renderContext.fragmentBuffer.data;

                                            for (let y = 0; y < height; y++)
                                            {
                                                for (let x = 0; x < width; x++)
                                                {
                                                    const idx = (x + y * width);
                                                    const thisFragment = fragments[idx];

                                                    if (thisFragment.ngon?.material.invertBackground) {
                                                        const pixIdx = (idx * 4);
                                                        pixels[pixIdx + 0] = (255 - pixels[pixIdx + 0]);
                                                        pixels[pixIdx + 1] = (255 - pixels[pixIdx + 1]);
                                                        pixels[pixIdx + 2] = (255 - pixels[pixIdx + 2]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }),
                                w95.widget.bitmap({
                                    x: 6,
                                    y: 6,
                                    image: clockFaceTexture,
                                }),
                            ],
                        }),
                        w95.shell.popup.about({
                            parent: this,
                            text: "Replicates the look and feel of the Windows 95 clock.",
                            onClose() {
                                isAboutDialogOpen.set(false);
                            },
                        }, {hideIf: !isAboutDialogOpen.now}),
                    ],
                });
            },
        };

        function update_clock(currentTime) {
            const sec = ((359 / 60) * currentTime.getSeconds());
            const min = ((359 / 60) * currentTime.getMinutes());
            const hr = ((359 / 12) * (currentTime.getHours() + (min / 359)));

            clockMesh.now.second.rotate.z = sec;
            clockMesh.now.minuteShadow1.rotate.z =
                clockMesh.now.minuteShadow2.rotate.z =
                clockMesh.now.minute.rotate.z = min;
            clockMesh.now.hourShadow1.rotate.z =
                clockMesh.now.hourShadow2.rotate.z =
                clockMesh.now.hour.rotate.z = hr;

            tick.set(tick.now + 1);
        }
    },
};
