/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: Mesh preview
 *
 */

import Vue from "./vue.esm.browser.min.js";
import Vuex from "./vuex.esm.browser.min.js";
import {Luu} from "./luujanko.js";

export function create_mesh_preview_store(args)
{
    Vue.use(Vuex);

    return new Vuex.Store({
        state: {
            startupArgs: args,
            knownMeshes: args.meshesMetadata,
            activeMeshIdx: -1,
            activeMeshNgons: [],
            viewDistance: args.defaultViewDistance,
        },
        mutations: {
            async set_mesh_idx(state, activeMeshIdx)
            {
                state.activeMeshIdx = activeMeshIdx;
                state.activeMeshNgons = [];
                        
                try
                {
                    const meshMetadata = state.knownMeshes[state.activeMeshIdx];
                    const meshData = await args.get_mesh_data(meshMetadata);
                    const luujankoMesh = meshData.map(face=>Luu.ngon(face.map(v=>Luu.vertex(v.x, v.y, v.z))));

                    state.activeMeshNgons = luujankoMesh;
                    state.viewDistance = (meshMetadata.viewDistance || state.startupArgs.defaultViewDistance || 40000);
                }
                catch (error)
                {
                    window.alert(error);
                    console.error(error);
                }
            },
            set_render_distance(state, distance)
            {
                state.viewDistance = distance;
            },
        }
    });
}
