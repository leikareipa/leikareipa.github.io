<post-date date="4 March 2024"/>

# Is GPT-4 AGI?

The release by OpenAI of GPT-4 a year ago moved forward the possibility of achieving AGI; although people couldn't quite agree to what extent. Some called it just a stochastic parrot, others felt it was proto-AGI, etc.

Now, with Elon Musk suing OpenAI and the lawsuit revolving in part over these kinds of definitions, the question of the extent to which GPT-4 moves the needle toward AGI is again topical.

## The human developer

Recently, I [benchmarked various LLMs in programming tests](/blog/testing-a-medley-of-local-llms-for-coding/).

What happens if I plop into the test results the estimated performance level of myself, an experienced software developer?

<table class="results">
    <thead>
        <tr>
            <th colspan="2"></th>
            <th colspan="9">Test</th>
        </tr>
        <tr>
            <th>Informant</th>
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
            <td><i>Human</i></td>
            <td><i>72%</i></td>
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
            <td>Gemini Ultra 1.0</td>
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

These are zero-shot, one-chance tests at various programming tasks using languages I'm familiar with. In this pinpoint domain, the performance of GPT-4 (version 0613) matches my estimated level, i.e. it appears to have my general ability.

If you were to incorporate speed of processing into the test scores, I'd lose badly: while I'd have to manually google some details etc., GPT-4 is able to provide implementations in seconds. Its output would contain some mistakes, but so would mine.

That said, these particular tests required only limited contextual awareness, operating on at most a single file of source code. While GPT-4's ability to reason is notable, the tooling around it hasn't taken off yet to enable it to act more independently. But you can see that if it were to do so, this human developer would be in for a ride.

## Iterative improvement

In an earlier blog post comparing GPT-3.5 and GPT-4 in some programming tasks, I saw that [GPT-4 had a strong ability to improve iteratively](/blog/chatgpt-dealing-with-assembly-code/#chatgpt-dealing-with-assembly-code-make-it-into-javascript).

In that particular case, GPT-4 was able to convert its initial sub-optimal implementation into a well-optimized one &ndash; matching my performance &ndash; in 2&ndash;4 steps of iteration. I simply gave the AI a performance target and reported back the performance level of each of its attempts, based on which GPT-4 adjusted its code to eventually reach the target.

Again, in this pinpoint domain, with a framework in which GPT-4 could iterate on solutions, it matched my ability and provided the implementation faster than I could.

## AGI, ASI

That's cool, but it's only coding and AGI is supposed to match humans in a more general sense.

I can't speak for all human professions, but consider these theoretical ideas:

1. AGI without agency depends on the abilities of an agent to carry out tasks.
2. Society as an agent has internal friction toward the utilization of AGI.
3. Improving the general reasoning of an AGI is a way to an ASI.

So, GPT-4 accounting for the shortcomings of the agent may well be AGI, the development of ASI can proceed parallel to society perceiving proto-AGI, and the question of whether we have AGI may be well behind the times.
