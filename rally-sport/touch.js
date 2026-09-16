/*
 * touch.js - on-screen controls for touch screens (see rally.js).
 *
 * A layer of DOM elements over the canvas that holds and releases the same
 * PC scan codes as the keyboard (web_set_key), so the core and the netcode
 * see nothing new. It appears on the first touch and goes at the first
 * physical key (?touch: always shown).
 *
 * The layout follows the game: driving, the menu (a direction pad, OK, Back,
 * fullscreen), or a keyboard while the menu asks for the player's name.
 *
 * Every event recomputes which keys all the fingers hold, and only the
 * changes are sent. A finger on the steering pad or the pedals keeps
 * controlling that group wherever it slides; other buttons stay as they were
 * pressed until the finger lifts.
 *
 * Latches, in ticks: the core samples the keys once a tick, so a press also
 * holds its key for a minimum time (MIN_TICKS_*). 3 for the menu's buttons:
 * under the menu's 6-tick repeat delay, so a tap can't step twice.
 *
 * The name keyboard types through a queue, one key at a time. The menu's
 * EditPlayerName (edit_name in menu.c) needs a key held for 3 ticks for the
 * same letter to be accepted again next (shorter, and the next press reads as
 * the old one), and only the last key event of a tick counts, so Shift goes
 * down in a tick of its own.
 */
'use strict';

