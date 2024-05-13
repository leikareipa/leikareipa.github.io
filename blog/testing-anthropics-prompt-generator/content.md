<post-date date="13 May 2024"/>

# Testing Anthropic's prompt generator

Anthropic [recently released](https://twitter.com/AnthropicAI/status/1788958483565732213) an automated prompt generator for Claude that applies prompt engineering strategies to transform basic task descriptions into more effective prompts.

Let's give it a try.

I'm collecting [coding benchmark results](/blog/testing-a-medley-of-local-llms-for-coding/) for various LLMs, using a set of proprietary tests of mine. Since the tests exclude the use of engineered prompts, we can compare the results to a new run of the tests fueled by a generated prompt.

## The prompt

### Input to the prompt generator:

You'll be given a programming task to measure your ability in that domain. Write or analyze code to satisfy the requirements of the task. You only get one chance per task, and code that doesn't compile results in automatic disqualification.

### Generated output:

You will be given a programming task to measure your ability in that domain. Here are the details of the task:

\<task\>\
\{TASK\}\
\</task\>

Carefully analyze the requirements of the task. Think through your approach before writing any code. 

\<scratchpad\>\
Think through the problem here. Break it down into steps. Sketch out the code structure. Don't write the actual code yet.\
\</scratchpad\>

Remember, you only get one chance per task. Code that doesn't compile will result in automatic disqualification.

Now, write or modify the code to satisfy the task requirements. Make sure to test your code thoroughly.

When ready, provide your final code solution inside <code> tags.

After your code, explain how your code works and how it satisfies all the requirements of the task. Provide this explanation inside <explanation> tags.

Good luck!

## Results

<table class="results">
    <thead>
        <tr>
            <th colspan="2"></th>
            <th colspan="9">Test</th>
        </tr>
        <tr>
            <th></th>
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
            <td colspan="11"><b>Original prompts</b></td>
        </tr>
        <tr>
            <td>Claude 3 Opus (20240229)</td>
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
            <td>GPT-4 Turbo (2024-04-09)</td>
            <td>78%</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td colspan="11"><b>Generated prompt</b></td>
        </tr>
        <tr>
            <td>Claude 3 Opus (20240229)</td>
            <td>83%</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td>GPT-4 Turbo (2024-04-09)</td>
            <td>78%</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
        </tr>
    </tbody>
</table>

The generated prompt looks to have improved Claude 3's performance by quite a bit, and it now beats the previous record holder, GPT-4 Turbo.

In contrast, tasking GPT-4 Turbo with the generated prompt resulted in no performance improvement overall. This might not be surprising since the prompt generator is probably tuned for Claude, but it may also suggest that GPT-4 Turbo is already doing some prompt rewriting on the fly and/or is better aligned from the factory.

## Caveat

The input to the prompt generator contains information not given in the original prompts for these tests. Namely, the original prompts didn't explicitly state that the goal was to measure the AI's ability, nor explain that there would be only one chance per task and that failure to compile would mean disqualification.

In theory, these differences alone could account for some improvement in performance and so reduce the value of the generated prompt. But even in that case the results would suggest that there's tangible room for prompt engineering to improve Claude 3's performance.
