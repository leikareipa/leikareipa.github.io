/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Luujanko
 * 
 */

"use strict";

import {Luu} from "../../distributable/luujanko.js";
import {scene} from "./assets/scene.rngon-model.js";
import {first_person_camera} from "./camera.js";

scene.initialize();

const camera = first_person_camera("luujanko-rendering-container",
{
    position: {x:-60, y:28, z:-7},
    direction: {x:0, y:(Math.PI / 2), z:0},
    movementSpeed: 0.05,
});

export const sample_scene = ()=>
{
    camera.update();
    
    return Luu.mesh(scene.ngons,
    {
        scaling: Luu.scaling(25, 25, 25)
    });
};

export const sampleRenderOptions = {
    nearPlane: 1,
    farPlane: 1000,
    fov: 65,
    get viewPosition() {return camera.position},
    get viewRotation() {return camera.direction},
}
