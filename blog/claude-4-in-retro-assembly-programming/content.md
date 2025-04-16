<post-date date="26 May 2025"/>

# Claude 4 in retro assembly programming

<a href="/blog/llm-performance-in-retro-assembly-coding/">Last year I did an interesting benchmark</a> evaluating AI models in obscure assembly coding. It was a test in which even the best models struggled.

Running the benchmark now for the new Claude 4 shows interesting progress, with other non-thinking models for context:

<table>
    <thead>
        <tr>
            <th>Model</th>
            <th>Score</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Claude 4 Sonnet</td>
            <td>79%</td>
        </tr>
        <tr>
            <td>Claude 4 Opus</td>
            <td>71%</td>
        </tr>
        <tr>
            <td>Claude 3 Opus</td>
            <td>38%</td>
        </tr>
        <tr>
            <td>Claude 3.5 Sonnet 2</td>
            <td>29%</td>
        </tr>
        <tr>
            <td>Claude 3.5 Sonnet</td>
            <td>21%</td>
        </tr>
        <tr>
            <td>GPT-4 (2023)</td>
            <td>21%</td>
        </tr>
        <tr>
            <td>Claude 3.7 Sonnet</td>
            <td>17%</td>
        </tr>
        <tr>
            <td>GPT-4 Turbo</td>
            <td>8%</td>
        </tr>
        <tr>
            <td>Claude 3 Sonnet</td>
            <td>4%</td>
        </tr>
        <tr>
            <td>GPT-3.5</td>
            <td>0%</td>
        </tr>
    </tbody>
</table> 

<a href="/blog/evaluating-claude-35-sonnet-in-retro-assembly-programming/">At one point in the past</a>, given the large gap between Claude 3 Sonnet and Opus and looking at fresh results for Claude 3.5 Sonnet, I speculated with some internal scepticism that a future Claude 3.5 Opus might score as high as 60&ndash;90%. We didn't get an Opus version of 3.5, but looks like Claude 4 has slotted into that extrapolated performance range.

It's a very tangible jump in capability. There are no syntax errors at all in Claude 4's assembly code, and virtually all implementations do what they're supposed to do, if not always with absolute perfection. This was rare to say the least in previous models' attempts.

For example, Claude 4 Sonnet's zero-shot implementation of a program that prints out information about mouse input:

<dokki-iframe src="/dosbox/#/ai-asm-bench/claude-4-sonnet/mouse/" height="500px">
    <template #caption>
        MOUSE
    </template>
</dokki-iframe>

It has a bug or two but is head and shoulders above previous models.

Another example, a task that no other model was able to do, loading and displaying a paletted image:

<dokki-iframe src="/dosbox/#/ai-asm-bench/claude-4-sonnet/parrot/" height="500px">
    <template #caption>
        PARROT
    </template>
</dokki-iframe>
