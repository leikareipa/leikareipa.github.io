<post-date date="10 February 2024"/>

# Gemini Advanced dealing with assembly code

A while ago, I wrote a [comparison of ChatGPT models dealing with assembly code](/blog/chatgpt-dealing-with-assembly-code/). This time, let's look at how the assemblic realm gets on with the new Gemini Advanced.

Note that the results shown here for the GPT models are from April 2023, whereas the responses of Gemini Advanced were recorded on this date.

## Evaluate

> <i>"Describe what this 386 assembly code does, and point out (without sample code) possible performance improvements while retaining compatibility with the 386 platform."</i>
>
> ```x86asm [{headerless}]
> org 100h
> 
> mov ebx,100000
> mov eax,00100100_00100100_00100100_00100100b
> fill:
>     mov ecx,((320*200)/4)
>     mov di,buffer
>     rep stosd
>     dec ebx
>     jnz fill
> ret
> 
> align 4
> buffer rb (320*200)
> ```

> Human
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
The code loops 100000 times, each loop filling a 320 by 200 pixel buffer with the value 36 (00100100 in binary; an 8-bit palette index). The pixel buffer represents video memory in VGA mode 13h (320 x 200, 256 colors). The code has been optimized for performance by packing four copies of the color value into EAX and blasting the data into the destination buffer with REP STOSD.

I don't know of any further optimizations, but I assume they exist.
```

> GPT-4
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
This 386 assembly code is a simple program that fills a 320x200-pixel screen buffer with a specific 32-bit pattern, and repeats this operation 100,000 times.

Let's break down the code:

1. org 100h: Sets the origin address to 100h, which is a typical starting address for DOS .COM programs.

2. mov ebx,100000: Sets the register EBX to 100,000, which is the loop counter.

3. mov eax,00100100_00100100_00100100_00100100b: Sets the register EAX to a 32-bit binary pattern "00100100_00100100_00100100_00100100".

4. fill:: This is a label for the beginning of the loop.

5. mov ecx,((320*200)/4): Sets the register ECX to (320*200)/4, which is the number of DWORDs (double words, or 6-byte chunks) needed to cover the entire 320x200 buffer.

7. mov di,buffer: Sets the register DI to the address of the buffer.

8. rep stosd: This instruction fills ECX DWORDs in memory at ES:DI with the value in EAX. It repeats the STOSD instruction ECX times, decrementing ECX and incrementing DI by 4 with each iteration.

9. dec ebx: Decrements the loop counter (EBX) by 1.

10. jnz fill: Jumps back to the "fill" label if EBX is not zero (i.e., continues the loop).

11. ret: Returns from the program.

12. align 4: Aligns the following data to a 4-byte boundary.

13. buffer rb (320*200): Reserves (320*200) bytes of uninitialized memory for the buffer.

Possible performance improvements:

- Unroll the loop: Instead of using "rep stosd", you can unroll the loop to perform multiple "stosd" instructions per iteration. This reduces the loop overhead and can lead to better instruction cache utilization.

- Use pipelining and instruction pairing: Order the instructions in a way that takes advantage of the 386's instruction pairing capabilities to execute two instructions concurrently.

- Write to video memory directly: If the intention is to display the buffer on the screen, you can write the data directly to the video memory instead of using an intermediate buffer.

Remember that these suggestions are specific to retaining compatibility with the 386 platform. More modern processors have additional optimization techniques that would not be applicable to the 386.
```

> Gemini Advanced
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
Code Functionality

This code snippet performs a simple screen fill routine for what is likely a mode with 320x200 resolution and some form of chunky pixel layout. Here's what it does step-by-step:

Initialization

org 100h: Specifies the origin point for the program at memory address 100h (hexadecimal). This was typical for some DOS-era programs.

mov ebx, 100000: Loads the value 100000 (decimal) into the EBX register. We'll use this as a loop counter.

mov eax, 00100100_00100100_00100100_00100100b: Loads a 32-bit binary pattern into the EAX register. This represents the color or pattern to be filled.

Fill Loop (fill:)

mov ecx, ((320*200)/4): Calculates the number of 32-bit words (DWORDs) required to fill the screen buffer (320 pixels wide * 200 pixels tall / 4 bytes per DWORD). The loop will fill the screen multiple pixels at a time.

mov di, buffer: Sets the destination index register (DI) to the start of the 'buffer' memory area.

rep stosd: The "REP STOSD" instruction repeats the string store double-word. In each iteration, it puts the value in EAX to the memory location pointed to by DI, and increments DI by 4.

dec ebx: Decrements the counter in EBX.

jnz fill: Jump back to the 'fill' label if EBX is not zero.

Return and Data:

