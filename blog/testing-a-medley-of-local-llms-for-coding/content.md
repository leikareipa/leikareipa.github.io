<post-date date="26 February 2024" edited="26 February 2024"/>

# Testing a medley of local LLMs for coding

While the release of GPT-4 last year upgraded my expectations for LLMs, the recent release of Gemini Ultra has somewhat downgraded them. With that in mind, let's look at some of the smaller players' LLM offerings, and in particular some of the open models that're available to run locally.

I picked a variety of open models &ndash; as well as some closed ones for comparison &ndash; and ran them with Ollama through a battery of custom, programming-related zero-shot tests using straightforward prompting without particular prompt engineering. A model was given only one chance per test.

## Results

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
            <td>phind:70b<sup>*</sup></td>
            <td>48%</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td>mistral-large<sup>*</sup></td>
            <td>41%</td>
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
            <td>gemini-1.0:ultra<sup>*</sup></td>
            <td>37%</td>
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
            <td>chatgpt-3.5<sup>*</sup></td>
            <td>37%</td>
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
        <tr>
            <td>phind-codellama:34b-v2</td>
            <td>26%</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
        </tr>
        <tr>
            <td>dolphin-mixtral</td>
            <td>22%</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td>mixtral</td>
            <td>22%</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s2">2</td>
        </tr>
        <tr>
            <td>deepseek-coder:33b</td>
            <td>19%</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td>mistral</td>
            <td>15%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
        </tr>
        <tr>
            <td>codellama:70b</td>
            <td>13%</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s"> </td>
        </tr>
        <tr>
            <td>qwen:72b</td>
            <td>13%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s"> </td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s"> </td>
            <td class="s"> </td>
            <td class="s"> </td>
        </tr>
        <tr>
            <td>gemma:7b</td>
            <td>7%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
        </tr>
        <tr>
            <td>qwen:14b</td>
            <td>4%</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s1">1</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s0">0</td>
            <td class="s"> </td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="12"><sup>*</sup>Not a local model.</td>
        </tr>
        <tr>
            <td colspan="12"><sup>**</sup>Not tested.</td>
        </tr>
    </tfoot>
</table>

The results in the table above are color-coded: gray means the model produced an irrelevant answer or code that didn't run, midtone means the model's answer was generally reasonable but lacked some key information or had too many hallucinations, and light means the answer was more or less perfect. There's also dim gray to indicate that the test wasn't given to this model (due to me not having the time).

Below is a brief description of each test. Note that these are high-level descriptions rather than specifics, for two reasons: 1) it's a bunch of data that would take time to write up on, and 2) the models are listening and I'd rather they improve in general.

<table>
    <tr>
        <th>Test</th>
        <th>Description</th>
    </tr>
    <tr>
        <th>1</th>
        <td>
            <p>Learn enough about a little-known JavaScript GUI framework from a single sample app to create another simple app with it.</p>
            <p><b>Difficulty level:</b> Easy/Medium</p>
            <p><b>Observations:</b> Most models failed to produce working code.</p>
        </td>
    </tr>
    <tr>
        <th>2</th>
        <td>
            <p>Write an animated graphical effect in JavaScript, with some accompanying basic physics.</p>
            <p><b>Difficulty level:</b> Easy/Medium</p>
            <p><b>Observations:</b> Most models couldn't produce the physics part &ndash; so far, I've only seen GPT-4 do it.</p>
        </td>
    </tr>
    <tr>
        <th>4</th>
        <td>
            <p>Add a new feature to a ~100-line C++ class. This requires modification of more than one part of the class.</p>
            <p><b>Difficulty level:</b> Medium</p>
            <p><b>Observations:</b> The models typically only modified one part of the class, without considering the whole.</p>
        </td>
    </tr>
    <tr>
        <th>5</th>
        <td>
            <p>Evaluate the skill level of a developer based on a ~150-line snippet of their C++ code.</p>
            <p><b>Difficulty level:</b> Easy/Medium</p>
        </td>
    </tr>
    <tr>
        <th>6</th>
        <td>
            <p>Convert a short assembly program into performant JavaScript.</p>
            <p><b>Difficulty level:</b> Medium/High</p>
            <p><b>Observations:</b> About half the models couldn't produce working code. No model produced performant code (even GPT-4 can't do it 0-shot).</p>
        </td>
    </tr>
    <tr>
        <th>7</th>
        <td>
            <p>Disassemble a 15-byte MS-DOS COM executable into x86 assembly of a particular syntax.</p>
            <p><b>Difficulty level:</b> Medium/High</p>
            <p><b>Observations:</b> There's no one universal way to do this conversion, so the model would have to consider the context carefully.</p>
        </td>
    </tr>
    <tr>
        <th>9</th>
        <td>
            <p>Add helpful comments to a ~100-line snippet of C++ code.</p>
            <p><b>Difficulty level:</b> Medium</p>
            <p><b>Observations:</b> Virtually all models produced unnecessary line-by-line commentary that repeated what the code was obviously doing. One or two models were able to infer a basis for more meaningful comments for some sections of the code.</p>
        </td>
    </tr>
    <tr>
        <th>10</th>
        <td>
            <p>Remove all comments from a ~100-line snippet of C++ code. The code includes a variety of comment styles as well as some gotchas.</p>
            <p><b>Difficulty level:</b> Easy/Medium</p>
        </td>
    </tr>
    <tr>
        <th>11</th>
        <td>
            <p>Find bugs in a ~100-line snippet of C++ code. The code contains (at least) one explicit bug.</p>
            <p><b>Difficulty level:</b> Easy/Medium</p>
        </td>
    </tr>
</table>

## Discussion

Overall, the closed models took the cake, the newly-released phind:70b impressing me in particular.

The open models are a mixed bag. They don't seem mature enough for serious use, but might be OK for some specific tasks, depending on your situation. It's worth noting that I put no extra effort into configuring these models, just firing them up in Ollama as-is &ndash; it may be possible to get better performance out of them with a more careful approach.

The Qwen models did surprisingly poorly. One of their problems was that they tended to produce small syntax errors in code, which in these tests gave a failing grade.

The big Code Llama model likewise wasn't on fire. It had maybe the worst responses of all models tested. I'm aware some people have reported problems getting the model properly configured &ndash; maybe that's the problem, I just went with the default Ollama settings and am not interested enough to dig through config files to find out.

Gemma sucked for coding but seems to be among the better ones for natural-sounding text production.

I get the impression a problem with open models is that as soon as they become good enough to seriously challenge the closed models they end up closed themselves ($$$ and responsibility), so the open field would remain behind the curve even when its absolute level rises.
