import "./blog-link.js";

const blogPostWidgets = {
    $tag: "blog-post-widgets",
    template: `
    <ths-blog-link/>
    `
};

window.dokkiUserComponents = (window.dokkiUserComponents || []);
window.dokkiUserComponents.push(blogPostWidgets);
