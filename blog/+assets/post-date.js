const postDate = {
    $tag: "post-date",
    props: {
        date: {type: String, required: true},
        edited: {type: String, default: ""},
    },
    template: `
    <p class="post-date">
        <span class="bit">By <a href="/">Tarpeeksi Hyvae Soft</a></span>
        <span class="bit">{{date}}<span v-if="edited"><span style="margin: 0 0.4em;">&centerdot;</span>edited on {{edited}}</span>
        </span>
    </p>
    `,
};

window.dokkiUserComponents = (window.dokkiUserComponents || []);
window.dokkiUserComponents.push(postDate);
