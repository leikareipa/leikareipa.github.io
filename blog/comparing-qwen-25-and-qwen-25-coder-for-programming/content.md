<post-date date="12 November 2024"/>

# Comparing Qwen 2.5 and Qwen 2.5 Coder for programming

As per [my previous tests](/blog/testing-open-and-closed-llms-some-more/), Qwen 2.5 shows strong promise as a capable local LLM for programming. On top of that, a specifically coding-oriented version, Qwen 2.5 Coder, is available. How does the coder variant compare to the original?

Here's a few tests using the 32-billion parameter versions of the two models, in Q5_K_M quantization flavor, running via Ollama.

## Disassemble into assembly

<x-prompt>
    <p>
        This array represents the bytes of an MS-DOS COM executable: [0x66, 0xbb, 0x06, 0x00, 0x00, 0x00, 0xb8, 0x05, 0x00, 0x66, 0x4b, 0x75, 0xfc, 0xcd, 0x20]. Disassemble the executable into x86 assembly code (FASM syntax). Don't use tools.
    </p>
</x-prompt>

> Qwen 2.5 &ndash; 1/3
``` [{no-line-numbers}{inline-class:model-response}]
; Load ebx with the value 6 (due to 16-bit operand size)
mov bx, 6

; Load eax with the value 5
mov eax, 5

; Decrement bx by one
dec bx

; Jump back if bx is not zero
jnz short loc_0x75

; Terminate program (int 0x20)
int 0x20
```

> Qwen 2.5 &ndash; 2/3
``` [{no-line-numbers}{inline-class:model-response}]
mov bx, 0x0006
mov ax, 0x0005
dec bx
jnz -4
int 0x20
```

> Qwen 2.5 &ndash; 3/3
``` [{no-line-numbers}{inline-class:model-response}]
org 100h

start:
    db 0x66                  ; Operand-size override prefix for 16-bit operation
    mov bx, 0x0006           ; Move 6 into BX
    db 0x00, 0x00            ; Filler bytes
    mov ax, 0x0005           ; Move 5 into AX
    db 0x66                  ; Operand-size override for 16-bit operation
loc_0x6:
    dec bx                   ; Decrement BX by 1
    jnz short loc_0x6        ; Jump if ZF=0, creating a loop
    int 0x20                ; Software interrupt 20h (usually to terminate program)

end start
```

> Qwen 2.5 Coder &ndash; 1/3
``` [{no-line-numbers}{inline-class:model-response}]
use32

section .text
    mov ebx, 6          ; Load the value 6 into EBX
loop_start:
    mov eax, 5          ; Load the value 5 into EAX
    dec ebx             ; Decrement the value in EBX
    jnz short loop_start; If ZF (Zero Flag) is not set, jump back to loop_start
    int 0x20            ; Call interrupt 0x20
```

> Qwen 2.5 Coder &ndash; 2/3
``` [{no-line-numbers}{inline-class:model-response}]
use32
org 100h

    mov ebx, 6      ; Move 6 into EBX register
    mov eax, 5      ; Move 5 into EAX register
loop_start:
    dec ebx         ; Decrement EBX by 1
    jnz loop_start  ; Jump back to the start of the loop if ZF is not set (i.e., EBX != 0)
    int 20h         ; Generate interrupt 20h for system call
```

> Qwen 2.5 Coder &ndash; 3/3
``` [{no-line-numbers}{inline-class:model-response}]
use16
org 100h

section .text
    mov ebx, 6          ; 0x66 bb 06 00 00 00
    mov eax, 5          ; 0xb8 05 00
loop_start:
    dec ebx             ; 0x66 4b
    jnz loop_start      ; 0x75 fc (relative offset -4)
    int 20h             ; 0xcd 20 (terminate program)
```

Both models understood the gist of the machine code. Qwen 2.5 Coder's versions are in my opinion more cleanly written and better commented, though the difference isn't massive.

Each model managed to output one version in valid FASM syntax, so a fairly low success rate in that regard. But the task is relatively difficult anyway.

## Add comments to C++ code

<x-prompt>
    <p>
        Add helpful comments to this code. The code renders an image of a heightmap by tracing rays through each pixel on the image plane.
    </p>

> Code
```cpp
unsigned y = 0;

for (; y < dstPixelmap.height(); y++)
{
    numVoxels += stepsTaken;

    const double screenPlaneY = ((2.0 * ((y + 0.5) / dstPixelmap.height()) - 1.0) * tanFov);

    ray_s ray;

    {
        const vond::vector3<double> view = (vond::vector3<double>{screenPlaneX, screenPlaneY, camera.zoom} * viewMatrix);

        ray.pos = camera.position;
        ray.dir = (view.normalized() * RAY_STEP_SIZE);
    }

    {
        if (stepsTaken == 0)
        {
            rayDepth = 0;
        }

        ray.pos += (ray.dir * rayDepth);
        stepsTaken = 0;
    }

    {
        if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
        {
            break;
        }

        for (; rayDepth < (MAX_RAY_LENGTH / RAY_STEP_SIZE); stepsTaken++)
        {
            double voxelHeight = heightmapSampler(ray.pos, camera.position).channel_at(0);

            if (voxelHeight >= ray.pos[1])
            {
                const vond::color<uint8_t, 4> groundColor = textureSampler(ray.pos, camera.position);

                if (!groundColor.channel_at(3))
                {
                    goto draw_sky;
                }

                const double depth = ray.pos.distance_to(camera.position);

                for (unsigned i = 0; i < PIXEL_WIDTH_MULTIPLIER; i++)
                {
                    dstPixelmap.pixel_at((x + i), (dstPixelmap.height() - y - 1)) = groundColor;
                    dstDepthmap.pixel_at((x + i), (dstDepthmap.height() - y - 1)) = {depth};
                }

                break;
            }

            const unsigned extraSteps = (rayDepth * RAY_SKIP_MULTIPLIER);
            ray.pos += (ray.dir * (extraSteps + 1));
            rayDepth += (extraSteps + 1);

            if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
            {
                goto draw_sky;
            }
        }
    }
}
```
</x-prompt>

