/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Luujanko
 * 
 */

"use strict";

import {Luu} from "../../distributable/luujanko.js";
import {skele} from "./assets/skele.rngon-model.js";
import {first_person_camera} from "../first-person-camera/camera.js";

skele.initialize();

const camera = first_person_camera("luujanko-rendering-container",
{
    position: {x:615.2058858237791, y:20, z:657.8650582832854},
    direction: {x:0, y:-2.5, z:0},
    movementSpeed: 0.7,
});

export const sample_scene = ()=>
{
    camera.update();

    return Luu.mesh(skele.ngons);
};

export const sampleRenderOptions = {
    nearPlane: 2,
    farPlane: 5000,
    fov: 60,
    get viewPosition() {return camera.position},
    get viewRotation() {return camera.direction},
}
