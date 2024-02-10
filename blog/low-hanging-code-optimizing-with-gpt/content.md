<post-date date="29 March 2023"/>

# Low-hanging code optimizing with GPT

By now everyone knows what GPT is, so let's jump straight to it.

In this post, I'll feed ChatGPT &ndash; **GPT-3.5 Default** aka. the free one, **GPT-3.5 Legacy**, and **GPT-4** &ndash; some not-so-thoroughly-optimized but performance-critical JavaScript code (my own open-source work) and see whether the AI can help me optimize it without too much work on my part.

I won't delve into state-of-the-art prompt engineering here, I'll just use some basic prompting and see how it goes.

## Clamped UV coordinates

> <i>"Suggest ways to speed up this clamped UV coordinate calculation in a rasterizer:"</i>
>
> ```javascript [{headerless}]
> const signU = Math.sign(u);
> const signV = Math.sign(v);
> const upperLimit = (1 - Number.EPSILON);
> 
> u = Math.max(0, Math.min(Math.abs(u), upperLimit));
> v = Math.max(0, Math.min(Math.abs(v), upperLimit));
> 
> // Negative UV coordinates flip the texture.
> if (signU === -1) u = (upperLimit - u);
> if (signV === -1) v = (upperLimit - v);
> 
> u *= textureMipLevel.width;
> v *= textureMipLevel.height;
> ```

### GPT-3.5 Default

> GPT-3.5 Default
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
There are several ways to speed up the clamped UV coordinate calculation in a rasterizer:

1. Use precomputed values: If you know the upper and lower bounds of your texture coordinates, you can precompute the scaling factor needed to transform them into pixel coordinates. This can save time in the runtime calculation of the clamped UV coordinates.

2. Use conditional operators instead of Math functions: Using conditional operators (e.g., ternary operators) instead of Math.min and Math.max functions can improve performance. For example, instead of Math.max(0, Math.min(Math.abs(u), upperLimit)), you can use u < 0 ? 0 : u > upperLimit ? upperLimit : u. This approach can be faster because it eliminates function calls and the associated overhead.

3. Use bitwise operations: If the texture size is a power of two, you can use bitwise operations instead of multiplication and division to scale the UV coordinates. For example, to multiply by the texture width, you can use u << log2(textureMipLevel.width).

4. Use a lookup table: If your texture coordinates are limited to a small range, you can create a lookup table that maps the input range to the output range. This can be faster than calculating the clamped UV coordinates on the fly.
```

The UV coordinates are floating-point, so I ignored the third suggestion about using bitwise operations. I don't think lookup tables are usable in this scenario either, so I ignored the fourth suggestion. The input coordinates' bounds aren't known, so I ignored the first suggestion too.

<span id="optimized-ternary"></span>

But the second suggestion, to use ternary operators instead of function calls, seemed reasonable. I implemented it like this:

```javascript [{headerless}]
const upperLimit = (1 - Number.EPSILON);

// Negative UV coordinates flip the texture.
u = ((u < 0)? (upperLimit + u) : u);
v = ((v < 0)? (upperLimit + v) : v);

u = (textureMipLevel.width * ((u < 0)? 0 : (u > upperLimit)? upperLimit : u));
v = (textureMipLevel.height * ((v < 0)? 0 : (v > upperLimit)? upperLimit : v));
```

It gave a 10% speedup in a typical rendering scenario.

I asked GPT whether it could speed up that new ternary code. It had some concerns about readability and suggested this: 

> GPT-3.5 Default
```javascript
const upperLimit = 1 - Number.EPSILON;
const width = textureMipLevel.width;
const height = textureMipLevel.height;

if (u < 0) {
    u += upperLimit;
}
if (v < 0) {
    v += upperLimit;
}

if (u > upperLimit) {
    u = upperLimit;
}
if (v > upperLimit) {
    v = upperLimit;
}

u *= width;
v *= height;
```

I wouldn't outright agree that this is more readable, but in any case the performance is slightly worse, which isn't a good tradeoff in a render loop.

Going back to the ternary code, I asked GPT to reduce the number of comparisons in it without resorting to function calls. Here's what it offered:

> GPT-3.5 Default
```javascript
// Negative UV coordinates flip the texture.
const flipU = (u < 0);
const flipV = (v < 0);
u += flipU ? upperLimit : 0;
v += flipV ? upperLimit : 0;

u = (u > upperLimit) * upperLimit + (u > 0 && u <= upperLimit) * u;
v = (v > upperLimit) * upperLimit + (v > 0 && v <= upperLimit) * v;

u *= textureMipLevel.width * (u >= 0);
v *= textureMipLevel.height * (v >= 0);
```

It's an interesting mutation, and at least superficially produces correct output, but runs quite a bit slower.

I told GPT to ask me any questions that might help it do the job. Here's what it had on its mind:

> GPT-3.5 Default
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
What are the possible ranges of the input parameters u and v? Are they always within the range [0, 1]?

What is the context or purpose of this code? Is it part of a larger function or program, and how is it being used?

Is the textureMipLevel object static or dynamic? Does it change frequently, or is it a constant value that can be precomputed?

Is the code being executed in a performance-critical section of the program? If so, is there a trade-off between run-time complexity and code readability or maintainability?

Are there any specific constraints on the output values of u and v? For example, do they need to be integers or floating-point numbers?
```

