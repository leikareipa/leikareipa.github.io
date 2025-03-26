/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 */

const diff = {
    $tag: "x-diff",
    computed: {
        lines() {
            return (this.$slots["default"]?.()[0]?.children || '').split("\\").map(line=>line.trim()).filter(line=>line.length);
        },
    },
    template: `
    <samp class="x-diff">
        <p v-for="line in lines"
           :class="
               line.startsWith('+')
               ? 'added'
               : line.startsWith('-')
               ? 'removed'
               : 'not-changed'
            ">
            {{line}}
        </p>
    </samp>
    `,
}

window.dokkiUserComponents = (window.dokkiUserComponents || []);
window.dokkiUserComponents.push(diff);
