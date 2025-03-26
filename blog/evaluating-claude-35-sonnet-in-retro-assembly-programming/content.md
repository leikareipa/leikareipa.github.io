<post-date date="1 November 2024"/>

# Evaluating Claude 3.5 Sonnet in retro assembly programming

Earlier this year, [I benchmarked a few LLMs in retro assembly coding](/blog/llm-performance-in-retro-assembly-coding/). The results were expected to correlate with reasoning ability in the sense that a successful model had to correctly extrapolate from limited knowledge.

How does the recently-released Claude 3.5 Sonnet do in those tests?

<table>
    <thead>
        <tr>
            <th>Model</th>
            <th>Average score</th>
        </tr>
    </thead>
    <tbody>
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
            <td>GPT-4 Turbo</td>
            <td>8%</td>
        </tr>
        <tr>
            <td>Claude 3 Sonnet</td>
            <td>4%</td>
        </tr>
    </tbody>
</table>

Below is a breakdown of the results per task.

<table class="results">
    <thead>
        <tr>
            <th>Task</th>
            <th colspan="9">Score per task<sup>&dagger;</sup></th>
        </tr>
        <tr>
            <th></th>
            <th class="name">Claude 3 Opus</th>
            <th class="name">Claude 3.5 Sonnet 2</th>
            <th class="name">Claude 3.5 Sonnet</th>
            <th class="name">Claude 3 Sonnet</th>
            <th class="name">GPT-4 Turbo</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>A program that asks the user for a word and prints it out.</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that paints the screen blue and prints something in the middle.</td>
            <td class="s2">50%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
        </tr>
        <tr>
            <td>A program that draws something onto the screen in a VGA graphics mode.</td>
            <td class="s3">75%</td>
            <td class="s3">75%</td>
            <td class="s1">25%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that prints the value in the EDX register in binary format.</td>
            <td class="s1">25%</td>
            <td class="s1">25%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
        </tr>
        <tr>
            <td>A program that reads mouse input and displays information about it on the screen.</td>
            <td class="s2">50%</td>
            <td class="s2">50%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that loads a paletted image and displays it on the screen.</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="6">
                    <sup>&dagger;</sup>A score of 0% means the code failed to compile, 25% means the code compiled but was very buggy, 50% means the code worked somewhat as intended but not perfectly, 75% means the code worked as intended, and 100% means the code worked as intended and the implementation went the extra mile in including relevant bonus features or had a particularly good presentation.
                </td>
            </tr>
        </tfoot>
    </tbody>
</table>

Based on the results, Claude 3.5 Sonnet is a clear upgrade over Claude 3 Sonnet; and the reasoning ability of the second version of Claude 3.5 Sonnet looks to be a tangible upgrade over the first version.

Claude 3 Opus remains the best model tested, and the large gap between it and Claude 3 Sonnet might suggest that a Claude 3.5 Opus could score in the 60&ndash;90% range. There are rumors however that a version of Claude 3.5 Opus &ndash; yet to be released &ndash; was trained and failed to meet Anthropic's expectations.