Answering some of them didn't improve the output in a significant way. GPT did at one point say that the ternary code was quite tight already, so we may have reached the limit here.

While messing around with the prompts some more, I got the feeling that taking a more conversational approach resulted in better output &ndash; although still nothing faster than the ternary code. I'd first give GPT the code snippet and ask it to summarize it, then ask whether it had any questions about the code and whether the code seemed appropriate for the task, then have it suggest performance improvements, etc. The resulting code output looked cleaner; for example:

> GPT-3.5 Default
```javascript
const upperLimit = (1 - Number.EPSILON);

// Negative UV coordinates flip the texture.
u += (u < 0) ? upperLimit : 0;
v += (v < 0) ? upperLimit : 0;

// Clamp UV coordinates to the appropriate range.
u = (u < 0) ? 0 : (u > upperLimit) ? upperLimit : u;
v = (v < 0) ? 0 : (v > upperLimit) ? upperLimit : v;

// Map UV coordinates into texel space.
u = textureMipLevel.width * u;
v = textureMipLevel.height * v;
```

### GPT-3.5 Legacy

> GPT-3.5 Legacy
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
Here are some ways to optimize the clamped UV coordinate calculation:

1. Precompute values: You can precompute the value of upperLimit and 1 - Number.EPSILON outside of the function and store it as a constant, so that it does not have to be recomputed every time the function is called.

2. Remove unnecessary calculations: The calls to Math.abs can be omitted as you are only using the absolute value to clamp the u and v values.

3. Bitwise operations: Instead of using Math.sign, you can use a faster bitwise operation to determine the sign of u and v.

4. Combine operations: You can combine multiple operations into one, for example, you can use the Math.max function to clamp and negate u and v in one step.

5. Replace if statements: You can replace the if statements with ternary operators, which are faster and more concise.

Here's an optimized version of the code:

const upperLimit = 1 - Number.EPSILON;
u = u < 0 ? upperLimit + u : Math.min(u, upperLimit);
v = v < 0 ? upperLimit + v : Math.min(v, upperLimit);
u *= textureMipLevel.width;
v *= textureMipLevel.height;
```

This time GPT went straight to offering a fast ternary version, but one that fails to correctly clamp negative input values to 0 like the original code does (for example, an input of -1.5 should map to 0 and not -0.5).

I asked it whether it could reduce the number of comparisons in <a href="#optimized-ternary">the optimized ternary code</a>. It took a shot:

> GPT-3.5 Legacy
```javascript
const upperLimit = (1 - Number.EPSILON);

u = (u < 0) ? (upperLimit + u) : ((u > upperLimit) ? upperLimit : u);
v = (v < 0) ? (upperLimit + v) : ((v > upperLimit) ? upperLimit : v);

u = textureMipLevel.width * u;
v = textureMipLevel.height * v;
```

Fewer comparisons, but same problem of negative input not being clamped correctly.

Asking GPT whether it had any questions for me to help it solve the problem produced this answer:

> GPT-3.5 Legacy
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
As an AI language model, I don't have personal experiences or emotions. However, in order to better optimize this code, it would be helpful to know more about the context in which it is being used. For example:

- What is the expected input range for u and v?
- What is the purpose of the code and what are the performance requirements?
- Are there any constraints on the use of function calls or bitwise operations?
- Is this code part of a larger system or program, and if so, what is the overall performance profile of the system or program?

Answering these questions could provide more information about the problem and help me provide a more targeted optimization.
```

I attempted to explain how inputs are expected to map to outputs, but the AI wasn't able to produce code that would've both done it correctly and performed better than the original ternary code.

### GPT-4

> GPT-4
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
To speed up the clamped UV coordinate calculation in your rasterizer, consider the following optimizations:

1. Remove the usage of Math.sign():
Instead of using Math.sign() and checking for -1, you can use a conditional (ternary) operator to achieve the same effect. This will save some function calls and potentially improve performance.

2. Use bitwise operators:
Bitwise operators might be faster than using Math.max() and Math.min() functions. In this case, you can use the ternary operator and bitwise OR to clamp the values between 0 and upperLimit.

Here's the updated code:

const upperLimit = (1 - Number.EPSILON);

// Clamp and flip texture coordinates
u = ((u < 0) ? (upperLimit - Math.abs(u)) : u) | 0;
v = ((v < 0) ? (upperLimit - Math.abs(v)) : v) | 0;

// Clamp to the range of 0 to upperLimit
u = (u < 0) ? 0 : ((u > upperLimit) ? upperLimit : u);
v = (v < 0) ? 0 : ((v > upperLimit) ? upperLimit : v);

u *= textureMipLevel.width;
v *= textureMipLevel.height;

These optimizations should help to speed up the clamped UV coordinate calculation in your rasterizer. Keep in mind that the performance gains may vary depending on the JavaScript engine and the specific hardware the code is running on. It's always a good idea to profile your code and measure the performance improvements.
```

The answer sounds authoritative, the code is comparable in performance to <a href="#optimized-ternary">the previous optimized ternary code</a>, and the output clamping is technically correct. The use of bitwise | breaks the output, but telling GPT that both the input and output values are floating-point gets it to patch it:

> GPT-4
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
My apologies for the confusion. In that case, let's revert the use of bitwise operators and modify the code as follows:

const upperLimit = (1 - Number.EPSILON);

// Clamp and flip texture coordinates
u = (u < 0) ? (upperLimit - Math.abs(u)) : u;
v = (v < 0) ? (upperLimit - Math.abs(v)) : v;

// Clamp to the range of 0 to upperLimit
u = (u < 0) ? 0 : ((u > upperLimit) ? upperLimit : u);
v = (v < 0) ? 0 : ((v > upperLimit) ? upperLimit : v);

u *= textureMipLevel.width;
v *= textureMipLevel.height;

The above code removes the Math.sign() usage and simplifies the process of clamping and flipping the texture coordinates using the ternary operator.
```

