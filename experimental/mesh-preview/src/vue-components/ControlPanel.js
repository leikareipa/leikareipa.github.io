/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: Mesh preview
 *
 */

import Vue from "../vue.esm.browser.min.js";
import {make_element_draggable} from "../make-draggable.js";

export default Vue.component("control-panel", {
    mounted()
    {
        // Note: make_draggable() needs to know the target element's initial size,
        // so it shouldn't be called until the element has been initialized - which
        // is why we call it in this hook.
        make_element_draggable(this.$refs["control-panel"]);
    },
    data: function()
    {
        return {
            // When the user asks us to load a mesh, its index will be placed here
            // until the mesh finishes loading; at which point this will be set to
            // false. Note that the index value starts counting from 1 (0 isn't used).
            loading: false,

            // Used to store the return value of setInterval() while polling for the
            // mesh-loading status.
            loadingWaiter: undefined,
        };
    },
    computed: {
        viewDistance: {
            get()
            {
                return this.$store.state.viewDistance;
            },
            set(value)
            {
                this.$store.commit("set_render_distance", value);
            }
        },
        activeMeshIdx: {
            get()
            {
                return this.$store.state.activeMeshIdx;
            },
            set(value)
            {
                // Don't allow another mesh to be selected until we've finished
                // loading the previous selection.
                if (this.loading)
                {
                    this.$refs["mesh-selector"].value = (this.loading - 1);
                    return;
                }

                this.$store.commit("set_mesh_idx", value);
            }
        },
        ngons: function()
        {
            return this.$store.state.activeMeshNgons;
        },
    },
    watch: {
        activeMeshIdx: function(idx)
        {
            // Indicate that we've begun loading a mesh, and wait in the background
            // until the loading is complete, after which we clear the loading flag.
            // This is done to ensure that any transitions tied to setting the loading
            // flag have time to finish before the flag-clearing transition starts.
            if (!this.loading)
            {
                const transitionTime = 250;

                this.loading = (idx + 1);
                this.loadingWaiter = clearInterval(this.loadingWaiter);

                setTimeout(()=>
                {
                    this.loadingWaiter = setInterval(()=>
                    {
                        if (this.ngons.length)
                        {
                            this.loading = false;
                            this.loadingWaiter = clearInterval(this.loadingWaiter);
                        }
                    }, 1);
                }, transitionTime);
            }
        },
    },
    template: `
        <div class="control-panel"
             ref="control-panel">

            <div class="section dragger">

                <!-- This is used for mouse dragging; the dragger script attaches itself here. -->

            </div>

            <div class="section fields">

                <div class="field">

                    <span>Mesh</span>

                    <select v-model="activeMeshIdx"
                            ref="mesh-selector">

                        <option v-for="(mesh, idx) in this.$store.state.knownMeshes"
                                v-bind:value="idx"
                                v-bind:key="mesh.name">

                            {{mesh.name}}

                        </option>

                    </select>

                </div>
                
                <div class="field">

                    <span>
                    
                        View distance
                    
                    </span>

                    <input type="number"
                           step="any"
                           v-model="viewDistance">

                </div>

            </div>

            <div class="section polycount">

                <div style="margin-right: auto;">

                    Polycount:

                </div>

                <transition name="mesh-preview-transition-drop">

                    <div v-if="!loading"
                         style="margin-left: auto;">

                        {{ngons.length? ngons.length : ""}}

                    </div>

                </transition>

            </div>

        </div>
    `,
});