window.createRallyTouch = function (options) {
    var MIN_TICKS_DRIVE = 1, MIN_TICKS_BUTTON = 3;
    var TYPE_HOLD_TICKS = 3, TYPE_GAP_TICKS = 1;
    var HOLD_TO_QUIT_MS = 800;      /* as .quit.arming's transition in index.html */

    var SC_SHIFT = 0x2A, SC_ENTER = 0x1C, SC_BACKSPACE = 0x0E, SC_SPACE = 0x39;

    /* GameKey's values (game.h), for the keys read from RALLYE.EXE. */
    var RACE_KEYS = { throttle: 0, left: 1, right: 2, reverse: 3, space: 4, esc: 5 };
    /* The menu's keys are fixed (VALIKKO.EXE's keyboard handler). */
    var MENU_KEYS = { up: 0x48, down: 0x50, 'menu-left': 0x4B, 'menu-right': 0x4D, ok: 0x39, back: 0x01 };

    /* The name keyboard: labels and the scan codes VALIKKO.EXE's table gives characters. */
    var LETTER_ROWS = [
        { first: 0x10, letters: 'qwertyuiopå' },
        { first: 0x1E, letters: 'asdfghjklöä' },
        { first: 0x2C, letters: 'zxcvbnm' }
    ];

    function arrow(direction) {
        return '<i class="arrow ' + direction + '"></i>';
    }

    function button(control, label, extra) {
        return '<div class="button ' + (extra || '') + '" data-control="' + control + '">' + label + '</div>';
    }

    function typeKey(scancode, label, extra) {
        return '<div class="button ' + (extra || '') + '" data-scancode="' + scancode + '">' + label + '</div>';
    }

    function keyboardHtml() {
        var rows = LETTER_ROWS.map(function (row) {
            return Array.prototype.map.call(row.letters, function (letter, i) {
                return typeKey(row.first + i, letter, 'letter');
            }).join('');
        });
        rows[2] = '<div class="button wide" data-shift="1">Shift</div>' + rows[2] +
            typeKey(0x34, '.') + typeKey(0x35, '-') + typeKey(SC_BACKSPACE, 'Del', 'wide');
        rows.push(typeKey(SC_SPACE, 'Space', 'widest') + typeKey(SC_ENTER, 'Done', 'wide'));
        return rows.map(function (row) { return '<div class="row">' + row + '</div>'; }).join('');
    }

    var layer = document.createElement('div');
    layer.id = 'touch';
    layer.hidden = true;
    layer.setAttribute('translate', 'no');
    layer.innerHTML =
        '<div class="set race">' +
            '<div class="left-hand steer" data-group="steer">' +
                button('left', arrow('left')) + button('right', arrow('right')) +
            '</div>' +
            '<div class="right-hand" data-group="pedals">' +
                button('reverse', 'REV', 'small') + button('throttle', 'GAS', 'large') +
            '</div>' +
            '<div class="button quit" data-control="esc" data-hold="1"><span>ESC</span></div>' +
            button('space', 'SPACE', 'space') +
        '</div>' +
        '<div class="set menu">' +
            '<div class="button fullscreen" data-fullscreen="1">' +
                '<svg viewBox="0 0 24 24"><path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6"/></svg>' +
            '</div>' +
            '<div class="left-hand dpad">' +
                button('up', arrow('up')) + button('menu-left', arrow('left')) +
                button('menu-right', arrow('right')) + button('down', arrow('down')) +
            '</div>' +
            '<div class="right-hand">' +
                button('back', 'BACK', 'small') + button('ok', 'OK', 'large') +
            '</div>' +
        '</div>' +
        '<div class="set type"><div class="keyboard">' + keyboardHtml() + '</div></div>';
    options.stage.insertBefore(layer, options.before);

    var typeSet = layer.querySelector('.type');
    var controls = {};
    Array.prototype.forEach.call(layer.querySelectorAll('[data-control]'), function (el) {
        controls[el.dataset.control] = el;
    });

    var seen = !!options.forced;    /* a touch has been seen, and no key since */
    var mode = '';                  /* 'race', 'menu', 'type', or '' with no game running */
    var pointers = new Map();       /* pointerId -> { group, control, el, timer } */
    var latches = {};               /* control -> ticks it stays held */
    var sent = {};                  /* scan code -> held, as the core has been told */
    var typeQueue = [];             /* scan codes, or 'shift' to switch Shift */
    var typing = 0, typingTicks = 0, gapTicks = 0, shifted = false;

    function scancodeOf(control) {
        if (control in RACE_KEYS) return options.raceKey(RACE_KEYS[control]);
        return MENU_KEYS[control];
    }

    /* Tells the core what changed, and lights the buttons held. */
    function apply() {
        var wanted = {}, lit = {};

        function hold(control) {
            wanted[scancodeOf(control)] = true;
            lit[control] = true;
        }
        pointers.forEach(function (p) {
            if (p.control && !p.arming) hold(p.control);
        });
        Object.keys(latches).forEach(hold);
        if (typing) wanted[typing] = true;
        if (shifted) wanted[SC_SHIFT] = true;

        Object.keys(sent).forEach(function (sc) {
            if (!wanted[sc]) {
                options.setKey(Number(sc), false);
                delete sent[sc];
            }
        });
        Object.keys(wanted).forEach(function (sc) {
            if (!sent[sc]) {
                options.setKey(Number(sc), true);
                sent[sc] = true;
            }
        });
        Object.keys(controls).forEach(function (control) {
            controls[control].classList.toggle('on', !!lit[control]);
        });
    }

    /* Drops the fingers and everything held (until those fingers touch again). */
    function reset() {
        pointers.forEach(function (p) {
            if (p.timer) clearTimeout(p.timer);
            if (p.el) p.el.classList.remove('on', 'arming');
        });
        pointers.clear();
        latches = {};
        typeQueue = [];
        typing = typingTicks = gapTicks = 0;
        shifted = false;
        typeSet.classList.remove('shifted');
        apply();
    }

    function minTicks(control) {
        return control === 'left' || control === 'right' || control === 'throttle' || control === 'reverse' ?
            MIN_TICKS_DRIVE : MIN_TICKS_BUTTON;
    }

    function press(control) {
        latches[control] = minTicks(control);
    }

    /* The control a finger holds on the steering pad or the pedals, from where it is now. */
    function groupControl(group, x, y) {
        var a, b;
        if (group === 'steer') {
            a = controls.left.getBoundingClientRect();
            b = controls.right.getBoundingClientRect();
            return x < a.right ? 'left' : x > b.left ? 'right' : null;     /* between them: straight on */
        }
        a = controls.reverse.getBoundingClientRect();
        b = controls.throttle.getBoundingClientRect();
        return y < (a.bottom + b.top) / 2 ? 'reverse' : 'throttle';
    }

    /* One step of the name keyboard's queue (from a press, or after a tick). */
    function stepTyping() {
        if (typing || gapTicks > 0 || typeQueue.length === 0) return;
        var next = typeQueue.shift();
        if (next === 'shift') {
            shifted = !shifted;
            typeSet.classList.toggle('shifted', shifted);
            gapTicks = TYPE_GAP_TICKS;
        } else {
            typing = next;
            typingTicks = TYPE_HOLD_TICKS;
        }
    }

    function onDown(e) {
        if (e.target.closest('[data-fullscreen]')) return;     /* its own click (see below) */
        e.preventDefault();
        options.onGesture();
        try {
            layer.setPointerCapture(e.pointerId);
        } catch (err) { /* (a finger already gone) */ }

        var groupEl = e.target.closest('[data-group]');
        var buttonEl = e.target.closest('.button');
        var p = { group: null, control: null, el: buttonEl, timer: 0, arming: false };

        if (groupEl) {
            p.group = groupEl.dataset.group;
            p.control = groupControl(p.group, e.clientX, e.clientY);
            p.el = null;    /* (lit by control) */
        } else if (buttonEl && buttonEl.dataset.control) {
            p.control = buttonEl.dataset.control;
        } else if (buttonEl) {
            if (buttonEl.dataset.shift) {
                typeQueue.push('shift');
            } else {
                typeQueue.push(Number(buttonEl.dataset.scancode));
            }
            buttonEl.classList.add('on');
            stepTyping();
        } else if (mode === 'race') {
            /* Anywhere else in a race: Space, which only counts once the race is over. */
            p.control = 'space';
            p.el = null;
        }

        if (buttonEl && buttonEl.dataset.hold) {
            /* Esc leaves the race, so it takes a deliberate hold. */
            p.arming = true;
            buttonEl.classList.add('arming');
            p.timer = setTimeout(function () {
                p.arming = false;
                p.timer = 0;
                buttonEl.classList.remove('arming');
                press(p.control);
                apply();
            }, HOLD_TO_QUIT_MS);
        } else if (p.control) {
            press(p.control);
        }
        pointers.set(e.pointerId, p);
        apply();
    }

    function onMove(e) {
        var p = pointers.get(e.pointerId);
        if (!p || !p.group) return;
        var control = groupControl(p.group, e.clientX, e.clientY);
        if (control !== p.control) {
            if (p.control) delete latches[p.control];   /* a slide is no tap to keep */
            p.control = control;
            if (control) press(control);
            apply();
        }
    }

    function onUp(e) {
        var p = pointers.get(e.pointerId);
        if (!p) return;
        if (p.timer) clearTimeout(p.timer);
        if (p.el) p.el.classList.remove('on', 'arming');
        pointers.delete(e.pointerId);
        apply();
        options.onGesture();
    }

    layer.addEventListener('pointerdown', onDown);
    layer.addEventListener('pointermove', onMove);
    layer.addEventListener('pointerup', onUp);
    layer.addEventListener('pointercancel', onUp);
    layer.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    /*
     * Fullscreen, of the whole page so that the w95 dialogs stay visible. On
     * a click, the one event every browser counts as a gesture for this (a
     * finger's pointerdown isn't). Should a finger's tap give no click (as
     * DevTools' synthesized taps don't), a moment after its pointerup instead,
     * still within the gesture's time. No button where the browser can't do it.
     */
    (function () {
        var el = layer.querySelector('[data-fullscreen]');
        var root = document.documentElement;
        var enter = root.requestFullscreen || root.webkitRequestFullscreen;
        var leave = document.exitFullscreen || document.webkitExitFullscreen;

        if (!enter || !(document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
            el.remove();
            return;
        }
        var noClickTimer = 0;

        function toggle() {
            clearTimeout(noClickTimer);
            var active = document.fullscreenElement || document.webkitFullscreenElement;
            var result = active ? leave.call(document) : enter.call(root);
            if (result && result.catch) result.catch(function () {});
        }
        el.addEventListener('click', toggle);
        el.addEventListener('pointerup', function (e) {
            if (e.pointerType !== 'mouse') noClickTimer = setTimeout(toggle, 300);
        });
    })();

    /* Follows what the game is doing: which controls to show, and whether any. */
    function sync() {
        var state = options.gameState();
        var now = state === 0 ? (options.editing() ? 'type' : 'menu') : state === 1 || state === 3 ? 'race' : '';

        if (now !== mode) {
            reset();    /* a finger held across the change doesn't press what comes next */
            mode = now;
            layer.dataset.mode = mode;
        }
        layer.hidden = !seen || mode === '';
    }

    /* The first touch anywhere shows the controls (also one on a dialog). */
    window.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch' && !seen) {
            seen = true;
            sync();
        }
    }, true);

    window.addEventListener('keydown', function (e) {
        if (seen && !options.forced && e.code) {
            seen = false;
            reset();
            sync();
        }
    }, true);

    return {
        sync: sync,
        reset: reset,
        isVisible: function () { return !layer.hidden; },

        /* After every tick of the game: the minimum holds run down. */
        afterTick: function () {
            Object.keys(latches).forEach(function (control) {
                if (--latches[control] <= 0) delete latches[control];
            });
            if (typing && --typingTicks <= 0) {
                typing = 0;
                gapTicks = TYPE_GAP_TICKS;
            } else if (!typing && gapTicks > 0) {
                gapTicks--;
            }
            stepTyping();
            sync();
            apply();
        }
    };
};
