<post-date date="4 March 2024" edited="11 March 2024"/>

# LLM performance in retro assembly coding

How well can the various publically-available LLMs assist you in retro assembly coding? Here's nine of them compared.

## Results

Each of the seven LLMs was given a set of discrete tasks to create various beginner-level MS-DOS 386 assembly programs in COM format using the FASM syntax.

For example: "Write a DOS COM program that asks the user for a word and prints it out. Use 386 assembly in the FASM syntax."

Here's how they did:

<table class="results">
    <thead>
        <tr>
            <th>Task</th>
            <th colspan="9">Score per task</th>
        </tr>
        <tr>
            <th></th>
            <th class="name">Claude 3 Opus</th>
            <th class="name">GPT-4</th>
            <th class="name">Mistral Large</th>
            <th class="name">Phind-70B</th>
            <th class="name">GPT-4 Turbo</th>
            <th class="name">Gemini Ultra 1.0</th>
            <th class="name">DeepSeek Coder</th>
            <th class="name">Claude 3 Sonnet</th>
            <th class="name">GPT-3.5</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>A program that asks the user for a word and prints it out.</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that paints the screen blue and prints something in the middle.</td>
            <td class="s2">50%</td>
            <td class="s1">25%</td>
            <td class="s2">50%</td>
            <td class="s2">50%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that draws something onto the screen in a VGA graphics mode.</td>
            <td class="s3">75%</td>
            <td class="s2">50%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that prints the value in the EDX register in binary format.</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s2">50%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
            <td class="s1">25%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that reads mouse input and displays information about it on the screen.</td>
            <td class="s2">50%</td>
            <td class="s2">50%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that loads a paletted image and displays it on the screen.</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
    </tbody>
</table>

A score of 0% means the code failed to compile, 25% means the code compiled but was very buggy, 50% means the code worked somewhat as intended but not perfectly, 75% means the code worked as intended, and 100% means the code worked as intended and the implementation went the extra mile in including relevant bonus features or had a particularly good presentation.

Below are the average test scores per model across all tasks:

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
            <td>GPT-4</td>
            <td>21%</td>
        </tr>
        <tr>
            <td>Mistral Large</td>
            <td>17%</td>
        </tr>
        <tr>
            <td>Phind-70B</td>
            <td>13%</td>
        </tr>
        <tr>
            <td>GPT-4 Turbo</td>
            <td>8%</td>
        </tr>
        <tr>
            <td>Gemini Ultra 1.0</td>
            <td>8%</td>
        </tr>
        <tr>
            <td>DeepSeek Coder</td>
            <td>4%</td>
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

It's an interesting ordering of models, given that regular GPT-4 beats GPT-4 Turbo so clearly. The results for Claude 3 are interesting as well; I've written a bit more about them [here](/blog/claude-3s-exceptional-abilities-at-obscure-languages/).

One thing to note about these scores is that, as explained above, failure to produce compilable code resulted in a score of 0% in the corresponding test, regardless of the quality of the implementation otherwise. So it would be possible for a reasonably good model that tends to make small mistakes to have a deceptively low score.

## Final words

Well, although the results revealed some interesting metapatterns, these LLMs &ndash; which are among the best available &ndash; don't appear to make for great retro DOS assembly programming assistants. The tasks were seemingly quite challenging for them, probably in part due to limited training data specific to this blend of assembly.

Across all tests, Claude 3 Opus was the most capable and consistent; but with an average score of just 38%, it can't be called apt.

That said, these tests measured the ability to create complete implementations independently. More limited code completion tasks etc. might show notably higher scores.
