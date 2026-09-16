/*
 * rally.js - the browser platform layer: the page's script.
 *
 * Does for the browser what win32_main.c does for Windows, around the core
 * built to WebAssembly (rally-core.js / .wasm, from web_main.c):
 *
 * - Files: fetches rallys.zip (the original demo archive, served unmodified
 *   next to the page) and unpacks it in memory. The files the game writes
 *   (GAME.DTA, HITABLE.TXT, RESULTS.DTA) are kept in the browser's
 *   localStorage and override the archive's copies on later visits.
 * - Video: the 320 x 200 frame on a canvas covering the page, at whole
 *   multiples or filling it, with square pixels or the 4:3 shape
 *   (win32_main.c's modes; sharp bilinear where the scale isn't whole).
 * - Input: KeyboardEvent.code to PC scan codes (set 1); on a touch screen,
 *   the on-screen controls of touch.js, as the same scan codes.
 * - Timing: requestAnimationFrame with win32_main.c's accumulator: ticks at
 *   23.36 Hz (the DOS rate on real hardware) or 35.04 Hz.
 * - Audio: Web Audio pulling the core's mix at 22,050 Hz.
 *
 * Page address options:
 *   ?race   one race with GAME.DTA's settings, then the end (as RALLYE.EXE)
 *   ?35hz   the designed 35.04 frames per second instead of 23.36
 *   ?43     the 4:3 shape        ?fill   fill the page
 *   ?reset  forget the saved files first (back to the demo's own)
 *   ?stats  show frame pacing statistics over the picture (see "Statistics")
 *   ?stun=URL  the STUN server for two-player races (default: Google's
 *           public one); ?stun=none for none (then only local connections
 *           work). Two-player races start from the menu (race type
 *           "Network"; see "Two-player races").
 *   ?turn=URL&turnuser=NAME&turnpass=PASSWORD  a TURN server (a relay) for
 *           two-player races whose networks can't connect directly
 *   ?relay  two-player races only through the TURN server (to test it)
 *   ?touch  show the touch controls from the start and keep them (they
 *           otherwise appear on the first touch and go at the first key)
 *   ?test   for automated tests only (see startTestMode)
 * For fullscreen, the browser's own (F11), or the touch controls' button in
 * the menu. The game doesn't pause when the
 * window loses focus (see "Focus and visibility"). Quitting at the menu
 * returns to the splash panel (see gameQuit).
 */
'use strict';