Seems to be working, has good performance, and there was no faffing about in getting the AI to produce it (it was told nothing about the input format at first, so we can overlook the bitwise operation). I prefer the earlier hand-written ternary version for clarity, but still.

As before, I asked GPT to attempt to reduce the number of comparisons in the original optimized ternary code, underlining that the code is performance-critical. Here's the response:

> GPT-4
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
To reduce the number of comparisons in this performance-critical code, you can use the Math.min() and Math.max() functions. Here's a revised version of the code with fewer comparisons:

const upperLimit = (1 - Number.EPSILON);

// Negative UV coordinates flip the texture.
u = (u < 0) ? (upperLimit + u) : u;
v = (v < 0) ? (upperLimit + v) : v;

u = textureMipLevel.width * Math.min(Math.max(u, 0), upperLimit);
v = textureMipLevel.height * Math.min(Math.max(v, 0), upperLimit);

This version of the code reduces the number of comparisons and should be more efficient for performance-critical scenarios.
```

Although the code now uses function calls, it performs similarly to the original code; and again deals correctly with negative input values.

## Rasterization loop

> <i>"Suggest high-level changes to this JavaScript rasterization loop to improve its performance:"</i>

> Input code
```javascript
for (let y = ngonStartY; y < ngonEndY; y++)
{
    const spanStartX = Math.min(pixelBufferWidth, Math.max(0, Math.round(leftEdge.start.x)));
    const spanEndX = Math.min(pixelBufferWidth, Math.max(0, Math.ceil(rightEdge.start.x)));
    const spanWidth = ((spanEndX - spanStartX) + 1);

    if (spanWidth > 0)
    {
        const deltaDepth = ((rightEdge.start.depth - leftEdge.start.depth) / spanWidth);
        let iplDepth = (leftEdge.start.depth - deltaDepth);

        const deltaShade = ((rightEdge.start.shade - leftEdge.start.shade) / spanWidth);
        let iplShade = (leftEdge.start.shade - deltaShade);

        const deltaU = ((rightEdge.start.u - leftEdge.start.u) / spanWidth);
        let iplU = (leftEdge.start.u - deltaU);

        const deltaV = ((rightEdge.start.v - leftEdge.start.v) / spanWidth);
        let iplV = (leftEdge.start.v - deltaV);

        const deltaInvW = ((rightEdge.start.invW - leftEdge.start.invW) / spanWidth);
        let iplInvW = (leftEdge.start.invW - deltaInvW);

        let pixelBufferIdx = ((spanStartX + y * pixelBufferWidth) - 1);

        for (let x = spanStartX; x < spanEndX; x++)
        {
            // Update values that're interpolated horizontally along the span.
            {
                iplDepth += deltaDepth;
                iplShade += deltaShade;
                iplU += deltaU;
                iplV += deltaV;
                iplInvW += deltaInvW;
                pixelBufferIdx++;
            }

            const depth = (iplDepth / iplInvW);
            if (depthBuffer[pixelBufferIdx] <= depth)
            {
                continue;
            }

            // Compute texture UV coordinates.
            let u = (iplU / iplInvW);
            let v = (iplV / iplInvW);
            switch (material.uvWrapping)
            {
                case "clamp":
                {
                    const upperLimit = (1 - Number.EPSILON);

                    // Negative UV coordinates flip the texture.
                    u = ((u < 0)? (upperLimit + u) : u);
                    v = ((v < 0)? (upperLimit + v) : v);
                    
                    u = (textureMipLevel.width * ((u < 0)? 0 : (u > upperLimit)? upperLimit : u));
                    v = (textureMipLevel.height * ((v < 0)? 0 : (v > upperLimit)? upperLimit : v));

                    break;
                }
                case "repeat":
                {
                    u = (textureMipLevel.width * (u - Math.floor(u)));
                    v = (textureMipLevel.height * (v - Math.floor(v)));

                    // Modulo for power-of-two. This will also flip the texture for
                    // negative UV coordinates.
                    u = (u & (textureMipLevel.width - 1));
                    v = (v & (textureMipLevel.height - 1));

                    break;
                }
                default: Rngon.$throw("Unrecognized UV wrapping mode."); break;
            }

            const texel = textureMipLevel.pixels[(~~u) + (~~v) * textureMipLevel.width];
            
            // Gracefully handle attempts to access the texture out of bounds.
            if (!texel)
            {
                continue;
            }

            // Draw the pixel.
            {
                if (usePalette)
                {
                    pixelBufferClamped8[pixelBufferIdx] = texel.color.index;
                }
                else
                {
                    const shade = (material.renderVertexShade? iplShade : 1);
                    const red   = (texel.red   * shade);
                    const green = (texel.green * shade);
                    const blue  = (texel.blue  * shade);

                    // If shade is > 1, the color values may exceed 255, in which case we write into
                    // the clamped 8-bit view to get 'free' clamping.
                    if (shade > 1)
                    {
                        const idx = (pixelBufferIdx * 4);
                        pixelBufferClamped8[idx+0] = red;
                        pixelBufferClamped8[idx+1] = green;
                        pixelBufferClamped8[idx+2] = blue;
                        pixelBufferClamped8[idx+3] = 255;
                    }
                    else
                    {
                        pixelBuffer32[pixelBufferIdx] = (
                            (255 << 24) +
                            (blue << 16) +
                            (green << 8) +
                            red
                        );
                    }
                }

                depthBuffer[pixelBufferIdx] = depth;
            }
        }
    }

    // Update values that're interpolated vertically along the edges.
    {
        leftEdge.start.x      += leftEdge.delta.x;
        leftEdge.start.depth  += leftEdge.delta.depth;
        leftEdge.start.shade  += leftEdge.delta.shade;
        leftEdge.start.u      += leftEdge.delta.u;
        leftEdge.start.v      += leftEdge.delta.v;
        leftEdge.start.invW   += leftEdge.delta.invW;

        rightEdge.start.x     += rightEdge.delta.x;
        rightEdge.start.depth += rightEdge.delta.depth;
        rightEdge.start.shade += rightEdge.delta.shade;
        rightEdge.start.u     += rightEdge.delta.u;
        rightEdge.start.v     += rightEdge.delta.v;
        rightEdge.start.invW  += rightEdge.delta.invW;
    }

    // We can move onto the next edge when we're at the end of the current one.
    if (y === (leftEdge.bottom - 1)) leftEdge = leftEdges[++curLeftEdgeIdx];
    if (y === (rightEdge.bottom - 1)) rightEdge = rightEdges[++curRightEdgeIdx];
}
```

### GPT-3.5 Default

> GPT-3.5 Default
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
There are a few ways to improve the performance of this rasterization loop. Here are some high-level changes that could be made:

1. Use TypedArrays: Instead of using regular arrays for the pixelBuffer, depthBuffer, and pixelBufferClamped8, use TypedArrays like Uint32Array, Float32Array, and Uint8ClampedArray. TypedArrays are more performant than regular arrays, especially for large arrays.

2. Avoid redundant calculations: The spanWidth calculation can be moved outside the y-loop since it does not depend on y. Additionally, the upperLimit variable for the "clamp" UV wrapping mode calculation can be calculated outside the x-loop, as it does not depend on x.

3. Minimize function calls: Math.min, Math.max, and Math.round are expensive operations. You could try to find alternative ways to perform these operations without calling the Math library, such as using conditional statements.

4. Cache variables: Instead of recomputing the same values repeatedly, cache them in variables outside the loop. For example, the deltaDepth, deltaShade, deltaU, deltaV, deltaInvW, and iplInvW variables could be computed outside the loop.

5. Use loops that are more optimized for the hardware: Use a while loop instead of a for loop if possible, since while loops can be optimized better by modern processors.

6. Avoid branching: Branching can be expensive, especially if the branch is frequently taken. Instead of using if statements, try to use bitwise operators or conditional statements where possible to avoid branching.
```

