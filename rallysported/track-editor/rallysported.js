// RallySportED
// 2016-2023 Tarpeeksi Hyvae Soft
// https://github.com/leikareipa/rallysported/
// -------------------------------------------


/*
 * Most recent known filename: js/rallysported.js
 *
 * 2018-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// RallySportED-js's top-level namespace.
//
// Note that this object will be extended by the other source files of
// RallySportED-js, as well.
const Rsed = {
    appName: "RallySportED's track editor",
    appVersion: "dev",
    
    get $currentProject()
    {
        return Rsed.core.current_project();
    },

    get $currentScene()
    {
        return Rsed.core.current_scene();
    },

    set $currentScene(sceneName)
    {
        Rsed.iframeListener.send_message?.("view:editor", sceneName);
        return Rsed.core.set_scene(sceneName);
    },

    // Generates a v4 UUID and returns it as a string. Adapted with superficial
    // modifications from https://stackoverflow.com/a/2117523, which in turn is
    // based on https://gist.github.com/jed/982883.
    generate_uuid4: function()
    {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c=>(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    },

    throw: function(fatalErrorMessage = "")
    {
        throw new Error(fatalErrorMessage);
    },

    alert: function(message = "")
    {
        console.warn(message);
        Rsed.ui.dom.popup_notification(message);
    },

    log: function(message = "")
    {
        console.log(message);
    },

    lerp: function(x, y, interval)
    {
        return (x + (interval * (y - x)));
    },    

    throw_if: function(condition, messageIfTrue)
    {
        if (condition)
        {
            throw new Error(messageIfTrue);
        }
    },

    throw_if_undefined: function(...properties)
    {
        for (const property of properties)
        {
            if (typeof property === "undefined")
            {
                throw new Error("A required property is undefined.");
            }
        }

        return;
    },

    throw_if_not_type: function(typeName, ...properties)
    {
        for (const property of properties)
        {
            const isOfType = (()=>
            {
                switch (typeName)
                {
                    case "array": return Array.isArray(property);
                    default: return (typeof property === typeName);
                }
            })();

            if (!isOfType)
            {
                throw new Error(`A property is of the wrong type; expected "${typeName}".`);
            }
        }

        return;
    },

    lerp: function(x = 0, y = 0, interval = 0)
    {
        return (x + (interval * (y - x)));
    },

    clamp: function(value = 0, min = 0, max = 1)
    {
        return Math.min(Math.max(value, min), max);
    },

    // Call this function using optional chaining: "Rsed.assert?.()".
    // To disable assertions, comment out this function definition.
    assert: function(condition, errorMessage = "Unspecified error")
    {
        if (!condition)
        {
            throw new Error(errorMessage);
        }
    }
};
/*
 * Most recent known filename: js/ui/ui.js
 *
 * 2019-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui = {
    canvas: {},
    dom: {},
    utils: {},
};
/*
 * Most recent known filename: js/ui/notification.js
 *
 * 2019 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Opens a self-closing popup notification in RallySportED's DOM.
Rsed.ui.dom.popup_notification = function(string = "", args = {})
{
    Rsed.throw_if_not_type("string", string);
    Rsed.throw_if_not_type("object", args);

    args =
    {
        ...{
            notificationType: "warning", // | "info" | "error" | "fatal"
            timeoutMs: 6000,
        },
        ...args
    }

    Rsed.throw_if_not_type("number", args.timeoutMs);
    Rsed.throw_if_not_type("string", args.notificationType);

    const faIcon = (()=>
    {
        const meta = "fa-fw";

        switch (args.notificationType)
        {
            case "info": return `${meta} fas fa-info`;
            case "warning": return `${meta} fas fa-frog`;
            case "error": return `${meta} fas fa-spider`;
            case "fatal": return `${meta} fas fa-otter`;
            default: return `${meta} fas far fa-comment`;
        }
    })();

    // Spacing (in pixels) between two adjacent popup elements.
    const popupVerticalSpacing = 1;

    const popupElement = document.createElement("div");
    const iconElement = document.createElement("i");
    const textContainer = document.createElement("div");
    
    iconElement.classList.add(...(`icon-element ${faIcon}`.split(" ")));
    textContainer.classList.add("text-container");
    popupElement.classList.add("popup-notification", "transitioning-in", args.notificationType);

    textContainer.innerHTML = string;

    //popupElement.appendChild(iconElement); // For visual clarity, the icon element is currently not appended.
    popupElement.close = ()=>close_popup(popupElement);
    popupElement.appendChild(textContainer);
    popupElement.onclick = function()
    {
        const currentPopups = Array.from(container.children).filter(p=>p.classList.contains("popup-notification"));

        // Close this popup and all popups before it.
        for (const popup of currentPopups)
        {
            popup.close(true);

            if (popup == popupElement)
            {
                break;
            }
        }
    };

    const container = document.getElementById("popup-notifications-container");

    container.appendChild(popupElement);
    update_vertical_positions();
    append_transition_in();

    const removalTimer = (args.timeoutMs <= 0)
                         ? false
                         : setTimeout(()=>close_popup(popupElement), args.timeoutMs);

    const publicInterface = Object.freeze({
        close: ()=>close_popup(popupElement, true),
    });

    Rsed.log(string);

    return publicInterface;

    function close_popup(popupElement, initiatedByUser = false)
    {
        if (initiatedByUser &&
            popupElement.classList.contains("transitioning-in"))
        {
            return;
        }

        clearTimeout(removalTimer);

        const fadeout = popupElement.animate([
            {opacity: "0"}
        ], {duration: 150, easing: "ease-in-out"});

        fadeout.onfinish = ()=>{
            popupElement.remove();
            update_vertical_positions();
        }

        return;
    }

    // Adds a transitioning animation to the popup. Assumes that the popup element
    // has just been added to the DOM and has an opacity of 0.
    function append_transition_in()
    {
        setTimeout(()=>popupElement.classList.remove("transitioning-in"), 0);
        return;
    }

    // Arrange the currently open popups vertically bottom to top from newest to
    // oldest. (The first popup node is expected to be the oldest.)
    function update_vertical_positions()
    {
        const popups = Array.from(container.children).filter(p=>p.classList.contains("popup-notification"));

        if (!popups.length) {
            return;
        }

        let totalHeight = popups.reduce((totalHeight, popup)=>{
            return (totalHeight + popup.offsetHeight + popupVerticalSpacing);
        }, 0);

        for (const popup of popups) {
            popup.style.bottom = `${totalHeight -= (popup.offsetHeight + popupVerticalSpacing)}px`;
        }
    }
}
/*
 * Most recent known filename: js/misc/browser-metadata.js
 *
 * 2020-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Rudimentary (and not necessarily accurate) information about the browser in which
// the app is running.
Rsed.browserMetadata = (function()
{
    const publicInterface = {
        browserName: (/Chrome/i.test(navigator.userAgent)? "Chrome" :
                      /CriOS/i.test(navigator.userAgent)? "Chrome" :
                      /Opera/i.test(navigator.userAgent)? "Opera" :
                      /Firefox/i.test(navigator.userAgent)? "Firefox" :
                      /Safari/i.test(navigator.userAgent)? "Safari" :
                      null),

        has_url_param: function(paramName = "")
        {
            const params = new URLSearchParams(window.location.search);
            return params.has(paramName);
        },

        warn_of_incompatibilities: function()
        {
            // RallySportED-js projects are exported (saved) via JSZip using Blobs.
            if (!JSZip.support.blob)
            {
                Rsed.ui.dom.popup_notification("This browser doesn't support saving projects to disk!",
                {
                    notificationType: "warning",
                });
            }

            return;
        }
    };

    return publicInterface;
})();
/*
 * 2024 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

Rsed.iframeListener = (function()
{
    if (!Rsed.browserMetadata.has_url_param("w95"))
    {
        return {};
    }

    const publicInterface =
    {
        send_message(message = "", payload)
        {
            window.parent.postMessage({message, payload});
        },
        listen(event)
        {
            if (event.origin !== window.location.origin)
            {
                return;
            }

            switch (event.data.message || event.data)
            {
                case "import:project": {
                    return Rsed.core.start({
                        project: {
                            dataLocality: "client",
                            contentId: event.data.payload,
                        },
                    });
                }
                case "save:project": return Rsed.$currentProject.download_as_zip();
                case "rename:project": return Rsed.$currentProject.rename();

                case "view:editor": return Rsed.$currentScene = event.data.payload;

                case "run:stop": return Rsed.player.stop();
                case "run:play": return Rsed.player.play_with_opponent();
                case "run:test": return Rsed.player.play_test_drive();
                case "run:record": return Rsed.player.record_ai_lap();
                
                case "export:maasto": return Rsed.$currentProject.download_asset_file('maasto');
                case "export:varimaa": return Rsed.$currentProject.download_asset_file('varimaa');
                case "export:palat": return Rsed.$currentProject.download_asset_file('palat');
                case "export:text": return Rsed.$currentProject.download_asset_file('text');
                case "export:anims": return Rsed.$currentProject.download_asset_file('anims');
                case "export:kierros": return Rsed.$currentProject.download_asset_file('kierros');

                case "import:maasto": return Rsed.ui.utils.assetMutator.user_edit("maasto", {command: 'import', file: event.data.payload});
                case "import:varimaa": return Rsed.ui.utils.assetMutator.user_edit("varimaa", {command: 'import', file: event.data.payload});
                case "import:palat": return Rsed.ui.utils.assetMutator.user_edit("palat", {command: 'import', file: event.data.payload});
                case "import:text": return Rsed.ui.utils.assetMutator.user_edit("text", {command: 'import', file: event.data.payload});
                case "import:anims": return Rsed.ui.utils.assetMutator.user_edit("anims", {command: 'import', file: event.data.payload});
                case "import:kierros": return Rsed.ui.utils.assetMutator.user_edit("kierros", {command: 'import', file: event.data.payload});
            }
        },
    };

    return publicInterface;
})();
/*
 * Most recent known filename: js/player/player.js
 *
 * 2021-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Runs Rally-Sport with the current project's data in an in-browser DOSBox via js-dos.
Rsed.player = (function()
{
    let jsdosInterface = null;

    const playerContainer = document.getElementById("jsdos-container");
    const playerCanvas = document.getElementById("jsdos-canvas");
    const stopButton = document.getElementById("stop-jsbox-button");

    Rsed.assert?.(
        (playerCanvas && playerContainer && stopButton),
        "Malformed DOM for the player elements."
    );

    const publicInterface = {
        is_playing: function()
        {
            return (jsdosInterface !== null);
        },
        stop: stop_jsbox,
        record_ai_lap: async function()
        {
            output_listener.buffer = "";

            // We'll run RallySportED's RSED-AI (rai.bat) tool, which launches Rally-Sport and records the
            // user's lap into the RallySportED project's DTA file.
            await run_rallysport_in_jsbox({
                runCommand: ["-c", `rai ${Rsed.$currentProject.name}`],
                stdout_listener: output_listener,
                showStopButton: false,
            });

            // Once the RSED-AI tool exits, we'll load the recorded lap from the js-dos sandbox into RallySportED.
            async function output_listener(outputStream)
            {
                output_listener.buffer += outputStream;

                // Once RSED-AI exits.
                if (output_listener.buffer.endsWith("C:\\>"))
                {
                    // RSED-AI will report errors if the process failed.
                    const succeeded = Boolean(output_listener.buffer.indexOf("Error:") < 0);
                    
                    try
                    {
                        if (succeeded)
                        {
                            const dtaFilename = `${Rsed.$currentProject.name}/${Rsed.$currentProject.name}.DTA`.toUpperCase();
                            const dta = jsdosInterface.dos.FS.readFile(dtaFilename);

                            // Restart RallySportED using the existing project data combined with the new
                            // KIERROS data. (Doing a full app restart is easier than shoehorning in the
                            // new KIERROS data.)
                            Rsed.core.start({
                                project: {
                                    dataLocality: "inline",
                                    data: {
                                        container: dta,
                                        manifesto: Rsed.$currentProject.manifesto,
                                        meta: {
                                            internalName: Rsed.$currentProject.internalName,
                                            displayName: Rsed.$currentProject.name,
                                            width: Rsed.$currentProject.maasto.width,
                                            height: Rsed.$currentProject.maasto.height,
                                        }
                                    },
                                },
                            });
    
                            Rsed.ui.dom.popup_notification("The recording was successful.");
                        }
                        else
                        {
                            Rsed.ui.dom.popup_notification("The recording was canceled.");
                        }
                    }
                    catch (error)
                    {
                        console.error(error);
                        
                        Rsed.ui.dom.popup_notification("There was an error while recording.", {
                            notificationType: "error",
                        });
                    }
                    finally
                    {
                        stop_jsbox();
                    }
                }
            }
        },
        play_test_drive: async function()
        {
            await run_rallysport_in_jsbox({
                withOpponent: false,
                testDrive: true,
            });
        },
        play_with_opponent: async function()
        {
            await run_rallysport_in_jsbox({
                withOpponent: true,
            });
        }
    };

    return publicInterface;

    function stop_jsbox() 
    {
        if (jsdosInterface)
        {
            const gameDta = jsdosInterface.dos.FS.readFile("GAME.DTA");
            localStorage.setItem("rsed:game.dta", gameDta);

            jsdosInterface.exit();
            jsdosInterface = null;
        }

        Rsed.ui.dom.html.set_visible(true);
        Rsed.$currentScene = "terrain-editor";
        playerContainer.style.display = "none";
        document.body.classList.remove("playing", "ingame");
        Rsed.ui.dom.html.refresh();

        Rsed.iframeListener.send_message?.("run:stopped");

        return;
    }

    async function run_rallysport_in_jsbox({
        stdout_listener = function(){},
        runCommand = ["-c", `rload ${Rsed.$currentProject.name}`],
        withOpponent = false,
        testDrive = false,
        showStopButton = true,
    } = {})
    {
        // Don't allow more than one instance of the player.
        if (jsdosInterface)
        {
            return;
        }

        Rsed.iframeListener.send_message?.("run:starting");

        Rsed.ui.dom.html.set_visible(false);
        Rsed.$currentScene = "loading-spinner";
        stopButton.style.display = "none";
        playerCanvas.getContext("2d").clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        document.body.classList.add("playing");

        try
        {
            const trackDataZip = await create_game_zip();

            const jsdosInstance = await Dos(playerCanvas, {
                wdosboxUrl: "./js-dos/wdosbox.js",
                onerror: (error)=>{
                    window.alert(error);
                    stop_jsbox();
                },
            });

            await jsdosInstance.fs.extract(URL.createObjectURL(trackDataZip));

            const extraCommands = await (async()=>{
                const commands = [
                    "-conf", "rsed.conf",
                    "-c", "mixer master 17:17",
                ];

                if (testDrive)
                {
                    // Make the starting lights go out faster.
                    commands.push("-c", "byteset rallye.exe 82253 69");
                }

                // Restore the previously-used in-game settings (which are stored in GAME.DTA).
                if (localStorage.getItem("rsed:game.dta") !== null)
                {
                    const data = localStorage.getItem("rsed:game.dta").split(",");
                    await jsdosInstance.fs.createFile("$GAME$.DTA", data);
                    commands.push("-c", "del GAME.DTA", "-c", "ren $GAME$.DTA GAME.DTA");
                }

                // Set the game mode - practise or vs CPU.
                commands.push("-c", `byteset game.dta 35 ${withOpponent? 0 : 32}`);

                return commands;
            })();

            jsdosInterface = await jsdosInstance.main([
                ...extraCommands,
                ...runCommand,
            ]);

            jsdosInterface.listenStdout(stdout_listener);

            playerContainer.style.display = "initial";

            if (showStopButton)
            {
                stopButton.style.display = "initial";
            }
        }
        catch (error)
        {
            stop_jsbox();

            console.error(error);
            
            Rsed.ui.dom.popup_notification("Couldn't start the DOSBox player.", {
                notificationType: "error",
            });

            return false;
        }

        document.body.classList.add("ingame");
        
        Rsed.iframeListener.send_message?.("run:started");

        return true;
    }

    async function create_game_zip()
    {
        const zip = new JSZip();
        const baseGameZip = await fetch("./assets/data/rallys-rsed.zip");

        if (!baseGameZip.ok)
        {
            Rsed.throw("Invalid base game archive");
        }

        await zip.loadAsync(baseGameZip.blob());
        await Rsed.$currentProject.insert_project_data_into_zip(zip);

        // Insert the backend tools.
        for (const toolName of [
            "rsed_ai.exe",
            "rsed_ld.exe",
            "rai.bat",
            "rload.bat"
        ])
        {
            zip.file(toolName, (await fetch(`./${toolName}`)).blob());
        }

        return await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 1,
            },
        });
    }
})();
/*
 * Most recent known filename: js/project/project.js
 *
 * 2018-2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// A RallySportED project is a collection of assets for a particular Rally-Sport track that
// the user can modify using RallySportED. Namely, the project consists of two files: the
// .DTA file (also called the "container"), and the .$FT file (also called the "manifesto").
// The .DTA file is a binary file containing the track's individual assets; like heightmap,
// tilemap, textures, etc. The .$FT file consists of an ASCII string providing commands
// to RallySportED on how to modify certain hard-coded track parameters in Rally-Sport for
// that particular track (e.g. the positioning of certain track-side objects, etc.).
Rsed.project = async function(projectArgs = {})
{
    // Which of the eight tracks in Rally-Sport's demo version this project is for.
    let trackId = null;

    // Which of Rally-Sport's two PALAT files this track uses.
    let palatId = null;

    // Which RallySportED loader is required to load this track.
    let loaderVersion = null;

    const isPlaceholder = false;

    // The height of water tiles on the current track.
    let waterLevel = 0;

    const recognizedAssetTypes = [
        "maasto",
        "varimaa",
        "palat",
        "text",
        "anims",
        "kierros",
    ];

    // Rally-Sport uses checkpoints - invisible markers at given x,y tile positions on the
    // track - to keep track of whether the player's car has raced a valid lap. In other
    // words, the car must pass through all of the track's checkpoints in order for the lap
    // to count. The demo version of Rally-Sport - which is what RallySportED targets - makes
    // use of only one checkpoint per track (in addition to the finish line).
    const trackCheckpoints = [];
    
    // Overheard wires, like telephone lines.
    const wires = await Rsed.gameContent.wires();

    // Load the project's data. After this, projectData.container is expected to hold the
    // contents of the .DTA file as a Base64-encoded string; and projectData.manifesto the
    // contents of the .$FT file as a plain string.
    const projectData = await fetch_project_data();
    
    Rsed.assert?.(
        ((typeof projectData.container !== "undefined") &&
         (typeof projectData.manifesto !== "undefined") &&
         (typeof projectData.meta !== "undefined") &&
         (typeof projectData.meta.internalName !== "undefined") &&
         (typeof projectData.meta.displayName !== "undefined")),
        "Missing required project data."
    );

    Rsed.assert?.(
        ((projectData.meta.width > 0) &&
         (projectData.meta.height > 0) &&
         (projectData.meta.width === projectData.meta.height)),
        "Invalid track dimensions."
    );

    Rsed.assert?.(
        is_valid_project_name(projectData.meta.internalName),
        `Invalid project base name "${projectData.meta.internalName}".`
    );

    let {
        dataContainer,
        maasto,
        varimaa,
        palat,
        anims,
        props,
        kierros
    } = await Rsed.project.parse_container_data(projectData.container, projectData.manifesto);

    apply_manifesto(projectData.manifesto);

    window.dispatchEvent(new CustomEvent("rallysported:all-textures-changed"));

    Rsed.log(`Loaded RallySportED project "${projectData.meta.displayName.toUpperCase()}".`);

    const publicInterface = Object.freeze(
    {
        args: projectArgs,
        isPlaceholder: false,
        wires,
        trackId,
        palatId,
        loaderVersion,
        waterLevel,

        get manifesto() {return up_to_date_manifesto_string()},
        get maasto() {return maasto},
        get varimaa() {return varimaa},
        get palat() {return palat},
        get anims() {return anims},
        get props() {return props},
        get kierros() {return kierros},

        get name()
        {
            const name = projectData.meta.internalName.toLowerCase();
            const capitalizedName = (name[0].toUpperCase() + name.slice(1));
            return capitalizedName;
        },

        get internalName()
        {
            return this.name;
        },

        get areAllChangesSaved()
        {
            return Rsed.ui.utils.undoStack.is_current_undo_level_saved();
        },

        asset_byte_size: function(assetType = "")
        {
            Rsed.assert?.(
                recognizedAssetTypes.includes(assetType),
                `Unrecognized asset type "${assetType}".`
            );
            
            return dataContainer.byteSize()[assetType];
        },

        rename: function(newName = undefined)
        {
            if (typeof newName !== "string")
            {
                if (!(newName = window.prompt("Enter a new name for this track", this.internalName)))
                {
                    return;
                }
            }

            newName = newName.toLowerCase();

            if (!is_valid_project_name(newName))
            {
                Rsed.ui.dom.popup_notification("The name must be 1-8 characters from A-Z.", {
                    notificationType: "error",
                });

                return;
            }

            projectData.meta.displayName = projectData.meta.internalName = newName;

            Rsed.ui.dom.html.refresh();
            Rsed.ui.dom.popup_notification(`Renamed to "${this.name}".`);

            return;
        },

        track_id: function()
        {
            Rsed.assert?.(
                (trackId !== null),
                "Attempting to access a project's track id before it has been set."
            );

            return trackId;
        },

        track_checkpoint: function()
        {
            return (trackCheckpoints[0] || {x:0,y:0});
        },

        // Returns the project's current data as a JSON string in RallySportED-js's
        // JSON track format.
        json: function()
        {
            // Encode the container's data in Base64.
            const view = new Uint8Array(dataContainer.dataBuffer);
            const string = view.reduce((data, byte)=>(data + String.fromCharCode(byte)), "");
            const containerInBase64 = btoa(string);
            
            return JSON.stringify({
                container: containerInBase64,
                manifesto: up_to_date_manifesto_string(),
                meta: {
                    internalName: this.internalName,
                    displayName: this.name,
                    width: this.maasto.width,
                    height: this.maasto.height,
                },
            });
        },

        // Appends this project's data files into the given JSZip zip file object.
        insert_project_data_into_zip: async function(zip)
        {
            const projectNameInZip = this.internalName.toUpperCase();

            // The default HITABLE.TXT file (which holds Rally-Sport's top lap times) is
            // stored locally in a zip file. We'll need to deflate its data into an array.
            const hitable = await (async()=>
            {
                const zipFile = await (new JSZip()).loadAsync(Rsed.project.hitableZip);
                const hitableFile = zipFile.files["HITABLE.TXT"];

                return (hitableFile? hitableFile.async("arraybuffer") : null);
            })();

            if (!hitable)
            {
                Rsed.ui.dom.popup_notification("Couldn't find the HITABLE.TXT file.", {
                    notificationType: "error",
                });

                return false;
            }

            zip.file(`${projectNameInZip}/${projectNameInZip}.DTA`, dataContainer.dataBuffer);
            zip.file(`${projectNameInZip}/${projectNameInZip}.$FT`, up_to_date_manifesto_string());
            zip.file(`${projectNameInZip}/HITABLE.TXT`, hitable);

            return true;
        },

        // Returns a promise that resolves with the project's current data as a JSZip zip
        // blob. In case of error, the promise rejects with an error string (and/or whatever
        // JSZip rejects with).
        zip: async function(compressionLevel = 1)
        {
            const zip = new JSZip();

            if (!await this.insert_project_data_into_zip(zip))
            {
                return false;
            }

            return zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: compressionLevel,
                },
            });
        },

        read_asset_file: function(srcFile, assetType = "")
        {
            return new Promise((resolve)=>{
                Rsed.assert?.(
                    recognizedAssetTypes.includes(assetType),
                    `Unrecognized asset type "${assetType}".`
                );
    
                Rsed.assert?.(
                    (srcFile instanceof File),
                    "Expected a File object."
                );
    
                const fileReader = new FileReader();
                fileReader.onloadend = ()=>resolve(new Uint8Array(fileReader.result));
                fileReader.readAsArrayBuffer(srcFile);
            });
        },

        // Import the raw binary asset data from the given Rally-Sport DTA file (e.g. MAASTO1.DTA)
        // into this project.
        import_asset_file: async function(srcFile, assetType = "")
        {
            Rsed.assert?.(
                recognizedAssetTypes.includes(assetType),
                `Unrecognized asset type "${assetType}".`
            );

            Rsed.assert?.(
                (srcFile instanceof File),
                "Expected a File object."
            );

            const srcData = await this.read_asset_file(srcFile, assetType);
            const dstData = new Uint8Array(
                dataContainer.dataBuffer,
                dataContainer.byteOffset()[assetType],
                dataContainer.byteSize()[assetType]
            );

            if (srcData.byteLength !== dstData.byteLength)
            {
                Rsed.ui.dom.popup_notification("Incompatible data size. Can't import.", {
                    notificationType: "error",
                });

                return;
            }

            dstData.set(srcData);

            switch (assetType)
            {
                case "maasto":
                {
                    maasto = Rsed.gameContent.maasto(dstData);
                    break;
                }
                case "varimaa":
                {
                    varimaa = Rsed.gameContent.varimaa(dstData);
                    break;
                }
                case "palat":
                {
                    palat = Rsed.gameContent.palat(dstData, manifesto);
                    break;
                }
                case "text":
                {
                    props = await Rsed.gameContent.props(dstData);
                    break;
                }
                default: break;
            }

            if (["palat", "text"].includes(assetType))
            {
                window.dispatchEvent(new CustomEvent("rallysported:all-textures-changed"));
            }

            return;
        },

        // Returns a view into the current raw binary data of the given asset type (e.g.
        // "asset_data('maasto')" for the MAASTO heightmap).
        asset_data: function(assetType = "")
        {
            Rsed.assert?.(
                recognizedAssetTypes.includes(assetType),
                `Unrecognized asset type "${assetType}".`
            );

            return new Uint8Array(
                dataContainer.dataBuffer,
                dataContainer.byteOffset()[assetType],
                dataContainer.byteSize()[assetType]
            );
        },

        // Initiates a browser download of the current asset data of the given type (e.g.
        // "download_asset_file('maasto')" for the MAASTO heightmap). Returns true on
        // success; false otherwise.
        download_asset_file: function(assetType = "")
        {
            Rsed.assert?.(
                recognizedAssetTypes.includes(assetType),
                `Unrecognized asset type "${assetType}".`
            );

            let filename = `${assetType.toUpperCase()}.DTA`;

            switch (assetType)
            {
                case "palat": filename = `PALAT.00${(trackId === 4)? 2 : 1}`; break;
                case "maasto": filename = `MAASTO.00${trackId+1}`; break;
                case "varimaa": filename = `VARIMAA.00${trackId+1}`; break;
                case "kierros": filename = `KIERROS${trackId+1}.DTA`; break;
            }

            const data = this.asset_data(assetType);

            try
            {
                saveAs(
                    new Blob([data],
                    {type: "application/octet-stream"}),
                    filename
                );
            }
            catch (error)
            {
                Rsed.ui.dom.popup_notification(`Failed to save the data: ${error}`, {
                    notificationType: "error",
                });
                
                return false;
            }

            return true;
        },

        // Initiates a browser download of the project's current data as a ZIP file.
        download_as_zip: async function()
        {
            const filename = `${this.internalName.toUpperCase()}.ZIP`;

            Rsed.log(`Saving project "${projectData.meta.displayName}" into ${filename}.`);

            let saved = false;

            // In case something goes wrong and an error gets thrown in some function while saving,
            // we want to catch it here rather than letting the entire app go down, so as to give
            // the user a chance to re-try.
            try
            {
                const zipBlob = await this.zip();
                saveAs(zipBlob, filename); // From FileSaver.js.

                saved = true;
            }
            catch (error)
            {
                Rsed.ui.dom.popup_notification(`Failed to save the project: ${error}`, {
                    notificationType: "error",
                });

                saved = false;
            }

            if (saved)
            {
                // Let the user know there are no unsaved changes anymore.
                Rsed.ui.utils.undoStack.mark_current_undo_level_as_saved();
                Rsed.ui.dom.html.refresh();
            }

            return;
        },
    });
    
    return publicInterface;

    function apply_manifesto(manifesto = "")
    {
        let numPropsAdded = 0;

        Rsed.assert?.(
            !isPlaceholder,
            "Can't apply manifestos to placeholder projects."
        );

        const commands = manifesto.split("\n").filter(line=>line.trim().length);

        Rsed.assert?.(
            (commands.length >= 2),
            "Invalid number of lines in the manifesto."
        );

        Rsed.assert?.(
            commands[0].startsWith("0 "),
            "Expected the manifesto to begin with the command 0, but it doesn't."
        );

        Rsed.assert?.(
            commands.at(-1).startsWith("99"),
            "Expected the manifesto to end with the command 99, but it doesn't."
        );

        commands.forEach(command=>
        {
            apply_command(command);
        });

        return;

        function apply_command(commandLine)
        {
            const params = commandLine.split(" ");
            const command = Number(params.shift());

            eval("apply_" + command)(params);

            // Command: REQUIRE. Specifies which of the eight tracks in Rally-Sport's demo the project
            // is forked from.
            function apply_0(args = [])
            {
                Rsed.assert?.(
                    (args.length === 3),
                    `Invalid number of arguments to manifesto command 0. Expected 4 but received ${args.length}.`
                );

                set_track_id(Math.floor(Number(args[0])) - 1);
                set_palat_id(Math.floor(Number(args[1])) - 1);
                set_required_loader_version(Number(args[2]));
            }

            // Command: ROAD. Sets up the game's driving physics for various kinds of road surfaces.
            function apply_1(args = [])
            {
                Rsed.assert?.(
                    (args.length === 1),
                    `Invalid number of arguments to manifesto command 1. Expected 1 but received ${args.length}.`
                );
            }

            // Command: NUM_OBJS. Sets the number of props (in addition to the starting line) on the track.
            function apply_2(args = [])
            {
                Rsed.assert?.(
                    (args.length === 1),
                    `Invalid number of arguments to manifesto command 2. Expected 1 but received ${args.length}.`
                );
                
                const numObjs = Math.floor(Number(args[0]));

                if (loaderVersion < 5)
                {
                    props.set_count(trackId, numObjs);
                }
                else
                {
                    props.set_count__loader_v5(trackId, numObjs);
                }
            }

            // Command: ADD_OBJ. Adds a new prop to the track.
            function apply_3(args = [])
            {
                Rsed.assert?.(
                    (args.length === 5),
                    `Invalid number of arguments to manifesto command 3. Expected 5 but received ${args.length}.`
                );

                const propId = Math.floor(Number(args[0]) - 1);
                const x = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
                const z = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

                // Prior to loader version 5, command #3 would insert a new prop onto the
                // track. Since version 5, command #3 modifies an existing prop, after
                // you've first used commad #2 to set the total prop count (which creates
                // that many uninitialized props, which command #3 then initializes).
                if (loaderVersion < 5)
                {
                    props.add_location(trackId, propId, {x, z});
                }
                else
                {
                    props.change_prop_type(trackId, numPropsAdded, propId);
                    props.set_prop_location(trackId, numPropsAdded, {x, z});
                    numPropsAdded++;
                }
            }

            // Command: CHANGE_OBJ_TYPE. Changes the type of the given prop.
            function apply_4(args = [])
            {
                Rsed.assert?.(
                    (args.length === 2),
                    `Invalid number of arguments to manifesto command 4. Expected 2 but received ${args.length}.`
                );

                const targetPropIdx = Math.floor(Number(args[0]) - 1);
                const newPropId = Math.floor(Number(args[1]) - 1);

                props.change_prop_type(trackId, targetPropIdx, newPropId);
            }

            // Command: MOVE_OBJ. Moves the position of the given prop.
            function apply_5(args = [])
            {
                Rsed.assert?.(
                    (args.length === 5),
                    `Invalid number of arguments to manifesto command 5. Expected 5 but received ${args.length}.`
                );

                const targetPropIdx = Math.floor(Number(args[0]) - 1);
                const x = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
                const z = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

                props.set_prop_location(trackId, targetPropIdx, {x, z});
            }

            // Command: MOVE_STARTING_POS. Moves the starting line. Note that this doesn't move the
            // starting line prop, but the starting position of the player's car. So we can ignore
            // it in the editor.
            function apply_6(args = [])
            {
                Rsed.assert?.(
                    (args.length === 4),
                    `Invalid number of arguments to manifesto command 6. Expected 4 but received ${args.length}.`
                );
            }

            // Command: CHANGE_PALETTE_ENTRY. Changes the given palette index to the given r,g,b values.
            function apply_10(args = [])
            {
                Rsed.assert?.(
                    (args.length === 4),
                    `Invalid number of arguments to manifesto command 10. Expected 4 but received ${args.length}.`
                );
                
                const targetPaletteIdx = Math.floor(Number(args[0]));
                const red = Math.floor(Number(args[1] * 4));
                const green = Math.floor(Number(args[2] * 4));
                const blue = Math.floor(Number(args[3] * 4));
                
                Rsed.visual.palette.set_color(targetPaletteIdx, red, green, blue);
            }

            // Command: STOP. Stops parsing the manifesto file.
            function apply_99(args = [])
            {
                Rsed.assert?.(
                    (args.length === 0),
                    `Invalid number of arguments to manifesto command 99. Expected no arguments but received ${args.length}.`
                );
            }
        }
    }

    // Returns an updated version of the project's manifesto string, reflecting the project's
    // current status - e.g. positions of track props, which may have been moved by the user
    // since the project was loaded in. The original manifesto string is not changed.
    function up_to_date_manifesto_string()
    {
        const requiredLoaderVersion = 6;
        const manifesto = projectData.manifesto.split("\n").filter(line=>line.trim().length);
        
        // We'll append the new manifesto string here.
        let updatedManifesto = `0 ${trackId + 1} ${palatId + 1} ${requiredLoaderVersion}\n`;

        // Any manifesto commands we won't update will be copied verbatim into the updated
        // version.
        for (let i = 0; i < (manifesto.length - 1); i++)
        {
            const command = Number(manifesto[i].split(" ").shift());

            switch (command)
            {
                // These are the commands we want to update, so we don't copy them.
                case 0:
                case 2:
                case 3:
                case 4:
                case 5: break;

                // These are the commands we won't update, so we just copy then.
                default: updatedManifesto += (manifesto[i] + "\n");
            }
        }

        // Update the various commands according to the current values of their related data.
        { 
            const trackProps = props.locations_of_props_on_track(trackId);

            // Command #2 for the number of props.
            {
                updatedManifesto += ("2 " + trackProps.length + "\n");
            }

            // Command #3 to create and position the track's props.
            {
                for (let i = 0; i < trackProps.length; i++)
                {
                    const globalX = Math.floor((trackProps[i].x / Rsed.constants.groundTileSize) / 2);
                    const globalZ = Math.floor((trackProps[i].z / Rsed.constants.groundTileSize) / 2);

                    const localX = Math.floor((((trackProps[i].x / Rsed.constants.groundTileSize) / 2) - globalX) * 256);
                    const localZ = Math.floor((((trackProps[i].z / Rsed.constants.groundTileSize) / 2) - globalZ) * 256);

                    updatedManifesto += `3 ${trackProps[i].propId + 1} ${globalX} ${globalZ} ${localX} ${localZ}\n`;
                }
            }
        }

        updatedManifesto += "99\n";

        return updatedManifesto;
    }

    // Returns true if the given string is a valid RallySportED-js project name.
    function is_valid_project_name(name)
    {
        return ((typeof name == "string") &&
                (name.length >= 1) &&
                (name.length <= 8) &&
                /^[a-zA-Z]+$/.test(name));
    }

    // Returns the data (container file, manifesto file, and certain metadata) of the
    // given project as an object formatted like so:
    //
    //    {
    //        container: "the contents of the project's binary container file as a Base64-encoded string",
    //        manifesto: "the contents of the prjoect's textual manifesto file as a string",
    //        meta: 
    //        {
    //            // Metadata about the project; like its name, and the dimensions of its track.
    //        }
    //    }
    //
    async function fetch_project_data()
    {
        Rsed.throw_if_undefined(projectArgs.dataLocality);

        const projectData = await (async()=>
        {
            switch (projectArgs.dataLocality)
            {
                case "server-github": {
                    projectArgs.contentId = await fetch_project_data_from_github();
                    return await load_project_data_from_zip_file();
                }
                case "server-rsed": return (await fetch_project_data_from_rsed_server())[0];
                case "client": return await load_project_data_from_zip_file();
                case "inline": return Promise.resolve(projectArgs.data);
                default: Rsed.throw("Unrecognized project data locality."); break;
            }
        })();

        return projectData;

        async function load_project_data_from_zip_file()
        {
            Rsed.throw_if_undefined(projectArgs.contentId);

            const zip = await (new JSZip()).loadAsync(projectArgs.contentId);

            // The zip file is expected to contain a project's .DTA and .$FT (manifesto) files.
            let manifestoFile = null;
            let dtaFile = null;

            let projectDirName = "undefined";

            // Parse the zip file's contents and extract the project's data.
            {
                const files = Object.values(zip.files).reduce((files, e)=>(e.dir? files : files.concat(e)), []);

                Rsed.assert?.(
                    (files.length >= 3),
                    "The given project zip file is malformed. Please re-export it and try again."
                );

                // File names are expected in the form "XXXX/YYYY.ZZZ", where XXXX is the project
                // name.
                projectDirName = files[0].name.slice(0, files[0].name.indexOf("/")).toLowerCase();

                // Find the project's $FT and DTA files inside the zip file.
                {
                    files.forEach(file=>
                    {
                        if (manifestoFile && dtaFile)
                        {
                            return;
                        }

                        const fileSuffix = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
                        const fileBasePath = file.name.slice(0, file.name.lastIndexOf(".")).toLowerCase();
                        const fileBaseName = fileBasePath.slice(fileBasePath.lastIndexOf("/") + 1);

                        // Each resource file is expected to hold the same name as the project itself.
                        if (fileBaseName !== projectDirName)
                        {
                            return;
                        }

                        switch (fileSuffix)
                        {
                            case "$ft": manifestoFile = file; break;
                            case "dta": dtaFile = file; break;
                            default: break;
                        }
                    });

                    Rsed.assert?.(
                        (manifestoFile && dtaFile),
                        "The given project zip file is malformed. Please re-export it and try again."
                    );
                }
            }
            
            // Create an object containing the project's data.
            const projectData = {};
            {
                projectData.manifesto = await manifestoFile.async("string");
                projectData.container = await dtaFile.async("arraybuffer");

                // Derive the track's dimensions from the size of the heightmap. (All tracks are assumed
                // square).
                const trackSideLen = Math.sqrt(new Uint32Array(projectData.container, 0, 1)[0] / 2);

                // All tracks in the demo version of Rally-Sport are expected to have either 64 or 128
                // tiles per side.
                Rsed.assert?.(
                    [64, 128].includes(trackSideLen),
                    "Invalid track dimensions in project file."
                );

                projectData.meta =
                {
                    displayName: projectDirName,
                    internalName: projectDirName,
                    width: trackSideLen,
                    height: trackSideLen,
                };

                // Encode the .DTA data as Base64.
                const view = new Uint8Array(projectData.container);
                const string = view.reduce((data, byte)=>(data + String.fromCharCode(byte)), "");
                projectData.container = btoa(string);
            }

            return projectData;
        }

        // Loads the project's data from the RallySportED-js server. This server
        // hosts the original tracks from the Rally-Sport demo.
        async function fetch_project_data_from_rsed_server()
        {
            Rsed.throw_if_undefined(projectArgs.contentId);
            
            const trackName = (()=>
            {
                switch (projectArgs.contentId)
                {
                    case "1": return "demo-1";
                    case "2": return "demo-2";
                    case "3": return "demo-3";
                    case "4": return "demo-4";
                    case "5": return "demo-5";
                    case "6": return "demo-6";
                    case "7": return "demo-7";
                    case "8": return "demo-8";
                    default: Rsed.throw(`Unknown track identifier '${projectArgs.contentId}'.`);
                }
            })();

            const serverResponse = await fetch(`./assets/tracks/${trackName}.json`);

            if (serverResponse.status !== 200)
            {
                Rsed.throw("Failed to fetch the requested data from the RallySportED-js server.");
            }

            try
            {
                return await serverResponse.json();
            }
            catch (error)
            {
                Rsed.throw("Received malformed JSON from the RallySportED-js server.");
            }
        }

        async function fetch_project_data_from_github()
        {
            Rsed.throw_if_undefined(projectArgs.contentId);

            const url = `${Rsed.constants.rsedGitHubTracksURL}/${projectArgs.contentId}.zip`;

            Rsed.log(`Cloning ${url}...`);
            const serverResponse = await fetch(url);

            if (serverResponse.status !== 200)
            {
                Rsed.throw(`Track "${projectArgs.contentId}" doesn't exist on RallySportED's GitHub.`);
            }

            try
            {
                return await serverResponse.blob()
            }
            catch (error)
            {
                Rsed.throw("Found malformed data in a RallySportED project cloned from GitHub.");
            }
        }
    }

    function set_track_id(id)
    {
        Rsed.assert?.(
            ((id >= 0) && (id <= 7)),
            "Track id out of bounds."
        );

        trackId = id;

        // Certain properties in Rally-Sport are hard-coded for each track, and which RallySportED
        // also doesn't let the user edit; so let's hard-code those properties for RallySportED,
        // as well.
        {
            switch (trackId)
            {
                case 0: trackCheckpoints.push({x:46,y:6}); break;
                case 1: trackCheckpoints.push({x:56,y:14}); break;
                case 2: trackCheckpoints.push({x:50,y:6}); break;
                case 3: trackCheckpoints.push({x:86,y:98}); break;
                case 4: trackCheckpoints.push({x:60,y:106}); break;
                case 5: trackCheckpoints.push({x:10,y:48}); break;
                case 6: trackCheckpoints.push({x:114,y:118}); break;
                case 7: trackCheckpoints.push({x:56,y:60}); break;
                default: Rsed.throw(`Unknown track id (${trackId}).`);
            }

            switch (trackId)
            {
                case 0: waterLevel = -64; break;
                case 1: waterLevel = 0; break;
                case 2: waterLevel = 0; break;
                case 3: waterLevel = -250; break;
                case 4: waterLevel = 0; break;
                case 5: waterLevel = 0; break;
                case 6: waterLevel = -100; break;
                case 7: waterLevel = -40; break;
                default: Rsed.throw(`Unknown track id (${trackId}).`);
            }

            Rsed.visual.palette.set_active_palette(
                (trackId === 4)? 1 :
                (trackId === 5)? 2 :
                (trackId === 7)? 3 :
                0
            );
        }

        return;
    }

    function set_palat_id(id)
    {
        Rsed.assert?.(
            ((id >= 0) && (id <= 1)),
            "PALAT id out of bounds."
        );

        palatId = id;
    }

    function set_required_loader_version(version)
    {
        loaderVersion = version;
    }
}

// An empty project that lets the renderer etc. spin even when there's no
// actual project data loaded.
Rsed.project.placeholder =
{
    areAllChangesSaved: true,
    isPlaceholder: true,
    name: "",
    manifesto: "",
    trackId: 0,
    asset_byte_size: ()=>{return 0;},
    set_track_id: ()=>{Rsed.throw("Can't set the track id of a null project.");},
    varimaa:
    {
        width: 0,
        height: 0,
        tile_at:()=>0,
        set_tile_value_at:()=>{},
    },
    maasto:
    {
        width: 0,
        height: 0,
        tile_at: ()=>0,
        set_tile_value_at: ()=>{},
    },
    palat:
    {
        texture:()=>{},
    },
    props:
    {
        name: ()=>("undefined"),
        mesh: ()=>{},
        texture: ()=>{},
    },
    kierros:
    {
        checkpoints: [],
    }
};

// Parses the raw byte data of a RallySportED container (.DTA) file and returns its
// contents as a RallySportED-js object, with interfaces to modify the data.
Rsed.project.parse_container_data = async function(data = [], manifesto)
{
    // Provides the data of the container file; and metadata about the file,
    // like the sizes and byte offsets of the individual asset data segments inside the file.
    // Note: The variable names here reflect the names of Rally-Sport's data files. For more
    // information, check out RallySportED's documentation on Rally-Sport's data formats at
    // https://github.com/leikareipa/rallysported/tree/master/docs.
    //
    // In brief,
    //
    //     maasto: track heightmap
    //     varimaa: track tilemap
    //     palat: track tile textures
    //     anims: animation frame textures
    //     text: track prop textures
    //     kierros: cpu opponent's driving line
    //
    const dataContainer = Object.freeze({
        dataBuffer: (()=>
        {
            // Base64-encoded string.
            if (typeof data === "string")
            {
                const containerDecoded = atob(data);
                const buffer = new ArrayBuffer(containerDecoded.length);
                const view = new Uint8Array(buffer);
        
                for (let i = 0; i < containerDecoded.length; i++)
                {
                    view[i] = containerDecoded.charCodeAt(i);
                };
        
                return buffer;
            }
            // Assumed a raw byte array.
            else
            {
                return new Uint8Array(data).buffer;
            }
        })(),

        byteSize: function()
        {
            const maasto  = (new DataView(this.dataBuffer, 0, 4)).getUint32(0, true);
            const varimaa = (new DataView(this.dataBuffer, (maasto + 4), 4)).getUint32(0, true);
            const palat   = (new DataView(this.dataBuffer, (maasto + varimaa + 8), 4)).getUint32(0, true);
            const anims   = (new DataView(this.dataBuffer, (maasto + varimaa + palat + 12), 4)).getUint32(0, true);
            const text    = (new DataView(this.dataBuffer, (maasto + varimaa + palat + anims + 16), 4)).getUint32(0, true);
            const kierros = (new DataView(this.dataBuffer, (maasto + varimaa + palat + anims + text + 20), 4)).getUint32(0, true);
            
            return Object.freeze({maasto, varimaa, palat, anims, text, kierros});
        },

        byteOffset: function()
        {
            const byteSize = this.byteSize();

            // The variable names here reflect the names of Rally-Sport's data files.
            const maasto  = 4;
            const varimaa = (maasto  + byteSize.maasto  + 4);
            const palat   = (varimaa + byteSize.varimaa + 4);
            const anims   = (palat   + byteSize.palat   + 4);
            const text    = (anims   + byteSize.anims   + 4);
            const kierros = (text    + byteSize.text    + 4);

            return Object.freeze({maasto, varimaa, palat, anims, text, kierros});
        },
    });

    // Pass relevant segments of the container's data into objects responsible for managing
    // the corresponding individual assets. Note that the data are passed by reference, so
    // modifications made by the objects to the data will be reflected in the container.
    const maasto = Rsed.gameContent.maasto(
        new Uint8Array(
            dataContainer.dataBuffer,
            dataContainer.byteOffset().maasto,
            dataContainer.byteSize().maasto
        )
    );

    const varimaa = Rsed.gameContent.varimaa(
        new Uint8Array(
            dataContainer.dataBuffer,
            dataContainer.byteOffset().varimaa,
            dataContainer.byteSize().varimaa
        )
    );

    const palat = Rsed.gameContent.palat(
        new Uint8Array(
            dataContainer.dataBuffer,
            dataContainer.byteOffset().palat,
            dataContainer.byteSize().palat
        ), manifesto
    );

    const anims = Rsed.gameContent.anims(
        new Uint8Array(
            dataContainer.dataBuffer,
            dataContainer.byteOffset().anims,
            dataContainer.byteSize().anims
        )
    );

    const props = await Rsed.gameContent.props(
        new Uint8Array(
            dataContainer.dataBuffer,
            dataContainer.byteOffset().text,
            dataContainer.byteSize().text
        )
    );

    const kierros = Rsed.gameContent.kierros(
        new Uint8Array(
            dataContainer.dataBuffer,
            dataContainer.byteOffset().kierros,
            dataContainer.byteSize().kierros
        )
    );

    return {
        dataContainer,
        maasto,
        varimaa,
        palat,
        anims,
        props,
        kierros
    };
}
/*
 * Most recent known filename: js/project/hitable.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// The raw bytes of a ZIP file containing Rally-Sport's default HITABLE.TXT file.
Rsed.project.hitableZip = new Uint8Array(
[0x50,0x4b,0x03,0x04,0x14,0x03,0x00,0x00,0x08,0x00,0x12,0x7a,
0x8a,0x21,0xe2,0x39,0x05,0xfa,0xb1,0x00,0x00,0x00,0xc0,0x09,
0x00,0x00,0x0b,0x00,0x00,0x00,0x48,0x49,0x54,0x41,0x42,0x4c,
0x45,0x2e,0x54,0x58,0x54,0xed,0x95,0x31,0x0a,0x02,0x31,0x10,
0x45,0xad,0x17,0xf6,0x0e,0x5e,0x60,0x61,0x66,0xf2,0xa3,0x6e,
0x3a,0x5b,0x6f,0xb2,0x8d,0x82,0xe0,0xfd,0x05,0xc1,0xf2,0x89,
0x19,0xc4,0x2a,0x69,0x1f,0x1f,0x92,0xc7,0xfc,0xcc,0x79,0xb9,
0x3c,0xae,0xdb,0xed,0xbe,0xed,0xf6,0xaf,0x63,0xd6,0x8a,0x35,
0xb3,0x79,0xea,0x20,0xde,0x8c,0x08,0x66,0x02,0x33,0x81,0x99,
0x82,0x99,0x82,0x19,0x61,0x46,0x98,0xa9,0xef,0xcc,0x02,0x67,
0x9e,0x86,0xb7,0x9f,0x79,0x13,0x7a,0x13,0xda,0x89,0x84,0x1d,
0xa1,0x83,0x48,0x38,0x10,0x3a,0x08,0x20,0x87,0x66,0x48,0xd4,
0xed,0xcd,0x9b,0xa3,0x1d,0x47,0x07,0xc1,0x73,0x90,0x78,0x69,
0x05,0x72,0xc4,0x97,0x9e,0xf0,0x6e,0x2b,0xdd,0xcd,0xb1,0x3f,
0xee,0x29,0x6f,0xd6,0xdd,0xc6,0x40,0x52,0x90,0x08,0x49,0xfd,
0x30,0x07,0x96,0x30,0x4a,0x64,0x25,0xe2,0x96,0xea,0x69,0x60,
0x4f,0x99,0x28,0xf1,0xf3,0x05,0x12,0x25,0x5a,0x1f,0x48,0x94,
0xf8,0x2d,0x63,0xcc,0xdb,0xdf,0xe6,0x6d,0xec,0xd3,0x2f,0xf6,
0xe9,0x13,0x50,0x4b,0x01,0x02,0x3f,0x03,0x14,0x03,0x00,0x00,
0x08,0x00,0x12,0x7a,0x8a,0x21,0xe2,0x39,0x05,0xfa,0xb1,0x00,
0x00,0x00,0xc0,0x09,0x00,0x00,0x0b,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x20,0x80,0xb4,0x81,0x00,0x00,0x00,0x00,
0x48,0x49,0x54,0x41,0x42,0x4c,0x45,0x2e,0x54,0x58,0x54,0x50,
0x4b,0x05,0x06,0x00,0x00,0x00,0x00,0x01,0x00,0x01,0x00,0x39,
0x00,0x00,0x00,0xda,0x00,0x00,0x00,0x00,0x00]);
/*
 * Most recent known filename: js/misc/constants.js
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.constants = Object.freeze(
{
    // The resolution, in pixels, of a PALA texture.
    palaWidth: 16,
    palaHeight: 16,

    // The number of tracks in Rally-Sport's demo.
    numTracks: 8,

    // For rendering; the side length, in world units, of a single ground tile.
    groundTileSize: 128,

    // The margins, in number of tiles, on the sides of the track past which the user is
    // not allowed to move props (so that they don't accidentally get moved out of reach,
    // etc.).
    propTileMargin: -3,

    // The maximum number of props on a track.
    maxPropCount: 25,

    // The maximum number of PALA textures we'll process from a Rally-Sport PALA file.
    // The game's original PALA files end with malformed data, so we want to ignore
    // that part.
    maxPalaCount: 254,

    // How many hard-coded (in RALLYE.EXE and VALIKKO.EXE) palettes there are in
    // Rally-Sport's demo version.
    numPalettes: 4,

    // How many colors there are in a given hard-coded Rally-Sport palette.
    paletteSize: 32,

    rsedGitHubTracksURL: "./assets/tracks",
});
/*
 * Most recent known filename: js/visual/texture.js
 *
 * Tarpeeksi Hyvae Soft 2018-2023 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.visual = Rsed.visual || {};

// An paletted image for texturing polygons.
Rsed.visual.texture = function({
    // The image's resolution.
    width = 0,
    height = 0,

    // The palette index of each pixel.
    indices = [],

    // A function with which all of the images's pixels can be replaced with the
    // colors of the given palette indices.
    replace_all_pixels = (newColorIndices = [])=>{},

    // A function with which a given texel's color in the image can be altered.
    // Returns a reference to the updated texture object.
    set_pixel_at = (u, v, newColorIdx)=>{},

    // A user-facing string for identifying this texture. Might be used e.g. in
    // the texture editor.
    name = "Unnamed",
} = {})
{
    Rsed.assert?.(
        (width > 0) &&
        (height > 0) &&
        (indices.length),
        "Expected non-empty texture data."
    );

    Rsed.assert?.(
        (indices.length === (width * height)),
        "Mismatch between size of texture data and its resolution."
    );

    const publicInterface = {
        $constructor: "Texture",
        ...arguments[0],
    };

    return publicInterface;
}
/*
 * Most recent known filename: js/visual/palette.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.visual = Rsed.visual || {};

Rsed.visual.palette = (function()
{
    // A palette whose colors are guaranteed immutable, safe to use e.g. for the UI.
    const immutablePalette = {
        white:     {red:255, green:255, blue:255},
        black:     {red:0,   green:0,   blue:0},
        dimgray:   {red:64,  green:64,  blue:64},
        gray:      {red:128, green:128, blue:128},
        lightgray: {red:192, green:192, blue:192},
        yellow:    {red:255, green:255, blue:0},
        red:       {red:255, green:0,   blue:0},
        green:     {red:0,   green:255, blue:0},
        hotpink:   {red:255, green:105, blue:180},
    };
    
    // Rally-Sport's palettes.
    let activePaletteIdx = 0;
    let activePalette = rally_sport_palette(activePaletteIdx);

    // How many levels of shading will be computed for each color in the palette.
    const numLightLevels = 9;

    function generate_light_levels(colorRGBA)
    {
        const lightLevels = [];
        const deltaShade = (1 / (numLightLevels - 1));

        for (let i = numLightLevels; i > 0; i--)
        {
            const shade = ((numLightLevels - i) * deltaShade);
            const color32 = (
                (255 << 24) +
                ((colorRGBA.blue * shade) << 16) +
                ((colorRGBA.green * shade) << 8) +
                ~~(colorRGBA.red * shade)
            );

            lightLevels.push(color32);
        }
        
        return lightLevels;
    }
    
    // Converts the {red, green, blue} color values of the given palette into 32-bit
    // packed color values with light levels.
    function precompile_palette(palette)
    {
        const precompiled = palette.map(c=>generate_light_levels(c));

        Object.values(immutablePalette).forEach((c, idx)=>{
            precompiled[Rsed.constants.paletteSize + idx] = generate_light_levels(c);
        });

        for (let i = precompiled.length; i < 256; i++)
        {
            precompiled[i] = generate_light_levels(immutablePalette.dimgray);
        }

        return precompiled;
    }

    const publicInterface = {
        // The currently-active palette converted into 32-bit packed color values
        // (for writing directly into a 32-bit RGBA pixel buffer), with pre-computed
        // shading levels for each color.
        precompiled: precompile_palette(activePalette),
        
        numLightLevels,
        
        color_at: (colorIdx = 0)=>
        {
            return (
                immutablePalette[colorIdx] ||
                activePalette[colorIdx] ||
                immutablePalette["white"]
            );
        },

        set_active_palette: (paletteIdx)=>
        {
            Rsed.assert?.(
                (paletteIdx >= 0) &&
                (paletteIdx < 4),
                "Trying to access a palette index out of bounds."
            );

            activePaletteIdx = paletteIdx;
            activePalette = rally_sport_palette(activePaletteIdx);
            publicInterface.precompiled = precompile_palette(activePalette);
        },

        set_color: (colorIdx = 0, red, green, blue)=>
        {
            Rsed.assert?.(
                ((colorIdx >= 0) &&
                 (colorIdx < Rsed.constants.paletteSize)),
                `Trying to access a palette color out of bounds (#${colorIdx}).`
            );

            activePalette[colorIdx].red = red;
            activePalette[colorIdx].green = green;
            activePalette[colorIdx].blue = blue;
            publicInterface.precompiled = precompile_palette(activePalette);
        },
    };

    Object.keys(immutablePalette).forEach((c, idx)=>publicInterface[c.toUpperCase()] = Rsed.constants.paletteSize + idx);

    return publicInterface;

    // Replicates the four palettes of the Rally-Sport demo.
    function rally_sport_palette(idx = 0)
    {
        switch (idx)
        {
            case 0: return [
                {red:0, green:0, blue:0},
                {red:8, green:64, blue:16},
                {red:16, green:96, blue:36},
                {red:24, green:128, blue:48},
                {red:252, green:0, blue:0},
                {red:252, green:252, blue:252},
                {red:192, green:192, blue:192},
                {red:128, green:128, blue:128},
                {red:64, green:64, blue:64},
                {red:0, green:0, blue:252},
                {red:72, green:128, blue:252},
                {red:208, green:100, blue:252},
                {red:208, green:72, blue:44},
                {red:252, green:112, blue:76},
                {red:16, green:96, blue:32},
                {red:32, green:192, blue:64},
                {red:228, green:56, blue:244},
                {red:132, green:36, blue:172},
                {red:68, green:92, blue:252},
                {red:252, green:252, blue:48},
                {red:32, green:32, blue:32},
                {red:152, green:48, blue:24},
                {red:80, green:24, blue:12},
                {red:124, green:124, blue:24},
                {red:128, green:0, blue:0},
                {red:12, green:20, blue:132},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:136, green:28, blue:128},
                {red:16, green:252, blue:8},
                ...Object.values(structuredClone(immutablePalette)),
            ];
    
            case 1: return [
                {red:0, green:0, blue:0},
                {red:80, green:88, blue:104},
                {red:96, green:104, blue:120},
                {red:112, green:128, blue:144},
                {red:252, green:0, blue:0},
                {red:252, green:252, blue:252},
                {red:192, green:192, blue:192},
                {red:128, green:128, blue:128},
                {red:64, green:64, blue:64},
                {red:0, green:0, blue:252},
                {red:72, green:128, blue:252},
                {red:208, green:100, blue:252},
                {red:208, green:72, blue:44},
                {red:252, green:112, blue:76},
                {red:8, green:136, blue:16},
                {red:32, green:192, blue:64},
                {red:228, green:56, blue:244},
                {red:132, green:36, blue:172},
                {red:68, green:92, blue:252},
                {red:252, green:252, blue:48},
                {red:32, green:32, blue:32},
                {red:152, green:48, blue:24},
                {red:80, green:24, blue:12},
                {red:124, green:124, blue:24},
                {red:128, green:0, blue:0},
                {red:12, green:20, blue:132},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:136, green:28, blue:128},
                {red:16, green:252, blue:8},
                ...Object.values(structuredClone(immutablePalette)),
            ];
    
            case 2: return [
                {red:0, green:0, blue:0},
                {red:72, green:20, blue:12},
                {red:144, green:44, blue:20},
                {red:168, green:56, blue:28},
                {red:252, green:0, blue:0},
                {red:252, green:252, blue:252},
                {red:192, green:192, blue:192},
                {red:128, green:128, blue:128},
                {red:64, green:64, blue:64},
                {red:0, green:0, blue:252},
                {red:72, green:128, blue:252},
                {red:208, green:100, blue:252},
                {red:208, green:72, blue:44},
                {red:252, green:112, blue:76},
                {red:16, green:96, blue:32},
                {red:32, green:192, blue:64},
                {red:228, green:56, blue:244},
                {red:132, green:36, blue:172},
                {red:68, green:92, blue:252},
                {red:252, green:252, blue:48},
                {red:32, green:32, blue:32},
                {red:152, green:48, blue:24},
                {red:80, green:24, blue:12},
                {red:124, green:124, blue:24},
                {red:128, green:0, blue:0},
                {red:12, green:20, blue:132},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:136, green:28, blue:128},
                {red:16, green:252, blue:8},
                ...Object.values(structuredClone(immutablePalette)),
            ];
    
            case 3: return [
                {red:0, green:0, blue:0},
                {red:28, green:52, blue:8},
                {red:64, green:64, blue:16},
                {red:80, green:84, blue:28},
                {red:252, green:0, blue:0},
                {red:252, green:252, blue:252},
                {red:192, green:192, blue:192},
                {red:128, green:128, blue:128},
                {red:64, green:64, blue:64},
                {red:0, green:0, blue:252},
                {red:72, green:128, blue:252},
                {red:208, green:100, blue:252},
                {red:208, green:72, blue:44},
                {red:252, green:112, blue:76},
                {red:32, green:64, blue:32},
                {red:64, green:128, blue:64},
                {red:228, green:56, blue:244},
                {red:132, green:36, blue:172},
                {red:68, green:92, blue:252},
                {red:252, green:252, blue:48},
                {red:32, green:32, blue:32},
                {red:152, green:48, blue:24},
                {red:80, green:24, blue:12},
                {red:124, green:124, blue:24},
                {red:128, green:0, blue:0},
                {red:12, green:20, blue:132},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:252, green:252, blue:252},
                {red:136, green:28, blue:128},
                {red:16, green:252, blue:8},
                ...Object.values(structuredClone(immutablePalette)),
            ];
    
            default: Rsed.throw("Unrecognized palette index");
        }
    }    
})();
/*
 * Most recent known filename: js/visual/canvas.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 */

