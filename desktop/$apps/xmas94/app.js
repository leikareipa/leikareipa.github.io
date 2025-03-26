/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 */

import {icons} from "./icons.js";
import background from "./bg.texture.js";
import * as fluid from "./fluid.js";

const fluidDomainSize = 150;

export default {
    Meta: {
        name: "Xmas '94",
        author: "ArtisaaniSoft",
    },
    App() {
        const width = w95.state(150);
        const height = w95.state(168);
        const x = w95.state(
            ~~(0.5 * (w95.shell.display.width - width.now)),
            w95.reRenderOnly
        );
        const y = w95.state(
            ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
            w95.reRenderOnly
        );

        const isAboutDialogOpen = w95.state(false);

        const redraw = w95.state(0);
        const flakes = w95.state(new Array(100).fill().map(f=>({
            x: Math.max(1, Math.min((width.now - 10), ~~(Math.random() * width.now))),
            y: ~~(Math.random() * (height.now / 2)),
            color: w95.color(200 + ~~(55 * Math.random())),
        })));

        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Opened() {
                setInterval(()=>{
                    flakes.now.push({
                        x: Math.max(1, Math.min((width.now - 10), ~~(Math.random() * width.now))),
                        y: 0,
                        color: w95.color(200 + ~~(55 * Math.random())),
                    });
                }, 50);
            },
            Mounted() {
                redraw.set(redraw.now+1);

                if (fluid.is_initialized()) {
                    fluid.enforce_boundaries();

                    skip_flake_position_update:
                    for (const flake of flakes.now) {
                        const xm = (fluidDomainSize / width.now);
                        const ym = (fluidDomainSize / height.now);
                        const vel = fluid.velocity_at(~~(flake.x*xm), ~~(flake.y*ym));
                        const gravity = Math.max(0.3, Math.random()/((height.now / flake.y) / 2))/4;
                        const ru = (-Math.random() + Math.random());
                        const rv = (-Math.random() + Math.random());
                        const newX = Math.min((width.now - 10), Math.max(1, flake.x + ru + (vel.u * (1 + Math.random() / 2))));
                        const newY = Math.min((height.now - 30), Math.max(1, flake.y + rv + gravity + (vel.v * (1 + Math.random() / 2)))) + Math.random();

                        if (background.pixels[((~~newX + (background.height - 1 - ~~newY) * background.width) * 4) + 3]) {
                            continue skip_flake_position_update;
                        }

                        for (const flake of flakes.now) {
                            if (~~flake.x === ~~newX && ~~flake.y === ~~newY) {
                                continue skip_flake_position_update;
                            }
                        }

                        flake.x = newX;
                        flake.y = newY;
                    }

                    fluid.tick();
                }
                else {
                    fluid.initialize({
                        domainSize: fluidDomainSize,
                        vorticityStrength: 1,
                    });
                }
            },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: this.$app.Meta.name,
                    icon: icons.app16,
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                        deltaY = Math.min(0, deltaY);
                        for (let y = 1; y < fluidDomainSize - 1; y++) {
                            for (let x = 1; x < fluidDomainSize - 1; x++) {
                                if (Math.random() < 0.25) {
                                    fluid.apply_force({x, y, dU: deltaX*Math.random()*1.5, dV: deltaY*Math.random()*1.5});
                                }
                            }
                        }
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
                            y: 18,
                            width: "pw",
                            height: "ph - 18",
                            shape: w95.frameShape.box,
                            children: [
                                w95.widget.renderSurface({
                                    x: 1,
                                    y: 1,
                                    width: "pw - 2",
                                    height: "ph - 2",
                                    backgroundColor: w95.color(0, 0, 0,155),
                                    meshes: [
                                        Rngon.mesh([
                                            Rngon.ngon([
                                                Rngon.vertex(0, 0),
                                                Rngon.vertex(142, 0),
                                                Rngon.vertex(142, 121),
                                                Rngon.vertex(0, 121),
                                            ], {
                                                texture: background,
                                                allowAlphaReject: true,
                                                isInScreenSpace: true,
                                            })
                                        ]),
                                        Rngon.mesh(flakes.now.map(f=>(
                                            Rngon.ngon([
                                                Rngon.vertex(~~f.x, ~~f.y)
                                            ], {
                                                color: f.color,
                                                isInScreenSpace: true,
                                            })
                                        ))),
                                    ],
                                }),
                            ],
                        }),
                        w95.shell.popup.about({
                            parent: this,
                            text: "Merry Christmas! Drag the window to fling snow around.",
                            onClose() {
                                isAboutDialogOpen.set(false);
                            },
                        }, {hideIf: !isAboutDialogOpen.now}),
                    ],
                });
            },
        };
    },
};
