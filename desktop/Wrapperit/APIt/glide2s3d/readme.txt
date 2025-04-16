glide2s3d
^^^^^^^^^
An alpha-level graphics wrapper that translates Glide 2.4 calls into S3d for
running on the S3 ViRGE.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

System requirements
^^^^^^^^^^^^^^^^^^^
- Windows 9x or compatible
- S3d-compatible video card, preferably with 4 MB of video memory
- Pentium 2 or better

Troubleshooting
^^^^^^^^^^^^^^^
The ViRGE platform is considerably more limited compared to the Voodoo; many
Glide games are simply too demanding to work well on it. This should be your
baseline expectation when using this wrapper.

For the many games that have issues, the GLIDE2X.INI file exposes some wrapper
options for you to tweak.

Compatibility report
^^^^^^^^^^^^^^^^^^^^
The following applications have been tested to some extent using this wrapper
with an emulated ViRGE/DX in 86Box. The emulated machine also included a Voodoo
to bypass hardware checks enforced by some Glide games.

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