"use strict";

Rsed.visual = Rsed.visual || {};

// Provides a canvas for RallySportED-js to render into.
Rsed.visual.canvas =
{
    width: 0,
    height: 0,
    scalingFactor: 0.2,
    aspectRatio: 1,
    resolution()
    {
        return {
            width: ~~(200 * Rsed.visual.canvas.aspectRatio),
            height: 200,
        }
    },
    domElement: document.getElementById("base-render"), // May not be available during unit tests.
    domElementUi: document.getElementById("ui-overlay"), // May not be available during unit tests.
    domElementID: null, // The canvas DOM element may not be available during unit tests, so let's not initialize this here.

    // One element for each pixel on the canvas. Will be populated during rendering
    // with metainformation about the pixel - e.g. what kind of a polygon populates
    // it. For use in determining what the mouse cursor is hovering over on the
    // canvas.
    mousePickingBuffer: [],
};

// The canvas DOM element is not available during unit testing. Otherwise, we expect
// it to be present.
if (!Rsed.unitTestRun)
{
    Rsed.assert?.(
        (Rsed.visual.canvas.domElement != null),
        "Failed to find a canvas element to render into."
    );

    Rsed.visual.canvas.domElementID = Rsed.visual.canvas.domElement.getAttribute("id");

    // A bit of a kludge to prevent certain inputs from sticking if released while a non-
    // RallySportED element has focus.
    Rsed.visual.canvas.domElement.onmouseleave = function(event)
    {
        Rsed.ui.utils.inputState.reset_mouse_buttons_state();
        Rsed.ui.utils.inputState.reset_modifier_keys_state();

        return;
    };

    Rsed.visual.canvas.domElement.ontouchstart = function(event)
    {
        Rsed.ui.utils.inputState.set_is_touching(true, {startX: event.touches[0].clientX, startY: event.touches[0].clientY});

        event.preventDefault();

        return;
    };

    Rsed.visual.canvas.domElement.ontouchend = function(event)
    {
        Rsed.ui.utils.inputState.set_is_touching(false, {});

        event.preventDefault();

        return;
    };

    Rsed.visual.canvas.domElement.ontouchmove = function(event)
    {
        Rsed.ui.utils.inputState.update_touch_position({x: event.touches[0].clientX, y: event.touches[0].clientY})

        event.preventDefault();

        return;
    };
}
/*
 * Most recent known filename: js/game-content/game-content.js
 *
 * 2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.gameContent = {};
/*
 * Most recent known filename: js/track/varimaa.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Provides information about and the means to modify a track's tilemap (which Rally-Sport
// calls "VARIMAA"). For more information about the track tilemap format used in Rally-Sport,
// check out https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.gameContent.varimaa = function(data = Uint8Array)
{
    const varimaaWidth = Math.sqrt(data.byteLength);
    const varimaaHeight = varimaaWidth;

    Rsed.assert?.(
        (varimaaWidth === varimaaHeight),
        "Expected VARIMAA width and height to be equal."
    );

    Rsed.assert?.(
        ((varimaaWidth > 0) &&
         (varimaaHeight > 0)),
        "Expected VARIMAA width and height to be positive and non-zero."
    );

    Rsed.assert?.(
        (data.byteLength === (varimaaWidth * varimaaHeight)),
        "Mismatched VARIMAA data length relative to its dimensions."
    );

    const publicInterface = 
    {
        width: varimaaWidth,
        height: varimaaHeight,

        // Returns the PALA index of the tile at the given track tile coordinates.
        tile_at: (x = 0, y = 0)=>
        {
            x = Math.floor(x);
            y = Math.floor(y);

            const idx = (x + y * varimaaWidth);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return 0;
            }

            return data[idx];
        },

        // Alter the PALA index at the given tile.
        set_tile_value_at: (x = 0, y = 0, newPalaIdx = 0)=>
        {
            x = Math.floor(x);
            y = Math.floor(y);

            const idx = (x + y * varimaaWidth);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return;
            }

            data[idx] = newPalaIdx;
        },
    };
    
    return publicInterface;
};
/*
 * Most recent known filename: js/track/maasto.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Provides information about and the means to modify a track's heightmap (which are called
// "MAASTO" in Rally-Sport). For more information about the heightmap format used in Rally-
// Sport, check out https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.gameContent.maasto = function(data = Uint8Array)
{
    const maastoWidth = Math.sqrt(data.byteLength / 2);
    const maastoHeight = maastoWidth;

    Rsed.assert?.(
        (maastoWidth === maastoHeight),
        "Expected MAASTO width and height to be equal."
    );

    Rsed.assert?.(
        ((maastoWidth > 0) && (maastoHeight > 0)),
        "Expected MAASTO width and height to be positive and non-zero."
    );

    Rsed.assert?.(
        (data.byteLength === (maastoWidth * maastoHeight * 2)),
        "Mismatched MAASTO data length relative to its dimensions."
    );

    const maxHeightmapValue = 255;
    const minHeightmapValue = -510;

    const publicInterface =
    {
        width: maastoWidth,
        height: maastoHeight,

        // Returns the MAASTO height of the tile at the given track tile coordinates.
        tile_at: function(x = 0, y = 0)
        {
            x = Math.floor(x);
            y = Math.floor(y);

            // MAASTO data is two bytes per tile.
            const idx = ((x + y * maastoWidth) * 2);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return 0;
            }

            return two_byte_height_as_integer(data[idx], data[idx+1]);
        },

        // Alter the MAASTO heightmap at the given tile.
        set_tile_value_at: function(x = 0, y = 0, newHeight = 0)
        {
            newHeight = Math.max(minHeightmapValue, Math.min(maxHeightmapValue, newHeight));

            x = Math.floor(x);
            y = Math.floor(y);

            // Note: MAASTO data is two bytes per tile, so we multiply the idx by two.
            const idx = ((x + y * maastoWidth) * 2);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return;
            }
            
            [data[idx], data[idx+1]] = [...integer_height_as_two_bytes(newHeight)];
        },

        // Reset all height values in the heightmap to the specified height.
        bulldoze: function(height)
        {
            for (let y = 0; y < maastoHeight; y++)
            {
                for (let x = 0; x < maastoWidth; x++)
                {
                    publicInterface.set_tile_value_at(x, y, height);
                }
            }
        }
    };
    
    return publicInterface;

    // Converts Rally-Sport's two-byte heightmap value into RallySportED's integer format.
    function two_byte_height_as_integer(byte1, byte2)
    {
        // Special case: more than -255 below ground level.
        if (byte2 == 1)
        {
            return (-256 - byte1);
        }
        // Above ground when byte2 == 255, otherwise below ground.
        else
        {
            return (byte2 - byte1);
        }
    }

    // Converts RallySportED's heightmap value into Rally-Sport's two-byte height format.
    function integer_height_as_two_bytes(height)
    {
        let byte1 = 0;
        let byte2 = 0;

        if (height > 0)
        {
            byte2 = 255;
            byte1 = (255 - height);
        }
        else if (height <= 0)
        {
            if (height < -255)
            {
                byte2 = 1;
                byte1 = (Math.abs(height) - 256);
            }
            else
            {
                byte2 = 0;
                byte1 = Math.abs(height);
            }
        }

        return [byte1, byte2];
    }
};
/*
 * Most recent known filename: js/track/kierros.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Provides information about a track's KIERROS data (the AI driver's checkpoints).
// You can learn more about the KIERROS format at https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.gameContent.kierros = function(data = Uint8Array)
{
    const checkpoints = [];
    const bytesPerCheckpoint = 8;
    const numCheckpoints = (data.length / bytesPerCheckpoint);

    for (let i = 0; i < numCheckpoints; i++)
    {
        const idx = (i * bytesPerCheckpoint);

        checkpoints.push({
            x: (data[idx+0] | (data[idx+1] << 8)),
            z: (data[idx+2] | (data[idx+3] << 8)),
            orientation: (data[idx+4] | (data[idx+5] << 8)),
            speed: (data[idx+6] | (data[idx+7] << 8)),
        });
    }

    const publicInterface = {
        checkpoints,
    };
    
    return publicInterface;
}
/*
 * Most recent known filename: js/track/palat.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Provides information about and the means to modify a track's textures (which are called
// "PALA" in Rally-Sport). For more information about the track texture format used in Rally-
// Sport, check out https://github.com/leikareipa/rallysported/tree/master/docs.
//
// The palaWidth and palaHeight parameters give the dimensions of a single PALA texture; which
// would typically be 16 x 16. The data array contains the pixels of all of the track's PALA
// textures (normally, about 256 of them), arranged so that the first (width * height) bytes
// are the pixels of the first texture, the next (width * height) bytes those of the second
// texture, etc. Each byte in the array gives the corresponding pixel's RGB color as a palette
// index.
Rsed.gameContent.palat = function(data = Uint8Array, manifesto = undefined)
{
    const palaWidth = Rsed.constants.palaWidth;
    const palaHeight = Rsed.constants.palaHeight;

    Rsed.assert?.(
        (palaWidth === palaHeight),
        "Expected PALA width and height to be equal."
    );

    Rsed.assert?.(
        ((palaWidth > 0) && (palaHeight > 0)),
        "Expected PALA width and height to be positive and non-zero."
    );

    manifesto = (manifesto || Rsed.$currentProject.manifesto);
    Rsed.assert?.(
        (typeof manifesto === "string"),
        "Unrecognized or undefined manifesto."
    );

    const trackId = Number(manifesto.match(/^0 (\d)/)?.[1]);
    Rsed.assert?.(
        (typeof trackId === "number") &&
        Number.isFinite(trackId) &&
        (trackId > 0) &&
        (trackId <= Rsed.constants.numTracks),
        "Failed to figure out the track ID from the manifesto."
    );

    const palaSize = (palaWidth * palaHeight);

    const prebakedPalaTextures = new Array(Rsed.constants.maxPalaCount).fill().map((pala, idx)=>generate_texture(idx));

    const publicInterface = Object.freeze(
    {
        width: palaWidth,
        height: palaHeight,
        texture: prebakedPalaTextures,

        // Copies the given texture's data over the PALA texture at the given index.
        // This causes the current texture to be re-generated; a reference to the
        // new texture object is returned.
        copy_texture_data: function(palaIdx = 0, srcTexture)
        {
            Rsed.throw_if_not_type("number", palaIdx);

            // All PALA textures are expected to be the same resolution.
            if ((srcTexture.width !== palaWidth) ||
                (srcTexture.height !== palaHeight))
            {
                Rsed.throw("Invalid PALA texture dimensions for copying.")
            }

            const dataIdx = (palaIdx * (palaWidth * palaHeight));
            for (let i = 0; i < (palaWidth * palaHeight); i++)
            {
                data[dataIdx + i] = srcTexture.indices[i];
            }

            // Regenerate this texture to incorporate the changes we've made to the
            // master data array.
            const originalTexture = prebakedPalaTextures[palaIdx];
            const newTexture = prebakedPalaTextures[palaIdx] = generate_texture(palaIdx, srcTexture.args);
            broadcast_texture_change(newTexture, originalTexture);
            return newTexture;
        },

        // Rally-Sport by default has four different 'skins' for spectators, and decides
        // which skin a spectator will be given based on the spectator's XY ground tile
        // coordinates.
        //
        // This function returns the PALA index of the skin associated with the given
        // ground tile coordinates.
        spectator_pala_idx_at: function(tileX = 0, tileY = 0)
        {
            const firstSpectatorTexIdx = 236; // Index of the first PALA representing a (standing) spectator. Assumes consecutive arrangement.
            const numSkins = 4;
            const sameRows = ((Rsed.$currentProject.maasto.width === 128)? 16 : 32); // The game will repeat the same pattern of variants on the x axis this many times.

            const yOffs = (Math.floor(tileY / sameRows)) % numSkins;
            const texOffs = ((tileX + (numSkins - 1)) + (yOffs * (numSkins - 1))) % numSkins;

            const palaId = (firstSpectatorTexIdx + texOffs);

            return palaId;
        },

        // When used on ground tiles, some PALA textures are associated with billboards
        // - a flat upright polygon stood by the ground tile. For instance, spectators
        // and wooden poles are examples of billboards.
        //
        // This function returns the PALA texture index of the billboard associated
        // with the given PALA texture index; or null if the PALA index has no billboard
        // associated with it.
        billboard_idx: function(palaIdx, groundTileX = 0, groundTileZ = 0)
        {
            Rsed.throw_if_not_type("number", palaIdx,
                                             groundTileX,
                                             groundTileZ);

            switch (palaIdx)
            {
                // Spectators.
                case 240:
                case 241:
                case 242: return this.spectator_pala_idx_at(groundTileX, groundTileZ);

                // Shrubs.
                case 243: return 208;
                case 244: return 209;
                case 245: return 210;

                // Small poles.
                case 246:
                case 247: return 211;
                case 250: return 212;

                // Bridges.
                case 248:
                case 249: return 177;

                default: return null;
            }
        },
    });

    // Returns the given PALA's pixel data as a texture, whose arguments are set as given.
    function generate_texture(palaId = 0, args = {})
    {
        const dataIdx = (palaId * palaSize);

        // For attempts to access the PALA data out of bounds, return a dummy texture.
        if ((dataIdx < 0) ||
            ((dataIdx + palaSize) >= data.byteLength))
        {
            console.warn("Generating a dummy PALA texture to avoid overflowing the source data buffer.");
            
            return Rsed.visual.texture(
            {
                ...args,
                width: 1,
                height: 1,
                indices: [0],
                args: args,
            });
        }

        // A slice of the entire PALAT data representing the region in which this particular
        // PALAT texture's pixels are.
        const dataSlice = data.slice(dataIdx, (dataIdx + palaSize));

        return Rsed.visual.texture(
        {
            ...args,
            width: palaWidth,
            height: palaHeight,
            name: `PALAT.00${(trackId === 5)? 2 : 1} #${palaId}`,
            indices: dataSlice,
            assetId: palaId,
            assetType: "palat",
            replace_all_pixels: function(newColorIndices = [])
            {
                Rsed.assert?.(
                    (Array.isArray(newColorIndices) &&
                     (newColorIndices.length === (palaWidth * palaHeight))),
                    "Incompatible source data for replacing a texture's pixels."
                );

                for (let i = 0; i < newColorIndices.length; i++)
                {
                    data[dataIdx + i] = newColorIndices[i];
                }

                // Regenerate this texture to incorporate the changes we've made to the
                // pixels.
                const originalTexture = prebakedPalaTextures[palaId];
                const newTexture = prebakedPalaTextures[palaId] = generate_texture(palaId, args);
                broadcast_texture_change(newTexture, originalTexture);
                return newTexture;
            },
            set_pixel_at: function(x = 0, y = 0, newColorIdx = 0)
            {
                const texelIdx = (x + y * palaWidth);

                data[dataIdx + texelIdx] = newColorIdx;

                // Regenerate this texture to incorporate the changes we've made to the
                // master data array.
                const originalTexture = prebakedPalaTextures[palaId];
                const newTexture = prebakedPalaTextures[palaId] = generate_texture(palaId, args);
                broadcast_texture_change(newTexture, originalTexture);
                return newTexture;
            },
        });
    }
    
    return publicInterface;
};

function broadcast_texture_change(newTexture, previousTexture)
{
    window.dispatchEvent(new CustomEvent("rallysported:texture-changed", {
        detail: {
            from: previousTexture,
            to: newTexture,
        },
    }));
}
/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.gameContent.anims = function(data = Uint8Array)
{
    const palaWidth = Rsed.constants.palaWidth;
    const palaHeight = Rsed.constants.palaHeight;

    Rsed.assert?.(
        (palaWidth === palaHeight),
        "Expected ANIM width and height to be equal."
    );

    Rsed.assert?.(
        ((palaWidth > 0) && (palaHeight > 0)),
        "Expected ANIM width and height to be positive and non-zero."
    );

    const palaSize = (palaWidth * palaHeight);

    const prebakedAnimTextures = new Array(Rsed.constants.maxPalaCount).fill().map((pala, idx)=>generate_texture(idx));

    const publicInterface = Object.freeze(
    {
        width: palaWidth,
        height: palaHeight,
        texture: prebakedAnimTextures,

        // Copies the given texture's data over the ANIMS texture at the given index.
        // This causes the current texture to be re-generated; a reference to the
        // new texture object is returned.
        copy_texture_data: function(palaIdx = 0, srcTexture)
        {
            Rsed.throw_if_not_type("number", palaIdx);

            // All PALA textures are expected to be the same resolution.
            if ((srcTexture.width !== palaWidth) ||
                (srcTexture.height !== palaHeight))
            {
                Rsed.throw("Invalid ANIM texture dimensions for copying.")
            }

            const dataIdx = (palaIdx * (palaWidth * palaHeight));
            for (let i = 0; i < (palaWidth * palaHeight); i++)
            {
                data[dataIdx + i] = srcTexture.indices[i];
            }

            // Regenerate this texture to incorporate the changes we've made to the
            // master data array.
            const originalTexture = prebakedAnimTextures[palaIdx];
            const newTexture = prebakedAnimTextures[palaIdx] = generate_texture(palaIdx, srcTexture.args);
            broadcast_texture_change(newTexture, originalTexture);
            return newTexture;
        },
    });

    // Returns the given PALA's pixel data as a texture, whose arguments are set as given.
    function generate_texture(palaId = 0, args = {})
    {
        const dataIdx = (palaId * palaSize);

        // For attempts to access the PALA data out of bounds, return a dummy texture.
        if ((dataIdx < 0) ||
            ((dataIdx + palaSize) >= data.byteLength))
        {
            console.warn("Generating a dummy ANIM texture to avoid overflowing the source data buffer.");
            
            return Rsed.visual.texture(
            {
                ...args,
                width: 1,
                height: 1,
                indices: [0],
                args: args,
            });
        }

        // A slice of the entire PALAT data representing the region in which this particular
        // PALAT texture's pixels are.
        const dataSlice = data.slice(dataIdx, (dataIdx + palaSize));

        return Rsed.visual.texture(
        {
            ...args,
            width: palaWidth,
            height: palaHeight,
            name: `ANIMS.DTA #${palaId}`,
            indices: dataSlice,
            assetId: palaId,
            assetType: "anims",
            replace_all_pixels: function(newColorIndices = [])
            {
                Rsed.assert?.(
                    (Array.isArray(newColorIndices) &&
                     (newColorIndices.length === (palaWidth * palaHeight))),
                    "Incompatible source data for replacing a texture's pixels."
                );

                for (let i = 0; i < newColorIndices.length; i++)
                {
                    data[dataIdx + i] = newColorIndices[i];
                }

                // Regenerate this texture to incorporate the changes we've made to the
                // pixels.
                const originalTexture = prebakedAnimTextures[palaId];
                const newTexture = prebakedAnimTextures[palaId] = generate_texture(palaId, args);
                broadcast_texture_change(newTexture, originalTexture);
                return newTexture;
            },
            set_pixel_at: function(x = 0, y = 0, newColorIdx = 0)
            {
                const texelIdx = (x + y * palaWidth);

                data[dataIdx + texelIdx] = newColorIdx;

                // Regenerate this texture to incorporate the changes we've made to the
                // master data array.
                const originalTexture = prebakedAnimTextures[palaId];
                const newTexture = prebakedAnimTextures[palaId] = generate_texture(palaId, args);
                broadcast_texture_change(newTexture, originalTexture);
                return newTexture;
            },
        });
    }
    
    return publicInterface;
};

function broadcast_texture_change(newTexture, previousTexture)
{
    window.dispatchEvent(new CustomEvent("rallysported:texture-changed", {
        detail: {
            from: previousTexture,
            to: newTexture,
        },
    }));
}
/*
 * Most recent known filename: js/track/props.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Provides information about and the means to modify a track's props (track-side 3d objects,
// like trees and the finish line). For more information about track props, check out the
// documentation at https://github.com/leikareipa/rallysported/tree/master/docs; and the
// prop metadata JSON file, distributable/assets/metadata/props.json.
//
// The textureAtlas parameter provides as an array the pixels of the prop texture atlas, with
// each byte in it giving the corresponding pixel's RGB color as a palette index.
Rsed.gameContent.props = async function(textureAtlas = Uint8Array)
{
    const data = await fetch_prop_metadata_from_server();

    Rsed.assert?.(
        (typeof data.propMeshes !== "undefined") &&
        (typeof data.propLocations !== "undefined") &&
        (typeof data.propNames !== "undefined"),
        "Missing properties in prop metadata."
    );

    // Filter out comments and other auxiliary info from the JSON data; and sort by the relevant
    // index, so we can access the xth element with [x].
    const propNames = (
        data.propNames
        .filter(m=>(typeof m.propId !== "undefined"))
        .sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)))
    );
    const propMeshes = (
        data.propMeshes
        .filter(m=>(typeof m.propId !== "undefined"))
        .sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)))
    );
    const trackPropLocations = (
        data.propLocations
        .filter(m=>(typeof m.trackId !== "undefined"))
        .sort((a, b)=>((a.trackId === b.trackId)? 0 : ((a.trackId > b.trackId)? 1 : -1)))
    );
    const textureRects = (
        data.propTextureRects
        .filter(m=>(typeof m.textureId !== "undefined"))
        .sort((a, b)=>((a.textureId === b.textureId)? 0 : ((a.textureId > b.textureId)? 1 : -1)))
    );

    // The assumed width of the prop texture atlas.
    const textureAtlasWidth = 128;

    // Pre-compute the individual prop textures.
    const prebakedPropTextures = new Array(textureRects.length).fill().map((tex, idx)=>generate_prop_texture(idx));

    // Pre-compute prop meshes. Each mesh will be an object with the following form:
    //
    //     {
    //         ngons:
    //         [
    //             {
    //                 fill:
    //                 {
    //                     type: "color" | "texture",
    //                     idx: ...
    //                 }
    //                 vertices:
    //                 [
    //                     {x: ..., y: ..., z: ...},
    //                     {x: ..., y: ..., z: ...},
    //                     {x: ..., y: ..., z: ...},
    //                     ...
    //                 ]
    //             },
    //             {
    //                 fill: {type: ..., idx: ...}
    //                 vertices: [{...}]
    //             },
    //             ...
    //         ]
    //     }
    //
    // That is, each mesh consists of one or more n-gons, which themselves consist of
    // a fill property, which describes whether the n-gon should be filled with a solid
    // color or a texture (the fill.idx property defines either the color's palette index
    // or the texture's index, depending on the fill type); and a list of the n vertices
    // that define the n-gon.
    //
    const prebakedPropMeshes = new Array(propMeshes.length).fill().map((mesh, idx)=>({
        ngons: propMeshes[idx].ngons.map(ngon=>({
            fill: {
                type: ngon.fill.type.slice(),
                idx: ngon.fill.idx
            },
            vertices: ngon.vertices.map(vert=>({
                x: vert.x,
                y: -vert.y,
                z: -vert.z
            })),
        }))
    }));

    const publicInterface =
    {
        textureAtlas,
        textureRects,
        mesh: prebakedPropMeshes,
        texture: prebakedPropTextures,

        // Copies the given texture's data over the prop texture at the given index.
        // This causes the current texture to be re-generated; a reference to the
        // new texture object is returned.
        copy_texture_data: function(textureIdx = 0, srcTexture)
        {
            Rsed.throw_if_not_type("number", textureIdx);

            if ((srcTexture.width !== textureRects[textureIdx].rect.width) ||
                (srcTexture.height !== textureRects[textureIdx].rect.height))
            {
                Rsed.throw("Invalid prop texture dimensions for copying.")
            }

            for (let y = 0; y < srcTexture.height; y++)
            {
                for (let x = 0; x < srcTexture.width; x++)
                {
                    const dataIdx = ((textureRects[textureIdx].rect.topLeft.x + x) +
                                     (textureRects[textureIdx].rect.topLeft.y + y) *
                                     textureAtlasWidth);

                    textureAtlas[dataIdx] = srcTexture.indices[x + y * srcTexture.width];
                }
            }

            // Regenerate this texture to incorporate the changes we've made to the
            // master data array.
            const originalTexture = prebakedPropTextures[textureIdx];
            const newTexture = prebakedPropTextures[textureIdx] = generate_prop_texture(textureIdx);
            broadcast_texture_change(newTexture, originalTexture);
            return newTexture;
        },

        name: (propId = 0)=>
        {
            Rsed.assert?.(
                ((propId >= 0) && (propId < propMeshes.length)),
                `Querying a prop mesh out of bounds (${propId}).`
            );

            return propNames[propId].name;
        },

        names: ()=>
        {
            return propNames.map(nameObj=>nameObj.name);
        },

        // Returns the id of a prop with the supplied name. Throws if no such prop was found.
        id_for_name: (propName = "")=>
        {
            const idx = propNames.map(nameObj=>nameObj.name).indexOf(propName);

            Rsed.assert?.((idx >= 0), `Failed to find a prop called ${propName}.`);

            return propNames[idx].propId;
        },

        // Moves the propIdx'th prop on the given track by the given delta.
        move: (trackId = 0, propIdx = 0, delta = {x:0,y:0,z:0})=>
        {
            Rsed.assert?.(
                ((trackId >= 0) && (trackId <= 7)),
                "Querying a track out of bounds."
            );

            Rsed.assert?.(
                ((propIdx >= 0) &&
                 (propIdx < trackPropLocations[trackId].locations.length)),
                "Querying a prop location out of bounds."
            );

            const currentLocation = trackPropLocations[trackId].locations[propIdx];

            delta =
            {
                ...{x:0,y:0,z:0},
                ...delta,
            };

            currentLocation.x = clamped_to_prop_margins(currentLocation.x + delta.x);
            currentLocation.y = (currentLocation.y + delta.y);
            currentLocation.z = clamped_to_prop_margins(currentLocation.z + delta.z);
        },

        remove: (trackId = 0, propIdx = 0)=>
        {
            Rsed.assert?.(
                ((trackId >= 0) && (trackId <= 7)),
                "Querying a track out of bounds."
            );

            Rsed.assert?.(
                ((propIdx >= 0) &&
                 (propIdx < trackPropLocations[trackId].locations.length)),
                "Querying a prop location out of bounds."
            );

            /// TODO: Finish lines should not be user-removable; so we do a little string comparison
            /// kludge to ensure that doesn't happen. A more elegant implementation would ideally
            /// be substituted.
            if (propNames[trackPropLocations[trackId].locations[propIdx].propId].name.startsWith("finish"))
            {
                Rsed.alert("The finish line can't be removed.");

                // Prevent the same input from registering again next frame, before
                // the user has had time to release the mouse button.
                Rsed.ui.utils.inputState.reset_mouse_buttons_state();

                return;
            }

            trackPropLocations[trackId].locations.splice(propIdx, 1);
        },

        // Assigns a new location to the propIdx'th prop on the given track.
        set_prop_location: (trackId = 0, propIdx = 0, location = {x:0,y:0,z:0})=>
        {
            Rsed.assert?.(
                ((trackId >= 0) && (trackId <= 7)),
                "Querying a track out of bounds."
            );

            Rsed.assert?.(
                ((propIdx >= 0) &&
                 (propIdx < trackPropLocations[trackId].locations.length)),
                "Querying a prop location out of bounds."
            );

            location =
            {
                ...
                {
                    x: trackPropLocations[trackId].locations[propIdx].x,
                    y: trackPropLocations[trackId].locations[propIdx].y,
                    z: trackPropLocations[trackId].locations[propIdx].z,
                },
                ...location,
            }

            trackPropLocations[trackId].locations[propIdx].x = location.x;
            trackPropLocations[trackId].locations[propIdx].y = location.y;
            trackPropLocations[trackId].locations[propIdx].z = location.z;
        },

        // Set the number of props on the given track. Props whose index value is higher than this
        // count will be deleted. Note that this function is for RallySportED Loader pre-v.5.
        set_count: (trackId = 0, newPropCount = 0)=>
        {
            Rsed.assert?.(
                ((trackId >= 0) && (trackId <= 7)),
                "Querying a track out of bounds."
            );

            Rsed.assert?.(
                ((newPropCount >= 1) &&
                 (newPropCount <= Rsed.constants.maxPropCount)),
                "Trying to set a new prop count out of bounds."
            );

            trackPropLocations[trackId].locations.length = newPropCount;
        },

        // Set the number of props on the given track. For RallySportED Loader v.5.
        set_count__loader_v5: (trackId = 0, newPropCount = 0)=>
        {
            Rsed.assert?.(
                ((trackId >= 0) && (trackId <= 7)),
                "Querying a track out of bounds."
            );

            Rsed.assert?.(
                ((newPropCount >= 1) &&
                 (newPropCount <= Rsed.constants.maxPropCount)),
                "Trying to set a new prop count out of bounds."
            );

            trackPropLocations[trackId].locations = new Array(newPropCount).fill().map(e=>({x:0, y:0, z:0, propId: 0}));
        },

        reset_count: (trackId = 0)=>
        {
            Rsed.assert?.(
                ((trackId >= 0) && (trackId <= 7)),
                "Querying a track out of bounds."
            );

            trackPropLocations[trackId].locations.length = 0;
        },

        change_prop_type: (trackId = 0, propIdx = 0, newPropId = 0)=>
        {
            Rsed.assert?.(
                ((trackId >= 0) && (trackId <= 7)),
                "Querying a track out of bounds."
            );

            Rsed.assert?.(
                ((propIdx >= 0) &&
                 (propIdx < trackPropLocations[trackId].locations.length)),
                "Querying a prop location out of bounds."
            );

            trackPropLocations[trackId].locations[propIdx].propId = newPropId;
        },

        num_props_on_track: (trackId = 0)=>
        {
            return trackPropLocations[trackId].locations.length;
        },

        add_location: (trackId = 0, newPropId = 0, location = {x:0,y:0,z:0})=>
        {
            if (trackPropLocations[trackId].locations.length >= Rsed.constants.maxPropCount)
            {
                Rsed.alert("All prop slots are in use. Remove a prop to make room.");
                return;
            }

            Rsed.assert?.(
                ((trackId >= 0) && (trackId <= 7)),
                "Querying a track out of bounds."
            );

            Rsed.assert?.(
                ((newPropId >= 0) && (newPropId < propNames.length)),
                "Querying a prop id out of bounds."
            );

            location =
            {
                ...
                {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                ...location,
            }

            trackPropLocations[trackId].locations.push(
            {
                propId: newPropId,
                x: clamped_to_prop_margins(location.x),
                y: location.y,
                z: clamped_to_prop_margins(location.z),
            });
        },

        // Returns by value the locations of all the props on the given track.
        locations_of_props_on_track: (trackId = 0)=>
        {
            Rsed.assert?.(
                ((trackId >= 0) && (trackId <= 7)),
                "Querying a track out of bounds."
            );

            return Object.freeze(trackPropLocations[trackId].locations.map(loc=>(
            {
                propId: loc.propId,
                x: loc.x,
                y: loc.y,
                z: loc.z
            })));
        },
    };

    return publicInterface;

    function generate_prop_texture(idx)
    {
        const width = textureRects[idx].rect.width;
        const height = textureRects[idx].rect.height;
        const indices = [];

        // Copy the texture's pixel region from the texture atlas.
        for (let y = 0; y < height; y++)
        {
            for (let x = 0; x < width; x++)
            {
                const dataIdx = ((textureRects[idx].rect.topLeft.x + x) + (textureRects[idx].rect.topLeft.y + y) * textureAtlasWidth);
                indices.push(textureAtlas[dataIdx]);
            }
        }

        return Rsed.visual.texture({
            name: `TEXT1.DTA #${idx}`,
            width,
            height,
            indices,
            flipped: "no",
            assetId: idx,
            assetType: "props",
            replace_all_pixels: function(newColorIndices = [])
            {
                Rsed.assert?.(
                    (Array.isArray(newColorIndices) &&
                     (newColorIndices.length === (width * height))),
                    "Incompatible source data for replacing a texture's pixels."
                );

                for (let y = 0; y < height; y++)
                {
                    for (let x = 0; x < width; x++)
                    {
                        const dataIdx = (
                            (textureRects[idx].rect.topLeft.x + x) +
                            (textureRects[idx].rect.topLeft.y + y) *
                            textureAtlasWidth
                        );

                        textureAtlas[dataIdx] = newColorIndices[x + y * width];
                    }
                }

                // Regenerate this texture to incorporate the changes we've made to the
                // master data array.
                const originalTexture = prebakedPropTextures[idx];
                const newTexture = prebakedPropTextures[idx] = generate_prop_texture(idx);
                broadcast_texture_change(newTexture, originalTexture);
                return newTexture;
            },
            set_pixel_at: function(x = 0, y = 0, newColorIdx = 0)
            {
                const texelIdx = (
                    (textureRects[idx].rect.topLeft.x + x) +
                    (textureRects[idx].rect.topLeft.y + y) *
                    textureAtlasWidth
                );

                textureAtlas[texelIdx] = newColorIdx;

                // Regenerate this texture to incorporate the changes we've made to the
                // master data array.
                const originalTexture = prebakedPropTextures[idx];
                const newTexture = prebakedPropTextures[idx] = generate_prop_texture(idx);
                broadcast_texture_change(newTexture, originalTexture);
                return newTexture;
            },
        });
    }

    // Clamp the given value (expected to be track tile units) so that it doesn't exceed the
    // track prop margins. (E.g. if the track is 128 tiles wide and the margin is 2 tiles, a
    // value of 132 would be clamped to 126; and a value of -5 to 2.)
    function clamped_to_prop_margins(value)
    {
        const min = (Rsed.constants.propTileMargin * Rsed.constants.groundTileSize);
        const max = ((Rsed.$currentProject.maasto.width - Rsed.constants.propTileMargin) * Rsed.constants.groundTileSize);
        return Rsed.clamp(value, min, max);
    }

    // Prop metadata includes vertex data, texture UV coordinates, display names, etc. of
    // track props.
    async function fetch_prop_metadata_from_server()
    {
        try
        {
            const response = await fetch("./assets/data/track-props.json");
            return await response.json();
        }
        catch (error)
        {
            Rsed.throw(error);
        }
    }
}

function broadcast_texture_change(newTexture, previousTexture)
{
    window.dispatchEvent(new CustomEvent("rallysported:texture-changed", {
        detail: {
            from: previousTexture,
            to: newTexture,
        },
    }));
}
/*
 * Most recent known filename: js/rallysported-js/game-content/wires.js
 *
 * 2022 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.gameContent.wires = async function()
{
    const data = await fetch_wire_metadata_from_server();

    Rsed.assert?.(
        ((typeof data.trackWires !== "undefined")),
        "Missing properties in wire metadata."
    );

    data.trackWires = data.trackWires.filter(e=>e.trackId);

    // Transform wire coordinates into RallySportED's world units.
    for (const trackWires of data.trackWires)
    {
        trackWires.wires.forEach(w=>{
            w.start.x *= Rsed.constants.groundTileSize;
            w.start.z *= Rsed.constants.groundTileSize;
            w.end.x *= Rsed.constants.groundTileSize;
            w.end.z *= Rsed.constants.groundTileSize;
        })
    }

    const publicInterface = {
        // Returns the wires that're on the given track, with a quadratic curve applied
        // to each wire.
        wires_on_track: (trackId = 0)=>
        {
            const wiresOnTrack = data.trackWires.find(e=>e.trackId == trackId);

            if (!wiresOnTrack){
                return [];
            }

            // Split each wire into segments, and apply a quadratic curve to the segments.
            const curvedWireSegments = [];
            const numCurvePoints = 10;
            for (const wire of wiresOnTrack.wires)
            {
                const startHeight = Rsed.$currentProject.maasto.tile_at(
                    (wire.start.x / Rsed.constants.groundTileSize),
                    (wire.start.z / Rsed.constants.groundTileSize)
                );
                const endHeight = Rsed.$currentProject.maasto.tile_at(
                    (wire.end.x / Rsed.constants.groundTileSize),
                    (wire.end.z / Rsed.constants.groundTileSize)
                );
    
                const startPoint = {
                    x: wire.start.x,
                    y: (wire.start.y + startHeight),
                    z: wire.start.z,
                };
                const endPoint = {
                    x: wire.end.x,
                    y: (wire.end.y + endHeight),
                    z: wire.end.z,
                };
                const middlePoint = {
                    x: Rsed.lerp(startPoint.x, endPoint.x, 0.5),
                    y: (Rsed.lerp(startPoint.y, endPoint.y, 0.5) - wire.curvature),
                    z: Rsed.lerp(startPoint.z, endPoint.z, 0.5),
                };
                
                const thisSegment = [];
                for (let i = 0; i < numCurvePoints; i++)
                {
                    const t = (i / (numCurvePoints - 1));
                    thisSegment.push({...wire, ...quadratic_curve(startPoint, endPoint, middlePoint, t)});

                    // Adapted from https://stackoverflow.com/a/31757637.
                    function quadratic_curve(start, end, control, t)
                    {
                        return {
                            x: (((1 - t) ** 2) * start.x + 2 * (1 - t) * t * control.x + (t ** 2) * end.x),
                            y: (((1 - t) ** 2) * start.y + 2 * (1 - t) * t * control.y + (t ** 2) * end.y),
                            z: (((1 - t) ** 2) * start.z + 2 * (1 - t) * t * control.z + (t ** 2) * end.z),
                        }
                    }
                }
                
                // Join the wire segments.
                for (let i = 0; i < (thisSegment.length - 1); i++)
                {
                    const thisWire = thisSegment[i];
                    const nextWire = thisSegment[i + 1];

                    thisWire.start = {
                        x: thisWire.x,
                        y: thisWire.y,
                        z: thisWire.z
                    };
                    thisWire.end = {
                        x: nextWire.x,
                        y: nextWire.y,
                        z: nextWire.z
                    };
                    thisWire.middle = {
                        x: Rsed.lerp(thisWire.start.x, thisWire.end.x, 0.5),
                        y: Rsed.lerp(thisWire.start.y, thisWire.end.y, 0.5),
                        z: Rsed.lerp(thisWire.start.z, thisWire.end.z, 0.5),
                    }
                }
                thisSegment.pop();
                
                curvedWireSegments.push(...thisSegment);
            }

            return curvedWireSegments;
        },
    };

    return publicInterface;

    async function fetch_wire_metadata_from_server()
    {
        return (
            fetch("./assets/data/track-wires.json")
            .then(response=>
            {
                if (response.status != 200) {
                    throw "Failed to fetch wire metadata from the RallySportED-js server.";
                }

                return response.json();
            })
            .catch(error=>{ Rsed.throw(error); })
        );
    }
}
/*
 * Most recent known filename: js/ui/asset-mutator.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A layer that sits between the user and the game assets (heightmap, tilemap, textures,
// etc.), registering and routing all commands from the user to modify those assets. This
// is to ensure that all user-initiated modifications are inserted into the undo/redo
// stack, transmitted through the network in shared editing mode, etc.
//
// WARNING: If a particular mutation of asset is not available via this layer, the user
// should not be allowed to perform it even if the asset object itself provides a direct
// function for that mutation. For instance, the layer doesn't provide a way to set the
// number of track props even though it could be done via project.props.set_count(); so
// the user should instead be made to act via the layer's "add" and "remove" prop actions,
// or the layer should be expanded to allow specific manipulation of the prop count.
Rsed.ui.utils.assetMutator = (function()
{
    const publicInterface = {
        // Call this function when the user requests (e.g. via the UI) to perform a
        // mutation on an asset - e.g. to paint the tilemap, alter the heightmap, etc.
        //
        // 'assetType' identifies which class of asset is to be edited. Valid values
        // are "maasto" (heightmap), "varimaa" (tilemap), "texture", and "prop".
        //
        // 'editAction' defines the action to be performed on the asset; being an
        // object of the following form:
        //
        //   {
        //       command: A string enumerator identifying the edit action to be performed wrt. the asset
        //       target: A property identifying the specific instance of asset to be acted in regard to
        //       data: A payload associated with the action - e.g. a new height value to modify the heightmap with
        //   }
        //
        // You can find which 'editAction' parameters are valid for a given class of
        // asset by inspecting the applicator functions.
        user_edit: (assetType = "", editAction = {})=>
        {
            if (!Object.keys(applicators).includes(assetType))
            {
                Rsed.throw("Unknown asset type.");
            }

            const result = applicators[assetType](Rsed.$currentProject, editAction);

            return result;
        }
    }

    // For each class of asset, a function that applies a user-requested mutation on
    // the asset.
    const applicators = {
        "maasto": (project, edit)=>
        {
            switch (edit.command)
            {
                case "set-height":
                {
                    Rsed.ui.utils.undoStack.mark_dirty_ground_tile(edit.target.x, edit.target.y);
                    project.maasto.set_tile_value_at(edit.target.x, edit.target.y, edit.data);
                    break;
                }
                case "import":
                {
                    Rsed.assert?.(edit.file instanceof File);

                    (async()=>{
                        const newMaastoData = await project.read_asset_file(edit.file, "maasto");
                        const newMaasto = Rsed.gameContent.maasto(newMaastoData);
                        
                        for (let y = 0; y < newMaasto.height; y++)
                        {
                            for (let x = 0; x < newMaasto.width; x++)
                            {
                                Rsed.ui.utils.undoStack.mark_dirty_ground_tile(x, y);
                                project.maasto.set_tile_value_at(x, y, newMaasto.tile_at(x, y));
                            }
                        }
                    })();

                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        },

        "varimaa": (project, edit)=>
        {
            switch (edit.command)
            {
                case "set-tile":
                {
                    Rsed.ui.utils.undoStack.mark_dirty_ground_tile(edit.target.x, edit.target.y);
                    project.varimaa.set_tile_value_at(edit.target.x, edit.target.y, edit.data);
                    break;
                }
                case "import":
                {
                    Rsed.assert?.(edit.file instanceof File);

                    (async()=>{
                        const newVarimaaData = await project.read_asset_file(edit.file, "varimaa");
                        const newVarimaa = Rsed.gameContent.varimaa(newVarimaaData);
                        
                        for (let y = 0; y < newVarimaa.height; y++)
                        {
                            for (let x = 0; x < newVarimaa.width; x++)
                            {
                                Rsed.ui.utils.undoStack.mark_dirty_ground_tile(x, y);
                                project.varimaa.set_tile_value_at(x, y, newVarimaa.tile_at(x, y));
                            }
                        }
                    })();

                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        },

        // Rally-Sport's ANIMS asset data (animation frames).
        "anims": (project, edit)=>
        {
            switch (edit.command)
            {
                case "import":
                {
                    Rsed.assert?.(edit.file instanceof File);

                    (async()=>{
                        const newAnimsData = await project.read_asset_file(edit.file, "anims");
                        const newAnims = Rsed.gameContent.anims(newAnimsData);
                        const numNewAnims = Math.min(
                            project.palat.texture.length,
                            newAnims.texture.length
                        );

                        for (let i = 0; i < numNewAnims; i++)
                        {
                            Rsed.ui.utils.assetMutator.user_edit("texture", {
                                command: "set-all-pixels",
                                target: {texture: project.anims.texture[i]},
                                data: Array.from(newAnims.texture[i].indices),
                            });
                        }
                    })();

                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        },

        // Rally-Sport's TEXT asset data (texture atlas for 3D meshes).
        "text": (project, edit)=>
        {
            switch (edit.command)
            {
                case "import":
                {
                    Rsed.assert?.(edit.file instanceof File);

                    (async()=>{
                        const newTextureAtlas = await project.read_asset_file(edit.file, "palat");
                        const newProps = await Rsed.gameContent.props(newTextureAtlas);
                        const count = Math.min(
                            project.props.texture.length,
                            newProps.texture.length
                        );

                        for (let i = 0; i < count; i++)
                        {
                            Rsed.ui.utils.assetMutator.user_edit("texture", {
                                command: "set-all-pixels",
                                target: {texture: project.props.texture[i]},
                                data: Array.from(newProps.texture[i].indices),
                            });
                        }
                    })();

                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        },

        // Rally-Sport's KIERROS asset data (CPU opponent's driving line).
        "kierros": (project, edit)=>
        {
            switch (edit.command)
            {
                case "import":
                {
                    Rsed.assert?.(edit.file instanceof File);
                    Rsed.$currentProject.import_asset_file(edit.file, "kierros");
                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        },

        // Rally-Sport's PALAT asset data (terrain textures).
        "palat": (project, edit)=>
        {
            switch (edit.command)
            {
                case "import":
                {
                    Rsed.assert?.(edit.file instanceof File);

                    (async()=>{
                        const newPalatData = await project.read_asset_file(edit.file, "palat");
                        const newPalat = Rsed.gameContent.palat(newPalatData);
                        const numNewPalat = Math.min(
                            project.palat.texture.length,
                            newPalat.texture.length
                        );

                        for (let i = 0; i < numNewPalat; i++)
                        {
                            Rsed.ui.utils.assetMutator.user_edit("texture", {
                                command: "set-all-pixels",
                                target: {texture: project.palat.texture[i]},
                                data: Array.from(newPalat.texture[i].indices),
                            });
                        }
                    })();

                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        },

        "texture": (project, edit)=>
        {
            let texture = edit.target?.texture;
            
            Rsed.assert?.(texture, "Invalid texture reference.");

            Rsed.ui.utils.undoStack.mark_dirty_texture(texture.assetType, edit.target.texture.assetId);

            switch (edit.command)
            {
                case "set-pixel":
                {
                    Rsed.assert?.(
                        ((typeof edit.target?.u === "number") &&
                         (typeof edit.target?.v === "number") &&
                         (typeof edit.data === "number")),
                        "Invalid source data for updating a texture's pixel."
                    );

                    texture = texture.set_pixel_at(edit.target.u, edit.target.v, edit.data);

                    break;
                }
                case "set-all-pixels":
                {
                    Rsed.assert?.(
                        (Array.isArray(edit.data) &&
                         (edit.data.length == texture.indices.length)),
                        "Invalid source data for updating a texture's pixels."
                    );

                    texture = texture.replace_all_pixels(edit.data);

                    break;
                }
                default: Rsed.throw(`Unrecognized texture mutation "${edit.command}".`); break;
            }

            return;
        },

        "prop": (project, edit)=>
        {
            const trackId = project.track_id();
            const propIdx = edit.target;

            Rsed.ui.utils.undoStack.mark_dirty_props();
    
            switch (edit.command)
            {
                case "move":
                {
                    project.props.move(trackId, propIdx, edit.data);
                    break;
                }
                case "remove":
                {
                    project.props.remove(trackId, propIdx);
                    break;
                }
                case "set-type":
                {
                    project.props.change_prop_type(trackId, propIdx, edit.data);
                    break;
                }
                case "add":
                {
                    project.props.add_location(trackId, propIdx, edit.data);
                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        }
    }

    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/undo-stack.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// An undo/redo system.
//
// The system keeps track of the user's track edits (like altering ground height, moving
// props, etc.), and stores them in 'undo levels'.
//
// An undo level starts when the user makes an edit, and ends when they release all mouse
// buttons (it's assumed that only mouse buttons can be used to make track edits). This
// undo level will then consist of any track edits the user made in that time.
//
// To undo the most recent edits, you'd call undo(). And, provided that the user hasn't
// made any new edits since that call to undo(), you can re-do the edits by calling redo().
//
// Making new edits after calling undo() will cause the undo levels above it to be erased
// and replaced with one or more new levels reflecting the new edits.
Rsed.ui.utils.undoStack = (function()
{
    // While true, no new new undo levels can be added.
    let frozen = false;

    // We'll use a timer (setInterval()) to decide when to seal the current undo level
    // once it has been created.
    let timerId = null;

    // Track data as it were before the current undo level for any track elements
    // that are modified by this undo level.
    let dirtyGround = [];
    let dirtyProps = [];
    let dirtyTextures = [];

    // We'll keep track of which undo level's data has been saved so RallySportED-js
    // can indicate to the user whether the project's current state is saved or not.
    let lastSavedUndoLevelId = undefined;

    // All undo levels we've recorded since they were last reset. Note that if the user
    // undoes and then makes new changes, the undo levels above that point will be
    // replaced with new undo levels that reflect the new changes.
    const undoLevels = [];

    // The index in 'undoLevels' that we're currently at. If the user hasn't undone
    // anything, this will be the total count of undo levels; otherwise, this is moved
    // back (down) each time the user undoes, and forward (up) when the user redoes.
    let undoLevelHead = 0;

    function create_undo_level()
    {
        // If we already have an active group.
        if (timerId !== null)
        {
            return;
        }

        timerId = setInterval(seal_undo_level, 1);
    }

    // Marks all changes made since starting the current undo level as
    // belonging to that undo level.
    function seal_undo_level()
    {
        if (!timerId)
        {
            Rsed.throw("Attempting to seal a nonexistent undo level.");
        }

        if (Rsed.ui.utils.inputState.mouse_button_down())
        {
            return;
        }

        clearInterval(timerId);
        timerId = null;

        undoLevels.length = (undoLevelHead + 1);

        // Ground data after this undo level's changes are made.
        const groundAfter = [];
        for (const tile of Object.keys(dirtyGround))
        {
            const x = dirtyGround[tile].x;
            const y = dirtyGround[tile].y;

            groundAfter[tile] = {
                x,
                y,
                height: Rsed.$currentProject.maasto.tile_at(x, y),
                palaIdx: Rsed.$currentProject.varimaa.tile_at(x, y),
            };
        }

        // Prop data after this undo level's changes are made.
        const propsAfter = Rsed.$currentProject.props.locations_of_props_on_track(Rsed.$currentProject.trackId);

        // Texture data after this undo level's changes are made.
        const texturesAfter = [];
        for (const textureId of Object.keys(dirtyTextures))
        {
            // We expect the texture id to be of the form "<type> <value>", e.g.
            // "palat 97" for PALA texture #97.
            const [textureType, textureIndex] = textureId.split(" ");

            texturesAfter[textureId] = Rsed.$currentProject[textureType].texture[textureIndex];
        }

        undoLevels[undoLevelHead] = {
            id: crypto.randomUUID(),
            before: {
                ground: dirtyGround,
                props: dirtyProps,
                textures: dirtyTextures,
            },
            after: {
                ground: groundAfter,
                props: propsAfter,
                textures: texturesAfter,
            }
        };

        undoLevelHead++;

        dirtyGround = [];
        dirtyProps = [];
        dirtyTextures = [];

        // Let the user know that they have unsaved changes.
        Rsed.ui.dom.html.refresh();
    }

    // Undo the changes in the current undo level if when == "before", or redo
    // the current undo level's changes if when == "after".
    function apply_undo_level(undoLevel, when = "before")
    {
        const targetProject = Rsed.$currentProject;

        if (!undoLevel)
        {
            return;
        }
        
        // Don't allow undo while an action group is being recorded.
        if (timerId !== null)
        {
            return;
        }

        frozen = true;

        // Undo on ground tiles.
        for (const tile of Object.keys(undoLevel[when].ground))
        {
            targetProject.maasto.set_tile_value_at(
                undoLevel[when].ground[tile].x,
                undoLevel[when].ground[tile].y,
                undoLevel[when].ground[tile].height
            );

            targetProject.varimaa.set_tile_value_at(
                undoLevel[when].ground[tile].x,
                undoLevel[when].ground[tile].y,
                undoLevel[when].ground[tile].palaIdx
            );
        }

        // Undo on props.
        if (undoLevel[when].props.length)
        {
            const trackId = targetProject.trackId;

            targetProject.props.set_count__loader_v5(trackId, undoLevel[when].props.length);

            for (let i = 0; i < undoLevel[when].props.length; i++)
            {
                targetProject.props.set_prop_location(trackId, i, {
                    x: undoLevel[when].props[i].x,
                    y: undoLevel[when].props[i].y,
                    z: undoLevel[when].props[i].z,
                });

                targetProject.props.change_prop_type(trackId, i, undoLevel[when].props[i].propId);
            }
        }

        // Undo on textures.
        for (const textureId of Object.keys(undoLevel[when].textures))
        {
            // We expect the texture id to be of the form "<type> <value>", e.g.
            // "palat 97" for PALA texture #97.
            const [textureType, textureIndex] = textureId.split(" ");

            targetProject[textureType].copy_texture_data(Number(textureIndex), undoLevel[when].textures[textureId]);
        }

        frozen = false;
    }

    const publicInterface = {
        is_current_undo_level_saved: function()
        {
            return (lastSavedUndoLevelId === publicInterface.current_undo_level_id());
        },

        mark_current_undo_level_as_saved: function()
        {
            lastSavedUndoLevelId = publicInterface.current_undo_level_id();
        },

        current_undo_level_id: function()
        {
            return (undoLevels[undoLevelHead - 1]? undoLevels[undoLevelHead - 1].id : undefined);
        },

        // Removes all undo levels.
        reset: function()
        {
            frozen = false;

            timerId = null;

            dirtyGround = [];
            dirtyProps = [];
            dirtyTextures = [];
        
            undoLevels.length = 0;
            undoLevelHead = 0;
            lastSavedUndoLevelId = undefined;

            return;
        },

        // Undoes the latest level.
        undo: function()
        {
            if (frozen || Rsed.ui.utils.inputState.mouse_button_down())
            {
                return;
            }

            // If no more undo levels.
            if (undoLevelHead <= 0)
            {
                return;
            }

            undoLevelHead--;

            apply_undo_level(undoLevels[undoLevelHead], "before");

            Rsed.ui.dom.html.refresh();
        },

        // Redoes the latest level.
        redo: function()
        {
            if (frozen || Rsed.ui.utils.inputState.mouse_button_down())
            {
                return;
            }

            // If no more undo levels.
            if (undoLevelHead >= undoLevels.length)
            {
                return;
            }

            apply_undo_level(undoLevels[undoLevelHead], "after");
            undoLevelHead++;

            Rsed.ui.dom.html.refresh();
        },

        // For the given XY ground tile, marks its height and texture index at
        // the beginning of the current undo level.
        mark_dirty_ground_tile: function(x = 0, y = 0)
        {
            Rsed.throw_if_not_type("number", x, y);

            if (frozen || Rsed.$currentProject.isPlaceholder)
            {
                return;
            }

            create_undo_level();

            if (typeof dirtyGround[`${x} ${y}`] === "undefined")
            {
                dirtyGround[`${x} ${y}`] = {
                    x,
                    y,
                    height: Rsed.$currentProject.maasto.tile_at(x, y),
                    palaIdx: Rsed.$currentProject.varimaa.tile_at(x, y),
                };
            }
        },

        // Stores all of the current track's prop info at the beginning of the
        // current undo level.
        mark_dirty_props: function()
        {
            if (frozen || Rsed.$currentProject.isPlaceholder)
            {
                return;
            }

            // If we've already stored the prop info for the current undo level.
            if (dirtyProps.length)
            {
                return;
            }

            create_undo_level();

            dirtyProps = Rsed.$currentProject.props.locations_of_props_on_track(Rsed.$currentProject.trackId);
        },

        // Stores the data of the given texture at the beginning of the current undo
        // level.
        mark_dirty_texture: function(textureType = "", palaIdx = 0)
        {
            if (frozen || Rsed.$currentProject.isPlaceholder)
            {
                return;
            }

            Rsed.throw_if_not_type("number", palaIdx);

            if (!["props", "palat", "anims"].includes(textureType))
            {
                Rsed.throw("Unknown texture type.");
            }

            create_undo_level();

            if (typeof dirtyTextures[`${textureType} ${palaIdx}`] === "undefined")
            {
                dirtyTextures[`${textureType} ${palaIdx}`] = Rsed.$currentProject[textureType].texture[palaIdx];
            }
        },
    };

    publicInterface.reset();

    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/input-state.js
 *
 * 2019 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Stores and provides information about the current state of user input (keyboard and
// mouse interaction).
Rsed.ui.utils.inputState = (function()
{
    // For each key code, a boolean to indicate whether that key is current down. Note
    // that the key codes are stored as uppercase characters, so e.g. 69 is stored as "E".
    const keyboardState = {};

    const mouseState =
    {
        // Which of the mouse buttons are currently down, and which modifiers were
        // being pressed when the click was registered.
        buttons:
        {
            left:
            {
                isDown: false,
                modifiers: [],
            },
            middle:
            {
                isDown: false,
                modifiers: [],
            },
            right:
            {
                isDown: false,
                modifiers: [],
            },
        },

        // Wheel scroll.
        wheel: 0,

        // Where inside the RallySportED canvas the mouse cursor is currently located.
        position:
        {
            x: 0,
            y: 0,
        },

        // Which mouse-picking buffer element the cursor is currently hovering over.
        hover: null,

        // Which mouse-picking buffer element the cursor most recently clicked on.
        // When the button is clicked, the grab is put into effect; and when the
        // button is released, the grab is released also.
        grab: null,
    };

    // For touch screen controls.
    const touchState =
    {
        isTouching: false,

        // Where, in screen coordinates, the current touch started.
        touchStart:
        {
            x: 0,
            y: 0,
        },

        // Where, in screen coordinates, the current touch is located now.
        currentTouchPos:
        {
            x: 0,
            y: 0,
        },
    };

    const modifierKeys = Object.freeze([
        "shift",
        "control",
        "tab",
        "alt",
        "altgraph",
    ]);

    let isPropContextMenuOpen = false;

    /// TODO: Prefix boolean-returning functions with "is_", e.g. "key_down" => "is_key_down".
    const publicInterface =
    {
        mousePickBuffer: [],
        
        set_is_prop_context_menu_open: function(isOpen = false)
        {
            if (isPropContextMenuOpen)
            {
                this.reset_mouse_hover();
                this.reset_mouse_grab();
                this.reset_mouse_buttons_state();
                this.update_mouse_hover();
            }

            isPropContextMenuOpen = isOpen;
        },

        is_prop_context_menu_open: function()
        {
            return isPropContextMenuOpen;
        },

        // For touch screen controls.
        set_is_touching: function(isTouching = false, {startX = 0, startY = 0})
        {
            touchState.isTouching = Boolean(isTouching);

            if (touchState.isTouching)
            {
                touchState.touchStart.x = startX;
                touchState.touchStart.y = startY;

                this.update_touch_position({x:touchState.touchStart.x, y: touchState.touchStart.y});
            }
            else
            {
                touchState.touchStart.x = touchState.currentTouchPos.x = 0;
                touchState.touchStart.y = touchState.currentTouchPos.y = 0;
            }
        },

        // For touch screen controls.
        update_touch_position({x = 0, y = 0})
        {
            touchState.currentTouchPos.x = x;
            touchState.currentTouchPos.y = y;
        },

        // For touch screen controls. Returns the amount by which the current
        // touch has moved since the last time this function was called. Note
        // that calling this function will reset the count, so you'd only want
        // to call this e.g. once per frame.
        get_touch_move_delta: function()
        {
            if (!touchState.isTouching)
            {
                return {x: 0, y: 0};
            }

            const delta =
            {
                x: ((touchState.currentTouchPos.x - touchState.touchStart.x) / 5),
                y: ((touchState.currentTouchPos.y - touchState.touchStart.y) / 5),
            };

            touchState.touchStart.x = touchState.currentTouchPos.x;
            touchState.touchStart.y = touchState.currentTouchPos.y;

            return delta;
        },

        mouse_pos: function()
        {
            return {...mouseState.position};
        },

        mouse_pos_scaled_to_render_resolution: function()
        {
            const resolution = Rsed.visual.canvas.resolution();

            const scaledX = Math.round(mouseState.position.x * (resolution.width / window.innerWidth));
            const scaledY = Math.round(mouseState.position.y * (resolution.height / window.innerHeight));

            const clampedX = Math.max(0, Math.min((resolution.width - 1), scaledX));
            const clampedY = Math.max(0, Math.min((resolution.height - 1), scaledY));

            return {...mouseState.position, x:clampedX, y:clampedY};
        },

        mouse_button_down: function()
        {
            return (this.left_mouse_button_down() |
                    this.mid_mouse_button_down() |
                    this.right_mouse_button_down());
        },

        left_mouse_button_down: function()
        {
            return mouseState.buttons.left.isDown;
        },

        left_mouse_click_modifiers: function()
        {
            return mouseState.buttons.left.modifiers;
        },

        mid_mouse_button_down: function()
        {
            return mouseState.buttons.middle.isDown;
        },

        mid_mouse_click_modifiers: function()
        {
            return mouseState.buttons.middle.modifiers;
        },

        right_mouse_button_down: function()
        {
            return mouseState.buttons.right.isDown;
        },

        right_mouse_click_modifiers: function()
        {
            return mouseState.buttons.right.modifiers;
        },

        left_or_right_mouse_button_down: function()
        {
            return (mouseState.buttons.left || mouseState.buttons.right);
        },

        any_modifier_key_down: function()
        {
            return modifierKeys.some(key=>this.key_down(key));
        },

        key_down: function(key)
        {
            Rsed.throw_if_not_type("string", key);

            return Boolean(keyboardState[key.toUpperCase()] &&
                           keyboardState[key.toUpperCase()].isDown);
        },

        current_mouse_hover: function()
        {
            return mouseState.hover;
        },

        current_mouse_grab: function()
        {
            return mouseState.grab;
        },

        // Force the current mouse hover information to update.
        update_mouse_hover: function()
        {
            this.set_mouse_pos(this.mouse_pos().x, this.mouse_pos().y);
        },

        reset_mouse_hover: function()
        {
            mouseState.hover = null;
        },

        reset_mouse_grab: function()
        {
            mouseState.grab = null;
        },

        reset_mouse_buttons_state: function()
        {
            mouseState.buttons.left = {isDown: false, modifiers: []};
            mouseState.buttons.mid = {isDown: false, modifiers: []};
            mouseState.buttons.right = {isDown: false, modifiers: []};
        },

        reset_modifier_keys_state: function()
        {
            modifierKeys.forEach(key=>
            {
                if (this.key_down(key))
                {
                    Rsed.$currentScene.process_key_release(key);
                }

                this.set_key_down(key, false);
            });
        },

        reset_keys: function()
        {
            for (const keyIdx of Object.keys(keyboardState))
            {
                clearTimeout(keyboardState[keyIdx].cooldown);
                clearInterval(keyboardState[keyIdx].repeat);

                if (keyboardState[keyIdx].isDown)
                {
                    Rsed.$currentScene?.process_key_release(keyIdx);
                }

                keyboardState[keyIdx].isDown = false;
            }
        },

        reset_wheel_scroll: function()
        {
            mouseState.wheel = 0;
        },

        mouse_wheel_scroll: function()
        {
            return mouseState.wheel;
        },

        append_wheel_scroll: function(delta)
        {
            Rsed.throw_if_not_type("number", delta);

            // Note: For now, we require that the Shift key be pressed down for mouse
            // scroll to be registered. This is done so that the scroll wheel can be
            // used normally to scroll the contents of the viewport when the Shift is
            // not pressed, and when it is, the viewport is assumed to not scroll and
            // so we can instead act on the scroll in RallySportED.
            if (this.key_down("shift"))
            {
                mouseState.wheel += delta;
            }
        },
        
        // Mark the current key as being or not being down. Note that when a key is
        // marked as being down, it'll keep firing (auto-repeating) until it's marked
        // as being not down.
        set_key_down: function(keyCode, isDown = false)
        {
            Rsed.throw_if_not_type("boolean", isDown);

            if (Rsed.player.is_playing())
            {
                return;
            }

            const keyIdx = (()=>
            {
                switch (typeof keyCode)
                {
                    case "string": return keyCode.toUpperCase();
                    case "number": return String.fromCharCode(keyCode).toUpperCase();
                    default: Rsed.throw("Unknown variable type for key code."); return "unknown";
                }
            })();

            keyboardState[keyIdx] = (keyboardState[keyIdx] || {});
            keyboardState[keyIdx].isDown = isDown;

            clearTimeout(keyboardState[keyIdx].cooldown);
            clearInterval(keyboardState[keyIdx].repeat);
            keyboardState[keyIdx].cooldown = null;
            keyboardState[keyIdx].repeat = null;

            if (isDown)
            {
                keyboardState[keyIdx].cooldown = setTimeout(()=>
                {
                    keyboardState[keyIdx].repeat = setInterval(process_key_press, 75);
                }, 250);
            }

            process_key_press(false);

            function process_key_press(isRepeat = true)
            {
                Rsed.$currentScene?.[(isDown? "process_key_press" : "process_key_release")](keyIdx, isRepeat);
            }
        },

        set_mouse_pos: function(x = 0, y = 0)
        {
            Rsed.throw_if_not_type("number", x, y);

            if (Rsed.player.is_playing())
            {
                return;
            }

            mouseState.position.x = x;
            mouseState.position.y = y;

            if (!this.is_prop_context_menu_open())
            {
                const mousePos = this.mouse_pos_scaled_to_render_resolution();
                mouseState.hover = Rsed.ui.utils.inputState.mousePickBuffer[mousePos.x + mousePos.y * Rsed.visual.canvas.width];
            }
        },

        set_mouse_button_down: function(button = "left", isDown = false)
        {
            Rsed.throw_if_undefined(mouseState.buttons[button]);
            Rsed.throw_if_not_type("string", button);
            Rsed.throw_if_not_type("boolean", isDown);

            if (Rsed.player.is_playing())
            {
                return;
            }

            if (isDown)
            {
                mouseState.buttons[button].isDown = true;
                mouseState.buttons[button].modifiers = (()=>
                {
                    return modifierKeys.filter(modKey=>this.key_down(modKey));
                })();
            }
            else
            {
                mouseState.buttons[button].isDown = false;
                mouseState.buttons[button].modifiers.length = 0;
            }

            if (!this.mouse_button_down())
            {
                mouseState.grab = null;
            }
            else if (!mouseState.grab)
            {
                mouseState.grab = mouseState.hover;
            }
        },
    };

    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/mouse-picking.js
 *
 * 2019 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Returns an object that can be assigned to an element in the mouse-picking buffer.
//
// The 'type' parameter determines the type of mouse-picking; while the 'args' object
// will be appended as-is to the object returned - it will thus contain the custom
// values that you want to include in this element of the mouse-picking buffer.
//
// The returned object takes the following form:
//
//   {
//       type,
//       ...args,
//   }
//
// Although you could simply create this object in-place rather than by calling this
// function, the function will additionally perform checks on the validity of the
// object prior to returning it - like whether it contains at least the required
// arguments.
//
Rsed.ui.utils.mouse_picking_element = function(type = "", args = {})
{
    Rsed.throw_if_not_type("string", type);
    Rsed.throw_if_not_type("object", args);

    // Verify that the arguments are correct.
    switch (type)
    {
        // An element displayed on the user interface (e.g. the track minimap).
        //
        // Requires the following properties:
        //
        //   uiElementId: A string identifying this UI element.
        //
        case "ui-component":
        {
            Rsed.throw_if_not_type("string", args.componentId);
            break;
        }
        
        // A track-side 3d object.
        //
        // Requires the following properties:
        //
        //   propId: A value identifying the prop's type (e.g. tree, rock, house).
        //   propTrackIdx: The prop's index among all props on the track.
        //
        case "prop":
        {
            Rsed.throw_if_not_type("number", args.propTrackIdx, args.propId);
            break;
        }

        // A ground tile on the 3d track heightmap.
        //
        // Requires the following properties:
        //
        //   groundTileX: Ground tile index on the X axis (so e.g. 127 is the last tile on a 128-tile-wide track).
        //   groundTileY: Ground tile index on the Y axis.
        //     
        case "ground":
        {
            Rsed.throw_if_not_type("number", args.groundTileX, args.groundTileY);
            break;
        }

        default: Rsed.throw("Unrecognized mouse-picking type."); break;
    }

    return {type, ...args};
}
/*
 * Most recent known filename: js/ui/terrain-brush.js
 *
 * 2018, 2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// An interface for editing the current project's terrain.
Rsed.ui.utils.terrainBrush = (function()
{
    // How large of a radius the brush paints with. A value of 0 means one tile.
    let radius = 0;

    // Which terrain texture atlas's texture the brush paints with.
    let textureIdx = 3;

    const publicInterface = {
        // Set to true to have the brush smoothen the terrain heightmap when applied to it.
        smoothening: false,

        // Modify the terrain at the given x,y coordinates with the given brush action.
        apply: function({
            target = "",
            data = 0,
            x = 0,
            y = 0,
        } = {})
        {
            const targetProject = Rsed.$currentProject;

            for (let by = -radius; by <= radius; by++)
            {
                const tileZ = (y + by);
                
                if ((tileZ < 0) || (tileZ >= targetProject.maasto.width)) continue;

                for (let bx = -radius; bx <= radius; bx++)
                {
                    const tileX = (x + bx);

                    if ((tileX < 0) || (tileX >= targetProject.maasto.width)) continue;

                    switch (target)
                    {
                        case "maasto-height":
                        {
                            if (this.smoothening)
                            {
                                if ((tileX < 1) || (tileX >= (targetProject.maasto.width - 1))) continue;
                                if ((tileZ < 1) || (tileZ >= (targetProject.maasto.width - 1))) continue;
    
                                let avgHeight = 0;
                                avgHeight += targetProject.maasto.tile_at(tileX+1, tileZ);
                                avgHeight += targetProject.maasto.tile_at(tileX-1, tileZ);
                                avgHeight += targetProject.maasto.tile_at(tileX,   tileZ+1);
                                avgHeight += targetProject.maasto.tile_at(tileX,   tileZ-1);
                                avgHeight += targetProject.maasto.tile_at(tileX+1, tileZ+1);
                                avgHeight += targetProject.maasto.tile_at(tileX+1, tileZ-1);
                                avgHeight += targetProject.maasto.tile_at(tileX-1, tileZ+1);
                                avgHeight += targetProject.maasto.tile_at(tileX-1, tileZ-1);
                                avgHeight /= 8;

                                Rsed.ui.utils.assetMutator.user_edit("maasto",{
                                    command: "set-height",
                                    target: {x: tileX, y: tileZ},
                                    data: Math.floor(((avgHeight + targetProject.maasto.tile_at(tileX, tileZ) * 7) / 8)),
                                });
                            }
                            else
                            {
                                Rsed.ui.utils.assetMutator.user_edit("maasto", {
                                    command: "set-height",
                                    target: {x: tileX, y: tileZ},
                                    data: (targetProject.maasto.tile_at(tileX, tileZ) + data),
                                });
                            }

                            break;
                        }

                        case "varimaa-value":
                        {
                            Rsed.ui.utils.assetMutator.user_edit("varimaa", {
                                command: "set-tile",
                                target: {x: tileX, y: tileZ},
                                data: data,
                            });

                            break;
                        }

                        default: Rsed.throw(`Unrecognized terrain brush target "${target}".`);
                    }
                }
            }
        },

        set radius(newRadius)
        {
            Rsed.assert?.((newRadius >= 0), "Attempted to set an invalid brush radius.");
            radius = newRadius;
        },

        get radius()
        {
            return radius;
        },

        set textureIdx(newPalaIdx)
        {
            Rsed.assert?.((newPalaIdx >= 0), "Attempted to set an invalid brush PALA index.");
            textureIdx = newPalaIdx;
        },

        get textureIdx()
        {
            return textureIdx;
        },
    }

    return publicInterface;
})();
/*
 * 2018-2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 * 
 * Provides functionality to manage RallySportED-js's HTML UI.
 * 
 */

