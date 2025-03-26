<post-date date="7 March 2024" edited="8 March 2024"/>

# Claude 3's exceptional abilities at obscure languages

Earlier this week, [Anthropic launched Claude 3](https://www.anthropic.com/news/claude-3-family), its next-generation family of LLMs. The models &ndash; Opus, Sonnet, and (soon-to-be-released) Haiku &ndash; have already made waves for their ability to trade blows with the previous state-of-the-art, GPT-4.

In my own testing, I've found Claude 3 quite capable and even worthy of hype to some extent. It's not a GPT-4 killer in a general sense, but, for example, [it matches GPT-4 in common programming tasks](/blog/testing-a-medley-of-local-llms-for-coding/).

## The meat

One standout aspect of the Claude 3 Opus model in particular is that it appears to be exceptionally good at reconstructing representations from uncommon data.

User reports are popping up that Opus is very capable at dealing with obscure human languages ([for example](https://www.reddit.com/r/singularity/comments/1b8603h/claude_3_opus_is_the_first_language_model_that/)). I can confirm the model is able to hold conversations in more than one endangered language that GPT-4 at best struggles with and at worst is fully confused by.

While it's possible this is "just" Anthropic boosting training data for these kinds of topics, it seems plausible that the model is unusually strong at extrapolating linguistic structures from limited examples. Its parameter count may be considerably higher than GPT-4's, maybe past the point where some level of universal translation emerges.

Beyond the implications for linguists and small language communities, it makes you wonder, is the model a strong extrapolator of low-frequency data more generally? In a recent blog post, [I found that Opus was almost twice as good as GPT-4 at generating code in an obscure, obsolete variety of assembly language](/blog/llm-performance-in-retro-assembly-coding/), so this effect may not be limited strictly to human language.
