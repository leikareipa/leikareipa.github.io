/*
 * 2021 Tarpeeksi Hyvae soft
 *
 */

let isDosboxRunning = false;
let jsDosController = null;

const dosboxContainer = document.getElementById("jsdos-container");
const dosboxCanvas = document.getElementById("jsdos-canvas");

function report_error(error)
{
    window.alert(error);

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

    if (jsDosController)
    {
        stop_dosbox();
    }

    dosboxContainer.style.display = "initial";
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
        
        jsDosController = await main([
            "-conf", "dosbox.conf",
            "-c", `mixer master ${args.dosboxMasterVolume}`,
            "-c", args.dosboxRunCommand,
        ]);

        window.document.title= (args.contentTitle == undefined)
                               ? "DOSBox"
                               : `${args.contentTitle} - DOSBox`;

        isDosboxRunning = true;
    });

    return;
}

export function stop_dosbox()
{
    if (jsDosController)
    {
        jsDosController.exit();
    }

    jsDosController = null;
    isDosboxRunning = false;

    dosboxCanvas.getContext("2d").clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    dosboxContainer.style.display = "none";
    dosboxContainer.classList.remove("running");
}
