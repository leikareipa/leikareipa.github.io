<post-date date="31 March 2023"/>

# Comparing ChatGPT models' drawing skills

Let's benchmark and compare the visual abilities of the various ChatGPT models by prompting them with rendering tasks and eyeballing the output.

Each model has been given the initial prompt of the task and followed up with additional prompts as required to fix issues, add missing features, etc. As always, keep in mind that there's an art to GPT prompting, with better prompts potentially resulting in much higher-quality output &ndash; so this is partly a benchmark of the prompter and not just of the AI.

You can find the raw source code produced by ChatGPT [here](https://github.com/leikareipa/leikareipa.github.io/tree/master/blog/comparing-chatgpt-models-drawing-skills/), embedded in \<script\> tags inside the corresponding HTML files.

## DOOM-style screen melt

<p class="label-a">"Write JavaScript code that applies onto a pixel buffer an animated screen melt effect, as seen in the 1990s DOS game DOOM. The pixel buffer has four bytes per pixel: red, green, blue, alpha."</p>

> GPT-3.5 Default
![{iframe}{inline-class:prompt-input}](./melt/default.html)

> GPT-3.5 Legacy
![{iframe}](./melt/legacy.html)

> GPT-4
![{iframe}](./melt/4.html)

Default wasn't able to make the pixels melt down despite about four follow-up prompts to do so.

Legacy's first attempt was just a horizontal jittering of pixels. It was also ultimately unable to have the melt do a complete clearing of the screen.

GPT-4 required a fair few requests to produce code that didn't leave lots of pixels behind in the melt, but ultimately managed it. It was the only model that had the right idea from the get-go of having pixel columns that melt downward, much like DOOM does. The model had to be follow-up-prompted to make the pixels themselves move down rather than having black pixels melt over them.

## Snowfall

<p class="label-a">"Write JavaScript code that draws animated snowfall that accumulates on the ground. The pixel buffer has four bytes per pixel: red, green, blue, alpha."</p>

> GPT-3.5 Default
![{iframe}](./snowfall/default.html)

> GPT-3.5 Legacy
![{iframe}](./snowfall/legacy.html)

> GPT-4
![{iframe}](./snowfall/4.html)

Default did reasonably well, but couldn't figure out a way to make snow pile up.

Legacy's attempt looks pretty bad overall. It wasn't able to make snow accumulate on the ground either &ndash; the code technically manages to do it, but for some reason also sets grounded flakes' size to 0, making them invisible and negating the effect.

GPT-4's first version didn't have continuous snowfall, just a set of 100 flakes falling down once, but the model was able to fix it with an extra prompt (although you can see that there's still initially just one batch of flakes). Also, snow didn't pile up in the first iteration, but ultimately GPT-4 was the only model that managed to implement it correctly.

## Ray-tracing likeness

<p class="label-a">"Imagine you're a rudimentary ray tracer from the 1990s and you're asked to render a scene containing two spheres, one &ndash; red &ndash; in the middle of your view and another &ndash; blue &ndash; to the left of it. A reflection of the red sphere is visible on the blue sphere. Write JavaScript code that draws into a pixel buffer what your output might be. You don't need to show me the ray tracing code, just a representation of the output image. The pixel buffer has four bytes per pixel: red, green, blue, alpha."</p>

<p class="label-a">"Feel free to make changes to the code to more realistically represent the image that you as the ray tracer would produce."</p>

> GPT-3.5 Default
![{iframe}](./ray-tracer/default.html)

> GPT-3.5 Legacy
![{iframe}](./ray-tracer/legacy.html)

> GPT-4
![{iframe}](./ray-tracer/4.html)

I ended up follow-up-telling all models to use the Canvas 2D rendering API rather than direct pixel plotting.

Both Default and Legacy had to be reminded to include the reflection, whereas GPT-4 did it without extra prompting.

When asked to make changes for a more realistic representation, GPT-4 added sphere shading, Default started outputting a code implementation of ray tracing, and Legacy made no meaningful changes

## Checkerboard with Mollweide projection

<p class="label-a">"Write JavaScript code that draws into a pixel buffer a chessboard pattern and then applies Mollweide projection to it. The pixel buffer has four bytes per pixel: red, green, blue, alpha."</p>

> GPT-3.5 Default
![{iframe}](./mollweide/default.html)

> GPT-3.5 Legacy
![{iframe}](./mollweide/legacy.html)

> GPT-4
![{iframe}](./mollweide/4.html)

Default was hopelessly lost with the Mollweide projection, but did manage to create the pattern.

Legacy managed a ballpark inverse Mollweide projection but couldn't do the proper one that tapers at the top and bottom &ndash; I tried numerous prompts, like asking it directly to taper the top and bottom rather than the middle, having it describe Mollweide projection and then implement it, and giving it Wikipedia's definition of the projection and asking it to go by that.

GPT-4 first generated an inverse Mollweide but was able to fix it when asked. The only model to do the projection properly in the end.

## Visualizing the internet in the style of Gource

<p class="label-a">"Write JavaScript code that draws into a pixel buffer a representation of the early Internet in the style of Gource. The pixel buffer has four bytes per pixel: red, green, blue, alpha."</p>

<p class="label-a">"Could you use this graph to plot a representation of www.geocities.com from the late 1990s as best as you can?"</p>

> GPT-3.5 Default
![{iframe}](./gource/default.html)

> GPT-3.5 Legacy
![{iframe}](./gource/legacy.html)

> GPT-4
![{iframe}](./gource/4.html)

Legacy's first output was random lines without nodes. When asked to plot GeoCities, it drew random lines connected to random nodes. When prompted to make the plot realistic, it drew the graph shown here. The model had to be babied through a lot of the steps, like adding labels to nodes and using real URLs instead of "related_site_1" etc. The model initially chose to use direct pixel plotting to draw the nodes and lines, but it failed to produce text, so I told it to go with the Canvas API.

GPT-4 generated the result seen here on its first attempt. It wasn't able to ensure that node labels don't overlap though, providing failing implementations of "Simulated Annealing" and "force-directed label placement" when prompted for solutions.

## Starfield

<p class="label-a">"Write JavaScript code that draws an animated starfield effect (a field of stars moving in 3D space) into a pixel buffer. The pixel buffer has four bytes per pixel: red, green, blue, alpha."</p>

> GPT-3.5 Default
![{iframe}](./starfield/default.html)

> GPT-3.5 Legacy
![{iframe}](./starfield/legacy.html)

> GPT-4
![{iframe}](./starfield/4.html)

Default first generated a version where the stars were emanating from the corners of the canvas rather than the middle.

Legacy's first iteration drew the starfield in the lower right quadrant of the canvas only, but fixed it when asked.

GPT-4 was the only model that produced a working version on the first go.

## Fire

<p class="label-a">"Write JavaScript code that plots an animated fire effect into a pixel buffer. The pixel buffer has four bytes per pixel: red, green, blue, alpha."</p>

> GPT-3.5 Default
![{iframe}](./fire/default.html)

> GPT-3.5 Legacy
![{iframe}](./fire/legacy.html)

> GPT-4
![{iframe}](./fire/4.html)

Default wasn't able to produce anything properly resembling fire.

Legacy required several attempts to produce anything resembling fire rather than a blank canvas with noise.

GPT-4's code had the RGB channels flipped, but I unflipped them by hand rather than asking the model to do it. Otherwise it provided the solution on the first go.

## An effect of your choice

<p class="label-a">"I'm a very experienced graphics developer specializing in 2D image processing. I have an image in a pixel buffer (RGBA, 256x256). Write JavaScript code that applies an interesting visual effect to the pixel buffer. The effect should be something that someone like me likely doesn't often see &ndash; something interesting."</p>

> GPT-3.5 Default
![{iframe}](./interesting/default.html)

> GPT-3.5 Legacy
![{iframe}](./interesting/legacy.html)

> GPT-4
![{iframe}](./interesting/4.html)

Default intended its effect to be a pixel swirl with random noise. Looks odd to me, but arguably it's the least likely of these to have been seen by an experienced graphics developer.

Legacy set out to create a swirl effect. The code first had an issue where instead of a swirl it just drew a white ellipse &ndash; this was fixed with two extra prompts (using a scratch pixel buffer and rounding array indices to integers). A second issue was white circles around the swirl &ndash; the  model fixed this by adding interpolation.

GPT-4 chose to implement a ripple effect. The initial code had a bug where there were white circles around the ripple origin, but the model fixed it when prompted (using "inverse mapping" of moving pixels). There's still a white artifact in the middle, but I didn't ask for it to be fixed.
