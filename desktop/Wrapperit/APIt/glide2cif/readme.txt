glide2cif Alpha

A graphics wrapper that translates Glide 2.4 to ATI's 3D CIF for running on
the Rage Pro.

To use the wrapper:
 1) Install CIF-supporting drivers from ATI.
 2) Enable RGB565 video mode with Rage Pro Tweaker (or via some other method).
 3) Put GLIDE2X.DLL next to the target executable.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

System requirements

* ATI Rage Pro (Turbo) with 8 MB of memory
* Pentium II or equivalent (Pentium III or better recommended)
* A few extra MB of system memory

Caveats

* No fog.
* No mipmapping.
* Some depth issues will always exist as the Rage has no native W-buffering.
* FRAPS may interfere with CIF rendering.
* Maximum in-game resolution may be limited to the resolution of the desktop.

Compatibility report

Status      Glide application (tested with ATI driver 4.11.2548)
===============================================================================
Playable    Croc 1.0
Playable    Die by the Sword (demo)
Playable    F-22 Lightning 3 (demo)
Playable    GLQuake (3dfx MiniGL 1.49)
Playable    Ignition
Playable    Monster Truck Madness 2 (demo)
Playable    Motorhead
Runs(1)     Need for Speed II Special Edition
Runs        Quake 2
Broken      Carmageddon 2 (demo)
Broken      F1 Racing Simulation
Broken      Formula One
Broken      Formula One '97 (demo)
Broken      Gex (demo)
Broken      Grand Prix Legends
Broken      Manx TT Super Bike (demo)
Broken      Monaco Grand Prix Racing Simulation 2 (demo)
Broken      Montezuma's Return (demo)
Broken      Red Baron 3D (demo)
Broken      Redline Racer
Broken      Turok (demo)

(1)The intro animation plays, after which the screen is black. The game is
running, just not rendering anything while in the menus. Press the down
arrow key four times followed by Enter to get into a race.
