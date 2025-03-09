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
    defaultRunners = undefined,
    externalBasePath = "",
    reportNumIcons = undefined,
    reportPath = undefined,
} = {})
{
    const contentHeight = w95.state(height);
    const currentPath = w95.state("/", ()=>reportPath?.(currentPath.now));
    const views = w95.state({});

    if (!Object.keys(views.now).length) {
        generate_views();
    }

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return contentHeight.now },
        get iconWrappers() { return this.$("_stacks").$(currentPath.now).$childWidgets.filter(w=>((w._type === "dynamicWrapper") && !w.$childWidgets[0]._hideMesh)) },
        get icons() { return this.iconWrappers.map(w=>w.$childWidgets[0]) },
        Mounted() {
            // Position the icons on a grid.
            {
                const xOffset = 0;
                const yOffset = 0;
                const verticalSpacing = 75;
                const horizontalSpacing = 75;

                let x = xOffset;
                let y = yOffset;
                for (const wrapper of this.iconWrappers) {
                    const iconWidget = wrapper.$childWidgets[0];

                    if ((x + iconWidget.width) > width) {
                        x = xOffset;
                        y += verticalSpacing;
                    }

                    wrapper.Message.resize(iconWidget.width, iconWidget.height);
                    wrapper.Message.move(x, y);
                    x += horizontalSpacing;
                }

                contentHeight.set(Math.max(height, (y + verticalSpacing)));
            }
        },
        Form() {
            reportNumIcons?.(views.now[currentPath.now].length);

            return w95.widget.stackedWidget({
                width,
                height: (contentHeight.now - 2),
                $name: "_contents",
                stacks: views.now,
                stackIndex: currentPath.now,
            });
        },
        Message: {
            navigate_back() {
                currentPath.set(go_back(currentPath.now));

                function go_back(path) {
                    return (
                        (path === "/")
                            ? path
                            : path.substring(0, (path.replace(/\/$/, "").lastIndexOf("/") + 1))
                    );
                }
            },
            activate_current_item() {
                for (const icon of this.icons) {
                    if (icon.isSelected) {
                        icon.Message.activate();
                        break;
                    }
                }
            },
        },
        Event: {
            mousedown() {
                this.icons.forEach(w=>w.Message?.blur?.());
            },
        },
    };

    function generate_views() {
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
                                else {
                                    const fullPath = (externalBasePath + currentPath.now + filename);
                                    (defaultRunners[get_file_type(filename)] || runner)?.(fullPath, filename);
                                }
                            },
                        }),
                    })
                );
    
                if (is_directory(filename)) {
                    recurse(files[filename], (path + filename));
                }
    
                views.now[path] = widgets;
            }
        })(files);
    }

    function is_directory(filename) {
        return filename.endsWith("/");
    }

    function get_file_type(filename) {
        switch (get_filename_extension(filename)) {
            case "diz":
            case "txt": return "text";
            case "gif":
            case "jpg":
            case "bmp":
            case "png": return "image";
            case "ini": return "ini";
            case "dll": return "library";
            case "com":
            case "exe": return "executable";
            case "zip": return "archive";
            case "bat": return "batch";
            case "url": return "url";
            default: return "unknown";
        }
    }

    function get_icon(filename) {
        if (is_directory(filename)) {
            return icons.dir32;
        }

        let iconType = "unknown";

        switch (get_filename_extension(filename)) {
            case "diz":
            case "txt": iconType = "txt"; break;
            case "gif":
            case "jpg":
            case "bmp":
            case "png": iconType = "bmp"; break;
            case "ini": iconType = "ini"; break;
            case "dll": iconType = "dll"; break;
            case "com":
            case "exe": iconType = "exe"; break;
            case "zip": iconType = "zip"; break;
            case "bat": iconType = "bat"; break;
            case "url": iconType = "url"; break;
            default: break;
        }

        return icons[`${iconType}32`];
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
