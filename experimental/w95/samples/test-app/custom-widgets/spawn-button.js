/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import testApp from "../app.js";

w95.widget("spawnButton", function({
    x = 0,
    y = 0,
    width = 100,
    height = 22,
    isDisabled = false,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Form() {
            return [
                w95.widget.button({
                    x: 0,
                    y: 0,
                    width,
                    height,
                    isDisabled,
                    text: `Spawned: ${w95.registry.get("num-windows-spawned")}`,
                    onClick() {
                        w95.registry.increment("num-windows-spawned");
                        w95.shell.run(testApp);
                    },
                }),
            ];
        },
    };
});
