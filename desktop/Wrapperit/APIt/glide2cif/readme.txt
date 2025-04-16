glide2cif

A graphics wrapper that translates Glide 2.4 to ATI3DCIF for running certain
Glide applications on the ATI Rage Pro.

To use the wrapper:
1)Install CIF-supporting drivers from ATI.
2)Enable RGB565 video mode with Rage Pro Tweaker (or via some other method).
3)Put GLIDE2X.DLL next to the target executable (see Supported applications).

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

System requirements

* ATI Rage Pro (Turbo) with 8 MB of memory
* Fast Pentium II (Pentium III or better recommended)
* Few extra MB of system memory
* One of the supported applications

Recognized environment variables

* G2C_RENDER_CAREFULLY
* G2C_SAMPLE_NEAREST
* G2C_SHOW_FPS
* G2C_SWAPINTERVAL

Supported applications

* Croc 1.0
* GLQuake w/ 3dfx MiniGL 1.49
* Grand Prix Legends (a)
* Ignition
* Screamer 2 w/ Glidos 1.59 (b)

(a)Can cause system instability. For FPS, set G2C_RENDER_CAREFULLY=0.
(b)For FPS, set G2C_SWAPINTERVAL=0 and use cockpit view.
