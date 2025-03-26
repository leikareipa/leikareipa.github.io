const postDate = {
    $tag: "post-date",
    props: {
        date: {type: String, required: true},
        edited: {type: String, default: ""},
    },
    template: `
    <p class="post-date">
        <span class="bit">{{date}}<span v-if="edited"><span style="margin: 0 0.75em;">&centerdot;</span>Updated {{edited}}</span>
        </span>
    </p>
    `,
};

window.dokkiUserComponents = (window.dokkiUserComponents || []);
window.dokkiUserComponents.push(postDate);