"use strict";

Rsed.ui.dom.html = (function()
{
    const el = {
        htmlUi: document.querySelector("#html"),
        buttonBar: document.querySelector("#button-bar"),
        propDropdown: document.querySelector("#prop-dropdown"),
        dataDropdownButton: document.querySelector("#button-bar .button.data"),
        dataDropdown: document.querySelector("#data-dropdown"),
    };
    Rsed.assert?.(
        Object.values(el).every(el=>el instanceof HTMLElement),
        "Malformed HTML."
    );

    const publicInterface = {
        generate_prop_dropdown_list: function(grab)
        {
            const isFinishLine = Rsed.$currentProject.props.name(grab.propId).toLowerCase().startsWith("finish");

            const newPropEls = Rsed.$currentProject.props
                .names()
                .filter(name=>(isFinishLine? name.startsWith("finish") : !name.startsWith("finish")))
                .map(propName=>{
                    const itemEl = document.createElement("div");
                    itemEl.textContent = propName;
                    itemEl.classList.add("item");
                    itemEl.onmouseup = ()=>on_prop_select(propName, grab.propTrackIdx);
                    return itemEl;
                });

            el.propDropdown.replaceChildren(...newPropEls);

            function on_prop_select(propName = "", propTrackIdx = 0)
            {
                window.close_dropdowns();

                Rsed.ui.utils.assetMutator.user_edit("prop", {
                    command: "set-type",
                    target: propTrackIdx,
                    data: Rsed.$currentProject.props.id_for_name(propName),
                });

                return;
            }
        },

        refresh: function()
        {
            const title = (
                `${Rsed.$currentProject.areAllChangesSaved? "" : "*"}\
                 ${Rsed.$currentProject.name.toUpperCase()}`
            );

            Rsed.iframeListener.send_message?.("project:name", (
                ((Rsed.$currentProject.areAllChangesSaved? "" : "*") + Rsed.$currentProject.name)
            ));

            document.title = `${title} - ${Rsed.appName}`;
            document.querySelector("#project-name .label").textContent = title;

            update_data_dropdown_content();
        },

        set_visible: function(isVisible)
        {
            el.buttonBar.classList[isVisible? "add" : "remove"]("visible");
        },

        toggle_data_dropdown: function()
        {
            el.dataDropdown.classList.toggle("visible");
            el.dataDropdownButton.classList.toggle("opened");
        },

        close_data_dropdown: function()
        {
            el.dataDropdown.classList.remove("visible");
            el.dataDropdownButton.classList.remove("opened");
        },

        display_blue_screen: function(errorMessage = "")
        {
            if ((typeof errorMessage !== "string") ||
                !errorMessage.length)
            {
                errorMessage = "Unspecified error";
            }
            
            publicInterface.set_visible(false);

            document.getElementById("blue-screen").style.display = "flex";
            document.querySelector("#blue-screen #error-description").innerHTML = errorMessage;
        },
    };

    return publicInterface;

    function update_data_dropdown_content()
    {
        const dataTypes = [
            {type: "maasto", label: `MAASTO`},
            {type: "Varimaa", label: `VARIMAA`},
            {type: "Palat", label: `PALAT`},
            {type: "Text", label: "TEXT1"},
            {type: "Anims", label: "ANIMS", warning: "Importing this data type can't be undone."},
            {type: "Kierros", label: "KIERROS", warning: "Importing this data type can't be undone."},
        ];

        const els = dataTypes.reduce((html, dataType)=>{
            const warningEl = (dataType.warning? "&#9888;" : "");

            return html + `
                <tr>
                    <td>
                        <strong title="${dataType.warning? dataType.warning : ''}">
                            ${dataType.label}
                        <strong>
                        <sup>${warningEl}</sup>
                    </td>
                    <td>
                        <label class="button">
                            Import...
                            <input
                                style="display: none;"
                                type="file"
                                onchange="Rsed.ui.utils.assetMutator.user_edit('${dataType.type.toLowerCase()}', {command: 'import', file: event.target.files[0]})"
                            >
                        </label>
                        <div
                            class="button"
                            onclick="Rsed.$currentProject.download_asset_file('${dataType.type.toLowerCase()}')"
                        >
                            Export
                        </div>
                    </td>
                </tr>
            `;
        }, "");

        el.dataDropdown.innerHTML = `
            <table>
                <tbody>
                    ${els}
                </tbody>
            </table>
        `;

        return;
    }
})();
/*
 * Most recent known filename: js/ui/cursor-handler.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.dom.cursorHandler = (function()
{
    let currentCursor = undefined;

    const cursors = {
        arrow: "./assets/img/cursors/rsed-cursor-arrow.png",
        openHand: "./assets/img/cursors/rsed-cursor-openhand.png",
        openHand2: "./assets/img/cursors/rsed-cursor-openhand2.png",
        fingerHand: "./assets/img/cursors/rsed-cursor-fingerhand.png",
        closedHand: "./assets/img/cursors/rsed-cursor-closedhand.png",
        pencilSmooth: "./assets/img/cursors/rsed-cursor-pencil-smooth.png",
        blocked: "./assets/img/cursors/rsed-cursor-blocked.png",
        eyedropper: "./assets/img/cursors/rsed-cursor-eyedropper.png",
        pencil: "./assets/img/cursors/rsed-cursor-pencil.png",
        default: undefined,
    };

    cursors.default = cursors.arrow;

    // Pre-load the cursor images' data so they'll be available immediately
    // when required.
    const cursorImages = Object.keys(cursors).map(c=>{
        const image = new Image();
        image.src = cursors[c];
        return image;
    });

    const publicInterface = {
        cursors: Object.freeze(cursors),

        set_cursor: function(cursor = cursors.default)
        {
            if (cursor === null)
            {
                document.body.style.cursor = "none";
            }
            else
            {
                cursor = (cursor || cursors.default);

                if (currentCursor === cursor)
                {
                    return;
                }

                /// TODO: Chrome 86 (haven't tested other versions) seems to have some
                /// trouble with setting the cursor in this way. Seems the image isn't
                /// cached (so a new network request is fired every time the cursor
                /// changes), and there may be some flickering when displaying it.
                document.body.style.cursor = `url(${cursor}), auto`;
            }

            currentCursor = cursor;

            return;
        }
    };

    publicInterface.set_cursor(cursors.default);

    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/window.js
 *
 * 2018-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 * Provides logic for dealing with the host HTML page.
 *
 */

