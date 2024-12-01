<post-date date="25 September 2024" edited="1 December 2024"/>

# Testing open and closed LLMs some more

<table>
    <tr>
        <th>Test</th>
        <th>General description</th>
    </tr>
    <tr>
        <th>1</th>
        <td>
            <p>Basic graphics programming using JavaScript. Requires some spatial awareness.</p>
        </td>
    </tr>
    <tr>
        <th>2</th>
        <td>
            <p>Translate a short bit of code from one language to another, optimizing for performance. Includes a gotcha.</p>
    </tr>
    <tr>
        <th>3</th>
        <td>
            <p>Write a short program using archaic assembly.</p>
        </td>
    </tr>
    <tr>
        <th>4</th>
        <td>
            <p>Implement a relatively simple feature in a file of production-class C++.</p>
        </td>
    </tr>
    <tr>
        <th>5</th>
        <td>
            <p>In a file of C++ code, refactor the formatting without changing the functionality. Includes a gotcha.</p>
        </td>
    </tr>
    <tfoot>
        <tr>
            <td colspan="9">Note: The tests measure the ability of the output to fulfil the given task. Code quality (readability, extendability, maintainability, etc.) is not an explicit factor in any of the tests.</td>
        </tr>
    </tfoot>
</table>

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
            <th>3</th>
            <th>4</th>
            <th>5</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>🥇 <b>claude-3.5</b>:sonnet-20241022</td>
            <td>70%</td>
            <td class="s2"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td>🥇 <x-size>19G</x-size><b>qwq</b>:32b-preview-q4_K_M</td>
            <td>70%</td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s2"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td>🥈 <b>o1-preview</b>:2024-09-12</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td>🥈 <x-size>30G</x-size><b>qwen-2.5</b>:72b-instruct-q2_K</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td>🥈 <b>claude-3.5</b>:sonnet-20240620</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td>🥉 <x-size>23G</x-size><b>qwen-2.5</b>:32b-instruct-q5_K_M</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td>🥉 <b>claude-3.5</b>:haiku-20241022</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td>🥉 <b>gemini-exp</b>:1114</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td>🥉 <b>gpt-4o</b>:mini-2024-07-18</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td>🥉 <b>gpt-4o</b>:2024-08-06</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td>🥉 <b>claude-3</b>:opus-20240229</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>12G</x-size><b>llama-3.2-vision</b>:11b-instruct-q8_0</td>
            <td>30%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>22G</x-size><b>gemma-2</b>:27b-instruct-q6_K</td>
            <td>30%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>gemini-1.5</b>:pro-002</td>
            <td>30%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>16G</x-size><b>qwen-2.5</b>:14b-instruct-q8_0</td>
            <td>20%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>16G</x-size><b>qwen-2.5-coder</b>:14b-instruct-q8_0</td>
            <td>20%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>18G</x-size><b>mistral-small</b>:22b-instruct-2409-q6_K</td>
            <td>20%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>12G</x-size><b>qwen-2.5</b>:32b-instruct-q2_K</td>
            <td>20%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>23G</x-size><b>qwen-2.5-coder</b>:32b-instruct-q5_K_M<sup>1</sup></td>
            <td>20%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>6G</x-size><b>llama-3.2</b>:3b-instruct-fp16</td>
            <td>20%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>9G</x-size><b>llama-3.1</b>:8b-instruct-q8_0</td>
            <td>20%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>12G</x-size><b>qwen-2.5-coder</b>:32b-instruct-q2_K</td>
            <td>10%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>13G</x-size><b>qwq</b>:32b-preview-q2_K</td>
            <td>10%</td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
        </tr>
        <tr>
            <td><x-size>26G</x-size><b>llama-3.1</b>:70b-instruct-q2_K</td>
            <td>10%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
        </tr>
        <tr>
            <td><x-size>18G</x-size><b>yi-1.5</b>:9b-chat-fp16</td>
            <td>0%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
        </tr>
        <tr>
            <td><x-size>6G</x-size><b>qwen-2.5-coder</b>:3b-instruct-fp16</td>
            <td>0%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
        </tr>
        <tr>
            <td><x-size>10G</x-size><b>gemma-2</b>:27b-instruct-q2_K</td>
            <td>0%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="6">
                    <sup>1</sup>See <a href="/blog/comparing-qwen-25-and-qwen-25-coder-for-programming/">this blog post</a> for details.
                </td>
            </tr>
        </tfoot>
    </tbody>
</table>
