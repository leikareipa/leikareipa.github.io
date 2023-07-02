/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Luujanko
 * 
 */

"use strict";

import {Luu} from "../../distributable/luujanko.js";
import {cubeModel} from "./assets/cube.rngon-model.js";

cubeModel.initialize();

export const sample_scene = (frameCount)=>
{
    const rotationSpeed = 0.008;

    return Luu.mesh(cubeModel.ngons,
    {
        rotation: Luu.rotation((-60 + rotationSpeed * frameCount),
                               (-60 + rotationSpeed * frameCount),
                               0),
        scaling: Luu.scaling(45, 35, 35)
    });
};

export const sampleRenderOptions = {}
