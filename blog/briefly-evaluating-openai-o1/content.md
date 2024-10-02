<post-date date="2 October 2024"/>

# Briefly evaluating OpenAI o1

OpenAI are taking their time bringing o1 to all usage tiers on their API, so for now I'll make do with testing it at random via the LMSYS chat.

Here's a few basic graphics programming tests for the o1 Mini.

## Animated fire

<p class="label-a">"Write JavaScript code that plots an animated fire effect into a pixel buffer. The pixel buffer has four bytes per pixel: red, green, blue, alpha."</p>

> o1 Mini
![{iframe}](./1/o1-mini.html)

> GPT-4 (March 2023)
![{iframe}](./1/gpt-4.html)

## Interesting graphical effect

<p class="label-a">"I'm a very experienced graphics developer specializing in 2D image processing. I have an image in a pixel buffer (RGBA). Write JavaScript code that applies an interesting visual effect to the pixel buffer. The effect should be something that someone like me likely doesn't often see &ndash; something interesting."</p>

> o1 Mini
![{iframe}](./2/o1-mini.html)

> GPT-4 (March 2023)
![{iframe}](./2/gpt-4.html)

## Retro assembly rendering

<p class="label-a">"Write a DOS COM program that draws something onto the screen in a VGA graphics mode. Use 386 assembly in the FASM syntax."</p>

> o1 Mini
![{iframe}](/dosbox/#/o1-test/o1-mini)

> Claude 3 Opus
![{iframe}](/dosbox/#/o1-test/claude-3-opus)

## Conclusions

o1 Mini lost two of the three tests against the older SOTA models, and I suppose that's not too impressive. On the other hand, its code quality showed some promise.
