import {icons} from "./icons.js";

// Clipboard permissions vary with browser and hosting. Native text dialogs
// keep code exchange available when clipboard APIs are missing or denied.
export async function copyCode(code, copied, failure) {
    copied.set(false);
    //failure.set("");
    try {
        await navigator.clipboard.writeText(code);
        copied.set(true);
    }
    catch {
        //failure.set("Copy the code from the text dialog.");
        window.prompt("Copy this code, then send it to the other player:", code);
    }
}

export async function readCode() {
    try {
        return await navigator.clipboard.readText();
    }
    catch {
        return window.prompt("Paste the code from the other player:", "");
    }
}

// The running dialog's app instance, for rally.js to close it once the race starts (see rallyNetUI in index.html).
let appInstance = null;

export function closeWindow() {
    if (appInstance) {
        const app = appInstance;
        appInstance = null;
        w95.windowManager.release_window(app.window);
    }
}

// The connection logic is in rally.js (window.rallyNetwork): hostOffer(), acceptAnswer(code),
// joinWithOffer(code), and the onStatus({text, error}) callback.

export default {
    Meta: {
        name: "Rally-Sport: Network Lobby",
        version: "1.0",
        author: "Sigmoid Colon",
        description: "Handshakes a WebRTC connection between two browsers.",
    },
    App() {
        const minWidth = 350;
        const minHeight = 250;
        const width = w95.state(minWidth);
        const height = w95.state(minHeight);
        const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
        const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);

        const role = w95.state("");
        const tabIndex = w95.state(0);

        // A short failure message and a progress message, shown next to the buttons.
        const failure = w95.state("");
        const progress = w95.state("");

        const hostState = {
            invitationCode: w95.state(""),
            isInvitationCodeBeingGenerated: w95.state(false),
            isInvitationCodeValid: w95.state(false),
            hasInvitationCodeBeenCopied: w95.state(false),
        };
        const joinState = {
            invitationCode: w95.state(""),
            replyCode: w95.state(""),
            isInvitationCodeValid: w95.state(false),
            hasReplyCodeBeenCopied: w95.state(false),
        };

        return {
            Opened() {
                appInstance = this;
                window.rallyNetwork.onStatus = ({text, error})=>{
                    if (error) {
                        failure.set("Couldn't connect.");
                    }
                    else {
                        progress.set(text);
                    }
                };
            },
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Message: {
                fitToDisplay() {
                    x.set(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
                    y.set(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);
                },
            },
            Form() {
                return w95.widget.window({
                    parent: this,
                    title: this.$app.Meta.name,
                    icon: icons.networkNeighborhood16,
                    close() {
                        // The user closed the dialog: cancel the connection attempt.
                        appInstance = null;
                        window.rallyNetwork.onStatus = null;
                        window.rallyNetwork.closed();
                        w95.windowManager.release_window(this);
                    },
                    children: [
                        w95.widget.tabControl({
                            x: 1,
                            y: 2,
                            width: "pw - 2",
                            height: "ph - 3",
                            state: tabIndex,
                            tabs: {
                                "Host a race": {
                                    isDisabled: (role.now == "join"),
                                    children: [
                                        w95.widget.label({
                                            x: 10,
                                            y: 10,
                                            wordWrap: true,
                                            width: "pw - 20",
                                            text: "To \bhost\b a race, generate a join code and send it to your opponent, then paste in the reply code they give you.*",
                                        }),
                                        w95.widget.frame({
                                            x: 10,
                                            y: 45,
                                            width: "pw - 20",
                                            height: 82,
                                            shape: w95.frameShape.fancyBox,
                                            children: [
                                                w95.widget.verticalLayout({
                                                    x: 10,
                                                    y: 10,
                                                    width: "pw - 20",
                                                    children: [
                                                        w95.widget.horizontalLayout({
                                                            width: "pw",
                                                            padding: 6,
                                                            styleHints: [
                                                                w95.styleHint.alignLeft,
                                                            ],
                                                            isDisabled: joinState.replyCode.now,
                                                            children: [
                                                                w95.widget.button({
                                                                    text: "Generate join code",
                                                                    isDisabled: (
                                                                        hostState.isInvitationCodeBeingGenerated.now ||
                                                                        hostState.invitationCode.now
                                                                    ),
                                                                    onClick() {
                                                                        role.set("host");
                                                                        failure.set("");
                                                                        hostState.isInvitationCodeBeingGenerated.set(true);
                                                                        window.rallyNetwork.hostOffer().then(code=>{
                                                                            hostState.invitationCode.set(code);
                                                                            hostState.isInvitationCodeValid.set(true);
                                                                            hostState.hasInvitationCodeBeenCopied.set(false);
                                                                        }).catch(e=>{
                                                                            failure.set("Couldn't generate a code.");
                                                                        }).finally(()=>{
                                                                            hostState.isInvitationCodeBeingGenerated.set(false);
                                                                        });
                                                                    },
                                                                }),
                                                                w95.widget.label({
                                                                    height: 23,
                                                                    cursor: (
                                                                        hostState.invitationCode.now
                                                                            ? w95.cursor.pointer
                                                                            : w95.cursor.arrow
                                                                    ),
                                                                    styleHints: [
                                                                        w95.styleHint.alignVCenter,
                                                                        hostState.invitationCode.now? w95.styleHint.underlined : w95.styleHint.none,
                                                                    ],
                                                                    text: (
                                                                        hostState.isInvitationCodeBeingGenerated.now
                                                                            ? "Generating..."
                                                                            :hostState.invitationCode.now
                                                                                ? "Done! Copy join code to clipboard."
                                                                                : "Ready to generate."
                                                                    ),
                                                                    color: (
                                                                        hostState.invitationCode.now
                                                                            ? hostState.hasInvitationCodeBeenCopied.now
                                                                                ? w95.palette.named.purple
                                                                                : w95.palette.named.blue
                                                                            : w95.palette.named.black
                                                                    ),
                                                                    onMouseDown() {
                                                                        if (hostState.invitationCode.now) {
                                                                            void copyCode(hostState.invitationCode.now, hostState.hasInvitationCodeBeenCopied, failure);
                                                                        }
                                                                    },
                                                                }),
                                                            ],
                                                        }),
                                                    ],
                                                }),
                                                w95.widget.horizontalRule({
                                                    x: 2,
                                                    y: 40,
                                                    width: "pw - 4"
                                                }),
                                                w95.widget.verticalLayout({
                                                    x: 10,
                                                    y: 50,
                                                    width: "pw - 20",
                                                    children: [
                                                        w95.widget.horizontalLayout({
                                                            width: "pw",
                                                            padding: 6,
                                                            styleHints: [
                                                                w95.styleHint.alignLeft,
                                                            ],
                                                            isDisabled: !hostState.invitationCode.now,
                                                            children: [
                                                                w95.widget.button({
                                                                    text: "Paste reply code",
                                                                    icon: icons.clipboard16,
                                                                    isDisabled: joinState.replyCode.now,
                                                                    onClick({widget}) {
                                                                        (async()=>{
                                                                            failure.set("");
                                                                            progress.set("");
                                                                            let text;
                                                                            try {
                                                                                text = await readCode();
                                                                            }
                                                                            catch {
                                                                                failure.set("Can't read the clipboard.");
                                                                                return;
                                                                            }
                                                                            if (!text) return;
                                                                            joinState.replyCode.set(text);
                                                                            try {
                                                                                await window.rallyNetwork.acceptAnswer(text);
                                                                            }
                                                                            catch (e) {
                                                                                joinState.replyCode.set("");
                                                                                failure.set("Invalid reply code; try again.");
                                                                            }
                                                                        })();
                                                                    },
                                                                }),
                                                                w95.widget.label({
                                                                    height: 22,
                                                                    styleHints: [
                                                                        w95.styleHint.alignVCenter
                                                                    ],
                                                                    text: (
                                                                        failure.now
                                                                            ? failure.now
                                                                            : joinState.replyCode.now
                                                                                ? (progress.now || "Connecting...")
                                                                                : "Ready for clipboard input."
                                                                    ),
                                                                }),
                                                            ],
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                        w95.widget.label({
                                            x: 10,
                                            y: 148,
                                            wordWrap: true,
                                            color: w95.palette.named.dimgray,
                                            width: "pw - 20",
                                            text: "If the reply code is valid, the race will begin on your currently selected track! *Join codes contain your IP address; share them only with people you trust.",
                                        }),
                                    ],
                                },
                                "Join a race": {
                                    isDisabled: (role.now == "host"),
                                    children: [
                                        w95.widget.label({
                                            x: 10,
                                            y: 10,
                                            wordWrap: true,
                                            width: "pw - 20",
                                            text: "To \bjoin\b a race, enter the join code you received from your opponent, then send them your reply code.* The join code may expire within a minute or so of being generated.",
                                        }),
                                        w95.widget.frame({
                                            x: 10,
                                            y: 58,
                                            width: "pw - 20",
                                            height: 42,
                                            shape: w95.frameShape.fancyBox,
                                            children: [
                                                w95.widget.verticalLayout({
                                                    x: 10,
                                                    y: 10,
                                                    width: "pw - 20",
                                                    children: [
                                                        w95.widget.horizontalLayout({
                                                            width: "pw",
                                                            padding: 6,
                                                            styleHints: [
                                                                w95.styleHint.alignLeft,
                                                            ],
                                                            children: [
                                                                w95.widget.button({
                                                                    text: "Paste join code",
                                                                    icon: icons.clipboard16,
                                                                    isDisabled: (joinState.isInvitationCodeValid.now || joinState.invitationCode.now),
                                                                    onClick() {
                                                                        role.set("join");
                                                                        (async()=>{
                                                                            failure.set("");
                                                                            progress.set("");
                                                                            let text;
                                                                            try {
                                                                                text = await readCode();
                                                                            }
                                                                            catch {
                                                                                failure.set("Can't read the clipboard.");
                                                                                return;
                                                                            }
                                                                            if (!text) return;
                                                                            joinState.invitationCode.set(text);
                                                                            try {
                                                                                const code = await window.rallyNetwork.joinWithOffer(text);
                                                                                joinState.replyCode.set(code);
                                                                                joinState.isInvitationCodeValid.set(true);
                                                                                joinState.hasReplyCodeBeenCopied.set(false);
                                                                            }
                                                                            catch (e) {
                                                                                joinState.invitationCode.set("");
                                                                                failure.set("Invalid join code; try again.");
                                                                            }
                                                                        })();
                                                                    },
                                                                }),
                                                                w95.widget.label({
                                                                    height: 23,
                                                                    cursor: (
                                                                        joinState.replyCode.now
                                                                            ? w95.cursor.pointer
                                                                            : w95.cursor.arrow
                                                                    ),
                                                                    styleHints: [
                                                                        w95.styleHint.alignVCenter,
                                                                        joinState.replyCode.now? w95.styleHint.underlined : w95.styleHint.none,
                                                                    ],
                                                                    text: (
                                                                        failure.now
                                                                            ? failure.now
                                                                            : joinState.replyCode.now
                                                                                ? (progress.now || "OK! Copy reply code to clipboard.")
                                                                                : joinState.invitationCode.now
                                                                                    ? "Generating a reply code..."
                                                                                    : "Ready for clipboard input."
                                                                    ),
                                                                    color: (
                                                                        joinState.replyCode.now
                                                                            ? joinState.hasReplyCodeBeenCopied.now
                                                                                ? w95.palette.named.purple
                                                                                : w95.palette.named.blue
                                                                            : w95.palette.named.black
                                                                    ),
                                                                    onMouseDown() {
                                                                        if (joinState.replyCode.now) {
                                                                            void copyCode(joinState.replyCode.now, joinState.hasReplyCodeBeenCopied, failure);
                                                                        }
                                                                    },
                                                                }),
                                                            ],
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                        w95.widget.label({
                                            x: 10,
                                            y: 148,
                                            wordWrap: true,
                                            color: w95.palette.named.dimgray,
                                            width: "pw - 20",
                                            text: "Once your opponent has entered your reply code, the race will begin on their currently selected track! *Reply codes contain your IP address; share them only with people you trust.",
                                        }),
                                    ],
                                },
                                "Help": {
                                    children: [
                                        w95.widget.scrollArea({
                                            x: 5,
                                            y: 5,
                                            width: "pw - 10",
                                            height: "ph - 10",
                                            backgroundColor: w95.palette.named.white,
                                            frameShape: w95.frameShape.input,
                                            children: [
                                                w95.widget.label({
                                                    x: 5,
                                                    y: 5,
                                                    width: 300,
                                                    wordWrap: true,
                                                    text: (
                                                        "\bNetwork Lobby for Rally-Sport\b\n\n"
                                                       +"The network lobby allows one to negotiate a multiplayer race between "
                                                       +"two browsers via a direct WebRTC connection. This method of shared play "
                                                       +"should work fine in most cases, though compatibility can't be guaranteed "
                                                       +"and may be poor under stricter networks (eg. work or school)."
                                                       +"\n\n\bHow-to\b\n\n"
                                                       +"You can either host or join a race. In both cases, you generate a code and share it with "
                                                       +"your opponent, which is how the network connection is established. Both "
                                                       +"parties must select \r{mediumblue}\bNetwork\b\r{} as the race type in the game's \r{fuchsia}\bDrive Setup\b\r{} menu. "
                                                       +"\n\nNote: Your code includes your IP address, so only share it with someone "
                                                       +"you trust.\n\n"
                                                       +"The person hosting a race generates a join code and shares it - via some external "
                                                       +"means, like real-time chat - with the to-be opponent. The opponent then "
                                                       +"generates a reply code and shares it with the person hosting. Once the host "
                                                       +"applies the code, the race will start.\n\n"
                                                       +"Depending on the browser that you are using, a code will remain valid for "
                                                       +"anywhere from ten seconds to some number of minutes after being generated. "
                                                       +"Both join and reply codes are one-time use only."
                                                       +"\n\n\bThe race\b\n\n"
                                                       +"A multiplayer race takes place on the track selected by the host. If you set a lap "
                                                       +"record during the race, it will be saved locally in your game only; lap "
                                                       +"records set by your opponent in a network race will not be saved in your game. "
                                                       +"If your opponents leaves the game mid-race the checkered flag will wave for you "
                                                       +"and you may either exit the game or finish your lap(s)."
                                                       +"\n\n\bAuthorship\b\n\n"
                                                       +"Network play was not a feature of the original Rally-Sport; it was "
                                                       +"added in 2026 by Claude Code and Sigmoid Colon <drilledicecream@gmail.com>."
                                                    ),
                                                }),
                                            ],
                                        }),
                                    ],
                                },
                            },
                        }),
                    ],
                });
            },
        };
    },
};
