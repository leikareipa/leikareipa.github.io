/*
 * 2021 Tarpeeksi Hyvae soft
 *
 */

let isDosboxRunning = false;
let jsdosController = null;

const dosboxContainer = document.getElementById("jsdos-container");
const dosboxCanvas = document.getElementById("jsdos-canvas");

function resize_canvas_to_fit_window()
{
    const mulWidth = Math.max(1, Math.floor(window.innerWidth / 320));
    const mulHeight = Math.max(1, Math.floor(window.innerHeight / 200));
    const multiplier = Math.min(mulWidth, mulHeight);

    const width = (320 * multiplier);
    const height = (200 * multiplier);

    dosboxContainer.style.width = `${width}px`;
    dosboxContainer.style.height = `${height}px`;

    return;
}

export async function start_dosbox(args = {})
{
    args = {
        ...{
            dosboxMasterVolume: "17:17",
            dosboxRunCommand: "mem",
            contentZipFilename: "",
            contentTitle: undefined,
        },
        ...args
    };

    if (jsdosController)
    {
        stop_dosbox();
    }

    dosboxContainer.classList.add("running");

    const jsdosOptions = {
        wdosboxUrl: "./js-dos/wdosbox.js",
        onerror: (error)=>{throw new Error(error)},
    };

    const contentZipFile = await fetch(args.contentZipFilename);

    if (!contentZipFile.ok) {
        throw new Error("Failed to fetch the content file.");
    }

    await Dos(dosboxCanvas, jsdosOptions).ready(async(fileSystem, main)=>
    {
        try
        {
            await fileSystem.extract(URL.createObjectURL(await contentZipFile.blob()));
        }
        catch (error)
        {
            throw new Error("Invalid content file.");
        }
        
        jsdosController = await main([
            "-conf", "dosbox.conf",
            "-c", `mixer master ${args.dosboxMasterVolume}`,
            "-c", args.dosboxRunCommand,
        ]);

        window.document.title= (args.contentTitle == undefined)
                               ? "DOSBox"
                               : `${args.contentTitle} - DOSBox`;

        isDosboxRunning = true;

        resize_canvas_to_fit_window();
        window.addEventListener("resize", resize_canvas_to_fit_window);
    });

    return;
}

export function stop_dosbox()
{
    if (jsdosController)
    {
        jsdosController.exit();
    }

    jsdosController = null;
    isDosboxRunning = false;

    dosboxCanvas.getContext("2d").clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    dosboxContainer.style.display = "none";
    dosboxContainer.classList.remove("running");

    return;
}
