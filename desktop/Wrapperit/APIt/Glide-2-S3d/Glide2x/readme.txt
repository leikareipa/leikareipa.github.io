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

- Windows 9x

- Some variant of the S3 ViRGE, ideally with 4 MB of video memory

- Pentium 2 or better


Troubleshooting
===============

The S3d platform is considerably less performant and more feature poor than the
Glide platform. As such, many Glide games will simply not work well on S3d, and
this should be your baseline expectation when using the wrapper.

But some games do work, and for those that don't, the GLIDE2X.INI file provides
some options for you to try and tweak to make them work.


Compatibility report
====================

The author has briefly tested some version of the wrapper with the following
applications using an emulated ViRGE/DX in 86Box. The emulated machine also
included a Voodoo to help bypass any hardware checks.

-------------------------------------------------------------------------------
APPLICATION                 STATUS      NOTES
-------------------------------------------------------------------------------
Chaga                       Broken      Exits on launch; probably because the
                                        wrapper is missing 3DF utilities.

Croc 1.0                    Playable    Some transparency issues.
                                        
Die by the Sword            Playable    Some texture issues. Reduce video and
                                        texture resolution to play properly.

Formula 1                   Runs        Title card flickers. Menus and in-game
                                        very glitched.

Formula 1 97 (demo)         Runs        Menus and in-game quite glitched.

GLQuake (MiniGL 1.49)       Playable    Many texture glitches. No perspective
                                        correction.

Grand Prix Legends          Runs        Menus glitch and flicker. In-game
                                        extremely glitched.
                                
Ignition                    Playable    Use the game-specific wrapper.

Monaco Grand Prix: Racing
Simulation 2                Runs        Menus work. Exits when loading race.

Monster Truck Madness 2     Playable    Use the game-specific wrapper.

Need for Speed 2 SE         Playable    Use the game-specific wrapper.

POD Gold                    Playable    Some visual glitches. Choppy.

Redline Racer               Playable    Several types of visual glitches.
-------------------------------------------------------------------------------