"use strict";

window.onhashchange = function()
{
    window.location.reload();
    
    return;
}

window.onblur = function()
{
    Rsed.ui.utils.inputState.reset_keys();

    return;
}

function handle_rallysported_error(errorMessage = "")
{
    if (Rsed)
    {
        if (!Rsed.core)
        {
            Rsed.ui.dom.popup_notification(`${errorMessage}`, {
                notificationType: "fatal",
                timeoutMs: 0,
            });
        }
        else
        {
            Rsed.core.panic(errorMessage);
        }
    }

    return;
}

window.onerror = function(error) {
    handle_rallysported_error(error);
};

window.onunhandledrejection = function(error) {
    handle_rallysported_error(error.reason.message);
};

window.onbeforeunload = function(event)
{
    if (!Rsed.$currentProject.areAllChangesSaved)
    {
        event.preventDefault();

        // Note: We just need to return a string, any string - modern browsers won't display it
        // regardless.
        return "Leave and discard unsaved changes?";
    }
}

// Parses any address bar parameters, then launches RallySportED.
window.onload = function(event)
{
    if (Rsed.browserMetadata.has_url_param("w95")) {
        document.body.classList.add("w95");
        window.addEventListener("message", Rsed.iframeListener.listen, false);
    }

    // The app doesn't need to be run if we're just testing its units.
    if (Rsed.unitTestRun) return;

    const rsedStartupArgs = Rsed.core.default_startup_args();
    const contentId = rsedStartupArgs.project.contentId = (window.location.hash || "#4").substring(1).toLowerCase();

    if (contentId.match(/^[0-9]$/))
    {
        rsedStartupArgs.project.dataLocality = "server-rsed";
    }
    else if (
        (contentId.length >= 1) &&
        (contentId.length <= 8)
    ){
        rsedStartupArgs.project.dataLocality = "server-github";
    }
    else
    {
        Rsed.throw("Malformed startup options.");
    }
    
    if (Rsed.browserMetadata.has_url_param("play"))
    {
        Rsed.player.runOnStartup = Rsed.browserMetadata.has_url_param("play");
    }

    window.history.replaceState(null, null, `${window.location.origin}${window.location.pathname}#${contentId}`);

    Rsed.core.start(rsedStartupArgs);

    return;
}

window.close_dropdowns = function()
{
    if (!Rsed?.core)
    {
        return;
    }

    document.querySelectorAll(".dropdown-menu").forEach(menu=>menu.classList.remove("show"));
    Rsed.ui.dom.html.close_data_dropdown();
    Rsed.visual.canvas.domElement.style.pointerEvents = "";
    Rsed.ui.utils.inputState.set_is_prop_context_menu_open(false);

    return;
}

// Right-click menu for track props.
window.oncontextmenu = function(event)
{
    if (!Rsed?.core)
    {
        return;
    }

    if (Rsed.ui.utils.inputState.is_prop_context_menu_open())
    {
        window.close_dropdowns();
        event.preventDefault();
        return;
    }

    if (event.target === document.getElementById("prop-dropdown"))
    {
        event.preventDefault();
        return;
    }

    // Only handle clicks that occur over RallySportED's canvas.
    if (event.target.id !== Rsed.visual.canvas.domElementID)
    {
        return;
    }

    // If we're already holding onto a prop.
    if (Rsed.ui.utils.inputState.left_mouse_button_down()) 
    {
        event.preventDefault();
        return;
    }

    // Only handle clicks that occur over props.
    if (
        (Rsed.ui.utils.inputState.current_mouse_grab()?.type !== "prop") ||
        (Rsed.ui.utils.inputState.current_mouse_hover()?.type !== "prop")
    ){
        event.preventDefault();
        return;
    }

    event.preventDefault();

    // Display a right-click menu for changing the type of the prop under the cursor.
    {
        Rsed.ui.dom.html.generate_prop_dropdown_list(Rsed.ui.utils.inputState.current_mouse_grab());
        
        setTimeout(()=>{ // Wait until the dropdown's DOM element has updated its height.
            const mousePos = {x:event.clientX, y:event.clientY};
            const propDropdown = document.getElementById("prop-dropdown");
            const dropdownHeight = propDropdown.offsetHeight;
            const dropdownWidth = propDropdown.offsetWidth;
            const bottomMargin = 6;
            const sideMargin = 6;

            // Calculate a CSS top/right position that would place the menu's top left
            // corner under the cursor. (We use the 'right' CSS property instead of
            // 'left' so we can ignore the width of the right-hand scrollbar.)
            let top = (mousePos.y + window.scrollY);
            let right = (document.body.clientWidth - mousePos.x - dropdownWidth);

            // Offset the menu's position so it doesn't overflow the page.
            top = (top + Math.min(0, (window.innerHeight - (mousePos.y + dropdownHeight + bottomMargin))));
            right = Math.max(sideMargin, right);

            propDropdown.style.right = `${right}px`;
            propDropdown.style.top = `${top}px`;
            propDropdown.classList.add("show");

            Rsed.visual.canvas.domElement.style.pointerEvents = "none";
        }, 0);

        Rsed.ui.utils.inputState.set_is_prop_context_menu_open(true);
    }

    return;
}

