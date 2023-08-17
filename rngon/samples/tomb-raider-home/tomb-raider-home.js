/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Retro n-gon renderer
 * 
 */

"use strict";

import {laraHome} from "./assets/home.rngon-model.js";
import {first_person_camera} from "../first-person-camera/camera.js";

const vertexShader = (ngon, cameraPosition)=>
{
    const minLevel = 0;
    const maxLevel = 0.2;

    const minDistance = (7000 * 7000)
    const maxDistance = (27000 * 27000);

    const distance = (
        ((ngon.vertices[0].x - cameraPosition.x) * (ngon.vertices[0].x  - cameraPosition.x)) +
        ((ngon.vertices[0].y - cameraPosition.y) * (ngon.vertices[0].y  - cameraPosition.y)) +
        ((ngon.vertices[0].z - cameraPosition.z) * (ngon.vertices[0].z  - cameraPosition.z))
    );    

    ngon.mipLevel = Math.max(minLevel, Math.min(maxLevel, ((distance - minDistance) / (maxDistance - minDistance))));
};

export const sample = {
    initialize: function()
    {
        this.camera = first_person_camera("canvas", {
            position: {x: 40000, y: 2450, z: -32229},
            direction: {x: 5, y: 180, z: 0},
            movementSpeed: 1.8,
        });

        laraHome.initialize();
    },
    tick: function()
    {
        this.numTicks++;
        this.camera.update();

        for (const ngon of laraHome.ngons)
        {
            switch (parent.SHADING_MODE.toLowerCase())
            {
                case "none":
                {
                    ngon.material.vertexShading = "none";
                    ngon.material.renderVertexShade = false;
                    break;
                }
                case "baked":
                {
                    ngon.material.vertexShading = "none";
                    ngon.material.renderVertexShade = true;
                    break;
                }
                default:
                {
                    ngon.material.vertexShading = parent.SHADING_MODE.toLowerCase();
                    ngon.material.renderVertexShade = true;
                    break;
                }
            }

            ngon.material.textureFiltering = parent.TEXTURE_FILTER_MODE.toLowerCase();
        }

        let shaderFn = undefined;
        switch (parent.ACTIVE_SHADER)
        {
            case "3dfx": shaderFn = ps_voodoo_effect; break;
            case "CRT": shaderFn = ps_crt_effect; break;
            case "Dither": shaderFn = ps_dither_effect; break;
        }

        reset_materials();
        switch (parent.ACTIVE_SHADER)
        {
            case "Wireframe": enable_wireframe(); break;
            case "Solid": enable_solid(); break;
        }
    
        return {
            renderOptions: {
                cameraDirection: this.camera.direction,
                cameraPosition: this.camera.position,
                nearPlane: 100,
                farPlane: 25000,
                fov: 55,
                lights: (
                    (parent.SHADING_MODE == "none")
                        ? []
                        : this.lights
                ),
            },
            renderPipeline: {
                pixelShader: shaderFn,
                vertexShader
            },
            mesh: Rngon.mesh(laraHome.ngons),
        };
    },
    lights: [
        Rngon.light(7000, Rngon.vector(36089, 2600, -33240)),
        Rngon.light(4000, Rngon.vector(39548, 2846, -31564)),
        Rngon.light(4000, Rngon.vector(44519, 2840, -31380)),
        Rngon.light(5000, Rngon.vector(53262, 1681, -28547)),
        Rngon.light(5000, Rngon.vector(58280, 1681, -28547)),
    ],
    camera: undefined,
    numTicks: 0,
};

function enable_wireframe() {
    for (const material of Object.values(laraHome.materials)) {
        material.hasWireframe = true;
        material.hasFill = false;
    }
}

function enable_solid() {
    for (const material of Object.values(laraHome.materials)) {
        if (material.texture) {
            material.$texture = material.texture;
            material.$color = material.color;
            material.color = Rngon.color(material.texture.pixels[8], material.texture.pixels[9], material.texture.pixels[10]);
        }
        material.texture = undefined;
    }
}

function reset_materials() {
    for (const material of Object.values(laraHome.materials)) {
        material.hasWireframe = false;
        material.hasFill = true;
        if (material.$texture) {
            material.texture = material.$texture;
            material.$texture = undefined;
            material.color = material.$color;
            material.$color = undefined;
        }
    }
}