> Qwen 2.5 &ndash; 1/2
``` [{no-line-numbers}{inline-class:model-response}]
// Initialize the row index to zero
unsigned y = 0;

for (; y < dstPixelmap.height(); y++)
{
    // Accumulate the total number of steps taken for all rays traced so far
    numVoxels += stepsTaken;

    // Compute the Y coordinate on the screen plane, normalized and scaled by the field-of-view (tanFov)
    const double screenPlaneY = ((2.0 * ((y + 0.5) / dstPixelmap.height()) - 1.0) * tanFov);

    // Initialize a ray object to trace through the scene
    ray_s ray;

    {
        // Calculate the view vector in world coordinates from the screen plane coordinates and apply the view matrix transformation
        const vond::vector3<double> view = (vond::vector3<double>{screenPlaneX, screenPlaneY, camera.zoom} * viewMatrix);

        // Set the starting position of the ray to the camera's position
        ray.pos = camera.position;
        
        // Calculate the direction vector of the ray and normalize it. Then scale by RAY_STEP_SIZE to get the step size in the right units.
        ray.dir = (view.normalized() * RAY_STEP_SIZE);
    }

    {
        // If no steps have been taken yet, reset the ray depth
        if (stepsTaken == 0)
        {
            rayDepth = 0;
        }

        // Advance the position of the ray according to its current depth and direction.
        ray.pos += (ray.dir * rayDepth);
        
        // Reset step count after advancing the ray's position
        stepsTaken = 0;
    }

    {
        // Break out of the loop if the Y coordinate is above a certain threshold and the direction points upwards or parallel to the ground plane
        if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
        {
            break;
        }

        // Loop through the ray length, advancing stepsTaken for each iteration.
        for (; rayDepth < (MAX_RAY_LENGTH / RAY_STEP_SIZE); stepsTaken++)
        {
            // Sample the heightmap at the current position of the ray to get the voxel height
            double voxelHeight = heightmapSampler(ray.pos, camera.position).channel_at(0);

            // If the voxel's height is greater than or equal to the Y coordinate of the ray's position,
            if (voxelHeight >= ray.pos[1])
            {
                // Sample the texture at the current ray position
                const vond::color<uint8_t, 4> groundColor = textureSampler(ray.pos, camera.position);

                // If the alpha channel is zero, skip this pixel and draw sky instead.
                if (!groundColor.channel_at(3))
                {
                    goto draw_sky;
                }

                // Calculate the depth of the intersection point from the camera
                const double depth = ray.pos.distance_to(camera.position);
                
                // Draw the color to the output image for every multiplier width pixel.
                for (unsigned i = 0; i < PIXEL_WIDTH_MULTIPLIER; i++)
                {
                    dstPixelmap.pixel_at((x + i), (dstPixelmap.height() - y - 1)) = groundColor;
                    dstDepthmap.pixel_at((x + i), (dstDepthmap.height() - y - 1)) = {depth};
                }

                // Exit the loop as we have found a valid intersection
                break;
            }
            
            // Calculate extra steps to skip, which is based on ray depth and a multiplier.
            const unsigned extraSteps = (rayDepth * RAY_SKIP_MULTIPLIER);
            
            // Advance the ray's position by a larger step size that includes extraSteps and an additional step for precision.
            ray.pos += (ray.dir * (extraSteps + 1));
            rayDepth += (extraSteps + 1);

            // Exit loop early if the Y coordinate is above a certain threshold and direction points upwards or parallel to the ground plane
            if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
            {
                goto draw_sky;
            }
        }
    }

draw_sky:
    // Placeholder label for jumping to when deciding to render the sky instead of terrain.
}
```

> Qwen 2.5 &ndash; 2/2
``` [{no-line-numbers}{inline-class:model-response}]
// Start processing each row of the image from top to bottom.
unsigned y = 0;

for (; y < dstPixelmap.height(); y++)
{
    // Accumulate the total number of voxels processed so far.
    numVoxels += stepsTaken;

    // Calculate the Y coordinate on the screen plane based on the current pixel row and field of view (FOV).
    const double screenPlaneY = ((2.0 * ((y + 0.5) / dstPixelmap.height()) - 1.0) * tanFov);

    ray_s ray;

    // Initialize the ray by calculating its position and direction based on the current pixel location.
    {
        // The view vector is computed considering the X and Y coordinates on the screen plane and camera zoom level,
        // then transformed using the view matrix to get the correct 3D space orientation.
        const vond::vector3<double> view = (vond::vector3<double>{screenPlaneX, screenPlaneY, camera.zoom} * viewMatrix);

        // Set ray origin at the current camera position and direction along the normalized view vector,
        // scaled by a predefined step size to ensure consistent movement across iterations.
        ray.pos = camera.position;
        ray.dir = (view.normalized() * RAY_STEP_SIZE);
    }

    // Initialize or reset necessary parameters for the upcoming iteration.
    {
        if (stepsTaken == 0)
        {
            // Reset the depth of the ray when no steps were taken, indicating a new row.
            rayDepth = 0;
        }
        
        // Move the ray's position forward according to its direction and accumulated depth.
        ray.pos += (ray.dir * rayDepth);
        // Reset the number of steps for this iteration.
        stepsTaken = 0;
    }

    // Early exit if the ray is already above the maximum height and moving upwards, indicating no ground will be hit.
    {
        if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
        {
            break;  // No need to proceed with further checks for this row since it's in the sky.
        }

        // Trace the ray along its path until it reaches a predefined maximum length or hits ground.
        for (; rayDepth < (MAX_RAY_LENGTH / RAY_STEP_SIZE); stepsTaken++)
        {
            // Sample the heightmap at the current ray position to determine if the ray is above or below ground level.
            double voxelHeight = heightmapSampler(ray.pos, camera.position).channel_at(0);

            // If the ray hits the ground (current position is lower than sampled height),
            // draw the corresponding texture and depth map entries.
            if (voxelHeight >= ray.pos[1])
            {
                const vond::color<uint8_t, 4> groundColor = textureSampler(ray.pos, camera.position);

                // If the sampled color has zero alpha value, treat it as sky and break out of loop to skip further processing for this row.
                if (!groundColor.channel_at(3))
                {
                    goto draw_sky;
                }

                // Calculate distance from current ray position back to camera.
                const double depth = ray.pos.distance_to(camera.position);

                // Draw the ground color at the corresponding pixel locations, with a width multiplier applied.
                for (unsigned i = 0; i < PIXEL_WIDTH_MULTIPLIER; i++)
                {
                    dstPixelmap.pixel_at((x + i), (dstPixelmap.height() - y - 1)) = groundColor;
                    // Store depth information in separate buffer for potential use in post-processing or other calculations.
                    dstDepthmap.pixel_at((x + i), (dstDepthmap.height() - y - 1)) = {depth};
                }

                break;  // No need to continue ray marching since the ground has been hit.
            }

            // For optimization, take larger steps when far from the camera and there's no immediate obstacle in sight.
            const unsigned extraSteps = (rayDepth * RAY_SKIP_MULTIPLIER);
            ray.pos += (ray.dir * (extraSteps + 1));
            rayDepth += (extraSteps + 1);

            // Early exit condition to skip further processing when moving into the sky space without ground hit.
            if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
            {
                goto draw_sky;
            }
        }
    }

    // Label for skipping unnecessary processing and jumping directly to drawing the sky color at the current pixel location.
draw_sky:
    continue;  // Implicitly implied here, as 'goto draw_sky;' was used to bypass further code in this iteration of loop.
}
```

