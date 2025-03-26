<post-date date="11 April 2024"/>

# Briefly evaluating the new GPT-4 Turbo

OpenAI recently put out a new, "majorly improved" version of GPT-4 Turbo &ndash; although it's not clear [from the tweet](https://twitter.com/OpenAI/status/1777772582680301665) whether the improvements are exclusive to the vision aspects of the model.

In any case, Playground now has a new entry for "gpt-4-turbo-2024-04-09," so let's test it against the previous version of Turbo and see whether these 'major improvements' relate to coding.

## Graphics effects

[In a previous blog post](https://leikareipa.github.io/blog/does-bad-spelling-increase-llm-response-quality/), I ran some graphics programming tests on the now-previous version of GPT-4 Turbo. We can have the new Turbo take the same tests.

<x-prompt>
    Write JavaScript code that draws animated snowfall that accumulates on the ground.
</x-prompt>

> New GPT-4 Turbo
![{iframe}{inline-class:model-response}](./nt-snow.html)

> Old GPT-4 Turbo
![{iframe}{inline-class:model-response}](./2-ref-gpt4.html)

<x-prompt>
    Write JavaScript code that draws the animated fire effect often seen in the demoscene.
</x-prompt>

> New GPT-4 Turbo
![{iframe}{inline-class:model-response}](./nt-fire.html)

> Old GPT-4 Turbo
![{iframe}{inline-class:model-response}](./3-ref-gpt4.html)

<x-prompt>
    <p>Imagine you're a ray tracer from the 1990s. You're asked to render a scene containing two spheres, one (red) in the middle of your view and another (blue) to the left of it; and a reflection of the red sphere is visible on the blue sphere.</p>
    <p>Use JavaScript to draw an image to represent your output.</p>
    <p>Don't write actual ray-tracing code, just an image to represent your most likely output.</p>
</x-prompt>

> New GPT-4 Turbo
![{iframe}{inline-class:model-response}](./nt-rt.html)

> Old GPT-4 Turbo
![{iframe}{inline-class:model-response}](./4-ref-gpt4.html)

The new Turbo has a nicer snowfall animation, though it still fails to accumulate. In the other two effects, the old model does slightly better.

## Retro assembly

Not long ago, [I benchmarked a bunch of LLMs in retro assembly programming](https://leikareipa.github.io/blog/llm-performance-in-retro-assembly-coding/). Interestingly, the non-Turbo GPT-4 did twice as good as the Turbo, and in general the results suggested that larger models do better in these tests.

<table class="results">
    <thead>
        <tr>
            <th>Task</th>
            <th colspan="9">Score</th>
        </tr>
        <tr>
            <th></th>
            <th class="name">New GPT-4 Turbo</th>
            <th class="name">Old GPT-4 Turbo</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>A program that asks the user for a word and prints it out.</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that paints the screen blue and prints something in the middle.</td>
            <td class="s2">25%</td>
            <td class="s1">25%</td>
        </tr>
        <tr>
            <td>A program that draws something onto the screen in a VGA graphics mode.</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that prints the value in the EDX register in binary format.</td>
            <td class="s2">25%</td>
            <td class="s1">25%</td>
        </tr>
        <tr>
            <td>A program that reads mouse input and displays information about it on the screen.</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that loads a paletted image and displays it on the screen.</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
    </tbody>
</table>

No difference.

## Conclusion

When it comes to coding, the new Turbo appears to provide no major benefit over the old one.

It does [beat the old Turbo in my overall LLM coding benchmark](https://leikareipa.github.io/blog/testing-a-medley-of-local-llms-for-coding/), but the difference is too small to call.
