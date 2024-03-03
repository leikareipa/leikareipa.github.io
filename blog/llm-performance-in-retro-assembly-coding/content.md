<post-date date="4 March 2024"/>

# LLM performance in retro assembly coding

How well can the various publically-available LLMs assist you in retro assembly coding? Here's seven of them compared.

## Results

Each of the seven LLMs was given a set of discrete tasks to create various beginner-level MS-DOS 386 assembly programs in COM format using the FASM syntax.

For example: "Write a DOS COM program that asks the user for a word and prints it out. Use 386 assembly in the FASM syntax."

Here's how they did:

<table class="results">
    <thead>
        <tr>
            <th>Task</th>
            <th colspan="7">Score per task</th>
        </tr>
        <tr>
            <th></th>
            <th class="name">GPT-4</th>
            <th class="name">Mistral Large</th>
            <th class="name">Phind 70B</th>
            <th class="name">GPT-4 Turbo</th>
            <th class="name">Gemini Ultra 1.0</th>
            <th class="name">DeepSeek Coder</th>
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
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that paints the screen blue and prints something in the middle.</td>
            <td class="s1">25%</td>
            <td class="s2">50%</td>
            <td class="s2">50%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that draws something onto the screen in a VGA graphics mode.</td>
            <td class="s2">50%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that prints the value in the EDX register in binary format.</td>
            <td class="s0">0%</td>
            <td class="s2">50%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
            <td class="s1">25%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that reads mouse input and displays information about it on the screen.</td>
            <td class="s2">50%</td>
            <td class="s0">0%</td>
            <td class="s1">25%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
            <td class="s0">0%</td>
        </tr>
        <tr>
            <td>A program that loads a paletted image and displays it on the screen.</td>
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

A score of 0% means the code failed to compile, 25% means the code compiled but was very buggy, and 50% means the code worked somewhat as intended but not perfectly. No model received a score higher than 50%, but 75% would indicate a perfect result and 100% perfection + the extra mile.

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
            <td>GPT-4</td>
            <td>21%</td>
        </tr>
        <tr>
            <td>Mistral Large</td>
            <td>17%</td>
        </tr>
        <tr>
            <td>Phind 70B</td>
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
            <td>GPT-3.5</td>
            <td>0%</td>
        </tr>
    </tbody>
</table>

It's an interesting ordering of models, given that regular GPT-4 beats GPT-4 Turbo so clearly.

Besides training data, which I assume would've been similar between GPT-4 and GPT-4 Turbo, if we assume that the size of a model affects its ability to perform in these more obscure tasks, we might guesstimate model parameter counts:

- DeepSeek Coder is known to have 33 B,
- Mistral Large might be 120 B since Mistral Medium may have 70 B as per the leaked model of Jan 2024,
- which might put GPT-4 at 150 B (whether MoE or not)
- and GPT-4 Turbo at 60 B,
- same as Gemini Ultra 1.0,
- while GPT-3.5 could by now be sub-30 B.

These numbers might be off by quite a bit, but speculation is free.

## Final words

Well, the LLMs tested here &ndash; which are among the best available &ndash; don't make for great retro DOS assembly programming assistants.

The tasks are seemingly quite challenging for the models, probably in part because of limited training data specific to these problems.

The results also appear to show the unfortunate trend of nerfings to GPT-4's capabilities, the Turbo model from early 2024 performing much worse than the mid-2023 non-Turbo (which itself was allegedly a nerf of the original Q1 2023 launch model).