> Qwen 2.5 Coder &ndash; 1/2
``` [{no-line-numbers}{inline-class:model-response}]
unsigned y = 0;

// Iterate over each row of pixels in the destination pixel map
for (; y < dstPixelmap.height(); y++)
{
    // Accumulate the total number of steps taken by rays so far
    numVoxels += stepsTaken;

    // Calculate the y-coordinate on the screen plane, normalized to [-1, 1] and scaled by tanFov
    const double screenPlaneY = ((2.0 * ((y + 0.5) / dstPixelmap.height()) - 1.0) * tanFov);

    ray_s ray;

    // Initialize the ray for the current pixel
    {
        // Transform the view direction from camera space to world space using the view matrix
        const vond::vector3<double> view = (vond::vector3<double>{screenPlaneX, screenPlaneY, camera.zoom} * viewMatrix);

        // Set the starting position of the ray at the camera's position
        ray.pos = camera.position;
        // Set the direction of the ray and scale it by RAY_STEP_SIZE for each step
        ray.dir = (view.normalized() * RAY_STEP_SIZE);
    }

    // Adjust the ray position based on the current depth and reset steps taken
    {
        if (stepsTaken == 0)
        {
            // Initialize rayDepth to 0 at the start of a new row or when no steps were taken in the previous iteration
            rayDepth = 0;
        }

        // Move the ray forward by the accumulated depth from previous iterations
        ray.pos += (ray.dir * rayDepth);
        // Reset the step counter for the current pixel's ray tracing process
        stepsTaken = 0;
    }

    // Trace the ray through the heightmap and determine if it intersects with any voxels or reaches the sky
    {
        // If the ray is above the maximum height (255) and moving upwards, stop processing this row
        if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
        {
            break;
        }

        // Continue tracing the ray until it intersects with a voxel or reaches the maximum ray length
        for (; rayDepth < (MAX_RAY_LENGTH / RAY_STEP_SIZE); stepsTaken++)
        {
            // Sample the heightmap at the current ray position to get the height of the voxel
            double voxelHeight = heightmapSampler(ray.pos, camera.position).channel_at(0);

            // Check if the current voxel intersects with the ray
            if (voxelHeight >= ray.pos[1])
            {
                // Retrieve the ground color from a texture at the intersection point
                const vond::color<uint8_t, 4> groundColor = textureSampler(ray.pos, camera.position);

                // If the ground color is fully transparent (alpha channel == 0), draw the sky instead
                if (!groundColor.channel_at(3))
                {
                    goto draw_sky;
                }

                // Calculate the depth of the intersection point from the camera's position
                const double depth = ray.pos.distance_to(camera.position);

                // Set the pixel color and depth for each pixel in the current column (considering PIXEL_WIDTH_MULTIPLIER)
                for (unsigned i = 0; i < PIXEL_WIDTH_MULTIPLIER; i++)
                {
                    dstPixelmap.pixel_at((x + i), (dstPixelmap.height() - y - 1)) = groundColor;
                    dstDepthmap.pixel_at((x + i), (dstDepthmap.height() - y - 1)) = {depth};
                }

                // Stop tracing the current ray as it has already found an intersection
                break;
            }

            // Skip a number of steps based on RAY_SKIP_MULTIPLIER to optimize performance in open areas
            const unsigned extraSteps = (rayDepth * RAY_SKIP_MULTIPLIER);
            // Move the ray forward by the number of skipped steps plus one
            ray.pos += (ray.dir * (extraSteps + 1));
            // Increment the ray depth by the same amount
            rayDepth += (extraSteps + 1);

            // If the ray is above the maximum height after skipping, stop processing this row
            if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
            {
                goto draw_sky;
            }
        }
    }
}
```

> Qwen 2.5 Coder &ndash; 2/2
``` [{no-line-numbers}{inline-class:model-response}]
unsigned y = 0;

// Iterate over each pixel row in the destination pixel map.
for (; y < dstPixelmap.height(); y++)
{
    // Accumulate the total number of steps taken by rays.
    numVoxels += stepsTaken;

    // Calculate the y-coordinate on the screen plane for the current pixel.
    const double screenPlaneY = ((2.0 * ((y + 0.5) / dstPixelmap.height()) - 1.0) * tanFov);

    ray_s ray;

    {
        // Transform the screen coordinates to view space and normalize the direction vector.
        const vond::vector3<double> view = (vond::vector3<double>{screenPlaneX, screenPlaneY, camera.zoom} * viewMatrix);

        // Set the starting position of the ray at the camera's position.
        ray.pos = camera.position;
        // Calculate the normalized direction of the ray and scale it by RAY_STEP_SIZE.
        ray.dir = (view.normalized() * RAY_STEP_SIZE);
    }

    {
        // Reset ray depth if no steps have been taken yet.
        if (stepsTaken == 0)
        {
            rayDepth = 0;
        }

        // Move the starting position of the ray forward by its current depth.
        ray.pos += (ray.dir * rayDepth);
        // Reset the step counter for the next iteration.
        stepsTaken = 0;
    }

    {
        // Check if the ray has moved past the maximum height and is moving upwards.
        if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
        {
            break; // Exit the loop as the ray will not intersect with any voxels below.
        }

        // Trace the ray through the voxel grid until it intersects a voxel or reaches maximum length.
        for (; rayDepth < (MAX_RAY_LENGTH / RAY_STEP_SIZE); stepsTaken++)
        {
            // Sample the heightmap to get the height of the voxel at the current position.
            double voxelHeight = heightmapSampler(ray.pos, camera.position).channel_at(0);

            // Check if the ray has intersected a voxel.
            if (voxelHeight >= ray.pos[1])
            {
                // Sample the texture to get the color of the intersected voxel.
                const vond::color<uint8_t, 4> groundColor = textureSampler(ray.pos, camera.position);

                // If the sampled color is transparent, skip drawing and go to draw_sky label.
                if (!groundColor.channel_at(3))
                {
                    goto draw_sky;
                }

                // Calculate the distance from the camera to the intersection point.
                const double depth = ray.pos.distance_to(camera.position);

                // Set the pixel color in the destination pixel map for this row of pixels.
                for (unsigned i = 0; i < PIXEL_WIDTH_MULTIPLIER; i++)
                {
                    dstPixelmap.pixel_at((x + i), (dstPixelmap.height() - y - 1)) = groundColor;
                    // Store the depth information in the depth map.
                    dstDepthmap.pixel_at((x + i), (dstDepthmap.height() - y - 1)) = {depth};
                }

                break; // Exit the loop as the intersection has been handled.
            }

            // Skip extra steps to optimize ray tracing based on RAY_SKIP_MULTIPLIER.
            const unsigned extraSteps = (rayDepth * RAY_SKIP_MULTIPLIER);
            ray.pos += (ray.dir * (extraSteps + 1));
            rayDepth += (extraSteps + 1);

            // Check again if the ray has moved past the maximum height and is moving upwards.
            if ((ray.pos[1] > 255) && (ray.dir[1] >= 0))
            {
                goto draw_sky; // Exit to draw sky color as no intersection will occur below.
            }
        }
    }
}
```

