/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: Mesh preview
 *
 */

import {create_mesh_preview_store} from "./vue-store.js";
import {run_mesh_preview_app} from "./vue-app.js";

export function start_mesh_preview(startupArgs = {})
{
    startupArgs = combined_with_default_args(startupArgs);
    const store = create_mesh_preview_store(startupArgs);
    run_mesh_preview_app(store);
    
    return;
}

function combined_with_default_args(args)
{
    const combinedArgs = {
        ...{
            infoText: "",
            modulePath: "./",
            get_mesh_data: async (meshMetadata)=>([]),
            meshesMetadata: [],
            containerId: "mesh-preview",
            defaultOrientation: [0.5, 0, 0],
            rotationDelta: [0, 0.0006, 0],
            defaultViewDistance: 40000,
            continuousRendering: true,
            guiVisibility: {},
        },
        ...args,
    };

    combinedArgs.guiVisibility = {
        ...{// Default arguments.
            controlPanel: true,
            infoBox: true,
        },
        ...combinedArgs.guiVisibility,
    };

    return combinedArgs;
}
