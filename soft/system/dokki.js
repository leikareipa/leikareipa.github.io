/*
 * 2021 Tarpeeksi Hyvae Soft
 *
 * Software: dokki
 *
 */

"use strict";

window.addEventListener("DOMContentLoaded", create_app);

function create_app()
{
    // For embedded components whose contents can be expanded/shrunk by the user.
    // This mixin adds the 'expanded' prop, which when appended to the component,
    // will hava the component's contents start in an expanded state.
    const expandedPropMixin = {
        props: {
            expanded: {default: undefined},
        },
        data()
        {
            return {
                isExpanded: ((this.$props.expanded === undefined)? false : true),
            }
        },
    };

    // For embedded components. This mixin adds the 'headerless' prop, which when
    // appended to the component, will prevent the embedded component's header
    // element from being displayed.
    const headerlessPropMixin = {
        props: {
            headerless: {default: undefined},
        },
        data()
        {
            return {
                isHeaderless: ((this.$props.headerless === undefined)? false : true),
            }
        },
    };

    const store = new Vuex.Store({
        state: {
            topics: [],
            loremCount: 0,
            productName: undefined,
            productVersion: undefined,
            numListings: 0,
        },
        mutations: {
            add_topic(state, topicTitle = "")
            {
                state.topics.push({
                    title: topicTitle,
                    subtopics: [],
                    simplifiedTitle: simplified_topic_title(topicTitle),
                    url: `#${simplified_topic_title(topicTitle)}`
                });
            },
            add_subtopic(state, subtopic = {})
            {
                if (subtopic.parentTopic)
                {
                    subtopic.parentTopic.subtopics.push(subtopic);
                }
            },
            increment_listings_count(state)
            {
                state.numListings++;
            },
            increment_lorem_count(state)
            {
                state.loremCount++;
            },
            set_product_name(state, name)
            {
                state.productName = name;
            },
            set_product_version(state, version)
            {
                state.productVersion = version;
            }
        }
    });

    const app = Vue.createApp({});

    app.component("product-name", {
        computed: {
            productName()
            {
                return this.$store.state.productName;
            }
        },
        template: `
            <span class="dokki-product-name">
                {{productName}}
            </span>
            <slot/>
        `,
    });

    app.component("dokki-theme-selector", {
        data()
        {
            return {
                currentThemeIdx: 0,
                themes: [
                    {name: "light", icon: "fas fa-sun"},
                    {name: "dark", icon: "fas fa-moon"},
                ],
            }
        },
        created()
        {
            console.assert(this.themes.length, "Encountered an empty theme list.");
            this.update_theme();
        },
        methods:
        {
            update_theme()
            {
                document.body.dataset.dokkiTheme = this.themes[this.currentThemeIdx].name;
            }
        },
        watch:
        {
            currentThemeIdx()
            {
                this.update_theme();
            }
        },
        template: `
            <span class="dokki-theme-selector"
                  @click="currentThemeIdx = (currentThemeIdx + 1) % themes.length">

                <i :class="'fa-lg fa-fw ' + themes[currentThemeIdx].icon"/>

            </span>
        `,
    });

    app.component("dokki-header", {
        props: {
            icon: {default: "fas fa-book"},
            title: {default: "Untitled"},
            productName: {default: undefined},
            productVersion: {default: undefined},
        },
        beforeCreate()
        {
            document.title = this.title;
            this.$store.commit("set_product_name", this.productName);
            this.$store.commit("set_product_version", this.productVersion);
        },
        template: `
            <header class="dokki-header">

                <div class="dokki0-header-container">

                    <span class="dokki0-header-title"
                          :title=title>

                        <i :class="icon"/>
                        {{title}}

                    </span>

                    <dokki-theme-selector/>

                </div>

            </header>
        `,
    });

    app.component("dokki-topics", {
        template: `
            <main class="dokki-topics">
                <slot/>
            </main>
        `,
    });

    app.component("dokki-topic", {
        props: ["title"],
        data() {
            return {
                idx: -1,
            }
        },
        computed: {
            simplifiedTitle()
            {
                return (this.idx < 1)
                       ? ""
                       : this.$store.state.topics[this.idx-1].simplifiedTitle;
            },
        },
        created()
        {
            this.$store.commit("add_topic", this.title);
            this.idx = this.$store.state.topics.length;
        },
        template: `
            <span class="dokki-anchor topic"
                  :id=simplifiedTitle>
            </span>

            <section class="dokki-topic">
            
                <h1>{{this.title}}</h1>

                <slot/>

            </section>
        `,
    });

    app.component("dokki-subtopic", {
        props: ["title"],
        data() {
            return {
                selfMeta: undefined,
            }
        },
        created()
        {
            // We assume that this subtopic belongs to the most recently created topic;
            // and as such that topics are appended to the store's list of topics in the
            // order - and at the time - of their creation.
            const parentTopic = this.$store.state.topics[this.$store.state.topics.length - 1];
            console.assert(parentTopic, "Detected an orphaned subtopic.");

            const combinedTitle = `${parentTopic.title} ${this.title}`;

            this.selfMeta = {
                title: this.title,
                parentTopic: parentTopic,
                simplifiedTitle: simplified_topic_title(combinedTitle),
                url: `#${simplified_topic_title(combinedTitle)}`,
            };

            this.$store.commit("add_subtopic", this.selfMeta);
        },
        template: `
            <span class="dokki-anchor subtopic"
                  :id=this.selfMeta.simplifiedTitle>
            </span>

            <h2>{{this.title}}</h2>
            <slot/>
        `,
    });

    app.component("dokki-item", {
        props: ["title"],
        template: `
            <h3>{{this.title}}</h3>
            <slot/>
        `,
    });

    app.component("dokki-area", {
        template: `
            <p class="dokki-area">
                <slot/>
            </p>
        `,
    });

    app.component("dokki-side-panel", {
        computed: {
            topics()
            {
                return this.$store.state.topics;
            },
            productName()
            {
                const name = (this.$store.state.productName !== undefined)
                             ? this.$store.state.productName
                             : "";

                const version = (this.$store.state.productVersion !== undefined)
                                ? this.$store.state.productVersion
                                : "";

                if (!name.length || !version.length)
                {
                    return undefined;
                }

                return `${name} ${version}`;
            }
        },
        template: `
            <nav class="dokki-side-panel">

                <div v-if="productName !== undefined"
                     :title=productName
                     class="dokki0-product-tag">

                    <i class="fas fa-fw fa-caret-down"/>
                    {{productName}}

                </div>
                <div v-else
                     class="dokki0-product-tag">

                    <i class="fas fa-fw fa-caret-down"
                       style="color: gray;"/>
                    Contents

                </div>

                <ul class="dokki0-vertical-navi">

                    <li v-for="topic in topics">

                        <a :href="topic.url"
                           class="dokki0-navi-link topic">

                            <i class="dokki0-navi-link-icon fas fa-sm fa-fw fa-hashtag"/>
                            {{topic.title}}

                        </a>

                        <a v-for="subtopic in topic.subtopics"
                           :href="subtopic.url"
                           class="dokki0-navi-link subtopic">

                            <i class="dokki0-navi-link-icon fas fa-sm fa-fw fa-hashtag"/>
                            {{subtopic.title}}
                            
                        </a>

                    </li>

                </ul>
            
            </nav>
        `,
    });

    app.component("dokki-iframe", {
        props: {
            src: {default: ""},
            height: {default: "500px"},
            title: {default: "Inline frame"},
            autofocus: {default: undefined},
        },
        mixins: [expandedPropMixin],
        watch: {
            isExpanded()
            {
                if (this.isExpanded && (this.$props.autofocus !== undefined))
                {
                    this.$nextTick(()=>
                    {
                        this.$refs["iframe"].onload = ()=>{
                            this.$refs["iframe"].focus();
                        };
                    });
                }
            }
        },
        template: `
            <p class="dokki-embedded dokki-iframe">

                <header class="clickable"
                        @click="isExpanded = !isExpanded">

                    <span class="title">
                        <i class="fas fa-expand"/>
                        {{title}}
                    </span>

                    <aside class="revealer">
                        {{isExpanded? "Close frame" : "Expand frame"}}
                    </aside>

                </header>

                <hr v-if=isExpanded>

                <footer v-if=isExpanded
                        :style="{height: height}">

                    <iframe class="dokki-iframe"
                            :src=src
                            ref="iframe">
                    </iframe>
                    
                </footer>

            </p>
        `,
    });

    app.component("dokki-image", {
        props: {
            src: {},
        },
        mixins: [expandedPropMixin],
        computed: {
            hasFooter()
            {
                return !!this.$slots.caption;
            }
        },
        template: `
            <p class="dokki-embedded dokki-image"
               :class="{expanded: isExpanded}">

                <header class="clickable"
                        @click="isExpanded = !isExpanded">

                    <span class="title">
                        <i class="fas fa-image" title="Image"/>
                    </span>

                    <aside class="revealer">
                        {{isExpanded? "Hide" : "Show"}}
                    </aside>

                </header>

                <hr v-if=isExpanded>

                <img v-if=isExpanded
                     class="dokki-checker-background"
                     :src="src">

                <hr v-if=hasFooter>

                <footer v-if=hasFooter class="italic">
                    <slot name="caption"/>
                </footer>
            </p>
        `,
    });

    app.component("dokki-tip", {
        template: `
            <p class="dokki-embedded dokki-tip casts-shadow">

                <header>
                    <div class="title">
                        <i class="fas fa-asterisk"/>
                    </div>
                </header>

                <footer>
                    <slot/>
                </footer>

            </p>
        `,
    });

    app.component("dokki-warning", {
        template: `
            <p class="dokki-embedded dokki-warning casts-shadow">

                <header>
                    <span class="title">
                        <i class="fas fa-exclamation-triangle"/>
                    </span>
                </header>

                <footer>
                    <slot/>
                </footer>

            </p>
        `,
    });

    app.component("dokki-video", {
        props: {
            src: {},
            platform: {default: "youtube"},
        },
        mixins: [expandedPropMixin],
        computed: {
            hasFooter()
            {
                return !!this.$slots.caption;
            },
            videoUrl()
            {
                switch (this.platform)
                {
                    // Note: Only YouTube is supported at this time.
                    default: return `https://www.youtube-nocookie.com/embed/${this.src}`;
                }
            },
            headerIcon()
            {
                switch (this.platform)
                {
                    case "youtube": return "fab fa-youtube";
                    default: return "fas fa-film";
                }
            }
        },
        template: `
            <p class="dokki-embedded dokki-video"
               :class=platform>

               <header class="clickable"
                       @click="isExpanded = !isExpanded">

                    <span class="title">
                        <i :class="headerIcon" title="Video"/>
                    </span>

                    <aside class="revealer">
                        {{isExpanded? "Hide" : "Show"}}
                    </aside>

                </header>

                <hr v-if=isExpanded>

                <iframe v-if=isExpanded
                        class="dokki-checker-background"
                        :src=videoUrl
                        allow="fullscreen; autoplay;">
                </iframe>

                <hr v-if=hasFooter>

                <footer v-if=hasFooter class="italic">
                    <slot name="caption"/>
                </footer>

            </p>
        `,
    });

    app.component("dokki-console", {
        mixins: [headerlessPropMixin],
        props: {
            command: {default: "undefined command"},
            output: {default: undefined},
            platform: {default: "unix"}
        },
        data() {
            return {
                outputFromSlot: undefined,
            }
        },
        mounted()
        {
            if (!this.$slots.output ||
                (typeof this.$slots.output !== "function"))
            {
                return;
            }

            const outputElement = this.$slots.output()[0];

            if (outputElement)
            {
                this.outputFromSlot = outputElement.children;
            }
        },
        computed: {
            headerIcon()
            {
                switch (this.platform)
                {
                    case "windows": return "fas fa-terminal";
                    case "unix": return "fas fa-dollar-sign";
                    default: return "fas fa-dollar-sign";
                }
            },
            hasFooter()
            {
                return ((this.output !== undefined) ||
                        (this.outputFromSlot !== undefined));
            },
        },
        template: `
            <p class="dokki-embedded dokki-console"
               v-if="hasFooter || !isHeaderless">

                <header v-if="!isHeaderless">

                    <span class="title">
                        <i :class="headerIcon" title="Terminal command"/>
                    </span>

                    <span class="command">
                        {{command}}
                    </span>

                </header>

                <hr v-if="!isHeaderless">

                <footer v-if=hasFooter>
                    <DOKKI0-text-block-with-line-numbers :text="outputFromSlot || output">
                    </DOKKI0-text-block-with-line-numbers>
                </footer>
            </p>
        `,
    });

    app.component("dokki-output", {
        props: {
            title: {default: "Output"},
        },
        mixins: [expandedPropMixin],
        template: `
            <p class="dokki-embedded dokki-output">

                <header class="clickable"
                        @click="isExpanded = !isExpanded">

                    <span class="title">
                        <i class="fas fa-chevron-right"/>
                        {{title}}
                    </span>

                    <aside class="revealer">
                        {{isExpanded? "Hide" : "Show"}}
                    </aside>

                </header>

                <footer v-if=isExpanded>

                    <slot/>
                    
                </footer>

            </p>
        `,
    });

    app.component("dokki-table", {
        mixins: [expandedPropMixin],
        computed: {
            hasFooter()
            {
                return !!this.$slots.caption;
            }
        },
        template: `
            <p class="dokki-embedded dokki-table">

                <header class="clickable"
                        @click="isExpanded = !isExpanded">

                    <span class="title">
                        <i class="fas fa-border-all" title="Table"/>
                    </span>

                    <aside class="revealer">
                        {{isExpanded? "Hide" : "Show"}}
                    </aside>

                </header>

                <div v-if=isExpanded class="table-container">
                    <slot name="table"/>
                </div>

                <hr v-if="hasFooter">

                <footer v-if=hasFooter class="italic">
                    <slot name="caption"/>
                </footer>

            </p>
        `,
    });

    // Internal component, not for the end-user.
    //
    // Displays a block of text with each line prefixed by a line number. Suitable
    // for e.g. presenting source code or terminal output.
    //
    // Sample usage:
    //
    //   <DOKKI0-text-block-with-line-numbers text="
    //                                        This is the first line.
    //                                        This is another line.
    //                                        ">
    //   </DOKKI0-text-block-with-line-numbers>
    //
    // Sample output:
    //
    //   1: This is the first line.
    //   2: This is another line.
    //
    // NOTE for the 'text' prop:
    //   - Two backticks (``) must be used in place of double quotes (").
    //
    app.component("DOKKI0-text-block-with-line-numbers", {
        props: {
            text: {},
        },
        data()
        {
            return {
                blockIdx: 0,
                highlightLineNum: -1,
            }
        },
        created()
        {
            this.$store.commit("increment_listings_count");
            this.blockIdx = this.$store.state.numListings;

            update_line_highlight.call(this);
            window.addEventListener("hashchange", update_line_highlight.bind(this));

            function update_line_highlight()
            {
                // -1 means no line is highlighted.
                this.highlightLineNum = -1;

                if (window.location.hash.startsWith("#-listing:"))
                {
                    /// TODO: Add syntax validation.
                    
                    const hash = window.location.hash.substring(2).split(",");
                    const [listingIdx, lineNum] = [hash[0].split(":")[1], hash[1].split(":")[1]];

                    if (listingIdx == this.blockIdx)
                    {
                        this.highlightLineNum = (lineNum - 1);
                    }
                }
            }
        },
        mounted()
        {
            this.$nextTick(()=>
            {
                if (window.location.hash.startsWith("#-listing:"))
                {
                    const lineNaviName = window.location.hash.substring(1);
                    const elem = this.$refs[lineNaviName];

                    if (elem)
                    {
                        window.scrollTo(0, elem.offsetTop);
                    }
                }
            });
        },
        computed: {
            formattedText()
            {
                if (!this.text) {
                    return "";
                }

                let lines = this.text.split("\n");

                // Remove empty lines off the front.
                while (lines.length && !lines[0].trim().length) {
                    lines.shift();
                }

                if (!lines.length) {
                    return [];
                }

                const numPreSpaces = Math.max(0, lines[0].search(/\S/));
                for (let i = 0; i < lines.length; i++)
                {
                    lines[i] = lines[i].slice(numPreSpaces);
                    lines[i] = lines[i].replace(/``/g, "\"");
                    lines[i] = lines[i].replace(/\\\\/g, "\\");
                }

                // Remove empty lines off the back.
                while (lines.length && !lines[lines.length-1].trim().length) {
                    lines.pop();
                }

                return lines;
            }
        },
        methods: {
            reset_line_highlight()
            {
                this.highlightLineNum = -1;
                history.replaceState(null, null, " ");
            },
            highlight_line(lineNum)
            {
                if (lineNum == this.highlightLineNum)
                {
                    this.reset_line_highlight();
                }
                else
                {
                    window.location.hash = this.line_ref(lineNum);
                }
            },
            test(odx)
            {
                console.log(odx);
            },
            line_ref(lineNum)
            {
                return `-listing:${this.blockIdx},ln:${lineNum+1}`;
            },
        },
        template: `
            <table class="dokki-text-block-with-line-numbers">

                <tr v-for="(line, lineNum) in formattedText"
                    :class="{highlighted: highlightLineNum == lineNum}">

                    <span class="dokki-anchor listing-line"
                          :ref="line_ref(lineNum)">
                    </span>

                    <td class="line-number"
                        @click="highlight_line(lineNum)">

                        <span v-if="lineNum !== highlightLineNum">
                            {{lineNum+1}}&nbsp;
                        </span>

                        <span v-else>&rarr;</span>

                    </td>
                    
                    <td class="line">
                        {{line}}
                    </td>
                    
                </tr>

            </table>
        `,
    });

    app.component("dokki-code", {
        mixins: [headerlessPropMixin],
        props: {
            title: {default: "Code"},
            code: {default: undefined},
        },
        data() {
            return {
                codeFromSlot: undefined,
            }
        },
        mounted()
        {
            if (!this.$slots.code ||
                (typeof this.$slots.code !== "function"))
            {
                return;
            }

            const codeElement = this.$slots.code()[0];

            if (codeElement)
            {
                this.codeFromSlot = codeElement.children;
            }
        },
        computed: {
            hasOutput()
            {
                return !!this.$slots.default;
            },
        },
        template: `
            <p class="dokki-embedded dokki-code"
               :class="{'has-output': hasOutput}">

                <header v-if="!isHeaderless">

                    <span class="title">
                        <i class="fas fa-code" title="Code"/>
                        {{title}}
                    </span>

                </header>

                <hr v-if="!isHeaderless">

                <footer>
                    <DOKKI0-text-block-with-line-numbers :text="codeFromSlot || code">
                    </DOKKI0-text-block-with-line-numbers>
                </footer>

            </p>

            <slot/>
        `,
    });

    app.component("dokki-spoiler", {
        props: {
            title: {default: "Spoiler"},
        },
        template: `
            <dokki-output :title=title>
                <slot/>
            </dokki-output>
        `,
    });

    app.component("dokki-lorem", {
        mounted() {
            this.lorem = this.paragraphs[this.$store.state.loremCount % this.paragraphs.length];
            this.$store.commit("increment_lorem_count");
        },
        data() {
            return {
                lorem: "",
                paragraphs: [
                    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam faucibus sagittis urna,
                     non egestas felis. Ut mollis, quam at aliquam sagittis, magna purus consequat mi, vitae
                     gravida est nunc non neque. Quisque sit amet quam ac est hendrerit sagittis. Curabitur
                     id volutpat mauris.`,

                    `Vivamus quis fermentum nisi, vitae auctor elit. Suspendisse ut massa scelerisque, efficitur
                     diam non, convallis nulla. Nunc viverra ex semper, scelerisque enim nec, egestas quam. Ut
                     vitae porta erat. Vivamus ac dictum odio. Donec magna justo, cursus eu vestibulum consectetur,
                     fringilla ac magna.`,

                    `Aliquam sodales mi at erat ultrices faucibus. Curabitur non arcu diam. Sed et lacus
                     risus. Nam risus nisi, fermentum eget sapien lacinia, rhoncus luctus metus. Fusce tincidunt
                     efficitur ex a rhoncus. Aliquam lobortis lorem augue, at sollicitudin justo pretium vel.
                     Ut mattis nibh in finibus rhoncus.`,

                    `Maecenas aliquam lorem ac pharetra egestas. Interdum et malesuada fames ac ante ipsum
                     primis in faucibus. Quisque hendrerit suscipit nibh et accumsan. Integer ipsum tellus,
                     sollicitudin at est non, pulvinar dapibus erat. Cras rhoncus lobortis nunc vitae bibendum.
                     Ut dictum nisi quis nibh finibus, euismod vulputate ipsum facilisis. Pellentesque congue,
                     felis eu consequat molestie, est nibh vehicula eros, ac consectetur tortor nisi ac justo.`,

                    `Suspendisse fringilla, purus non ornare imperdiet, turpis est blandit felis, sit amet
                     ultricies urna lorem vitae erat. Cras nec ipsum vitae felis scelerisque malesuada id
                     sollicitudin mauris. Nunc hendrerit laoreet odio. Aliquam facilisis nisi eget aliquam
                     gravida. Sed ut velit bibendum arcu varius maximus.`,
                ],
            }
        },
        template: `
            <p>
                {{lorem}}
            </p>
        `,
    });

    // Prepare the DOM for mounting the app.
    {
        const documentBodyTemplate = document.querySelector("#dokki-document");
        const whileInitializingElement = document.querySelector(".dokki-while-initializing");

        if (!(documentBodyTemplate instanceof HTMLTemplateElement)) {
            throw new Error("No document body found.");
        }

        document.body.appendChild(documentBodyTemplate.content)
        documentBodyTemplate.remove();

        if (whileInitializingElement) {
            whileInitializingElement.remove();
        }
    }

    app.use(store).mount("body");

    // Takes in a guide topic title string (e.g. "System requirements") and returns
    // a reduced version of the string such that it can be used e.g. as a DOM element
    // id (e.g. "System requirements" -> "system-requirements").
    function simplified_topic_title(title)
    {
        return title.toLowerCase()
                    .replace(/[^a-zA-Z\d\s-]/g, "")
                    .replace(/\s+/g, "-")
    }
}