(function () {
    var ZIP_URL = 'rallys.zip';
    var FILE_PREFIX = 'rallysport.file.';     /* localStorage: files the game wrote, base64 */
    var NETWORK_KEY = 'rallysport.network';     /* localStorage: the race type "Network" was saved (GAME.DTA says "Normal") */
    var MAX_CATCH_UP_TICKS = 4;
    var AUDIO_BUFFER_SAMPLES = 1024;            /* ~46 ms at 22,050 Hz */
    var W = 320, H = 200;

    var stage = document.getElementById('stage');
    var canvas = document.getElementById('screen');
    var overlay = document.getElementById('overlay');
    var ctx = canvas.getContext('2d', { alpha: false });

    var core = null;            /* the Emscripten module */
    var files = new Map();      /* upper-case name -> Uint8Array */
    var running = false, ended = false;
    var frameRequest = 0;       /* the pending requestAnimationFrame */
    var audio = null;

    /* ---- Settings ---- */

    var settings = { aspect43: false, fill: false, pace35: false };
    var params = new URLSearchParams(location.search);
    var raceOnly = params.has('race');
    var testMode = params.has('test');     /* for automated tests (tests/web-check.mjs): see the end */

    function storageSet(key, value) {
        try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
    }
    function storageRemove(key) {
        try { localStorage.removeItem(key); } catch (e) { /* nothing to do */ }
    }

    settings.aspect43 = params.has('43');
    settings.fill = params.has('fill');
    settings.pace35 = params.has('35hz');
    var playerPower = /^[0-9]+$/.test(params.get('power') || '') ? parseInt(params.get('power'), 10) : -1;
    if (params.has('reset')) forgetSavedFiles();

    /* ---- Messages over the picture ---- */

    function showMessage(html, clickable) {
        overlay.innerHTML = html;
        overlay.hidden = false;
        overlay.classList.toggle('clickable', !!clickable);
    }
    function hideMessage() {
        overlay.hidden = true;
    }
    function escapeHtml(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    /* ---- Files ---- */

    function toBase64(bytes) {
        var s = '';
        for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
        return btoa(s);
    }
    function fromBase64(text) {
        var s = atob(text), bytes = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
        return bytes;
    }

    /* Inflates raw deflate data with the browser's DecompressionStream. */
    function inflateRaw(data) {
        var stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return new Response(stream).arrayBuffer().then(function (b) { return new Uint8Array(b); });
    }

    /*
     * Reads a zip archive's central directory and unpacks its files (stored
     * or deflated) into the files map, by upper-case name without folders.
     */
    function unzip(buffer) {
        var bytes = new Uint8Array(buffer);
        var view = new DataView(buffer);
        var eocd = -1, i;

        for (i = bytes.length - 22; i >= 0 && i >= bytes.length - 22 - 65535; i--) {
            if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
        }
        if (eocd < 0) throw new Error('rallys.zip is not a zip archive');

        var count = view.getUint16(eocd + 10, true);
        var p = view.getUint32(eocd + 16, true);
        var jobs = [];
        for (i = 0; i < count; i++) {
            if (view.getUint32(p, true) !== 0x02014b50) throw new Error('rallys.zip: damaged directory');
            var method = view.getUint16(p + 10, true);
            var compSize = view.getUint32(p + 20, true);
            var size = view.getUint32(p + 24, true);
            var nameLen = view.getUint16(p + 28, true);
            var extraLen = view.getUint16(p + 30, true);
            var commentLen = view.getUint16(p + 32, true);
            var local = view.getUint32(p + 42, true);
            var name = String.fromCharCode.apply(null, bytes.subarray(p + 46, p + 46 + nameLen));
            p += 46 + nameLen + extraLen + commentLen;

            if (name.endsWith('/')) continue;
            name = name.split('/').pop().toUpperCase();
            var start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
            var data = bytes.subarray(start, start + compSize);
            if (method === 0) {
                files.set(name, data.slice());
            } else if (method === 8) {
                jobs.push((function (n, d, s) {
                    return inflateRaw(d).then(function (out) {
                        if (out.length !== s) throw new Error('rallys.zip: ' + n + ' unpacks wrong');
                        files.set(n, out);
                    });
                })(name, data, size));
            } else {
                throw new Error('rallys.zip: ' + name + ' uses an unsupported compression method');
            }
        }
        return Promise.all(jobs);
    }

    /* The files the game wrote on earlier visits replace the archive's. */
    function loadSavedFiles() {
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.indexOf(FILE_PREFIX) === 0) {
                    files.set(key.substring(FILE_PREFIX.length), fromBase64(localStorage.getItem(key)));
                }
            }
        } catch (e) { /* no storage: the archive's files only */ }
    }

    function writeFile(name, bytes) {
        files.set(name, bytes);
        storageSet(FILE_PREFIX + name, toBase64(bytes));   /* if storage fails, it lasts until the page closes */
        return true;
    }

    function forgetSavedFiles() {
        var keys = [];
        try {
            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).indexOf(FILE_PREFIX) === 0) keys.push(localStorage.key(i));
            }
        } catch (e) { /* nothing stored */ }
        keys.forEach(storageRemove);
        storageRemove(NETWORK_KEY);
    }

    /* The menu's race type "Network": offered, and restored as last saved (before each game_init). */
    var networkSaved = false;
    function offerNetwork() {
        try { networkSaved = localStorage.getItem(NETWORK_KEY) === '1'; } catch (e) { networkSaved = false; }
        core._web_set_duel_available(1);
        core._web_set_duel_chosen(networkSaved ? 1 : 0);
    }
    function saveNetwork() {
        var chosen = core._web_duel_chosen() === 1;
        if (chosen === networkSaved) return;
        networkSaved = chosen;
        if (chosen) storageSet(NETWORK_KEY, '1'); else storageRemove(NETWORK_KEY);
    }

    /* ---- Video ---- */

    var source = document.createElement('canvas');     /* the 320 x 200 frame */
    source.width = W;
    source.height = H;
    var sourceCtx = source.getContext('2d', { alpha: false });
    var image = sourceCtx.createImageData(W, H);
    var prescaled = document.createElement('canvas');  /* the whole-multiple step of sharp bilinear */
    var prescaledCtx = prescaled.getContext('2d', { alpha: false });

    /* Copies the core's latest frame into the source canvas. */
    function updateFrame() {
        var ptr = core._web_render();
        image.data.set(core.HEAPU8.subarray(ptr, ptr + W * H * 4));
        sourceCtx.putImageData(image, 0, 0);
    }

    /*
     * Draws the frame as win32_main.c's present() does: centred, black
     * borders; at the largest whole multiple of the shape that fits, or (fill)
     * as large as fits. Where the scale isn't whole, the frame is first scaled
     * by whole numbers with nearest neighbour, then the rest of the way with
     * bilinear filtering: even rows, edges softened by less than a pixel.
     */
    function present() {
        var dpr = window.devicePixelRatio || 1;
        var cw = Math.max(1, Math.round(stage.clientWidth * dpr));
        var ch = Math.max(1, Math.round(stage.clientHeight * dpr));
        var aw = W, ah = settings.aspect43 ? W * 3 / 4 : H;
        var k = Math.min(Math.floor(cw / aw), Math.floor(ch / ah));
        var w, h;

        if (canvas.width !== cw || canvas.height !== ch) {
            canvas.width = cw;
            canvas.height = ch;
        }
        if (!settings.fill && k >= 1) {
            w = aw * k;
            h = ah * k;
        } else if (cw * ah > ch * aw) {
            h = ch;
            w = Math.floor(ch * aw / ah);
        } else {
            w = cw;
            h = Math.floor(cw * ah / aw);
        }
        /* (With the touch controls, any spare height goes below the picture, for them.) */
        var x = (cw - w) >> 1, y = touch.isVisible() ? 0 : (ch - h) >> 1;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, cw, ch);
        if (w <= 0 || h <= 0) return;

        var kx = Math.max(1, Math.floor(w / W)), ky = Math.max(1, Math.floor(h / H));
        if (w === W * kx && h === H * ky) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(source, x, y, w, h);
            return;
        }
        if (prescaled.width !== W * kx || prescaled.height !== H * ky) {
            prescaled.width = W * kx;
            prescaled.height = H * ky;
        }
        prescaledCtx.imageSmoothingEnabled = false;
        prescaledCtx.drawImage(source, 0, 0, W * kx, H * ky);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'low';     /* bilinear */
        ctx.drawImage(prescaled, x, y, w, h);
    }

    window.addEventListener('resize', function () { if (initialized) present(); });

    /* ---- Keyboard ---- */

    /*
     * KeyboardEvent.code to PC scan codes (set 1), as the original's keyboard
     * interrupt read them from port 60h. Like the original (and the Win32
     * layer) the extended-key prefix is ignored, so the arrows share codes
     * with the numeric keypad.
     */
    var SCANCODES = {
        Escape: 0x01, Digit1: 0x02, Digit2: 0x03, Digit3: 0x04, Digit4: 0x05, Digit5: 0x06,
        Digit6: 0x07, Digit7: 0x08, Digit8: 0x09, Digit9: 0x0A, Digit0: 0x0B, Minus: 0x0C,
        Equal: 0x0D, Backspace: 0x0E, Tab: 0x0F, KeyQ: 0x10, KeyW: 0x11, KeyE: 0x12, KeyR: 0x13,
        KeyT: 0x14, KeyY: 0x15, KeyU: 0x16, KeyI: 0x17, KeyO: 0x18, KeyP: 0x19,
        BracketLeft: 0x1A, BracketRight: 0x1B, Enter: 0x1C, ControlLeft: 0x1D, KeyA: 0x1E,
        KeyS: 0x1F, KeyD: 0x20, KeyF: 0x21, KeyG: 0x22, KeyH: 0x23, KeyJ: 0x24, KeyK: 0x25,
        KeyL: 0x26, Semicolon: 0x27, Quote: 0x28, Backquote: 0x29, ShiftLeft: 0x2A,
        Backslash: 0x2B, KeyZ: 0x2C, KeyX: 0x2D, KeyC: 0x2E, KeyV: 0x2F, KeyB: 0x30, KeyN: 0x31,
        KeyM: 0x32, Comma: 0x33, Period: 0x34, Slash: 0x35, ShiftRight: 0x36,
        NumpadMultiply: 0x37, AltLeft: 0x38, Space: 0x39, CapsLock: 0x3A, F1: 0x3B, F2: 0x3C,
        F3: 0x3D, F4: 0x3E, F5: 0x3F, F6: 0x40, F7: 0x41, F8: 0x42, F9: 0x43, F10: 0x44,
        NumLock: 0x45, ScrollLock: 0x46, Numpad7: 0x47, Numpad8: 0x48, Numpad9: 0x49,
        NumpadSubtract: 0x4A, Numpad4: 0x4B, Numpad5: 0x4C, Numpad6: 0x4D, NumpadAdd: 0x4E,
        Numpad1: 0x4F, Numpad2: 0x50, Numpad3: 0x51, Numpad0: 0x52, NumpadDecimal: 0x53,
        IntlBackslash: 0x56, F11: 0x57, F12: 0x58,
        /* extended keys (E0 prefix, ignored) */
        NumpadEnter: 0x1C, ControlRight: 0x1D, NumpadDivide: 0x35, AltRight: 0x38,
        Home: 0x47, ArrowUp: 0x48, PageUp: 0x49, ArrowLeft: 0x4B, ArrowRight: 0x4D,
        End: 0x4F, ArrowDown: 0x50, PageDown: 0x51, Insert: 0x52, Delete: 0x53
    };
    /* Keys left to the browser (reload, its own fullscreen, developer tools). */
    var BROWSER_KEYS = { F5: true, F11: true, F12: true };

    function onKey(e, down) {
        if (!running) return;
        var sc = SCANCODES[e.code];
        if (sc === undefined || BROWSER_KEYS[e.code]) return;
        core._web_set_key(sc, down ? 1 : 0);
        if (!e.ctrlKey && !e.metaKey) e.preventDefault();   /* no scrolling, menu bar... */
    }
    window.addEventListener('keydown', function (e) { onKey(e, true); });
    window.addEventListener('keyup', function (e) { onKey(e, false); });

    /* ---- Touch ---- */

    /* The on-screen controls (touch.js): the same scan codes as the keyboard. */
    var touch = window.createRallyTouch({
        stage: stage,
        before: overlay,
        forced: params.has('touch'),
        setKey: function (scancode, down) { core._web_set_key(scancode, down ? 1 : 0); },
        raceKey: function (key) { return core._web_key_scancode(key); },
        gameState: function () { return running ? core._web_state() : -1; },
        editing: function () { return core._web_menu_editing() !== 0; },
        onGesture: function () {
            /* (Some browsers keep a context suspended until a gesture they count.) */
            if (audio && audio.ctx.state !== 'running' && !document.hidden) audio.ctx.resume().catch(function () {});
        }
    });

    /* ---- Focus and visibility ---- */

    /*
     * No pausing (unlike the Win32 layer; author, 2026-11-06): the game runs
     * on when the window loses focus, so that two players can race in two
     * windows on one machine and a two-player race doesn't wait for a window
     * that isn't in front. The keys count as released when the window loses
     * focus (their key-up events would go elsewhere). In a hidden tab the
     * browser stops animation frames, so the game stands still there anyway;
     * its sound is then silenced, and on return at most 4 ticks are caught up.
     */
    window.addEventListener('blur', function () {
        touch.reset();
        if (core) core._web_release_keys();
    });
    document.addEventListener('visibilitychange', function () {
        touch.reset();
        if (core) core._web_release_keys();
        if (audio) {
            (document.hidden ? audio.ctx.suspend() : audio.ctx.resume()).catch(function () {});
        }
    });

    /* ---- Audio ---- */

    /*
     * A Web Audio context at the core's 22,050 Hz (the browser resamples to
     * the device), pulling the mix in 1,024-sample blocks as the device needs
     * them, as the Win32 layer refills its buffers. Without Web Audio, or if
     * the browser refuses the rate, the game plays silently.
     */
    function openAudio() {
        var rate = core._web_audio_rate();
        try {
            var actx = new AudioContext({ sampleRate: rate });
            var node = actx.createScriptProcessor(AUDIO_BUFFER_SAMPLES, 0, 1);
            node.onaudioprocess = function (e) {
                var out = e.outputBuffer.getChannelData(0);
                if (!running) {
                    out.fill(0);
                    return;
                }
                var ptr = core._web_mix_audio(out.length) >> 1;
                var samples = core.HEAP16;
                for (var i = 0; i < out.length; i++) out[i] = samples[ptr + i] / 32768;
            };
            node.connect(actx.destination);
            actx.resume().catch(function () {});
            audio = { ctx: actx, node: node };
        } catch (e) {
            audio = null;
        }
    }

    function closeAudio() {
        if (audio) {
            audio.node.disconnect();
            audio.ctx.close().catch(function () {});
            audio = null;
        }
    }

    /* ---- Main loop ---- */

    /*
     * Ticks against real time with win32_main.c's accumulator: units are VGA
     * dots (a frame is 3 refreshes, 23.36 Hz) or, at 35.04 Hz, PIT counts
     * times 1000 (see web_frame_units). At most 4 ticks are caught up after a
     * stall. The frame is drawn when a tick has run.
     */
    var acc = 0, last = null, tickUnits = 0;

    function frame(now) {
        if (!running) return;
        frameRequest = requestAnimationFrame(frame);
        if (last === null) {
            last = now;
            if (stats) stats.restart();
            return;
        }
        var start = performance.now();
        var elapsed = Math.min(now - last, 1000);
        var pace = settings.pace35 ? 1 : 0;
        var ticks = 0;
        last = now;
        if (panelOpen) return;      /* the game is paused while the connection dialog is open */
        acc += elapsed * core._web_units_per_ms(pace);
        while (acc >= tickUnits && running) {
            acc -= tickUnits;
            if (ticks < MAX_CATCH_UP_TICKS) {
                if (!runTick(now)) {
                    /* A two-player race waiting for the other driver: the tick stays owed. */
                    acc = Math.min(acc + tickUnits, tickUnits * MAX_CATCH_UP_TICKS);
                    break;
                }
                ticks++;
                touch.afterTick();
                tickUnits = core._web_frame_units(pace);
            }
            if (core._web_wants_quit() && !gameQuit()) {
                return;
            }
        }
        if (ticks > 0) {
            updateFrame();
            present();
        }
        if (stats) stats.callback(now, elapsed, ticks, performance.now() - start);
    }

    /*
     * One tick: the game's, or in a two-player race, the netcode's step
     * (false if the other driver's controls for it haven't arrived).
     */
    function runTick(now) {
        if (core._web_state() === 3 && core._web_duel_info(8)) {
            return core._web_duel_step(now) !== 0;
        }
        if (conn && conn.racing) return false;      /* just left a two-player race: the connection ends first (duelPoll) */
        core._web_tick();
        return true;
    }

    /* ---- Statistics (?stats) ---- */

    /*
     * Frame pacing, measured over the last 5 seconds and shown in a corner of
     * the page twice a second (not in the game's picture):
     * - the display's refresh rate (from the median interval between
     *   animation-frame callbacks) and the callbacks that came late (missed
     *   refreshes: the browser skipped one or more);
     * - the game's tick rate, and callbacks that ran more than one tick (the
     *   page catching up; a game frame then isn't shown);
     * - how many refreshes each game frame stayed on screen. 23.36 frames/s
     *   on a 60 Hz display give 2 or 3 (about 43% and 57%); anything else is
     *   uneven pacing beyond that. The last ones in order ("cadence");
     * - the longest time spent in one callback (ticks, drawing).
     * Totals since the start are kept too.
     */
    function Stats() {
        var el = document.createElement('div');
        var records = [];       /* { t, interval, ticks, work } per callback */
        var gaps = [];          /* { t, ms } per game frame shown: time since the previous one */
        var lastShown = null, lastReport = 0;
        var totals = { since: performance.now(), missed: 0, catchUps: 0, uneven: 0, shown: 0 };

        el.id = 'stats';
        stage.appendChild(el);

        function median(values) {
            var v = values.slice().sort(function (a, b) { return a - b; });
            return v.length ? v[v.length >> 1] : 0;
        }

        this.restart = function () {
            lastShown = null;
            records.length = 0;
            gaps.length = 0;
            totals = { since: performance.now(), missed: 0, catchUps: 0, uneven: 0, shown: 0 };
        };

        this.callback = function (now, interval, ticks, work) {
            var refresh, expected;

            records.push({ t: now, interval: interval, ticks: ticks, work: work });
            while (records.length && records[0].t < now - 5000) records.shift();
            while (gaps.length && gaps[0].t < now - 5000) gaps.shift();
            refresh = median(records.map(function (r) { return r.interval; })) || 16.67;

            if (records.length > 30 && interval > refresh * 1.5) totals.missed += Math.round(interval / refresh) - 1;
            if (ticks > 1) totals.catchUps++;
            if (ticks > 0) {
                if (lastShown !== null) {
                    gaps.push({ t: now, ms: now - lastShown });
                    totals.shown++;
                    expected = (1000 / refresh) / tickRate();
                    var n = Math.round((now - lastShown) / refresh);
                    if (records.length > 30 && n !== Math.floor(expected) && n !== Math.ceil(expected)) totals.uneven++;
                }
                lastShown = now;
            }
            if (now - lastReport >= 500) {
                lastReport = now;
                report(refresh);
            }
        };

        /* The game's nominal frame rate. */
        function tickRate() {
            var pace = settings.pace35 ? 1 : 0;
            return core._web_units_per_ms(pace) * 1000 / core._web_frame_units(pace);
        }

        function report(refresh) {
            var span = records.length > 1 ? (records[records.length - 1].t - records[0].t) / 1000 : 0;
            var ticks = 0, late = 0, multi = 0, maxWork = 0, counts = {}, cadence = [];
            records.forEach(function (r) {
                ticks += r.ticks;
                if (r.interval > refresh * 1.5) late += Math.round(r.interval / refresh) - 1;
                if (r.ticks > 1) multi++;
                if (r.work > maxWork) maxWork = r.work;
            });
            gaps.forEach(function (g) {
                var n = Math.round(g.ms / refresh);
                counts[n] = (counts[n] || 0) + 1;
            });
            gaps.slice(-24).forEach(function (g) { cadence.push(Math.round(g.ms / refresh)); });
            var shares = Object.keys(counts).sort(function (a, b) { return a - b; }).map(function (n) {
                return n + ': ' + Math.round(100 * counts[n] / gaps.length) + '%';
            }).join('  ');
            var expected = (1000 / refresh) / tickRate();
            el.textContent =
                'last 5 s\n' +
                'display   ' + (1000 / refresh).toFixed(2) + ' Hz (' + refresh.toFixed(2) + ' ms)   missed refreshes: ' + late + '\n' +
                'game      ' + (span ? (ticks / span).toFixed(2) : '-') + ' frames/s (nominal ' + tickRate().toFixed(2) +
                    ')   catch-ups: ' + multi + '\n' +
                'shown for ' + (shares || '-') + '  (refreshes; expected ' + Math.floor(expected) +
                    (Math.ceil(expected) !== Math.floor(expected) ? ' or ' + Math.ceil(expected) : '') + ')\n' +
                'cadence   ' + cadence.join(' ') + '\n' +
                'work      max ' + maxWork.toFixed(2) + ' ms per callback\n' +
                'since start (' + Math.round((performance.now() - totals.since) / 1000) + ' s): missed refreshes ' +
                    totals.missed + ', catch-ups ' + totals.catchUps + ', uneven frames ' + totals.uneven +
                    ' of ' + totals.shown;
        }
    }
    var stats = params.has('stats') ? new Stats() : null;

    var initialized = false;

    function initGame() {
        offerNetwork();
        core._web_set_player_power(playerPower);
        if (!core._web_init(raceOnly ? 1 : 0)) {
            ended = true;
            showMessage('The game could not start.<small>' + escapeHtml(core.UTF8ToString(core._web_error_message())) + '</small>');
            return false;
        }
        initialized = true;
        return true;
    }

    /*
     * Before the player closes the splash panel (browsers require a click or
     * key before sound), the game runs until its first picture that isn't all
     * black (the menu's first frame shows its back buffer before anything has
     * been drawn into it, as VALIKKO.EXE's loop flips first and draws after),
     * shown darkened behind the panel; the start then goes on from there.
     * Returns whether the game could be started.
     */
    function showFirstFrame() {
        if (!initGame()) return false;
        for (var i = 0; i < 10 && !core._web_wants_quit(); i++) {
            core._web_tick();
            updateFrame();
            if (!isBlack(image.data)) break;
        }
        present();
        showMessage('');        /* no text: only the overlay's darkening */
        return true;
    }

    function isBlack(rgba) {
        for (var i = 0; i < rgba.length; i += 4) {
            if (rgba[i] | rgba[i + 1] | rgba[i + 2]) return false;
        }
        return true;
    }

    function startGame() {
        if (running || ended) return;
        if (!initialized && !initGame()) return;
        running = true;
        touch.sync();
        hideMessage();
        openAudio();
        tickUnits = core._web_frame_units(settings.pace35 ? 1 : 0);
        acc = 0;
        last = null;
        updateFrame();
        present();
        if (!testMode) frameRequest = requestAnimationFrame(frame);
    }

    /*
     * The core has ended the game. Quitting at the menu (DOS or Esc) returns
     * to the splash panel, as when the page had loaded: in a browser there is
     * nothing to quit to. (With ?test the game starts again at once, for the
     * tests driving the ticks.) After an error, or the race with ?race
     * (RALLYE.EXE on its own), the game ends with a message instead. Returns
     * whether the game goes on.
     */
    var restarts = 0;

    function gameQuit() {
        if (raceOnly || core.UTF8ToString(core._web_error_message())) {
            endGame();
            return false;
        }
        if (!testMode) {
            backToSplash();
            return false;
        }
        core._web_shutdown();
        offerNetwork();
        if (!core._web_init(0)) {      /* e.g. a file that has gone wrong since */
            endGame();
            return false;
        }
        restarts++;
        tickUnits = core._web_frame_units(settings.pace35 ? 1 : 0);
        return true;
    }

    function backToSplash() {
        running = false;
        touch.sync();
        cancelAnimationFrame(frameRequest);     /* else a quick restart would run two loops */
        closeAudio();
        core._web_release_keys();               /* their key-ups no longer reach the core */
        core._web_shutdown();
        if (showFirstFrame()) window.rallySplashUI.open();
    }

    /* The game has ended (an error, or after the race with ?race). */
    function endGame() {
        var error = core.UTF8ToString(core._web_error_message());
        running = false;
        touch.sync();
        ended = true;
        closeAudio();
        core._web_shutdown();
        document.title = 'Rally-Sport';
        showMessage((error ? 'The game stopped.<small>' + escapeHtml(error) + '</small>'
                           : 'Thanks for playing.') + '<small>Click to play again</small>', true);
    }

    overlay.addEventListener('click', function () {
        if (ended) location.reload();
    });

    /* The splash panel (w95-dialogs/splash.js) has closed. */
    window.rallyStartGame = startGame;

    /* ---- Two-player races ---- */

    /*
     * The menu's race type "Network" (Drive Setup; the core offers it when
     * the page asks, web_set_duel_available) with START asks for a two-player
     * race (web_duel_requested). The connection panel opens; once connected,
     * the race starts when both players have pressed START with "Network".
     * The connection ends with the race (see duelPoll), before the menu runs
     * again, so each two-player race is connected afresh.
     *
     * The two pages connect directly with WebRTC. With no server of its own,
     * the page trades the connection details by copy and paste: the host's
     * invitation code (its offer), then the guest's reply code (its answer),
     * each the needed parts of the session description in base64url (see
     * "The codes"). A STUN server
     * (Google's public one by default; ?stun=URL or ?stun=none) lets each
     * browser learn its public address; no game data goes through it.
     * Without TURN (a relay: ?turn=URL&turnuser=&turnpass=, none by default)
     * some networks can't connect; with it, the game data goes through the
     * relay when there's no direct way. ?relay uses only the relay.
     *
     * Two data channels: "control" (reliable, ordered: JSON messages) and
     * "game" (unordered, no retransmits: the netcode's packets, which repeat
     * whatever is lost). Messages on "control":
     *   ready    a player pressed START: protocol version, name, car,
     *            steering, track, laps, time of day (their GAME.DTA, which
     *            the menu has just written)
     *   unready  they started a single-player race instead
     *   ping, pong  the host's 5 pings before each race, for the round trip;
     *            the input delay from it (DELAY_MARGIN_MS of jitter
     *            allowance, 2-8 ticks)
     *   start    host: session, delay, which car starts behind, track, laps,
     *            time of day (the host's)
     *   cancel   guest: the race couldn't start after all
     * Car 0 is the host's, car 1 the guest's; the car starting behind (the
     * player's place in the original) alternates race by race, the host's
     * first.
     */
    var STUN_DEFAULT = 'stun:stun.l.google.com:19302';
    var TICK_MS = 1000 * 3 * 800 * 449 / 25175000;     /* 42.8 ms (23.36 Hz) */
    var DELAY_MARGIN_MS = 25;
    var PINGS = 5;
    var LEAVE_WAIT_MS = 500;    /* how long a page that has left a race waits for the other's acknowledgement */
    var raceCount = 0;          /* two-player races on this page, for the car starting behind */
    var conn = null;            /* the connection, while there is one */
    var wantRace = false;       /* START pressed with "Network", no race yet */
    var panelOpen = false;      /* the connection dialog (network-lobby.js) is open */
    var banner = document.getElementById('banner');
    var bannerUntil = 0;

    function setBanner(text, ms) {
        if (text) {
            banner.textContent = text;
            banner.hidden = false;
            bannerUntil = ms ? performance.now() + ms : 0;
        } else if (!bannerUntil || performance.now() > bannerUntil) {
            banner.hidden = true;
            bannerUntil = 0;
        }
    }

    function iceServers() {
        var stun = params.get('stun'), turn = params.get('turn'), servers = [];
        if (stun !== 'none') servers.push({ urls: stun || STUN_DEFAULT });
        if (turn) servers.push({ urls: turn, username: params.get('turnuser') || '', credential: params.get('turnpass') || '' });
        return servers;
    }

    function rtcConfig() {
        var config = { iceServers: iceServers() };
        if (params.has('relay')) config.iceTransportPolicy = 'relay';
        return config;
    }

    /*
     * The kinds of address a session description offers, in words: "local"
     * (host; behind mDNS names when the browser hides them), "public IPv4/6"
     * (srflx: what the STUN server saw), "relay" (TURN). For the message when
     * a connection fails.
     */
    function addressKinds(sdp) {
        var kinds = [];
        String(sdp || '').split(/\r?\n/).forEach(function (line) {
            var m = /^a=candidate:\S+ \d+ \S+ \d+ (\S+) \d+ typ (\S+)/.exec(line);
            if (!m) return;
            var v6 = m[1].indexOf(':') >= 0;
            var kind = m[2] === 'host' ? 'local' :
                       m[2] === 'relay' ? 'relay' :
                       m[2] === 'srflx' || m[2] === 'prflx' ? 'public IPv' + (v6 ? '6' : '4') : m[2];
            if (kinds.indexOf(kind) < 0) kinds.push(kind);
        });
        return kinds;
    }

    /*
     * The codes: "RS2." and, in base64url, only what the other browser needs
     * from the session description; the receiving page writes the rest of
     * the description itself (sdpFromCode). Bytes:
     *   1  0 offer, 1 answer; setup role in bits 1-2 (0 actpass, 1 active, 2 passive)
     *   s  mid, ice-ufrag, ice-pwd (strings, see below)
     *   1  1: sha-256 fingerprint, 32 bytes follow; 0: another algorithm,
     *      its line's value as a string follows
     *   2  sctp-port      4  max-message-size   (0: none in the description)
     *   1  number of addresses; each:
     *      1  type (0 host, 1 srflx, 2 prflx, 3 relay) | address form << 2
     *         (0 IPv4: 4 bytes; 1 IPv6: 16; 2 a "<uuid>.local" name: 16;
     *         3 other: a string)
     *      4  priority      2  port
     * A string: a byte with its form (0 as is, 1 base64 characters, length
     * a multiple of 4, packed; 2 lowercase hex digits, even length, packed),
     * a byte with its length in characters, the bytes. The UDP addresses
     * only (TCP ones hardly ever connect two homes). Big-endian numbers.
     */
    var CODE_PREFIX = 'RS2.';
    var OLD_CODE_PREFIX = 'RS1.';
    var CAND_TYPES = ['host', 'srflx', 'prflx', 'relay'];
    var SETUPS = ['actpass', 'active', 'passive'];

    function base64url(bytes) {
        return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function fromBase64url(text) {
        var b64 = text.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        return fromBase64(b64);
    }

    function codeWriter() {
        var out = [];
        var w = {
            u8: function (v) { if (v < 0 || v > 255) throw new Error('too large for the code'); out.push(v); },
            u16: function (v) { w.u8(v >>> 8 & 255); w.u8(v & 255); },
            u32: function (v) { w.u16(v >>> 16 & 65535); w.u16(v & 65535); },
            bytes: function (b) { for (var i = 0; i < b.length; i++) out.push(b[i]); },
            str: function (s) {
                var form = /^[A-Za-z0-9+\/]+$/.test(s) && s.length % 4 === 0 ? 1 : /^(?:[0-9a-f]{2})+$/.test(s) ? 2 : 0;
                w.u8(form);
                w.u8(s.length);
                if (form === 1) w.bytes(fromBase64(s));
                else if (form === 2) for (var i = 0; i < s.length; i += 2) out.push(parseInt(s.substr(i, 2), 16));
                else w.bytes(new TextEncoder().encode(s));
            },
            done: function () { return new Uint8Array(out); }
        };
        return w;
    }

    function codeReader(bytes) {
        var at = 0;
        var take = function (n) {
            if (at + n > bytes.length) throw new Error('the code ends too soon');
            at += n;
            return bytes.subarray(at - n, at);
        };
        var r = {
            u8: function () { return take(1)[0]; },
            u16: function () { var b = take(2); return b[0] << 8 | b[1]; },
            u32: function () { return r.u16() * 65536 + r.u16(); },
            bytes: take,
            str: function () {
                var form = r.u8(), len = r.u8();
                if (form === 1 && len % 4 || form === 2 && len % 2) throw new Error('bad string length');
                if (form === 1) return toBase64(take(len / 4 * 3));
                if (form === 2) {
                    return Array.prototype.map.call(take(len / 2), function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
                }
                if (form === 0) return new TextDecoder('utf-8', { fatal: true }).decode(take(len));
                throw new Error('unknown string form');
            },
            end: function () { if (at !== bytes.length) throw new Error('bytes left over'); }
        };
        return r;
    }

    var hex2 = function (x) { return (x < 16 ? '0' : '') + x.toString(16).toUpperCase(); };

    function encodeCode(desc) {
        var sdp = desc.sdp, line = function (key, optional) {
            var m = new RegExp('^a=' + key + ':(.*)$', 'm').exec(sdp);
            if (!m && optional) return '0';
            if (!m) throw new Error('the session description has no ' + key);
            return m[1].trim();
        };
        var w = codeWriter();
        var setup = SETUPS.indexOf(line('setup'));
        if (setup < 0) throw new Error('unknown setup role');
        w.u8((desc.type === 'answer' ? 1 : 0) | setup << 1);
        w.str(line('mid'));
        w.str(line('ice-ufrag'));
        w.str(line('ice-pwd'));
        var fp = line('fingerprint'), sha = /^sha-256 ((?:[0-9A-Fa-f]{2}:){31}[0-9A-Fa-f]{2})$/.exec(fp);
        if (sha) {
            w.u8(1);
            w.bytes(sha[1].split(':').map(function (h) { return parseInt(h, 16); }));
        } else {
            w.u8(0);
            w.str(fp);
        }
        w.u16(+line('sctp-port', true));
        w.u32(+line('max-message-size', true));
        var cands = [];
        sdp.split(/\r?\n/).forEach(function (l) {
            var m = /^a=candidate:\S+ 1 udp (\d+) (\S+) (\d+) typ (\S+)/i.exec(l);
            if (m && CAND_TYPES.indexOf(m[4]) >= 0) cands.push(m);
        });
        w.u8(cands.length);
        cands.forEach(function (m) {
            var addr = m[2], type = CAND_TYPES.indexOf(m[4]), v4 = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(addr);
            var mdns = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\.local$/.exec(addr);
            var v6 = addr.indexOf(':') >= 0 ? ipv6Bytes(addr) : null;
            if (v4) {
                w.u8(type);
                w.bytes(v4.slice(1).map(Number));
            } else if (v6) {
                w.u8(type | 1 << 2);
                w.bytes(v6);
            } else if (mdns) {
                w.u8(type | 2 << 2);
                w.bytes(mdns.slice(1).join('').match(/../g).map(function (h) { return parseInt(h, 16); }));
            } else {
                w.u8(type | 3 << 2);
                w.str(addr);
            }
            w.u32(+m[1]);
            w.u16(+m[3]);
        });
        return Promise.resolve(CODE_PREFIX + base64url(w.done()));
    }

    /* An IPv6 address's 16 bytes (null if it isn't one in the plain form). */
    function ipv6Bytes(addr) {
        var halves = addr.split('::');
        if (halves.length > 2) return null;
        var groups = function (s) { return s ? s.split(':') : []; };
        var head = groups(halves[0]), tail = halves.length === 2 ? groups(halves[1]) : [];
        var fill = 8 - head.length - tail.length;
        if (halves.length === 1 ? fill !== 0 : fill < 1) return null;
        var all = head.concat(new Array(halves.length === 2 ? fill : 0).fill('0'), tail), out = [];
        for (var i = 0; i < 8; i++) {
            if (!/^[0-9a-fA-F]{1,4}$/.test(all[i])) return null;
            var v = parseInt(all[i], 16);
            out.push(v >>> 8, v & 255);
        }
        return out;
    }

    function ipv6Text(b) {
        var g = [];
        for (var i = 0; i < 16; i += 2) g.push((b[i] << 8 | b[i + 1]).toString(16));
        return g.join(':');
    }

    /*
     * A code (whitespace removed, with its prefix) to a session description
     * the browser accepts as the other's, with its ICE username fragment
     * (ufrag); rejects if damaged (see readCode).
     */
    function decodeCode(text) {
        try {
            return Promise.resolve(sdpFromCode(fromBase64url(text.substring(CODE_PREFIX.length))));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    function sdpFromCode(bytes) {
        var r = codeReader(bytes);
        var head = r.u8(), type = head & 1 ? 'answer' : 'offer', setup = SETUPS[head >> 1];
        if (!setup || head >> 3) throw new Error('unknown setup role');
        var mid = r.str(), ufrag = r.str(), pwd = r.str(), fp;
        var fpForm = r.u8();
        if (fpForm === 1) fp = 'sha-256 ' + Array.prototype.map.call(r.bytes(32), hex2).join(':');
        else if (fpForm === 0) fp = r.str();
        else throw new Error('unknown fingerprint form');
        var sctpPort = r.u16(), maxMessage = r.u32();
        var n = r.u8(), cands = [];
        for (var i = 0; i < n; i++) {
            var kind = r.u8(), ctype = CAND_TYPES[kind & 3], form = kind >> 2, addr;
            if (form === 0) addr = Array.prototype.join.call(r.bytes(4), '.');
            else if (form === 1) addr = ipv6Text(r.bytes(16));
            else if (form === 2) {
                var h = Array.prototype.map.call(r.bytes(16), function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
                addr = [h.substr(0, 8), h.substr(8, 4), h.substr(12, 4), h.substr(16, 4), h.substr(20)].join('-') + '.local';
            } else if (form === 3) addr = r.str();
            else throw new Error('unknown address form');
            if (!/^[0-9A-Za-z.:\-]+$/.test(addr)) throw new Error('bad address');
            var prio = r.u32(), port = r.u16();
            cands.push('a=candidate:' + (i + 1) + ' 1 udp ' + prio + ' ' + addr + ' ' + port + ' typ ' + ctype +
                       (ctype === 'host' ? '' : ' raddr 0.0.0.0 rport 0') + ' generation 0');
        }
        r.end();
        var safe = /^[\x21-\x7e ]+$/;
        [mid, ufrag, pwd, fp].forEach(function (s) { if (!safe.test(s)) throw new Error('bad field'); });
        var session = String(Math.floor(Math.random() * 9e15) + 1e15);
        var sdp = ['v=0', 'o=- ' + session + ' 2 IN IP4 127.0.0.1', 's=-', 't=0 0',
                   'a=group:BUNDLE ' + mid, 'a=msid-semantic: WMS',
                   'm=application 9 UDP/DTLS/SCTP webrtc-datachannel', 'c=IN IP4 0.0.0.0']
            .concat(cands, ['a=ice-ufrag:' + ufrag, 'a=ice-pwd:' + pwd, 'a=ice-options:trickle', 'a=fingerprint:' + fp,
                            'a=setup:' + setup, 'a=mid:' + mid],
                           sctpPort ? ['a=sctp-port:' + sctpPort] : [], maxMessage ? ['a=max-message-size:' + maxMessage] : [])
            .join('\r\n') + '\r\n';
        return { type: type, sdp: sdp, ufrag: ufrag };
    }

    /*
     * The local session description, with the network addresses gathered so
     * far. Waiting for the browser to finish gathering can take seconds
     * (interfaces that never answer), so the code is made as soon as the
     * STUN server's answer (the public address, a "srflx" candidate) has
     * come and nothing new for 250 ms; without STUN, once the local
     * addresses have come; with TURN, once the relay's address has come too;
     * at most after 3 s (6 s with TURN).
     */
    function gathered(c) {
        var start = performance.now(), relayOnly = params.has('relay');
        var stun = !relayOnly && params.get('stun') !== 'none', turn = !!params.get('turn');
        var limit = turn ? 6000 : 3000;
        return new Promise(function (resolve) {
            (function check() {
                var now = performance.now(), quiet = now - c.lastCandidateAt >= 250;
                if (c.pc.iceGatheringState === 'complete' || now - start >= limit ||
                    (quiet && c.lastCandidateAt > 0 && (!stun || c.haveSrflx) && (!turn || c.haveRelay))) {
                    resolve();
                } else {
                    setTimeout(check, 50);
                }
            })();
        }).then(function () { return encodeCode(c.pc.localDescription); });
    }

    /* A message for the connection dialog (error: a failure; the dialog shows it as one). */
    function duelStatus(text, error) {
        if (netApi.onStatus) netApi.onStatus({ text: text || '', error: !!error });
    }

    function newConnection(role) {
        closeConnection(null);
        var pc = new RTCPeerConnection(rtcConfig());
        var c = {
            pc: pc, role: role, control: null, game: null, open: 0, connected: false,
            hello: null, peer: null, localReady: false, peerReady: false, pings: [], pinging: false,
            racing: false, delay: 0, haveSrflx: false, haveRelay: false, lastCandidateAt: 0
        };
        pc.addEventListener('icecandidate', function (e) {
            if (!e.candidate) return;
            c.lastCandidateAt = performance.now();
            if (/ typ srflx /.test(e.candidate.candidate)) c.haveSrflx = true;
            if (/ typ relay /.test(e.candidate.candidate)) c.haveRelay = true;
        });
        conn = c;
        if (role === 'host') {
            setupChannel(c, pc.createDataChannel('control', { ordered: true }));
            setupChannel(c, pc.createDataChannel('game', { ordered: false, maxRetransmits: 0 }));
        } else {
            pc.ondatachannel = function (e) { setupChannel(c, e.channel); };
        }
        return c;
    }

    /* Ends the connection (message: a banner saying why). */
    function closeConnection(message) {
        var c = conn;
        if (!c) return;
        conn = null;
        if (c.racing && core) core._web_duel_solo();    /* (the netcode would time out anyway) */
        try { c.pc.close(); } catch (e) { /* already closed */ }
        if (message) setBanner(message, 6000);
    }

    function setupChannel(c, ch) {
        if (ch.label === 'control') {
            c.control = ch;
            ch.onmessage = function (e) { if (conn === c) onControl(c, JSON.parse(e.data)); };
            ch.onclose = function () {
                if (conn !== c) return;
                if (c.racing) {
                    c.lost = true;              /* the race goes on until the netcode times out */
                } else {
                    closeConnection(c.connected ? 'The other player has disconnected' : null);
                }
            };
        } else {
            c.game = ch;
            ch.binaryType = 'arraybuffer';
            ch.onmessage = function (e) {
                if (typeof e.data === 'string' || !core || conn !== c || !c.racing) return;
                var b = new Uint8Array(e.data);
                if (b.length > 512) return;
                core.HEAPU8.set(b, core._web_net_buffer());
                core._web_net_receive(b.length, performance.now());
            };
        }
        ch.onopen = function () {
            if (++c.open === 2) channelsOpen(c);
        };
    }

    function sendControl(c, msg) {
        if (c.control && c.control.readyState === 'open') c.control.send(JSON.stringify(msg));
    }

    /* This player's part of the race, from the GAME.DTA the menu has just written. */
    function localHello() {
        var g = files.get('GAME.DTA') || new Uint8Array(64);
        return {
            t: 'ready', v: core._web_net_version(), name: Array.prototype.slice.call(g.subarray(12, 28)),
            car: g[32], steering: g[3], track: g[0], laps: g[1], daytime: g[30]
        };
    }

    function channelsOpen(c) {
        c.connected = true;
        duelStatus('Connected. Starting the race…');
        if (wantRace) sendReady(c);
    }

    function sendReady(c) {
        c.hello = localHello();
        c.localReady = true;
        sendControl(c, c.hello);
        maybeStart(c);
    }

    function median(values) {
        var v = values.slice().sort(function (a, b) { return a - b; });
        return v.length ? v[v.length >> 1] : 0;
    }

    function onControl(c, m) {
        if (m.t === 'ready') {
            if (m.v !== core._web_net_version()) {
                duelStatus('The other player’s page runs another version of the game; both should reload it.', true);
                setBanner('The other player’s page runs another version of the game', 6000);
                return;
            }
            c.peer = m;
            c.peerReady = true;
        } else if (m.t === 'unready') {
            c.peerReady = false;
        } else if (m.t === 'ping') {
            sendControl(c, { t: 'pong', n: m.n, at: m.at });
        } else if (m.t === 'pong') {
            c.pings.push(performance.now() - m.at);
        } else if (m.t === 'start' && c.role === 'guest') {
            startRace(c, m);
        } else if (m.t === 'cancel' && c.racing) {
            core._web_duel_solo();
        }
        maybeStart(c);
    }

    /* The host starts the race once both have pressed START (after the pings). */
    function maybeStart(c) {
        if (c.role !== 'host' || !c.localReady || !c.peerReady || c.racing) return;
        if (!c.pinging && c.pings.length < PINGS) {
            var n = 0;
            c.pinging = true;
            var timer = setInterval(function () {
                if (n >= PINGS || conn !== c) { clearInterval(timer); c.pinging = false; return; }
                sendControl(c, { t: 'ping', n: n++, at: performance.now() });
            }, 100);
            return;
        }
        if (c.pings.length < PINGS) return;
        var rtt = median(c.pings);
        var start = {
            t: 'start', session: crypto.getRandomValues(new Uint32Array(1))[0] >>> 0,
            delay: Math.max(2, Math.min(8, Math.ceil((rtt / 2 + DELAY_MARGIN_MS) / TICK_MS))),
            behind: raceCount % 2, rtt: Math.round(rtt),
            track: c.hello.track, laps: c.hello.laps, daytime: c.hello.daytime
        };
        sendControl(c, start);
        startRace(c, start);
    }

    function startRace(c, st) {
        var host = c.role === 'host' ? c.hello : c.peer, guest = c.role === 'host' ? c.peer : c.hello;
        if (c.racing || !host || !guest) return;
        var names = core.HEAPU8.subarray(core._web_duel_names(), core._web_duel_names() + 32);
        for (var i = 0; i < 16; i++) {
            names[i] = host.name[i] & 255;
            names[16 + i] = guest.name[i] & 255;
        }
        if (core._web_state() !== 0 ||
            !core._web_duel_start(c.role === 'host' ? 0 : 1, st.behind, st.track, st.laps, st.daytime, host.car, guest.car,
                                  host.steering, guest.steering, st.delay, st.session >>> 0, performance.now())) {
            sendControl(c, { t: 'cancel' });
            c.localReady = false;
            return;
        }
        c.racing = true;
        raceCount++;
        c.delay = st.delay;
        c.localReady = c.peerReady = false;
        c.pings = [];
        wantRace = false;
        closePanel();
        setBanner(null, 0);
        bannerUntil = 0;
        banner.hidden = true;
        core.rallyNetSend = function (bytes) {
            if (conn === c && c.game && c.game.readyState === 'open') {
                try { c.game.send(bytes); } catch (e) { /* the channel is closing */ }
            }
        };
        if (!running) startGame();
    }

    /* START pressed with "Network". */
    function onStartPressed() {
        wantRace = true;
        if (conn && conn.connected) {
            sendReady(conn);
        } else {
            showDuelPanel();
        }
    }

    /* The netcode's timers, START and the messages; also while the page is hidden (no animation frames). */
    function duelPoll() {
        if (!core || !initialized) return;
        var now = performance.now();
        saveNetwork();
        if (core._web_duel_requested()) onStartPressed();
        var c = conn;
        if (!c) return;
        if (!c.racing) {
            if (c.localReady && core._web_state() === 1) {
                /* A single-player race instead. */
                c.localReady = false;
                wantRace = false;
                sendControl(c, { t: 'unready' });
            }
            if (c.localReady && !c.peerReady) setBanner('Waiting for the other player to press START (race type “Network”)…');
            else setBanner(null);
            return;
        }
        core._web_net_update(now);
        if (core._web_state() !== 3) {
            /*
             * The local driver has left, so the connection ends: once the other page
             * has acknowledged our departure (or is gone itself), or after a short wait.
             * Until then the menu doesn't run (runTick), so START can't be pressed.
             */
            if (!c.leftAt) c.leftAt = now;
            if (core._web_duel_info(3) || c.lost || now - c.leftAt >= LEAVE_WAIT_MS) {
                core._web_duel_end();
                c.racing = false;
                setBanner(null);
                closeConnection(null);
            }
            return;
        }
        var status = core._web_duel_info(0);
        if (status === 1) setBanner('Out of step with the other machine: racing on alone');
        else if (status === 3) setBanner('Lost the connection to the other driver');
        else if (status === 2) setBanner('The other page runs another version of the game');
        else if (core._web_duel_info(2)) setBanner('The other driver has left the race');
        else if (core._web_duel_info(1) > 300) setBanner('Waiting for the other driver…');
        else setBanner(null);
    }
    setInterval(duelPoll, 20);

    /* ---- The connection dialog ---- */

    /*
     * The dialog itself is network-lobby.js (w95; opened and closed
     * through window.rallyNetUI, which index.html sets). It drives the
     * connection through window.rallyNetwork (below): host (hostOffer, then
     * acceptAnswer) or join (joinWithOffer), and gets the messages through
     * rallyNetwork.onStatus({text, error}). Closing the dialog before the
     * race starts cancels (hideDuelPanel). Codes are checked before
     * anything is prepared, with messages naming the code concerned. The
     * host's connection that doesn't come up within CONNECT_TIMEOUT_MS of
     * the reply code counts as failed. (Not before: the guest's browser
     * starts trying as soon as it has made the reply code, and the host's
     * answers it, so the state says "connecting" while the host may still be
     * copying. For the same reason the guest gets no time limit; a failure
     * the browser reports is shown on either side.)
     */
    var CONNECT_TIMEOUT_MS = 20000;
    var netApi = window.rallyNetwork = { onStatus: null };

    function showDuelPanel() {
        if (panelOpen || !window.rallyNetUI) return;
        panelOpen = true;
        duelStatus('');
        window.rallyNetUI.open();
        if (core) core._web_release_keys();
    }

    /* The race is starting. */
    function closePanel() {
        if (!panelOpen) return;
        panelOpen = false;
        if (window.rallyNetUI) window.rallyNetUI.close();
    }

    /* The user closed the dialog. */
    function hideDuelPanel() {
        if (!panelOpen) return;
        panelOpen = false;
        wantRace = false;
        closeConnection(null);
    }

    /* A code's text checked and decoded: expected 'offer' (the invitation code) or 'answer' (the reply code). */
    function readCode(text, expected) {
        var name = expected === 'offer' ? 'invitation code' : 'reply code';
        var what = expected === 'offer' ? 'the invitation code the host sent you' : 'the reply code the other player sent back';
        text = String(text).replace(/\s+/g, '');
        if (!text) return Promise.reject(new Error('Paste ' + what + ' first.'));
        if (text.indexOf(OLD_CODE_PREFIX) === 0) {
            return Promise.reject(new Error('That ' + name + ' is from an older version of the page. ' +
                                            'Both of you should reload the page, then start over with new codes.'));
        }
        if (text.indexOf(CODE_PREFIX) !== 0) {
            return Promise.reject(new Error('That isn’t ' + (expected === 'offer' ? 'an ' : 'a ') + name +
                ' from this game. Paste ' + what + ': all of it, beginning with “' + CODE_PREFIX + '”.'));
        }
        return decodeCode(text).catch(function () {
            throw new Error('The ' + name + ' is incomplete or damaged. Copy all of it again and paste it here.');
        }).then(function (desc) {
            if (desc.type !== expected) {
                if (expected === 'offer') throw new Error('That is a reply code. Here, paste the invitation code the host sent you.');
                if (conn && conn.pc.localDescription && new RegExp('^a=ice-ufrag:' + desc.ufrag.replace(/[^\w]/g, '\\$&') + '\\s*$', 'm').test(conn.pc.localDescription.sdp)) {
                    throw new Error('That is your own invitation code. Paste the reply code the other player sends back to you.');
                }
                throw new Error('That is an invitation code. Paste the reply code the other player sends back to you.');
            }
            return desc;
        });
    }

    function hostOffer() {
        var c = newConnection('host');
        return c.pc.createOffer().then(function (offer) {
            return c.pc.setLocalDescription(offer);
        }).then(function () { return gathered(c); });
    }

    function joinWithOffer(code) {
        return readCode(code, 'offer').then(function (offer) {
            return replyTo(offer);
        });
    }

    function replyTo(offer) {
        var c = newConnection('guest');
        return c.pc.setRemoteDescription(offer).then(function () {
            return c.pc.createAnswer();
        }).then(function (answer) {
            return c.pc.setLocalDescription(answer);
        }).then(function () { return gathered(c); });
    }

    function acceptAnswer(code) {
        return readCode(code, 'answer').then(function (answer) {
            if (!conn || conn.role !== 'host') throw new Error('Not hosting.');
            return conn.pc.setRemoteDescription(answer);
        });
    }

    /*
     * A failure the browser reports, shown in the panel while it is open:
     * the host's only. The guest's browser starts trying as soon as it has
     * made the reply code and reports failure after some 15 s, long before
     * the host has the code, but it still answers the host's attempts when
     * they come (Chrome, measured: even 5 minutes later), so the guest's
     * connection stays open until the host connects or the panel closes.
     */
    function watchConnection(c) {
        c.pc.addEventListener('connectionstatechange', function () {
            if (conn === c && !c.connected && panelOpen && c.pc.connectionState === 'failed') {
                connectionFailed(c);
            }
        });
    }

    /* The host has chosen Connect: the connection should come up soon. */
    function awaitConnection(c) {
        duelStatus('Connecting\u2026');
        setTimeout(function () {
            if (conn === c && !c.connected && panelOpen) connectionFailed(c);
        }, CONNECT_TIMEOUT_MS);
    }

    /*
     * The message says which addresses each side's code offered (also in
     * the console, with the address pairs the browser tried), which tells
     * a blocked STUN server from a network that needs a relay.
     */
    function connectionFailed(c) {
        var pc = c.pc;
        var mine = addressKinds(pc.localDescription && pc.localDescription.sdp);
        var theirs = addressKinds(pc.remoteDescription && pc.remoteDescription.sdp);
        var list = function (k) { return k.length ? k.join(', ') : 'none'; };
        var reachable = function (k) { return k.some(function (x) { return x !== 'local'; }); };
        var why;
        if (!reachable(mine) && !reachable(theirs)) {
            why = 'Neither browser got a public address from the STUN server, so only a connection within a local network was possible.';
        } else if (!reachable(mine) || !reachable(theirs)) {
            why = (reachable(mine) ? 'The other player’s browser' : 'Your browser') + ' didn’t get a public address from the ' +
                  'STUN server (its network may block that), so only a connection within a local network was possible.';
        } else {
            why = 'Both browsers knew their public addresses, but a network between you didn’t let a direct connection ' +
                  'through (e.g. a router or mobile network that gives each connection a different address). ' +
                  'A relay (a TURN server; see the page’s turn option) gets around that.';
        }
        console.warn('Network race: no connection. Addresses offered: yours: ' + list(mine) + '; theirs: ' + list(theirs));
        conn = null;
        if (c.racing && core) core._web_duel_solo();
        pc.getStats().then(function (stats) {
            stats.forEach(function (r) { if (r.type === 'candidate-pair') console.warn('Network race: address pair', r.state, r); });
        }).catch(function () { /* nothing to show */ }).then(function () {
            try { pc.close(); } catch (e) { /* already closed */ }
        });
        duelStatus('Couldn’t connect to the other player. ' + why + ' Close this window to start over with new codes.', true);
    }

    netApi.hostOffer = function () {
        return hostOffer().then(function (code) {
            watchConnection(conn);
            return code;
        });
    };
    netApi.acceptAnswer = function (code) {
        return acceptAnswer(code).then(function () {
            if (!conn.connected) awaitConnection(conn);
        });
    };
    netApi.joinWithOffer = joinWithOffer;
    netApi.closed = hideDuelPanel;
    netApi.isOpen = function () { return panelOpen; };

    /* ---- Test mode ---- */

    /*
     * ?test: the game starts at once (no click; the browser keeps the sound
     * off), picks the menu's first background picture (not one by the
     * time of day), and runs no ticks of its own: an
     * automated test (tests/web-check.mjs, through the Chrome DevTools
     * protocol) sends real key events and runs ticks through window.rallyTest.
     */
    function startTestMode() {
        core.rallyFixedTime = { seconds: 0, hundredths: 0 };   /* the menu's first picture, as bin/rallye-test's default */
        startGame();
        window.rallyTest = {
            /* Runs n ticks (fewer if the game ends); returns the state: 0 menu, 1 race, 2 ended. */
            tick: function (n) {
                for (var i = 0; i < n && running; i++) {
                    core._web_tick();
                    touch.afterTick();
                    if (core._web_wants_quit()) {
                        gameQuit();
                    }
                }
                if (running) {
                    updateFrame();
                    present();
                }
                return running ? core._web_state() : 2;
            },
            /* How many times quitting at the menu has started the game again. */
            restarts: function () {
                return restarts;
            },
            /* The current frame as base64 RGBA (320 x 200 x 4), as drawn on the page. */
            frame: function () {
                return toBase64(image.data);
            },
            /* The files the game has written, kept in browser storage: name -> base64. */
            savedFiles: function () {
                var out = {};
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    if (key.indexOf(FILE_PREFIX) === 0) out[key.substring(FILE_PREFIX.length)] = localStorage.getItem(key);
                }
                return out;
            },
            ready: running,

            /* Two-player races (tests/web-duel.mjs): the connection, then ticks as the other page allows. */
            duelHost: hostOffer,
            duelJoin: joinWithOffer,
            duelAccept: acceptAnswer,
            duelReady: onStartPressed,      /* as START with "Network" */
            duelStarted: function () { return !!(conn && conn.racing); },
            duelConnected: function () { return !!(conn && conn.connected); },
            duelDelay: function () { return conn ? conn.delay : 0; },
            duelRaces: function () { return raceCount; },
            networkChosen: function () { return core._web_duel_chosen(); },
            /* Runs n ticks of the two-player race (waiting for the other page); resolves with the ticks run. */
            duelTicks: function (n) {
                return new Promise(function (resolve) {
                    var done = 0;
                    function step() {
                        while (done < n) {
                            var now = performance.now();
                            core._web_net_update(now);
                            var r = core._web_duel_step(now);
                            if (r === 1) { done++; continue; }
                            if (r === -1) break;
                            setTimeout(step, 1);
                            return;
                        }
                        updateFrame();
                        present();
                        resolve(done);
                    }
                    step();
                });
            },
            hash: function () { return core._web_state_hash() >>> 0; },
            duelInfo: function (k) { return core._web_duel_info(k); },
            banner: function () { return banner.hidden ? '' : banner.textContent; }
        };
    }

    /* ---- Loading ---- */

    if (typeof DecompressionStream === 'undefined') {
        showMessage('This browser is too old for the game.<small>It needs DecompressionStream (Chrome 103, Firefox 113, Safari 16.4 or later).</small>');
        return;
    }
    Promise.all([
        fetch(ZIP_URL).then(function (r) {
            if (!r.ok) throw new Error(ZIP_URL + ': ' + r.status + ' ' + r.statusText);
            return r.arrayBuffer();
        }).then(unzip),
        createRallyCore(),
        new Promise(function (resolve) { window.rallyDialogsReady = resolve; })     /* index.html's module script */
    ]).then(function (results) {
        core = results[1];
        loadSavedFiles();
        core.rallyFiles = files;
        core.rallyWriteFile = writeFile;
        if (testMode) {
            startTestMode();
        } else {
            if (showFirstFrame()) window.rallySplashUI.open();
        }
    }).catch(function (err) {
        showMessage('The game could not be loaded.<small>' + escapeHtml(err.message || err) + '</small>');
    });
})();
