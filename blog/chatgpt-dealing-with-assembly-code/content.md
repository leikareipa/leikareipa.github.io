<post-date date="9 April 2023"/>

# ChatGPT dealing with assembly code

About a year ago, in the time before ChatGPT, I wrote a [blog post comparing the pixel-plotting performance of 386 assembly and JavaScript](/blog/comparing-pixel-plotting-performance-in-javascript-and-386-assembly/).

This time, let's look at whether ChatGPT &ndash; with GPT-3.5 and GPT-4 &ndash; can improve on the performance of the code from that post.

## Evaluate this assembly code

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

> GPT-3.5 Default
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

> GPT-3.5 Legacy
``` [{word-wrap}{no-line-numbers}{inline-class:gpt-response-text}]
This code is written in x86 assembly language for the Intel 386 architecture, and it performs a repetitive task of filling a buffer with a fixed 32-bit value.

The code first sets the value 100000 in the EBX register, which will be used as a loop counter. Then, the value 00100100_00100100_00100100_00100100b (which is equivalent to the hexadecimal value 0x00100100) is loaded into the EAX register, which will be the source operand for the "stosd" (Store String Doubleword) instruction.

The "fill" label marks the beginning of a loop that will repeat 100000 times. Inside the loop, the ECX register is set to the number of doublewords (4-byte values) in the buffer, which is calculated as (320 * 200) / 4. The DI register is then set to the address of the "buffer" data, which is declared later in the code.

The "rep stosd" instruction fills the buffer with the value in EAX. It repeats the "stosd" instruction until ECX reaches zero. The "dec ebx" instruction decrements the loop counter in EBX, and the "jnz fill" instruction jumps back to the "fill" label if EBX is not zero.

Finally, the "ret" instruction returns control to the caller.

As for performance improvements, here are some suggestions that could be considered while retaining compatibility with the 386 platform:

- Unrolling the loop: The loop in the code can be unrolled, meaning that the "stosd" instruction could be repeated multiple times within the loop body, reducing the overhead of loop control.

- Using a different fill value: The fill value used in the code is not optimal for the 386's cache architecture. By using a different fill value, the performance of the loop could be improved.

- Optimizing the "stosd" instruction: The "stosd" instruction could be optimized by using the "movsd" (Move String Doubleword) instruction or the "movsw" (Move String Word) instruction, depending on the alignment of the buffer.

- Using different register assignments: The choice of register assignments in the code is not optimal for the 386 architecture. By using different register assignments, the performance of the code could be improved.
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

Default's explanation is superficial. Its suggestions for optimization also sound fairly wonky: STOSQ isn't available in 386 assembly, and unrolling the REP STOSD here would likely perform worse.

Legacy's explanation is a bit less superficial than Default's, but its suggestions for optimization are about as unhelpful.

GPT-4 is the only model that figured out that the code deals with a pixel buffer. Its claim that a DWORD is 6 bytes is a bit odd though. I don't think its optimization suggestions are much better than the other two models', but it knows not to suggest features not available on the 386 platform.

## Optimize it

> <i>"Implement the performance improvements [that you suggested for the input code]"</i>

> GPT-3.5 Default
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

> GPT-3.5 Legacy
```x86asm [{inline-class:gpt-response}]
org 100h

mov ebx,100000
mov eax,0x00100100
fill:
    mov ecx,320
    mov edx,200
    fill_row:
        mov di,buffer
        mov esi,eax
        mov edi,di
        mov ecx,80
        rep stosd
        add di,320
        dec edx
        jnz fill_row
    dec ebx
    jnz fill
ret

align 4
buffer rb (320*200)
```

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

GPT-4 was also asked not to implement plotting to video memory, which had been among its suggestions but wasn't relevant for this particular test case.

<dokki-table headerless>
    <table>
        <tr>
            <th>Program version</th>
            <th>Performance (seconds to complete)</th>
        </tr>
        <tr>
            <td>Baseline</td>
            <td>3</td>
        </tr>
        <tr>
            <td>GPT-3.5 Default</td>
            <td class="bad">Code doesn't compile</td>
        </tr>
        <tr>
            <td>GPT-3.5 Legacy</td>
            <td class="bad">Code doesn't compile</td>
        </tr>
        <tr>
            <td>GPT-4</td>
            <td>8</td>
        </tr>
    </table>
</dokki-table>

## Make it into JavaScript

> <i>"Convert [the original] 386 assembly code into JavaScript with a view to the resulting program achieving the maximum possible throughput for its task."</i>

> Human
```javascript [{inline-class:gpt-response}]
for (let loops = 0; loops < 100000; loops++) {
    image.data.set([255, 0, 255, 255]); // Let's say this is the RGBA color for palette index #36.
    let copyLength = 4;
    while (copyLength < image.data.length) {
        image.data.copyWithin(copyLength, 0, copyLength);
        copyLength *= 2;
    }
}
```

> GPT-3.5 Default
```javascript [{inline-class:gpt-response}]
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

> GPT-3.5 Legacy
```javascript [{inline-class:gpt-response}]
const buffer = new ArrayBuffer(320 * 200);
const view = new DataView(buffer);

for (let i = 0; i < 100000; i++) {
    for (let j = 0; j < (320 * 200 / 4); j++) {
        view.setUint32(j * 4, 0x00100100);
    }
}
```

> GPT-4
```javascript [{inline-class:gpt-response}]
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

<dokki-table headerless>
    <table>
        <tr>
            <th>Program version</th>
            <th>Performance (milliseconds to complete)</th>
        </tr>
        <tr>
            <td>GPT-3.5 Default</td>
            <td>2805</td>
        </tr>
        <tr>
            <td>GPT-3.5 Legacy</td>
            <td class="bad">Incorrect output</td>
        </tr>
        <tr>
            <td>GPT-4</td>
            <td>2622</td>
        </tr>
        <tr>
            <td>Human</td>
            <td>380</td>
        </tr>
    </table>
</dokki-table>

I like Default's mix of JavaScript with assemblic syntax, but the model hasn't understood that the assembly code dealt with 8-bit pixels (palette indices) and so that the JavaScript equivalent would have 32-bit pixels (RGBA). The resulting code ends up completing only a quarter of the work (accounted for in the performance table).

Like Default, Legacy has the wrong loop size, resulting in only a quarter of the work being done. The code's output for that quarter is also incorrect.

GPT-4 has taken the reasonable approach of a 32-bit fill, but the performance is a few steps behind the human-made version still. That said, the AI wasn't explicitly given the benefit of iterating on the solution to find a better one, which the human had done. In a follow-up set of conversations, its code was able to match (but not exceed) the human-level performance in 2&ndash;4 iterative steps.
