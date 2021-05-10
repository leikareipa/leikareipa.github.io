/*
 * 2021 Tarpeeksi Hyvae Soft.
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
        computed: {
            topics()
            {
                return this.$store.state.topics;
            },
        },
        template: `
            <nav class="dokki-side-panel">

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
                        <i class="fas fa-image"/>
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
                        <i class="fas fa-info-circle"/>
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
                        <i class="fas fa-exclamation-triangle"/>
                    </span>
                </header>

                <footer>
                    <slot/>
                </footer>

            </p>
        `,
    });

    // For showcasing the output of something; e.g. of a block of sample code.
    //
    // Sample usage:
    //
    //   <dokki-output>
    //       Hello there.
    //       <div>Hello again</div>
    //   </dokki-output>
    //
    app.component("dokki-output", {
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

    // For embedding blocks of source code.
    //
    // Sample usage:
    //
    //   <dokki-code lang="C"
    //               code="
    //               int main(void)
    //               {
    //                   const char *str = ``Hello there.``;
    //                   printf(``The string says: '%s'\\n``, str);
    //                   return 0;
    //               }
    //               ">
    //   </dokki-code>
    //
    // NOTE: Two backticks (``) must be used in place of double quotes (").
    //
    // NOTE: Escape sequences (e.g. \n) must be doubly escaped (e.g. \\n).
    //
    app.component("dokki-code", {
        props: {
            lang: {default: "unknown language"},
            code: {},
        },
        computed: {
            formattedCode()
            {
                if (!this.code) {
                    return "";
                }

                let lines = this.code.split("\n").filter(s=>s.length);
                
                if (!lines.length) {
                    return "";
                }
                
                const numPreSpaces = Math.max(0, lines[0].search(/\S/));

                for (let i = 0; i < lines.length; i++)
                {
                    lines[i] = lines[i].slice(numPreSpaces);
                    lines[i] = lines[i].replace(/``/g, "\"");
                    lines[i] = lines[i].replace(/\\\\/g, "\\");
                }

                return lines.filter(s=>s.length);
            }
        },
        template: `
            <p class="dokki-embedded dokki-code">

                <header>
                    <span class="title">
                        <i class="fas fa-code"/>
                        {{lang}}
                    </span>
                </header>

                <footer>
                    <code v-for="line in formattedCode">
                        {{line}}<br>
                    </code>
                </footer>

            </p>
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