window.onwheel = function(event)
{
    if (!Rsed?.core)
    {
        return;
    }

    // Only handle wheel events that occur over RallySportED's canvas.
    if (event.target.id !== Rsed.visual.canvas.domElementID)
    {
        return;
    }

    Rsed.ui.utils.inputState.append_wheel_scroll(Math.sign(event.deltaY) * 60);

    return;
}

// The program uses onmousedown for primary click processing, but onclick is used here
// to close any open dropdown lists.
window.onclick = function(event)
{
    if (!Rsed?.core)
    {
        return;
    }

    if (Rsed.ui.utils.inputState.is_prop_context_menu_open())
    {
        window.close_dropdowns();
        return;
    }

    return;
}

window.onmousedown = function(event)
{
    if (!Rsed?.core)
    {
        return;
    }

    // Only handle clicks that occur over RallySportED's canvas.
    if (event.target.id !== Rsed.visual.canvas.domElementID)
    {
        return;
    }
    
    switch (event.button)
    {
        case 0: Rsed.ui.utils.inputState.set_mouse_button_down("left", true); break;
        case 1: Rsed.ui.utils.inputState.set_mouse_button_down("middle", true); break;
        case 2: Rsed.ui.utils.inputState.set_mouse_button_down("right", true); break;
        default: break;
    }

    return;
}

window.onmouseup = function(event)
{
    if (!Rsed?.core)
    {
        return;
    }

    // Only handle clicks that occur over RallySportED's canvas.
    if (event.target.id !== Rsed.visual.canvas.domElementID)
    {
        return;
    }

    switch (event.button)
    {
        case 0: Rsed.ui.utils.inputState.set_mouse_button_down("left", false); break;
        case 1: Rsed.ui.utils.inputState.set_mouse_button_down("middle", false); break;
        case 2: Rsed.ui.utils.inputState.set_mouse_button_down("right", false); break;
        default: break;
    }

    return;
}

window.onmousemove = function(event)
{
    if (!Rsed?.core || (event.target !== Rsed.visual.canvas.domElement))
    {
        return;
    }

    const mouseX = (event.clientX - event.target.getBoundingClientRect().left);
    const mouseY = (event.clientY - event.target.getBoundingClientRect().top);
    Rsed.ui.utils.inputState.set_mouse_pos(mouseX, mouseY);

    return;
}

window.onkeydown = function(event)
{
    if (!Rsed?.core)
    {
        return;
    }
    
    // For keys used by RallySportED to which the browser also coincidentally responds,
    // prevent the browser from doing so.
    switch (event.key)
    {
        case "s": // For Ctrl+S.
        case "Tab":
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case " ": event.preventDefault(); break;
        default: break;
    }

    if (!event.repeat) Rsed.ui.utils.inputState.set_key_down(event.key, true);

    return;
}

window.onkeyup = function(event)
{
    if (!Rsed?.core)
    {
        return;
    }

    Rsed.ui.utils.inputState.set_key_down(event.key, false);

    return;
}

// Gets called when something is dropped onto RallySportED's render canvas. We expect
// the drop to be a zip file containing the files of a RallySportED project for us to
// load up. If it's not, we'll ignore the drop.
window.drop_handler = function(event)
{
    // Don't let the browser handle the drop.
    event.preventDefault();
    
    if (
        !Rsed?.core ||
        Rsed.player.is_playing()
    ){
        return;
    }

    // See if the drop delivers a zip file.
    const zipFile = Array.from(event.dataTransfer.items, (item)=>item.getAsFile())
        .filter(file=>(file != null))
        .filter(file=>(file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase() === "zip"))?.[0]

    if (!zipFile)
    {
        Rsed.log("The drop contained no RallySportED zip files. Ignoring it.");
        return;
    }

    // Launch RallySportED-js with the dropped-in project's data.
    Rsed.core.start({
        project: {
            dataLocality: "client",
            contentId: zipFile,
        },
    });
    
    return;
}
/*
 * Most recent known filename: js/ui/font.js
 *
 * 2018-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.canvas.font = (function()
{
    // Shorthands for colors.
    const X = Rsed.visual.palette.BLACK;
    const _ = 0;

    const charset = {
        " ": c([[_]]),

        "!": c([[X],
                [X],
                [X],
                [_],
                [X]]),

        "?": c([[X,X,_],
                [_,_,X],
                [_,X,_],
                [_,_,_],
                [_,X,_]]),

        "\"": c([[_,X,_,X],
                 [_,X,_,X],
                 [X,_,X,_]]),

        "#": c([[_,X,_,X,_],
                [X,X,X,X,X],
                [_,X,_,X,_],
                [X,X,X,X,X],
                [_,X,_,X,_]]),

        "(": c([[_,X],
                [X,_],
                [X,_],
                [X,_],
                [_,X]]),


        ")": c([[X,_],
                [_,X],
                [_,X],
                [_,X],
                [X,_]]),

        "*": c([[X,_,X],
                [_,X,_],
                [X,_,X]], {y: 1}),

        "/": c([[_,_,X],
                [_,_,X],
                [_,X,_],
                [X,_,_],
                [X,_,_]]),

        "+": c([[_,X,_],
                [X,X,X],
                [_,X,_]], {y: 1}),

        "-": c([[X,X,X]], {y: 2}),

        ".": c([[X]], {y: 4}),

        ",": c([[_,X],
                [X,_]], {y: 3}),

        ":": c([[X],
                [_],
                [X]], {y: 1}),

        ";": c([[_,X],
                [_,_],
                [_,X],
                [X,_]], {y: 1}),

        "<": c([[_,X],
                [X,_],
                [_,X]], {y: 1}),

        ">": c([[X,_],
                [_,X],
                [X,_]], {y: 1}),

        "=": c([[X,X,X],
                [_,_,_],
                [X,X,X]], {y: 1}),

        "_": c([[X,X,X]], {y: 3}),

        "0": c([[_,X,_],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [_,X,_]]),

        "1": c([[_,_,X],
                [_,X,X],
                [_,_,X],
                [_,_,X],
                [_,_,X]], {x: -1}),

        "2": c([[_,X,_],
                [X,_,X],
                [_,_,X],
                [_,X,_],
                [X,X,X]]),

        "3": c([[X,X,_],
                [_,_,X],
                [_,X,_],
                [_,_,X],
                [X,X,_]]),

        "4": c([[_,_,X],
                [_,X,X],
                [X,_,X],
                [X,X,X],
                [_,_,X]]),

        "5": c([[_,X,X],
                [X,_,_],
                [X,X,_],
                [_,_,X],
                [X,X,_]]),

        "6": c([[_,X,_],
                [X,_,_],
                [X,X,_],
                [X,_,X],
                [_,X,_]]),

        "7": c([[X,X,X],
                [_,_,X],
                [_,X,_],
                [_,X,_],
                [_,X,_]]),

        "8": c([[_,X,_],
                [X,_,X],
                [_,X,_],
                [X,_,X],
                [_,X,_]]),

        "9": c([[_,X,_],
                [X,_,X],
                [_,X,X],
                [_,_,X],
                [_,X,_]]),

        "A": c([[_,X,_],
                [X,_,X],
                [X,X,X],
                [X,_,X],
                [X,_,X]]),

        "B": c([[X,X,_],
                [X,_,X],
                [X,X,_],
                [X,_,X],
                [X,X,_]]),

        "C": c([[_,X,X],
                [X,_,_],
                [X,_,_],
                [X,_,_],
                [_,X,X]]),

        "D": c([[X,X,_],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [X,X,_]]),

        "E": c([[_,X,X],
                [X,_,_],
                [X,X,X],
                [X,_,_],
                [_,X,X]]),

        "F": c([[_,X,X],
                [X,_,_],
                [X,X,_],
                [X,_,_],
                [X,_,_]]),

        "G": c([[_,X,X],
                [X,_,_],
                [X,_,X],
                [X,_,X],
                [_,X,X]]),

        "H": c([[X,_,X],
                [X,_,X],
                [X,X,X],
                [X,_,X],
                [X,_,X]]),

        "I": c([[X,X,X],
                [_,X,_],
                [_,X,_],
                [_,X,_],
                [X,X,X]]),

        "J": c([[_,X,X],
                [_,_,X],
                [_,_,X],
                [X,_,X],
                [_,X,_]]),

        "K": c([[X,_,X],
                [X,_,X],
                [X,X,_],
                [X,_,X],
                [X,_,X]]),

        "L": c([[X,_,_],
                [X,_,_],
                [X,_,_],
                [X,_,_],
                [_,X,X]]),

        "M": c([[_,X,_,X,_],
                [X,_,X,_,X],
                [X,_,X,_,X],
                [X,_,X,_,X],
                [X,_,X,_,X]]),

        "N": c([[X,X,_],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [X,_,X]]),

        "O": c([[_,X,X],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [X,X,_]]),

        "P": c([[X,X,_],
                [X,_,X],
                [X,X,_],
                [X,_,_],
                [X,_,_]]),

        "Q": c([[_,X,_],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [_,X,X],
                [_,_,X]]),

        "R": c([[X,X,_],
                [X,_,X],
                [X,X,_],
                [X,_,X],
                [X,_,X]]),

        "S": c([[_,X,X],
                [X,_,_],
                [_,X,_],
                [_,_,X],
                [X,X,_]]),

        "T": c([[X,X,X],
                [_,X,_],
                [_,X,_],
                [_,X,_],
                [_,X,_]]),

        "U": c([[X,_,X],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [_,X,X]]),

        "V": c([[X,_,X],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [_,X,_]]),

        "W": c([[X,_,_,_,X],
                [X,_,X,_,X],
                [X,_,X,_,X],
                [X,_,X,_,X],
                [_,X,_,X,_]]),

        "X": c([[X,_,X],
                [X,_,X],
                [_,X,_],
                [X,_,X],
                [X,_,X]]),

        "Y": c([[X,_,X],
                [X,_,X],
                [_,X,_],
                [_,X,_],
                [_,X,_]]),

        "Z": c([[X,X,X],
                [_,_,X],
                [_,X,_],
                [X,_,_],
                [X,X,X]]),

        "unknown": c([[X,_,X,_],
                      [_,X,_,X],
                      [X,_,X,_],
                      [_,X,_,X],
                      [X,_,X,_]]),
    };

    // Convert each charset symbol into a texture for the 3D renderer.
    for (const charsetKey of Object.keys(charset))
    {
        const symbol = charset[charsetKey];
        const indices = new Array(symbol.width * symbol.height);

        let idx = 0;
        for (let y = 0; y < symbol.height; y++)
        {
            for (let x = 0; x < symbol.width; x++)
            {
                indices[idx++] = symbol.pixel_at(x, (symbol.height - y - 1));
            }
        }

        symbol.texture = Rsed.visual.texture({
            indices,
            width: symbol.width,
            height: symbol.height,
        });
    }

    const publicInterface = {
        nativeHeight: 5,

        character: function(ch = "?")
        {
            return (charset[ch] || charset["unknown"]);
        },

        pixel_width: function(string = "A", characterSpacing = 1)
        {
            Rsed.throw_if_not_type("string", string);
            Rsed.throw_if(!string.length);

            const combinedCharacterWidth = Array.from(string).reduce((width, ch)=>{
                const symbol = publicInterface.character(ch);
                return (width + symbol.width + symbol.offsetX);
            }, 0);

            return (combinedCharacterWidth + (characterSpacing * (string.length - 1)));
        }
    };

    return publicInterface;

    // Creates and returns a new character object.
    function c(pixels = [[],[],], options = {})
    {
        Rsed.throw_if_not_type("array", pixels);

        options = {
            ...{
                x: 0,
                y: 0,
            },
            ...options
        };

        const width = pixels[0].length;
        const height = pixels.length;

        return {
            width,
            height,
            offsetX: options.x,
            offsetY: options.y,

            pixel_at: function(x = 0, y = 0)
            {
                return (pixels[y][x] || 0);
            },
        };
    }
})();
/*
 * Most recent known filename: js/ui/component.js
 *
 * 2020-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A base implementation for a UI component.
Rsed.ui.canvas.component = function({
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const publicInterface = {
        // A string that uniquely identifies this component from other components.
        id: Object.freeze(Rsed.generate_uuid4()),

        // Updates the component's internal state (e.g. to respond to user input).
        update: function()
        {
            let grab, hover;

            if (grab = this.is_grabbed())
            {
                on_grab(grab);
            }
            else if (hover = this.is_hovered())
            {
                on_hover(hover);
            }

            return;
        },

        // If the mouse cursor is currently grabbing this component, returns the grab
        // information; otherwise null is returned.
        is_grabbed: function()
        {
            const grab = Rsed.ui.utils.inputState.current_mouse_grab();

            if (grab?.componentId === this.id)
            {
                return grab;
            }
            else
            {
                return null;
            }
        },

        // If the mouse cursor is currently hovering over this component, returns the
        // hover information; otherwise null is returned.
        is_hovered: function()
        {
            const hover = Rsed.ui.utils.inputState.current_mouse_hover();

            if (hover?.componentId === this.id)
            {
                return hover;
            }
            else
            {
                return null;
            }
        },
    };

    return publicInterface;
}
/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

Rsed.ui.canvas.component.$box_with_shadow = function({
    x,
    y,
    width,
    height,
    material = {}
} = {})
{
    return [
        // Shadow.
        ...Rsed.ui.canvas.component.$box({
            x,
            y,
            width,
            height,
            material: {
                isInScreenSpace: true,
                color: Rsed.visual.palette.HOTPINK,
                ...material,
            }
        }),
        // Box.
        ...Rsed.ui.canvas.component.$box({
            x: x-1,
            y: y-1,
            width,
            height,
            material: {
                isInScreenSpace: true,
                color: Rsed.visual.palette.YELLOW,
                ...material,
            }
        })
    ]
}

Rsed.ui.canvas.component.$box = function({
    x,
    y,
    width,
    height,
    material = {}
} = {})
{
    return [
        Rsed.ui.canvas.component.$line({
            x1: x,
            y1: y,
            x2: x+width,
            y2: y,
            material,
        }),
        Rsed.ui.canvas.component.$line({
            x1: x+width,
            y1: y,
            x2: x+width,
            y2: y+height,
            material,
        }),
        Rsed.ui.canvas.component.$line({
            x1: x+width,
            y1: y+height,
            x2: x,
            y2: y+height,
            material,
        }),
        Rsed.ui.canvas.component.$line({
            x1: x,
            y1: y+height,
            x2: x,
            y2: y,
            material,
        }),
    ];
}

Rsed.ui.canvas.component.$line = function({
    x1,
    y1,
    x2,
    y2,
    material = {}
} = {})
{
    return Rngon.ngon([
        Rngon.vertex(x1, y1),
        Rngon.vertex(x2, y2)], {
            isInScreenSpace: true,
            ...material,
        }
    );
}
/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.canvas.component.editorSelector = function({
    on_grab = undefined
} = {})
{
    const self = Rsed.ui.canvas.component({on_grab});

    const terrainEditorLabel = Rsed.ui.canvas.component.label({
        on_grab: function()
        {
            Rsed.$currentScene = "terrain-editor";
        },
    });

    const textureEditorLabel = Rsed.ui.canvas.component.label({
        on_grab: function()
        {
            Rsed.$currentScene = "texture-editor";
        },
    });

    const tilemapEditorLabel = Rsed.ui.canvas.component.label({
        on_grab: function()
        {
            Rsed.$currentScene = "tilemap-editor";
        },
    });

    return function(x = 0, y = 0)
    {
        Rsed.assert?.(
            ((typeof x === "number") &&
             (typeof y === "number")),
            "Expected numbers."
        );

        self.update();

        const labelVerticalSpacing = (Rsed.ui.canvas.font.nativeHeight + 4);

        const isTerrain = (Rsed.$currentScene === Rsed.scenes["terrain-editor"]);
        const isTilemap = (Rsed.$currentScene === Rsed.scenes["tilemap-editor"]);
        const isTexture = (Rsed.$currentScene === Rsed.scenes["texture-editor"]);

        return [
            terrainEditorLabel("Terrain", (x - isTerrain), (y - isTerrain), {
                plain: !isTerrain,
                bgColor: (
                    isTerrain
                        ? Rsed.visual.palette.YELLOW
                        : Rsed.visual.palette.HOTPINK
                ),
            }),
            tilemapEditorLabel("Tilemap", (x - isTilemap), (y + labelVerticalSpacing - isTilemap), {
                plain: !isTilemap,
                bgColor: (
                    isTilemap
                        ? Rsed.visual.palette.YELLOW
                        : Rsed.visual.palette.HOTPINK
                ),
            }),
            textureEditorLabel("Textures", (x - isTexture), (y + (labelVerticalSpacing * 2) - isTexture), {
                plain: !isTexture,
                bgColor: (
                    isTexture
                        ? Rsed.visual.palette.YELLOW
                        : Rsed.visual.palette.HOTPINK
                ),
            }),
        ];
    };
}
/*
 * 2020-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A UI component that displays the currently-selected PALA texture. Clicking
// on the component opens/closes the scene's PALAT pane.
Rsed.ui.canvas.component.activePala = function({
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const self = Rsed.ui.canvas.component({on_grab, on_hover});

    return function(x = 0, y = 0)
    {
        Rsed.assert?.(
            ((typeof x === "number") &&
             (typeof y === "number")),
            "Expected numbers."
        );

        self.update();
        
        const sideLen = 32;
        const currentPalaIdx = Rsed.ui.utils.terrainBrush.textureIdx;
        const billboardIdx = Rsed.$currentProject.palat.billboard_idx(currentPalaIdx);
        const palaTexture = Rsed.$currentProject.palat.texture[currentPalaIdx];
        const billboardTexture = (billboardIdx === null)
            ? undefined
            : Rsed.$currentProject.palat.texture[billboardIdx];

        // Note: We show the billboard texture only if this PALA is associated with one.
        const ngons = [
            ngon(palaTexture),
            ngon(billboardTexture),
        ].slice(0, (1 + Boolean(billboardTexture)));

        {
            const labelString = `Pen: ${Rsed.ui.utils.terrainBrush.radius + 1}*`;
            const labelWidth = Rsed.ui.canvas.font.pixel_width(labelString);
            const brushSizeLabel = Rsed.ui.canvas.component.label()(labelString, (x - sideLen - labelWidth + 10), y);
            ngons.push(...brushSizeLabel.ngons);
        }

        return Rngon.mesh(ngons);

        function ngon(texture)
        {
            return Rngon.ngon([
                Rngon.vertex(x - sideLen, y),
                Rngon.vertex(x          , y),
                Rngon.vertex(x          , y + sideLen),
                Rngon.vertex(x - sideLen, y + sideLen)], {
                    texture,
                    isInScreenSpace: true,
                    $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                        componentId: self.id,
                        cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                    }),
                }
            );
        }
    };
}
/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.canvas.component.palaSelector = function({
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const self = Rsed.ui.canvas.component({on_grab, on_hover});

    return function(x = 0, y = 0)
    {
        Rsed.assert?.(
            ((typeof x === "number") &&
             (typeof y === "number")),
            "Expected numbers."
        );

        self.update();
        
        const sideLen = 32;
        const palaTexture = Rsed.$currentProject.palat.texture[3];

        const ngons = [ngon(palaTexture)];

        {
            const labelString = `PALAT`;
            const labelWidth = Rsed.ui.canvas.font.pixel_width(labelString);
            const brushSizeLabel = Rsed.ui.canvas.component.label()(labelString, ~~(x - sideLen/2 - labelWidth/2), y + ~~(sideLen / 2)- Rsed.ui.canvas.font.nativeHeight + 2);
            ngons.push(...brushSizeLabel.ngons);
        }

        return Rngon.mesh(ngons);

        function ngon(texture)
        {
            return Rngon.ngon([
                Rngon.vertex(x - sideLen, y),
                Rngon.vertex(x          , y),
                Rngon.vertex(x          , y + sideLen),
                Rngon.vertex(x - sideLen, y + sideLen)], {
                    texture,
                    isInScreenSpace: true,
                    $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                        componentId: self.id,
                        cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                    }),
                }
            );
        }
    };
}
/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.canvas.component.textSelector = function({
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const self = Rsed.ui.canvas.component({on_grab, on_hover});

    return function(x = 0, y = 0)
    {
        Rsed.assert?.(
            ((typeof x === "number") &&
             (typeof y === "number")),
            "Expected numbers."
        );

        self.update();
        
        const sideLen = 32;
        const ngons = [ngon(Rsed.$currentProject.props.texture[16])];

        {
            const labelString = `TEXT`;
            const labelWidth = Rsed.ui.canvas.font.pixel_width(labelString);
            const brushSizeLabel = Rsed.ui.canvas.component.label()(labelString, ~~(x - sideLen/2 - labelWidth/2), y + ~~(sideLen / 2)- Rsed.ui.canvas.font.nativeHeight + 2);
            ngons.push(...brushSizeLabel.ngons);
        }

        return Rngon.mesh(ngons);

        function ngon(texture)
        {
            return Rngon.ngon([
                Rngon.vertex(x - sideLen, y),
                Rngon.vertex(x          , y),
                Rngon.vertex(x          , y + sideLen),
                Rngon.vertex(x - sideLen, y + sideLen)], {
                    texture,
                    isInScreenSpace: true,
                    $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                        componentId: self.id,
                        cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                    }),
                }
            );
        }
    };
}
/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.canvas.component.animSelector = function({
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const self = Rsed.ui.canvas.component({on_grab, on_hover});

    return function(x = 0, y = 0)
    {
        Rsed.assert?.(
            ((typeof x === "number") &&
             (typeof y === "number")),
            "Expected numbers."
        );

        self.update();
        
        const sideLen = 32;
        const animTexture = Rsed.$currentProject.anims.texture[35];
        const ngons = [ngon(animTexture)];

        {
            const labelString = `ANIMS`;
            const labelWidth = Rsed.ui.canvas.font.pixel_width(labelString);
            const brushSizeLabel = Rsed.ui.canvas.component.label()(labelString, ~~(x - sideLen/2 - labelWidth/2), y + ~~(sideLen / 2)- Rsed.ui.canvas.font.nativeHeight + 2);
            ngons.push(...brushSizeLabel.ngons);
        }

        return Rngon.mesh(ngons);

        function ngon(texture)
        {
            return Rngon.ngon([
                Rngon.vertex(x - sideLen, y),
                Rngon.vertex(x          , y),
                Rngon.vertex(x          , y + sideLen),
                Rngon.vertex(x - sideLen, y + sideLen)], {
                    texture,
                    isInScreenSpace: true,
                    $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                        componentId: self.id,
                        cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                    }),
                }
            );
        }
    };
}
/*
 * 2020-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A UI component that displays the current renderer frame rate (FPS).
Rsed.ui.canvas.component.fpsIndicator = function()
{
    const self = Rsed.ui.canvas.component();

    return function(x = 0, y = 0)
    {
        Rsed.assert?.(
            ((typeof x === "number") &&
             (typeof y === "number")),
            "Expected numbers."
        );

        self.update();

        return Rsed.ui.canvas.component.label()(`FPS: ${Rsed.core.ticksPerSecond}`, x, y);
    };
}
/*
 * 2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

/*
TODO:
    - Give the graph a fixed height rather than depending on the 'max' parameter.
    - Implement the 'min' parameter. Currently it's ignored.
*/

// Displays a graph of a given value's evolution over time.
Rsed.ui.canvas.component.valueGraph = function({
    title = "Untitled",

    // If true, only the graph's label will be drawn and the graph itself will be hidden.
    labelOnly = false,
    
    // Value at the bottom of the graph.
    min = 0,

    // Value at the top of the graph.
    max = 1,

    // Which values are considered high and low (for color-coding purposes).
    high = max,
    low = min,
    
    // Number of samples of the value to graph.
    sampleSize = 55
} = {})
{
    const self = Rsed.ui.canvas.component();
    const data = [];
    
    const colorLow = Rsed.visual.palette.GREEN;
    const colorHigh = Rsed.visual.palette.RED;
    const colorNormal = Rsed.visual.palette.YELLOW;
    const colorBackground = Rsed.visual.palette.BLACK;
    const colorFrame = Rsed.visual.palette.DIMGRAY;

    return function(x = 0, y = 0, value)
    {
        Rsed.assert?.(
            ((typeof x === "number") &&
             (typeof y === "number") &&
             (typeof value === "number")),
            "Expected numbers."
        );

        data.push(value) > sampleSize? data.shift() : 1;

        // Generate the graph.
        const ngons = [];
        {
            const label = Rsed.ui.canvas.component.label()(
                `${title}: ${Math.round(data.reduce((sum, val)=>(sum + val)) / data.length)}`,
                x,
                y
            );

            if (!labelOnly)
            {
                y += (Rsed.ui.canvas.font.nativeHeight + 2);

                ngons.push(
                    Rngon.ngon([
                        Rngon.vertex((x - 1), y),
                        Rngon.vertex((x + sampleSize), y),
                        Rngon.vertex((x + sampleSize), (y + max + 1)),
                        Rngon.vertex((x - 1), (y + max + 1))], {
                            isInScreenSpace: true,
                            hasWireframe: true,
                            color: colorBackground,
                            wireframeColor: colorFrame,
                        }
                    )
                );

                ngons.push(
                    ...data.map((val, idx)=>Rngon.ngon([
                        Rngon.vertex((x + idx), y + max),
                        Rngon.vertex((x + idx), (y + max - val))], {
                            isInScreenSpace: true,
                            color: (
                                (val >= high)
                                ? colorHigh
                                : (val <= low)
                                ? colorLow
                                : colorNormal
                            ),
                        },
                    ))
                );
            }

            ngons.push(...label.ngons);
        }

        self.update();

        return Rngon.mesh(ngons);
    };
}
/*
 * 2020-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 * A UI component that displays information about the terrain under the
 * mouse cursor. This information might be, for instance, the height of
 * the terrain or the name of a prop. To be used with the terrain editor.
 * 
 */

"use strict";

Rsed.ui.canvas.component.terrainHoverInfo = function()
{
    const self = Rsed.ui.canvas.component();

    return function(x = 0, y = 0)
    {
        Rsed.assert?.(
            (typeof x === "number") &&
            (typeof y === "number"),
            "Expected numbers."
        );

        self.update();
        
        const mouseHover = Rsed.ui.utils.inputState.current_mouse_hover();
        const mouseGrab = Rsed.ui.utils.inputState.current_mouse_grab();
        const strings = [];

        if (
            (mouseHover?.type === "prop") ||
            (mouseGrab?.type === "prop")
        ){
            // Prefer mouseGrab over mouseHover, as the prop follows the cursor lazily while
            // grabbing, so hover might be over the background.
            const mouse = (mouseGrab && (mouseGrab.type === "prop"))
                ? mouseGrab
                : mouseHover;

            strings.push(`Prop: "${Rsed.$currentProject.props.name(mouse.propId)}"`);
        }
        else if (mouseHover?.type === "ground")
        {
            const tileX = mouseHover.groundTileX;
            const tileY = mouseHover.groundTileY;
            const height = Rsed.$currentProject.maasto.tile_at(tileX, tileY);

            strings.push(
                `Pala: ${Rsed.$currentProject.varimaa.tile_at(tileX, tileY)}`,
                `X,Y: ${tileX},${tileY}`,
                `Height: ${height < 0? "-" : "+"}${Math.abs(height)}`,
            );
        }

        if (!strings.length)
        {
            strings.push("");
        }

        return strings.reverse().map((string, idx)=>{
            return Rsed.ui.canvas.component.label()(string, x, y - idx * (Rsed.ui.canvas.font.nativeHeight+4));
        });
    };
}
/*
 * 2018-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A UI component that displays the current project's terrain texture atlas as thumbnails.
// The user can click on the thumbnails to select which texture to paint the ground with.
Rsed.ui.canvas.component.palatPane = function({
    indicateSelection = true,
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const self = Rsed.ui.canvas.component({on_grab, on_hover});
    const thumbnailWidth = 8;
    const thumbnailHeight = 8;

    return function(offsetX = 0, offsetY = 0)
    {
        Rsed.assert?.(
            ((typeof offsetX === "number") &&
             (typeof offsetY === "number")),
            "Expected numbers."
        );

        self.update();

        const ngons = [];
        const raisedNgons = [];
        const numPalat = Math.min(252, Rsed.$currentProject.palat.texture.length);
        const numPalatPaneCols = 14;
        const numPalatPaneRows = Math.ceil(numPalat / numPalatPaneCols);
        const palatPaneWidth = (numPalatPaneCols * thumbnailWidth);
        const palaPaneHeight = (numPalatPaneRows * thumbnailHeight);
        offsetX -= palatPaneWidth;

        ngons.push(...Rsed.ui.canvas.component.$box({
            x: offsetX,
            y: offsetY,
            width: palatPaneWidth+1, 
            height: palaPaneHeight+1,
            material: {
                color: Rsed.visual.palette.GREEN,
            },
        }));

        offsetX++;
        offsetY++;

        let x = 0;
        let y = 0;
        for (let palaIdx = 0; palaIdx < numPalat; palaIdx++)
        {
            const isCurrentPala = (indicateSelection && (Rsed.ui.utils.terrainBrush.textureIdx == palaIdx));
            const isHovered = (Rsed.ui.utils.inputState.current_mouse_hover()?.palaIdx === palaIdx);
            const palaTexture = Rsed.$currentProject.palat.texture[palaIdx];

            ngons.push(ngon({
                x: (offsetX + (x * thumbnailWidth)),
                y: (offsetY + (y * thumbnailHeight)),
                texture: palaTexture,
                width: thumbnailWidth,
                height: thumbnailHeight,
                material: {
                    $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                        componentId: self.id,
                        cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                        palaIdx: palaIdx,
                    }),
                },
            }));

            if (isHovered)
            {
                const labelString = `${palaIdx}`;
                const labelWidth = Rsed.ui.canvas.font.pixel_width(labelString);
                const baseX = (offsetX + (x * thumbnailWidth));
                const baseY = (offsetY + (y * thumbnailHeight));
                const newNgons = [
                    ...Rsed.ui.canvas.component.label()(labelString, (baseX - labelWidth - 1), (baseY - (thumbnailHeight / 2) - 1)).ngons,
                    ...Rsed.ui.canvas.component.$box_with_shadow({
                        x: baseX,
                        y: baseY,
                        width: thumbnailWidth, 
                        height: thumbnailHeight,
                    }),
                ];

                ngons.push(...newNgons);
                raisedNgons.push(...newNgons);
            }
            else if (isCurrentPala)
            {
                const newNgons = [
                    ...Rsed.ui.canvas.component.$box({
                        x: (offsetX + (x * thumbnailWidth)),
                        y: (offsetY + (y * thumbnailHeight)),
                        width: thumbnailWidth, 
                        height: thumbnailHeight,
                        material: {
                            color: Rsed.visual.palette.HOTPINK,
                        },
                    }),
                ];

                ngons.push(...newNgons);
                raisedNgons.push(...newNgons);
            }

            if (++x >= numPalatPaneCols)
            {
                y++;
                x = 0;
            }
        }

        // Any n-gons we don't want to be occluded by other n-gons are moved to the end
        // of the n-gon list, to be rendered last and so on top of the other n-gons.
        if (raisedNgons)
        {
            for (const ngon of raisedNgons)
            {
                const idx = ngons.indexOf(ngon);
                ngons.splice(idx, 1);
                ngons.push(ngon);
            }
        }

        return Rngon.mesh(ngons);

        function ngon({
            x,
            y,
            texture,
            width,
            height,
            material = {}
        } = {})
        {
            return Rngon.ngon([
                Rngon.vertex(x        , y),
                Rngon.vertex(x + width, y),
                Rngon.vertex(x + width, y + height),
                Rngon.vertex(x        , y + height)], {
                    texture: texture,
                    isInScreenSpace: true,
                    ...material,
                }
            );
        }
    };
}
/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.canvas.component.animsPane = function({
    indicateSelection = true,
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const self = Rsed.ui.canvas.component({on_grab, on_hover});
    const thumbnailWidth = 8;
    const thumbnailHeight = 8;

    return function(offsetX = 0, offsetY = 0)
    {
        Rsed.assert?.(
            ((typeof offsetX === "number") &&
             (typeof offsetY === "number")),
            "Expected numbers."
        );

        self.update();

        const ngons = [];
        const raisedNgons = [];
        const numAnims = 64;
        const numAnimsPaneCols = 16;
        const numAnimsPaneRows = Math.ceil(numAnims / numAnimsPaneCols);
        const animsPaneWidth = (numAnimsPaneCols * thumbnailWidth);
        const animsPaneHeight = (numAnimsPaneRows * thumbnailHeight);
        offsetX -= animsPaneWidth;

        ngons.push(...Rsed.ui.canvas.component.$box({
            x: offsetX,
            y: offsetY,
            width: animsPaneWidth+1, 
            height: animsPaneHeight+1,
            material: {
                color: Rsed.visual.palette.GREEN,
            },
        }));

        offsetX++;
        offsetY++;

        let x = 0;
        let y = 0;
        for (let animIdx = 0; animIdx < numAnims; animIdx++)
        {
            const isCurrentAnim = (indicateSelection && (Rsed.ui.utils.terrainBrush.textureIdx == animIdx));
            const isHovered = (Rsed.ui.utils.inputState.current_mouse_hover()?.animIdx === animIdx);

            ngons.push(ngon({
                x: (offsetX + (x * thumbnailWidth)),
                y: (offsetY + (y * thumbnailHeight)),
                texture: Rsed.$currentProject.anims.texture[animIdx],
                width: thumbnailWidth,
                height: thumbnailHeight,
                material: {
                    $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                        componentId: self.id,
                        cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                        animIdx: animIdx,
                    }),
                },
            }));

            if (isHovered)
            {
                const labelString = `${animIdx}`;
                const labelWidth = Rsed.ui.canvas.font.pixel_width(labelString);
                const baseX = (offsetX + (x * thumbnailWidth));
                const baseY = (offsetY + (y * thumbnailHeight));
                const newNgons = [
                    ...Rsed.ui.canvas.component.label()(labelString, (baseX - labelWidth - 1), (baseY - (thumbnailHeight / 2) - 1)).ngons,
                    ...Rsed.ui.canvas.component.$box_with_shadow({
                        x: baseX,
                        y: baseY,
                        width: thumbnailWidth, 
                        height: thumbnailHeight,
                    }),
                ];

                ngons.push(...newNgons);
                raisedNgons.push(...newNgons);
            }
            else if (isCurrentAnim)
            {
                const newNgons = [
                    ...Rsed.ui.canvas.component.$box({
                        x: (offsetX + (x * thumbnailWidth)),
                        y: (offsetY + (y * thumbnailHeight)),
                        width: thumbnailWidth, 
                        height: thumbnailHeight,
                        material: {
                            color: Rsed.visual.palette.HOTPINK,
                        },
                    }),
                ];

                ngons.push(...newNgons);
                raisedNgons.push(...newNgons);
            }

            if (++x >= numAnimsPaneCols)
            {
                y++;
                x = 0;
            }
        }

        // Any n-gons we don't want to be occluded by other n-gons are moved to the end
        // of the n-gon list, to be rendered last and so on top of the other n-gons.
        if (raisedNgons)
        {
            for (const ngon of raisedNgons)
            {
                const idx = ngons.indexOf(ngon);
                ngons.splice(idx, 1);
                ngons.push(ngon);
            }
        }

        return Rngon.mesh(ngons);

        function ngon({
            x,
            y,
            texture,
            width,
            height,
            material = {}
        } = {})
        {
            return Rngon.ngon([
                Rngon.vertex(x        , y),
                Rngon.vertex(x + width, y),
                Rngon.vertex(x + width, y + height),
                Rngon.vertex(x        , y + height)], {
                    texture: texture,
                    isInScreenSpace: true,
                    ...material,
                }
            );
        }
    };
}
/*
 * 2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A UI component that displays the current project's terrain texture atlas as thumbnails.
// The user can click on the thumbnails to select which texture to paint the ground with.
Rsed.ui.canvas.component.textPane = function({
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const self = Rsed.ui.canvas.component({on_hover});

    return function(offsetX = 0, offsetY = 0)
    {
        Rsed.assert?.(
            ((typeof offsetX === "number") &&
             (typeof offsetY === "number")),
            "Expected numbers."
        );

        const width = 128;
        const height = 156;

        self.update();

        const ngons = [];

        ngons.push(...Rsed.ui.canvas.component.$box({
            x: offsetX - width,
            y: offsetY,
            width: width+1, 
            height: height+1,
            material: {
                color: Rsed.visual.palette.GREEN,
            },
        }));

        offsetX++;
        offsetY++;

        ngons.push(Rngon.ngon([
            Rngon.vertex((offsetX - width),  offsetY),
            Rngon.vertex( offsetX         ,  offsetY),
            Rngon.vertex( offsetX         , (offsetY + height)),
            Rngon.vertex((offsetX - width), (offsetY + height))], {
                texture: Rsed.visual.texture({
                    width,
                    height,
                    indices: Rsed.$currentProject.props.textureAtlas.slice(0, (width * height)),
                }),
                isInScreenSpace: true,
                color: Rsed.visual.palette.DIMGRAY,
                $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                    componentId: self.id,
                    cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                }),
            }
        ));

        const isGrabbingPane = (Rsed.ui.utils.inputState.current_mouse_grab()?.componentId === self.id);
        const mousePos = {
            x: (Rsed.ui.utils.inputState.mouse_pos_scaled_to_render_resolution().x - offsetX + width),
            y: (height - (Rsed.ui.utils.inputState.mouse_pos_scaled_to_render_resolution().y - offsetY) - 1)
        };

        for (const {rect, textureId} of Rsed.$currentProject.props.textureRects)
        {
            if (
                (rect.topLeft.x-3 <= mousePos.x) &&
                (rect.topLeft.x-3 + rect.width >= mousePos.x) &&
                (rect.topLeft.y-1 <= mousePos.y) &&
                (rect.topLeft.y-1 + rect.height >= mousePos.y)
            ){
                if (isGrabbingPane)
                {
                    on_grab({textureId});
                    Rsed.ui.utils.inputState.reset_mouse_grab();
                }

                ngons.push(...Rsed.ui.canvas.component.$box_with_shadow({
                    x: ((offsetX - width + rect.topLeft.x)),
                    y: ((offsetY + (height - rect.topLeft.y - 1) - rect.height) + 1),
                    width: rect.width,
                    height: rect.height,
                }));

                break;
            }
        }

        return Rngon.mesh(ngons);
    };
}
/*
 * 2020-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A UI component that displays a thumbnail of the current project's tilemap. Clicking
// on the thumbnail centers the camera on that position. To be used with the terrain
// editor.
Rsed.ui.canvas.component.terrainMinimap = function({
    camera = Rsed.scenes.$camera2D(),
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const self = Rsed.ui.canvas.component({on_grab, on_hover});

    return function(offsX = 0, offsY = 0)
    {
        Rsed.assert?.(
            ((typeof offsX === "number") &&
             (typeof offsY === "number")),
            "Expected numbers."
        );

        self.update();

        const width = 64;
        const height = 32;
        const xMul = (Rsed.$currentProject.maasto.width / width);
        const yMul = (Rsed.$currentProject.maasto.width / height);

        // Generate the minimap image by iterating over the tilemap (VARIMAA) and
        // grabbing a pixel off each corresponding PALA texture.
        /// TODO: You can pre-generate the image rather than re-generating it each frame.
        const indices = [];
        for (let y = 0; y < height; y++)
        {
            for (let x = 0; x < width; x++)
            {
                const tileX = (x * xMul);
                const tileZ = ((height - y - 1) * yMul);
                const tile = Rsed.$currentProject.varimaa.tile_at(tileX, tileZ);
                const texture = Rsed.$currentProject.palat.texture[tile];
                indices.push(texture?.indices[1] || 0);
            }
        }
        const texture = Rsed.visual.texture({
            indices,
            width,
            height,
        });

        // For drawing a frame around the current camera position.
        const cameraPos = camera.position_floored();
        const maxX = (Rsed.$currentProject.maasto.width - camera.viewportWidth);
        const maxZ = (Rsed.$currentProject.maasto.height - camera.viewportHeight);
        const camX = Math.max(-1, (Math.min(maxX, cameraPos.x) / xMul));
        const camZ = Math.max(-1, (Math.min(maxZ, cameraPos.z) / yMul));
        const frameWidth = ~~((camera.viewportWidth / xMul))-1;
        const frameHeight = ~~((camera.viewportHeight / yMul))-1;
        const baseX = ~~(offsX - width + camX);
        const baseZ = ~~(offsY + camZ);

        return Rngon.mesh([
            // The minimap.
            ngon({
                x: (offsX - width),
                y: offsY,
                texture,
                width: texture.width,
                height: texture.height,
                material: {
                    $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                        componentId: self.id,
                        cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                        topLeft: {x: (offsX - width), y: offsY},
                        scale: {x: xMul, y: yMul},
                    }),
                }
            }),

            // Position indicator.
            ...Rsed.ui.canvas.component.$box_with_shadow({
                x: baseX+1,
                y: baseZ+1,
                width: frameWidth,
                height: frameHeight,
            }),
        ]);

        function ngon({
            x,
            y,
            texture,
            width,
            height,
            material = {}
        } = {})
        {
            return Rngon.ngon([
                Rngon.vertex(x        , y),
                Rngon.vertex(x + width, y),
                Rngon.vertex(x + width, y + height),
                Rngon.vertex(x        , y + height)], {
                    texture: texture,
                    isInScreenSpace: true,
                    ...material,
                }
            );
        }
    }
}
/*
 * 2020-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A UI component that displays a list of clickable color swatches that represents the
// current project's color palette, allowing the user to indicate which color he wants
// (e.g. to paint a texture with).
Rsed.ui.canvas.component.colorSelector = function({
    initialColorIdx = 19,
    on_grab = ()=>{},
    on_hover = ()=>{},
} = {})
{
    const self = Rsed.ui.canvas.component({
        on_grab: function(event)
        {
            currentColorIdx = event.colorIdx;
            on_grab(event);
        },
        on_hover,
    });

    // A swatch of a particular color, clickable by the user to select that color.
    const swatchSideLen = 8;

    // The currently-selected color - an index to the current Rsed.visual.palette
    // palette.
    let currentColorIdx = initialColorIdx;

    const accessor = function(x = 0, y = 0)
    {
        Rsed.assert?.(
            ((typeof x === "number") &&
                (typeof y === "number")),
            "Expected numbers."
        );

        self.update();

        const ngons = [];
        const numSwatchesPerRow = 8;

        // Draw a grid of color swatches.
        for (let i = 0; i < Rsed.constants.paletteSize; i++)
        {
            const offsX = (i % numSwatchesPerRow);
            const offsY = Math.floor(i / numSwatchesPerRow);

            ngons.push(ngon({
                x: (x + (offsX * swatchSideLen)),
                y: (y + (offsY * swatchSideLen)),
                width: swatchSideLen,
                height: swatchSideLen,
                material: {
                    color: i,
                    $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                        componentId: self.id,
                        cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                        colorIdx: i,
                    }),
                }
            }));
        }

        // Draw a large swatch of the currently-selected color.
        {
            const width = 33;
            const height = 32;
            const baseX = (x + (numSwatchesPerRow * swatchSideLen));

            ngons.push(ngon({
                x: baseX,
                y: y,
                width: width,
                height: height,
                material: {
                    color: currentColorIdx,
                },
            }));
        }

        return Rngon.mesh(ngons);

        function ngon({
            x,
            y,
            texture,
            width,
            height,
            material = {}
        } = {})
        {
            return Rngon.ngon([
                Rngon.vertex(x        , y),
                Rngon.vertex(x + width, y),
                Rngon.vertex(x + width, y + height),
                Rngon.vertex(x        , y + height)], {
                    texture: texture,
                    isInScreenSpace: true,
                    ...material,
                }
            );
        }
    };

    // Allows the client code to tell this component to update its selected color index.
    accessor.set_color_idx = function(newIdx = 0)
    {
        Rsed.assert?.(
            (typeof newIdx === "number"),
            "Expected a number."
        );

        currentColorIdx = newIdx;
    }

    return accessor;
}
/*
 * 2020-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 * A UI component that displays a string.
 * 
 */

