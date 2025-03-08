This is a software-rendered wrapper for the S3d version of Havoc. Other S3d
games are not supported. ArtisaaniSoft, 2025.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.


System requirements
===================

At minimum, the wrapper requires a CPU that supports SSE2 (e.g. Pentium 4).

The game was released for Windows 95 and should work as-is in Windows 98 and Me
as well. You may see issues in later versions of Windows due to the fact that
the game's rendering is done in 16-bit mode and its menus are in 8-bit mode,
both of these modes being increasingly not supported on newer systems. On such
systems, you may find that DxWrapper allows the game to run.


Troubleshooting
===============

- On systems whose 16-bit video mode is RGB565, the in-game HUD at the bottom
  of the screen may render with incorrect (greenish) colors.

- The windowed view or whatever it's called (activated by pressing +/-) is not
  supported and will cause the game to exit to desktop.
