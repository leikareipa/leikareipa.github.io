/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Retro n-gon renderer
 * 
 */

"use strict";

import {laraHome} from "./assets/home.rngon-model.js";
import {first_person_camera} from "../first-person-camera/camera.js";

export const sample = {
    initialize: function()
    {
        this.camera = first_person_camera("canvas", {
            position: {x: 40000, y: 2450, z: -32229},
            direction: {x:5, y:180, z:0},
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
                case "baked to vertex":
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
        }
    
        return {
            renderOptions: {
                cameraDirection: this.camera.direction,
                cameraPosition: this.camera.position,
                nearPlane: 100,
                farPlane: 25000,
                fov: 55,
                lights: parent.SHADING_MODE == "none"
                        ? []
                        : this.lights,
                vertexShaderFunction: (ngon, cameraPosition)=>
                {
                    const minLevel = 0;
                    const maxLevel = 0.4;

                    const minDistance = (7000 * 7000)
                    const maxDistance = (27000 * 27000);

                    const distance = (((ngon.vertices[0].x - cameraPosition.x) * (ngon.vertices[0].x  - cameraPosition.x)) +
                                    ((ngon.vertices[0].y - cameraPosition.y) * (ngon.vertices[0].y  - cameraPosition.y)) +
                                    ((ngon.vertices[0].z - cameraPosition.z) * (ngon.vertices[0].z  - cameraPosition.z)));    

                    ngon.mipLevel = Math.max(minLevel, Math.min(maxLevel, ((distance - minDistance) / (maxDistance - minDistance))));
                }
            },
            mesh: Rngon.mesh(laraHome.ngons),
        };
    },
    lights: [
        Rngon.light(Rngon.translation_vector(36089, 2600, -33240),{
            intensity: 7000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),
        Rngon.light(Rngon.translation_vector(39548, 2846, -31564),{
            intensity: 4000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),
        Rngon.light(Rngon.translation_vector(44519, 2840, -31380),{
            intensity: 4000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),
        Rngon.light(Rngon.translation_vector(53262, 1681, -28547),{
            intensity: 5000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),
        Rngon.light(Rngon.translation_vector(58280, 1681, -28547),{
            intensity: 5000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),
    
        // Outdoors.
        /*
        Rngon.light(Rngon.translation_vector(32768, 2261, -33333),{
            intensity: 4000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),
        Rngon.light(Rngon.translation_vector(37335, 2921, -27592),{
            intensity: 4000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),
        Rngon.light(Rngon.translation_vector(45535, 2751, -27971),{
            intensity: 4000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),
        Rngon.light(Rngon.translation_vector(53849, 1784, -25050),{
            intensity: 4000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),
        Rngon.light(Rngon.translation_vector(58518, 1784, -25436),{
            intensity: 4000,
            attenuation: 1,
            clip: 1.0,
            meshRadius: 300,
        }),*/
    ],
    camera: undefined,
    numTicks: 0,
};
