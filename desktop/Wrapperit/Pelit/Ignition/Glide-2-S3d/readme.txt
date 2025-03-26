This is a Glide-to-S3d wrapper optimized for Ignition. ArtisaaniSoft, 2025.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.


System requirements
===================

- An OS supported by Ignition

- Release 3 of the 3Dfx patch for Ignition (other releases not tested)

- S3d compatible video card (e.g. S3 ViRGE)

- Pentium 2 or better


Suggested INI settings
======================

Below are some recommended INI settings for various hardware. Keep in mind that
different ViRGE cards of the same model can perform very differently depending
on clock speeds, memory type, etc. Take these as a starting point.

S3 ViRGE (slow):

    VideoMode = 3
    AllowPerspectiveCorrect = 0
    AllowTextureFilter = 0
    RemoveAlphaEffects = 1
    TextureFormat = 0
    
S3 ViRGE (fast):

    VideoMode = 3
    AllowPerspectiveCorrect = 1
    AllowTextureFilter = 1
    RemoveAlphaEffects = 1
    TextureFormat = 0

S3 ViRGE/DX:

    VideoMode = 0
    AllowPerspectiveCorrect = 1
    AllowTextureFilter = 1
    RemoveAlphaEffects = 1
    TextureFormat = 0

S3 ViRGE/GX2 (fast):

    VideoMode = 1
    AllowPerspectiveCorrect = 1
    AllowTextureFilter = 1
    RemoveAlphaEffects = 1
    TextureFormat = 0


Troubleshooting
===============

- The intro cinematic following the language selection screen must be skipped
  or the system will freeze. Rapid-fire Enter at the language selection until
  you're in-game.

- For greater texture detail, or if you receive an "Out of video memory" error,
  reduce the game's resolution and/or color depth (VideoMode option in the
  INI), or select a video card with more VRAM.
    
    - A 4 MB ViRGE supports the game's maximum texture size at 320 x 200
      (16-bit). At higher resolutions and color depths, textures are limited to
      half their maximum size.
  
    - A 2 MB ViRGE is not able to support the game's maximum texture size at
      any resolution. Textures are limited to half their maximum size at
      320 x 200. Higher resolutions are not recommended with this hardware.

- There are some minor visual glitches here and there. Nothing to be alarmed
  about.