The suggestion to use *while* instead of *for* is interesting. I would've thought there isn't a meaningful difference after browser optimizations; and a quick googling gave me a mixed impression as to which is better or whether it matters at all. But converting the loops gave a 5% speedup in Google Chrome.

On the other hand, GPT seemed generally confused about the cacheability of variables, as the ones it suggests to pre-compute are fairly clearly dependent on the loop body. Similar situation with TypedArrays, as these were already being used in the code but GPT wasn't able to infer it.

Overall, the suggestions are fairly generic best-practice stuff, valid in their own right but not super relevant to this particular code. The output would probably have been more relevant if I'd provided more background, but the AI was also struggling to keep the original code in its memory, so I didn't push it.

### GPT-3.5 Legacy

> GPT-3.5 Legacy
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
Here are a few suggestions that could improve the performance of this JavaScript rasterization loop:

1. Use integer-based computation: The code performs floating-point computation, which is slower than integer computation. Whenever possible, use integer-based computation. For example, you could round values to the nearest integer before use.

2. Avoid conditional statements in the inner loop: The inner loop has several conditional statements, which can slow down the code. Try to find a way to avoid these conditional statements or move them outside the inner loop.

3. Avoid unnecessary computations: The code recomputes values that don't change between iterations of the inner loop. Try to avoid computing these values in each iteration.

4. Use a bitwise operator instead of Math.floor: The code uses Math.floor in several places to round down to the nearest integer. You can use the bitwise operator | 0 instead, which is faster.

