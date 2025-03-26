const blogLink = {
    $tag: "ths-blog-link",
    template: `
    <dokki-user-widget clickable>
        <a href="/blog/" class="blog-link">
            <i class="widget-icon fas fa-layer-group"></i>
            <span style="display: inline-block;">
                Blog index
            </span>
        </a>
    </dokki-user-widget>
    `,
};

window.dokkiUserComponents = (window.dokkiUserComponents || []);
window.dokkiUserComponents.push(blogLink);
