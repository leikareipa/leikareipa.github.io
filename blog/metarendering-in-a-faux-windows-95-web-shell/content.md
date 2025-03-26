<post-date date="12 March 2023"/>

# Metarendering in a faux Windows 95 web shell

In [a previous blog post](/blog/the-unexpectedly-useful-useless-thing/), I introduced a time-waster project of mine to reproduce the salient aspects of the Windows 95 UI  inside a HTML5 \<canvas\> and to derive from that a front-end framework for building web apps in that likeness.

The project is coming along here and there. I recently worked on metarendering, which I'll talk briefly about in this post.

To render the UI elements, the framework uses a software \<canvas\> renderer that I wrote previously, [the retro n-gon renderer](https://github.com/leikareipa/retro-ngon/). It's a well-featured renderer capable of 2D and 3D rasterization, although most specifically intended for retro-oriented uses.

In Windows 95, as in most operating systems no doubt, apps have the ability to render something themselves; for example, a game might render a 3D scene for the player to explore. This is where metarendering comes in: the UI renderer integrates apps' own renderings into the UI, and optionally provides the facilities for custom rendering.

Here's a sample animation of an app created using the framework rendering a spinning cube (borrowed from [one of the retro n-gon renderer's render samples](https://leikareipa.github.io/retro-ngon/samples/?sample=textured-cube-model)) within its window:

![{image}{headerless}{no-border-rounding}](./img/w95.gif)

The animation has been downconverted into 15 FPS for the sake of file size, but you get the idea. The window decorations, menus, widgets, etc. are drawn by the UI renderer, which also displays the image of the cube that the app has rendered.

Below is a simplified version of the code that defines the app:

```javascript [{headerless}]
function renderTest()
{
    const numTicks = w95.state(0);

    w95.tick.listen(timeDeltaMs=>{
        numTicks.set(numTicks.now + 1);
        const fps = (1000 / (timeDeltaMs || 1000));
        cubeMesh.rotation.y = ((cubeMesh.rotation.y + Rngon.trig.deg(80 / fps)) % Rngon.trig.deg(359));
    });

    return w95.widget.window({
        title: "Render test",
        children: [
            w95.widget.renderSurface({
                meshes: [cubeMesh],
                options,
            }),
        ],
    });
}
```

The function returns an instance of a window widget, which contains an instance of a render surface widget, which in turn contains the rendering of the cube mesh. Every time the *numTicks* state variable is mutated &ndash; occurring at the browser's refresh rate via the *w95.tick* listener &ndash; the function is called again, which returns updated instances of the widgets.    

The function essentially works like component functions in React, taking in some props as arguments (simplified away in this example) and returning a view of the component; with the ability also to maintain state, *w95.state* being the equivalent of <nobr>*React.useState*.</nobr>

Here's a simplified version of the code for the render surface widget:

```javascript [{headerless}]
function renderSurface({
    width = 100,
    height = 100,
    meshes = [Rngon.mesh()],
    options = {},
    id = "w95-render-surface",
} = {})
{
    // Render the input meshes into an off-screen pixel buffer,
    // which will be accessible via Rngon.state[id].pixelBuffer.
    Rngon.render(null, meshes, {
        state: id,
        width: ~~(width * (options.scale || 1)),
        height: ~~(height * (options.scale || 1)),
        ...options,
    });

    return Rngon.ngon([
        Rngon.vertex(0, 0),
        Rngon.vertex(width, 0),
        Rngon.vertex(width, height),
        Rngon.vertex(0, height)], {
            texture: Rngon.state[id].pixelBuffer,
    });
}
```

*Rngon* here is the global namespace of the retro n-gon renderer. The widget uses it to render the given meshes into a texture, then returns a polygon textured with that image to visually represent the widget in the UI. The widget in other words integrates custom app rendering into the UI, and from the app's viewpoint it's basically a passthrough for <nobr>*Rngon.render*.</nobr>

The renderer used on the input meshes could be something other than the retro n-gon renderer, as long as it runs synchronously and outputs a pixel buffer.
