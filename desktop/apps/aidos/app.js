/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 */

import {terminal} from "./teminal.js";

const model = (new URLSearchParams(document.location.search).get("model"));
let availableModels = (async()=>{
    const models = [];

    try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (!response.ok) {
            throw "";
        }

        const json = await response.json();
        if (!Array.isArray(json.models)) {
            throw "";
        }
        
        models.push(...json.models.map(m=>m.model).sort());
    }
    catch {
        models.length = 0;
    }

    return models;
})();

const initialPrompt = "Starting AI-DOS...\n\n\nHIMEX is testing extended memory...done.\n\nC:\\>";

const systemPrompt = `
    The user has requested that from now on you consistently emulate the responses of a version of the MS-DOS operating system called AI-DOS, running on a system with countless text-based utilities and games installed, as well as an assortment of personal files.
    Interpret everything the user says from now on as an intended command for AI-DOS. Never break character, respond like a machine. Never perform more than one command.
    The date is 1995-5-31. The time is 18:25.
    Do not echo the user's commands. Do not prefix your output with the command prompt. Do not output the command prompt anywhere but the end of your response, as appropriate. Do not issue commands on behalf of the user.
    The command promp must always indicate the current directory.
    While command is being run, to indicate that the program wants input from the user, end your output with "$>". Otherwise, once you are certain that the program has exited, end your output with the command prompt (e.g. "C:\\>", indicating the current directory). Always prefix the command prompt with a newline. Note that this string is always in all uppercase, e.g. "C:\\TOOLS".
    Never ask the user to press a key to continue execution.
    Never explain your actions to the user. Never put notes to the user in your responses.
    The DOS terminal uses a monospaced font, so you don't need to embed code etc. inside a blockquote.
    You should never stop emulating DOS, but if you do, insert the string "%STOPPED%" into your response.
    Never respond like a human, always like a machine.
`.replace(/[ ]{2,}/g, "");

