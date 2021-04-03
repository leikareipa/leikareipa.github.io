/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: Mesh preview
 *
 */

import Vue from "../vue.esm.browser.min.js";

export default Vue.component("info-box", {
    data()
    {
        return {
            expanded: false,
            infoText: this.$store.state.startupArgs.infoText,
        };
    },
    methods: {
        box_clicked: function(event)
        {
            // Ignore clicks on links.
            if (event.target.closest("a"))
            {
                return true;
            }
            
            this.expanded = !this.expanded;
            Vue.nextTick(this.adjust_box_width);
        },

        adjust_box_width: function()
        {
            const contentTextWidth = (this.$refs["info-box-text"].clientWidth || 0);

            // Note: We set the width to 0 when not expanded to work around a bug where
            // the initial element width gets reported too large (~1400 px) when the CSS
            // file is embedded via JS instead of in the HTML.
            this.$refs["info-box-container"].style.width = `${this.expanded? contentTextWidth : 0}px`;
        },
    },
    mounted()
    {
        this.adjust_box_width();
    },
    template: `
        <div class="info-box"
             v-bind:class="{expanded}"
             v-on:click="box_clicked"
             ref="info-box-container">

            <div v-if="!expanded"
                 ref="info-box-text">
                ?
            </div>

            <div v-else
                 ref="info-box-text">

                &ldquo;<a href="https://www.github.com/leikareipa/mesh-preview/" target="_blank">Mesh preview</a>&rdquo;
                by
                <a href="https://www.tarpeeksihyvaesoft.com" target="_blank">Tarpeeksi Hyvae Soft</a>

                <span v-if="infoText.length"
                      style="margin: 5px;">
                    
                    &bull;

                </span>

                <span v-html="infoText"></span>

            </div>

        </div>
    `,
});
