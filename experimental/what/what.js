// WHAT: Concatenated JavaScript source files
// PROGRAM: What?
// VERSION: alpha live (12 November 2020 00:16:38 UTC)
// AUTHOR: Tarpeeksi Hyvae Soft
// LINK: https://www.github.com/leikareipa/luujanko/
// FILES:
//	./src/what/what.js
//	./src/what/canvas-spectrogram.js
//	./src/what/vue-ui.js
//	./src/what/initialize.js
/////////////////////////////////////////////////
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: What?
*
*/
"use strict";
// What's top-level namespace.
export const What = {
version: {family:"alpha",major:"0",minor:"0",dev:true}
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: What?
*
*/
"use strict";
// Provides handy functions for drawing a spectrogram onto a canvas element.
//
// Usage:
//
//   1. Create a new canvas_spectrogram object:
//
//      const canvasElement = document.getElementById("your-canvas-element");
//      const spectrogram = canvas_spectrogram(canvasElement);
//
//   2. Paint spectra onto the spectrogram (assumes 'audioAnalyzer' is an AnalyserNode
//      object):
//
//      const timePos = 0.5;
//      const spectrum = new Uint8Array(audioAnalyzer.frequencyBinCount);
//      audioAnalyzer.getByteFrequencyData(spectrum);
//      spectrogram.add_spectrum(spectrum, timePos);
//
//   3. Draw the spectrogram onto the canvas:
//
//      spectrogram.paint();
//
//   4. Should you want to reset the spectrogram to its original state:
//
//      spectrogram.reset();
//      spectrogram.paint();
//
What.canvas_spectrogram = function(canvasElement)
{
const canvasWidth = canvasElement.width;
const canvasHeight = canvasElement.height;
const renderContext = canvasElement.getContext("2d");
const canvasImage = renderContext.getImageData(0, 0, canvasWidth, canvasHeight);
const playbackRateMap = new Array(canvasWidth).fill(Infinity);
const publicInterface = {
// Paints the given spectrum (an array of frequency bins of Uint8 amplitude
// values - see AnalyserNode.getByteFrequencyData()) onto the spectrogram.
// The 'time' argument gives a value in the range [0,1] identifying the
// temporal position of the spectrum in the spectrogram: a value of 0 means
// the very beginning and 1 the very end. The 'playbackRate' argument gives
// the video playback rate associated with the given spectrum.
add_spectrum: function(spectrum, time, playbackRate)
{
const x = Math.floor(canvasWidth * time);
// Don't allow higher playback rates (less accurate spectra) override
// lower playback rates (more accurate spectra).
if (playbackRateMap[x] < playbackRate)
{
return;
}
// If this spectrum is of a lower playback rate than previously set, allow
// its values to override all previously-set values.
const alwaysOverwriteValues = (playbackRateMap[x] > playbackRate);
for (let y = 0; y < canvasHeight; y++)
{
const log = -Math.log10(1 - (y / (canvasHeight + 1)));
const sampleIdx = Math.floor(log * ((spectrum.length / 2) - 1));
const amplitude = Math.round(255 - Math.min(255, (spectrum[sampleIdx] * 2.5)));
// Allow higher amplitudes to override lower amplitudes, so we end up
// recording the highest amplitude at this horizontal bin.
if (alwaysOverwriteValues ||
(get_spectrum_value(x, y) >= amplitude))
{
set_spectrum_value(x, y, amplitude);
}
}
playbackRateMap[x] = playbackRate;
},
paint: function()
{
renderContext.putImageData(canvasImage, 0, 0);
},
reset: function()
{
for (let y = 0; y < canvasHeight; y++)
{
for (let x = 0; x < canvasWidth; x++)
{
const idx = ((x + y * canvasWidth) * 4);
canvasImage.data[idx+0] = 255;
canvasImage.data[idx+1] = 255;
canvasImage.data[idx+2] = 255;
canvasImage.data[idx+3] = 0;
}
}
},
};
publicInterface.reset();
publicInterface.paint();
const backgroundColor = {r:255, g: 255, b:255} ;
const colorGradient = [
{r:220, g:220, b:220},
{r:175, g:175, b:175},
{r:125, g:125, b:125},
{r:50,  g:50,  b:50 },
{r:0,   g:0,   b:0  },
];
return publicInterface;
function set_spectrum_value(x, y, value)
{
y = (canvasHeight - y - 1);
const idx = ((x + y * canvasWidth) * 4);
const colorIdx = Math.floor(colorGradient.length * ((255 - value) / 256));
const color = ((value == 255)? backgroundColor : colorGradient[colorIdx]);
canvasImage.data[idx+0] = color.r;
canvasImage.data[idx+1] = color.g;
canvasImage.data[idx+2] = color.b;
canvasImage.data[idx+3] = 255;
}
function get_spectrum_value(x, y)
{
y = (canvasHeight - y - 1);
const idx = ((x + y * canvasWidth) * 4);
return canvasImage.data[idx+0];
}
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: What?
*
*/
"use strict";
import Vue from "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm.browser.js";
// Creates, initializes, and returns a new Vue object encapsulating What's UI
// logic.
What.vue_ui = function(domElements = {})
{
Vue.directive("visible-if", (el, binding)=>
{
el.style.visibility = (binding.value? "visible" : "hidden");
});
const playbackRateValues = [1, 4, 8, 16];
return new Vue({
el: "#app",
data: {
isVideoLoaded: false,
isVideoPlaying: false,
isVideoProcessingFinished: false,
isSeekBarExpanded: false,
playbackRate: playbackRateValues[0],
},
methods: {
increase_playback_rate: function()
{
playbackRateValues.push(playbackRateValues.shift());
this.playbackRate = playbackRateValues[0];
domElements.videoPlayer.playbackRate = this.playbackRate;
},
toggle_video_playback: function()
{
if (this.isVideoPlaying)
{
domElements.videoPlayer.pause();
this.isVideoPlaying = false;
}
else
{
domElements.videoPlayer.play();
this.isVideoPlaying = true;
}
},
toggle_seekbar_expansion: function()
{
this.isSeekBarExpanded = !this.isSeekBarExpanded;
},
}
});
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: What?
*
*/
"use strict";
// Connects What's DOM elements to its program code. This should run exactly once in What's
// lifetime, at the start of program execution.
(function()
{
const ui = What.vue_ui({
get videoPlayer() {return playerElement},
});
const playerElement = document.getElementById("video-player");
const seekBarElement = document.getElementById("seek-bar");
const fileSelectorElement = document.getElementById("video-file-selector");
const spectrogram = What.canvas_spectrogram(document.getElementById("spectrogram"));
window.onkeydown = (event)=>
{
if ((event.key === " ") &&
ui.isVideoLoaded)
{
ui.toggle_video_playback();
}
};
// Seek the video when the user clicks on the seek bar.
seekBarElement.onclick = (event)=>
{
if (playerElement.locked)
{
return;
}
const barRect = seekBarElement.getBoundingClientRect();
const barWidth = parseFloat(getComputedStyle(seekBarElement).getPropertyValue("width"));
const x = (event.clientX - barRect.left);
const percentPlayback = (x / barWidth);
// Give the audio buffer some time to clear itself, or we'll get artefacts
// in the spectrogram.
playerElement.pause();
playerElement.locked = true;
setTimeout(()=>{
playerElement.currentTime = (playerElement.duration * percentPlayback);
playerElement.play();
playerElement.locked = false;
}, 200);
};
// When the user gives us a video file, begin playing it and rendering its audio
// into the spectrogram.
fileSelectorElement.onchange = (event)=>
{
if (!event.target ||
!event.target.files ||
!event.target.files.length)
{
window.alert("Unknown file type.");
return;
}
const videoFile = event.target.files[0];
if (!videoFile.type.match("video.*"))
{
window.alert("Only video files are supported.");
fileSelectorElement.value = "";
return;
}
playerElement.src = URL.createObjectURL(videoFile);
playerElement.playbackRate = ui.playbackRate;
playerElement.onplay = ()=>
{
ui.isVideoLoaded = true;
ui.isVideoPlaying = true;
document.title = `${videoFile.name} - What?`;
}
playerElement.onpause = ()=>
{
ui.isVideoPlaying = false;
}
playerElement.onended = ()=>
{
ui.isVideoProcessingFinished = true;
playerElement.currentTime = 0;
playerElement.play();
}
playerElement.onerror = ()=>
{
window.alert("Something went wrong while playing the video.");
}
playerElement.onclick = ()=>
{
ui.toggle_video_playback();
}
const audioContext = new AudioContext();
const audioSource = audioContext.createMediaElementSource(playerElement);
const audioAnalyzer = audioContext.createAnalyser();
audioSource.connect(audioAnalyzer);
audioAnalyzer.connect(audioContext.destination);
playerElement.play();
// Sample the audio buffer every x milliseconds.
setInterval(()=>
{
const playbackPos = ((playerElement.currentTime / playerElement.duration) || 0);
const spectrum = new Uint8Array(audioAnalyzer.frequencyBinCount);
audioAnalyzer.getByteFrequencyData(spectrum);
spectrogram.add_spectrum(spectrum, playbackPos, ui.playbackRate);
}, 0);
};
(function refresh_seek_bar()
{
if (!playerElement.paused)
{
spectrogram.paint();
const percentProgress = ((playerElement.currentTime / playerElement.duration) * 100);
document.getElementById("position-indicator").style.left = `${percentProgress}%`;
}
requestAnimationFrame(refresh_seek_bar);
})();
})();
