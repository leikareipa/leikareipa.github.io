/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: Retro n-gon renderer
 *
 */

"use strict";

import {Luu} from "../../distributable/luujanko.js";

// The id value of the DOM canvas we'll render the benchmark into.
const canvasId = "benchmark-canvas";

const renderWidth = 1280;
const renderHeight = 720;

export async function benchmark(sceneFileName = "",
                                initialCameraPos = {x:0, y:0, z:0},
                                initialCameraDir = {x:0, y:0, z:0},
                                extraRenderOptions = {})
{
    const sceneMesh = await load_scene_mesh(sceneFileName);

    create_dom_elements();

    const results = await run_bencmark([sceneMesh], initialCameraPos, initialCameraDir, extraRenderOptions);

    print_results(results);

    return;
}

// Note: we expect the mesh file to export an object called 'benchmarkScene'
// whose property 'ngons' provides the scene's n-gons.
async function load_scene_mesh(filename)
{
    // Give the user a visual indication that we're loading data.
    const loadSpinner = document.createElement("div");
    loadSpinner.innerHTML = "&#8987; Initializing...";
    document.body.appendChild(loadSpinner);

    // Load the data.
    const sceneModule = await import(filename);
    await sceneModule.benchmarkScene.initialize();

    loadSpinner.remove();

    return Luu.mesh(sceneModule.benchmarkScene.ngons);
}

function print_results(results)
{
    const [averageFPS, minimumFPS, maximumFPS] = (()=>
    {
        const renderFPS = results.map(r=>r.renderFPS);
        const renderFPSAverage = Math.round(renderFPS.reduce((total, fps)=>(total + fps)) / results.length);
        const renderFPSMinimum = Math.round(Math.min(...renderFPS));
        const renderFPSMaximum = Math.round(Math.max(...renderFPS));
    
        const screenFPS = results.map(r=>r.screenFPS);
        const screenFPSAverage = Math.round(screenFPS.reduce((total, fps)=>(total + fps)) / results.length);
        const screenFPSMinimum = Math.round(Math.min(...screenFPS));
        const screenFPSMaximum = Math.round(Math.max(...screenFPS));
    
        const averageFPS = (screenFPSAverage > renderFPSAverage)? screenFPSAverage : renderFPSAverage;
        const minimumFPS = (screenFPSMinimum > renderFPSMinimum)? screenFPSMinimum : renderFPSMinimum;
        const maximumFPS = (screenFPSMaximum > renderFPSMaximum)? screenFPSMaximum : renderFPSMaximum;

        return [averageFPS, minimumFPS, maximumFPS];
    })();

    const graphContainer = document.createElement("div");
    {
        graphContainer.setAttribute("id", "benchmark-graph-container");

        graphContainer.onmouseleave = (event)=>
        {
            document.getElementById("benchmark-graph-info-label").style.display = "none";
        }

        graphContainer.onmouseenter = (event)=>
        {
            document.getElementById("benchmark-graph-info-label").style.display = "initial";
            graphContainer.onmousemove(event);
        }

        graphContainer.onmousemove = (event)=>
        {
            // The percentage (in the range [0,1]) of the graph's width and height
            // that constitute the graph's margins, where no data is displayed.
            const graphMargin = 0.01;

            const timeMargin = ((event.target.clientWidth) * graphMargin);
            const fpsMargin = ((event.target.clientHeight) * graphMargin);

            const timeOffset = ((event.offsetX - timeMargin) / (event.target.clientWidth * (1 - (graphMargin * 2))));
            const fpsOffset = ((event.offsetY - fpsMargin) / (event.target.clientHeight * (1 - (graphMargin * 2))));

            const hoverFPS = (minimumFPS + (maximumFPS - minimumFPS) * fpsOffset);
            const hoverTimeMs = ((results[results.length-1].time - results[0].time) * timeOffset);

            const infoLabel = document.getElementById("benchmark-graph-info-label");
            infoLabel.style.left = `${event.clientX}px`;
            infoLabel.style.top = `${event.clientY}px`;
            infoLabel.innerHTML = `${Math.floor(hoverFPS)} FPS; ${Math.floor(hoverTimeMs)} ms`;
        }

        graphContainer.style.width = `${renderWidth + 2}px`; // +2 to account for border.
        graphContainer.style.height = `${renderHeight + 2}px`; // +2 to account for border.
    }

    const graph = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    {
        graph.setAttribute("id", "benchmark-graph");
        graph.setAttribute("viewBox", `-1 -1 102 102`);
        graph.setAttribute("preserveAspectRatio", "none");
        graph.setAttribute("mouseover", "");
    }

    // Populate the graph.
    {
        graph.innerHTML = "";

        // Add the benchmark results.
        add_to_graph("renderFPS", "gray", "0", minimumFPS, maximumFPS);
        add_to_graph("screenFPS", "gray", "3", minimumFPS, maximumFPS);
    }

    document.getElementById("benchmark-progress-bar").textContent = `Benchmark completed. Performance average: ${averageFPS} FPS.`;
    graphContainer.appendChild(graph);
    document.getElementById("benchmark-container").insertBefore(graphContainer, document.getElementById("benchmark-progress-bar"));
    document.getElementById("benchmark-canvas").remove();

    function add_to_graph(resultProperty, color, da, minimum, maximum)
    {
        const startTime = results[0].time;
        const endTime = results[results.length-1].time;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        line.setAttribute("vector-effect", "non-scaling-stroke");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("stroke-dasharray", `${da}`);
        line.setAttribute("stroke", `${color}`);
        line.setAttribute("fill", "none");
        line.setAttribute("stroke-linejoin", "round");
        line.setAttribute("stroke-linecap", "round");

        let points = "";

        for (let i = 0; i < results.length; i++)
        {
            const percentTime = (((results[i].time - startTime) / (endTime - startTime)) * 100);
            const percentFPS = Math.max(0, (((results[i][resultProperty] - minimum) / (maximum - minimum)) * 100));

            points += `${percentTime},${percentFPS} `;
        }

        line.setAttribute("points", points);
        graph.appendChild(line);
    }

    return;
}

