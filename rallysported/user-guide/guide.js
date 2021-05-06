/*
 * 2021 Tarpeeksi Hyvae Soft.
 *
 */

"use strict";

window.addEventListener("DOMContentLoaded", create_app);
document.addEventListener("scroll", update_side_panel_scroll);

// Takes in a guide topic title string (e.g. "System requirements") and returns
// a reduced version of the string such that it can be used e.g. as a DOM element
// id (e.g. "System requirements" -> "system-requirements").
function simplified_topic_title(title)
{
    return title.toLowerCase()
                .replace(/[^a-zA-Z\d\s]/g, "")
                .replace(/\s+/g, "-")
}

function update_side_panel_scroll()
{
    const originalOffset = parseFloat(getComputedStyle(document.body).getPropertyValue("--header-height"));
    document.querySelector(".guide-side-panel").style.top = `${Math.max(0, (originalOffset - window.scrollY))}px`;
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

    app.component("guide-header", {
        props: ["title"],
        beforeCreate()
        {
            document.title = this.title;
        },
        template: `
            <header>
                <slot/>
                {{title}}
            </header>
        `,
    });

    app.component("guide-topic", {
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
            <span class="guide-topic-anchor"
                  :id=simplifiedTitle>
            </span>
            <div class="guide-topic">
                <h2>{{this.idx}}. {{this.title}}</h2>
                <slot/>
            </div>
        `,
    });

    app.component("guide-navbar", {
        computed: {
            topics()
            {
                return this.$store.state.topics;
            },
        },
        template: `
            <div class="guide-navbar">
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

    app.use(store);
    app.mount("body");
}
