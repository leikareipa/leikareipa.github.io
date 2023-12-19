/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Retro n-gon renderer
 * 
 */

"use strict";

import {laraHome} from "./assets/home.rngon-model.js";
import {first_person_camera} from "../first-person-camera/camera.js";

function vertex_shader(ngon, renderState)
{
    const minLevel = 0;
    const maxLevel = 0.2;

    const minDistance = (7000**2)
    const maxDistance = (27000**2);

    const distance = (
        ((ngon.vertices[0].x - renderState.cameraPosition.x)**2) +
        ((ngon.vertices[0].y - renderState.cameraPosition.y)**2) +
        ((ngon.vertices[0].z - renderState.cameraPosition.z)**2)
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

        Rngon.color.$bright = Rngon.color.white;
        Rngon.color.$dark =  Rngon.color(40, 40, 40);

        laraHome.initialize();
    },
    tick: function()
    {
        this.numTicks++;
        this.camera.update();

        for (const material of Object.values(laraHome.materials))
        {
            switch (parent.SHADING_MODE.toLowerCase())
            {
                case "none":
                {
                    material.vertexShading = "none";
                    material.renderVertexShade = false;
                    break;
                }
                case "baked":
                {
                    material.vertexShading = "none";
                    material.renderVertexShade = true;
                    break;
                }
                default:
                {
                    material.vertexShading = parent.SHADING_MODE.toLowerCase();
                    material.renderVertexShade = true;
                    break;
                }
            }

            material.wireframeColor = ((parent.SHADING_MODE.toLowerCase() === "none")? Rngon.color.$dark : Rngon.color.$bright);
            material.textureFiltering = parent.TEXTURE_FILTER_MODE.toLowerCase();
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
                useDepthBuffer: (parent.ACTIVE_SHADER !== "Wireframe"),
                cameraDirection: this.camera.direction,
                cameraPosition: this.camera.position,
                nearPlane: 100,
                farPlane: 25000,
                fov: 55,
                lights: ((parent.SHADING_MODE == "none")? undefined : this.lights),
            },
            renderPipeline: {
                pixelShader: shaderFn,
                vertexShader: vertex_shader,
            },
            mesh: this.mesh,
        };
    },
    lights: [
        Rngon.light(36089, 2600, -33240, {intensity: 7000}),
        Rngon.light(39548, 2846, -31564, {intensity: 4000}),
        Rngon.light(44519, 2840, -31380, {intensity: 4000}),
        Rngon.light(53262, 1681, -28547, {intensity: 5000}),
        Rngon.light(58280, 1681, -28547, {intensity: 5000}),
    ],
    camera: undefined,
    mesh: Rngon.mesh(laraHome.ngons),
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

function ps_crt_effect(renderState)
{
    const {width, height, data:pixels} = renderState.pixelBuffer;
    const sourceBuffer = new Uint8Array(pixels.length);
    sourceBuffer.set(pixels);
    
    const curvature = 0.05;
    const scaleX = 0.99;
    const scaleY = 0.99;
    const colorSoftening = 1.2;
    const scanlineIntensity = 0.08;
    
    const centerX = (width / 2);
    const centerY = (height / 2);
    
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            const bufferIdx = ((x + y * width) * 4);
    
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
                if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height)
                {
                    // Copy the source pixel color
                    const sourceIdx = (sourceX + sourceY * width) * 4;
                    pixels[bufferIdx + 0] = sourceBuffer[sourceIdx + 0];
                    pixels[bufferIdx + 1] = sourceBuffer[sourceIdx + 1];
                    pixels[bufferIdx + 2] = sourceBuffer[sourceIdx + 2];
                }
                else
                {
                    // Set the pixel to black if it's out of bounds
                    pixels[bufferIdx + 0] = 0;
                    pixels[bufferIdx + 1] = 0;
                    pixels[bufferIdx + 2] = 0;
                }
            }

            // Scanlines.
            const scanlineFactor = ((y % 2 === 0)? (1 - scanlineIntensity) : 1);

            // Color softening.
            const r = Math.min(pixels[bufferIdx] * colorSoftening, 255);
            const g = Math.min(pixels[bufferIdx + 1] * colorSoftening, 255);
            const b = Math.min(pixels[bufferIdx + 2] * colorSoftening, 255);

            pixels[bufferIdx] = (r * scanlineFactor);
            pixels[bufferIdx + 1] = (g * scanlineFactor);
            pixels[bufferIdx + 2] = (b * scanlineFactor);
        }
    }
}

function ps_voodoo_effect(renderState)
{
    const ditherMatrix = [
        [1, 9, 3, 11],
        [13, 5, 15, 7],
        [4, 12, 2, 10],
        [16, 8, 14, 6]
    ];
  
    const {width, height, data:pixels} = renderState.pixelBuffer;
    const ditherMatrixSize = ditherMatrix.length;
  
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            const idx = ((y * width + x) * 4);
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];

            const ditherFactor = (ditherMatrix[y % ditherMatrixSize][x % ditherMatrixSize] / 17);
            const r5 = Math.round((r / 255) * 31 + ditherFactor) * (255 / 31);
            const g6 = Math.round((g / 255) * 63 + ditherFactor) * (255 / 63);
            const b5 = Math.round((b / 255) * 31 + ditherFactor) * (255 / 31);

            pixels[idx] = r5;
            pixels[idx + 1] = g6;
            pixels[idx + 2] = b5;
        }
    }
}

function ps_dither_effect(renderState)
{
    const {width, height, data:pixels} = renderState.pixelBuffer;
    const colorDepth = 3;
    const levels = Math.pow(2, colorDepth) - 1;

    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            const idx = (y * width + x) * 4;
            const oldPixel = {
                r: pixels[idx],
                g: pixels[idx + 1],
                b: pixels[idx + 2],
            };
            
            const newPixel = {
                r: quantize(oldPixel.r, levels),
                g: quantize(oldPixel.g, levels),
                b: quantize(oldPixel.b, levels),
            };
            
            pixels[idx] = newPixel.r;
            pixels[idx + 1] = newPixel.g;
            pixels[idx + 2] = newPixel.b;
            
            const error = {
                r: (oldPixel.r - newPixel.r),
                g: (oldPixel.g - newPixel.g),
                b: (oldPixel.b - newPixel.b),
            };

            const applyError = (x, y, weight, error)=>{
                if ((x < 0) || (x >= width) || (y < 0) || (y >= height))
                {
                    return;
                }
                
                const idx = ((y * width + x) * 4);
                pixels[idx] += (error.r * weight);
                pixels[idx + 1] += (error.g * weight);
                pixels[idx + 2] += (error.b * weight);
            };

            // Apply the error to neighboring pixels.
            applyError(x + 1, y, 7 / 16, error);
            applyError(x - 1, y + 1, 3 / 16, error);
            applyError(x, y + 1, 5 / 16, error);
            applyError(x + 1, y + 1, 1 / 16, error);
        }
    }

    function quantize(value, levels)
    {
        const step = (256 / levels);
        return (Math.round(value / step) * step);
    }
}