function ps_crt_effect({renderWidth, renderHeight, pixelBuffer})
{
    const sourceBuffer = new Uint8Array(pixelBuffer.length);
    sourceBuffer.set(pixelBuffer);
    
    const curvature = 0.05;
    const scaleX = 0.99;
    const scaleY = 0.99;
    const colorSoftening = 1.2;
    const scanlineIntensity = 0.08;
    
    const centerX = (renderWidth / 2);
    const centerY = (renderHeight / 2);
    
    for (let y = 0; y < renderHeight; y++)
    {
        for (let x = 0; x < renderWidth; x++)
        {
            const bufferIdx = ((x + y * renderWidth) * 4);
    
            // Normalize the coordinates to -1, 1 range
            const normX = ((x - centerX) / centerX);
            const normY = ((y - centerY) / centerY);
    
            // Barrel distortion.
            {
                const radius = Math.sqrt(normX * normX + normY * normY);
                const barrelFactor = (1 + curvature * radius * radius);
                const barrelX = normX * barrelFactor;
                const barrelY = normY * barrelFactor;
        
                // Denormalize the coordinates
                const sourceX = Math.round((barrelX * centerX / scaleX) + centerX);
                const sourceY = Math.round((barrelY * centerY / scaleY) + centerY);
        
                // Check if the source pixel is within bounds
                if (sourceX >= 0 && sourceX < renderWidth && sourceY >= 0 && sourceY < renderHeight)
                {
                    // Copy the source pixel color
                    const sourceIdx = (sourceX + sourceY * renderWidth) * 4;
                    pixelBuffer[bufferIdx + 0] = sourceBuffer[sourceIdx + 0];
                    pixelBuffer[bufferIdx + 1] = sourceBuffer[sourceIdx + 1];
                    pixelBuffer[bufferIdx + 2] = sourceBuffer[sourceIdx + 2];
                }
                else
                {
                    // Set the pixel to black if it's out of bounds
                    pixelBuffer[bufferIdx + 0] = 0;
                    pixelBuffer[bufferIdx + 1] = 0;
                    pixelBuffer[bufferIdx + 2] = 0;
                }
            }

            // Scanlines.
            const scanlineFactor = ((y % 2 === 0)? (1 - scanlineIntensity) : 1);

            // Color softening.
            const r = Math.min(pixelBuffer[bufferIdx] * colorSoftening, 255);
            const g = Math.min(pixelBuffer[bufferIdx + 1] * colorSoftening, 255);
            const b = Math.min(pixelBuffer[bufferIdx + 2] * colorSoftening, 255);

            pixelBuffer[bufferIdx] = (r * scanlineFactor);
            pixelBuffer[bufferIdx + 1] = (g * scanlineFactor);
            pixelBuffer[bufferIdx + 2] = (b * scanlineFactor);
        }
    }
}

function ps_voodoo_effect({renderWidth, renderHeight, pixelBuffer})
{
    const ditherMatrix = [
        [1, 9, 3, 11],
        [13, 5, 15, 7],
        [4, 12, 2, 10],
        [16, 8, 14, 6]
    ];
  
    const ditherMatrixSize = ditherMatrix.length;
  
    for (let y = 0; y < renderHeight; y++)
    {
        for (let x = 0; x < renderWidth; x++)
        {
            const idx = ((y * renderWidth + x) * 4);
            const r = pixelBuffer[idx];
            const g = pixelBuffer[idx + 1];
            const b = pixelBuffer[idx + 2];

            const ditherFactor = (ditherMatrix[y % ditherMatrixSize][x % ditherMatrixSize] / 17);
            const r5 = Math.round((r / 255) * 31 + ditherFactor) * (255 / 31);
            const g6 = Math.round((g / 255) * 63 + ditherFactor) * (255 / 63);
            const b5 = Math.round((b / 255) * 31 + ditherFactor) * (255 / 31);

            pixelBuffer[idx] = r5;
            pixelBuffer[idx + 1] = g6;
            pixelBuffer[idx + 2] = b5;
        }
    }
}

function ps_dither_effect({renderWidth, renderHeight, pixelBuffer})
{
    const colorDepth = 3;
    const levels = Math.pow(2, colorDepth) - 1;

    const quantize = (value, levels)=>{
        const step = (256 / levels);
        return (Math.round(value / step) * step);
    };

    for (let y = 0; y < renderHeight; y++)
    {
        for (let x = 0; x < renderWidth; x++)
        {
            const idx = (y * renderWidth + x) * 4;
            const oldPixel = {
                r: pixelBuffer[idx],
                g: pixelBuffer[idx + 1],
                b: pixelBuffer[idx + 2],
            };
            
            const newPixel = {
                r: quantize(oldPixel.r, levels),
                g: quantize(oldPixel.g, levels),
                b: quantize(oldPixel.b, levels),
            };
            
            pixelBuffer[idx] = newPixel.r;
            pixelBuffer[idx + 1] = newPixel.g;
            pixelBuffer[idx + 2] = newPixel.b;
            
            const error = {
                r: (oldPixel.r - newPixel.r),
                g: (oldPixel.g - newPixel.g),
                b: (oldPixel.b - newPixel.b),
            };

            const applyError = (x, y, weight, error)=>{
                if ((x < 0) || (x >= renderWidth) || (y < 0) || (y >= renderHeight))
                {
                    return;
                }
                
                const idx = ((y * renderWidth + x) * 4);
                pixelBuffer[idx] += (error.r * weight);
                pixelBuffer[idx + 1] += (error.g * weight);
                pixelBuffer[idx + 2] += (error.b * weight);
            };

            // Apply the error to neighboring pixels.
            applyError(x + 1, y, 7 / 16, error);
            applyError(x - 1, y + 1, 3 / 16, error);
            applyError(x, y + 1, 5 / 16, error);
            applyError(x + 1, y + 1, 1 / 16, error);
        }
    }
}