5. Use precomputed values: The code recomputes values such as upperLimit, textureMipLevel.width - 1, and 255 in each iteration. You can precompute these values and use the precomputed values in the loop.
```

I asked for examples of the first suggestion, and was recommended this change:

<x-diff>
    - Math.ceil(rightEdge.start.x)\
    + (rightEdge.start.x + 0.5) | 0)
</x-diff>

It's not exactly what the suggestion was about, but in the ballpark. I asked for another example and got this nonsensical one, presumably as the AI's memory was fading:

<x-diff>
    - iplDepth += deltaDepth;\
    + iplDepth = ((iplDepth + deltaDepth) * 100000) / 100000;
</x-diff>

The rest of the suggestions were again fairly general best-practice stuff and not highly relevant to the input code. Since the suggestion to replace *for* with *while* didn't come up, it might've been beneficial to ask GPT to list some more suggestions, or to list the most relevant ones first.

### GPT-4

> GPT-4
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
Here are some high-level suggestions to improve the performance of the given rasterization loop:

1. Cache frequently used values:
Cache frequently used and unchanged values outside the loops to avoid redundant calculations.

2. Reduce conditions and branching:
Minimize conditions and branching inside the inner loop to reduce the number of instructions executed.

3. Optimize texture coordinate calculations:
Move texture coordinate calculations and related switch cases out of the loop, where possible, to reduce the complexity of the inner loop.
```

Still not that useful, as the suggestions generally require adding function calls, which tanks performance. For example, here's GPT's implementation for the second suggestion:

> GPT-4
```javascript
function applyClampWrapping() {
    // ...
    // Compute texture UV coordinates.
    // ...
    // Clamp wrapping specific code
    // ...
}

function applyRepeatWrapping() {
    // ...
    // Compute texture UV coordinates.
    // ...
    // Repeat wrapping specific code
    // ...
}

for (let y = ngonStartY; y < ngonEndY; y++) {
    // ...
    // Other code
    // ...

    if (material.uvWrapping === "clamp") {
        for (let x = spanStartX; x < spanEndX; x++) {
            // ...
            applyClampWrapping();
            // ...
        }
    } else if (material.uvWrapping === "repeat") {
        for (let x = spanStartX; x < spanEndX; x++) {
            // ...
            applyRepeatWrapping();
            // ...
        }
    } else {
        Rngon.$throw("Unrecognized UV wrapping mode.");
    }

    // ...
    // Other code
    // ...
}
```

Breaking the functionality into separate functions is better for readability etc., but it also runs about 40% slower compared to the original code.

Asking the AI to suggest something without needing additional function calls resulted in this:

> GPT-4
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
To improve the performance of this JavaScript rasterization loop without adding function calls, we can do the following high-level changes:

1. Hoist constant expressions out of the loop:
Move any expressions that don't change during the loop iterations outside of the loop. This can reduce redundant calculations.

2. Cache array lengths:
Cache the lengths of arrays used in the loop to reduce the overhead of repeatedly accessing them.

3. Use bitwise operations:
Replace division, modulo, and rounding operations with bitwise operations when possible, as they are generally faster.
```

These seem to me more in the realm of micro-optimizations than high-level refactoring. In any case, I asked GPT to implement the second suggestion, which got it to admit a secret:

> GPT-4
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
The original code doesn't have any array lengths used directly in the loop. However, I'll provide an example of caching array lengths in a generic loop to demonstrate the concept ...
```

In other words, it's a suggestion not relevant to the input code, but could be relevant in educating the reader. (Caching array lengths in this case meant assigning the value of *Array.length* to a variable and using the variable in the loop comparator. Though this kind of thing could improve performance, I remember seeing mixed results when I've tried it in the past.)

## BVH creation

> <i>"This TypeScript code creates a bounding volume hierarchy from a mesh of triangles, for ray tracing. Suggest some ways to speed up the creation of the BVH, then some ways to improve the quality of the BVH for better render performance."</i>

