<post-date date="25 September 2024" edited="6 August 2025"/>

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
            <td colspan="9">Note: The tests measure the ability of the model's output to fulfil the given task; code quality (readability, extendability, maintainability, etc.) is not an explicit factor in any of the tests. A
            model is given one chance per test. Models are typically run via Ollama.</td>
        </tr>
    </tfoot>
</table>

<table class="results">
    <thead>
        <tr>
            <th colspan="2">Model</th>
            <th colspan="9">Test</th>
        </tr>
        <tr>
            <th><input type="text" placeholder="&#x1F50E;&#xFE0E; Filter"></th>
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
            <td><b>claude-3.7</b>:sonnet-20250219-think-32k</td>
            <td>90%</td>
            <td class="s2"></td>
            <td class="s1"></td>
            <td class="s2"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><b>gpt-4.5</b>:preview-2025-02-27</td>
            <td>80%</td>
            <td class="s2"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><b>claude-4</b>:sonnet-20250514-think-32k</td>
            <td>80%</td>
            <td class="s2"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><b>claude-4</b>:sonnet-20250514</td>
            <td>70%</td>
            <td class="s2"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>claude-3.5</b>:sonnet-20241022</td>
            <td>70%</td>
            <td class="s2"></td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>grok-3</b>:think-20-2-2025</td>
            <td>70%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>19G</x-size><b>qwq</b>:32b-preview-q4_K_M</td>
            <td>70%</td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s2"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>19G</x-size><b>qwq</b>:32b-q4_K_M</td>
            <td>60%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>23G</x-size><b>qwq</b>:32b-preview-q5_K_M</td>
            <td>60%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><b>gemini-2.5-pro</b>:exp-03-25</td>
            <td>60%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><span>🥈</span><b>grok-3</b>:20-2-2025</td>
            <td>60%</td>
            <td class="s2"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>19G</x-size><b>deepseek-r1</b>:32b-qwen-distill-q4_K_M</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><b>claude-3.7</b>:sonnet-20250219</td>
            <td>50%</td>
            <td class="s2"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>o1-preview</b>:2024-09-12</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><b>o4-mini</b>:high-2025-04-16</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>34G</x-size><b>qwq</b>:32b-preview-q8_0</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>30G</x-size><b>qwen-2.5</b>:72b-instruct-q2_K</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>52G</x-size><b>mistral-large</b>:123b-instruct-2407-q3_K_S</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><b>gemini-2.0-flash</b>:exp</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>gemini-2.0-pro</b>:exp-02-05</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>gemini-exp</b>:1206</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>claude-3.5</b>:sonnet-20240620</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>54G</x-size><b>llama-3.2-vision</b>:90b-instruct-q4_K_M</td>
            <td>50%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>65G</x-size><b>qwq</b>:32b-preview-fp16</td>
            <td>50%</td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>15G</x-size><b>qwq</b>:32b-preview-q3_K_M</td>
            <td>40%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>23G</x-size><b>qwen-2.5</b>:32b-instruct-q5_K_M</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>49G</x-size><b>llama-3.3</b>:70b-instruct-q5_K_M</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>10G</x-size><b>falcon-3</b>:10b-instruct-q8_0</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><x-size>42G</x-size><b>deepseek-r1</b>:70b-llama-distill-q4_K_M</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>claude-3.5</b>:haiku-20241022</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
            <td class="s2"></td>
        </tr>
        <tr>
            <td><b>gemini-exp</b>:1114</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>o1-mini</b>:2024-09-12</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>gpt-4o</b>:mini-2024-07-18</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>gpt-4o</b>:2024-08-06</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>claude-3</b>:opus-20240229</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>32G</x-size><b>qwen-3</b>:30b-a3b-q8_0</td>
            <td>40%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s2"></td>
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
            <td><x-size>29G</x-size><b>qwen-2.5-coder</b>:14b-instruct-fp16</td>
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
            <td><x-size>23G</x-size><b>qwen-2.5-coder</b>:32b-instruct-q5_K_M</td>
            <td>20%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><x-size>47G</x-size><b>athene-v2</b>:72b-q4_K_M</td>
            <td>20%</td>
            <td class="s1"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s1"></td>
        </tr>
        <tr>
            <td><b>gemini-2.0-flash-thinking</b>:exp-1219</td>
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
        <tr>
            <td><x-size>19G</x-size><b>exaone-3.5</b>:32b-instruct-q4_K_M</td>
            <td>0%</td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
            <td class="s0"></td>
        </tr>
    </tbody>
</table>
