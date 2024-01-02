/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("seriousWarning", function({
    width = 344,
    height = 139,
    onAccept = undefined,
    onReject = undefined,
} = {})
{
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");
    w95.debug?.assert(typeof onAccept === "undefined");
    w95.debug?.assert(typeof onReject === "function");

    // Hack: Put the dialog fully out of view to prevent it from flickering
    // for a split second before we position it in Opened().
    const x = w95.state(Infinity);
    const y = w95.state(Infinity);

    const isYesDisabled = w95.state(false);
    const isNoDisabled = w95.state(false);

    return {
        get x() { return x.now },
        get y() { return y.now },
        get width() { return width },
        get height() { return height },
        Opened() {
            // Center the dialog on the screen. The dialog is positioned relative
            // to its parent, so we need to transform it into screen coordinates.
            // We're assuming the dialog is a direct child of the app's window.
            const screenMidX = ~~((w95.shell.display.width / 2) - (width / 2));
            const screenMidY = ~~((w95.shell.display.height / 2) - height);
            const parentApp = w95.windowManager.get_parent_app(this);
            x.set(screenMidX - parentApp.window.x);
            y.set(screenMidY - parentApp.window.y);
        },
        Closed() {
            x.set(Infinity);
            y.set(Infinity);
        },
        Form() {
            return w95.widget.dialog({
                width,
                height,
                title: "Warning",
                move(deltaX, deltaY) {
                    x.set(deltaX + x.now);
                    y.set(deltaY + y.now);
                },
                children: [
                    w95.widget.bitmap({
                        x: 10,
                        y: 10,
                        image: w95.icon.warning,
                    }),
                    w95.widget.label({
                        x: 58,
                        y: 12,
                        text: "Oops! That was a mistake. The best option now would be\nto click Cancel to go back in time.\n\nWhat do you say?",
                    }),
                    w95.widget.button({
                        x: 50,
                        y: 81,
                        width: 75,
                        text: "Yes",
                        isDisabled: isYesDisabled.now,
                        onMouseEnter() {
                            isYesDisabled.set(true);
                        },
                        onMouseLeave() {
                            isYesDisabled.set(false);
                        },
                    }),
                    w95.widget.button({
                        x: 131,
                        y: 81,
                        width: 76,
                        text: "No",
                        isDisabled: isNoDisabled.now,
                        onMouseEnter() {
                            isNoDisabled.set(true);
                        },
                        onMouseLeave() {
                            isNoDisabled.set(false);
                        },
                    }),
                    w95.widget.button({
                        x: 213,
                        y: 81,
                        width: 76,
                        text: "Cancel",
                        onClick: onReject,
                    }),
                ],
                onClose: onReject,
            });
        },
    };
});