// Renders as a performance benchmark a moving view of the given scene, and records the
// performance metrics of it.
//
// Returns a Promise that resolves with the benchmark results when the benchmark finishes.
// The results will be an array of objects like so:
//
// [
//     {time: <timestamp>, renderFPS: <frames per second>, screenFPS: <frames per second>},
//     {time: <timestamp>, renderFPS: <frames per second>, screenFPS: <frames per second>},
//     {time: <timestamp>, renderFPS: <frames per second>, screenFPS: <frames per second>},
//     ...
// ]
//
// The 'time' property gives a timestamp for when the accompanying render performance
// reading was taken. The 'renderFPS' property gives the performance of each call to
// render(); while 'screenFPS' gives the overall page refresh performance (which is
// limited to the screen's refresh rate).
//
function run_bencmark(sceneMeshes = [],
                      initialCameraPos = {x:0, y:0, z:0},
                      initialCameraDir = {x:0, y:0, z:0},
                      extraRenderOptions = {})
{
    return new Promise(resolve=>
    {
        const fpsReadings = [];
        const cameraDirection = Luu.vector3(initialCameraDir.x, initialCameraDir.y, initialCameraDir.z);
        const cameraPosition = Luu.translation(initialCameraPos.x, initialCameraPos.y, initialCameraPos.z);

        // 'timeDeltaMs' is the number of milliseconds elapsed since the previous call
        // to this render function.
        (function render_loop(timestamp = 0, timeDeltaMs = 0, frameCount = 0)
        {
            const queue_new_frame = (additionalTimeDelta = 0)=>
            {
                window.requestAnimationFrame((newTimestamp)=>
                {
                    render_loop(newTimestamp,
                                (additionalTimeDelta + (newTimestamp - timestamp)),
                                (frameCount + 1));
                });
            };

            // We want the frame timer (timeDeltaMs) to measure time between frames,
            // so skip the first frames where it's not doing so reliably.
            if (Math.abs(timeDeltaMs - timestamp) <= 0.0001)
            {
                if (frameCount > 10)
                {
                    Luu.throw("Something went wrong while trying to initialize the renderer.");
                    return;
                }

                queue_new_frame();
                return;
            }

            // Update the UI.
            {
                let percentDone = Math.floor(((cameraDirection.y - initialCameraDir.y) / (Math.PI * 2)) * 100);

                // Move the progress bar in smooth increments of 1.
                document.getElementById("benchmark-progress-bar").style.width = `${percentDone}%`;

                // Dispay the precentage value in increments of 10.
                {
                    percentDone = (Math.floor((percentDone) / 10) * 10);
                    
                    if (percentDone)
                    {
                        document.getElementById("benchmark-progress-bar").style.opacity = "1";
                        document.getElementById("benchmark-progress-bar").textContent = `${percentDone}%`;
                    }
                }
            }

            // Attempt to limit the renderer's refresh rate, if so requested by the user.
            if (extraRenderOptions.targetRefreshRate &&
                (timeDeltaMs < Math.floor(1000 / extraRenderOptions.targetRefreshRate)))
            {
                queue_new_frame(timeDeltaMs);
                return;
            }

            // Rotate the camera 360 degrees in small increments per frame, then exit
            // the benchmark when done.
            if ((cameraDirection.y - initialCameraDir.y) < (Math.PI * 2))
            {
                cameraDirection.y += (0.0004 * timeDeltaMs);
            }
            else
            {
                document.getElementById("benchmark-progress-bar").style.width = "100%";
                document.getElementById("benchmark-progress-bar").style.transition = "none";

                resolve(fpsReadings);
                return;
            }

            const renderInfo = Luu.render(sceneMeshes, document.getElementById(canvasId),
            {
                viewRotation: Luu.rotation(cameraDirection.x, cameraDirection.y, cameraDirection.z),
                viewPosition: cameraPosition,
                ...extraRenderOptions,
            });

            fpsReadings.push({
                time: performance.now(),
                renderFPS: (1000 / renderInfo.totalRenderTimeMs),
                screenFPS: Math.round(1000 / (timeDeltaMs || Infinity)),
            });

            queue_new_frame();
            return;
        })();
    });
}

function create_dom_elements()
{
    // Create the main container.
    const mainContainer = document.createElement("div");
    {
        mainContainer.setAttribute("id", "benchmark-container");

        mainContainer.style.width = `${renderWidth + 2}px`; // +2 to account for border.

        document.body.appendChild(mainContainer);
    }

    // Create the canvas.
    const canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    {
        canvas.setAttribute("id", canvasId);

        canvas.setAttribute("width", (renderWidth + 2));// +2 to account for border.
        canvas.setAttribute("height", renderHeight);

        mainContainer.appendChild(canvas);
    }

    // Create the progress bar.
    const progressBar = document.createElement("div");
    {
        progressBar.setAttribute("id", "benchmark-progress-bar");

        mainContainer.appendChild(progressBar);
    }

    // Create an informational label that will hover next to the cursor when the cursor
    // is over the graph.
    const infoLabel = document.createElement("div");
    {
        infoLabel.setAttribute("id", "benchmark-graph-info-label");

        document.body.appendChild(infoLabel);
    }

    return;
}
