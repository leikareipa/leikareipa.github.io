<post-date date="25 March 2024"/>

# Brief speculation about the next GPT

The year is well underway and many eyes have turned toward the next iteration of GPT, whether it be called GPT-4.5, GPT-5, or something else.

I personally don't see OpenAI benefiting from GPT-5 coming out just yet. GPT-4 is still underutilized, third-party integrators can't keep up, and guardrails struggle even with current-gen. For the mass market, GPT-4 with agency would make more sense.

With reference to [my zero-shot coding tests for LLMs](/blog/testing-a-medley-of-local-llms-for-coding/), here's how I might expect an agentic GPT to perform relative to the current state of the playing field:

<table class="results">
    <thead>
        <tr>
            <th colspan="2"></th>
            <th colspan="9">Test</th>
        </tr>
        <tr>
            <th>Model</th>
            <th>Score</th>
            <th>1</th>
            <th>2</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>9</th>
            <th>10</th>
            <th>11</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Agentic GPT?</td>
            <td>89%</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td>GPT-4</td>
            <td>72%</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td>Claude 3 Opus</td>
            <td>72%</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td>Mistral Large</td>
            <td>61%</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td>Gemini 1.0 Ultra</td>
            <td>56%</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
        </tr>
        <tr>
            <td>ChatGPT 3.5</td>
            <td>56%</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
        </tr>
    </tbody>
</table>

In these tests, I think a score of 72% approaches the maximum for a system with no ability to iteratively evaluate its responses. Even just one or two extra iterations could significantly raise that ceiling.

I'd expect a successful agentic GPT based on GPT-4 to score in the range 80&ndash;90%, at a cost of 2&ndash;3 times the base.
