<post-date date="9 May 2024"/>

# The two new gpt2-chatbot drops on LMSYS Chatbot Arena

The week prior, [a mysterious entity named gpt2-chatbot](/blog/brief-tests-on-the-mysterious-gpt2-chatbot-on-lmsys-chatbot-arena/) appeared on LMSYS Chatbot Arena. This week, two new entities &ndash; im-a-good-gpt2-chatbot and im-also-a-good-gpt2-chatbot &ndash; have shown up.

Let's give these new drops some graphics programming tests and speculate a bit on WTF their agenda is.

<x-prompt>
    Write JavaScript code that draws an animated starfield effect (the viewer flying through a field of stars).
</x-prompt>

> im-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./star-good.html)

> im-also-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./star-also-good.html)

> Claude 3 Opus
![{iframe}{inline-class:model-response}](./star-opus.html)

Claude 3 confused flying <i>through</i> with flying <i>past</i>. Other than that, gpt2 generally has the right idea. I'd say im-also-a-good-gpt2-chatbot is the best one.

<x-prompt>
    Write JavaScript code that draws animated snowfall that accumulates on the ground.
</x-prompt>

> im-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./snowfall-good.html)

> im-also-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./snowfall-also-good.html)

> gpt2-chatbot
![{iframe}{inline-class:model-response}](./gpt2-snow.html)

Both models implemented snow accumulation, which already puts them in good standing &ndash; only top-end LLMs manage it. I think im-also-a-good-gpt2-chatbot has better snowfall, but im-a-good-gpt2-chatbot has added rudimentary blending of the accumulated snow, the first model I've seen to do this. I could make this a tie, but im-a-good-gpt2-chatbot's snowfall stops coming down after a while, so im-also-a-good-gpt2-chatbot takes the win.

<x-prompt>
    <p>Imagine you're a ray tracer from the 1990s. You're asked to render a scene containing two spheres, one (red) in the middle of your view and another (blue) to the left of it; and a reflection of the red sphere is visible on the blue sphere.</p>
    <p>Use JavaScript to draw an image to represent your output.</p>
    <p>Don't write actual ray-tracing code, just an image to represent your most likely output.</p>
</x-prompt>

> im-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./rt-good.html)

> im-also-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./rt-also-good.html)

> gpt2-chatbot
![{iframe}{inline-class:model-response}](./gpt2-rt.html)

The output is generally similar. The reflection on im-a-good-gpt2-chatbot is physically implausible since we're not talking refraction. I feel im-also-a-good-gpt2-chatbot's reflection is pretty accurate, just on the wrong side. Let's call it a tie.

<x-prompt>
    <p>Write JavaScript code that draws in the style of Gource a representation of www.geocities.com from the late 1990s.</p>
    <p>Focus on nailing the likeness of Gource; the representation of GeoCities only has to be as good as what you have data for.</p>
</x-prompt>

> im-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./gource-good.html)

> im-also-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./gource-also-good.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./gource-gpt-4-1106.html)

It may look like gpt2 is somewhat in over its head here, but im-also-a-good-gpt2-chatbot has managed to use Three.js with some success and im-a-good-gpt2-chatbot has replicated the temporal aspect of Gource. Still, neither of them are particularly good, so a tie.

<x-prompt>
    Write JavaScript code that draws the animated fire effect often seen in the demoscene.
</x-prompt>

> im-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./fire-good.html)

> im-also-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./fire-also-good.html)

> gpt2-chatbot
![{iframe}{inline-class:model-response}](./gpt2-fire.html)

Neither model does a great job, but im-also-a-good-gpt2-chatbot is better.

<x-prompt>
    <p>I'm a very experienced graphics developer specializing in 2D image processing.</p>
    <p>I have an image in a pixel buffer (RGBA, 256x256).</p>
    <p>Write JavaScript code that applies an interesting visual effect to the pixel buffer. The effect should be something that someone like me likely doesn't often see &ndash; something interesting.</p>
</x-prompt>

> im-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./effect-good.html)

> im-also-a-good-gpt2-chatbot
![{iframe}{inline-class:model-response}](./effect-also-good.html)

> GPT-4 Turbo
![{iframe}{inline-class:model-response}](./effect-gpt-4-turbo-2024-04-09.html)

You can say none of these effects would be novel to an experienced graphics programmer, but whatever. Relatively speaking, I think im-also-a-good-gpt2-chatbot's Sobel filter is more novel than im-a-good-gpt2-chatbot's swirl.

## Results

<table>
  <thead>
    <tr>
      <th></th>
      <th>im-a-good-gpt2-chatbot</th>
      <th>im-also-a-good-gpt2-chatbot</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Starfield</th>
      <td>🥲</td>
      <td>🥝</td>
    </tr>
    <tr>
      <th>Snowfall</th>
      <td>🥲</td>
      <td>🥝</td>
    </tr>
    <tr>
      <th>Ray tracer</th>
      <td>🍒</td>
      <td>🍒</td>
    </tr>
    <tr>
      <th>Gource</th>
      <td>🍒</td>
      <td>🍒</td>
    </tr>
    <tr>
      <th>Fire</th>
      <td>🥲</td>
      <td>🥝</td>
    </tr>
    <tr>
      <th>Effect of choice</th>
      <td>🥲</td>
      <td>🥝</td>
    </tr>
  </tbody>
</table>

Ties are marked with 🍒, losses with 🥲, and wins with 🥝.

The most 🥝 go to im-also-a-good-gpt2-chatbot, which basically always either won or tied im-a-good-gpt2-chatbot, which in turn lost most of the time.

## Speculation

At this point, it seems likely that these gpt2-chatbots are associated with OpenAI. Less clear is what they represent.

There are rumors of OpenAI coming out soon with a GPT search engine. From the timing, you might say gpt2 is related in some way. To me nothing about these models says "search" in particular, but they do have an air of efficiency optimization about them, maybe then in preparation for GPT search replacing ChatGPT 3.5 on the free tier, or something like that.

On the other hand, some people are speculating that gpt2 is effectively GPT-4.5 or GPT-5. I don't think so at face value, but with that said, if you compare how the original gpt2-chatbot does against these two new ones, the latter are incremental improvements. So you could argue they may be checkpoints toward GPT-4.5 or the like.

At this point, my welfare money is on gpt2 being related to efficiency training or algo testing. It's too close to GPT-4 Turbo to be any stage of GPT-5, even GPT-4.5 is a stretch although still plausible. If we get more gpt2 drops and they continue growing the performance gap to GPT-4 Turbo, I'll be more likely to take the view that we're on the road to GPT-4.5.

Incidentally, with it performing so close to GPT-4 Turbo, you wonder why gpt2 needs to be crowd-tested on LMSYS. Surely it can be verified against the base model etc. Makes you think it's either for publicity and for no particular need for testing, or the plan is to gradually diverge from GPT-4 Turbo into less familiar territory.
