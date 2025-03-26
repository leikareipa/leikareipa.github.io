/*
 * 2025 ArtisaaniSoft
 * 
 * Renders a colored triangle using the S3d Toolkit Library in DOS.
 *
 * Build: wcl386 -bt=dos -l=dos4g s3dtrngl.c s3dtkwrr.lib
 *
 */

#include <stdlib.h>
#include <stdio.h>
#include <conio.h>
#include "s3type.h"
#include "s3dtk.h"

static S3DTK_LPFUNCTIONLIST S3D = NULL;
static S3DTK_LPVERTEX_LIT TRIANGLE[3] = {NULL};

static S3DTK_SURFACE RENDER_SURFACE[2] = {0};
static S3DTK_RECTAREA SCREEN_RECT = {0};
static unsigned BACK_BUFFER_IDX = 1;
static ULONG VRAM_HEAD = 0;

static ULONG ORIGINAL_VIDEO_MODE = 0;
#define VIDEO_MODE S3DTK_MODE640x480x15
#define SCREEN_WIDTH 640
#define SCREEN_HEIGHT 480
#define SCREEN_BPP 16

static int initialize_rendering(void)
{
    /* Initialize S3d. */
    {
        S3DTK_LIB_INIT libInit = {S3DTK_INITPIO, 0, 0};
        S3DTK_RENDERER_INITSTRUCT rendInit = {S3DTK_FORMAT_FLOAT, 0, 0};

        if(
            (S3DTK_OK != S3DTK_InitLib((ULONG)&libInit)) ||
            (S3DTK_OK != S3DTK_CreateRenderer((ULONG)&rendInit, (void*)&S3D))
        ){
            fprintf(stderr, "Failed to initialize S3d.\n");
            return 0;
        }
    }
    
    /* Create a double-buffered render surface with no depth buffering. */
    {
        unsigned i;

        for (i = 0; i < 2; i++)
        {
            RENDER_SURFACE[i].sfWidth = SCREEN_WIDTH;
            RENDER_SURFACE[i].sfHeight = SCREEN_HEIGHT;
            RENDER_SURFACE[i].sfFormat = ((SCREEN_BPP == 16)? S3DTK_VIDEORGB15 : (SCREEN_BPP == 8)? S3DTK_VIDEORGB8 : S3DTK_VIDEORGB24);
            RENDER_SURFACE[i].sfOffset = VRAM_HEAD;

            /* Align to 8 bytes. */
            VRAM_HEAD += (SCREEN_HEIGHT * ((SCREEN_WIDTH * SCREEN_BPP + 7) & 0xfffffff8));
        }

        SCREEN_RECT.top = 0;
        SCREEN_RECT.left = 0;
        SCREEN_RECT.right = SCREEN_WIDTH;
        SCREEN_RECT.bottom = SCREEN_HEIGHT;
    }
    
    if (
        (S3DTK_OK != S3D->S3DTK_SetState(S3D, S3DTK_RENDERINGTYPE, S3DTK_GOURAUD)) ||
        (S3DTK_OK != S3D->S3DTK_SetState(S3D, S3DTK_ZBUFFERENABLE, S3DTK_OFF))
    ){
        fprintf(stderr, "Failed to set S3d render state.\n");
        return 0;
    }

    if (
        (S3DTK_OK != S3D->S3DTK_GetState(S3D, S3DTK_VIDEOMODE, (ULONG)(&ORIGINAL_VIDEO_MODE))) ||
        (S3DTK_OK != S3D->S3DTK_SetState(S3D, S3DTK_VIDEOMODE, VIDEO_MODE))
    ){
        fprintf(stderr, "Failed to set the video mode.\n");
        return 0;
    }

    return 1;
}

static int initialize_triangle(void)
{
    unsigned i;
    const unsigned triSideLen = 150;
    static S3DTK_VERTEX_LIT vertices[3] = {0};

    vertices[0].X = 0;
    vertices[0].Y = 0;
    vertices[0].R = 255;

    vertices[1].X = triSideLen;
    vertices[1].Y = 0;
    vertices[1].G = 255;

    vertices[2].X = triSideLen;
    vertices[2].Y = triSideLen;
    vertices[2].B = 255;

    /* Move the vertices' origin to the middle of the screen. */
    for (i = 0; i < 3; i++)
    {
        vertices[i].X += ((SCREEN_WIDTH / 2) - (triSideLen / 2));
        vertices[i].Y += ((SCREEN_HEIGHT / 2) - (triSideLen / 2));
    }

    TRIANGLE[0] = &vertices[0];
    TRIANGLE[1] = &vertices[1];
    TRIANGLE[2] = &vertices[2];

    return 1;
}

static void render_frame(void)
{
    ULONG dummy;

    /* Wait for vsync. */
    while (!(S3D->S3DTK_GetState(S3D, S3DTK_DISPLAYADDRESSUPDATED, (ULONG)&dummy)));

    /* Clear the frame. */
    S3D->S3DTK_RectFill(S3D, &RENDER_SURFACE[BACK_BUFFER_IDX], &SCREEN_RECT, 0);

    /* Draw the triangle. */
    S3D->S3DTK_TriangleSet(S3D, (ULONG*)TRIANGLE, 3, S3DTK_TRILIST);

    /* Flip the surface. */
    S3D->S3DTK_SetState(S3D, S3DTK_DISPLAYSURFACE, (ULONG)&RENDER_SURFACE[BACK_BUFFER_IDX]);
    S3D->S3DTK_SetState(S3D, S3DTK_DRAWSURFACE, (ULONG)&RENDER_SURFACE[!BACK_BUFFER_IDX]);
    BACK_BUFFER_IDX = !BACK_BUFFER_IDX;
}

static void release(void)
{
    if (S3D)
    {
        S3D->S3DTK_SetState(S3D, S3DTK_VIDEOMODE, ORIGINAL_VIDEO_MODE);
        S3DTK_DestroyRenderer((void**)&S3D);
        S3DTK_ExitLib();
    }
}

int main(void)
{
    if (
        !initialize_triangle() ||
        !initialize_rendering()
    ){
        return EXIT_FAILURE;
    }

    while (!kbhit())
    {
        render_frame();
    }

    release();
    return EXIT_SUCCESS;
}