Context length: 4096.

Both models have meticulously commented virtually every line of code, which I personally don't think meets the intent of "helpful comments." But this is very typical of LLMs in general.

Qwen 2.5 Coder's first version in particular has a few outright insightful comments. Qwen 2.5's comments are more vacuous by comparison.

## Convert from C to JavaScript

<x-prompt>
    <p>
        Convert this C code into JavaScript.
    </p>

> Code
```c
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <float.h>
#include <math.h>
#include <stdint.h>
#include <time.h> /* For rand().*/

typedef float real;

#define RANDOM_REAL (rand()/(real)RAND_MAX)
#define SCREEN_WIDTH 240
#define SCREEN_HEIGHT 160
#define EPSILON 0.01
#define PI 3.14

struct color_rgb
{
    real r, g, b;
};

struct vector3
{
    real x, y, z;
};

struct sphere
{
    struct vector3 position;

    struct color_rgb color;

    real radius;

    /* TODO: material */
};

real vector3_dot(const struct vector3 *const v1,
                 const struct vector3 *const v2)
{
    return ((v1->x * v2->x) + (v1->y * v2->y) + (v1->z * v2->z));
}

struct vector3 vector3_cross(const struct vector3 *const v1,
                             const struct vector3 *const v2)
{
    struct vector3 ret;

    ret.x = ((v1->y * v2->z) - (v1->z * v2->y));
    ret.y = ((v1->z * v2->x) - (v1->x * v2->z));
    ret.z = ((v1->x * v2->y) - (v1->y * v2->x));
    
    return ret;
}

real vector3_length(const struct vector3 *const v)
{
    return sqrt((v->x * v->x) + (v->y * v->y) + (v->z * v->z));
}

struct vector3 vector3_normalized(const struct vector3 *const v)
{
    struct vector3 ret;
    real inv = 0;
    real length = vector3_length(v);

    if (length == 0)
    {
        length = 1;
    }

    inv = (1.0 / length);
    ret.x = (v->x * inv);
    ret.y = (v->y * inv);
    ret.z = (v->z * inv);

    return ret;
}

int test_vector3(void)
{
    /* Dot.*/
    {
        struct vector3 v1 = {1.0, 2.0, 3.0};
        struct vector3 v2 = {4.0, 5.0, 6.0};

        if (vector3_dot(&v1, &v2) != 32)
        {
            fprintf(stderr, "Test failed: vector3_dot()\n");
            return 0;
        }
    }

    /* Length & normalize.*/
    {
        struct vector3 v1 = {1.0, 4.0, 8.0};
        const struct vector3 v1Norm = vector3_normalized(&v1);

        if (vector3_length(&v1) != 9)
        {
            fprintf(stderr, "Test failed: vector3_length()\n");
            return 0;
        }

        if (vector3_length(&v1Norm) != 1)
        {
            fprintf(stderr, "Test failed: vector3_normalized()\n");
            return 0;
        }
    }

    /* Cross.*/
    {
        struct vector3 v1 = {1.0, 2.0, 3.0};
        struct vector3 v2 = {4.0, 5.0, 6.0};
        const struct vector3 crossed = vector3_cross(&v1, &v2);

        if ((crossed.x != -3) ||
            (crossed.y !=  6) ||
            (crossed.z != -3))
        {
            fprintf(stderr, "Test failed: vector3_cross()\n");
            return 0;
        }
    }

    return 1;
}

/* Ray-sphere intersection. Returns 0 if the ray misses the sphere, 1 if the ray hits the
 * sphere, and -1 if the ray hits the sphere from inside the sphere. Adapted with superficial
 * changes from an implementation by Jacco Bikker:
 * https://web.archive.org/web/20080509075746/http://www.devmaster.net/articles/raytracing_series/part2.php.*/
int ray_intersects_sphere(const struct vector3 *const rayOrigin,
                          const struct vector3 *const rayDirection,
                          const struct sphere *const sphere,
                          real *const closestDistance)
{
    real b = 0;
    real det = 0;
    int doesHit = 0;
    struct vector3 v = {0, 0, 0};

    v.x = (rayOrigin->x - sphere->position.x);
    v.y = (rayOrigin->y - sphere->position.y);
    v.z = (rayOrigin->z - sphere->position.z);

    b = -vector3_dot(&v, rayDirection);
    det = ((b * b) - vector3_dot(&v, &v) + (sphere->radius * sphere->radius));
    if (det > 0)
    {
        real i1 = 0, i2 = 0;

        det = sqrt(det);
        i1 = (b - det);
        i2 = (b + det);

        if (i2 > 0)
        {
            if (i1 < 0) 
            {
                if (i2 < *closestDistance) 
                {
                    *closestDistance = i2;
                    doesHit = -1;
                }
            }
            else
            {
                if (i1 < *closestDistance)
                {
                    *closestDistance = i1;
                    doesHit = 1;
                }
            }
        }
    }

    return doesHit;
}

/* Returns a random direction about the given normal.*/
struct vector3 random_direction_about_hemisphere(const struct vector3 *normal)
{
    struct vector3 randomDir;

    randomDir.x = (-RANDOM_REAL + RANDOM_REAL);
    randomDir.y = (-RANDOM_REAL + RANDOM_REAL);
    randomDir.z = (-RANDOM_REAL + RANDOM_REAL);

    randomDir = vector3_normalized(&randomDir);

    if (vector3_dot(normal, &randomDir) < 0)
    {
        randomDir.x *= -1;
        randomDir.y *= -1;
        randomDir.z *= -1;
    }

    return randomDir;
}

struct color_rgb trace_ray(struct vector3 *const rayOrigin,
                           struct vector3 *const rayDirection,
                           const struct sphere *const spheres,
                           const int sphereCount,
                           const int depth)
{
    int i = 0;
    
    /* The closest sphere in the list of spheres that the ray hits. Will be
     * null if no sphere was hit.*/
    const struct sphere *intersectedSphere = NULL;

    struct vector3 hitNormal;

    struct color_rgb returnColor = {0, 0, 0};
    const struct color_rgb black = {0, 0, 0};

    if (depth > 10)
    {
        return black;
    }

    /* Intersect the ray to the scene.*/
    {
        /* The distance to the closest intersection point along the ray.*/
        real closestHitDistance = FLT_MAX;

        for (i = 0; i < sphereCount; i++)
        {
            const int hit = ray_intersects_sphere(rayOrigin, rayDirection, &spheres[i], &closestHitDistance);

            switch (hit)
            {
                case 1: intersectedSphere = &spheres[i]; break;
                case -1: return black;
                default: break;
            }
        }

        /* Hit the sky.*/
        if (!intersectedSphere)
        {
            /* An approximation of the color of an overcast sky in the given direction.
             * The equation is roughly that of "Moon & Spencer" (date/publication unknown;
             * as cited in Preetham 1999: A practical analytic model for daylight).*/
            const struct vector3 up = {0, 1, 0};
            const real theta = (1 - vector3_dot(&up, rayDirection));
            const real zenithLuminance = 1.3;
            const real luminance = (zenithLuminance * ((1 + 2 * cos(theta)) / 3));
            struct color_rgb skyColor = {0, 0, 0};

            skyColor.r = skyColor.g = skyColor.b = luminance;

            return skyColor;
        }

        /* Move the ray to the new intersection point.*/
        rayOrigin->x += (rayDirection->x * closestHitDistance);
        rayOrigin->y += (rayDirection->y * closestHitDistance);
        rayOrigin->z += (rayDirection->z * closestHitDistance);

        /* Diffusely scatter the ray in a random direction about the new hitpoint's hemisphere.*/
        {
            hitNormal.x = (rayOrigin->x - intersectedSphere->position.x);
            hitNormal.y = (rayOrigin->y - intersectedSphere->position.y);
            hitNormal.z = (rayOrigin->z - intersectedSphere->position.z);
            hitNormal = vector3_normalized(&hitNormal);

            rayOrigin->x += (hitNormal.x * EPSILON);
            rayOrigin->y += (hitNormal.y * EPSILON);
            rayOrigin->z += (hitNormal.z * EPSILON);

            *rayDirection = random_direction_about_hemisphere(&hitNormal);
        }
    }
    
    /* Recursively cast a new ray.*/
    {
        const real albedo = 0.7;
        const real pdf = 0.15915494309;
        const real bsdf = ((vector3_dot(&hitNormal, rayDirection) / pdf) * (albedo / PI));

        const struct color_rgb incident = trace_ray(rayOrigin, rayDirection, spheres, sphereCount, (depth + 1));

        returnColor.r = (intersectedSphere->color.r * bsdf * incident.r);
        returnColor.g = (intersectedSphere->color.g * bsdf * incident.g);
        returnColor.b = (intersectedSphere->color.b * bsdf * incident.b);
    }

    return returnColor;
}

/* Saves the given screen buffer into a PPM image file. The code is lifted, with modifications,
* from Kevin Beason's smallpt: http://www.kevinbeason.com/smallpt/. */
void save_screen_buffer_to_ppm(const uint16_t *const screenBuffer,
                                const unsigned width,
                                const unsigned height)
{
    int i = 0;
    FILE *const f = fopen("image.ppm", "w");

    fprintf(f, "P3\n%d %d\n%d\n", width, height, 255);

    for (i = (width * height - 1); i >= 0; i--)
    {
        fprintf(f,"%d %d %d ", ((screenBuffer[i] & 0x1f) * 8),
                                (((screenBuffer[i] >> 5) & 0x1f) * 8),
                                (((screenBuffer[i] >> 10) & 0x1f) * 8));
    }
    
    return;
}

int main(void)
{
    unsigned i = 0;
    const unsigned numSpheres = 20;
    const unsigned numSamplesPerPass = 200;
    struct sphere *spheres = calloc(numSpheres, sizeof(*spheres));
    uint16_t *videoMemory = NULL;

    srand(time(NULL));

    videoMemory = malloc(SCREEN_WIDTH * SCREEN_HEIGHT * sizeof(*videoMemory));
    memset(videoMemory, 0, (SCREEN_WIDTH * SCREEN_HEIGHT * sizeof(*videoMemory)));

    /* Create a bunch of random-looking spheres.*/
    for (i = 0; i < numSpheres; i++)
    {
        spheres[i].position.x = ((RANDOM_REAL * 70) - (RANDOM_REAL * 70));
        spheres[i].position.y = ((RANDOM_REAL * 35) - (RANDOM_REAL * 35));
        spheres[i].position.z = ((50 + RANDOM_REAL * 35) - (RANDOM_REAL * 35));

        spheres[i].radius = (RANDOM_REAL * 15);

        spheres[i].color.r = RANDOM_REAL;
        spheres[i].color.g = RANDOM_REAL;
        spheres[i].color.b = RANDOM_REAL;
    }

    /* Trace a ray through each pixel on the screen.*/
    {
        unsigned x = 0, y = 0, i = 0;
        const real cameraZoom = 2.5;
        const struct vector3 cameraPosition = {0.0, 0.0, 150.0};

        for (y = 0; y < SCREEN_HEIGHT; y++)
        {
            for (x = 0; x < SCREEN_WIDTH; x++)
            {
                struct color_rgb accumulatedColor = {0, 0, 0};

                for (i = 0; i < numSamplesPerPass; i++)
                {
                    struct color_rgb color = {0, 0, 0};
                    struct vector3 rayDirection = {0, 0, 0};
                    struct vector3 rayPosition = cameraPosition;
                    const real fov = 65;
                    const real aspectRatio = (SCREEN_WIDTH / (real)SCREEN_HEIGHT);
                    const real tanFov = tan((fov / 2.0) * (PI / 180.0));

                    rayDirection.x = ((2.0 * ((x + 0.5) / SCREEN_WIDTH) - 1.0) * tanFov * aspectRatio);
                    rayDirection.y = ((2.0 * ((y + 0.5) / SCREEN_HEIGHT) - 1.0) * tanFov);
                    rayDirection.z = -cameraZoom;
                    rayDirection = vector3_normalized(&rayDirection);

                    color = trace_ray(&rayPosition, &rayDirection, spheres, numSpheres, 0);

                    accumulatedColor.r += color.r;
                    accumulatedColor.g += color.g;
                    accumulatedColor.b += color.b;
                }

                accumulatedColor.r /= numSamplesPerPass;
                accumulatedColor.g /= numSamplesPerPass;
                accumulatedColor.b /= numSamplesPerPass;

                /* Convert the 0..1 color values into 0..31, and encode them into the screen
                 * buffer as a single 16-bit value.*/
                {
                    #define clamp(x) (unsigned)((x) < 0? 0 : (x) > 31? 31 : (x))

                    const unsigned r = clamp(accumulatedColor.r * 32);
                    const unsigned g = clamp(accumulatedColor.g * 32);
                    const unsigned b = clamp(accumulatedColor.b * 32);

                    #undef clamp
                    
                    videoMemory[x + y * SCREEN_WIDTH] = (r | (g << 5) | (b << 10));
                }
            }

            printf("\rRendering... %d%%", (int)((y / (real)SCREEN_HEIGHT) * 100));
            fflush(stdout);
        }

        printf("\rRendering... 100%%\n");
    }

    save_screen_buffer_to_ppm(videoMemory, SCREEN_WIDTH, SCREEN_HEIGHT);

    free(videoMemory);
    free(spheres);

    return 0;
}
```
</x-prompt>

