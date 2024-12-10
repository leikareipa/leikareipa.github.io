<post-date date="10 December 2024"/>

# Looking back on speculation about the next version of GPT

[In Q1 2024](/blog/brief-speculation-about-the-next-gpt/), I speculated the next major version of GPT would be an agentic GPT-4 rather than GPT-5. That ended up being the case when o1 came out a few quarters later.

Back then, I ran some of my software development benchmarks on the then-current models and wrote:

> In these tests, I think a score of 72% approaches the maximum for a system with no ability to iteratively evaluate its responses. I'd expect a successful agentic GPT based on GPT-4 to score in the range 80–90%, at a cost of 2–3 times the base.

Do we now have that in o1? The answer appears to be yes.

<table class="results">
    <thead>
        <tr>
            <th>Model</th>
            <th>Score</th>
            <th colspan="9">Test</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="11" style="text-align: center">Q4 2024</td>
        </tr>
        <tr>
            <td>o1 Mini</td>
            <td>83%</td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
        </tr>
        <tr>
            <td>Claude 3.5 Sonnet</td>
            <td>78%</td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
        </tr>
        <tr>
            <td>QwQ 32B Preview</td>
            <td>72%</td>
            <td class="s2">✔</td>
            <td class="s0"></td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
        </tr>
        <tr>
            <td>Gemini Exp. 1206</td>
            <td>72%</td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td colspan="11" style="text-align: center">Q1 2024</td>
        </tr>
        <tr style="background-color: var(--dokkiCSS-embedded-auxiliary-color)">
            <td>Agentic GPT</td>
            <td>80–90%</td>
            <td class="s2" colspan="10" style="text-align: left !important;">Speculative</td>
        </tr>
        <tr>
            <td>GPT-4</td>
            <td>72%</td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
        </tr>
        <tr>
            <td>Claude 3 Opus</td>
            <td>72%</td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s2">✔</td>
        </tr>
        <tr>
            <td>Gemini 1.0 Ultra</td>
            <td>56%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s1"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td>ChatGPT 3.5</td>
            <td>56%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s2">✔</td>
            <td class="s2">✔</td>
        </tr>
    </tbody>
</table>

Some other observations:
- In Q1 you needed a combination of three models to do well in 65% of the tests; in Q4 you need two models to do well in 90% of the tests.
- In Q1 free models did well in up to 20% of the tests; in Q4 free models do well in up to 60% of the tests.
