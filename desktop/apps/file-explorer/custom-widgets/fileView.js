/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import largeIcon from "./largeIcon.js";
import {icons} from "../icons.js";

export default w95.widget(function fileView({
    files = {},
    x = 0,
    y = 0,
    width = 200,
    height = 200,
    reportNumIcons = undefined,
    reportPath = undefined,
} = {})
{
    const contentHeight = w95.state(height);
    const currentPath = w95.state("/", ()=>reportPath?.(currentPath.now));

    const views = {};
    (function recurse(files, path = "/") {
        const widgets = [];

        for (const [filename, runner] of Object.entries(files)) {
            widgets.push(
                w95.widget.dynamicWrapper({
                    widget: largeIcon({
                        text: filename.replace(/\/$/, "").replace(/\.url$/, ""),
                        icon: get_icon(filename),
                        onActivate() {
                            if (is_directory(filename)) {
                                currentPath.set(path + filename);
                            }
                            else if (typeof runner === "function") {
                                runner();
                            }
                        },
                    }),
                })
            );

            if (is_directory(filename)) {
                recurse(files[filename], (path + filename));
            }

            views[path] = widgets;
        }
    })(files);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return contentHeight.now },
        get iconWrappers() { return this.$form["_contents"].$form["_stacks"].$form[currentPath.now].$childWidgets.filter(w=>((w._type === "dynamicWrapper") && !w.$childWidgets[0]._hideMesh)) },
        get icons() { return this.iconWrappers.map(w=>w.$childWidgets[0]) },
        Mounted() {
            // Position the icons on a grid.
            {
                const xOffset = 0;
                const yOffset = 0;
                const verticalSpacing = 77;
                const horizontalSpacing = 75;

                let x = xOffset;
                let y = yOffset;
                for (const wrapper of this.iconWrappers) {
                    const iconWidget = wrapper.$childWidgets[0];

                    if ((x + iconWidget.width) > width) {
                        x = xOffset;
                        y += verticalSpacing;
                    }

                    wrapper.Message.move(x, y);
                    x += horizontalSpacing;
                }

                contentHeight.set(Math.max(height, (y + verticalSpacing)));
            }
        },
        Form() {
            reportNumIcons?.(views[currentPath.now].length);

            return w95.widget.stackedWidget({
                width,
                height: (contentHeight.now - 2),
                $name: "_contents",
                stacks: views,
                stackIndex: currentPath.now,
            });
        },
        Event: {
            mousedown() {
                this.icons.forEach(w=>w.Message?.blur?.());
            }
        }
    };

    function is_directory(filename) {
        return filename.endsWith("/");
    }

    function get_icon(filename) {
        if (is_directory(filename)) {
            return icons.dir32;
        }

        switch (get_filename_extension(filename)) {
            case "txt": return icons.text32;
            case "gif":
            case "jpg":
            case "png": return icons.image32;
            case "com":
            case "exe": return icons.executable32;
            case "url": return icons.url32;
            default: return icons.unknown32;
        }
    }

    function get_filename_extension(filename) {
        const index = filename.lastIndexOf(".");
        if (index === -1) {
            return filename;
        }
        else {
            return filename.slice(index + 1).toLowerCase();
        }
    }
});