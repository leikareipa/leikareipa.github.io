export const keyboardKey = {
    $tag: "keyboard-key",
    template: `
    <span class="keyboard-key">
        <slot/>
    </span>
    `,
}

export const keyInput = {
    $tag: "key-input",
    computed: {
        keys() {
            if (!this.$slots.default) {
                return [];
            }
            const keyString = this.$slots.default()[0].children;
            return keyString.split(" + ");
        }
    },
    template: `
    <span class="key-combo" title="Keyboard shortcut">

        <span class="icon">
        
            <i class="fas fa-keyboard fa-sm"/>
            
        </span>

        <span class="path">

            <keyboard-key v-for="(key, idx) in keys" :key="key">

                {{key}}

                <span v-if="idx < (keys.length - 1)" class="separator">

                    +

                </span>

            </keyboard-key>

        </span>
        
    </span>
    `,
};

export const mouseInput = {
    $tag: "mouse-input",
    computed: {
        actions() {
            if (!this.$slots.default) {
                return [];
            }
            const actionString = this.$slots.default()[0].children;
            return actionString.split(" + ");
        }
    },
    template: `
    <span class="key-combo" title="Mouse input">

        <span class="icon">
        
            <i class="fas fa-mouse fa-sm"/>
            
        </span>

        <span class="path">

            <keyboard-key v-for="(action, idx) in actions" :key="action">

                {{action}}

                <span v-if="idx < (actions.length - 1)" class="separator">

                    +

                </span>

            </keyboard-key>

        </span>
        
    </span>
    `,
};