ret: Returns from the code (likely used when it's part of a subroutine).

align 4: Aligns the following 'buffer' declaration on a 4-byte boundary.

buffer rb (320*200): Reserves space for the 'buffer'. The size indicates that it holds the entire screen data 320 * 200 bytes).

Possible Performance Improvements

The following are performance improvement ideas without breaking 386 compatibility:

Unrolling the Loop: Consider partially unrolling the loop. Instead of performing a single stosd in each iteration, you could repeat it, say, four times within the loop to store four 'pixels' worth of data at once. This reduces loop overhead.

Using stosw (if data alignment allows): If the memory alignment of 'buffer' is guaranteed to be word-aligned (divisible by 2), you could use stosw to store 16-bit words at a time, increasing throughput (but the 32-bit pixel color would need to be restructured accordingly).

Larger Data Sizes: Depending on the graphics mode, if it's safe to assume a pixel takes more than a single byte, you could adjust the constant in EAX and use bigger store instructions (stosl or wider if supported by later 386 extensions).

Investigate Alternative Algorithms: Entirely different filling algorithms (e.g., line-drawing based) might be applicable depending on exactly what is meant by "chunky pixel layout."
Caveats

Before implementing these optimizations, you'll need to carefully consider the exact video mode, memory layouts, and the desired behaviour of the pixel filling to make sure such changes are permissible.

Let me know if you'd like me to elaborate on any of these optimization ideas with code examples!
```

> GPT-3.5
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
The given 386 assembly code initializes the buffer memory, represented by the label "buffer," with a value of 00100100_00100100_00100100_00100100b (repeated 320*200/4 times) using a loop.

Here is a more detailed breakdown of the code:

1. The "mov ebx, 100000" instruction sets the value of the EBX register to 100000.

2. The "mov eax, 00100100_00100100_00100100_00100100b" instruction sets the value of the EAX register to the binary value 00100100_00100100_00100100_00100100b.

3. The "mov ecx, ((320200)/4)" [sic] instruction calculates the number of double words (32-bit values) needed to fill the buffer with the specified value, which is 320200/4 [sic].

4. The "mov di, buffer" instruction sets the value of the DI register to the memory address of the buffer.

5. The "rep stosd" instruction uses the ECX register as a counter to repeatedly store the value in the EAX register at the memory address specified by the DI register, until the ECX register is decremented to 0.

6. The "dec ebx" instruction decrements the value of the EBX register by 1.

7. The "jnz fill" instruction jumps back to the "fill" label if the value of the EBX register is not zero.

8. The "ret" instruction returns control to the calling function.

To improve performance while retaining compatibility with the 386 platform, one possible optimization is to use a larger data transfer size in the "rep stosd" instruction. For example, the "rep stosq" instruction could be used to store quad words (64-bit values) instead of double words, reducing the number of iterations needed to fill the buffer. Additionally, a more efficient loop structure could be used, such as unrolling the loop to reduce the overhead of the loop control instructions. Finally, it may be possible to optimize the initialization value to reduce the number of instructions needed to set the buffer value.
```

Unlike GPT-3.5, both GPT-4 and Gemini Advanced managed to realize the code is a screen fill.

The suggestions by GPT-4 and Gemini Advanced for performance improvements aren't particularly useful, but unlike GPT-3.5, they at least know not to suggest features not available on the 386 platform.

## Optimize

> <i>"Implement the performance improvements [that you suggested for the input code]"</i>

> GPT-4
```x86asm [{inline-class:gpt-response}]
org 100h

mov ebx, 100000
mov eax, 00100100_00100100_00100100_00100100b
fill:
    mov ecx, ((320*200)/16) ; Adjust the loop count for unrolling
    mov di, buffer
    ; Unroll the loop 4 times
    unrolled_loop:
        stosd ; 1st DWORD
        stosd ; 2nd DWORD
        stosd ; 3rd DWORD
        stosd ; 4th DWORD
        sub ecx, 4 ; Decrement the loop counter by 4
        jnz unrolled_loop ; Continue the unrolled loop if ECX != 0
    dec ebx
    jnz fill
ret

align 4
buffer rb (320*200)
```

> Gemini Advanced
```x86asm [{inline-class:gpt-response}]
org 100h

mov ebx, 100000         ; Loop counter
mov eax, 00100100_00100100_00100100_00100100b  ; Color / pattern (32-bit)

fill:
    mov ecx, (320 * 200) / 4    ; Number of DWORDs to fill
    mov di, buffer

    ; Unrolled loop (4 pixels filled per iteration)            
    rep stosd              
    rep stosd                
    rep stosd             
    rep stosd           

    sub ecx, 4              ; Adjust loop counter 
    jnz fill

ret

align 4
buffer rb (320 * 200)       ; Screen buffer
```

