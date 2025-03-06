ArtisaaniSoft, 2025.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.

This wrapper provides a software rendered implementation of the Win32 S3d
Toolkit Library API, version 2.6. It's intended for the benefit of developers
building S3d software in the present and in line with that version of the spec.

You might use this wrapper, for example, to help develop or test your S3d
rendering code without having to use an emulator or real hardware.

The wrapper generally doesn't support pre-2.6 S3d applications nor applications
written for DOS, which seemingly includes all original S3d games from the '90s.

So long as your S3d application follows the examples provided in the S3d 2.6
SDK for Win32, it should work reasonably well with this wrapper. Note that
your application must use DirectDraw for surface management.

You can start by testing the wrapper with S3's S3d render samples, provided
that you first compile them from source.


API compatibility
=================

The following S3d API endpoints have their functionality implemented to some
extent:

    S3DTK_InitLib
    S3DTK_ExitLib
    S3DTK_CreateRenderer
    S3DTK_DestroyRenderer
    S3DTK_SetState
    S3DTK_GetState
    S3DTK_TriangleSet
    S3DTK_BitBlt
    S3DTK_BitBltTransparent
    S3DTK_RectFill
    S3DTK_GetLastError
    S3DTK_PhysicalToLinear
    S3DTK_LinearToPhysical

These endpoints are provided as exports but their functionality has not been
implemented: 

    S3DTK_TriangleSetEx
    S3DTK_EnterCritical
    S3DTK_ReleaseCritical


Limitations
===========

- The following render features have not been implemented (may not be an
  exhaustive list):

    - S3DTK_LINE
    - S3DTK_POINT
    - S3DTK_ALPHASOURCE
    - S3DTK_TEXDECAL
    - S3DTK_CLIPPING_AREA
    - Alpha blending
    - Mipmapping
    - Fog

- Only 16-bit screen modes are supported.

- Textures must be in the S3DTK_TEXARGB1555 format.

- S3DTK_TRILIST are automatically backfaced-culled; S3DTK_TRIFAN and
  S3DTK_TRISTRIP are not.

- S3DTK_ZBUFFERSURFACE is ignored. An internal Z buffer is used.

- The overall visual appearance of the rendering is an approximation of how
  the scene might look when rendered by real S3d hardware. No degree of
  similarity is guaranteed however.


System requirements
===================

The wrapper's renderer focuses on feature completeness over speed, and at this
time isn't optimized for performance. You'll need a fast, modern CPU to run it.

The DLL should work on most x86 compatible platforms.
