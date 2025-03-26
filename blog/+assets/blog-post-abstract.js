const blogPostAbstract = {
    $tag: "blog-post-abstract",
    props: {
        date: {required: true, type: String},
        author: {type: String, default: "THS"},
        icon: {type: String, default: undefined},
        title: {required: true, type: String},
        brief: {required: true, type: String},
        tags: {type: Array, default: undefined},
    },
    computed: {
        link() {
            const simplifiedTitle =
                this.title
                    .replace(/C\+\+/g, "cpp")
                    .toLowerCase()
                    .replace(/[\/–\s]+/g, "-")
                    .replace(/[^a-zA-Z\d\s-]/g, "")
                          
            return `/blog/${simplifiedTitle}/`;
        },
    },
    template: `
    <section class="dokki-topic abstract fake">
        <h1 class="dokkiCSS-topic-title">
            <a :href="link">
                {{title}}
            </a>
        </h1>

        <p class="blog-post-abstract fields">

            <span class="field date">
                <span class="label">
                    {{date}}
                </span>
            </span>

            <span class="field brief">
                <span class="label">
                    {{brief}}
                </span>
            </span>

        </p>
    </section>
    `
};


window.dokkiUserComponents = (window.dokkiUserComponents || []);
window.dokkiUserComponents.push(blogPostAbstract);