> Input code
```typescript
// An AABB encompassing the entire scene and from which further splits are made.
const baseAABB: AABB = Wray.aabb(scene, false);

// How many splits we're allowed to do, at most, before declaring a leaf node and stopping.
const maxDepth: number = 30;

// A split must have at most this many triangles in it to be eligible to act as a leaf.
const minNumTris: number = 3;

// Recursively split the mesh into smaller and smaller AABBs.
(function split(parentAABB: AABB, mesh: Triangle[], depth: number = 0): void
{
    if (parentAABB.isLeaf) return;

    // Split the AABB into two new AABBs (termed left/right, here, though the split could
    // be along one of a number of axes).
    {
        // Decide on which axis to split on.
        const axesAvailable: string[] = ["x", "y", "z"];
        const splitAxis: string = axesAvailable[depth % axesAvailable.length];
        const leftMin: Vector3 = parentAABB.min;
        const leftMax: Vector3 = (():Vector3=> // Propose random split positions along the chosen axis and use the one that has the lowest cost.
        {
            const numSplits: number = 5;
            const costNodeIntersection: number = 1;
            const costTriangleIntersection: number = 5;

            let leftMax: Vector3 = parentAABB.max;
            let lowestSplitCost: number = Infinity;

            for (let i = 0; i < numSplits; i++)
            {
                // @ts-ignore: Allow indexing into the AABB's Vector3 interface with [string].
                const proposedSplitStart: number = (parentAABB.min[splitAxis] + ((parentAABB.max[splitAxis] - parentAABB.min[splitAxis]) * Math.random()));
                const proposedLeftMin: Vector3 = parentAABB.min;
                const proposedLeftMax: Vector3 = (():Vector3=>
                {
                    switch (splitAxis)
                    {
                        case "x": return Wray.vector3(proposedSplitStart, parentAABB.max.y, parentAABB.max.z);
                        case "y": return Wray.vector3(parentAABB.max.x, proposedSplitStart, parentAABB.max.z);
                        case "z": return Wray.vector3(parentAABB.max.x, parentAABB.max.y, proposedSplitStart);
                        default: Wray.assert(false, "Unknown BVH split direction."); return Wray.vector3(0, 0, 0);
                    }
                })();

                const leftMesh: Triangle[] = mesh.filter(triangle=>is_triangle_fully_inside_box(triangle, proposedLeftMin, proposedLeftMax));
                const rightMesh: Triangle[] = mesh.filter(triangle=>!is_triangle_fully_inside_box(triangle, proposedLeftMin, proposedLeftMax));
    
                const costOfSplit: number = (
                    costNodeIntersection +
                    (Wray.aabb(leftMesh).volume() * leftMesh.length * costTriangleIntersection) +
                    (Wray.aabb(rightMesh).volume() * rightMesh.length * costTriangleIntersection)
                );

                if (costOfSplit < lowestSplitCost)
                {
                    lowestSplitCost = costOfSplit;
                    leftMax = proposedLeftMax;
                }
            }

            return leftMax;
        })();

        // Distribute the parent AABB's triangles between the two new AABBs that the parent was split into.
        const leftMesh: Triangle[] = mesh.filter(triangle=>is_triangle_fully_inside_box(triangle, leftMin, leftMax));
        const rightMesh: Triangle[] = mesh.filter(triangle=>!is_triangle_fully_inside_box(triangle, leftMin, leftMax));
        Wray.assert((leftMesh.length + rightMesh.length === mesh.length),
                    "Triangles have gone missing during BVH splitting.");

        // Recurse to split each of the two new AABBs further into two more, etc.
        parentAABB.mutable.left = Wray.aabb(leftMesh, Boolean(((depth + 1) >= maxDepth) || (leftMesh.length <= minNumTris)));
        parentAABB.mutable.right = Wray.aabb(rightMesh, Boolean(((depth + 1) >= maxDepth) || (rightMesh.length <= minNumTris)));
        split(parentAABB.mutable.left, leftMesh, depth + 1);
        split(parentAABB.mutable.right, rightMesh, depth + 1);

        function is_triangle_fully_inside_box(
            triangle: Triangle,
            min: Vector3,
            max: Vector3
        ): boolean
        {
            return triangle.vertices.every(vertex=>
            {
                return Boolean(vertex.x >= min.x && vertex.x <= max.x &&
                               vertex.y >= min.y && vertex.y <= max.y &&
                               vertex.z >= min.z && vertex.z <= max.z);
            });
        };
    }
})(baseAABB, scene, 1);
```

### GPT-3.5 Legacy

> GPT-3.5 Legacy
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
To speed up the creation of the BVH:

1. Use a smarter splitting strategy: Instead of randomly choosing a split axis and split position, you could use a more sophisticated heuristic to choose the split axis and position that minimizes the cost of intersecting triangles.

2. Parallelize the construction: You could parallelize the construction of the BVH by splitting the mesh into smaller chunks and building the BVH for each chunk concurrently.

3. Reuse memory allocation: You could avoid repeated memory allocation by reusing memory for new nodes rather than allocating new memory for each node.

To improve the quality of the BVH for better render performance:

1. Use a more sophisticated cost function: The current cost function used to choose the split axis and position is simple and may not always produce the best BVH. You could use a more sophisticated cost function that takes into account factors such as the number of triangles, the volume of the AABB, and the distribution of triangles within the AABB.

2. Avoid degenerate nodes: If a node has a very small volume compared to the number of triangles it contains, it may cause performance issues during the ray tracing process. You could add a check to avoid creating such nodes or to merge them with their parent node.

3. Balance the tree: An unbalanced BVH can cause performance issues during the ray tracing process. You could use techniques such as SAH (Surface Area Heuristics) or LBVH (Linear Bounding Volume Hierarchy) to balance the tree.
```

Parallelizing the construction seems like a good idea if it's technically possible with a BVH, though I won't be trying it here. Good point about the reusability of some of the buffers as well.

I asked it to show an example of one of those smarter splitting strategies. It said:

> GPT-3.5 Legacy
```typescript
// A smarter splitting strategy could be to choose the split axis and position
// that maximizes the difference in the number of triangles in each of the
// resulting child nodes. This would ensure that the child nodes have a more
// even distribution of triangles, which can result in better performance during
// the ray tracing process.
//
// Here's an implementation of this strategy:

// Decide on which axis to split on.
const axesAvailable: string[] = ["x", "y", "z"];
const splitAxis: string = axesAvailable[depth % axesAvailable.length];

let bestSplitStart: number = (parentAABB.min[splitAxis] + parentAABB.max[splitAxis]) / 2;
let bestLeftMesh: Triangle[] = [];
let bestRightMesh: Triangle[] = [];
let bestDifference: number = 0;

