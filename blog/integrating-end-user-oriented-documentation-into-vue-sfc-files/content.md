<post-date date="7 June 2022"/>

# Integrating end-user-oriented documentation into Vue SFC files

The [single-file component](https://vuejs.org/guide/scaling-up/sfc.html) (SFC) is a preferred pattern in Vue development, in which a UI component's template, styling and logic are all defined in a single file. The pattern also allows the inclusion of custom data, such as documentation.

This post describes one way to integrate Markdown-formatted, end-user-oriented, long-form documentation &ndash; introductory articles, tutorials, and the like &ndash; into SFC files.

## Long-form documentation vs. in-code documentation

Industry-standard tools like [Doxygen](https://doxygen.nl/) allow developers to write documentation into the program source code using specially-formatted comment blocks, which are then post-processed into externally-viewable formats. However, the in-code environment isn't well suited for hosting verbose documentation, as it reduces the readability of the source code itself.

End-user-oriented documentation is less concerned with documenting lines of code as it is with ensuring that the reader gains an understanding of how the product can be used. It makes sense not to tangle this kind of documentation in-between lines of code.

By using a custom documentation block in an SFC file, long-form documentation can be given its freedom from the specifics of the implementation while also keeping it coupled to the functionality it's documenting.

## Creating a custom SFC documentation block

As mentioned above, SFC files typically include one or more of a component's (1) template, (2) style, and/or (3) logic.

Below is a sample of an SFC file containing a component's template and style, defined using the standard tag notation (\<template\> and \<style\>, correspondingly). By convention, the template block contains HTML and the style block CSS.

> A barebones sample SFC file
```html [{headerless}]
<template>
Hello there.
</template>

<style>
span { color: red; }
</style>
```

Adding a custom documentation block is simply a matter of filling a custom tag block with your documentation. In the next sample, a custom \<api-doc\> block has been added and populated with dummy API documentation in Markdown format.

> The sample SFC file with added dummy documentation in a custom \&lt;api-doc\&gt; block
````html [{headerless}]
<template>
Hello there.
</template>

<style>
span { color: red; }
</style>

<api-doc>
# The Hello component

This component is used to say hello. Lorem ipsum dolor sit amet &hellip;

## Props

| Prop | Description |
| ---- | ----------- |
| A    | Does X      |

## Usage

The simplest way to use the component is to invoke it without props:

```
x-hello
```

In this case, the component will &hellip;
</api-doc>
````

The long-form documentation now lives together with the rest of the component's data in the SFC file. (Technically, the sample documentation shown here isn't very verbose, but the idea is that a real-life version of it would have full paragraphs, various kinds of content, and so on.)

## Creating a custom webpack loader

If you've dealt with standard SFC files before, you've likely been building them using webpack and a configuration in *webpack.config.js* along these lines:

> A sample webpack.config.js for Vue SFC files
```javascript [{headerless}]
module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/i,
                use: "vue-loader",
            },
        ],
    },
};
```

However, with the custom \<api-doc\> block now included in the SFC file, the above configuration is no longer enough, since the default Vue SFC loader won't know how to process the custom data. We need to create a custom webpack loader to deal with it.

To do that, first, the webpack configuration needs to be modified to have it pass the contents of each SFC file's \<api-doc\> block into a custom loader (which we'll create shortly):

> A sample webpack.config.js for a custom \&lt;api-doc\&gt; block
```javascript [{headerless}]
rules: [
    {
        test: /\.vue$/i,
        resourceQuery: /blockType=api-doc/,
        loader: path.resolve("api-doc.loader.js"),
    },
    {
        test: /\.vue$/i,
        use: "vue-loader",
    },
],
```

The basic idea with webpack loaders is that they consist of a function that receives data from the webpack build process, does something with the data, then passes the data (or some part of the data, or nothing) to the next loader.

The simplest form of our *api-doc.loader.js* loader would be the following function, which receives the contents of a component's \<api-doc\> block and discards them by returning an empty string:

> A null block loader
```javascript [{headerless}]
// Will be called by webpack with the contents of each SFC file's <api-doc> block, one file at a time.
module.exports = function(blockContents) {
    // We won't pass the block's contents to other loaders.
    return "";
}
```

Between receiving the block's contents and returning from the function, it's up to you to deal with the data as you see fit.

For the purposes of this article, let's say we want to take the Markdown contents of an \<api-doc\> block, convert that into HTML, and insert the converted data into an output HTML file that can be viewed by our end user. The following version of *api-doc.loader.js* achieves the goal:

> A sample loader for a custom \&lt;api-doc\&gt; block
```javascript [{headerless}]
const fs = require("fs");
const htmlParser = require("node-html-parser");
const markdownIt = require("markdown-it")({html: true});

const templateFilename = "api-doc.template.html";
const outputFilename = "api-doc.html";

// Load the template of the output HTML document.
const templateDoc = htmlParser.parse(fs.readFileSync(templateFilename, "utf-8"));
const outputContainerEl = templateDoc.querySelector("#component-article-container");

// Will contain each component's documentation as a HTML string, keyed by the SFC filename.
const apiDocHtml = {};

// Converts the block's Markdown into HTML and appends it into an output document.
module.exports = function(apiDocMarkdown) {
    const srcFilename = this.resourcePath;

    apiDocHtml[srcFilename] = `<article>${markdownIt.render(apiDocMarkdown)}</article>`;

    outputContainerEl.innerHTML = Object.values(apiDocHtml).join("\n");
    fs.writeFileSync(outputFilename, templateDoc.toString(), "utf-8");

    return "";
}
```

The script starts by loading the contents of an output template HTML file &ndash; this template (shown below) provides a container element into which we can insert the converted HTML documentation. The script then does the conversion from Markdown into HTML, and appends the converted data into an object that will come to hold all of the processed components' documentation. Finally, the script inserts the converted HTML into the template document's container and saves the result as the output document.

The template document's HTML would look like this:

> The contents of api-doc.template.html
```html [{headerless}]
<html>
    <body>
        <h1>
            Components
        </h1>
        <div id="component-article-container">
            <!-- The components' HTML gets inserted here. -->
        </div>
    </body>
</html>
```

When the project is built, webpack will produce a file called **api-doc.html** containing the converted, concatenated documentation. The file would render something like this (without styling applied):

> A plain rendering of api-doc.html
<dokki-iframe height="20em" srcdoc="
    <html>
        <head>
            <style>
                body {
                    background-color: white;
                    color: black;
                }
                body :first-child {
                    margin-top: 0;
                }
                body :last-child {
                    margin-bottom: 0;
                }
            </style>
        </head>
        <body>
            <h1>Components</h1>
            <div id='component-article-container'>
                <article>
                    <h1>The Hello component</h1>
                    <p>This component is used to say hello. Lorem ipsum dolor sit amet …</p>
                    <h2>Props</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Prop</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>A</td>
                                <td>Does X</td>
                            </tr>
                        </tbody>
                    </table>
                    <h2>Usage</h2>
                    <p>The simplest way to use the component is to invoke it without props:</p>
                    <code>
                        x-hello
                    </code>
                    <p>In this case, the component will …</p>
                </article></div>
        </body>
    <html>
">
</dokki-iframe>

That's about it for this basic example.

It's worth noting that the implementation for the *api-doc.loader.js* script isn't quite ideal; for example, it writes the output document each time the webpack function is called (i.e. for each SFC file) rather than waiting for the build process to complete first. I'm not particularly experienced in writing webpack loaders, so I'll leave it up to you to improve it as needed for your purposes (you can <ths-inline-feedback-button>send feedback</ths-inline-feedback-button> if you do).
