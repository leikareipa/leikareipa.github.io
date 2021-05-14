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
    const store = new Vuex.Store({
        state: {
            topics: [],
        },
        mutations: {
            add_topic(state, topicTitle)
            {
                state.topics.push({
                    title: topicTitle,
                    simplifiedTitle: simplified_topic_title(topicTitle),
                    url: `#${simplified_topic_title(topicTitle)}`
                });
            },
        }
    });

    const app = Vue.createApp({});

    app.component("dokki-header", {
        props: {
            icon: {default: "fas fa-book"},
            title: {default: "Untitled"},
            software: {default: undefined},
        },
        beforeCreate()
        {
            document.title = this.title;
        },
        template: `
            <header class="dokki-header">
                <i :class="icon" style="margin-right: 10px;"/>

                {{title}}

                <div v-if="software !== undefined"
                     class="software-tag">

                    {{software}}

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
        mounted()
        {
            this.$store.commit("add_topic", this.title);
            this.idx = this.$store.state.topics.length;
        },
        template: `
            <span class="dokki-topic-anchor"
                  :id=simplifiedTitle>
            </span>

            <section class="dokki-topic"
                 :id=simplifiedTitle>
            
                <h2 class="title">
                    {{this.idx}}. {{this.title}}
                </h2>

                <span class="permalink"
                      title="Permalink to this topic">

                    <a :href="'#'+simplifiedTitle">
                        <i class="fas fa-link"/>
                    </a>

                </span>

                <slot/>

            </section>
        `,
    });

    app.component("dokki-side-panel", {
        data() {
            return {
                isScrollable: false,
            }
        },
        computed: {
            topics()
            {
                return this.$store.state.topics;
            },
        },
        mounted()
        {
            window.addEventListener("resize", update_scrollable_status.bind(this)); 
            this.$nextTick(update_scrollable_status);

            function update_scrollable_status()
            {
                const margin = parseInt(window.getComputedStyle(document.body).getPropertyValue("--content-margin"));
                const height = (this.$refs.container.clientHeight + (margin * 2));
                this.isScrollable = (height >= this.$refs.panel.clientHeight);
            };
        },
        template: `
            <nav ref="panel"
                 class="dokki-side-panel"
                 :class="{scrollable: isScrollable}">

                <div ref="container"
                     class="container">

                    <div class="dokki-navbar">
                        <ul>
                            <li v-for="topic in topics">
                                <a :href="'#'+topic.simplifiedTitle">
                                    {{topic.title}}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="dokki-tag">
                        Documented with

                        <a href="https://github.com/leikareipa/dokki"
                        target="_blank"
                        rel="noopener noreferrer">
                        
                            dokki
                        </a>
                    </div>

                </div>
            
            </nav>
        `,
    });

    app.component("dokki-image", {
        props: {
            src: {},
            expanded: {default: undefined},
        },
        data() {
            return {
                isExpanded: ((this.$props.expanded === undefined)? false : true),
            }
        },
        computed: {
            hasFooter()
            {
                return !!this.$slots.default;
            }
        },
        template: `
            <p class="dokki-embedded dokki-image"
               :class="{expanded: isExpanded}">

                <header class="clickable"
                        @click="isExpanded = !isExpanded">

                    <span class="title">
                        <i class="fas fa-image"/
                           title="Image">
                    </span>

                    <aside class="revealer">
                        {{isExpanded? "Hide" : "Show"}}
                    </aside>

                </header>

                <img v-if=isExpanded
                     :src="src">

                <footer v-if=hasFooter>
                    <slot/>
                </footer>
            </p>
        `,
    });

    app.component("dokki-tip", {
        template: `
            <p class="dokki-embedded dokki-tip">

                <header>
                    <div class="title">
                        <i class="fas fa-info-circle"
                           title="Tip"/>
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
            <p class="dokki-embedded dokki-warning">

                <header>
                    <span class="title">
                        <i class="fas fa-exclamation-triangle"
                           title="Warning"/>
                    </span>
                </header>

                <footer>
                    <slot/>
                </footer>

            </p>
        `,
    });

    // Displays a video from a given source.
    //
    // Sample usage:
    //
    //   <dokki-video platform="youtube"
    //                src="ZgWGmggi5Xo">
    //   </dokki-video>
    //
    // NOTE: The 'src' prop is a video identifier whose exact meaning depends on the
    // host platform (identified by the 'platform' prop).
    //
    app.component("dokki-video", {
        props: {
            src: {},
            platform: {default: "youtube"}
        },
        data() {
            return {
                isExpanded: false,
            }
        },
        computed: {
            hasFooter()
            {
                return !!this.$slots.default;
            },
            videoUrl()
            {
                switch (this.platform)
                {
                    // Note: Only YouTube is supported at this time.
                    default: return `https://www.youtube-nocookie.com/embed/${this.src}?autoplay=1`;
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
                        <i :class="headerIcon"
                           title="Video"/>
                    </span>

                    <aside class="revealer">
                        {{isExpanded? "Hide" : "Show"}}
                    </aside>

                </header>

                <iframe v-if=isExpanded
                        :src=videoUrl
                        allow="fullscreen; autoplay;">
                </iframe>

                <footer v-if=hasFooter>
                    <slot/>
                </footer>

            </p>
        `,
    });

    // For displaying terminal commands and their output.
    //
    // Sample usage:
    //
    //   <dokki-console platform="unix"
    //                  command="./run.sh"
    //                  output="Hello there.">
    //   </dokki-console>
    //
    app.component("dokki-console", {
        props: {
            command: {default: "undefined command"},
            output: {default: ""},
            platform: {default: "unix"}
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
            }
        },
        template: `
            <p class="dokki-embedded dokki-console">

                <header>

                    <span class="title">
                        <i :class="headerIcon"
                           title="Terminal command"/>
                    </span>

                    <span class="command">
                        {{command}}
                    </span>

                </header>

                <footer>
                    <DOKKI0-text-block-with-line-numbers :text=output>
                    </DOKKI0-text-block-with-line-numbers>
                </footer>

            </p>
        `,
    });

    // For showcasing the output of something; e.g. of a block of sample code or
    // another website (via an <iframe> combined with the 'unpadded' prop).
    //
    // Sample usage:
    //
    //   <dokki-output title="Expected output">
    //       Hello there.
    //       <div>Hello again</div>
    //   </dokki-output>
    //
    app.component("dokki-output", {
        props: {
            title: {default: "Output"},
            unpadded: {default: undefined},
        },
        data() {
            return {
                isExpanded: false,
            }
        },
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

                <footer v-if=isExpanded
                        :class="{unpadded: (unpadded !== undefined)}">

                    <slot/>
                    
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
    //   - Escape sequences (e.g. \n) must be doubly escaped (e.g. \\n).
    //
    app.component("DOKKI0-text-block-with-line-numbers", {
        props: {
            text: {},
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
        template: `
            <table class="dokki-text-block-with-line-numbers">

                <tr v-for="(line, index) in formattedText">

                    <td class="line-number">
                        {{index+1}}:
                    </td>
                    
                    <td class="line">
                        {{line}}
                    </td>
                    
                </tr>

            </table>
        `,
    });

    // For embedding blocks of source code.
    //
    // Sample usage:
    //
    //   <dokki-code title="C"
    //               code="
    //               int main(void)
    //               {
    //                   const char *str = ``Hello there.``;
    //                   printf(``The string says: '%s'\\n``, str);
    //                   return 0;
    //               }
    //               ">
    //
    //       <!-- Optional. -->
    //       <dokki-output>
    //           The string says: 'Hello there.'
    //       </dokki-output>
    //
    //   </dokki-code>
    //
    app.component("dokki-code", {
        props: {
            title: {default: "Untitled"},
            code: {},
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

                <header>
                    <span class="title">
                        <i class="fas fa-code"
                           title="Code"/>
                        {{title}}
                    </span>
                </header>

                <footer>
                    <DOKKI0-text-block-with-line-numbers :text=code>
                    </DOKKI0-text-block-with-line-numbers>
                </footer>

            </p>

            <slot/>
        `,
    });

    // A semantic alias of dokki-output.
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

    app.use(store);
    app.mount("body");

    // Takes in a guide topic title string (e.g. "System requirements") and returns
    // a reduced version of the string such that it can be used e.g. as a DOM element
    // id (e.g. "System requirements" -> "system-requirements").
    function simplified_topic_title(title)
    {
        return title.toLowerCase()
                    .replace(/[^a-zA-Z\d\s]/g, "")
                    .replace(/\s+/g, "-")
    }
}
