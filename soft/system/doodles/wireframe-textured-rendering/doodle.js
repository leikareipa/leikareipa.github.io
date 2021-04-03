/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: A doodle for Tarpeeksi Hyvae Soft's website
 * 
 */

import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.min.js";
import {Luu} from "./luujanko.js";
import {Rngon} from "./rngon.cat.js";
import {library} from "./assets/library.rngon-model.js";
import {libraryTextured} from "./assets/library-textured.rngon-model.js";

export function run_doodle(doodleAssetPath = "./", args = {})
{
    args = {
        ...{
            isTexturingInitiallyEnabled: true,
        },
        ...args
    };

    return new Vue({
        el: "#doodle-app-container",
        data: {
            isAppInView: true,
            isAppOnlyPartiallyInView: false,
            isTexturingEnabled: args.isTexturingInitiallyEnabled,
            isSceneFullyLit: true,
            isHighResRender: false,
            areAssetsInitialized: false,
            areControlsFrozen: false,
            viewRotationSpeed: 0.00012,
            viewPosition: [40767, 2450, -33562],
            viewDirectionRetroNgon: Rngon.rotation_vector(0, 1.13, 0),
            viewDirectionLuujanko: Luu.rotation(0, -2.7, 0),
            controlsClassListObserver: undefined,
        },
        computed: {
            sceneMesh()
            {
                return this.isTexturingEnabled
                       ? Rngon.mesh(libraryTextured.ngons)
                       : Luu.mesh(library.ngons);
            },
            viewDirection()
            {
                return this.isTexturingEnabled
                       ? this.viewDirectionRetroNgon
                       : this.viewDirectionLuujanko
            },
        },
        watch: {
            isHighResRender()
            {
                this.render_frame();
            },
            isSceneFullyLit()
            {
                this.render_frame();
            },
            isTexturingEnabled()
            {
                Vue.nextTick(()=>
                {
                    this.render_frame();
                });
            },
        },
        methods: {
            update_mesh_rotation(timeDeltaMs = 0)
            {
                this.viewDirectionRetroNgon.y += (this.viewRotationSpeed * 57.296 * timeDeltaMs);
                this.viewDirectionLuujanko.y += (this.viewRotationSpeed * timeDeltaMs);

                return;
            },
            render_frame()
            {
                if (!this.areAssetsInitialized)
                {
                    return;
                }

                if (this.isTexturingEnabled)
                {
                    this.render_textured_frame();
                }
                else
                {
                    this.render_untextured_frame();
                }

                return;
            },
            render_textured_frame()
            {
                const targetCanvas = this.$refs["rngon-canvas"];
                const renderScale = (this.isHighResRender? 0.5 : 0.25);
                
                if (!targetCanvas ||
                    (Rngon.renderable_width_of(targetCanvas, renderScale) <= 0) ||
                    (Rngon.renderable_height_of(targetCanvas, renderScale) <= 0))
                {
                    return;
                }

                const options = {
                    clipToViewport: true,
                    depthSort: "painter-reverse",
                    useDepthBuffer: true,
                    perspectiveCorrectInterpolation: true,
                    cameraDirection: Rngon.rotation_vector(this.viewDirection.x, this.viewDirection.y, this.viewDirection.z),
                    cameraPosition: Rngon.translation_vector(...this.viewPosition),
                    scale: renderScale,
                    fov: 60,
                    nearPlane: 100,
                    farPlane: 25000,
                    lights:
                    [
                        Rngon.light(Rngon.vector3(40767, 2650, -33562), {reach: 4000, intensity: 1.2}),
                    ],
                    pixelShader: (this.isSceneFullyLit? null : perpixel_light_shader),
                };

                Rngon.render(targetCanvas, [this.sceneMesh], options);

                function perpixel_light_shader({renderWidth, renderHeight, pixelBuffer, fragmentBuffer, ngonCache})
                {
                    const lightDirection = Rngon.vector3();

                    for (let i = 0; i < (renderWidth * renderHeight); i++)
                    {
                        const thisFragment = fragmentBuffer[i];
                        const thisNgon = (ngonCache[thisFragment.ngonIdx] || null);

                        let strongestShade = 0;

                        for (let l = 0; l < Rngon.internalState.lights.length; l++)
                        {
                            const light = Rngon.internalState.lights[l];

                            const distance = (((thisFragment.worldX - light.position.x) * (thisFragment.worldX - light.position.x)) +
                                              ((thisFragment.worldY - light.position.y) * (thisFragment.worldY - light.position.y)) +
                                              ((thisFragment.worldZ - light.position.z) * (thisFragment.worldZ - light.position.z)));

                            const distanceMul = Math.max(0, Math.min(1, (1 - (distance / (light.reach * light.reach)))));

                            if ((thisFragment.shade > 0) && (distanceMul > 0))
                            {
                                lightDirection.x = (light.position.x - thisFragment.worldX);
                                lightDirection.y = (light.position.y - thisFragment.worldY);
                                lightDirection.z = (light.position.z - thisFragment.worldZ);
                                Rngon.vector3.normalize(lightDirection);

                                const shadeMul = Math.max(0, Math.min(1, Rngon.vector3.dot(thisNgon.normal, lightDirection)));

                                strongestShade = Math.max(strongestShade, (distanceMul * shadeMul * light.intensity));
                            }
                        }

                        pixelBuffer[(i * 4) + 0] *= strongestShade;
                        pixelBuffer[(i * 4) + 1] *= strongestShade;
                        pixelBuffer[(i * 4) + 2] *= strongestShade;
                    }
                }

                return;
            },
            render_untextured_frame()
            {
                const svgImage = this.$refs["luujanko-svg"];
                if (!svgImage)
                {
                    return;
                }

                svgImage.setAttribute("width", svgImage.clientWidth);
                svgImage.setAttribute("height", svgImage.clientHeight);

                Luu.render([this.sceneMesh], svgImage, {
                    fov: 60,
                    nearPlane: 100,
                    farPlane: 25000,
                    viewPosition: Luu.translation(...this.viewPosition),
                    viewRotation: this.viewDirection,
                });

                return;
            }
        },
        async mounted()
        {
            await library.initialize();
            await libraryTextured.initialize();
            this.areAssetsInitialized = true;

            // Allow external code to affect the control panel's status via toggling
            // its class attributes, which we monitor with a mutation observer.
            // Note: In the future, the control panel may be implemented as a separate
            // component, but for now, we have this code dumped in here.
            this.controlsClassListObserver = new MutationObserver(()=>
            {
                this.areControlsFrozen = this.$refs["controls"].classList.contains("frozen")
            });
            this.controlsClassListObserver.observe(this.$refs["controls"], {attributeFilter: ["class"]});

            // Once this.areAssetsInitialized has updated.
            Vue.nextTick(()=>
            {
                const self = this;
                (function screen_refresh_loop(timestamp = 0, frameTimeDeltaMs = 0)
                {
                    if (!self.isAppOnlyPartiallyInView)
                    {
                        self.update_mesh_rotation(frameTimeDeltaMs);
                        self.render_frame();
                    }
                    
                    window.requestAnimationFrame((newTimestamp)=>
                    {
                        screen_refresh_loop(newTimestamp, (newTimestamp - timestamp));
                    });
                })();
            });

            window.addEventListener("scroll", ()=>
            {
                this.isAppOnlyPartiallyInView = (window.scrollY > 0);
                this.isAppInView = (window.scrollY < window.innerHeight);
            });

            window.addEventListener("resize", ()=>
            {
                this.render_frame();
            });

            window.addEventListener("orientationchange", ()=>
            {
                Vue.nextTick(()=>
                {
                    this.render_frame();
                });
            });
        },
        template: `
            <div class="doodle wireframe-textured-rendering"
                 ref="main-container"
                 v-show="areAssetsInitialized">

                <link rel="stylesheet"
                      type="text/css"
                      href="${doodleAssetPath}/doodle.css">

                <div class="controls"
                     ref="controls">

                    <div class="selector two-state isTexturingEnabled">

                        <i class="fas fa-fw fa-lg fa-tint-slash"></i>

                            <label class="slider-box">

                                <input type="checkbox"
                                       v-model="isTexturingEnabled"
                                       v-bind:disabled="areControlsFrozen">

                                <span class="slider"></span>

                            </label>

                        <i class="fas fa-fw fa-lg fa-tint"></i>

                    </div>

                    <div class="selector two-state isSceneFullyLit"
                         v-if="isTexturingEnabled">

                        <i class="far fa-fw fa-lg fa-lightbulb"></i>

                            <label class="slider-box">

                                <input type="checkbox"
                                       v-model="isSceneFullyLit"
                                       v-bind:disabled="areControlsFrozen">

                                <span class="slider"></span>

                            </label>

                        <i class="far fa-fw fa-lg fa-sun"></i>

                    </div>

                    <div class="selector two-state isHighResRender"
                    v-if="isTexturingEnabled">

                   <span style="font-weight:bold;">SD</span>

                       <label class="slider-box">

                           <input type="checkbox"
                                  v-model="isHighResRender"
                                  v-bind:disabled="areControlsFrozen">

                           <span class="slider"></span>

                       </label>

                   <span style="font-weight:bold;">HD</span>

               </div>

                </div>

                <svg class="luujanko-rendering"
                     ref="luujanko-svg"
                     v-if="!isTexturingEnabled">
                </svg>

                <canvas class="rngon-rendering rngon-pixelated-upscale"
                        ref="rngon-canvas"
                        v-bind:style="{backgroundColor: (isSceneFullyLit? 'transparent' : 'black')}"
                        v-if="isTexturingEnabled">
                </canvas>

            </div>
        `,
    });
}