> Qwen 2.5
``` [{no-line-numbers}{inline-class:model-response}]
function vector3_dot(v1, v2) {
    return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
}

function vector3_cross(v1, v2) {
    const ret = {};
    ret.x = v1.y * v2.z - v1.z * v2.y;
    ret.y = v1.z * v2.x - v1.x * v2.z;
    ret.z = v1.x * v2.y - v1.y * v2.x;

    return ret;
}

function vector3_length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function vector3_normalized(v) {
    let length = vector3_length(v);

    if (length === 0) {
        length = 1;
    }

    const ret = {};
    ret.x = v.x / length;
    ret.y = v.y / length;
    ret.z = v.z / length;

    return ret;
}

function test_vector3() {
    // Dot.
    const v1a = {x: 1.0, y: 2.0, z: 3.0};
    const v1b = {x: 4.0, y: 5.0, z: 6.0};

    if (vector3_dot(v1a, v1b) !== 32) {
        console.error("Test failed: vector3_dot()");
        return false;
    }

    // Length & normalize.
    const v2 = {x: 1.0, y: 4.0, z: 8.0};
    const v2Norm = vector3_normalized(v2);

    if (vector3_length(v2) !== 9) {
        console.error("Test failed: vector3_length()");
        return false;
    }

    if (vector3_length(v2Norm) !== 1) {
        console.error("Test failed: vector3_normalized()");
        return false;
    }

    // Cross.
    const v3a = {x: 1.0, y: 2.0, z: 3.0};
    const v3b = {x: 4.0, y: 5.0, z: 6.0};

    const crossResult = vector3_cross(v3a, v3b);

    if (crossResult.x !== -3 || crossResult.y !== 6 || crossResult.z !== -3) {
        console.error("Test failed: vector3_cross()");
        return false;
    }

    return true;
}

function ray_intersects_sphere(rayOrigin, rayDirection, sphere, closestDistance) {
    let v = {x: rayOrigin.x - sphere.position.x, y: rayOrigin.y - sphere.position.y, z: rayOrigin.z - sphere.position.z};
    const b = -vector3_dot(v, rayDirection);
    const det = (b * b) - vector3_dot(v, v) + (sphere.radius * sphere.radius);

    if (det > 0) {
        let i1 = 0, i2 = 0;

        det = Math.sqrt(det);
        i1 = b - det;
        i2 = b + det;

        if (i2 > 0) {
            if (i1 < 0) {
                if (i2 < closestDistance) {
                    closestDistance = i2;
                    return -1;
                }
            } else {
                if (i1 < closestDistance) {
                    closestDistance = i1;
                    return 1;
                }
            }
        }
    }

    return 0;
}

function random_direction_about_hemisphere(normal) {
    const randomDir = {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1};
    const normalizedRandomDir = vector3_normalized(randomDir);

    if (vector3_dot(normal, normalizedRandomDir) < 0) {
        return {x: -normalizedRandomDir.x, y: -normalizedRandomDir.y, z: -normalizedRandomDir.z};
    }

    return normalizedRandomDir;
}

function trace_ray(rayOrigin, rayDirection, spheres, sphereCount, depth) {
    if (depth > 10) {
        return {r: 0, g: 0, b: 0};
    }

    let closestHitDistance = Number.MAX_VALUE;
    let intersectedSphere = null;

    for (let i = 0; i < sphereCount; i++) {
        const hit = ray_intersects_sphere(rayOrigin, rayDirection, spheres[i], closestHitDistance);

        if (hit === -1) return {r: 0, g: 0, b: 0};
        else if (hit === 1) intersectedSphere = spheres[i];
    }

    if (!intersectedSphere) {
        const up = {x: 0, y: 1, z: 0};
        const theta = 1 - vector3_dot(up, rayDirection);
        const zenithLuminance = 1.3;
        const luminance = (zenithLuminance * ((1 + 2 * Math.cos(theta)) / 3));
        
        return {r: luminance, g: luminance, b: luminance};
    }

    rayOrigin.x += rayDirection.x * closestHitDistance;
    rayOrigin.y += rayDirection.y * closestHitDistance;
    rayOrigin.z += rayDirection.z * closestHitDistance;

    const hitNormal = vector3_normalized({x: rayOrigin.x - intersectedSphere.position.x,
                                          y: rayOrigin.y - intersectedSphere.position.y,
                                          z: rayOrigin.z - intersectedSphere.position.z});

    rayOrigin.x += hitNormal.x * 0.01;
    rayOrigin.y += hitNormal.y * 0.01;
    rayOrigin.z += hitNormal.z * 0.01;

    const randomDir = random_direction_about_hemisphere(hitNormal);
    
    const albedo = 0.7;
    const pdf = 0.15915494309;
    const bsdf = ((vector3_dot(hitNormal, rayDirection) / pdf) * (albedo / Math.PI));

    const incidentColor = trace_ray(rayOrigin, randomDir, spheres, sphereCount, depth + 1);

    return {r: intersectedSphere.color.r * bsdf * incidentColor.r,
            g: intersectedSphere.color.g * bsdf * incidentColor.g,
            b: intersectedSphere.color.b * bsdf * incidentColor.b};
}

function save_screen_buffer_to_ppm(screenBuffer, width, height) {
    let ppmContent = `P3\n${width} ${height}\n255\n`;

    for (let i = 0; i < screenBuffer.length; i++) {
        const r = ((screenBuffer[i] & 0x1f) * 8);
        const g = (((screenBuffer[i] >> 5) & 0x1f) * 8);
        const b = (((screenBuffer[i] >> 10) & 0x1f) * 8);

        ppmContent += `${r} ${g} ${b} `;
    }

    // Writing the PPM content to a file would require Node.js or another method of filesystem access
}

function main() {
    const numSpheres = 20;
    const numSamplesPerPass = 200;

    const spheres = Array.from({length: numSpheres}, () => ({
        position: {x: Math.random() * 140 - 70, y: Math.random() * 70 - 35, z: Math.random() * 70 + 50},
        radius: Math.random() * 15,
        color: {r: Math.random(), g: Math.random(), b: Math.random()}
    }));

    const videoMemory = new Uint16Array(240 * 160);

    for (let y = 0; y < 160; y++) {
        for (let x = 0; x < 240; x++) {
            let accumulatedColor = {r: 0, g: 0, b: 0};

            for (let i = 0; i < numSamplesPerPass; i++) {
                const fov = 65;
                const aspectRatio = 240 / 160;
                const tanFov = Math.tan((fov / 2) * (Math.PI / 180));

                const rayDirection = {
                    x: ((2 * ((x + 0.5) / 240) - 1) * tanFov * aspectRatio),
                    y: ((2 * ((y + 0.5) / 160) - 1) * tanFov),
                    z: -2.5
                };
                
                const normalizedRayDirection = vector3_normalized(rayDirection);

                const color = trace_ray({x: 0, y: 0, z: 150}, normalizedRayDirection, spheres, numSpheres, 0);
    
                accumulatedColor.r += color.r;
                accumulatedColor.g += color.g;
                accumulatedColor.b += color.b;
            }

            accumulatedColor.r /= numSamplesPerPass;
            accumulatedColor.g /= numSamplesPerPass;
            accumulatedColor.b /= numSamplesPerPass;

            const r = Math.min(Math.max(0, Math.round(accumulatedColor.r * 32)), 31);
            const g = Math.min(Math.max(0, Math.round(accumulatedColor.g * 32)), 31);
            const b = Math.min(Math.max(0, Math.round(accumulatedColor.b * 32)), 31);

            videoMemory[x + y * 240] = (r | (g << 5) | (b << 10));
        }

        console.log(`Rendering... ${(y / 160) * 100}%`);
    }

    save_screen_buffer_to_ppm(videoMemory, 240, 160);
}

main();
```

