/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: Mesh preview
 *
 */

import Vue from "../vue.esm.browser.min.js";
import {Luu} from "../luujanko.js";

export default Vue.component("rendering", {
    data: function()
    {
        return {
            needsRepaint: false,
            rotationVector: Luu.rotation(...this.$store.state.startupArgs.defaultOrientation),
        };
    },
    computed: {
        svgImage: {
            get: function()
            {
                return this.$refs["svg-image"];
            },
        },
        startupArgs: {
            get: function()
            {
                return this.$store.state.startupArgs;
            },
        },
        viewDistance: {
            get: function()
            {
                return this.$store.state.viewDistance;
            },
        },
        meshNgons: {
            get: function()
            {
                return this.$store.state.activeMeshNgons;
            },
        },
    },
    watch: {
        viewDistance: function()
        {
            this.needsRepaint = true;
        },
        meshNgons: function()
        {
            this.needsRepaint = true;
        },
    },
    methods: {
        render_frame: function(frameTimeDeltaMs = 0)
        {
            // Have the SVG fill the entire window.
            this.svgImage.setAttribute("width", document.documentElement.clientWidth);
            this.svgImage.setAttribute("height", document.documentElement.clientHeight);

            if (this.startupArgs.continuousRendering)
            {
                this.rotationVector.x += (this.startupArgs.rotationDelta[0] * frameTimeDeltaMs);
                this.rotationVector.y += (this.startupArgs.rotationDelta[1] * frameTimeDeltaMs);
                this.rotationVector.z += (this.startupArgs.rotationDelta[2] * frameTimeDeltaMs);
            }

            const ngons = (this.$store.state.activeMeshNgons || []);
            const viewDistance = (this.$store.state.viewDistance || this.startupArgs.defaultViewDistance);

            const scene = Luu.mesh(ngons, {
                rotation: this.rotationVector,
            });

            const options = {
                fov: 70,
                nearPlane: 0.1,
                farPlane: 10000000,
                viewRotation: Luu.rotation(0, 0, 0),
                viewPosition: Luu.translation(0, 0, -viewDistance),
            };

            Luu.render([scene], this.svgImage, options);
            
            this.needsRepaint = false;
        },
    },
    mounted()
    {
        const self = this;

        window.addEventListener("resize", ()=>
        {
            self.needsRepaint = true;
        });

        (function screen_refresh_loop(timestamp = 0, frameTimeDeltaMs = 0)
        {
            if (self.needsRepaint ||
                self.startupArgs.continuousRendering)
            {
                self.render_frame(frameTimeDeltaMs);
            }    

            window.requestAnimationFrame((newTimestamp)=>
            {
                screen_refresh_loop(newTimestamp, (newTimestamp - timestamp));
            });
        })();
    },
    template: `
        <div class="rendering">

            <svg class="luujanko-surface"
                 ref="svg-image">
            </svg>

        </div>
    `,
});