const numSplits: number = 5;
const splitRange: number = (parentAABB.max[splitAxis] - parentAABB.min[splitAxis]) / numSplits;
for (let i = 0; i < numSplits; i++) {
    const splitStart: number = parentAABB.min[splitAxis] + i * splitRange;
    const leftMin: Vector3 = parentAABB.min;
    const leftMax: Vector3 = (():Vector3=>
    {
        switch (splitAxis)
        {
            case "x": return Wray.vector3(splitStart, parentAABB.max.y, parentAABB.max.z);
            case "y": return Wray.vector3(parentAABB.max.x, splitStart, parentAABB.max.z);
            case "z": return Wray.vector3(parentAABB.max.x, parentAABB.max.y, splitStart);
            default: Wray.assert(false, "Unknown BVH split direction."); return Wray.vector3(0, 0, 0);
        }
    })();

    const leftMesh: Triangle[] = mesh.filter(triangle=>is_triangle_fully_inside_box(triangle, leftMin, leftMax));
    const rightMesh: Triangle[] = mesh.filter(triangle=>!is_triangle_fully_inside_box(triangle, leftMin, leftMax));

    const difference: number = Math.abs(leftMesh.length - rightMesh.length);
    if (difference > bestDifference) {
        bestSplitStart = splitStart;
        bestLeftMesh = leftMesh;
        bestRightMesh = rightMesh;
        bestDifference = difference;
    }
}

const leftMin: Vector3 = parentAABB.min;
const leftMax: Vector3 = (():Vector3=>
{
    switch (splitAxis)
    {
        case "x": return Wray.vector3(bestSplitStart, parentAABB.max.y, parentAABB.max.z);
        case "y": return Wray.vector3(parentAABB.max.x, bestSplitStart, parentAABB.max.z);
        case "z": return Wray.vector3(parentAABB.max.x, parentAABB.max.y, bestSplitStart);
        default: Wray.assert(false, "Unknown BVH split direction."); return Wray.vector3(0, 0, 0);
    }
})();

parentAABB.mutable.left = Wray.aabb(bestLeftMesh, Boolean(((depth + 1) >= maxDepth) || (bestLeftMesh.length <= minNumTris)));
parentAABB.mutable.right = Wray.aabb(bestRightMesh, Boolean(((depth + 1) >= maxDepth) || (bestRightMesh.length <= minNumTris)));
split(parentAABB.mutable.left, bestLeftMesh, depth + 1);
split(parentAABB.mutable.right, bestRightMesh, depth + 1);
```

Besides the *leftMin* and *leftMax* variables being unused and the code requiring additional *@ts-ignore* in a few places to allow "[splitAxis]" indexing without TypeScript build errors, BVH construction time is more or less unchanged and render performance is about 100 times worse.

I also asked for an example of a more sophisticated cost function:

> GPT-3.5 Legacy
```typescript
// A more sophisticated cost function could take into account factors such as the
// number of triangles, the volume of the AABB, and the distribution of triangles
// within the AABB. For example, you could use the SAH (Surface Area Heuristics)
// cost function, which assigns a cost to each node based on its surface area and
// the number of triangles it contains. The cost function would choose the split
// axis and position that minimizes the total cost of the child nodes.
//
// Here's an implementation of the SAH cost function:

const costNodeIntersection: number = 1;
const costTriangleIntersection: number = 5;
const leftCost: number = Wray.aabb(leftMesh).surfaceArea() * costNodeIntersection + leftMesh.length * costTriangleIntersection;
const rightCost: number = Wray.aabb(rightMesh).surfaceArea() * costNodeIntersection + rightMesh.length * costTriangleIntersection;
const costOfSplit: number = leftCost + rightCost;
```

At least when using AABB volume instead of surface area, this code reduced render performance by about 10&times;. In any case, the original code already uses SAH as far as I know, which GPT doesn't seem to agree with.

### GPT-4

> GPT-4
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
To speed up the creation of the BVH:

1. Use a surface area heuristic (SAH) instead of a random split position. The SAH calculates the cost of splitting the AABB by considering the surface area of each child AABB, leading to more optimal splits.

2. Instead of filtering the mesh twice to create the left and right meshes, do it in a single pass by iterating over the triangles and using an if-else statement to push the triangle into the left or right mesh.

3. Optimize the is_triangle_fully_inside_box function by using early returns. Once you find a vertex that does not satisfy the condition, return false immediately.

4. Use a parallelized approach to perform the splitting in multiple threads. This can significantly speed up the process on systems with multiple cores.

To improve the quality of the BVH for better render performance:

1. Implement a more advanced splitting strategy like the "Median" or "SAH-Binned" methods. These strategies can create more balanced trees and reduce the traversal cost in the BVH.

2. Consider splitting the parent AABB into more than two child AABBs. This can lead to a higher quality BVH with better spatial partitioning.

3. Apply a spatial optimization technique like the "Spatial Splits" method, which allows splitting the space into regions that are not necessarily occupied by triangles. This can result in a better BVH structure and lower traversal costs.

4. Prune and collapse the BVH tree to remove unnecessary nodes and reduce the depth of the tree. This can be done by merging nodes with a small number of triangles or nodes with similar costs.

5. Implement a dynamic BVH update strategy for scenes with moving objects. This can improve render performance by adjusting the BVH to better fit the updated scene.
```

These suggestions appear to be more specific to the input code compared to GPT-3.5's response, and overall have an air of usefulness by comparison. That said, like GPT-3.5, GPT-4 doesn't think the original code uses SAH &ndash; this could be an AI parallel to an in-code comment ("Propose random split positions ...") being more confusing than useful.

I asked the AI for an example of a more advanced splitting strategy:

