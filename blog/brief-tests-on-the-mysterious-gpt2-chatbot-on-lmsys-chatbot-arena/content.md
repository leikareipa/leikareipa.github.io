<post-date date="29 April 2024"/>

# Brief tests on the mysterious gpt2-chatbot on LMSYS Chatbot Arena

Over the weekend, people noticed a new entry on LMSYS Chatbot Arena called "gpt2-chatbot". Mysteriously titled, nobody seems to know whose LLM it is, just that it identifies itself as a derivative of GPT-4 and performs about on par.

I ran a few benchmarks of my own to get a feel for what it's capable of.

Here's three graphics programming tasks pitting the mysterious bot against some recent version of GPT-4 Turbo:

<x-prompt>
    Write JavaScript code that draws animated snowfall that accumulates on the ground.
</x-prompt>

> gpt2-chatbot
![{iframe}{inline-class:model-response}](./gpt2-snow.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./nt-snow.html)

<x-prompt>
    Write JavaScript code that draws the animated fire effect often seen in the demoscene.
</x-prompt>

> gpt2-chatbot
![{iframe}{inline-class:model-response}](./gpt2-fire.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./nt-fire.html)

<x-prompt>
    <p>Imagine you're a ray tracer from the 1990s. You're asked to render a scene containing two spheres, one (red) in the middle of your view and another (blue) to the left of it; and a reflection of the red sphere is visible on the blue sphere.</p>
    <p>Use JavaScript to draw an image to represent your output.</p>
    <p>Don't write actual ray-tracing code, just an image to represent your most likely output.</p>
</x-prompt>

> gpt2-chatbot
![{iframe}{inline-class:model-response}](./gpt2-rt.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./nt-rt.html)

In all of these, gpt2-chatbot did somewhat better than GPT-4 Turbo, but the similarities in output are fairly obvious.

Besides the graphics tests, I had the AI translate some text from a low-resource language. Here, there was no big difference in achievement between gpt2-chatbot and GPT-4 Turbo, both did fairly poorly and had similar output.

So with that exhaustive barrage of tests, I'd say gpt2-chatbot is a derivative of GPT-4 Turbo, perhaps by OpenAI and perhaps not. It appears to set no towering records in ability, in some regards performing worse than the original GPT-4 as well as Claude 3 Opus.

I noted here and there in its output that it might be more introspective than GPT-4, but I haven't used GPT-4 much in a while so maybe I just don't remember what it sounds like.
