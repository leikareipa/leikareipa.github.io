/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

export const statistics = w95.widget(function statistics({
    x = 0,
    y = 0,
    width = 100,
    height = 100,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");

    const clockCounter = w95.state(1);
    const tickCounter = w95.state(1, w95.noEffect);
    const ngons = w95.state(0, w95.noEffect);
    const apps = w95.state(0, w95.noEffect);
    const repaintCount = w95.state(0, w95.noEffect);
    const renderTime = w95.state(0, w95.noEffect);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Mounted() {
            w95.tick.listen(tickListener = tickListener.bind(this));
            w95.clock.listen(clockListener = clockListener.bind(this));

            ngons.set(0);
            apps.set(0);
            renderTime.set(0);
            repaintCount.set(0);
        },
        BeforeUnmount() {
            w95.tick.unlisten(tickListener);
            w95.clock.unlisten(clockListener);
        },
        Form() {
            const display = w95.shell.display;
            return [
                w95.widget.groupBox({
                    title: "Display",
                    x: 7,
                    y: 5,
                    width: "pw - 14",
                    height: 54,
                    children: [
                        w95.widget.label({
                            text: `${display.width} x ${display.height} (${display.scale}x), ${Math.round(display.refreshRate || 1)} Hz`,
                            x: 2,
                            y: 2,
                            width: (width - 18),
                            height: 46,
                            styleHints: [
                                w95.styleHint.alignHCenter,
                                w95.styleHint.alignVCenter,
                            ],
                        }),
                    ]
                }),
                w95.widget.groupBox({
                    title: `Repaint (${repaintCount.now})`,
                    x: 7,
                    y: 63,
                    width: "pw - 14",
                    height: 54,
                    children: [
                        w95.widget.label({
                            text: `${apps.now} app${(apps.now === 1)? "" : "s"}, ${ngons.now} prims, ${Math.round(renderTime.now)} ms`,
                            x: 2,
                            y: 2,
                            width: (width - 18),
                            height: 46,
                            styleHints: [
                                w95.styleHint.alignHCenter,
                                w95.styleHint.alignVCenter,
                            ],
                        }),
                    ],
                }),
            ];
        },
    };

    function clockListener() {
        if (!this._hideMesh) {
            clockCounter.set(clockCounter.now + 1);
        }
    }

    function tickListener() {
        if (w95.shell.display.geometry.updatedApps.length) {
            tickCounter.set(tickCounter.now + 1);

            ngons.set(Math.max(ngons.now, w95.shell.display.geometry.ngons));
            apps.set(Math.max(apps.now, w95.shell.display.geometry.updatedApps.length));
            renderTime.set(Math.max(renderTime.now, w95.shell.display.geometry.renderTimeMs));
            repaintCount.set(repaintCount.now + 1);
        }
    }
});
