/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Retro n-gon renderer
 * 
 */

"use strict";

import {scene} from "./scene.js";

export const sample = {
    initialize: function()
    {
        scene.initialize();
    },
    tick: function()
    {
        this.numTicks++;
        
        const rotationSpeed = 0.3;
    
        return {
            mesh: Rngon.mesh(scene.ngons, {
                scaling: Rngon.vector(30, 25, 25),
                rotation: Rngon.vector(
                    (-60 + rotationSpeed * this.numTicks),
                    (-60 + rotationSpeed * this.numTicks),
                    0
                ),
            }),
        };
    },
    numTicks: 0,
};