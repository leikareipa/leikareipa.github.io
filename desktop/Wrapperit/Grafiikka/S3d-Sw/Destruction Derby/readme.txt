This is a software-rendered wrapper for the S3d version of Destruction Derby.
Other S3d games are not supported. ArtisaaniSoft, 2025.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.


System requirements
===================

At minimum, the wrapper requires a Pentium 1 or compatible CPU. Pentium 2 or
better is recommended.

The game was released for Windows 95 and should work as-is in Windows 98 and Me
as well. It may also work in Windows 2000 and XP by using DxWrapper and Windows
9x compatibility mode. On Linux, recent versions of Wine should be able to run
the game (set the Windows version to 95 or 98).

For DxWrapper, try these settings:

    [Compatibility]
    Dd7to9 = 1
    HandleExceptions = 1


Troubleshooting
===============

- By default, the game uses a 512 x 384 video mode, which is not well supported
  on some platforms. You may see a crash on startup or a garbled screen. As a
  solution, enable the VideoMode640x480 setting in the INI file.

- In-game menus may be overly sensitive to input on fast computers. You can use
  the MaximumFPS INI setting to limit the speed.

- For slow systems (e.g. Pentium 1), the 512 x 384 and 640 x 480 video modes
  will be too demanding. Use the "VideoMode640x480 = 3" INI setting to render
  the game in 320 x 240.