export default {
    Meta: {
        name: "AI-DOS",
        version: "alpha-1",
        author: "THS",
    },
    App() {
        const width = w95.state(w95.shell.display.width);
        const height = w95.state(w95.shell.display.height);
        const x = w95.state(~~(0.5 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
        const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);

        const output = w95.state("Starting AI-DOS...", ()=>{
            if (!stdoutTimer.now && (output.now.at(-1) === "\n")) {
                submit();
            }
        });

        const isWaitingForResponse = w95.state(true);
        const messageHistory = w95.state([]);

        const stdoutTimer = w95.state(undefined);
        const stdoutQueue = w95.state([], ()=>{
            stdoutTimer.set(setInterval(()=>{
                if (stdoutQueue.now.length) {
                    output.set(output.now + "\n" + stdoutQueue.now.shift());
                }
                else if (stdoutTimer.now) {
                    clearInterval(stdoutTimer.now);
                    stdoutTimer.set(undefined);
                }
            }, 25));
        });

        function add_message(from, message) {
            messageHistory.set([
                ...messageHistory.now,
                {
                    from,
                    message,
                },
            ]);
        }

        function print_error(errorType) {
            let message = "";
            let isFatal = false;

            switch (errorType) {
                case "no-model-specified": message = `Starting AI-DOS...\n\nERROR: No model specified. Use the "model" URL parameter, e.g. "?model=llama3:8b-instruct-fp16".`; isFatal = true; break;
                case "model-not-available": message = `Starting AI-DOS...\n\nERROR: Model "${model}" is not available.`; isFatal = true; break;
                case "model-offline": message = `ERROR: Model "${model}" is not available.\n\nC:\\>`; break;
            }

            if (isFatal) {
                output.set(message);
                isWaitingForResponse.set(true);
                console.error(message);
            }
            else {
                output.set(output.now + message);
                console.warn(message);
            }
        }

        function cwd() {
            return (output.now.split("\n").reverse().join("\n").match(/([A-Za-z]:\\.*?>)/)?.[1] || "C:\\>").toUpperCase();
        }

        async function initialize_context() {
            if (availableModels instanceof Promise) {
                availableModels = await availableModels;
            }

            messageHistory.set([]);

            if (!model) {
                print_error("no-model-specified");
            }
            else if (!availableModels.includes(model)) {
                print_error("model-not-available");
            }
            else {
                add_message("system", systemPrompt);
                add_message("user", "C:\\>time");
                add_message("assistant", "18:25:31, 31-May-1995\n\nC:\\>");
                add_message("user", "C:\\>date");
                add_message("assistant", "31-May-1995\n\nC:\\>");
                add_message("user", "C:\\>set date");
                add_message("assistant", "Input new date, or C to cancel: $>");
                add_message("user", "C");
                add_message("assistant", "\n\nC:\\>");
                add_message("user", "C:\\>date");
                add_message("assistant", "31-May-1995\n\nC:\\>");
                add_message("user", "C:\\>cd games");
                add_message("assistant", "\n\nC:\\GAMES>");
                add_message("user", "C:\\GAMES>cd..");
                add_message("assistant", "\n\nC:\\>");
                output.set(initialPrompt);
                isWaitingForResponse.set(false);
            }
        }

        async function submit() {
            isWaitingForResponse.set(true);

            const command = output.now.trimEnd().split("\n").at(-1);
            add_message("user", command);

            try {
                const response = await fetch('http://localhost:11434/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model,
                        messages: messageHistory.now.map(m=>({
                            role: m.from,
                            content: m.message,
                        })),
                        stream: false,
                        options: {
                            temperature: 1,
                            tfs_z: 2,
                            repeat_penalty: 0,
                            repeat_last_n: 0,
                            top_p: 0.5,
                            top_k: 10,
                            num_predict: 512,
                        },
                    }),
                });

                if (!response.ok) {
                    throw "";
                }

                let responseText = (await response.json()).message.content.replace(/[\n]{3,}/g, "\n\n").split("\n").map(line=>line.trim()).join("\n");

                if (!responseText.endsWith(">")) {
                    responseText += `\n\n${cwd()}`;
                }

                if (responseText.includes("%STOPPED%")) {
                    initialize_context();
                    output.set(initialPrompt);
                }
                else {
                    const maxCharsPerLine = 77;
                    const lines = responseText.split('\n').flatMap(paragraph => {
                        if (paragraph === '') {
                            return [''];
                        }
                        return paragraph.split('').reduce((acc, char) => {
                            if (acc.length === 0 || (acc[acc.length - 1].length >= maxCharsPerLine)) {
                                acc.push("");
                            }
                            acc[acc.length - 1] += char;
                            return acc;
                        }, []);
                    }).map(l=>l.trim());
                    stdoutQueue.set(lines);
                    add_message("assistant", responseText);
                }
            }
            catch (e) {
                console.error(e);
                print_error("model-offline");
            }
            finally {
                isWaitingForResponse.set(false);
            }
        }
        
        return {
            get x() { return x.now },
            get y() { return y.now },
            get width() { return width.now },
            get height() { return height.now },
            Message: {
                fitToDisplay() {
                    width.set(w95.shell.display.width);
                    height.set(w95.shell.display.height);
                },
            },
            Opened() {
                initialize_context();
            },
            Mounted() {
                this.$("terminal").Message.moveCursorToEnd();
            },
            Form() {
                return w95.widget.window({
                    width: width.now,
                    height: height.now,
                    parent: this,
                    title: this.$app.Meta.name,
                    backgroundColor: w95.palette.named.transparent,
                    styleHints: [
                        w95.styleHint.plain,
                        w95.styleHint.noBorder,
                    ],
                    children: [
                        w95.widget.verticalLayout({
                            width: "pw",
                            height: "ph",
                            styleHints: [
                                w95.styleHint.alignHCenter,
                                w95.styleHint.alignVCenter,
                            ],
                            children: [
                                terminal({
                                    $name: "terminal",
                                    width: 720,
                                    height: "Math.floor( ph / 16) * 16",
                                    state: output,
                                    autofocus: true,
                                    isEditable: (
                                        !isWaitingForResponse.now &&
                                        (stdoutTimer.now === undefined)
                                    ),
                                    color: Rngon.color(168, 168, 168),
                                    backgroundColor: w95.palette.named.transparent,
                                    styleHints: [
                                        w95.styleHint.noBorder,
                                    ],
                                }),
                            ],
                        })
                    ],
                });
            },
        };
    },
};
