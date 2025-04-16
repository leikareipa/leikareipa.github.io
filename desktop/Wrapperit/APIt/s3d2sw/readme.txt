s3d2sw
^^^^^^
Directs the API endpoints of the S3d Toolkit Library for Windows version 2.6 to
a software renderer. Intended to be run on modern CPUs but doesn't constitute a
compatibility layer.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

The following S3d API endpoints are implented, either fully or partially:

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

The following endpoints are provided as dummy exports without implementation:

    S3DTK_TriangleSetEx
    S3DTK_EnterCritical
    S3DTK_ReleaseCritical

The following API features are unsupported (may not be an exhaustive list):

    S3DTK_LINE
    S3DTK_CLIPPING_AREA
    S3DTK_TEXARGB4444
    S3DTK_TEXPALETTIZED8
    S3DTK_TEXBLENDINGMODE
    Alpha blending (16-bit)
    Fog (16-bit)
    Mipmapping
    Dithering

Further notes:
    
    S3DTK_TRILIST is automatically backfaced-culled; S3DTK_TRIFAN and
    S3DTK_TRISTRIP are not.
    
    S3DTK_ZBUFFERSURFACE is ignored. An internal Z buffer is used.
