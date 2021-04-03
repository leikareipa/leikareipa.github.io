/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software (adapted from): PCbi / tools / converter / obj2component
 * 
 */

"use strict";

// Converts the given Wavefront OBJ file into an array of objects of the form {x, y, z},
// which in other words define the OBJ file's vertex data. The objects are arranged into
// sub-arrays, each sub-array representing a polygonal face.
export async function load_obj(objFile, mtlFile)
{
    const meshes = [];
    const convertedPolys = [];
    const objFileData = await fetch(objFile).then(r=>r.text());
    const mtlFileData = await fetch(mtlFile).then(r=>r.text());

    const materials = mtlFileData.split("\nnewmtl").slice(1);
    const objects = objFileData.split("\no ").slice(1);
    const textureNames = new Set();

    let uvs = [];
    let normals = [];
    let vertices = [];

    for (const object of objects)
    {
        let meshString = "";

        vertices = [...vertices, ...object.split("\n").filter(line=>line.startsWith("v "))];
        uvs      = [...uvs,      ...object.split("\n").filter(line=>line.startsWith("vt "))];
        normals  = [...normals,  ...object.split("\n").filter(line=>line.startsWith("v "))];

        const faceGroups = object.split("\nusemtl").slice(1);

        meshString += `mesh,{${object.split("\n")[0]}},${object.split("\n").filter(line=>line.startsWith("f ")).length}\n`;

        // Each face group is a set of one or more faces sharing
        // a material.
        for (const faceGroup of faceGroups)
        {
            const materialName  = (faceGroup.split("\n")[0] || null);
            const material      = (materials.filter(material=>(material.startsWith(materialName)))[0] || null);
            const materialKd    = (material.split("\n").filter(line=>line.startsWith("Kd "))[0] || null);
            const materialMapKd = (material.split("\n").filter(line=>line.startsWith("map_Kd "))[0] || null);
            const faces         = (faceGroup.split("\n").filter(line=>line.startsWith("f ")) || null);

            if ((materialName === null) ||
                (materialKd   === null) ||
                (material     === null) ||
                (faces        === null))
            {
                throw new Error("Invalid or unsupported mesh data.");
            }

            const color = materialKd.split(" ").slice(1);
            const textureName = ((materialMapKd === null)
                                ? ""
                                : (materialMapKd.split(" ")[1].slice(materialMapKd.split(" ")[1].replace(/\\/g, "/").lastIndexOf("/") + 1)));

            if (color.length != 3)
            {
                throw new Error("Invalid MTL file: malformed 'Kd' entry, expected 3 values.");
            }

            if (textureName === null)
            {
                throw new Error("Invalid MTL file: malformed 'map_Kd' entry.");
            }

            if (textureName.length)
            {
                textureNames.add(textureName);
            }

            for (const face of faces)
            {
                const indicesList = face.split(" ").slice(1);

                meshString += `polygon,${indicesList.length}\n`;
                meshString += `material,${Math.floor(color[0]*255)},${Math.floor(color[1]*255)},${Math.floor(color[2]*255)},255,{${textureName}}\n`;

                const convertedVerts = [];

                for (const indices of indicesList)
                {
                    // [0]: vertex index, [1]: uv index, [2]: normals index.
                    const index = indices.split("/");

                    const vertexCoords = vertices[index[0] - 1].split(" ").slice(1);
                    const uvCoords = ((uvs[index[1] - 1] || "vt 0.000000 0.000000").split(" ").slice(1));
                    
                    vertexCoords[0] = -Number(vertexCoords[0]);

                    const vertexCoordString = vertexCoords.join(",");
                    const uvString = uvCoords.join(",");

                    convertedVerts.push({
                        x: Number(vertexCoords[0]),
                        y: Number(vertexCoords[1]),
                        z: Number(vertexCoords[2]),
                    });

                    meshString += `vertex,${vertexCoordString},${uvString}\n`;
                }

                convertedPolys.push(convertedVerts);
            }
        }

        meshes.push(meshString.trim());
    }

    return convertedPolys;
}
