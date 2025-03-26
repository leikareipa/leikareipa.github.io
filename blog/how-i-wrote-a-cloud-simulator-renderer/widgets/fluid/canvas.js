/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 */

"use strict";

let CANVAS_ELEMENT, DOMAIN_SIZE;

export function initialize({domainSize})
{
    DOMAIN_SIZE = domainSize;
    CANVAS_ELEMENT = document.createElement("canvas");
    CANVAS_ELEMENT.setAttribute("width", DOMAIN_SIZE);
    CANVAS_ELEMENT.setAttribute("height", DOMAIN_SIZE);
    CANVAS_ELEMENT.style.height = "100%";

    document.body.appendChild(CANVAS_ELEMENT);

    return;
}

const scratchBuffer = [];

function lerp(x, y, interval)
{
    return (x + (interval * (y - x)));
}

export function tick({fluid, atmosphere, graph = "relative-humidity"})
{
    console.assert(CANVAS_ELEMENT);

    const canvasContext = CANVAS_ELEMENT.getContext("2d");
    const canvasImage = canvasContext.getImageData(0, 0, DOMAIN_SIZE, DOMAIN_SIZE);
    const canvasPixels = canvasImage.data;

    if (graph == "fluid")
    {
        const maxVelocity = 1;
        const minVelocity = 0;

        for (let x = 1; x <= DOMAIN_SIZE; ++x)
        {
            for (let y = 1; y <= DOMAIN_SIZE; ++y)
            {
                const velocity = fluid.velocity_at(x, y);
                const color = 8 * (((Math.abs(velocity.u) + Math.abs(velocity.v)) - minVelocity) / (maxVelocity - minVelocity) * 255);
                const idx = (((x-1) + (y-1) * DOMAIN_SIZE) * 4);
                canvasPixels[idx + 0] = 216;
                canvasPixels[idx + 1] = 27;
                canvasPixels[idx + 2] = 96;
                canvasPixels[idx + 3] = color*1.4;
            }
        }
    }
    else if (graph == "humidity")
    {
        const maxValue = 1;
        const minValue = 0;

        for (let x = 1; x <= DOMAIN_SIZE; ++x)
        {
            for (let y = 1; y <= DOMAIN_SIZE; ++y)
            {
                const rh = atmosphere.relative_humidity_at(x, y);
                const color = ((rh - minValue) / (maxValue - minValue) * 255);
                const idx = (((x-1) + (y-1) * DOMAIN_SIZE) * 4);
                canvasPixels[idx + 0] = 0;
                canvasPixels[idx + 1] = 150;
                canvasPixels[idx + 2] = 255;
                canvasPixels[idx + 3] = color*1.4;
            }
        }
    }
    else if (graph == "temperature")
    {
        const maxTemperature = 30;
        const minTemperature = -20;

        for (let x = 1; x <= DOMAIN_SIZE; ++x)
        {
            for (let y = 1; y <= DOMAIN_SIZE; ++y)
            {
                const temperature = atmosphere.temperature_at(x, y);
                const temperatureUnitRange = ((temperature - minTemperature) / (maxTemperature - minTemperature));
                const idx = (((x-1) + (y-1) * DOMAIN_SIZE) * 4);

                canvasPixels[idx + 0] = 0;
                canvasPixels[idx + 1] = 0;
                canvasPixels[idx + 2] = 0;
                canvasPixels[idx + 3] = ((1 - Math.min(1, Math.max(0, temperatureUnitRange))) * 255);
            }
        }
    }

    canvasContext.putImageData(canvasImage, 0, 0);

    return;
}