/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import textures from "./textures.js";
import {appicon16, appicon16Disabled} from "../textures.js";
import {contactInfo} from "./widgets/contact-info.js";
import {editMessage} from "./widgets/edit-message.js";

export default function({
    model = "yi:1.5-9B-chat",
    name = model,
    friend = "Tom",
    personality = "",
    isPeriodCorrect = true,
    isMessageDelay = true,
} = {}) {
    if (typeof friend === "function") {
        friend = friend();
    }

    const systemPrompt = `
        ${isPeriodCorrect
            ? "Listen carefully. The year is 1998. We're two people casually chatting with each other via an"+
              " instant messenger of the time. You responses must at all times maintain the coherency of this context, and"+
              " you must never refer to it as having been in the past. If I ask you anything to do with post-1998, you need to"+
              " consistently pretend like it hasn't happened yet. But don't reminisce about this time frame, it's simply the"+
              " time we live in and there's nothing inherently special about that. Note that the chat doesn't"+
              " support emojis, so if they're appropriate for your personality, use smileys instead: :), ;),"+
              " :p, :D, etc. Keep your response length appropriate for instant messaging, i.e. fairly short. Focus on one thing per"+
              " message. Most of your messages don't need to contain a question, let the chat flow freely. You don't"+
              " need to format your response in any special way, the chat client will handle it. Never sign"+
              " your messages, this is a instant messaging conversation and not a letter. Don't include editorial notes in your messages"+
              " and don't refer to this system message in your responses. Feel obliged to add"+
              " typos or slang, not capitalize your words consistently, or other such flavor of 1990s instant messaging"+
              " within reason if it helps bring out your personality. Remember, you're not here to assist me, we're just two individuals"+
              " with our own needs having a conversation. Remember that you can choose to end a conversation if you don't like it,"+
              " but it should be an extreme measure. Always keep this in mind: don't break the fourth wall."
            : "You're an AI assistant engaged in a private chat with the user via instant messaging."}
        Your name is "${name}" and my name is "${friend}". You can assume my gender based on my name. The conversation was started by me.
        ${personality.length? `Your personality: ${personality}` : ""}
    `.replace(/[ ]{2,}/g, "");

    return {
        Meta: {
            name: "Message session",
            version: "1.0",
            author: "Tarpeeksi Hyvae Soft",
        },
        App() {
            // The dimensions of the app's window.
            const minWidth = 400;
            const minHeight = 200;
            const width = w95.state(minWidth);
            const height = w95.state(minHeight);

            // The position of the app's window.
            const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
            const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);

            const editedMessage = w95.state("");
            const messageHistory = w95.state([], refresh_chat_text);
            const chatText = w95.state("");
            const prompt = w95.state("");
            const isWaitingForResponse = w95.state(false);
            const errorFlag = w95.state(false);
            
            const isContactInfoDialogOpen = w95.state(false);
            const isOverrideStringDialogOpen = w95.state(false);

            function reset_chat_history() {
                messageHistory.set([]);
            }

            function add_message(from, message) {
                messageHistory.set([
                    ...messageHistory.now,
                    {
                        sender: from,
                        text: message.trim().replace(/[^\x00-\xFF]+/g, ""), // Note: we strip non-ASCII because the font doesn't support it.
                        time: curtime(),
                    }
                ]);
            }

            async function send_current_prompt() {
                const startTime = performance.now();

                isWaitingForResponse.set(true);

                if (prompt.now.length) {
                    add_message(friend, prompt.now);
                    prompt.set("");
                }

                const messageList = [];
                {
                    if (systemPrompt.length) {
                        messageList.push({
                            role: "system",
                            content: systemPrompt,
                        });
                    }

                    messageList.push(...messageHistory.now.map(m=>({
                        role: (
                            (m.sender === friend)
                                ? "user"
                                : "assistant"
                        ),
                        content: m.text,
                    })));
                }

                try {
                    const response = await fetch('http://localhost:11434/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model,
                            messages: messageList,
                            stream: false
                        }),
                    });

                    if (!response.ok) {
                        throw "";
                    }

                    const json = await response.json();
                    const responseText = (json.message?.content || "");
                    const waitTime = (isMessageDelay? (responseText.length * 95) : 0);

                    setTimeout(()=>{
                        isWaitingForResponse.set(false);
                        add_message(name, (json.message?.content || "(No response)"));
                        errorFlag.set(false);
                    }, (waitTime - (performance.now() - startTime)));
                }
                catch {
                    isWaitingForResponse.set(false);
                    errorFlag.set(true);
                }
                finally {
                    intf.$("prompt-input").Message.focus();
                }
            }

            function refresh_chat_text() {
                chatText.set("");

                for (const message of messageHistory.now) {
                    const color = (
                        (message.sender === friend)
                            ? "blue"
                            : "green"
                    );
                    const from = (
                        (message.sender === friend)
                            ? "You"
                            : message.sender
                    );
                    chatText.set(`\r{${color}}\b${from} (${message.time}):\b\r{}\n${message.text}\n\n${chatText.now}`);
                }

                chatText.set(chatText.now.trimEnd());
                editedMessage.set(messageHistory.now.at(-1)?.text || "");
            }

            const intf = {
                get x() { return x.now },
                get y() { return y.now },
                get width() { return width.now },
                get height() { return height.now },
                get chatField() { return this.$("messages-view") },
                Opened() {
                    reset_chat_history();
                },
                Form() {
                    return w95.widget.window({
                        parent: this,
                        title: `${name}${errorFlag.now? " [Offline]" : ""} - ${this.$app.Meta.name} as ${friend}`,
                        icon: (errorFlag.now? appicon16Disabled : appicon16),
                        resize(deltaWidth, deltaHeight) {
                            width.set(Math.max(minWidth, (width.now + deltaWidth)));
                            height.set(Math.max(minHeight, (height.now + deltaHeight)));
                        },
                        move(deltaX, deltaY) {
                            x.set(x.now + deltaX);
                            y.set(y.now + deltaY);
                        },
                        close() {
                            w95.windowManager.release_window(this)
                        },
                        children: [
                            w95.widget.verticalLayout({
                                y: 1,
                                width: "pw",
                                padding: 0,
                                children: [
                                    w95.widget.scrollArea({
                                        $name: "messages-view",
                                        width: "pw",
                                        height: (height.now - 74),
                                        backgroundColor: Rngon.color.white,
                                        alwaysShowVerticalScroll: true,
                                        children: [
                                            w95.widget.label({
                                                x: 2,
                                                y: 2,
                                                text: chatText.now,
                                                width: (width.now - 30),
                                                wordWrap: true,
                                            }),
                                        ],
                                    }),
                                    w95.widget.layoutSpacer({
                                        height: 3,
                                    }),
                                    w95.widget.horizontalLayout({
                                        width: "pw",
                                        height: 21,
                                        padding: 4,
                                        children: [
                                            w95.widget.button({
                                                text: "Send",
                                                width: 50,
                                                height: "ph",
                                                isDisabled: (
                                                    isWaitingForResponse.now ||
                                                    !prompt.now.trim().length
                                                ),
                                                onClick: send_current_prompt,
                                            }),
                                            w95.widget.lineEdit({
                                                $name: "prompt-input",
                                                width: "pw - 79",
                                                height: "ph",
                                                state: prompt,
                                                autofocus: true,
                                                font: w95.font.sansSerif8,
                                                isDisabled: isWaitingForResponse.now,
                                                onSubmit() {
                                                    if (prompt.now.trim().length) {
                                                        send_current_prompt()
                                                    }
                                                    else {
                                                        return false;
                                                    }
                                                },
                                            }),
                                            w95.widget.frame({
                                                height: "ph",
                                                width: "ph",
                                                shape: w95.frameShape.input,
                                                children: [
                                                    w95.widget.bitmap({
                                                        x: 1,
                                                        y: 1,
                                                        image: textures.wait,
                                                    }, {hideIf: !isWaitingForResponse.now}),
                                                ],
                                            }),
                                        ],
                                    }),
                                    w95.widget.horizontalLayout({
                                        width: "pw",
                                        height: 25,
                                        padding: 4,
                                        styleHints: [
                                            w95.styleHint.alignVCenter,
                                        ],
                                        children: [
                                            w95.widget.label({
                                                text: "To:",
                                            }),
                                            w95.widget.frame({
                                                width: 125,
                                                height: 16,
                                                children: [
                                                    w95.widget.label({
                                                        width: "pw",
                                                        height: "ph",
                                                        text: name,
                                                        elide: true,
                                                        styleHints: [
                                                            w95.styleHint.alignVCenter,
                                                            w95.styleHint.alignHCenter,
                                                        ],
                                                    }),
                                                ],
                                            }),
                                            w95.widget.button({
                                                width: 16,
                                                height: 16,
                                                icon: textures.info,
                                                onClick() {
                                                    isContactInfoDialogOpen.set(true);
                                                },
                                            }),
                                            w95.widget.layoutSpacer({
                                                width: 10,
                                            }),
                                        ],
                                    }),
                                    w95.widget.layoutSpacer({
                                        height: -25,
                                    }),
                                    w95.widget.horizontalLayout({
                                        width: "pw",
                                        height: 25,
                                        padding: 4,
                                        styleHints: [
                                            w95.styleHint.alignVCenter,
                                            w95.styleHint.alignRight,
                                        ],
                                        children: [
                                            w95.widget.button({
                                                width: 18,
                                                height: 18,
                                                icon: textures.clipboard,
                                                onClick() {
                                                    navigator.clipboard.writeText(chatText.now.replace(/{}/g, "").trim());
                                                },
                                            }),
                                            w95.widget.button({
                                                width: 18,
                                                height: 18,
                                                icon: textures.clear,
                                                isDisabled: (
                                                    isWaitingForResponse.now ||
                                                    !messageHistory.now.length
                                                ),
                                                onClick() {
                                                    messageHistory.now.pop();
                                                    refresh_chat_text();
                                                    intf.chatField.Message.scrollToVerticalTarget(0);
                                                },
                                            }),
                                            w95.widget.button({
                                                width: 18,
                                                height: 18,
                                                icon: textures.edit,
                                                isDisabled: (
                                                    isWaitingForResponse.now ||
                                                    !messageHistory.now.length
                                                ),
                                                onClick() {
                                                    isOverrideStringDialogOpen.set(true);
                                                },
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            contactInfo({
                                x: ((width.now / 2) - 155),
                                width: 310,
                                height: 188,
                                model,
                                name,
                                personality,
                                isPeriodCorrect,
                                isMessageDelay,
                                onAccept() {
                                    isContactInfoDialogOpen.set(false);
                                },
                                onReject() {
                                    isContactInfoDialogOpen.set(false);
                                },
                            }, {hideIf: !isContactInfoDialogOpen.now}),
                            editMessage({
                                x: ((width.now / 2) - 155),
                                width: 310,
                                height: 146,
                                from: (messageHistory.now.at(-1)?.sender || "Unknown"),
                                message: editedMessage,
                                onAccept() {
                                    messageHistory.now.at(-1).text = editedMessage.now;
                                    refresh_chat_text();

                                    isOverrideStringDialogOpen.set(false);
                                },
                                onReject() {
                                    isOverrideStringDialogOpen.set(false);
                                },
                            }, {hideIf: !isOverrideStringDialogOpen.now}),
                        ],
                    });
                },
            };
            return intf;
        },
    };
}

function curtime() {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    return formatter.format(now);
}