"use strict";

Rsed.ui.canvas.component.label = function({
    on_grab = undefined
} = {})
{
    const self = Rsed.ui.canvas.component({on_grab});

    const defaultStyle = {
        bgColor: Rsed.visual.palette.YELLOW,
        shadowColor: Rsed.visual.palette.HOTPINK,
        plain: false,
    };

    return function(
        string = "",
        x = 0,
        y = 0,
        style = undefined
    ){
        Rsed.assert?.(
            (typeof string === "string") &&
            (typeof x === "number") &&
            (typeof y === "number"),
            "Invalid arguments."
        );

        style = Object.assign({}, defaultStyle, style);

        self.update();

        if (!string.length)
        {
            return Rngon.mesh([]);
        }

        const ngons = [];
        const letterSpacing = 1;

        // Convert the string's characters into polygons for display.
        let runningXOffs = 0;
        for (const ch of string.split(""))
        {
            const symbol = Rsed.ui.canvas.font.character(ch.toUpperCase());

            ngons.push(ngon({
                x: (x + runningXOffs + symbol.offsetX),
                y: (y + symbol.offsetY),
                width: symbol.width,
                height: symbol.height,
                texture: symbol.texture,
            }));

            runningXOffs += (symbol.width + symbol.offsetX + letterSpacing);
        }

        // Background color.
        ngons.unshift(ngon({
            x: (x - 1),
            y: (y - 1),
            width: (runningXOffs + 1),
            height: (Rsed.ui.canvas.font.nativeHeight + 2),
            material: {
                color: style.bgColor,
            },
        }));

        // Dropshadow.
        if (!style.plain)
        {
            ngons.unshift(ngon({
                x,
                y,
                width: (runningXOffs + 1),
                height: (Rsed.ui.canvas.font.nativeHeight + 2),
                material: {
                    color: style.shadowColor,
                },
            }));
        }

        return Rngon.mesh(ngons);

        function ngon({
            x,
            y,
            texture,
            width,
            height,
            material = {}
        } = {})
        {
            return Rngon.ngon([
                Rngon.vertex(x        , y),
                Rngon.vertex(x + width, y),
                Rngon.vertex(x + width, y + height),
                Rngon.vertex(x        , y + height)], {
                    texture: texture,
                    isInScreenSpace: true,
                    allowAlphaReject: true,
                    ...material,
                    $mousePickId: (
                        on_grab
                            ? Rsed.ui.utils.mouse_picking_element("ui-component", {
                                  componentId: self.id,
                                  cursor: Rsed.ui.dom.cursorHandler.cursors.fingerHand,
                              })
                            : undefined
                    ),
                }
            );
        }
    };
}
/*
 * Most recent known filename: js/scene/scene.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 * 
 */

"use strict";

Rsed.scenes = {};

Rsed.scene = function({
    render = ()=>{},
    process_key_press = ()=>{},
    process_key_release = ()=>{},
} = {})
{
    const publicInterface = {
        render,
        process_key_press,
        process_key_release,
        ...arguments[0]
    };

    Rsed.assert?.(
        ((typeof publicInterface.render === "function") &&
         (typeof publicInterface.process_key_press === "function") &&
         (typeof publicInterface.process_key_release === "function")),
        "One of more required functions are missing."
    );

    return publicInterface;
}
/*
 * Most recent known filename: js/scene/camera-2d.js
 *
 * 2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.scenes.$camera2D = function({
    zoomLevel = 1,
    x = 0,
    y = 0,
    movementSpeed = 1,
    zoomSpeed = 1,
} = {})
{
    const baseZoomLevel = zoomLevel;

    // In which direction(s) the camera is currently moving. This is affected
    // by e.g. user input.
    const cameraMovement = {
        up: false,
        down: false,
        left: false,
        right: false,
    };

    // The position the camera currently wants to be at, e.g. as a result of movement input
    // from the user. We'll lerp toward this position each frame for smooth movement.
    const targetPosition = {x, y};
    let targetZoomLevel = zoomLevel;
    let movementDamping = 0.009;

    // Returns true if the key was handled; false otherwise.
    function process_key_release(key)
    {
        function key_is(compared)
        {
            return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
        }

        if (key_is("s"))
        {
            cameraMovement.up = false;
            return true;
        }
        else if (key_is("f"))
        {
            cameraMovement.down = false;
            return true;
        }
        else if (key_is("e"))
        {
            cameraMovement.left = false;
            return true;
        }
        else if (key_is("d"))
        {
            cameraMovement.right = false;
            return true;
        }

        return false;
    }
    
    // Returns true if the key was handled; false otherwise.
    function process_key_press(key)
    {
        function key_is(compared)
        {
            return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
        }

        if (Rsed.ui.utils.inputState.any_modifier_key_down())
        {
            return false;
        }
        else
        {
            if (key_is("s"))
            {
                cameraMovement.up = true;
                return true;
            }
            else if (key_is("f"))
            {
                cameraMovement.down = true;
                return true;
            }
            else if (key_is("e"))
            {
                cameraMovement.left = true;
                return true;
            }
            else if (key_is("d"))
            {
                cameraMovement.right = true;
                return true;
            }
        }

        return false;
    }

    // Returns true if the key was handled; false otherwise.
    function handle_mouse_input()
    {
        if (Rsed.ui.utils.inputState.mouse_wheel_scroll())
        {
            targetZoomLevel -= ((targetZoomLevel / baseZoomLevel) * zoomSpeed * Math.sign(Rsed.ui.utils.inputState.mouse_wheel_scroll()));
            Rsed.ui.utils.inputState.reset_wheel_scroll();
            return true;
        }

        return false;
    }

    function update()
    {
        const direction = Rngon.vector(0, 0, 0);
        const speed = movementSpeed;

        if (cameraMovement.left) direction.y += -1;
        if (cameraMovement.right) direction.y += 1;
        if (cameraMovement.up) direction.x += -1;
        if (cameraMovement.down) direction.x +=  1;

        Rngon.vector.normalize(direction);
        targetPosition.x += (direction.x * speed);
        targetPosition.y += (direction.y * speed);

        x = Rsed.lerp(x, targetPosition.x, (movementDamping * Rsed.core.tickDeltaMs));
        y = Rsed.lerp(y, targetPosition.y, (movementDamping * Rsed.core.tickDeltaMs));
        zoomLevel = Rsed.lerp(zoomLevel, targetZoomLevel, (movementDamping * Rsed.core.tickDeltaMs));

        return;
    }

    const publicInterface = {
        update,
        process_key_release,
        process_key_press,
        handle_mouse_input,
        get zoomLevel()
        {
            return zoomLevel;
        },
        get position()
        {
            return Rngon.vector(-x, y, -zoomLevel);
        },
    }

    return publicInterface;
}
/*
 * Most recent known filename: js/scene/camera-3d.js
 *
 * 2018-2022 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.scenes.$camera3D = function({
    position = {x:0, y:0, z:0},
    rotation = {x:0, y:0, z:0},
} = {})
{
    const defaultPosition = {...position};
    const targetPosition = {...defaultPosition};
    let movementDamping = 0.009;

    // In which direction(s) the camera is currently moving. This is affected
    // by e.g. user input.
    const cameraMovement = {
        up: false,
        down: false,
        left: false,
        right: false,
        msSinceLastUpdate: 0,
        isSmoothCamera: true,
    };
    
    // Tilting combines vertical rotation and movement to shift the camera's
    // view down and toward the middle tile row on the screen.
    let tilt = 0;

    const cameraMoveVector = Rngon.vector();
    
    // Returns true if the key was handled; false otherwise.
    function process_key_release(key)
    {
        function key_is(compared)
        {
            return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
        }

        if (key_is("s"))
        {
            cameraMovement.up = false;
            return true;
        }
        else if (key_is("f"))
        {
            cameraMovement.down = false;
            return true;
        }
        else if (key_is("e"))
        {
            cameraMovement.left = false;
            return true;
        }
        else if (key_is("d"))
        {
            cameraMovement.right = false;
            return true;
        }

        return false;
    }
    
    // Returns true if the key was handled; false otherwise.
    function process_key_press(key)
    {
        function key_is(compared)
        {
            return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
        }

        if (Rsed.ui.utils.inputState.any_modifier_key_down())
        {
            return false;
        }
        else
        {
            if (key_is("s"))
            {
                cameraMovement.up = true;
                return true;
            }
            else if (key_is("f"))
            {
                cameraMovement.down = true;
                return true;
            }
            else if (key_is("e"))
            {
                cameraMovement.left = true;
                return true;
            }
            else if (key_is("d"))
            {
                cameraMovement.right = true;
                return true;
            }
        }

        return false;
    }

    // Returns true if the key was handled; false otherwise.
    function handle_mouse_input()
    {
        return false;
    }

    const publicInterface =
    {
        process_key_release,
        process_key_press,
        handle_mouse_input,

        get viewportWidth()
        {
            return Math.ceil(Rsed.visual.canvas.resolution().width / 12);
        },

        get viewportHeight()
        {
            return Math.ceil(Rsed.visual.canvas.resolution().height / 5);
        },

        get tilt()
        {
            return tilt;
        },

        is_moving: function()
        {
            return (
                cameraMovement.left ||
                cameraMovement.right ||
                cameraMovement.up ||
                cameraMovement.down
            );
        },

        move: function()
        {
            const movementSpeed = (0.03 * Rsed.core.tickDeltaMs);

            cameraMoveVector.x = (cameraMovement.up? -1 : cameraMovement.down? 1 : 0);
            cameraMoveVector.z = (cameraMovement.left? -1 : cameraMovement.right? 1 : 0);
            Rngon.vector.normalize(cameraMoveVector);

            cameraMoveVector.x *= (movementSpeed * 0.5);
            cameraMoveVector.y *= movementSpeed;
            cameraMoveVector.z *= movementSpeed;

            this.move_by(cameraMoveVector.x, cameraMoveVector.y, cameraMoveVector.z);

            return;
        },

        // To be called once per game tick, to gradually move the camera towards its target position.
        update_movement: function(smoothMovement = true)
        {
            const prevPos = (smoothMovement? this.position() : this.position_floored());

            position.x = Rsed.lerp(position.x, targetPosition.x, (movementDamping * Rsed.core.tickDeltaMs));
            position.y = Rsed.lerp(position.y, targetPosition.y, (movementDamping * Rsed.core.tickDeltaMs));
            position.z = Rsed.lerp(position.z, targetPosition.z, (movementDamping * Rsed.core.tickDeltaMs));

            const newPos = (smoothMovement? this.position() : this.position_floored());
            const posDelta = {
                x: (newPos.x - prevPos.x),
                y: (newPos.y - prevPos.y),
                z: (newPos.z - prevPos.z),
            }

            // If the camera is moving, either by the user moving it or by residual momentum.
            if (posDelta.x || posDelta.y || posDelta.z)
            {
                // If the user is grabbing onto a prop while the camera moves, move the prop as well.
                if (Rsed.ui.utils.inputState.left_mouse_button_down())
                {
                    const grab = Rsed.ui.utils.inputState.current_mouse_grab();

                    if (grab && (grab.type == "prop"))
                    {
                        // Note: the starting line (always prop #0) is not user-editable.
                        if (grab.propTrackIdx !== 0)
                        {
                            Rsed.$currentProject.props.move(
                                Rsed.$currentProject.track_id(),
                                grab.propTrackIdx,
                                {
                                    x: (posDelta.x * Rsed.constants.groundTileSize),
                                    z: (posDelta.z * Rsed.constants.groundTileSize),
                                },
                            );
                        }
                    }
                }
            }

            return;
        },

        reset_position: function()
        {
            targetPosition.x = defaultPosition.x;
            targetPosition.y = defaultPosition.y;
            targetPosition.z = defaultPosition.z;
        },

        move_to: function(x, y, z)
        {
            movementDamping = 0.005;
            targetPosition.x = x;
            targetPosition.y = y;
            targetPosition.z = z;
        },

        move_by: function(deltaX, deltaY, deltaZ)
        {
            movementDamping = 0.009;
            targetPosition.x += deltaX;
            targetPosition.y += deltaY;
            targetPosition.z += deltaZ;

            if (deltaX || deltaY || deltaZ)
            {
                window.close_dropdowns();
            }

            return;
        },

        rotate_by: function(xDelta, yDelta, zDelta)
        {
            Rsed.throw_if_not_type("number", xDelta, yDelta, zDelta);

            rotation.x += xDelta;
            rotation.y += yDelta;
            rotation.z += zDelta;

            return;
        },

        tilt_by: function(delta)
        {
            Rsed.throw_if_not_type("number", delta);

            tilt = Math.max(0, Math.min(296, (tilt + delta)));

            targetPosition.y = position.y = (-tilt * 7);
            rotation.x = (16 + (tilt / 10));

            return;
        },

        rotation: function()
        {
            return Rngon.vector(rotation.x, rotation.y, rotation.z);
        },

        position_floored: function()
        {
            return {
                x: Math.floor(position.x),
                y: Math.floor(position.y),
                z: Math.floor(position.z),
            };
        },

        position: function()
        {
            return {...position};
        },
    };

    return publicInterface;
}
/*
 * 2019-2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.scenes.$render = (Rsed.scenes.$render || {});

{ // A block to limit the scope of the unit-global variables we set up, below.

// We'll sort the n-gon's vertices into those on its left side and those on its
// right side.
const leftVerts = new Array(500);
const rightVerts = new Array(500);

// Then we'll organize the sorted vertices into edges (lines between given two
// vertices). Once we've got the edges figured out, we can render the n-gon by filling
// in the spans between its edges.
const leftEdges = new Array(500).fill().map(e=>({}));
const rightEdges = new Array(500).fill().map(e=>({}));

let numLeftVerts = 0;
let numRightVerts = 0;
let numLeftEdges = 0;
let numRightEdges = 0;

const vertexSorters = {
    verticalAscending: (vertA, vertB)=>((vertA.y === vertB.y)? 0 : ((vertA.y < vertB.y)? -1 : 1)),
    verticalDescending: (vertA, vertB)=>((vertA.y === vertB.y)? 0 : ((vertA.y > vertB.y)? -1 : 1))
};

Rsed.scenes.$render.rasterizer = function(renderState)
{
    for (let n = 0; n < renderState.ngonCache.count; n++)
    {
        const ngon = renderState.ngonCache.ngons[n];

        switch (ngon.vertices.length)
        {
            case 0:
            {
                continue;
            }
            case 1:
            {
                Rngon.default.render.pipeline.rasterizer.point(renderState, ngon.vertices[0], {alpha: 255, ...Rsed.visual.palette.color_at(ngon.material.color)});
                continue;
            }
            case 2:
            {
                Rngon.default.render.pipeline.rasterizer.line(renderState, ngon.vertices[0], ngon.vertices[1], {alpha: 255, ...Rsed.visual.palette.color_at(ngon.material.color)});
                continue;
            }
            default:
            {
                (ngon.material.isInScreenSpace? rasterize_ui_poly : rasterize_poly)(ngon, renderState);
                continue;
            }
        }
    }

    return;
}

function rasterize_ui_poly(ngon, renderState)
{
    Rngon.assert?.((ngon.vertices.length === 4), "Expected UI polygons to be squares");

    const material = ngon.material;
    const texture = ngon.material.texture;
    const pixelBuffer32 = renderState.pixelBuffer32;
    const renderWidth = renderState.pixelBuffer.width;
    const renderHeight = renderState.pixelBuffer.height;

    const startX = ngon.vertices[0].x;
    const endX = ngon.vertices[1].x;
    const startY = ngon.vertices[0].y;
    const endY = ngon.vertices[2].y;

    if (texture)
    {
        const rectWidth = (endX - startX);
        const rectHeight = (endY - startY);

        // Scale the texture to fit the polygon rectangle.
        const tx = (texture.width / rectWidth);
        const ty = (texture.height / rectHeight);

        for (let y = startY; y < endY; y++)
        {
            if (y < 0)
            {
                continue;
            }
            else if (y >= renderHeight)
            {
                break;
            }

            let pixelBufferIdx = ((y * renderWidth) + startX);
            let texelIdx = ((texture.height - ~~((y - startY) * ty) - 1) * texture.width);

            for (let x = startX; x < endX; x++)
            {
                if (x >= renderWidth)
                {
                    break;
                }
                
                if (x >= 0)
                {
                    const colorIdx = texture.indices[~~texelIdx];

                    if (
                        !material.allowAlphaReject ||
                        (colorIdx !== 0)
                    ){
                        pixelBuffer32[pixelBufferIdx] = (Rsed.visual.palette.precompiled[colorIdx][Rsed.visual.palette.numLightLevels - 1] || 11);
    
                        if (material.$mousePickId)
                        {
                            Rsed.ui.utils.inputState.mousePickBuffer[pixelBufferIdx] = material.$mousePickId;
                        }
                    }
                }

                pixelBufferIdx++;
                texelIdx += tx;
            }
        }
    }
    else if (material.hasFill)
    {
        const color32 = (Rsed.visual.palette.precompiled[material.color][Rsed.visual.palette.numLightLevels - 1] || 255);

        for (let y = startY; y < endY; y++)
        {
            if (y < 0)
            {
                continue;
            }
            else if (y >= renderWidth)
            {
                break;
            }

            let pixelBufferIdx = (y * renderWidth);

            for (let x = startX; x < endX; x++)
            {
                if (x < 0)
                {
                    continue;
                }
                else if (x >= renderWidth)
                {
                    break;
                }
                
                pixelBuffer32[pixelBufferIdx + x] = color32;

                if (material.$mousePickId)
                {
                    Rsed.ui.utils.inputState.mousePickBuffer[pixelBufferIdx + x] = material.$mousePickId;
                }
            }
        }
    }
}

function rasterize_poly(ngon, renderState)
{
    Rngon.assert?.((ngon.vertices.length < leftVerts.length), "Overflowing the vertex buffer");

    numLeftVerts = 0;
    numRightVerts = 0;
    numLeftEdges = 0;
    numRightEdges = 0;

    const material = ngon.material;
    const texture = ngon.material.texture;
    const pixelBuffer = renderState.pixelBuffer.data;
    const pixelBuffer32 = new Uint32Array(pixelBuffer.buffer);
    const renderWidth = renderState.pixelBuffer.width;
    const renderHeight = renderState.pixelBuffer.height;

    // Figure out which of the n-gon's vertices are on its left side and which on the
    // right. The vertices on both sides will be arranged from smallest Y to largest
    // Y, i.e. top-to-bottom in screen space. The top-most vertex and the bottom-most
    // vertex will be shared between the two sides.
    {
        // For rectangular ground tiles, whose vertices come in a predictable order.
        if (material.$isGroundTile)
        {
            Rngon.assert?.((ngon.vertices.length == 4), "Expected a rectangle.");

            let leftTop = ngon.vertices[3];
            let leftBottom = ngon.vertices[0];
            let rightTop = ngon.vertices[2];
            let rightBottom = ngon.vertices[1];

            // Fix self-intersecting where the supposedly bottom vertex has been raised
            // above the top vertex.
            if (leftBottom.y < leftTop.y) {
                leftBottom.y = leftTop.y;
            }
            if (rightBottom.y < rightTop.y) {
                rightBottom.y = rightTop.y;
            }

            if (leftTop.y < rightTop.y)
            {
                leftVerts[numLeftVerts++] = leftTop;
                leftVerts[numLeftVerts++] = leftBottom;
                rightVerts[numRightVerts++] = leftTop;
                rightVerts[numRightVerts++] = rightTop;
                rightVerts[numRightVerts++] = rightBottom;
            }
            else
            {
                leftVerts[numLeftVerts++] = rightTop;
                leftVerts[numLeftVerts++] = leftTop;
                leftVerts[numLeftVerts++] = leftBottom;
                rightVerts[numRightVerts++] = rightTop;
                rightVerts[numRightVerts++] = rightBottom;
            }

            if (leftBottom.y < rightBottom.y)
            {
                leftVerts[numLeftVerts++] = rightBottom;
            }
            else
            {
                rightVerts[numRightVerts++] = leftBottom;
            }
        }
        // Generic algorithm for n-sided convex polygons.
        else
        {
            // Sort the vertices by height from smallest Y to largest Y.
            ngon.vertices.sort(vertexSorters.verticalAscending);

            const topVert = ngon.vertices[0];
            const bottomVert = ngon.vertices[ngon.vertices.length-1];

            leftVerts[numLeftVerts++] = topVert;
            rightVerts[numRightVerts++] = topVert;

            // Trace a line along XY between the top-most vertex and the bottom-most vertex;
            // and for the intervening vertices, find whether they're to the left or right of
            // that line on X. Being on the left means the vertex is on the n-gon's left side,
            // otherwise it's on the right side.
            for (let i = 1; i < (ngon.vertices.length - 1); i++)
            {
                const lr = Rsed.lerp(topVert.x, bottomVert.x, ((ngon.vertices[i].y - topVert.y) / (bottomVert.y - topVert.y)));

                if (ngon.vertices[i].x >= lr)
                {
                    rightVerts[numRightVerts++] = ngon.vertices[i];
                }
                else
                {
                    leftVerts[numLeftVerts++] = ngon.vertices[i];
                }
            }

            leftVerts[numLeftVerts++] = bottomVert;
            rightVerts[numRightVerts++] = bottomVert;
        }
    }

    // Create edges out of the vertices.
    {
        for (let l = 1; l < numLeftVerts; l++) add_edge(leftVerts[l-1], leftVerts[l], true);
        for (let r = 1; r < numRightVerts; r++) add_edge(rightVerts[r-1], rightVerts[r], false);

        function add_edge(vert1, vert2, isLeftEdge)
        {
            const startY = Math.round(vert1.y);
            const endY = Math.round(vert2.y);
            const edgeHeight = (endY - startY);
            
            // Ignore horizontal edges.
            if (edgeHeight === 0) return;

            const startX = Math.round(vert1.x);
            const endX = Math.ceil(vert2.x);
            const deltaX = ((endX - startX) / edgeHeight);

            const startShade = Math.max(0, Math.min(1, vert1.shade));
            const endShade = Math.max(0, Math.min(1, vert2.shade));
            const deltaShade = ((endShade - startShade) / edgeHeight);

            const edge = (isLeftEdge? leftEdges[numLeftEdges++] : rightEdges[numRightEdges++]);
            edge.startY = startY;
            edge.endY = endY;
            edge.startX = startX;
            edge.deltaX = deltaX;
            edge.startShade = startShade;
            edge.deltaShade = deltaShade;
        }
    }

    // Draw the n-gon. On each horizontal raster line, there will be two edges: left and right.
    // We'll render into the pixel buffer each horizontal span that runs between the two edges.
    if (material.hasFill)
    {
        let curLeftEdgeIdx = 0;
        let curRightEdgeIdx = 0;
        let leftEdge = leftEdges[curLeftEdgeIdx];
        let rightEdge = rightEdges[curRightEdgeIdx];
        
        if (!numLeftEdges || !numRightEdges)
        {
            return;
        }

        // Note: We assume the n-gon's vertices to be sorted by increasing Y.
        const ngonStartY = leftEdges[0].startY;
        const ngonEndY = leftEdges[numLeftEdges-1].endY;

        const ngonHeight = (ngonEndY - ngonStartY);
        const vDiv = ((texture?.height || 1) / ngonHeight);
        let v = ((texture?.height || 1) - vDiv);
        
        // Rasterize the n-gon in horizontal pixel spans over its height.
        for (let y = ngonStartY; y < ngonEndY; y++)
        {
            const spanStartX = Math.round(leftEdge.startX);
            const spanEndX = Math.round(rightEdge.startX);
            const spanWidth = ((spanEndX - spanStartX) + 1);

            if (
                (spanWidth > 0) &&
                (y >= 0) &&
                (y < renderHeight)
            ){
                const deltaShade = ((rightEdge.startShade - leftEdge.startShade) / spanWidth);
                let iplShade = (leftEdge.startShade - deltaShade);

                let pixelBufferIdx = ((spanStartX + y * renderWidth) - 1);

                const vBase = (~~v * texture?.width);
                const uDiv = (texture?.width / spanWidth);
                let u = -uDiv;
                
                for (let x = spanStartX; x < spanEndX; x++)
                {
                    // Update values that're interpolated horizontally along the span.
                    iplShade += deltaShade;
                    pixelBufferIdx++;
                    u += uDiv;

                    // Bounds-check, since we don't clip vertices to the viewport.
                    if (x < 0)
                    {
                        continue;
                    }
                    else if (x >= renderWidth)
                    {
                        break;
                    }

                    const colorIdx = (texture? texture.indices[~~u + vBase] : material.color);

                    if (
                        (colorIdx === 0) &&
                        (
                            ngon.material.allowAlphaReject ||
                            ngon.material.$isBillboard ||
                            ngon.material.$isProp
                        )
                    ){
                        continue;
                    }

                    const lightLevel = ~~(iplShade * (Rsed.visual.palette.numLightLevels - 1));
                    pixelBuffer32[pixelBufferIdx] = (Rsed.visual.palette.precompiled[colorIdx][lightLevel] || 255);

                    if (material.$mousePickId)
                    {
                        Rsed.ui.utils.inputState.mousePickBuffer[pixelBufferIdx] = material.$mousePickId;
                    }
                }
            }

            // Update values that're interpolated vertically along the edges.
            leftEdge.startX  += leftEdge.deltaX;
            rightEdge.startX += rightEdge.deltaX;
            leftEdge.startShade  += leftEdge.deltaShade;
            rightEdge.startShade += rightEdge.deltaShade;
            v -= vDiv;

            // We can move onto the next edge when we're at the end of the current one.
            if (y === (leftEdge.endY - 1)) leftEdge = leftEdges[++curLeftEdgeIdx];
            if (y === (rightEdge.endY - 1)) rightEdge = rightEdges[++curRightEdgeIdx];
        }
    }

    // Draw a wireframe around any n-gons that wish for one.
    if (material.hasWireframe)
    {
        const color = {alpha: 255, ...Rsed.visual.palette.color_at(material.wireframeColor)};

        for (let l = 1; l < numLeftVerts; l++)
        {
            Rngon.default.render.pipeline.rasterizer.line(renderState, leftVerts[l-1], leftVerts[l], color);
        }

        for (let r = 1; r < numRightVerts; r++)
        {
            Rngon.default.render.pipeline.rasterizer.line(renderState, rightVerts[r-1], rightVerts[r], color);
        }
    }
}

}
/*
 * 2019-2023 Tarpeeksi Hyvae Soft
 *
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.scenes.$render = (Rsed.scenes.$render || {});

// A stripped-down version of the retro n-gon renderer's polygon transformer. Includes
// only the features required by RallySportED-js, helping to boost FPS.
//
// Expects vertices to already be in screen space.
//
// For the original function, see Rngon.ngon_transform_and_light().
Rsed.scenes.$render.transform_clip_lighter = function({renderState, mesh})
{
    const ngonCache = renderState.ngonCache;
    const renderWidth = renderState.pixelBuffer.width;
    const renderHeight = renderState.pixelBuffer.height;

    for (const ngon of mesh.ngons)
    {
        // Ignore n-gons that would be fully outside of the screen.
        {
            const boundingBox = ngon.vertices.reduce((bounds, v)=>{
                if (bounds.xMin > v.x) bounds.xMin = v.x;
                if (bounds.xMax < v.x) bounds.xMax = v.x;
                if (bounds.yMin > v.y) bounds.yMin = v.y;
                if (bounds.yMax < v.y) bounds.yMax = v.y;
                return bounds;
            }, {xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity});

            if ((boundingBox.xMin >= renderWidth) || (boundingBox.xMax < 0) ||
                (boundingBox.yMin >= renderHeight) || (boundingBox.yMax < 0))
            {
                continue;
            }
        }

        // Copy the ngon into the internal n-gon cache, so we can operate on it without
        // mutating the original n-gon's data.
        const cachedNgon = ngonCache.ngons[ngonCache.count++];
        {
            cachedNgon.vertices.length = 0;

            for (let v = 0; v < ngon.vertices.length; v++)
            {
                cachedNgon.vertices[v] = Rngon.vertex(
                    ngon.vertices[v].x,
                    ngon.vertices[v].y,
                    ngon.vertices[v].z,
                    undefined,
                    undefined,
                    undefined,
                    ngon.vertices[v].shade
                );
            }

            cachedNgon.material = ngon.material;
            cachedNgon.isActive = true;
        }

        if (renderState.useVertexShader)
        {
            renderState.modules.vertex_shader(cachedNgon, renderState);
        }
    };

    // Mark as inactive any cached n-gons that we didn't touch, so the renderer knows
    // to ignore them for the current frame.
    for (let i = ngonCache.count; i < ngonCache.ngons.length; i++)
    {
        ngonCache.ngons[i].isActive = false;
    }

    return;
}
/*
 * Most recent known filename: js/scene/terrain-editor/terrain-editor.js
 *
 * 2019-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// A 3D view displaying the track's MAASTO and VARIMAA data. Lets the user edit
// these data.
Rsed.scenes["terrain-editor"] = (function()
{
    const camera = Rsed.scenes.$camera3D({
        position: {x:15, y:0, z:13},
        rotation: {x:16, y:0, z:0},
    });

    const uiMeshes = [];

    // Lets us keep track of mouse position delta between frames; e.g. for dragging props.
    let prevMousePos = {x:0, y:0};

    const sceneState = {
        // Whether to draw a wireframe around the scene's polygons. Note that we default to
        // not showing the wireframe on mobile devices, since we assume that they have small
        // screens and so not enough resolution to show the wireframe as anything but a
        // pixely mess.
        showWireframe: false,

        // Whether to show the terrain texture atlas (PALA texture); i.e. a side panel that
        // displays all the available PALA textures.
        showPalatPane: false,

        // Whether to render props (track-side 3d objects - like trees, billboards, etc.).
        showProps: true,
    }
    
    const uiComponents = {
        activePala: Rsed.ui.canvas.component.activePala({
            on_grab: function()
            {
                sceneState.showPalatPane = !sceneState.showPalatPane;
                Rsed.ui.utils.inputState.reset_mouse_grab();
            },
        }),
        footerInfo: Rsed.ui.canvas.component.terrainHoverInfo(),
        minimap: Rsed.ui.canvas.component.terrainMinimap({
            camera: camera,
            on_grab: function(event)
            {
                const mousePos = Rsed.ui.utils.inputState.mouse_pos_scaled_to_render_resolution();
                const tileX = ((mousePos.x - event.topLeft.x) * event.scale.x);
                const tileZ = ((mousePos.y - event.topLeft.y) * event.scale.y);
                const x = Math.round((tileX - (camera.viewportWidth / 2)) + 1);
                const z = Math.round((tileZ - (camera.viewportHeight / 2)) + 1);
                camera.move_to(x, camera.position().y, z)
                Rsed.ui.utils.inputState.reset_mouse_grab();
            },
        }),
        palatPane: Rsed.ui.canvas.component.palatPane({
            on_grab: function(event)
            {
                Rsed.ui.utils.terrainBrush.textureIdx = event.palaIdx;
            },
        }),
        frametimeGraph: Rsed.ui.canvas.component.valueGraph({
            title: "Scene frametime",
            min: 0,
            max: 16,
            high: 9,
            low: 4,
        }),
        fpsIndicator: Rsed.ui.canvas.component.valueGraph({
            title: "FPS",
            labelOnly: true,
        }),
        editorSelector: Rsed.ui.canvas.component.editorSelector(),
    };

    const scene = Rsed.scene({
        render: function()
        {
            process_user_input();

            Rsed.ui.utils.inputState.mousePickBuffer.fill(null);
            const rendererStats = draw_scene();
            draw_ui(rendererStats);

            return;
        },

        reset: function()
        {
            camera.reset_position();
        },

        process_key_release: function(key)
        {
            if (camera.process_key_release(key))
            {
                return;
            }

            return;
        },

        process_key_press: function(key, repeat = false)
        {
            function key_is(compared)
            {
                return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
            }
            
            if (Rsed.ui.utils.inputState.any_modifier_key_down())
            {
                if (key_is("z"))
                {
                    if (Rsed.ui.utils.inputState.key_down("control") &&
                        Rsed.ui.utils.inputState.key_down("shift"))
                    {
                        Rsed.ui.utils.undoStack.redo();
                    }
                    else if (Rsed.ui.utils.inputState.key_down("control"))
                    {
                        Rsed.ui.utils.undoStack.undo();
                    }
                }
                else if (key_is("y") && Rsed.ui.utils.inputState.key_down("control"))
                {
                    Rsed.ui.utils.undoStack.redo();
                }
                else if (key_is("s") && Rsed.ui.utils.inputState.key_down("control"))
                {
                    Rsed.$currentProject.download_as_zip();
                }
            }
            else if (!camera.process_key_press(key))
            {
                if (key_is("a") && !repeat)
                {
                    sceneState.showPalatPane = !sceneState.showPalatPane;
                }
                else if (key_is("q"))
                {
                    Rsed.$currentScene = "tilemap-editor";
                }
                // Edit the texture underneath the cursor, if any.
                else if (key_is("t"))
                {
                    const hover = Rsed.ui.utils.inputState.current_mouse_hover();
                    
                    if (hover)
                    {
                        let texture = undefined;

                        switch (hover.type)
                        {
                            case "ground":
                            {
                                const palaIdx = Rsed.$currentProject.varimaa.tile_at(hover.groundTileX, hover.groundTileY);
                                texture = Rsed.$currentProject.palat.texture[palaIdx];
                                break;
                            }
                            case "prop":
                            {
                                texture = hover.texture;
                                break;
                            }
                        }

                        if (texture)
                        {
                            Rsed.scenes["texture-editor"].set_texture(texture);
                            Rsed.$currentScene = "texture-editor";
                        }
                    }
                }
                else if (key_is("arrowup") ||
                         key_is("arrowdown"))
                {
                    const mouseHover = Rsed.ui.utils.inputState.current_mouse_hover();

                    if (mouseHover && (mouseHover.type == "ground"))
                    {
                        const delta = (key_is("arrowup")? 1 : -1);

                        Rsed.ui.utils.terrainBrush.apply({
                            target: "maasto-height",
                            data: delta,
                            x: mouseHover.groundTileX,
                            y: mouseHover.groundTileY
                        });
                    }
                }
                else if (key_is("w") && !repeat)
                {
                    sceneState.showWireframe = !sceneState.showWireframe;
                }
                else if (key_is("l") && !repeat)
                {
                    const height = 0;

                    for (let y = 0; y < Rsed.$currentProject.maasto.height; y++)
                    {
                        for (let x = 0; x < Rsed.$currentProject.maasto.width; x++)
                        {
                            Rsed.ui.utils.assetMutator.user_edit("maasto", {
                                command: "set-height",
                                target: {x, y},
                                data: height,
                            });
                        }
                    }
                }
                else if (key_is("b") && !repeat)
                {
                    sceneState.showProps = !sceneState.showProps;
                }
                else if (key_is(" ") && !repeat)
                {
                    Rsed.ui.utils.terrainBrush.smoothening = !Rsed.ui.utils.terrainBrush.smoothening;
                }
                else
                {
                    for (const brushSizeKey of ["1", "2", "3", "4", "5"])
                    {
                        if (key_is(brushSizeKey))
                        {
                            Rsed.ui.utils.terrainBrush.radius = ((brushSizeKey == 5)? 8 : (brushSizeKey - 1));
                        }
                    }
                }
            }

            return;
        },
    });

    function process_user_input()
    {
        handle_mouse_input();
        update_cursor_graphic();
        camera.update_movement();

        /// EXPERIMENTAL. Temporary testing of mobile controls.
        const touchDelta = Rsed.ui.utils.inputState.get_touch_move_delta();
        if (touchDelta.x || touchDelta.y || touchDelta.z)
        {
            camera.move_by((-touchDelta.x * 0.25), 0, (-touchDelta.y * 0.25));
        }

        return;
    }

    function draw_scene()
    {
        camera.move();

        const trackMesh = scene.meshBuilder.track_mesh({
            camera,
            solidProps: sceneState.showProps,
            includeWireframe: sceneState.showWireframe,
        });

        // Transform the n-gons into screen space using Rally-Sport's one-point perspective.
        {
            // The vanishing point. Defaults to the top middle of the screen, like in
            // the game.
            const vanishX = ((Rngon.state.default.pixelBuffer?.width || 1) / 2);
            const vanishY = (20 - (camera.tilt * 2));

            for (const ngon of trackMesh.ngons)
            {
                for (const vertex of ngon.vertices)
                {
                    // Tweak the ground mesh's positioning so it matches the game's.
                    vertex.y *= -1;
                    vertex.x += (Rsed.constants.groundTileSize * 2);
                    vertex.y += (Rsed.constants.groundTileSize * 1.25);
                    vertex.z += (Rsed.constants.groundTileSize * 16);
                    
                    // Transform the vertex into screen space via simple depth division
                    // toward the vanishing point.
                    const z = Math.max(Number.MIN_VALUE, (vertex.z / 608));
                    vertex.x = (vanishX + ((vertex.x - vanishX) / z));
                    vertex.y = (vanishY + ((vertex.y - vanishY) / z));
                }
            }
        }

        const rendererStats = Rngon.render({
            target: Rsed.visual.canvas.domElement,
            meshes: [trackMesh],
            options: {
                cameraPosition: Rngon.vector(0, 0, 0),
                cameraDirection: camera.rotation(),
                resolution: Rsed.visual.canvas.resolution(),
                fov: 30,
                nearPlane: 300,
                farPlane: 10000,
                clipToViewport: true,
                useDepthBuffer: false,
            },
            pipeline: {
                ngonSorter: function(ngons)
                {
                    // Painter's sorting, most distant first.
                    ngons.sort((ngonA, ngonB)=>
                    {
                        const a = (ngonA.isActive? (ngonA.vertices.reduce((acc, v)=>(acc + v.z - (ngonA.material.$isBrushTile || 0)), 0) / ngonA.vertices.length) : 0);
                        const b = (ngonB.isActive? (ngonB.vertices.reduce((acc, v)=>(acc + v.z - (ngonB.material.$isBrushTile || 0)), 0) / ngonB.vertices.length) : 0);
                        return ((a === b)? 0 : ((a < b)? 1 : -1));
                    });
                },
                vertexShader: vs_distance_fog,
                rasterizer: Rsed.scenes.$render.rasterizer,
                transformClipLighter: Rsed.scenes.$render.transform_clip_lighter,
            },
        });

        rendererStats.totalRenderTimeMs = Math.round(rendererStats.totalRenderTimeMs);

        // If the rendering was resized since the previous frame...
        if ((rendererStats.renderWidth !== Rsed.visual.canvas.width ||
            (rendererStats.renderHeight !== Rsed.visual.canvas.height)))
        {
            Rsed.visual.canvas.width = rendererStats.renderWidth;
            Rsed.visual.canvas.height = rendererStats.renderHeight;

            window.close_dropdowns();
        }

        return rendererStats;
    }

    function draw_ui(rendererStats = {})
    {
        uiMeshes.length = 0;
        
        const margin = 4;

        if ((Rsed.visual.canvas.width <= 0) ||
            (Rsed.visual.canvas.height <= 0))
        {
            return;
        }

        uiMeshes.push(uiComponents.minimap((Rsed.visual.canvas.width - margin), (margin - 1)));
        uiMeshes.push(...uiComponents.editorSelector(margin+1, margin+1));
        uiMeshes.push(uiComponents.activePala((Rsed.visual.canvas.width - 72), (margin - 1)));
        uiMeshes.push(...uiComponents.footerInfo(margin, (Rsed.visual.canvas.height - Rsed.ui.canvas.font.nativeHeight - margin)));

        if (sceneState.showPalatPane)
        {
            uiMeshes.push(uiComponents.palatPane((Rsed.visual.canvas.width - margin) - 2, 38));
        }

        if (Rsed.browserMetadata.has_url_param("showFPS"))
        {
            uiMeshes.push(uiComponents.fpsIndicator(margin, 33, Rsed.core.ticksPerSecond));
            uiMeshes.push(uiComponents.frametimeGraph(margin, 42, (rendererStats.totalRenderTimeMs || 0)));
        }

        Rngon.render({
            target: Rsed.visual.canvas.domElementUi,
            meshes: uiMeshes,
            options: {
                cameraPosition: Rngon.vector(0, 0, 0),
                resolution: Rsed.visual.canvas.resolution(),
                useDepthBuffer: false,
            },
            pipeline: {
                rasterizer: Rsed.scenes.$render.rasterizer,
            },
        });

        return;
    }

    function update_cursor_graphic()
    {
        const cursors = Rsed.ui.dom.cursorHandler.cursors;

        const currentCursor = (()=>
        {
            const mouseHover = Rsed.ui.utils.inputState.current_mouse_hover();
            const mouseGrab = Rsed.ui.utils.inputState.current_mouse_grab();

            if (Rsed.ui.utils.inputState.is_prop_context_menu_open())
            {
                return cursors.default;
            }

            // If the element on which the cursor hovers provides its own preferred cursor graphic.
            if (mouseHover?.cursor)
            {
                return mouseHover.cursor;
            }

            if (mouseGrab?.type == "prop")
            {
                if (Rsed.ui.utils.inputState.right_mouse_button_down())
                {
                    return cursors.fingerHand;
                }

                return cursors.closedHand;
            }

            if (mouseHover)
            {
                switch (mouseHover.type)
                {
                    case "prop": return cursors.fingerHand;
                    case "ground":
                    {
                        if (Rsed.ui.utils.inputState.key_down("tab"))
                        {
                            return cursors.eyedropper;
                        }
                        else if (Rsed.ui.utils.terrainBrush.smoothening)
                        {
                            return cursors.pencilSmooth;
                        }

                        return cursors.pencil;
                    }
                }
            }

            return cursors.default;
        })();

        Rsed.ui.dom.cursorHandler.set_cursor(currentCursor);
        
        return;
    }

    function handle_mouse_input()
    {
        if (Rsed.ui.utils.inputState.mouse_wheel_scroll())
        {
            camera.tilt_by(-Rsed.ui.utils.inputState.mouse_wheel_scroll() / 2);
            Rsed.ui.utils.inputState.reset_wheel_scroll();
        }

        if (Rsed.ui.utils.inputState.mouse_button_down())
        {
            // Note: A mouse grab can be either a transient click or a longer
            // press.
            const grab = Rsed.ui.utils.inputState.current_mouse_grab();
            const hover = Rsed.ui.utils.inputState.current_mouse_hover();

            if (!grab) return;

            switch (grab.type)
            {
                case "ground":
                {
                    if (camera.is_moving())
                    {
                        return;
                    }
                    
                    // Note: We'll access the mouse-picking info via hover instead of grab,
                    // since grab will be the tile over which the user pressed down the
                    // mouse button regardless of whether the mouse is moved after that;
                    // while hover indicates the tile over which the mouse - with the button
                    // held down - is currently over.
                    if (!hover || (hover.type !== "ground")) break;

                    // Eyedropper.
                    if (Rsed.ui.utils.inputState.left_mouse_button_down() &&
                        Rsed.ui.utils.inputState.left_mouse_click_modifiers().includes("tab"))
                    {
                        Rsed.ui.utils.terrainBrush.textureIdx = Rsed.$currentProject.varimaa.tile_at(hover.groundTileX, hover.groundTileY);

                        break;
                    }

                    // Add a new prop.
                    if (Rsed.ui.utils.inputState.left_mouse_button_down() &&
                        Rsed.ui.utils.inputState.left_mouse_click_modifiers().includes("shift"))
                    {
                        Rsed.ui.utils.assetMutator.user_edit("prop", {
                            command: "add",
                            target: Rsed.$currentProject.props.id_for_name("tree"),
                            data: {
                                x: (hover.groundTileX * Rsed.constants.groundTileSize),
                                z: (hover.groundTileY * Rsed.constants.groundTileSize),
                            },
                        });

                        Rsed.ui.utils.inputState.reset_mouse_hover();
                        Rsed.ui.utils.inputState.reset_mouse_grab();

                        break;
                    }

                    // Raise/lower the terrain.
                    if (Rsed.ui.utils.inputState.left_mouse_button_down() ||
                        Rsed.ui.utils.inputState.right_mouse_button_down())
                    {
                        // Left button raises, right button lowers. Holding down Ctrl  reduces
                        // the rate of change.
                        const delta = (Rsed.ui.utils.inputState.left_mouse_button_down()? 2 : -2);
                        
                        Rsed.ui.utils.terrainBrush.apply({
                            target: "maasto-height",
                            data: delta,
                            x: hover.groundTileX,
                            y: hover.groundTileY,
                        });

                        break;
                    }

                    // Paint the terrain.
                    if (!Rsed.ui.utils.inputState.key_down("shift") &&
                        Rsed.ui.utils.inputState.mid_mouse_button_down())
                    {
                        Rsed.ui.utils.terrainBrush.apply({
                            target: "varimaa-value",
                            data: Rsed.ui.utils.terrainBrush.textureIdx,
                            x: hover.groundTileX,
                            y: hover.groundTileY
                        });

                        break;
                    }

                    break;
                }
                
                case "prop":
                {
                    if (Rsed.ui.utils.inputState.left_mouse_button_down())
                    {
                        // Remove the selected prop.
                        if (Rsed.ui.utils.inputState.left_mouse_click_modifiers().includes("shift"))
                        {
                            Rsed.ui.utils.assetMutator.user_edit("prop", {
                                command: "remove",
                                target: hover.propTrackIdx,
                            });

                            Rsed.ui.utils.inputState.reset_mouse_hover();
                            Rsed.ui.utils.inputState.reset_mouse_grab();
                        }
                        // Drag the prop.
                        else
                        {
                            // For now, don't allow moving the starting line (always prop #0).
                            if (grab.propTrackIdx === 0)
                            {
                                Rsed.alert("The finish line can't be moved.");

                                // Prevent the same input from registering again next frame, before
                                // the user has had time to release the mouse button.
                                Rsed.ui.utils.inputState.reset_mouse_buttons_state();

                                break;
                            }
                            else
                            {
                                const mousePosDelta =
                                {
                                    x: (Rsed.ui.utils.inputState.mouse_pos().x - prevMousePos.x),
                                    y: (Rsed.ui.utils.inputState.mouse_pos().y - prevMousePos.y),
                                }

                                Rsed.ui.utils.assetMutator.user_edit("prop", {
                                    command: "move",
                                    target: grab.propTrackIdx,
                                    data: {
                                        x: (mousePosDelta.x * 1),
                                        z: (mousePosDelta.y * 2.5),
                                    },
                                });
                            }
                        }
                    }

                    break;
                }

                default: break;
            }
        }

        prevMousePos = Rsed.ui.utils.inputState.mouse_pos();

        return;
    }

    // Vertex shader for a linear distance fog that fades to black.
    function vs_distance_fog(ngon, renderState)
    {
        const startDistance = 4900**2;
        const fogDepth = 3400**2;

        for (let v = 0; v < ngon.vertices.length; v++)
        {
            const distance = (((ngon.vertices[v].z - renderState.cameraPosition.z) ** 2) - startDistance);
            ngon.vertices[v].shade = Math.max(0, Math.min(ngon.vertices[v].shade, (1 - (distance / fogDepth))));
        }
    }

    return scene;
})();
/*
 * 2019-2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js

 */

