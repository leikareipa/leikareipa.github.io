/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

export default w95.widget(function dosboxWidget({
    x = 0,
    y = 0,
    width = 100,
    height = 22,
    filename = "./qb.zip",
    run = "",
    onInitialized,
} = {})
{
    w95.debug?.assert(typeof x === "number");
    w95.debug?.assert(typeof y === "number");
    w95.debug?.assert(typeof width === "number");
    w95.debug?.assert(typeof height === "number");

    const jsdosCanvasEl = w95.state(document.createElement("canvas"));
    const jsdosInterface = w95.state(undefined);

    let jsdosResolutionObserver = undefined;

    const canvasWidth = (width - 4);
    const canvasHeight = (height - 4);

    return {
        get x() { return x },
        get y() { return y },
        get width() { return width },
        get height() { return height },
        Mounted() {
            // Watch for resolution changes in DOSBox, which are reflected in
            // the 'width' and 'height' attributes of the jsdos canvas.
            {
                jsdosResolutionObserver = new MutationObserver(()=>{
                    jsdosCanvasEl.now.style.width = `${canvasWidth * w95.shell.display.scale}px`;
                    jsdosCanvasEl.now.style.height = `${canvasHeight * w95.shell.display.scale}px`;
                });
                jsdosResolutionObserver.observe(jsdosCanvasEl.now, { 
                    attributes: true, 
                    attributeFilter: ["width", "height"],
                });
            }
        },
        Opened() {
            initialize_dosbox();
        },
        Closed() {
            jsdosInterface.now.exit();  
            jsdosCanvasEl.now.remove();
        },
        BeforeAppExit() {
            if (!jsdosInterface.now) {
                return false;
            }
        },
        BeforeUnmount() {
            jsdosResolutionObserver.disconnect();
        },
        Form() {
            return w95.widget.frame({
                width,
                height,
                shape: w95.frameShape.input,
                children: [
                    w95.widget.domElement({
                        x: 2,
                        y: 2,
                        width: canvasWidth,
                        height: canvasHeight,
                        element: jsdosCanvasEl.now,
                        addToDom: false,
                        className: "jsdos-canvas",
                    }, {hideIf: !jsdosInterface.now}),
                ],
            });
        },
    };

    async function initialize_dosbox() {
        if (document.getElementById("jsdos-canvas")) {
            return false;
        }
        
        document.body.append(jsdosCanvasEl.now);
        jsdosCanvasEl.now.style.zIndex = -1;

        const zipFile = await fetch(filename).then(response=>response.blob());
        const jsdosInstance = await Dos(jsdosCanvasEl.now, {wdosboxUrl: "https://leikareipa.github.io/dosbox/js-dos/wdosbox.js"});
        await jsdosInstance.fs.extract(URL.createObjectURL(zipFile));
        jsdosInterface.set(await jsdosInstance.main(["-conf", "dosbox.conf"]));
        await jsdosInterface.now.shell(...[run].flat());

        document.body.append(jsdosCanvasEl.now);
        document.querySelector(".dosbox-container").remove();

        onInitialized?.();
    }
});
