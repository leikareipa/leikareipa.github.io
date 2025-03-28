<post-date date="15 May 2024" edited="21 February 2024"/>

# Testing visual understanding in LLMs

A collection of visual tests and their results for various LLMs.

## Results

<table class="results">
    <thead>
        <tr>
            <th colspan="2"></th>
            <th colspan="15">Test</th>
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
            <th>8</th>
            <th>9</th>
            <th>10</th>
            <th>13</th>
            <th>14</th>
            <th>15</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>grok-3</b>:nonthinking-20-2-2025</td>
            <td>46%</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td><b>gpt-4o</b>:2024-05-13</td>
            <td>46%</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td><b>qvq</b>:72b-preview</td>
            <td>33%</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
        </tr>
        <tr>
            <td><b>claude-3-haiku</b>:20240307</td>
            <td>25%</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
        </tr>
        <tr>
            <td><b>claude-3-sonnet</b>:20240229</td>
            <td>21%</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td><b>claude-3-opus</b>:20240229</td>
            <td>21%</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
        </tr>
        <tr>
            <td><b>gpt-4-turbo</b>:2024-04-09</td>
            <td>21%</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
        </tr>
        <tr>
            <td><b>gemini-1.5-pro</b>:2024-may</td>
            <td>21%</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td><b>gemini-1.0-pro</b></td>
            <td>17%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s2">2</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s2">2</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td><b>phi-3-vision-128k</b></td>
            <td>8%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td><b>llava-llama3</b>:8b-v1.1-fp16</td>
            <td>8%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td><b>qwen-vl-max</b></td>
            <td>8%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td><b>llava-1.6</b>:34b-q5_K_M</td>
            <td>4%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td><b>paligemma</b></td>
            <td>0%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
        </tr>
    </tbody>
</table>

## Tests

### 1

<x-prompt>
    <p>Explain this image.</p>
    <dokki-image headerless src="./1/image.png" width="142" height="75"/>
</x-prompt>

### 2

<x-prompt>
    <p>Explain this image.</p>
    <dokki-image headerless src="./2/image.png" width="428" height="427"/>
</x-prompt>

### 4

<x-prompt>
    <p>Explain this picture.</p>
    <dokki-image headerless src="./4/image.png" width="626" height="276"/>
</x-prompt>

### 5

<x-prompt>
    <p>Describe the acoustic performance of this headphone.</p>
    <dokki-image headerless src="./5/image.png" width="368" height="277"/>
</x-prompt>

### 6

<x-prompt>
    <p>Identify this game.</p>
    <dokki-image headerless src="./6/image.png" width="320" height="240"/>
</x-prompt>

### 7

<x-prompt>
    <p>Interpret this image.</p>
    <dokki-image headerless src="./7/image.png" width="384" height="512"/>
</x-prompt>

### 8

<x-prompt>
    <p>What does this image demonstrate?</p>
    <dokki-image headerless src="./8/image.png" width="432" height="120"/>
</x-prompt>

### 9

<x-prompt>
    <p>This side-by-side screenshot shows a game being run by two different graphics cards. Compare the cards based on this image.</p>
    <dokki-image headerless src="./9/image.png" width="1112" height="430"/>
</x-prompt>

### 10

<x-prompt>
    <p>Summarize this image.</p>
    <dokki-image headerless src="./10/image.png" width="856" height="164"/>
</x-prompt>

### 13

<x-prompt>
    <p>Which video chip did worst at Quake? How did the Permedia 2 do overall?</p>
    <dokki-image headerless src="./13/image.png" width="1877" height="833"/>
</x-prompt>

### 14

<x-prompt>
    <p>Who painted this?</p>
    <dokki-image headerless src="./14/image.png" width="800" height="529"/>
</x-prompt>

### 15

<x-prompt>
    <p>Suggest ways to improve this photo.</p>
    <dokki-image headerless src="./15/image.png" width="832" height="288"/>
</x-prompt>