> Qwen 2.5 Coder
``` [{no-line-numbers}{inline-class:model-response}]
const fs = require('fs');

class ColorRGB {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    dot(v2) {
        return (this.x * v2.x + this.y * v2.y + this.z * v2.z);
    }

    cross(v2) {
        return new Vector3(
            (this.y * v2.z - this.z * v2.y),
            (this.z * v2.x - this.x * v2.z),
            (this.x * v2.y - this.y * v2.x)
        );
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    normalized() {
        const len = this.length();
        if (len === 0) return new Vector3(1, 0, 0);
        const inv = 1.0 / len;
        return new Vector3(this.x * inv, this.y * inv, this.z * inv);
    }
}

class Sphere {
    constructor(position, color, radius) {
        this.position = position;
        this.color = color;
        this.radius = radius;
    }
}

function randomReal() {
    return Math.random();
}

const SCREEN_WIDTH = 240;
const SCREEN_HEIGHT = 160;
const EPSILON = 0.01;
const PI = Math.PI;

function testVector3() {
    // Dot
    const v1 = new Vector3(1.0, 2.0, 3.0);
    const v2 = new Vector3(4.0, 5.0, 6.0);

    if (v1.dot(v2) !== 32) {
        console.error("Test failed: vector3_dot()");
        return false;
    }

    // Length & normalize
    const v3 = new Vector3(1.0, 4.0, 8.0);
    const v3Norm = v3.normalized();

    if (Math.abs(v3.length() - 9) > EPSILON) {
        console.error("Test failed: vector3_length()");
        return false;
    }

    if (Math.abs(v3Norm.length() - 1) > EPSILON) {
        console.error("Test failed: vector3_normalized()");
        return false;
    }

    // Cross
    const v4 = new Vector3(1.0, 2.0, 3.0);
    const v5 = new Vector3(4.0, 5.0, 6.0);
    const crossed = v4.cross(v5);

    if (crossed.x !== -3 || crossed.y !== 6 || crossed.z !== -3) {
        console.error("Test failed: vector3_cross()");
        return false;
    }

    return true;
}

function rayIntersectsSphere(rayOrigin, rayDirection, sphere, closestDistance) {
    const v = new Vector3(
        rayOrigin.x - sphere.position.x,
        rayOrigin.y - sphere.position.y,
        rayOrigin.z - sphere.position.z
    );

    const b = -v.dot(rayDirection);
    let det = (b * b) - v.dot(v) + (sphere.radius * sphere.radius);

    if (det > 0) {
        det = Math.sqrt(det);
        const i1 = b - det;
        const i2 = b + det;

        if (i2 > 0) {
            if (i1 < 0) {
                if (i2 < closestDistance[0]) {
                    closestDistance[0] = i2;
                    return -1;
                }
            } else {
                if (i1 < closestDistance[0]) {
                    closestDistance[0] = i1;
                    return 1;
                }
            }
        }
    }

    return 0;
}

function randomDirectionAboutHemisphere(normal) {
    const randomDir = new Vector3(
        -randomReal() + randomReal(),
        -randomReal() + randomReal(),
        -randomReal() + randomReal()
    ).normalized();

    if (randomDir.dot(normal) < 0) {
        return new Vector3(-randomDir.x, -randomDir.y, -randomDir.z);
    }

    return randomDir;
}

function traceRay(rayOrigin, rayDirection, spheres, sphereCount, depth) {
    let intersectedSphere = null;
    const hitNormal = new Vector3(0, 0, 0);
    const black = new ColorRGB(0, 0, 0);

    if (depth > 10) return black;

    const closestHitDistance = [Number.MAX_VALUE];

    for (let i = 0; i < sphereCount; i++) {
        const hit = rayIntersectsSphere(rayOrigin, rayDirection, spheres[i], closestHitDistance);
        switch (hit) {
            case 1: intersectedSphere = spheres[i]; break;
            case -1: return black;
            default: break;
        }
    }

    if (!intersectedSphere) {
        const up = new Vector3(0, 1, 0);
        const theta = 1 - rayDirection.dot(up);
        const zenithLuminance = 1.3;
        const luminance = (zenithLuminance * ((1 + 2 * Math.cos(theta)) / 3));
        return new ColorRGB(luminance, luminance, luminance);
    }

    rayOrigin.x += rayDirection.x * closestHitDistance[0];
    rayOrigin.y += rayDirection.y * closestHitDistance[0];
    rayOrigin.z += rayDirection.z * closestHitDistance[0];

    hitNormal.x = rayOrigin.x - intersectedSphere.position.x;
    hitNormal.y = rayOrigin.y - intersectedSphere.position.y;
    hitNormal.z = rayOrigin.z - intersectedSphere.position.z;
    hitNormal.normalize();

    rayOrigin.x += hitNormal.x * EPSILON;
    rayOrigin.y += hitNormal.y * EPSILON;
    rayOrigin.z += hitNormal.z * EPSILON;

    rayDirection.copy(randomDirectionAboutHemisphere(hitNormal));

    const albedo = 0.7;
    const pdf = 0.15915494309;
    const bsdf = (rayDirection.dot(hitNormal) / pdf) * (albedo / PI);

    const incident = traceRay(rayOrigin, rayDirection, spheres, sphereCount, depth + 1);
    return new ColorRGB(
        intersectedSphere.color.r * bsdf * incident.r,
        intersectedSphere.color.g * bsdf * incident.g,
        intersectedSphere.color.b * bsdf * incident.b
    );
}

function saveScreenBufferToPPM(screenBuffer, width, height) {
    let ppmData = `P3\n${width} ${height}\n255\n`;

    for (let i = width * height - 1; i >= 0; i--) {
        const color = screenBuffer[i];
        ppmData += `${((color & 0x1f) * 8)} ${(color >> 5 & 0x1f) * 8} ${(color >> 10 & 0x1f) * 8} `;
    }

    fs.writeFileSync("image.ppm", ppmData);
}

function main() {
    const numSpheres = 20;
    const numSamplesPerPass = 200;
    const spheres = [];
    const videoMemory = new Uint16Array(SCREEN_WIDTH * SCREEN_HEIGHT);

    for (let i = 0; i < numSpheres; i++) {
        spheres.push(new Sphere(
            new Vector3((randomReal() * 70) - (randomReal() * 70), (randomReal() * 35) - (randomReal() * 35), (50 + randomReal() * 35) - (randomReal() * 35)),
            new ColorRGB(randomReal(), randomReal(), randomReal()),
            randomReal() * 15
        ));
    }

    const cameraZoom = 2.5;
    const cameraPosition = new Vector3(0.0, 0.0, 150.0);

    for (let y = 0; y < SCREEN_HEIGHT; y++) {
        for (let x = 0; x < SCREEN_WIDTH; x++) {
            let accumulatedColor = new ColorRGB(0, 0, 0);

            for (let i = 0; i < numSamplesPerPass; i++) {
                const rayDirection = new Vector3(
                    ((2.0 * ((x + 0.5) / SCREEN_WIDTH) - 1.0) * Math.tan((65 / 2.0) * (PI / 180.0)) * (SCREEN_WIDTH / SCREEN_HEIGHT)),
                    ((2.0 * ((y + 0.5) / SCREEN_HEIGHT) - 1.0) * Math.tan((65 / 2.0) * (PI / 180.0))),
                    -cameraZoom
                ).normalized();

                const color = traceRay(cameraPosition.copy(), rayDirection, spheres, numSpheres, 0);
                accumulatedColor.r += color.r;
                accumulatedColor.g += color.g;
                accumulatedColor.b += color.b;
            }

            accumulatedColor.r /= numSamplesPerPass;
            accumulatedColor.g /= numSamplesPerPass;
            accumulatedColor.b /= numSamplesPerPass;

            const clamp = (x) => ((x) < 0 ? 0 : (x) > 31 ? 31 : Math.floor(x));
            const r = clamp(accumulatedColor.r * 32);
            const g = clamp(accumulatedColor.g * 32);
            const b = clamp(accumulatedColor.b * 32);

            videoMemory[x + y * SCREEN_WIDTH] = (r | (g << 5) | (b << 10));
        }

        process.stdout.write(`\rRendering... ${Math.floor((y / SCREEN_HEIGHT) * 100)}%`);
    }

    console.log("\rRendering... 100%\n");
    saveScreenBufferToPPM(videoMemory, SCREEN_WIDTH, SCREEN_HEIGHT);
}

main();
```

Context length: 8192.

The conversions are superficially quite faithful to the original, which is a simple path tracer that renders an image and saves it to disk. Unfortunately, both models decided to remove comments, even those attributing credit, which strictly speaking is grounds to fail both of them.

Qwen 2.5's version had one attempted assignment to a constant variable but was otherwise syntactically valid. It lacked an implementation to save the rendered image to disk.

Qwen 2.5 Coder's version had a couple of hallucinated interface calls but was otherwise syntactically valid. At a glance, it's a complete implementation relative the original.

Neither model's first attempt produced a valid rendering (after fixing the syntax errors):

<dokki-image headerless no-border-rounding width="972" height="320" src="./nope.png">
    <template #caption>
        Original in C (left), Qwen's JavaScript port (right). Scene geometry is random.
    </template>
</dokki-image>

## Conclusions

Overall, when it comes to programming, Qwen 2.5 and Qwen 2.5 Coder are roughly similar, the latter coming across as a somewhat more learned developer who writes cleaner code.

In [my previous coding tests](/blog/testing-open-and-closed-llms-some-more/), Qwen 2.5 Coder scores lower than the base Qwen 2.5. This is due to its apparent habit &ndash; also seen in these new tests &ndash; of hallucinating interfaces.