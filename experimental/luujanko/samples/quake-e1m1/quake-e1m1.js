/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Luujanko
 * 
 */

"use strict";

import {Luu} from "../../distributable/luujanko.js";
import {e1m1} from "./assets/e1m1.rngon-model.js";
import {first_person_camera} from "../first-person-camera/camera.js";

e1m1.initialize();

const camera = first_person_camera("luujanko-rendering-container",
{
    position: {x:525, y:85, z:474},
    direction: {x:0, y:-2.5, z:0},
    movementSpeed: 0.2,
});

export const sample_scene = ()=>
{
    camera.update();

    return Luu.mesh(e1m1.ngons);
};

export const sampleRenderOptions = {
    nearPlane: 2,
    farPlane: 3000,
    fov: 70,
    get viewPosition() {return camera.position},
    get viewRotation() {return camera.direction},
}