> GPT-4
```typescript
// The Surface Area Heuristic (SAH) calculates the cost of splitting an AABB at
// a certain position by considering the surface area of each child AABB. This
// approach tends to produce more optimal splits compared to random splits.
// Here's an example of how you could implement SAH in your code:

function findBestSplit(mesh: Triangle[], parentAABB: AABB): { leftMesh: Triangle[], rightMesh: Triangle[], splitPosition: number, splitAxis: string } {
    const numBins = 16;
    const costNodeIntersection = 1;
    const costTriangleIntersection = 5;
    let bestCost = Infinity;
    let bestSplitPosition = 0;
    let bestSplitAxis = 'x';
    let bestLeftMesh: Triangle[] = [];
    let bestRightMesh: Triangle[] = [];

    for (const axis of ['x', 'y', 'z']) {
        const bins: { count: number, aabb: AABB }[] = Array(numBins).fill({ count: 0, aabb: Wray.emptyAABB() });

        // Distribute triangles into bins
        for (const triangle of mesh) {
            const centroid = triangleCentroid(triangle);
            const t = (centroid[axis] - parentAABB.min[axis]) / (parentAABB.max[axis] - parentAABB.min[axis]);
            const binIndex = Math.min(Math.floor(t * numBins), numBins - 1);
            bins[binIndex].count++;
            bins[binIndex].aabb = Wray.aabbUnion(bins[binIndex].aabb, Wray.aabb(triangle));
        }

        // Evaluate cost for each split position
        for (let i = 1; i < numBins; i++) {
            const leftAABB = bins.slice(0, i).reduce((acc, bin) => Wray.aabbUnion(acc, bin.aabb), Wray.emptyAABB());
            const rightAABB = bins.slice(i).reduce((acc, bin) => Wray.aabbUnion(acc, bin.aabb), Wray.emptyAABB());
            const leftCount = bins.slice(0, i).reduce((acc, bin) => acc + bin.count, 0);
            const rightCount = bins.slice(i).reduce((acc, bin) => acc + bin.count, 0);

            const cost = costNodeIntersection + (leftAABB.surfaceArea() * leftCount + rightAABB.surfaceArea() * rightCount) * costTriangleIntersection;

            if (cost < bestCost) {
                bestCost = cost;
                bestSplitPosition = parentAABB.min[axis] + (parentAABB.max[axis] - parentAABB.min[axis]) * (i / numBins);
                bestSplitAxis = axis;
            }
        }
    }

    const leftMesh = mesh.filter(triangle => triangleCentroid(triangle)[bestSplitAxis] <= bestSplitPosition);
    const rightMesh = mesh.filter(triangle => triangleCentroid(triangle)[bestSplitAxis] > bestSplitPosition);

    return { leftMesh, rightMesh, splitPosition: bestSplitPosition, splitAxis: bestSplitAxis };
}

// The Wray.aabbUnion function computes the union of two AABBs (axis-aligned
// bounding boxes). The resulting AABB is the smallest AABB that encloses both
// input AABBs.
```

There are a few new, unimplemented functions, so I won't take the time right now to test it out.

For completeness, I asked GPT for an implementation of spatial splits as well &ndash; I won't test it right now, but you can have a gander:

> GPT-4
```typescript
// Spatial splits divide the space into regions that may not necessarily be
// occupied by triangles. This can result in a better BVH structure and lower
// traversal costs. Here's an example of a simple spatial split implementation:

function findSpatialSplit(mesh: Triangle[], parentAABB: AABB): { leftMesh: Triangle[], rightMesh: Triangle[], splitPosition: number, splitAxis: string } {
    const costNodeIntersection = 1;
    const costTriangleIntersection = 5;
    let bestCost = Infinity;
    let bestSplitPosition = 0;
    let bestSplitAxis = 'x';
    let bestLeftMesh: Triangle[] = [];
    let bestRightMesh: Triangle[] = [];

    for (const axis of ['x', 'y', 'z']) {
        const parentCenter = parentAABB.center();
        const splitPosition = parentCenter[axis];

        const leftAABB = Wray.aabb(parentAABB.min, { ...parentCenter, [axis]: splitPosition });
        const rightAABB = Wray.aabb({ ...parentCenter, [axis]: splitPosition }, parentAABB.max);

        const leftMesh = mesh.filter(triangle => triangleOverlapAABB(triangle, leftAABB));
        const rightMesh = mesh.filter(triangle => triangleOverlapAABB(triangle, rightAABB));

        const overlapCount = leftMesh.length + rightMesh.length - mesh.length;

        const cost = costNodeIntersection + (leftAABB.surfaceArea() * leftMesh.length + rightAABB.surfaceArea() * rightMesh.length - overlapCount * costTriangleIntersection);

        if (cost < bestCost) {
            bestCost = cost;
            bestSplitPosition = splitPosition;
            bestSplitAxis = axis;
            bestLeftMesh = leftMesh;
            bestRightMesh = rightMesh;
        }
    }

    return { leftMesh: bestLeftMesh, rightMesh: bestRightMesh, splitPosition: bestSplitPosition, splitAxis: bestSplitAxis };
}

// In this example, we use the center of the parent AABB as the spatial split
// position. You can also experiment with different split positions to further
// optimize the BVH structure.

// Please note that the `triangleOverlapAABB` function is not provided in this
// example. It should be a function that checks if a given triangle overlaps
// with a given AABB. You can implement this function using a triangle-box
// intersection test, which can be found in various geometry libraries or online
// resources.
```
