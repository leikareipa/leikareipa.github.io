/*
 * 2021 Tarpeeksi Hyvae soft
 *
 */

const dosboxContainer = document.getElementById("dosbox-container");
const dosboxCanvas = document.getElementById("jsdos-canvas");
let jsdosInterface = null;

const dosboxNativeResolution = {
    width: 320,
    height: 200
};

const jsdosOptions = {
    wdosboxUrl: "./js-dos/wdosbox.js",
    onerror: (error)=>{throw error},
};

const dosboxCanvasScaler = {
    // Stretch as close to the size of the viewport as an integer multiple will
    // allow, keeping DOSBox's pixel and resolution aspect ratios and not
    // overflowing the viewport.
    contain_integer: function()
    {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const widthRatio = Math.max(1, Math.floor(viewportWidth / dosboxNativeResolution.width));
        const heightRatio = Math.max(1, Math.floor(viewportHeight / dosboxNativeResolution.height));
        const multiplier = Math.min(widthRatio, heightRatio);
    
        const width = (dosboxNativeResolution.width * multiplier);
        const height = (dosboxNativeResolution.height * multiplier);
    
        dosboxContainer.style.width = `${width}px`;
        dosboxContainer.style.height = `${height}px`;
    },

    native: function()
    {
        dosboxContainer.style.width = `${dosboxNativeResolution.width}px`;
        dosboxContainer.style.height = `${dosboxNativeResolution.height}px`;
    },

    // Scale to twice the size of DOSBox's native resolution. May overflow the
    // viewport.
    double: function()
    {
        /// TODO (potentially).
    },

    // Scale to thrice the size of DOSBox's native resolution. May overflow the
    // viewport.
    triple: function()
    {
        /// TODO (potentially).
    },

    // Stretch to the size of the viewport, ignoring DOSBox's resolution aspect
    // ratio.
    stretch: function()
    {
        /// TODO (potentially).
    },

    // Stretch to the size of the viewport, keeping DOSBox's resolution aspect
    // ratio.
    contain: function()
    {
        /// TODO (potentially).
    },
}

export async function start_dosbox(args = {})
{
    args = {
        ...{
            dosboxMasterVolume: "17:17",
            dosboxRunCommand: "",
            contentZipFilename: "",
            contentTitle: undefined,
        },
        ...args
    };

    if (jsdosInterface)
    {
        stop_dosbox();
    }

    try
    {
        dosboxCanvasScaler.contain_integer();
        window.addEventListener("resize", dosboxCanvasScaler.contain_integer);

        const contentZipFile = await (async()=>
        {
            try
            {
                const response = await fetch(args.contentZipFilename);

                if (!response.ok) {
                    throw `${response.status} (${response.statusText})`;
                }

                return await response.blob();
            }
            catch (error)
            {
                throw new Error("Failed to fetch the content file: " + error);
            }
        })();

        const jsdosInstance = await (async()=>
        {
            try
            {
                return await Dos(dosboxCanvas, jsdosOptions);
            }
            catch (error)
            {
                throw new Error("Failed to create a DOSBox instance: " + error);
            }
        })();

        try
        {
            await jsdosInstance.fs.extract(URL.createObjectURL(contentZipFile));
        }
        catch (error)
        {
            throw new Error("Failed to extract the content file on the DOSBox instance: " + error);
        }

        try
        {
            jsdosInterface = await jsdosInstance.main([
                "-conf", "dosbox.conf",
                "-c", `mixer master ${args.dosboxMasterVolume}`,
                "-c", args.dosboxRunCommand,
            ]);
        }
        catch (error)
        {
            throw new Error("Failed to execute main() on the DOSBox instance: " + error);
        }

        dosboxContainer.classList.add("running");
        window.document.title = (args.contentTitle == undefined)
                                ? "DOSBox"
                                : `${args.contentTitle} - DOSBox`;
    }
    catch (error)
    {
        console.error("Could not run DOSBox. " + error);
    }

    return jsdosInterface;
}

export function stop_dosbox()
{
    if (jsdosInterface &&
        (jsdosInterface.exit() === 0))
    {
        throw new Error("Failed to terminate DOSBox.")
    }

    jsdosInterface = null;

    dosboxContainer.classList.remove("running");

    return;
}
