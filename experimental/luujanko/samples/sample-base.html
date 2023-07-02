<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport"
              content="width=device-width">
        <meta http-equiv="content-type"
              content="text/html; charset=UTF-8">
        <link rel="stylesheet"
              type="text/css"
              href="./sample-base.css">
        <link rel="stylesheet"
              href="https://use.fontawesome.com/releases/v5.6.1/css/all.css"
              integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP"
              crossorigin="anonymous">
        <title>Sample template - Luujanko</title>
    </head>
    <body>
        <div id="loading-bar">
            <i class="fas fa-skiing fa-fw spin"
               style="position: relative;
                      padding-bottom: 50px;
                      top: -25px;
                      left: -25px;
                      margin-right: 10px;"></i>
            Loading render sample...
        </div>

        <div id="luujanko-rendering-container">
            <svg id="luujanko-rendering"
                 style="pointer-events: none;">
            </svg>
        </div>

        <div class="infoboxes-container" style="visibility: hidden;">
            <div class="infobox polycount">
                <div class="title">Polygons</div>
                <div class="value"><i style="color: gray;" class="fas fa-sm fa-spin fa-spinner"></i></div>
            </div>
            <div class="infobox render-fps">
                <div class="title">FPS</div>
                <div class="value"><i style="color: gray;" class="fas fa-sm fa-spin fa-spinner"></i></div>
            </div>
            <div class="infobox screen-fps">
                <div class="title">Hz</div>
                <div class="value"><i style="color: gray;" class="fas fa-sm fa-spin fa-spinner"></i></div>
            </div>
        </div>
        
        <script type="module">
            import {Luu} from "../distributable/luujanko.js";

            (async()=>
            {
                const sampleId = (new URLSearchParams(window.location.search).get("sample") || "textured-cube-model");
                const sampleModule = await import(`./${sampleId}/${sampleId}.js`);

                // The renderable assets will have finished loading when we reach this,
                // so it's safe to remove the loading indicator.
                document.getElementById("loading-bar").remove();
                document.querySelector(".infoboxes-container").style.visibility = "visible";

                const svgImage = document.getElementById("luujanko-rendering");

                const defaultViewRotation = Luu.rotation(0, 0, 0);
                const defaultViewPosition = Luu.translation(0, 0, -170);

                // Used to keep track of when to update the UI's FPS and polycount displays
                // (and whatever other real-time-updated info the UI might be showing).
                let uiUpdateTimer = 0;

                // Render a frame. This will keep looping at the device's refresh rate.
                (function render_loop(timestamp = 0, deltaTime = 0, frameCount = 0)
                {
                    // Have the SVG fill the entire viewport.
                    svgImage.setAttribute("width", document.documentElement.clientWidth);
                    svgImage.setAttribute("height", document.documentElement.clientHeight);

                    const scene = sampleModule.sample_scene(frameCount);

                    const options = {
                        fov: 70,
                        viewRotation: defaultViewRotation,
                        viewPosition: defaultViewPosition,
                        ...sampleModule.sampleRenderOptions,
                    };

                    // Draw the mesh into the <svg> DOM element.
                    const renderInfo = Luu.render([scene], svgImage, options);

                    // Update the UI.
                    if ((uiUpdateTimer += deltaTime) >= 1000)
                    {
                        const renderFPS = Math.floor(1000 / (renderInfo.totalRenderTimeMs || 1));
                        const screenFPS = Math.floor(1000 / deltaTime);

                        document.querySelector(".infobox.render-fps .value").innerHTML = renderFPS;
                        document.querySelector(".infobox.screen-fps .value").innerHTML = screenFPS;
                        document.querySelector(".infobox.polycount .value").innerHTML = renderInfo.numNgonsRendered;

                        uiUpdateTimer = 0;
                    }

                    // Queue the next frame of rendering.
                    window.requestAnimationFrame((newTimestamp)=>
                    {
                        render_loop(newTimestamp,
                                    (newTimestamp - timestamp),
                                    (frameCount + 1));
                    });
                })();
            })();
        </script>
    </body>
</html>
