This is an alpha-level Glide wrapper for the S3d API, translating Glide 2.4
calls into S3d. ArtisaaniSoft, 2025.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.


System requirements
===================

An OS supported by the Glide application you want to run.

An S3d compatible video card, ideally with at least 4 MB of video memory.

A Pentium 2 or better could be recommended.


Troubleshooting
===============

The S3d platform is considerably less performant and more feature poor than the
Glide platform. As such, many Glide games will simply not work well on S3d, and
this should be your baseline expectation when using the wrapper.

That said, some games do work, and for those that don't, the GLIDE2X.INI file
provides some options for you to tweak to try and make them work.

If you find a game produces an "Out of video memory" error, increase
ReduceTextureLOD to reduce the amount of VRAM consumed by textures.


Compatibility report
====================

The author has briefly tested some version of the wrapper with the following
applications using an emulated ViRGE/DX in 86Box. The emulated machine also
included a Voodoo to help bypass hardware checks.

APPLICATION                 STATUS      NOTES
-------------------------------------------------------------------------------
Chaga                       Broken      Exits on launch.

Croc 1.0                    Playable    Some alpha related issues.
                                        
Die by the Sword (demo)     Runs        Glitched menus. Alpha issues and
                                        freezing in-game.

Formula 1                   Runs        Title card flickers. Menus and in-game
                                        very glitched.

Formula 1 97 (demo)         Runs        Menus and in-game quite glitched.

GLQuake (MiniGL 1.49)       Playable    Some texture glitches. No perspective
                                        correction.

Grand Prix Legends          Runs        Menus glitch and flicker. In-game
                                        extremely glitched.
                                
Ignition                    Playable    Use the game-specific wrapper.

Monaco Grand Prix: Racing
Simulation 2                Runs        Menus work. Exits when loading race.

Monster Truck Madness 2     Playable    Use the game-specific wrapper.

Need for Speed 2 SE         Runs        In-game very glitched. Race from chase
                                        view to see anything.

POD Gold                    Playable    Some visual glitches in-game. Choppy.

Red Baron 3D (demo)         Runs        Menus work; in-game very glitched.

Redline Racer               Playable    Several types of visual glitches.

Volcano (demo)              Broken      Wrapper is missing 3DF utilities.
