
import Vue from "./vue.esm.browser.min.js";
import InfoBox from "./vue-components/InfoBox.js";
import Rendering from "./vue-components/Rendering.js";
import ControlPanel from "./vue-components/ControlPanel.js";

export function run_mesh_preview_app(vuexStore)
{
    const startupArgs = vuexStore.state.startupArgs;

    create_app_container_element(startupArgs.containerId);
    
    const app = new Vue({
        el: `#${startupArgs.containerId}`,
        store: vuexStore,
        components: {
            "mesh-preview-info-box": InfoBox,
            "mesh-preview-control-panel": ControlPanel,
            "mesh-preview-rendering": Rendering,
        },
        mounted()
        {
            this.$store.commit("set_mesh_idx", 0);
        },
        template: `
            <div class="mesh-preview">

                <link rel="stylesheet"
                      type="text/css"
                      href="${startupArgs.modulePath}/mesh-preview.css">

                <mesh-preview-rendering></mesh-preview-rendering>

                <mesh-preview-control-panel v-if="${startupArgs.guiVisibility.controlPanel}"></mesh-preview-control-panel>

                <mesh-preview-info-box v-if="${startupArgs.guiVisibility.infoBox}"></mesh-preview-info-box>
                
            </div>
        `,
    });

    return app;
}

function create_app_container_element(id = "mesh-preview")
{
    const containerElement = document.createElement("div");
    containerElement.setAttribute("id", id);
    document.body.appendChild(containerElement);

    return;
}
