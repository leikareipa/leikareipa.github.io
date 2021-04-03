// WHAT: Concatenated JavaScript source files
// PROGRAM: Luujanko
// VERSION: alpha live (05 November 2020 03:29:54 UTC)
// AUTHOR: Tarpeeksi Hyvae Soft
// LINK: https://www.github.com/leikareipa/luujanko/
// FILES:
//	./src/luujanko/luujanko.js
//	./src/luujanko/color.js
//	./src/luujanko/material.js
//	./src/luujanko/matrix44.js
//	./src/luujanko/ngon.js
//	./src/luujanko/rasterize.js
//	./src/luujanko/transform.js
//	./src/luujanko/vector3.js
//	./src/luujanko/vertex.js
//	./src/luujanko/mesh.js
//	./src/luujanko/render.js
/////////////////////////////////////////////////
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
// Luujanko's top-level namespace.
export const Luu = {
version: {family:"alpha",major:"0",minor:"0",dev:true}
};
// Various small utility functions and the like.
{
// Defined 'true' to allow for the conveniency of named in-place assertions, e.g.
// Luu.assert && (x === 1) ||Luu.throw("X wasn't 1.").
//
// Note that setting this to 'false' won't disable assertions - for that,
// you'll want to search/replace "Luu.assert &&" with "Luu.assert ||" and keep this
// set to 'true'. The comparison against Luu.assert may still be done, though (I guess
// depending on the JS engine's ability to optimize).
Object.defineProperty(Luu, "assert", {value:true, writable:false});
Luu.lerp = (x, y, interval)=>(x + (interval * (y - x)));
Luu.throw = (errMessage = "")=>
{
throw Error("Luujanko error: " + errMessage);
}
Luu.log = (string = "Hello there.")=>
{
console.log("Luujanko: " + string);
}
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
// Values in the range [0,1].
Luu.color = function(red = 0.5, green = 0.5, blue = 0.5, alpha = 1)
{
const publicInterface =
{
red,
green,
blue,
alpha,
string: function()
{
/// TODO.
return "gray";
}
};
return publicInterface;
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
Luu.material = function(options = Luu.material.default)
{
options =
{
...Luu.material.default,
...options
};
const publicInterface =
{
...options,
};
return publicInterface;
}
Luu.material.default = {
color: Luu.color(0.5, 0.5, 0.5, 1),
allowTransform: true,
};
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
* 4-by-4 matrix manipulation.
*
* Adapted and modified from code written originally by Benny Bobaganoosh for his 3d software
* renderer (https://github.com/BennyQBD/3DSoftwareRenderer). Full attribution:
* {
*     Copyright (c) 2014, Benny Bobaganoosh
*     All rights reserved.
*
*     Redistribution and use in source and binary forms, with or without
*     modification, are permitted provided that the following conditions are met:
*
*     1. Redistributions of source code must retain the above copyright notice, this
*         list of conditions and the following disclaimer.
*     2. Redistributions in binary form must reproduce the above copyright notice,
*         this list of conditions and the following disclaimer in the documentation
*         and/or other materials provided with the distribution.
*
*     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
*     ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
*     WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
*     DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
*     ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
*     (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
*     LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
*     ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
*     (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
*     SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* }
*
*/
"use strict";
// Provides manipulation of 4-by-4 matrices.
Luu.matrix44 = (()=>
{
return Object.freeze(
{
scaling: function(x = 0, y = 0, z = 0)
{
return Object.freeze([x, 0, 0, 0,
0, y, 0, 0,
0, 0, z, 0,
0, 0, 0, 1]);
},
translation: function(x = 0, y = 0, z = 0)
{
return Object.freeze([1, 0, 0, 0,
0, 1, 0, 0,
0, 0, 1, 0,
x, y, z, 1]);
},
rotation: function(x = 0.0, y = 0.0, z = 0.0)
{
const mx = [1,            0,            0,            0,
0,            Math.cos(x),  -Math.sin(x), 0,
0,            Math.sin(x),  Math.cos(x),  0,
0,            0,            0,            1];
const my = [Math.cos(y),  0,            Math.sin(y),  0,
0,            1,            0,            0,
-Math.sin(y), 0,            Math.cos(y),  0,
0,            0,            0,            1];
const mz = [Math.cos(z),  -Math.sin(z), 0,            0,
Math.sin(z),  Math.cos(z),  0,            0,
0,            0,            1,            0,
0,            0,            0,            1];
const temp = Luu.matrix44.multiply(my, mz);
const mResult = Luu.matrix44.multiply(mx, temp);
Luu.assert && (mResult.length === 16)
|| Luu.throw("Expected a 4 x 4 matrix.");
return Object.freeze(mResult);
},
perspective: function(fov = 0, aspectRatio = 0, zNear = 0, zFar = 0)
{
const fovHalf = Math.tan(fov / 2);
const zRange = (zNear - zFar);
return Object.freeze([(1 / (fovHalf * aspectRatio)), 0,             0,                             0,
0,                            (1 / fovHalf), 0,                             0,
0,                            0,             ((-zNear - zFar) / zRange),    1,
0,                            0,             (2 * zFar * (zNear / zRange)), 0]);
},
ortho: function(width = 0, height = 0)
{
return Object.freeze([(width/2),     0,              0, 0,
0,             -(height/2),    0, 0,
0,             0,              1, 0,
(width/2)-0.5, (height/2)-0.5, 0, 1]);
},
multiply: function(m1 = [], m2 = [])
{
Luu.assert && ((m1.length === 16) && (m2.length === 16))
|| Luu.throw("Expected 4 x 4 matrices.");
let mResult = [];
for (let i = 0; i < 4; i++)
{
for (let j = 0; j < 4; j++)
{
mResult[i + (j * 4)] = (m1[i + (0 * 4)] * m2[0 + (j * 4)]) +
(m1[i + (1 * 4)] * m2[1 + (j * 4)]) +
(m1[i + (2 * 4)] * m2[2 + (j * 4)]) +
(m1[i + (3 * 4)] * m2[3 + (j * 4)]);
}
}
Luu.assert && (mResult.length === 16)
|| Luu.throw("Expected a 4 x 4 matrix.");
return Object.freeze(mResult);
},
});
})();
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
// A single n-sided ngon.
Luu.ngon = function(vertices = [Luu.vertex()], material = Luu.material.default)
{
Luu.assert && (vertices instanceof Array)
|| Luu.throw("Expected an array of vertices to make an ngon.");
Luu.assert && (material instanceof Object)
|| Luu.throw("Expected an object containing user-supplied options.");
// Combine default material options with the user-supplied ones.
material =
{
...Luu.material.default,
...material
};
const publicInterface =
{
vertices,
material,
};
return publicInterface;
}
Luu.ngon.perspective_divide = function(ngon)
{
for (const vert of ngon.vertices)
{
Luu.vertex.perspective_divide(vert);
}
},
Luu.ngon.transform = function(ngon, matrix44)
{
for (const vert of ngon.vertices)
{
Luu.vertex.transform(vert, matrix44);
}
},
// Clips all vertices against the sides of the viewport. Adapted from Benny
// Bobaganoosh's 3d software renderer, the source for which is available at
// https://github.com/BennyQBD/3DSoftwareRenderer.
Luu.ngon.clip_to_viewport = function(ngon)
{
clip_on_axis("x",  1);
clip_on_axis("x", -1);
clip_on_axis("y",  1);
clip_on_axis("y", -1);
clip_on_axis("z",  1);
clip_on_axis("z", -1);
return;
function clip_on_axis(axis, factor)
{
if (ngon.vertices.length < 2)
{
return;
}
let prevVertex = ngon.vertices[ngon.vertices.length - ((ngon.vertices.length == 2)? 2 : 1)];
let prevComponent = (prevVertex[axis] * factor);
let isPrevVertexInside = (prevComponent <= prevVertex.w);
// The vertices array will be modified in-place by appending the clipped vertices
// onto the end of the array, then removing the previous ones.
let k = 0;
let numOriginalVertices = ngon.vertices.length;
for (let i = 0; i < numOriginalVertices; i++)
{
const curComponent = (ngon.vertices[i][axis] * factor);
const thisVertexIsInside = (curComponent <= ngon.vertices[i].w);
// If either the current vertex or the previous vertex is inside but the other isn't,
// and they aren't both inside, interpolate a new vertex between them that lies on
// the clipping plane.
if (thisVertexIsInside ^ isPrevVertexInside)
{
const vertIdx = (numOriginalVertices + k++);
const lerpStep = (prevVertex.w - prevComponent) /
((prevVertex.w - prevComponent) - (ngon.vertices[i].w - curComponent));
ngon.vertices[vertIdx] = Luu.vertex(Luu.lerp(prevVertex.x, ngon.vertices[i].x, lerpStep),
Luu.lerp(prevVertex.y, ngon.vertices[i].y, lerpStep),
Luu.lerp(prevVertex.z, ngon.vertices[i].z, lerpStep));
ngon.vertices[vertIdx].w = Luu.lerp(prevVertex.w, ngon.vertices[i].w, lerpStep);
}
if (thisVertexIsInside)
{
ngon.vertices[numOriginalVertices + k++] = ngon.vertices[i];
}
prevVertex = ngon.vertices[i];
prevComponent = curComponent;
isPrevVertexInside = thisVertexIsInside;
}
ngon.vertices.splice(0, numOriginalVertices);
return;
}
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
Luu.rasterize = function(ngon, svgPolygonElement, svgElement)
{
Luu.assert && (ngon &&
(ngon.material) &&
(ngon.vertices) &&
(ngon.vertices.length >= 2))
|| Luu.throw("Invalid n-gon for rasterization.");
svgPolygonElement.setAttribute("stroke", ngon.material.color.string());
svgPolygonElement.setAttribute("points", ngon.vertices.reduce((string, v)=>(string += `${v.x},${v.y} `), ""));
svgElement.appendChild(svgPolygonElement);
return;
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
// Applies lighting to the given n-gons, and transforms them into screen space
// for rendering. The processed n-gons are stored in the internal n-gon cache.
Luu.transform_and_clip = function(ngon,
objectMatrix = [],
clipSpaceMatrix,
screenSpaceMatrix = [])
{
// Ignore fully transparent polygons.
if (!ngon.material.color.alpha)
{
return null;
}
const transformedNgon = Luu.ngon();
// Copy the ngon into the internal n-gon cache, so we can operate on it without
// mutating the original n-gon's data.
{
transformedNgon.vertices.length = ngon.vertices.length;
for (let v = 0; v < ngon.vertices.length; v++)
{
transformedNgon.vertices[v] = Luu.vertex(ngon.vertices[v].x,
ngon.vertices[v].y,
ngon.vertices[v].z);
}
transformedNgon.material = ngon.material;
transformedNgon.isActive = true;
}
// Transform vertices into screen space and apply clipping. We'll do the transforming
// in steps: first into object space, then into clip space, and finally into screen
// space.
{
// Object space. Any built-in lighting is applied, if requested by the n-gon's
// material.
{
Luu.ngon.transform(transformedNgon, objectMatrix);
/// TODO: Apply a vertex shader here.
}
// Clip space. If none of the n-gon's vertices are inside the viewport, the n-gon
// will be culled.
{
Luu.ngon.transform(transformedNgon, clipSpaceMatrix);
Luu.ngon.clip_to_viewport(transformedNgon)
if (!transformedNgon.vertices.length)
{
return null;
}
}
// Screen space. Vertices will be transformed such that their XY coordinates
// map directly into XY pixel coordinates in the rendered image (although
// the values may still be in floating-point).
{
Luu.ngon.transform(transformedNgon, screenSpaceMatrix);
Luu.ngon.perspective_divide(transformedNgon);
}
}
return transformedNgon;
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
Luu.vector3 = function(x = 0, y = 0, z = 0)
{
Luu.assert && ((typeof x === "number") &&
(typeof y === "number") &&
(typeof z === "number"))
|| Luu.throw("Expected numbers as parameters to the vector3 factory.");
const publicInterface =
{
x,
y,
z,
};
return publicInterface;
}
// Convenience semantic aliases for vector3.
Luu.translation = Luu.vector3;
Luu.rotation    = Luu.vector3;
Luu.scaling     = Luu.vector3;
// Transforms the vector by the given 4x4 matrix.
Luu.vector3.transform = function(v, m = [])
{
Luu.assert && (m.length === 16)
|| Luu.throw("Expected a 4 x 4 matrix to transform the vector by.");
const x_ = ((m[0] * v.x) + (m[4] * v.y) + (m[ 8] * v.z));
const y_ = ((m[1] * v.x) + (m[5] * v.y) + (m[ 9] * v.z));
const z_ = ((m[2] * v.x) + (m[6] * v.y) + (m[10] * v.z));
v.x = x_;
v.y = y_;
v.z = z_;
}
Luu.vector3.normalize = function(v)
{
const sn = ((v.x * v.x) + (v.y * v.y) + (v.z * v.z));
if (sn != 0 && sn != 1)
{
const inv = (1 / Math.sqrt(sn));
v.x *= inv;
v.y *= inv;
v.z *= inv;
}
}
Luu.vector3.dot = function(v, other)
{
return ((v.x * other.x) + (v.y * other.y) + (v.z * other.z));
}
Luu.vector3.cross = function(v, other)
{
const c = Luu.vector3();
c.x = ((v.y * other.z) - (v.z * other.y));
c.y = ((v.z * other.x) - (v.x * other.z));
c.z = ((v.x * other.y) - (v.y * other.x));
return c;
}
Luu.vector3.invert = function(v)
{
v.x *= -1;
v.y *= -1;
v.z *= -1;
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
Luu.vertex = function(x = 0, y = 0, z = 0)
{
Luu.assert && ((typeof x === "number") &&
(typeof y === "number") &&
(typeof z === "number"))
|| Luu.throw("Expected numbers as parameters to the vertex factory.");
const publicInterface =
{
x,
y,
z,
w: 1,
};
return publicInterface;
}
// Transforms the vertex by the given 4x4 matrix.
Luu.vertex.transform = function(v, m = [])
{
Luu.assert && (m.length === 16)
|| Luu.throw("Expected a 4 x 4 matrix to transform the vertex by.");
const x_ = ((m[0] * v.x) + (m[4] * v.y) + (m[ 8] * v.z) + (m[12] * v.w));
const y_ = ((m[1] * v.x) + (m[5] * v.y) + (m[ 9] * v.z) + (m[13] * v.w));
const z_ = ((m[2] * v.x) + (m[6] * v.y) + (m[10] * v.z) + (m[14] * v.w));
const w_ = ((m[3] * v.x) + (m[7] * v.y) + (m[11] * v.z) + (m[15] * v.w));
v.x = x_;
v.y = y_;
v.z = z_;
v.w = w_;
}
// Applies perspective division to the vertex.
Luu.vertex.perspective_divide = function(v)
{
v.x /= v.w;
v.y /= v.w;
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
// A collection of ngons, with shared translation and rotation.
Luu.mesh = function(ngons = [Luu.ngon()], transform = {})
{
Luu.assert && (ngons instanceof Array)
|| Luu.throw("Expected a list of ngons for creating an ngon mesh.");
Luu.assert && (transform instanceof Object)
|| Luu.throw("Expected an object with transformation properties.");
Luu.assert && ((typeof Luu.mesh.defaultTransform.rotation !== "undefined") &&
(typeof Luu.mesh.defaultTransform.translation !== "undefined") &&
(typeof Luu.mesh.defaultTransform.scaling !== "undefined"))
|| Luu.throw("The default transforms object for mesh() is missing required properties.");
// Combine default transformations with the user-supplied ones.
transform =
{
...Luu.mesh.defaultTransform,
...transform
};
const publicInterface =
{
ngons,
rotation: transform.rotation,
translation: transform.translation,
scale: transform.scaling,
};
return publicInterface;
}
Luu.mesh.defaultTransform =
{
translation: Luu.translation(0, 0, 0),
rotation: Luu.rotation(0, 0, 0),
scaling: Luu.scaling(1, 1, 1)
};
Luu.mesh.object_space_matrix = function(m)
{
const translationMatrix = Luu.matrix44.translation(m.translation.x,
m.translation.y,
m.translation.z);
const rotationMatrix = Luu.matrix44.rotation(m.rotation.x,
m.rotation.y,
m.rotation.z);
const scalingMatrix = Luu.matrix44.scaling(m.scale.x,
m.scale.y,
m.scale.z);
return Luu.matrix44.multiply(Luu.matrix44.multiply(translationMatrix, rotationMatrix), scalingMatrix);
}
/*
* 2019, 2020 Tarpeeksi Hyvae Soft
*
* Software: Luujanko
*
*/
"use strict";
{
// Holds a bunch of pre-created SVG <polygon> elements that can be appended into an SVG
// image being rendered.
const polygonElementCache = [];
Luu.render = function(meshes = [Luu.mesh()],
targetSVGElement,
options = Luu.render.defaultOptions)
{
const renderCallInfo = {
numNgonsRendered: 0,
totalRenderTimeMs: performance.now(),
};
options = Object.freeze({
...Luu.render.defaultOptions,
...options
});
const renderWidth = Number(targetSVGElement.getAttribute("width"));
const renderHeight = Number(targetSVGElement.getAttribute("height"));
prepare_cache(polygonElementCache, meshes);
wipe(targetSVGElement);
draw(meshes, targetSVGElement);
renderCallInfo.totalRenderTimeMs = (performance.now() - renderCallInfo.totalRenderTimeMs);
return renderCallInfo;
function wipe(svgElement)
{
while (svgElement.lastChild)
{
svgElement.removeChild(svgElement.lastChild);
}
return;
}
function draw(meshes, svgElement)
{
const cameraMatrix = Luu.matrix44.multiply(Luu.matrix44.rotation(options.viewRotation.x,
options.viewRotation.y,
options.viewRotation.z),
Luu.matrix44.translation(-options.viewPosition.x,
-options.viewPosition.y,
-options.viewPosition.z));
const perspectiveMatrix = Luu.matrix44.perspective((options.fov * (Math.PI / 180)),
(renderWidth / renderHeight),
options.nearPlane,
options.farPlane);
const screenSpaceMatrix = Luu.matrix44.ortho((renderWidth + 1), (renderHeight + 1));
const clipSpaceMatrix = Luu.matrix44.multiply(perspectiveMatrix, cameraMatrix);
let numNgonsRendered = 0;
for (const mesh of meshes)
{
const objectSpaceMatrix = Luu.mesh.object_space_matrix(mesh);
for (const ngon of mesh.ngons)
{
const transformedNgon = Luu.transform_and_clip(ngon,
objectSpaceMatrix,
clipSpaceMatrix,
screenSpaceMatrix);
if (transformedNgon)
{
Luu.assert && (numNgonsRendered < polygonElementCache.length)
|| Luu.throw("Overflowing the polygon element cache.");
const dstPolyElement = polygonElementCache[numNgonsRendered];
Luu.rasterize(transformedNgon, dstPolyElement, svgElement);
numNgonsRendered++;
}
}
}
renderCallInfo.numNgonsRendered = numNgonsRendered;
return;
}
function prepare_cache(cache, meshesToBeRendered)
{
const numNgonsInMeshes = meshesToBeRendered.reduce((ngonCount, mesh)=>(ngonCount += mesh.ngons.length), 0);
if (cache.length < numNgonsInMeshes)
{
const deltaNgons = (numNgonsInMeshes - cache.length);
Luu.log(`Resizing the polygon cache's capacity from ${cache.length} to ${numNgonsInMeshes}`);
for (let i = 0; i < deltaNgons; i++)
{
const newElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
newElement.setAttribute("fill", "transparent");
newElement.setAttribute("pointer-events", "none");
cache.push(newElement);
}
}
return;
}
}
Luu.render.defaultOptions = {
viewPosition: Luu.vector3(0, 0, 0),
viewRotation: Luu.vector3(0, 1, 0),
nearPlane: 1,
farPlane: 1000,
fov: 43,
};
}
