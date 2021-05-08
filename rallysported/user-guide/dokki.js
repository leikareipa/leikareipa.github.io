/*
 * 2021 Tarpeeksi Hyvae Soft.
 *
 */

"use strict";

window.addEventListener("DOMContentLoaded", create_app);

// Takes in a guide topic title string (e.g. "System requirements") and returns
// a reduced version of the string such that it can be used e.g. as a DOM element
// id (e.g. "System requirements" -> "system-requirements").
function simplified_topic_title(title)
{
    return title.toLowerCase()
                .replace(/[^a-zA-Z\d\s]/g, "")
                .replace(/\s+/g, "-")
}

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
            title: {default: "Untitled guide"},
            software: {default: undefined},
        },
        beforeCreate()
        {
            document.title = this.title;
        },
        template: `
            <div class="dokki-header">
                <slot/>
                {{title}}

                <div class="software-tag"
                     v-if="software !== undefined">
                    {{software}}
                </div>
            </div>
        `,
    });

    app.component("dokki-topic", {
        props: ["title"],
        data()
        {
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

            <div class="dokki-topic"
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

            </div>
        `,
    });

    app.component("dokki-navbar", {
        computed: {
            topics()
            {
                return this.$store.state.topics;
            },
        },
        template: `
            <div class="dokki-navbar">
                <ul>
                    <li v-for="topic in topics">
                        <a :href="'#'+topic.simplifiedTitle">
                            {{topic.title}}
                        </a>
                    </li>
                </ul>
            </div>
        `,
    });

    app.component("dokki-tip", {
        template: `
            <p class="dokki-tip">
                <div class="header">
                    <i class="fas fa-info-circle"/>
                    Tip
                </div>
                <slot/>
            </p>
        `,
    });

    app.component("dokki-warning", {
        template: `
            <p class="dokki-warning">
                <div class="header">
                    <i class="fas fa-exclamation-triangle"/>
                    Warning
                </div>
                <slot/>
            </p>
        `,
    });

    app.use(store);
    app.mount("body");
}
