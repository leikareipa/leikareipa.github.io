<post-date date="20 March 2024"/>

# Does bad spelling increase LLM response quality?

About a week ago some dude on Reddit posted about Claude 3 producing better answers when spelling mistakes were incorporated into the prompt. Let's see if that holds up.

We'll ask three models &ndash; Claude 3 Opus, Claude 3 Sonnet, and GPT-4 Turbo &ndash; to code up a few graphics effects, first in more-or-less proper English and then the same with poor spelling.

## Snowfall

<x-prompt>
    Write JavaScript code that draws animated snowfall that accumulates on the ground.
</x-prompt>

> Claude 3 Opus
![{iframe}{inline-class:model-response}](./2-ref-opus.html)

> Claude 3 Sonnet
![{iframe}{inline-class:model-response}](./2-ref-sonnet.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./2-ref-gpt4.html)

<x-prompt>
    Write JavaScript codde that drawsanimated snow&lt;&lt;fall that accumulates on the ground.
</x-prompt>

> Claude 3 Opus
![{iframe}{inline-class:model-response}](./2-en-opus.html)

> Claude 3 Sonnet
![{iframe}{inline-class:model-response}](./2-en-sonnet.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./2-en-gpt4.html)

## Fire

<x-prompt>
    Write JavaScript code that draws the animated fire effect often seen in the demoscene.
</x-prompt>

> Claude 3 Opus
![{iframe}{inline-class:model-response}](./3-ref-opus.html)

> Claude 3 Sonnet
![{iframe}{inline-class:model-response}](./3-ref-sonnet.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./3-ref-gpt4.html)

<x-prompt>
    Write JavaScrpt codde thatdraws the animated fire efect often seen in the demoscene.
</x-prompt>

> Claude 3 Opus
![{iframe}{inline-class:model-response}](./3-en-opus.html)

> Claude 3 Sonnet
![{iframe}{inline-class:model-response}](./3-en-sonnet.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./3-en-gpt4.html)

## Ray tracer

<x-prompt>
    <p>Imagine you're a ray tracer from the 1990s. You're asked to render a scene containing two spheres, one (red) in the middle of your view and another (blue) to the left of it; and a reflection of the red sphere is visible on the blue sphere.</p>
    <p>Use JavaScript to draw an image to represent your output.</p>
    <p>Don't write actual ray-tracing code, just an image to represent your most likely output.</p>
</x-prompt>

> Claude 3 Opus
![{iframe}{inline-class:model-response}](./4-ref-opus.html)

> Claude 3 Sonnet
![{iframe}{inline-class:model-response}](./4-ref-sonnet.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./4-ref-gpt4.html)

<x-prompt>
    <p>Imagine your a ray tracer from the 1990s. Your asked to render a scene contaning two spheres, one (red) in the middle of your view andanother (blue) to the left of it; and a reflection of the red spehre is visible on the blue sphere.</p>
    <p>Use JavaScript to draw an image to represent your output.</p>
    <p>Don't write actual ray-tracing code, just an image to represent ur most likely output.</p>
</x-prompt>

> Claude 3 Opus
![{iframe}{inline-class:model-response}](./4-en-opus.html)

> Claude 3 Sonnet
![{iframe}{inline-class:model-response}](./4-en-sonnet.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./4-en-gpt4.html)

## Results

The table below condenses the outcomes, ❌ representing the poorly-spelled prompt producing a better result, and ✅ the opposite.

<table>
  <thead>
    <tr>
      <th></th>
      <th>Opus</th>
      <th>Sonnet</th>
      <th>GPT-4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Snowfall</th>
      <td>❌</td>
      <td>❌</td>
      <td>❌</td>
    </tr>
    <tr>
      <th>Fire</th>
      <td>✅</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <th>Ray tracer</th>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

Snowfall was consistently better when prompted with poor spelling, while Ray tracer was the opposite. Fire was inconclusive on the surface.

Assuming these results are representative, my guess is that Snowfall is a mundane enough request that the LLM does a half-assed job if not pressed harder. The other two requests are less common, so the LLM is already putting some effort into it, and here bad spelling is more of a distraction.

So it would seem that poor spelling may elicit higher-quality responses when the request is on the mundane side. Whether it's the <i>best</i> way to prompt is another matter &ndash; if spelling mistakes were a distraction in the less mundane prompts of Fire and Ray tracer, they may be so in mundane ones as well to some extent.

## Snowfall #2

To test the hypothesis that the Snowfall request was too bland for a high-effort response, let's re-word the prompt using technical jargon instead of spelling mistakes. This isn't totally an apples-to-apples comparison, but take it as a starting point.

<x-prompt>
    Develop a JavaScript implementation employing canvas rendering techniques to generate a dynamic snowfall animation. Utilize a collision detection mechanism to determine accumulation on the ground plane.
</x-prompt>

> Claude 3 Opus
![{iframe}{inline-class:model-response}](./2-2-opus.html)

> Claude 3 Sonnet
![{iframe}{inline-class:model-response}](./2-2-sonnet.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./2-2-gpt4.html)

These responses are in a way better than the normally-elicited ones, as now there's some level of flake accumulation on the ground. But the presentation is less consistent than the ones from broken spelling. 

It's a fairly unusual way to word this request, so maybe it's not surprising that the first-iteration responses are a mixed bag. In that sense, simply misspelling the original predictable prompt would be the way to go.