"use strict";

// Provides functions returning renderable 3d meshes of various world items - like the track and
// its props - accounting for user-specified arguments such as camera position.
Rsed.scenes["terrain-editor"].meshBuilder = {
    // Constructs and returns a 3D mesh of the current project's terrain from the
    // viewing position of the given camera.
    track_mesh: function({
        camera = {},
        solidProps = true,
        includeWireframe = false,
    } = {})
    {
        const project = Rsed.$currentProject;
        const trackMeshPolys = [];
        const cameraPosFloored = camera.position_floored();
        const cameraPos = camera.position();
        const tileSize = Rsed.constants.groundTileSize;

        function out_of_bounds(x, y)
        {
            return Boolean(
                (x < 0) || (x >= project.maasto.width) ||
                (y < 1) || (y > project.maasto.height)
            );
        }

        // We'll shift the track mesh by these values (world units) to center the mesh on screen.
        // Note that we adjust Z to account for vertical camera zooming.
        const centerView = {
            x: -((Math.floor(camera.viewportWidth / 2) + 1) * tileSize),
            y: (-600 + cameraPosFloored.y),
            z: (3388 - (camera.rotation().x / 7.5) + (tileSize * 3.5))
        };

        const mouseHover = Rsed.ui.utils.inputState.current_mouse_hover();
        const mouseGrab = Rsed.ui.utils.inputState.current_mouse_grab();

        const fractionX = (cameraPos.x - cameraPosFloored.x);
        const fractionZ = (cameraPos.z - cameraPosFloored.z);

        for (let z = 0; z < camera.viewportHeight; z++)
        {
            // As the horizontal ground tile rows come closer to the camera, reduce the width of each
            // row, since fewer tiles will fit the camera's view there.
            const viewNarrowing = ~~(z * 0.13 * Rsed.visual.canvas.aspectRatio);

            let prevHeightDiff = 1;

            // Add the ground tiles.
            for (let x = viewNarrowing-1; x < camera.viewportWidth-viewNarrowing; x++)
            {
                // Coordinates of the current ground tile.
                const tileX = (x + cameraPosFloored.x);
                const tileZ = (z + cameraPosFloored.z);

                if (out_of_bounds(tileX, tileZ))
                {
                    continue;
                }

                // Coordinates in world units of the ground tile's top left vertex.
                const vertX = (((x * tileSize) + centerView.x) - (fractionX * tileSize));
                const vertZ = ((centerView.z - (z * tileSize)) + (fractionZ * tileSize));

                const isTileUnderBrush = (
                    !mouseGrab &&
                    (mouseHover && (mouseHover.type === "ground")) &&
                    (Math.abs(mouseHover.groundTileX - tileX) <= Rsed.ui.utils.terrainBrush.radius) &&
                    (Math.abs(mouseHover.groundTileY - (tileZ - 1)) <= Rsed.ui.utils.terrainBrush.radius)
                );

                // Construct the ground quad polygon.
                {
                    const tilePalaIdx = project.varimaa.tile_at(tileX, (tileZ - 1));
                    
                    // The heights of the ground quad's corner points.
                    let height1 = project.maasto.tile_at( tileX,       tileZ);
                    let height2 = project.maasto.tile_at((tileX + 1),  tileZ);
                    let height3 = project.maasto.tile_at((tileX + 1), (tileZ - 1));
                    let height4 = project.maasto.tile_at( tileX,      (tileZ - 1));

                    // We'll do rudimentary shading of the polygon based on its orientation. Ideally,
                    // the shading would replicate that of Rally-Sport, but this implementation
                    // doesn't quite match it.
                    const thisHeightDiff = (Math.max(120, Math.min(255, (255 - ((height1 - height3) * 2)))) / 255);
                    const heightDiff = Rsed.lerp(thisHeightDiff, prevHeightDiff, 0.5);
                    prevHeightDiff = thisHeightDiff;
                    const shade = (isTileUnderBrush? 1 : heightDiff);

                    // Each track in Rally-Sport has a water level, i.e. a height to which all water
                    // tiles' corners will be set. The tiles' actual height can be lower, in which case
                    // driving onto them will cause the car to become submerged under the apparent water
                    // level. In other words, the game will render all water tiles flush with the water
                    // level, but also keeps track of the tiles' actual height for car-ground collisions.
                    //
                    // In wireframe mode, we'll draw the ground tile heights as they are, but in non-
                    // wireframe mode, we'll make them flush with the track's water level.
                    if (!includeWireframe)
                    {
                        if (tilePalaIdx == 0) // Water tiles are those whose PALA index is 0.
                        {
                            height1 = project.waterLevel;
                            height2 = project.waterLevel;
                            height3 = project.waterLevel;
                            height4 = project.waterLevel;
                        }
                        // This tile is not a water tile but is adjacent to one. In that case, we'll
                        // adjust the heights of such neighboring corners.
                        else
                        {
                            if (0 == project.varimaa.tile_at(tileX, (tileZ - 1) + 1))
                            {
                                height2 = project.waterLevel;
                                height1 = project.waterLevel;
                            }
                            if (0 == project.varimaa.tile_at(tileX, (tileZ - 1) - 1))
                            {
                                height3 = project.waterLevel;
                                height4 = project.waterLevel;
                            }
                            if (0 == project.varimaa.tile_at(tileX - 1, (tileZ - 1)))
                            {
                                height1 = project.waterLevel;
                                height4 = project.waterLevel;
                            }
                            if (0 == project.varimaa.tile_at(tileX + 1, (tileZ - 1)))
                            {
                                height2 = project.waterLevel;
                                height3 = project.waterLevel;
                            }
                            if (0 == project.varimaa.tile_at(tileX + 1, (tileZ - 1) + 1))
                            {
                                height2 = project.waterLevel;
                            }
                            if (0 == project.varimaa.tile_at(tileX - 1, (tileZ - 1) + 1))
                            {
                                height1 = project.waterLevel;
                            }
                            if (0 == project.varimaa.tile_at(tileX + 1, (tileZ - 1) - 1))
                            {
                                height3 = project.waterLevel;
                            }
                            if (0 == project.varimaa.tile_at(tileX - 1, (tileZ - 1) - 1))
                            {
                                height4 = project.waterLevel;
                            }
                        }
                    }

                    height1 += centerView.y;
                    height2 += centerView.y;
                    height3 += centerView.y;
                    height4 += centerView.y;

                    trackMeshPolys.push(Rngon.ngon([
                        Rngon.vertex( vertX,             height1,  vertZ,             0, 0, 0, shade),
                        Rngon.vertex((vertX + tileSize), height2,  vertZ,             1, 0, 0, shade),
                        Rngon.vertex((vertX + tileSize), height3, (vertZ + tileSize), 1, 1, 0, shade),
                        Rngon.vertex( vertX,             height4, (vertZ + tileSize), 0, 1, 0, shade)], {
                            texture: (
                                isTileUnderBrush
                                    ? undefined
                                    : project.palat.texture[project.varimaa.tile_at(tileX, (tileZ - 1))]
                            ),
                            color: Rsed.visual.palette.BLACK,
                            wireframeColor: Rsed.visual.palette.BLACK,
                            hasWireframe: includeWireframe,
                            $mousePickId: Rsed.ui.utils.mouse_picking_element("ground", {
                                groundTileX: tileX,
                                groundTileY: (tileZ - 1),
                            }),
                            $isGroundTile: true,
                    }));

                    // Visualize the brush texture as a tile hovering above the ground.
                    if (isTileUnderBrush)
                    {
                        const hoverHeight = (includeWireframe? 5 : 10);

                        trackMeshPolys.push(Rngon.ngon([
                            Rngon.vertex( vertX,             (height1 + hoverHeight),  vertZ),
                            Rngon.vertex((vertX + tileSize), (height2 + hoverHeight),  vertZ),
                            Rngon.vertex((vertX + tileSize), (height3 + hoverHeight), (vertZ + tileSize)),
                            Rngon.vertex( vertX,             (height4 + hoverHeight), (vertZ + tileSize))], {
                                texture: project.palat.texture[Rsed.ui.utils.terrainBrush.textureIdx],
                                wireframeColor: Rsed.visual.palette.YELLOW,
                                hasWireframe: includeWireframe,
                                $isGroundTile: true,
                                $isBrushTile: true,
                        }));
                    }
                }
            }

            // Add the billboard and bridge tiles. We do this as a separate loop from adding
            // the ground tiles so that the n-gons are properly sorted by depth for rendering.
            // Otherwise, billboard/bridge tiles can become obscured by ground tiles behind
            // them.
            for (let x = 0; x < camera.viewportWidth; x++)
            {
                const tileX = (x + cameraPosFloored.x);
                const tileZ = (z + cameraPosFloored.z);

                if (out_of_bounds(tileX, tileZ))
                {
                    continue;
                }

                const vertX = (((x * tileSize) + centerView.x) - (fractionX * tileSize));
                const vertZ = ((centerView.z - (z * tileSize)) + (fractionZ * tileSize));

                // If this tile has a billboard, add it.
                {
                    const isTileUnderBrush = (
                        !mouseGrab &&
                        (mouseHover && (mouseHover.type === "ground")) &&
                        (Math.abs(mouseHover.groundTileX - tileX) <= Rsed.ui.utils.terrainBrush.radius) &&
                        (Math.abs(mouseHover.groundTileY - (tileZ - 1)) <= Rsed.ui.utils.terrainBrush.radius)
                    );
                    
                    const tilePalaIdx = (
                        isTileUnderBrush
                            ? Rsed.ui.utils.terrainBrush.textureIdx
                            : project.varimaa.tile_at(tileX, (tileZ - 1))
                    );

                    const billboardPalaIdx = project.palat.billboard_idx(tilePalaIdx, tileX, (tileZ - 1));
                    
                    if (billboardPalaIdx != null)
                    {
                        const baseHeight = centerView.y + project.maasto.tile_at(tileX, (tileZ - 1));
                        const billboardTexture = project.palat.texture[billboardPalaIdx];
                        const billboardVertices = (()=>
                        {
                            // Bridges (lay horizontally).
                            if (billboardPalaIdx == 177)
                            {
                                return [
                                    Rngon.vertex( vertX,  centerView.y, vertZ, 0, 0),
                                    Rngon.vertex((vertX + tileSize), centerView.y, vertZ, 1, 0),
                                    Rngon.vertex((vertX + tileSize), centerView.y, (vertZ+tileSize), 1, 1),
                                    Rngon.vertex( vertX, centerView.y, (vertZ+tileSize), 0, 1)
                                ];
                            }
                            // Other billboards (lay vertically).
                            else
                            {
                                return [
                                    Rngon.vertex( vertX, baseHeight, vertZ, 0, 0),
                                    Rngon.vertex((vertX + tileSize), baseHeight, vertZ, 1, 0),
                                    Rngon.vertex((vertX + tileSize), baseHeight+tileSize, vertZ, 1, 1),
                                    Rngon.vertex( vertX, baseHeight+tileSize, vertZ, 0, 1)
                                ];
                            }
                        })();

                        const billboardQuad = Rngon.ngon(billboardVertices, {
                            texture: billboardTexture,
                            hasFill: true,
                            $isBillboard: true,
                            $mousePickId: null,
                        });

                        trackMeshPolys.push(billboardQuad);
                    }
                }
            }
        }

        // Add extra decorations, like props and wires.
        {
            function world_to_screen(worldX, worldY, worldZ)
            {
                return {
                    x: ((worldX + centerView.x - (cameraPosFloored.x * tileSize)) - (fractionX * tileSize)),
                    y: (centerView.y + worldY),
                    z: ((centerView.z - worldZ + (cameraPosFloored.z * tileSize)) + (fractionZ * tileSize)),
                }
            }

            function is_inside_view_frustum(worldX, worldZ)
            {
                // Camera view frustum in world units.
                const cx1 = (cameraPosFloored.x * tileSize);
                const cx2 = ((cameraPosFloored.x + camera.viewportWidth) * tileSize);
                const cz1 = (cameraPosFloored.z * tileSize);
                const cz2 = ((cameraPosFloored.z + camera.viewportHeight) * tileSize);

                return (
                    (worldX >= cx1) &&
                    (worldX <= cx2) &&
                    (worldZ >= cz1) &&
                    (worldZ <= cz2)
                );
            }

            {
                const propLocations = project.props.locations_of_props_on_track(project.track_id());

                propLocations.forEach((pos, idx)=>{
                    if (!is_inside_view_frustum(pos.x, pos.z))
                    {
                        return;
                    }

                    const groundHeight = project.maasto.tile_at((pos.x / tileSize), (pos.z / tileSize));
                    const {x, y, z} = world_to_screen(pos.x, groundHeight, pos.z);

                    trackMeshPolys.push(...this.prop_mesh({
                        propId: pos.propId,
                        idxOnTrack: idx,
                        position: {x,y,z},
                        solidProps,
                        includeWireframe,
                    }));
                });
            }

            if (solidProps)
            {
                for (const checkpoint of Rsed.$currentProject.kierros.checkpoints)
                {
                    if (!is_inside_view_frustum(checkpoint.x, checkpoint.z))
                    {
                        continue;
                    }
    
                    const groundHeight = project.maasto.tile_at((checkpoint.x / tileSize), (checkpoint.z / tileSize));
                    const {x, y, z} = world_to_screen(checkpoint.x, groundHeight, checkpoint.z);
    
                    trackMeshPolys.push(Rngon.ngon([
                        Rngon.vertex(x, y, z),
                        Rngon.vertex(x, y+60, z)], {
                            color: Rsed.visual.palette.WHITE,
                    }));
                }

                for (const wire of project.wires.wires_on_track(project.track_id()))
                {
                    if (!is_inside_view_frustum(wire.middle.x, wire.middle.z))
                    {
                        continue;
                    }

                    trackMeshPolys.push(Rngon.ngon([
                        vertex(wire.start),
                        vertex(wire.end)], {
                            color: wire.color,
                    }));

                    function vertex(prop)
                    {
                        const x = ((prop.x + centerView.x - (cameraPosFloored.x * tileSize)) - (fractionX * tileSize));
                        const z = ((centerView.z - prop.z + (cameraPosFloored.z * tileSize)) + (fractionZ * tileSize));
                        const y = (centerView.y + prop.y);
                        return Rngon.vertex(x, y, z)
                    }
                }
            }
        }

        return Rngon.mesh(trackMeshPolys);
    },

    // Constructs and returns a 3D mesh of the given track prop, with its origin
    // set at the given XYZ world position.
    prop_mesh: function({
        propId = 0,
        idxOnTrack = 0,
        position = {
            x = 0,
            y = 0,
            z = 0,
        } = {},
        solidProps = true,
        includeWireframe = false,
    })
    {
        const project = Rsed.$currentProject;
        const srcMesh = project.props.mesh[propId];
        const dstMesh = [];

        srcMesh.ngons.forEach(ngon=>{
            const texture = (
                (solidProps && (ngon.fill.type === "texture"))
                    ? project.props.texture[ngon.fill.idx]
                    : undefined
            );

            dstMesh.push(Rngon.ngon(
                ngon.vertices.map(v=>
                    Rngon.vertex(
                        (v.x + position.x),
                        (v.y + position.y),
                        (v.z + position.z)
                    )
                ), {
                    color: (
                        (solidProps && (ngon.fill.type !== "texture"))
                            ? ngon.fill.idx
                            : 0
                    ),
                    texture,
                    wireframeColor: Rsed.visual.palette.LIGHTGRAY,
                    hasWireframe: (solidProps? includeWireframe : true),
                    hasFill: solidProps,
                    $mousePickId: Rsed.ui.utils.mouse_picking_element("prop", {
                        texture: texture,
                        propId: propId,
                        propTrackIdx: idxOnTrack
                    }),
                    $isProp: true,
                }
            ));
        });

        return dstMesh;
    },
}
/*
 * Most recent known filename: js/scene/texture-editor/texture-editor.js
 *
 * 2019-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// A view of a given texture, providing the user functionality to modify the texture's pixels.
Rsed.scenes["texture-editor"] = (function()
{
    // When textures are changed, their data isn't modified in-place but instead a new texture
    // object is created. So if the texture currently active in the texture editor changes outside
    // of the texture editor (e.g. due to an undo action), we need to update our reference to point
    // to the new version.
    window.addEventListener("rallysported:texture-changed", (event)=>{
        if (event.detail.from === texture) {
            Rsed.scenes["texture-editor"].set_texture(event.detail.to);
        }
    });

    window.addEventListener("rallysported:all-textures-changed", ()=>{
        Rsed.scenes["texture-editor"].set_texture(null);
    });
    
    const camera = Rsed.scenes.$camera2D({
        zoomLevel: 5,
        movementSpeed: 2.5,
        zoomSpeed: 1,
        x: 200,
        y: 100
    });

    // A reference to the Rsed.visual.texture() object that we're to edit.
    let texture = null;
    let textureInfo = {};

    // Texture pixels copied with Ctrl + C.
    let clipboard;
    reset_clipboard();

    const sceneState = {
        // Which color (index to Rally-Sport's palette) to paint with.
        penColorIdx: 19,

        // Whether to show the PALAT pane; i.e. a side panel that displays all the available
        // PALA textures.
        showPalatPane: false,
        
        showTextPane: false,
        
        showAnimsPane: false,
    };

    const uiComponents = {
        fpsIndicator: Rsed.ui.canvas.component.valueGraph({
            title: "FPS",
            labelOnly: true,
        }),
        palaSelector: Rsed.ui.canvas.component.palaSelector({
            on_grab: function()
            {
                sceneState.showPalatPane = !sceneState.showPalatPane;
                sceneState.showTextPane = false;
                sceneState.showAnimsPane = false;
                Rsed.ui.utils.inputState.reset_mouse_grab();
            },
        }),
        textSelector: Rsed.ui.canvas.component.textSelector({
            on_grab: function()
            {
                sceneState.showTextPane = !sceneState.showTextPane;
                sceneState.showPalatPane = false;
                sceneState.showAnimsPane = false;
                Rsed.ui.utils.inputState.reset_mouse_grab();
            },
        }),
        animSelector: Rsed.ui.canvas.component.animSelector({
            on_grab: function()
            {
                sceneState.showAnimsPane = !sceneState.showAnimsPane;
                sceneState.showPalatPane = false;
                sceneState.showTextPane = false;
                Rsed.ui.utils.inputState.reset_mouse_grab();
            },
        }),
        colorSelector: Rsed.ui.canvas.component.colorSelector({
            initialColorIdx: sceneState.penColorIdx,
            on_grab: function(event)
            {
                sceneState.penColorIdx = event.colorIdx;
                Rsed.ui.utils.inputState.reset_mouse_grab();
            },
        }),
        resolutionLabel: Rsed.ui.canvas.component.label(),
        editorSelector: Rsed.ui.canvas.component.editorSelector(),
        clipboardLabel: Rsed.ui.canvas.component.label(),
        palatPane: Rsed.ui.canvas.component.palatPane({
            indicateSelection: false,
            on_grab: function(event)
            {
                Rsed.scenes["texture-editor"].set_texture(Rsed.$currentProject.palat.texture[event.palaIdx]);
                Rsed.ui.utils.inputState.reset_mouse_grab();
            },
        }),
        animsPane: Rsed.ui.canvas.component.animsPane({
            indicateSelection: false,
            on_grab: function(event)
            {
                Rsed.scenes["texture-editor"].set_texture(Rsed.$currentProject.anims.texture[event.animIdx]);
                Rsed.ui.utils.inputState.reset_mouse_grab();
            },
        }),
        textPane: Rsed.ui.canvas.component.textPane({
            on_grab: function(event)
            {
                Rsed.scenes["texture-editor"].set_texture(Rsed.$currentProject.props.texture[event.textureId]);
            },
        }),
    };

    const scene = Rsed.scene({
        render: function()
        {
            process_user_input();
            Rsed.ui.utils.inputState.mousePickBuffer.fill(null);

            draw_scene();
            draw_ui();

            return;
        },

        // Assign the texture to be edited. Must be either an instance of Rsed.visual.texture
        // or an object that implements Rsed.visual.texture's public API.
        set_texture: function(tex)
        {
            texture = tex;

            return;
        },

        process_key_release: function(key)
        {
            if (camera.process_key_release(key))
            {
                return;
            }

            return;
        },

        process_key_press: function(key, repeat = false)
        {
            if (camera.process_key_press(key))
            {
                return;
            }

            function key_is(compared)
            {
                return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
            }

            if (Rsed.ui.utils.inputState.any_modifier_key_down())
            {
                if (key_is("z"))
                {
                    if (Rsed.ui.utils.inputState.key_down("control") &&
                        Rsed.ui.utils.inputState.key_down("shift"))
                    {
                        Rsed.ui.utils.undoStack.redo();
                    }
                    else if (Rsed.ui.utils.inputState.key_down("control"))
                    {
                        Rsed.ui.utils.undoStack.undo();
                    }
                }
                else if (key_is("y") &&
                         Rsed.ui.utils.inputState.key_down("control"))
                {
                    Rsed.ui.utils.undoStack.redo();
                }
                else if (key_is("s") &&
                         Rsed.ui.utils.inputState.key_down("control"))
                {
                    Rsed.$currentProject.download_as_zip();
                }
                else if (key_is("c") &&
                        Rsed.ui.utils.inputState.key_down("control"))
                {
                    copy_to_clipboard(texture);
                }
                else if (key_is("v") &&
                        Rsed.ui.utils.inputState.key_down("control"))
                {
                    paste_from_clipboard();
                }
            }
            else
            {
                if (key_is("a") && !repeat)
                {
                    sceneState.showPalatPane = !sceneState.showPalatPane;
                    sceneState.showTextPane = false;
                    sceneState.showAnimsPane = false;
                }
                else if (key_is("t"))
                {
                    sceneState.showTextPane = !sceneState.showTextPane;
                    sceneState.showPalatPane = false;
                    sceneState.showAnimsPane = false;
                }
                else if (key_is("r"))
                {
                    rotate(texture);
                }
                else if (key_is("y") &&
                         Rsed.ui.utils.inputState.key_down("control") )
                {
                    Rsed.ui.utils.undoStack.redo();
                }
                else if (key_is("q"))
                {
                    Rsed.$currentScene = "terrain-editor";
                    Rsed.ui.utils.inputState.set_key_down("q", false);
                }
                else
                {
                    for (const brushSizeKey of ["1", "2", "3", "4", "5"])
                    {
                        if (key_is(brushSizeKey))
                        {
                            Rsed.ui.utils.terrainBrush.radius = ((brushSizeKey == 5)? 8 : (brushSizeKey - 1));
                        }
                    }
                }
            }

            return;
        },        
    });

    return scene;

    function process_user_input()
    {
        handle_mouse_input();
        update_cursor_graphic();

        return;
    }

    function draw_ui()
    {
        const uiMeshes = [];
        const margin = 4;

        if ((Rsed.visual.canvas.width <= 0) ||
            (Rsed.visual.canvas.height <= 0))
        {
            return;
        }
        
        if (!texture)
        {
            Rsed.throw_if(
                Rsed.$currentProject.isPlaceholder,
                "Expected project data to have been loaded already."
            );

            scene.set_texture(Rsed.$currentProject.palat.texture[3]);
        }

        const clipboardLabel = clipboard
            ? `Clipboard: ${clipboard.width} * ${clipboard.height}${(clipboard.source == texture)? " (this)" : ""}`
            : "Clipboard: empty";

        uiMeshes.push(...uiComponents.editorSelector(margin+1, margin+1));
        uiMeshes.push(uiComponents.colorSelector((Rsed.visual.canvas.width - 101), (margin - 1)));
        uiMeshes.push(uiComponents.palaSelector((Rsed.visual.canvas.width - 105), (margin - 1)));
        uiMeshes.push(uiComponents.textSelector((Rsed.visual.canvas.width - 141), (margin - 1)));
        uiMeshes.push(uiComponents.animSelector((Rsed.visual.canvas.width - 177), (margin - 1)));
        uiMeshes.push(uiComponents.resolutionLabel(`Size: ${texture.width} * ${texture.height}`, margin, (Rsed.visual.canvas.height - (Rsed.ui.canvas.font.nativeHeight * 2) - 9)));
        uiMeshes.push(uiComponents.clipboardLabel(clipboardLabel, margin, (Rsed.visual.canvas.height - Rsed.ui.canvas.font.nativeHeight - 5)));
        
        if (Rsed.browserMetadata.has_url_param("showFPS"))
        {
            uiMeshes.push(uiComponents.fpsIndicator(margin, 33, Rsed.core.ticksPerSecond));
        }

        if (sceneState.showPalatPane)
        {
            uiMeshes.push(uiComponents.palatPane((Rsed.visual.canvas.width - 6), 38));
        }
        else if (sceneState.showTextPane)
        {
            uiMeshes.push(uiComponents.textPane((Rsed.visual.canvas.width - 6), 38));
        }
        else if (sceneState.showAnimsPane)
        {
            uiMeshes.push(uiComponents.animsPane((Rsed.visual.canvas.width - 6), 38));
        }

        Rngon.render({
            target: Rsed.visual.canvas.domElementUi,
            meshes: uiMeshes,
            options: {
                cameraPosition: Rngon.vector(0, 0, 0),
                resolution: Rsed.visual.canvas.resolution(),
                useDepthBuffer: false,
            },
            pipeline: {
                rasterizer: Rsed.scenes.$render.rasterizer,
            },
        });

        return;
    }

    function draw_scene()
    {
        if (!texture)
        {
            Rsed.throw_if(Rsed.$currentProject.isPlaceholder,
                            "Expected project data to have been loaded already.");

            scene.set_texture(Rsed.$currentProject.palat.texture[3]);
        }

        camera.update();
        textureInfo.width = ~~(texture.width * camera.zoomLevel);
        textureInfo.height = ~~(texture.height * camera.zoomLevel);
        textureInfo.offsetX = ~~((-camera.position.x) - (textureInfo.width / 2));
        textureInfo.offsetY = ~~(camera.position.y - (textureInfo.height / 2));

        const textureNgon = Rngon.ngon([
            Rngon.vertex(textureInfo.offsetX                  , textureInfo.offsetY),
            Rngon.vertex(textureInfo.offsetX+textureInfo.width, textureInfo.offsetY),
            Rngon.vertex(textureInfo.offsetX+textureInfo.width, textureInfo.offsetY+textureInfo.height),
            Rngon.vertex(textureInfo.offsetX                  , textureInfo.offsetY+textureInfo.height)], {
                isInScreenSpace: true,
                texture: texture,
                $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                    componentId: "texture",
                    cursor: Rsed.ui.dom.cursorHandler.cursors.pencil,
                }),
            }
        );

        const label = text_mesh(texture.name, textureInfo.offsetX, textureInfo.offsetY - Rsed.ui.canvas.font.nativeHeight - 3);

        const {renderWidth, renderHeight} = Rngon.render({
            target: Rsed.visual.canvas.domElement,
            meshes: [Rngon.mesh([textureNgon]), label],
            options: {
                resolution: Rsed.visual.canvas.resolution(),
                fov: 45,
                nearPlane: 0,
                farPlane: 10000,
                useDepthBuffer: false,
            },
            pipeline: {
                rasterizer: Rsed.scenes.$render.rasterizer,
            },
        });

        // If the rendering was resized since the previous frame...
        if ((renderWidth !== Rsed.visual.canvas.width ||
            (renderHeight !== Rsed.visual.canvas.height)))
        {
            Rsed.visual.canvas.width = renderWidth;
            Rsed.visual.canvas.height = renderHeight;

            window.close_dropdowns();
        }

        return;
    }

    function rotate(texture)
    {
        if (!texture)
        {
            Rsed.ui.dom.popup_notification("No texture data to rotate.", {
                notificationType: "error",
            });

            return false;
        }

        if (texture.width != texture.height)
        {
            Rsed.ui.dom.popup_notification("Only square textures can be rotated.", {
                notificationType: "warning",
            });

            return false;
        }

        const indices = [...texture.indices];

        // Rotate by 90 degrees.
        for (let y = 0; y < (texture.height - 1); y++)
        {
            for (let x = y; x < texture.width; x++)
            {
                const idx1 = (x + y * texture.width);
                const idx2 = (y + x * texture.width);

                [indices[idx1], indices[idx2]] = [indices[idx2], indices[idx1]];
            }
        }

        // Mirror.
        for (let x = 0; x < (texture.width / 2); x++)
        {
            for (let y = 0; y < texture.height; y++)
            {
                const idx1 = (x + y * texture.width);
                const idx2 = ((texture.width - 1 - x) + y * texture.width);

                [indices[idx1], indices[idx2]] = [indices[idx2], indices[idx1]];
            }
        }

        Rsed.ui.utils.assetMutator.user_edit("texture", {
            command: "set-all-pixels",
            target: {texture},
            data: indices,
        });

        Rsed.ui.dom.popup_notification("Rotated left.");

        return true;
    }

    function reset_clipboard()
    {
        clipboard = undefined;

        return;
    }

    // Copies the current texture onto the clipboard. Returns true on success,
    // false otherwise.
    function copy_to_clipboard(texture)
    {
        if (!texture)
        {
            Rsed.ui.dom.popup_notification("No texture to copy.", {
                notificationType: "error",
            });

            return false;
        }

        clipboard = {
            width: texture.width,
            height: texture.height,
            colorIndices: [...texture.indices],
            source: texture,
        };

        Rsed.ui.dom.popup_notification("Copied to clipboard.");

        return true;
    }

    // Overrides the current texture's data with the texture data from the clipboard,
    // if the clipboard contains compatible data. Returns true if the data were copied,
    // false otherwise.
    function paste_from_clipboard()
    {
        if (!clipboard)
        {
            Rsed.ui.dom.popup_notification("The clipboard is empty.", {
                notificationType: "warning",
            });

            return false;
        }

        if ((texture.width != clipboard.width) ||
            (texture.height != clipboard.height))
        {
            Rsed.ui.dom.popup_notification("The clipboard's resolution doesn't match. It can't be pasted here.", {
                notificationType: "warning",
            });

            return false;
        }
        
        Rsed.ui.utils.assetMutator.user_edit("texture", {
            command: "set-all-pixels",
            target: {texture},
            data: clipboard.colorIndices,
        });

        Rsed.ui.dom.popup_notification("Pasted from clipboard.")

        return true;
    }

    function update_cursor_graphic()
    {
        const cursors = Rsed.ui.dom.cursorHandler.cursors;
        const mousePos = Rsed.ui.utils.inputState.mouse_pos_scaled_to_render_resolution();
        const pickElement = Rsed.ui.utils.inputState.mousePickBuffer[mousePos.x + mousePos.y * Rsed.visual.canvas.width];
        const isCursorOnTexture = (pickElement && (pickElement.componentId === "texture"));
        const mouseHover = Rsed.ui.utils.inputState.current_mouse_hover();

        let cursor = cursors.default;

        if (mouseHover && mouseHover.cursor)
        {
            cursor = mouseHover.cursor;
        }
        else if (isCursorOnTexture)
        {
            if (Rsed.ui.utils.inputState.key_down("tab"))
            {
                cursor = cursors.eyedropper;
            }
            else
            {
                cursor = cursors.pencil;
            }
        }

        Rsed.ui.dom.cursorHandler.set_cursor(cursor);
        
        return;
    }

    function handle_mouse_input()
    {
        if (!texture)
        {
            return;
        }

        const mousePos = Rsed.ui.utils.inputState.mouse_pos_scaled_to_render_resolution();
        const hover = Rsed.ui.utils.inputState.current_mouse_hover();
        const grab = Rsed.ui.utils.inputState.current_mouse_grab();

        // Handle painting the texture.
        if (
            (grab?.type == "ui-component") &&
            (grab.componentId === "texture") &&
            (hover?.componentId === grab.componentId)
        ){
            const textureX = Math.floor((mousePos.x - textureInfo.offsetX) / camera.zoomLevel);
            const textureY = Math.floor((textureInfo.height - (mousePos.y - textureInfo.offsetY) - 1) / camera.zoomLevel);
            const colorIdxUnderCursor = texture.indices[textureX + textureY * texture.width];

            // Eyedropper.
            if (Rsed.ui.utils.inputState.key_down("tab"))
            {
                uiComponents.colorSelector.set_color_idx(colorIdxUnderCursor);
                sceneState.penColorIdx = colorIdxUnderCursor;

                // Only allow the eyedropper to select one pixel per click, so you don't get
                // flicker in the color selector if the mouse is moved while holding the click.
                Rsed.ui.utils.inputState.reset_mouse_buttons_state();
            }
            else
            {
                if (colorIdxUnderCursor !== sceneState.penColorIdx)
                {
                    Rsed.ui.utils.assetMutator.user_edit("texture", {
                        command: "set-pixel",
                        target: {
                            texture,
                            u: textureX,
                            v: textureY,
                        },
                        data: sceneState.penColorIdx,
                    });
                }
            }
        }
        else
        {
            camera.handle_mouse_input();
        }
        
        return;
    }

    function text_mesh(string = "", originX = 0, originY = 0)
    {
        const ngons = [];
        let runningXOffs = 0;
        const letterSpacing = 1;

        // Convert the string's characters into polygons for display.
        for (const ch of string.split(""))
        {
            const symbol = Rsed.ui.canvas.font.character(ch.toUpperCase());

            ngons.push(ngon({
                x: originX + 1 + (runningXOffs + symbol.offsetX),
                y: originY + 1 + symbol.offsetY,
                width: symbol.width,
                height: symbol.height,
                texture: symbol.texture,
                material: {
                    allowAlphaReject: true,
                },
            }));

            runningXOffs += (symbol.width + symbol.offsetX + letterSpacing);
        }

        // Background color.
        ngons.unshift(ngon({
            x: originX,
            y: originY,
            width: (runningXOffs + 1),
            height: (Rsed.ui.canvas.font.nativeHeight + 2),
            material: {
                color: Rsed.visual.palette.YELLOW,
            },
        }));

        return Rngon.mesh(ngons);

        function ngon({
            x,
            y,
            texture,
            width,
            height,
            material = {}
        } = {})
        {
            return Rngon.ngon([
                Rngon.vertex(x        , y),
                Rngon.vertex(x + width, y),
                Rngon.vertex(x + width, y + height),
                Rngon.vertex(x        , y + height)], {
                    isInScreenSpace: true,
                    texture: texture,
                    ...material,
                }
            );
        }
    }
})();
/*
 * Most recent known filename: js/scene/tilemap-editor/tilemap-editor.js
 *
 * 2019-2023 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// A top-down view of the project's VARIMAA data as a tilemap. Lets the user paint
// onto the tilemap.
Rsed.scenes["tilemap-editor"] = (function()
{
    const camera = Rsed.scenes.$camera2D({
        zoomLevel: 1,
        movementSpeed: 2.5,
        zoomSpeed: 0.15,
        x: 200,
        y: 100
    });

    // A representation of the track's VARIMAA data.
    const tilemap = {
        texture: undefined,
        mesh: Rngon.mesh([]),
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0,
    };

    // The latest known size of the canvas we're rendering to.
    let knownCanvasSizeX = 0;
    let knownCanvasSizeY = 0;

    const sceneState = {
        // Whether to show the PALAT pane; i.e. a side panel that displays all the available
        // PALA textures.
        showPalatPane: false,
    };

    const uiComponents = {
        activePala: Rsed.ui.canvas.component.activePala({
            on_grab: function()
            {
                sceneState.showPalatPane = !sceneState.showPalatPane;
                Rsed.ui.utils.inputState.reset_mouse_grab();
            },
        }),
        palatPane: Rsed.ui.canvas.component.palatPane({
            on_grab: function(event)
            {
                Rsed.ui.utils.terrainBrush.textureIdx = event.palaIdx;
            },
        }),
        editorSelector: Rsed.ui.canvas.component.editorSelector(),
        fpsIndicator: Rsed.ui.canvas.component.valueGraph({
            title: "FPS",
            labelOnly: true,
        }),
        footer: Rsed.ui.canvas.component.label(),
    };
    
    const scene = Rsed.scene({
        render: function()
        {
            if (!tilemap.texture)
            {
                this.refresh_tilemap();
            }

            process_user_input();
            Rsed.ui.utils.inputState.mousePickBuffer.fill(null);

            draw_scene();
            draw_ui();

            return;
        },
        
        refresh_tilemap: function()
        {
            const width = Rsed.$currentProject.varimaa.width;
            const height = Rsed.$currentProject.varimaa.height;
            tilemap.texture = Rsed.visual.texture({
                width,
                height,
                indices: new Array(width * height),
            });

            knownCanvasSizeX = Rsed.visual.canvas.width;
            knownCanvasSizeY = Rsed.visual.canvas.height;

            refresh_tilemap_texture();

            return;
        },

        process_key_release: function(key)
        {
            if (camera.process_key_release(key))
            {
                return;
            }
            
            return;
        },

        process_key_press: function(key, repeat = false)
        {
            if (camera.process_key_press(key))
            {
                return;
            }

            function key_is(compared)
            {
                return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
            }

            if (Rsed.ui.utils.inputState.any_modifier_key_down())
            {
                if (key_is("z"))
                {
                    if (Rsed.ui.utils.inputState.key_down("control") &&
                        Rsed.ui.utils.inputState.key_down("shift"))
                    {
                        Rsed.ui.utils.undoStack.redo();
                        scene.refresh_tilemap();
                    }
                    else if (Rsed.ui.utils.inputState.key_down("control"))
                    {
                        Rsed.ui.utils.undoStack.undo();
                        scene.refresh_tilemap();
                    }
                }
                else if (key_is("y") &&
                         Rsed.ui.utils.inputState.key_down("control") )
                {
                    Rsed.ui.utils.undoStack.redo();
                }
                else if (key_is("s") &&
                         Rsed.ui.utils.inputState.key_down("control"))
                {
                    Rsed.$currentProject.download_as_zip();
                }
            }
            else
            {
                if (key_is("q"))
                {
                    Rsed.$currentScene = "terrain-editor";
                }
                else if (key_is("a") && !repeat)
                {
                    sceneState.showPalatPane = !sceneState.showPalatPane;
                }
                else
                {
                    for (const brushSizeKey of ["1", "2", "3", "4", "5"])
                    {
                        if (key_is(brushSizeKey))
                        {
                            Rsed.ui.utils.terrainBrush.radius = ((brushSizeKey == 5)? 8 : (brushSizeKey - 1));
                        }
                    }
                }
            }

            return;
        },
    });

    return scene;

    function refresh_tilemap_texture()
    {
        for (let y = 0; y < tilemap.texture.height; y++)
        {
            for (let x = 0; x < tilemap.texture.width; x++)
            {
                const tile = Rsed.$currentProject.varimaa.tile_at(x, (tilemap.texture.height - y - 1));
                const texture = Rsed.$currentProject.palat.texture[tile];
                tilemap.texture.indices[x + y * tilemap.texture.width] = (texture?.indices[1] || 0);
            }
        }

        return;
    }

    function draw_ui()
    {
        const uiMeshes = [];
        const margin = 4;

        if ((Rsed.visual.canvas.width <= 0) ||
            (Rsed.visual.canvas.height <= 0))
        {
            return;
        }
        
        uiMeshes.push(...uiComponents.editorSelector(margin+1, margin+1));
        uiMeshes.push(uiComponents.activePala((Rsed.visual.canvas.width - margin), (margin - 1)));
        uiMeshes.push(uiComponents.footer(`Map size: ${Rsed.$currentProject.maasto.width} * ${Rsed.$currentProject.maasto.width}`, margin, (Rsed.visual.canvas.height - Rsed.ui.canvas.font.nativeHeight - 5)));

        if (sceneState.showPalatPane)
        {
            uiMeshes.push(uiComponents.palatPane((Rsed.visual.canvas.width - margin) - 2, 38));
        }

        if (Rsed.browserMetadata.has_url_param("showFPS"))
        {
            uiMeshes.push(uiComponents.fpsIndicator(margin, 33, Rsed.core.ticksPerSecond));
        }

        Rngon.render({
            target: Rsed.visual.canvas.domElementUi,
            meshes: uiMeshes,
            options: {
                resolution: Rsed.visual.canvas.resolution(),
                useDepthBuffer: false,
            },
            pipeline: {
                rasterizer: Rsed.scenes.$render.rasterizer,
            },
        });

        return;
    }

    function draw_scene()
    {
        if ((Rsed.visual.canvas.width != knownCanvasSizeX) ||
            (Rsed.visual.canvas.height != knownCanvasSizeY) ||
            (Rsed.$currentProject.varimaa.width != tilemap.texture.width) ||
            (Rsed.$currentProject.varimaa.height != tilemap.texture.height))
        {
            scene.refresh_tilemap();
        }

        camera.update();
        tilemap.width = ~~(tilemap.texture.width * 2 * camera.zoomLevel);
        tilemap.height = ~~(tilemap.texture.height * camera.zoomLevel);
        tilemap.offsetX = ~~((-camera.position.x) - (tilemap.width / 2));
        tilemap.offsetY = ~~(camera.position.y - (tilemap.height / 2));

        // The tilemap n-gon is a rectangle textured with the tilemap's pixels.
        const tilemapNgon = Rngon.ngon([
            Rngon.vertex(tilemap.offsetX              , tilemap.offsetY),
            Rngon.vertex(tilemap.offsetX+tilemap.width, tilemap.offsetY),
            Rngon.vertex(tilemap.offsetX+tilemap.width, tilemap.offsetY+tilemap.height),
            Rngon.vertex(tilemap.offsetX              , tilemap.offsetY+tilemap.heightA)], {
                isInScreenSpace: true,
                texture: tilemap.texture,
                $mousePickId: Rsed.ui.utils.mouse_picking_element("ui-component", {
                    componentId: "tilemap",
                    cursor: Rsed.ui.dom.cursorHandler.cursors.pencil,
                }),
            }
        );

        const {renderWidth, renderHeight} = Rngon.render({
            target: Rsed.visual.canvas.domElement,
            meshes: [Rngon.mesh([tilemapNgon])],
            options: {
                resolution: Rsed.visual.canvas.resolution(),
                fov: 45,
                nearPlane: 0,
                farPlane: 10,
                useDepthBuffer: false,
            },
            pipeline: {
                rasterizer: Rsed.scenes.$render.rasterizer,
            }
        });

        // If the rendering was resized since the previous frame...
        if ((renderWidth !== Rsed.visual.canvas.width ||
            (renderHeight !== Rsed.visual.canvas.height)))
        {
            Rsed.visual.canvas.width = renderWidth;
            Rsed.visual.canvas.height = renderHeight;

            window.close_dropdowns();
        }
        
        return;
    }

    function process_user_input()
    {
        handle_mouse_input();
        update_cursor_graphic();

        return;
    }

    function update_cursor_graphic()
    {
        const cursors = Rsed.ui.dom.cursorHandler.cursors;
        const mousePos = Rsed.ui.utils.inputState.mouse_pos_scaled_to_render_resolution();
        const pickElement = Rsed.ui.utils.inputState.mousePickBuffer[mousePos.x + mousePos.y * Rsed.visual.canvas.width];
        const mouseHover = Rsed.ui.utils.inputState.current_mouse_hover();
        const isCursorOnTilemap = (pickElement && (pickElement.componentId === "tilemap"));

        let cursor = cursors.default;
            
        if (mouseHover && mouseHover.cursor)
        {
            cursor = mouseHover.cursor;
        }
        else if (isCursorOnTilemap)
        {
            cursor = cursors.pencil;
        }
        else
        {
            cursor = cursors.default;
        }

        Rsed.ui.dom.cursorHandler.set_cursor(cursor);
        
        return;
    }

    function handle_mouse_input()
    {
        const mousePos = Rsed.ui.utils.inputState.mouse_pos_scaled_to_render_resolution();
        const hover = Rsed.ui.utils.inputState.current_mouse_hover();
        const grab = Rsed.ui.utils.inputState.current_mouse_grab();

        // Handle painting the tilemap.
        if (
            (grab?.type == "ui-component") &&
            (grab.componentId === "tilemap") &&
            (hover?.componentId === grab.componentId)
        ){
            const tilemapX = Math.floor(((mousePos.x - tilemap.offsetX) / camera.zoomLevel) / 2);
            const tilemapY = Math.floor((mousePos.y - tilemap.offsetY) / camera.zoomLevel);

            Rsed.ui.utils.terrainBrush.apply({
                target: "varimaa-value",
                data: Rsed.ui.utils.terrainBrush.textureIdx,
                x: tilemapX,
                y: tilemapY
            });

            refresh_tilemap_texture();
        }
        else
        {
            camera.handle_mouse_input();
        }
        
        return;
    }
})();
/*
 * Most recent known filename: js/scene/loading-spinner/loading-spinner.js
 *
 * 2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Displays an infinite loading animation.
Rsed.scenes["loading-spinner"] = (function()
{
    let rotation = 0;

    const scene = Rsed.scene({
        render: function()
        {
            draw_scene();
            draw_ui();

            return;
        },
    });

    return scene;

    function draw_scene()
    {
        rotation += 2;

        const label = Rsed.ui.canvas.component.label()("...", -2, -4);
        for (const ngon of label.ngons)
        {
            ngon.material.isInScreenSpace = false;
        }
        label.rotate.x = 180;
        label.scale.x = .3+Math.sin(rotation/50)/10;
        label.scale.y = .3+Math.sin(rotation/50)/10;
        
        const {renderWidth, renderHeight} = Rngon.render({
            target: Rsed.visual.canvas.domElement,
            meshes: [label],
            options: {
                cameraPosition: Rngon.vector(0, 0, -18),
                resolution: Rsed.visual.canvas.resolution(),
                useDepthBuffer: false,
            },
            pipeline: {
                rasterizer: Rsed.scenes.$render.rasterizer,
            },
        });

        // If the rendering was resized since the previous frame.
        if ((renderWidth !== Rsed.visual.canvas.width ||
            (renderHeight !== Rsed.visual.canvas.height)))
        {
            Rsed.visual.canvas.width = renderWidth;
            Rsed.visual.canvas.height = renderHeight;
        }

        return;
    }

    function draw_ui()
    {
        const width = Rsed.visual.canvas.width;
        const height = Rsed.visual.canvas.height;

        if ((width <= 0) || (height <= 0))
        {
            return;
        }

        // Clear the UI.
        Rngon.render({
            target: Rsed.visual.canvas.domElementUi,
            meshes: [],
            options: {
                resolution: Rsed.visual.canvas.resolution(),
            },
        });

        return;
    }
})();
/*
 * Most recent known filename: js/core/core.js
 *
 * 2018-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.core = (function()
{
    // Set to true while the core is running (e.g. as a result of calling start()).
    let coreIsRunning = false;

    let ticksPerSecond = 0;

    // The arguments passed to the most recent call to .start().
    let startupArgs = {};

    // The project we've currently got loaded. When the user makes edits or requests a save,
    // this is the target project.
    let project = Rsed.project.placeholder;

    // The scene we're currently displaying to the user.
    let scene = Rsed.scenes["loading-spinner"];

    // The number of milliseconds elapsed between the most recent tick and the one
    // preceding it. E.g. at 60 FPS this would be about 16.
    let tickDeltaMs = 0;

    const publicInterface =
    {
        get ticksPerSecond()
        {
            return ticksPerSecond;
        },

        get tickDeltaMs()
        {
            return tickDeltaMs;
        },

        default_startup_args: function()
        {
            return {
                project:
                {
                    // Whether the project's data files will be loaded from RallySportED-js's server
                    // ("server-rsed") or from RallySportED's track archive on GitHub ("server-github").
                    dataLocality: "server-rsed", // | "server-github"
        
                    // An identifier for this project's data. For server-side projects, this will be
                    // e.g. a Rally-Sport Content track resource ID, and for client-side data a file
                    // reference.
                    contentId: "demod",
                },

                ui:
                {
                    showMenubar: true,
                },

                renderer:
                {
                    pixelatedUpscale: true,
                },

                // Which scene (of Rsed.scenes.xxxx) to show by default.
                scene: "terrain-editor",

                // If the user is viewing a stream, its id will be set here.
                stream: null,
            }
        },

        // Starts up RallySportED with the given project to edit.
        start: async function(args = {})
        {
            Rsed.throw_if_not_type("object", args);

            // Modify the renderer's default polygon material. This only needs to be
            // done once, after the renderer's script has been importent. For reasons
            // of lazy we're doing it here rather than in a more suitable place.
            Rngon.default.ngon.material.isTwoSided = true;
            Rngon.default.ngon.material.color = Rsed.visual.palette.WHITE;
            
            args = {
                ...Rsed.core.default_startup_args(),
                ...args,
            };

            startupArgs = args;
            
            // Hide the UI while we load up the project's data etc.
            Rsed.ui.dom.html.set_visible(false);

            coreIsRunning = false;
            project = Rsed.project.placeholder;
            Rsed.$currentScene = "loading-spinner";
            document.body.classList.add("loading");

            await load_project(args.project);
            
            if (args.renderer.pixelatedUpscale)
            {
                document.getElementById("base-render").classList.add("pixelated");
            }
            else
            {
                document.getElementById("base-render").classList.remove("pixelated");
            }

            if (Rsed.player.runOnStartup)
            {
                Rsed.player.play_with_opponent();
            }
            else
            {
                Rsed.$currentScene = (args.scene || "terrain-editor");
                Rsed.ui.dom.html.refresh();
                Rsed.ui.dom.html.set_visible(args.ui.showMenubar);
                Rsed.browserMetadata.warn_of_incompatibilities();
            }

            coreIsRunning = true;
            document.body.classList.remove("loading");
            Rsed.iframeListener.send_message?.("project:loaded", Rsed.$currentProject.name);

            return;
        },

        // Something went fatally wrong and the app can't recover from it. All that's
        // left to do is to shut everything down and ask the user to reload.
        panic: function(errorMessage)
        {
            Rsed.ui.dom.html.display_blue_screen(errorMessage);

            coreIsRunning = false;

            publicInterface.start = ()=>{}; // Prevent restarting from code.
        },

        current_project: function()
        {
            Rsed.assert?.((project !== null), "Attempting to access an uninitialized project.");

            return project;
        },

        current_scene: function()
        {
            Rsed.assert?.((scene !== null), "Attempting to access an uninitialized scene.");

            return scene;
        },

        set_scene: function(sceneName)
        {
            Rsed.assert?.(Rsed.scenes[sceneName], "Attempting to set an unknown scene.");

            Rsed.ui.utils.inputState.reset_keys();
            scene = Rsed.scenes[sceneName];

            // If we've switched to the tilemap scene, make sure it's reflecting
            // any changes we may have made to the track in the previous scene.
            if (scene == Rsed.scenes["tilemap-editor"])
            {
                scene.refresh_tilemap();
            }

            return;
        },
    }

    startupArgs = publicInterface.default_startup_args();
    tick();

    return publicInterface;

    // Called once per frame to orchestrate program flow.
    function tick(timestamp = 0, timeDeltaMs = 0)
    {
        if (
            ((project !== Rsed.project.placeholder) || (scene === Rsed.scenes["loading-spinner"])) &&
            !Rsed.player.is_playing()
        ){
            tickDeltaMs = timeDeltaMs;
            ticksPerSecond = Math.round(1000 / (timeDeltaMs || 1));
            Rsed.visual.canvas.aspectRatio = (window.innerWidth / window.innerHeight);

            scene.render();
            Rsed.ui.utils.inputState.update_mouse_hover();
        }

        window.requestAnimationFrame((newTimestamp)=>tick(newTimestamp, (newTimestamp - timestamp)));
    }

    async function load_project(projectMeta)
    {
        window.close_dropdowns();
        Rsed.ui.utils.undoStack.reset();
        project = await Rsed.project(projectMeta);
        Object.values(Rsed.scenes).forEach(s=>s.reset?.());
    }
})();