> GPT-3.5
```x86asm [{inline-class:gpt-response}]
org 100h

mov ebx, 100000
mov eax, 00100100_00100100h
lea eax, [eax + eax65536] ; set eax to 00100100_00100100_00100100_00100100h
fill:
    mov ecx, ((320200)/8)
    mov edi, buffer
    cld ; clear the direction flag for stosq to increment destination address
    shr ecx, 2 ; divide by 4 to iterate over quad words instead of double words
    align 16 ; align the loop to a 16-byte boundary
    fill_loop:
        movntq [edi], eax ; use non-temporal store to bypass cache
        movntq [edi + 8], eax
        movntq [edi + 16], eax
        movntq [edi + 24], eax
        add edi, 32 ; increment by 4 quad words
        dec ecx
        jnz fill_loop
    sub edi, 8000h ; subtract 320*8 to go back to start of buffer
    dec ebx
    jnz fill
ret

align 4
buffer rb (320*200)
```

<dokki-table headerless>
    <table>
        <tr>
            <th>Program version</th>
            <th>Performance relative to human level</th>
        </tr>
        <tr>
            <td>GPT-4</td>
            <td>38%</td>
        </tr>
        <tr>
            <td>Gemini Advanced</td>
            <td>< 5%</td>
        </tr>
        <tr>
            <td>GPT-3.5</td>
            <td class="bad">Code doesn't compile</td>
        </tr>
    </table>
</dokki-table>

GPT-3.5 tried too hard and took itself out of the race with code that doesn't work. Both GPT-4 and Gemini Advanced decided to "unroll" a fast loop into slower code, but Gemini Advanced made it even slower.

## Convert into JavaScript

> <i>"Convert [the original] 386 assembly code into JavaScript with a view to the resulting program achieving the maximum possible throughput for its task."</i>

> Human
```javascript
for (let loops = 0; loops < 100000; loops++) {
    image.data.set([255, 0, 255, 255]); // Let's say this is the RGBA color for palette index #36.
    let copyLength = 4;
    while (copyLength < image.data.length) {
        image.data.copyWithin(copyLength, 0, copyLength);
        copyLength *= 2;
    }
}
```

> GPT-4
```javascript
const BUFFER_SIZE = 320 * 200;
const PATTERN = 0b00100100_00100100_00100100_00100100;

function fillBuffer(buffer, pattern, iterations) {
    for (let i = 0; i < iterations; i++) {
        buffer.fill(pattern);
    }
}

const buffer = new Uint32Array(BUFFER_SIZE);
fillBuffer(buffer, PATTERN, 100000);
```

> Gemini Advanced
```javascript
const screenWidth = 320;
const screenHeight = 200;
const fillColor = 0x12; // Example VGA color index (0x00 - 0xFF)

// Simulate a screen buffer (consider Typed Arrays for speed)
let buffer = new Uint8Array(screenWidth * screenHeight); 

// Optimized fill loop
for (let loops = 0; loops < 100000; loops++) {
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] = fillColor;
    }
}
```

> GPT-3.5
```javascript
const buffer32 = new Int32Array(buffer); // create a 32-bit integer view of the buffer
const fillValue = 0b00100100_00100100_00100100_00100100; // the fill value to be written to the buffer

let ebx = 100000;
while (ebx--) { // loop 100000 times
    const length = (320 * 200) / 4;
    const di = 0; // destination index (start at 0)
    for (let i = 0; i < length; i++) {
        buffer32[di + i] = fillValue; // write the fill value to each pixel in the buffer
    }
}
```

<dokki-table headerless>
    <table>
        <tr>
            <th>Program version</th>
            <th>Performance relative to human level</th>
        </tr>
        <tr>
            <td>GPT-4</td>
            <td>14%</td>
        </tr>
        <tr>
            <td>Gemini Advanced</td>
            <td class="bad">Incorrect output</td>
        </tr>
        <tr>
            <td>GPT-3.5</td>
            <td class="bad">Incorrect output</td>
        </tr>
    </table>
</dokki-table>

GPT-4 is the only model that understood that the original code deals with 8-bit palette indices, which need to be expanded into 32-bit RGBA values in the JavaScript version.

(Although not shown here, GPT-4 was able to match human-level performance after a few iterations of improvement.)

## Final notes

It's safe to say GPT-4 comes out on top in this test and is categorically better than the other two models, of which GPT-3.5 was fully out of its element and Gemini Advanced could've passed for an advanced version of GPT-3.5.

Where Gemini Advanced did best was in [explaining the code](#gemini-advanced-dealing-with-assembly-code-evaluate). You could argue whether it was GPT-4 or Gemini Advanced that gave the better explanation, but I'd say Gemini Advanced formatted its response better if nothing else (its original Markdown styling is lost here unfortunately).
