/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Luujanko
 * 
 */

"use strict";

import {Luu} from "../../distributable/luujanko.js";

export const sample_scene = (frameCount)=>
{
    const rotationSpeed = 1;

    const triangle = Luu.ngon([Luu.vertex(-0.5, -0.5, 0),
                               Luu.vertex( 0.5, -0.5, 0),
                               Luu.vertex( 0.5,  0.5, 0)]);
                            
    return Luu.mesh([triangle],
    {
        rotation: Luu.rotation(0, ((-40 + rotationSpeed * frameCount) / 100), 0),
        scaling: Luu.scaling(85, 85, 85)
    });
};

export const sampleRenderOptions = {}
