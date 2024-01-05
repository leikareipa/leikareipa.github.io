/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

w95.widget("customWarning", function({
    onReject = undefined,
} = {})
{
    w95.debug?.assert(typeof onAccept === "undefined");
    w95.debug?.assert(typeof onReject === "function");

    const isYesDisabled = w95.state(false);
    const isNoDisabled = w95.state(false);

    return {
        get x() { return 0 },
        get y() { return 0 },
        get width() { return 0 },
        get height() { return 0 },
        Form() {
            return w95.shell.popup({
                icon: w95.icon.warning,
                title: "Warning",
                text: "Oops! That was a mistake. The best option now would be\nto click Cancel to go back in time.\n\nWhat do you say?",
                buttons: [
                    w95.widget.button({
                        x: 0,
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
                        x: 81,
                        width: 75,
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
                        x: 162,
                        width: 75,
                        text: "Cancel",
                        onClick: onReject,
                    }),
                ],
                onReject,
            });
        },
    };
});
