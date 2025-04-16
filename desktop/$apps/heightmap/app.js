/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 */

import {icons} from "./icons.js";
import {perlin} from "./perlin.js";
import {seedQuery} from  "./seed-query-dialog.js";

export default {
    Meta: {
        name: "Heightmap Generator",
        version: "1.0",
        author: "PippeLeeSoft",
    },
    App() {
        const minWidth = 268;
        const minHeight = 346;
        const width = w95.state(524);
        const height = w95.state(346);
        const viewWidth = w95.state(512);
        const viewHeight = w95.state(256);

        const x = w95.state(
            ~~(0.5 * (w95.shell.display.width - width.now)),
            w95.reRenderOnly
        );
        const y = w95.state(
            ~~(0.5 * (w95.shell.display.visibleHeight - height.now)),
            w95.reRenderOnly
        );

        const isSeedQueryDialogOpen = w95.state(false);
        const isAboutDialogOpen = w95.state(false);

        const heightmap = w95.state([]);
        const terrainMesh = w95.state(Rngon.mesh());
        const noise = w95.state(perlin());
        const renderId = w95.state(crypto.randomUUID());
        const seed = w95.state(0, ()=>noise.now.seed(seed.now));

        const generationMethod = w95.state(noise.now.perlin2);
        const uiOctaves = w95.state("6");
        const uiFrequency = w95.state("0.005");
        const uiAmplitude = w95.state("0.25");
        const uiDistortion = w95.state("0.5");
        const viewMode = w95.state("3D");
        const isWindowResizing = w95.state(false);

        generate_heightmap();

        function generate_heightmap() {
            if (isWindowResizing.now) {
                return;
            }

            const octaves = Math.max(0, Math.min(99, uiOctaves.now));
            const width = ~~viewWidth.now;
            const height = ~~viewHeight.now;
            let idx = 0;

            for (let y = 0; y < height; y++)
            {
                for (let x = 0; x < width; x++)
                {
                    let persistence = Number(uiDistortion.now);
                    let amplitude = Number(uiAmplitude.now);
                    let frequency = Number(uiFrequency.now);
                    let value = 0;
                    for (let i = 0; i < octaves; i++) {
                        value += (amplitude * generationMethod.now((x + i) * frequency, (y + i) * frequency));
                        frequency *= 2;
                        amplitude *= persistence;
                    }
                    heightmap.now[idx++] = ~~(value * 255);
                }
            }

            terrainMesh.set(
                Rngon.mesh(generate_terrain_mesh(), {
                    rotate: Rngon.vector(45, 0, 0),
                    translate: Rngon.vector(-(width/ 2), 0, 0),
                })
            );
        }

        function generate_terrain_mesh(skip = 8) {
            const hm = heightmap.now;
            const polys = [];
            const width = ~~viewWidth.now;
            const height = ~~viewHeight.now;

            for (let y = 0; y < (height - skip); y += skip)
            {
                for (let x = 0; x < (width - skip); x += skip)
                {
                    const h1 = hm[x + y * width];
                    const h2 = hm[(x + skip) + y * width];
                    const h3 = hm[(x + skip) + (y + skip) * width];
                    const h4 = hm[x + (y + skip) * width];
                    polys.push(
                        Rngon.ngon([
                            Rngon.vertex(~~x,          ~~h1, ~~y),
                            Rngon.vertex(~~(x + skip), ~~h2, ~~y),
                            Rngon.vertex(~~(x + skip), ~~h3, ~~(y + skip)),
                            Rngon.vertex(~~x,          ~~h4, ~~(y + skip)),
                        ], {
                            hasWireframe: true,
                            hasFill: true,
                            color: Rngon.color(0, 0, 0, 10),
                            allowAlphaBlend: true,
                        })
                    );
                }
            }

            return polys;
        }

        function draw_heightmap(context) {
            const {width, height, data:pixels} = context.pixelBuffer;
            for (let i = 0; i < (width * height); i++) {
                pixels[i*4+0] =
                pixels[i*4+1] =
                pixels[i*4+2] = (heightmap.now[i] + 127);
                pixels[i*4+3] = 255;
            }
        }
        
        function mesh_to_obj_string(mesh = [Rngon.ngon()]) {
            const uniqueVertices = [];
            let faces = "";

            for (const ngon of mesh) {
                faces += "f";
                for (const vertex of ngon.vertices) {
                    let vertIdx = (1 + uniqueVertices.findIndex(v=>((v.x === vertex.x) && (v.y === vertex.y) && (v.z === vertex.z))));
                    if (vertIdx < 1) {
                        uniqueVertices.push(vertex);
                        vertIdx = uniqueVertices.length;
                    }
                    faces += ` ${vertIdx}`;
                }
                faces += "\n";
            }
        
            return [
                "# Terrain",
                `# ${mesh.length} faces`,
                "#",
                `# Method: ${(generationMethod.now === noise.now.perlin2)? "Perlin" : "Simplex"}`,
                `# Seed: ${seed.now}`,
                `# Octaves: ${uiOctaves.now}`,
                `# Frequency: ${uiFrequency.now}`,
                `# Amplitude: ${uiAmplitude.now}`,
                `# Distortion: ${uiDistortion.now}`,
                "#",
                `${uniqueVertices.map(v=>`v ${v.x} ${v.y} ${v.z}`).join("\n")}`,
                `${faces}`
            ].join("\n");
        }
        
        function download_terrain() {
            const mesh = generate_terrain_mesh();
            const objStr = mesh_to_obj_string(mesh);
            const blob = new Blob([objStr], {type: "text/plain"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `terrain-${seed.now}.obj`;
            link.click();
            URL.revokeObjectURL(url);
        }

        function download_heightmap() {
            const imageData = new ImageData(~~viewWidth.now, ~~viewHeight.now);
            draw_heightmap({pixelBuffer: imageData});

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            ctx.putImageData(imageData, 0, 0);
            
            const link = document.createElement("a");
            link.href = canvas.toDataURL();
            link.download = `terrain-${seed.now}.png`;
            link.click();
        }

        function randomize_seed() {
            seed.set(~~(Math.random() * 1234567));
        }
        
        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Opened() {
                randomize_seed();
            },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: `${~~viewWidth.now}x${~~viewHeight.now} - ${this.$app.Meta.name}`,
                    icon: icons.app16,
                    resize(deltaWidth, deltaHeight) {
                        const oldWidth = width.now;
                        const oldHeight = height.now;
                        width.set(Math.max(minWidth, (width.now + deltaWidth)));
                        height.set(Math.max(minHeight, (height.now + deltaHeight)));
                        viewWidth.set(viewWidth.now + (width.now - oldWidth));
                        viewHeight.set(viewHeight.now + (height.now - oldHeight));
                    },
                    move(deltaX, deltaY) {
                        x.set(x.now + deltaX);
                        y.set(y.now + deltaY);
                    },
                    close() {
                        w95.windowManager.release_window(this)
                    },
                    onResizeStart() {
                        isWindowResizing.set(true);
                    },
                    onResizeEnd() {
                        isWindowResizing.set(false);
                        generate_heightmap();
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
                                                label: "Export as OBJ",
                                                onClick() {
                                                    download_terrain();
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Export as PNG",
                                                onClick() {
                                                    download_heightmap();
                                                },
                                            }),
                                            w95.widget.menuSeparator(),
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
                                    label: "View",
                                    isTopLevel: true,
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Terrain",
                                                group: "view",
                                                isCheckable: true,
                                                isChecked: (viewMode.now === "3D"),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        viewMode.set("3D");
                                                    }
                                                },
                                            }),
                                            w95.widget.menuAction({
                                                label: "Heightmap",
                                                group: "view",
                                                isCheckable: true,
                                                isChecked: (viewMode.now === "2D"),
                                                newCheckState(isChecked) {
                                                    if (isChecked) {
                                                        viewMode.set("2D");
                                                    }
                                                },
                                            }),
                                        ],
                                    }),
                                }),
                                w95.widget.menuAction({
                                    label: "Generator",
                                    isTopLevel: true,
                                    submenu: w95.widget.menu({
                                        children: [
                                            w95.widget.menuAction({
                                                label: "Seed",
                                                submenu: w95.widget.menu({
                                                    children: [
                                                        w95.widget.menuAction({
                                                            label: `${seed.now}`,
                                                            isDisabled: true,
                                                        }),
                                                        w95.widget.menuSeparator(),
                                                        w95.widget.menuAction({
                                                            label: "Change...",
                                                            onClick() {
                                                                isSeedQueryDialogOpen.set(true);
                                                            },
                                                        }),
                                                    ],
                                                }),
                                            }),
                                            w95.widget.menuAction({
                                                label: "Method",
                                                submenu: w95.widget.menu({
                                                    children: [
                                                        w95.widget.menuAction({
                                                            label: "Perlin",
                                                            group: "method",
                                                            isCheckable: true,
                                                            isChecked: (generationMethod.now === noise.now.perlin2),
                                                            newCheckState(isChecked) {
                                                                if (isChecked) {
                                                                    generationMethod.set(noise.now.perlin2);
                                                                }
                                                            },
                                                        }),
                                                        w95.widget.menuAction({
                                                            label: "Simplex",
                                                            group: "method",
                                                            isCheckable: true,
                                                            isChecked: (generationMethod.now === noise.now.simplex2),
                                                            newCheckState(isChecked) {
                                                                if (isChecked) {
                                                                    generationMethod.set(noise.now.simplex2);
                                                                }
                                                            },
                                                        }),
                                                    ],
                                                }),
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
                            y: 19,
                            width: "pw",
                            height: "ph - 59",
                            shape: w95.frameShape.input,
                            children: [
                                w95.widget.renderSurface({
                                    $name: "view",
                                    x: 2,
                                    y: 2,
                                    width: viewWidth.now,
                                    height: viewHeight.now,
                                    meshes: (
                                        (viewMode.now === "3D")
                                            ? [terrainMesh.now]
                                            : [Rngon.mesh([])]
                                    ),
                                    id: renderId.now,
                                    backgroundColor: w95.color.transparent,
                                    options: {
                                        nearPlane: 0.1,
                                        farPlane: 10000,
                                        cameraPosition: Rngon.vector(0, 100, -400),
                                    },
                                    pipeline: {
                                        pixelShader: (
                                            ((viewMode.now === "2D") && !isWindowResizing.now)
                                                ? draw_heightmap
                                                : undefined
                                        ),
                                    },
                                }),
                            ],
                        }),
                        w95.widget.button({
                            y: "ph - 52 + 15",
                            height: 37,
                            width: "pw - 222",
                            text: "Roll",
                            onClick() {
                                randomize_seed();
                            },
                        }),
                        w95.widget.label({
                            x: "pw - 226 + 8",
                            y: "ph - 52 + 14",
                            text: "Octaves"
                        }),
                        w95.widget.lineEdit({
                            x: "pw - 226 + 8",
                            y: "ph - 52 + 29",
                            width: 51,
                            validator: /[0-9]/,
                            state: uiOctaves,
                        }),
                        w95.widget.label({
                            x: "pw - 225 + 62",
                            y: "ph - 52 + 14",
                            text: "Frequen."
                        }),
                        w95.widget.lineEdit({
                            x: "pw - 225 + 62",
                            y: "ph - 52 + 29",
                            width: 51,
                            validator: /[0-9\-\.]/,
                            state: uiFrequency,
                        }),
                        w95.widget.label({
                            x: "pw - 222 + 114",
                            y: "ph - 52 + 14",
                            text: "Amplitude"
                        }),
                        w95.widget.lineEdit({
                            x: "pw - 222 + 114",
                            y: "ph - 52 + 29",
                            width: 51,
                            validator: /[0-9\-\.]/,
                            state: uiAmplitude,
                        }),
                        w95.widget.label({
                            x: "pw - 220 + 167",
                            y: "ph - 52 + 14",
                            text: "Distortion"
                        }),
                        w95.widget.lineEdit({
                            x: "pw - 220 + 167",
                            y: "ph - 52 + 29",
                            width: 53,
                            validator: /[0-9\-\.]/,
                            state: uiDistortion,
                        }),
                        seedQuery({
                            x: ((width.now / 2) - 120),
                            y: 60,
                            width: 240,
                            height: 105,
                            value: `${seed.now}`,
                            onAccept(name) {
                                seed.set(name);
                                isSeedQueryDialogOpen.set(false);
                            },
                            onReject() {
                                isSeedQueryDialogOpen.set(false);
                            },
                        }, {hideIf: !isSeedQueryDialogOpen.now}),
                        w95.shell.popup.about({
                            parent: this,
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
