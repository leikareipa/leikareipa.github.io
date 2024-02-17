/*
 * 2020, 2024 Tarpeeksi Hyvae Soft
 *
 * Software: PCbi / w95
 * 
 */

export function obj2mesh(objFile)
{
    return new Promise((resolve, reject)=>{
        const meshes = {};
        const objFileReader = new FileReader();

        objFileReader.onloadend = ()=>{
            let uvs = [];
            let normals = [];
            let vertices = [];
            const objects = objFileReader.result.split("\no ").slice(1);

            for (const object of objects) {
                const objectName = object.split("\n")[0];
                const polys = [];
                const faceGroups = object.split("\nusemtl").slice(1);

                vertices.push(...object.split("\n").filter(line=>line.startsWith("v ")));
                uvs.push(...object.split("\n").filter(line=>line.startsWith("vt ")));
                normals.push(...object.split("\n").filter(line=>line.startsWith("v ")));

                // Each face group is a set of one or more faces sharing a material.
                for (const faceGroup of faceGroups) {
                    const faces = (faceGroup.split("\n").filter(line=>line.startsWith("f ")) || null);

                    if (faces === null) {
                        reject("Invalid or unsupported mesh data.");
                        return;
                    }

                    for (const face of faces) {
                        const indicesList = face.split(" ").slice(1);
                        const rngonVerts = [];

                        for (const indices of indicesList)
                        {
                            // [0]: vertex index, [1]: uv index, [2]: normals index.
                            const index = indices.split("/");

                            const vertexCoords = vertices[index[0] - 1].split(" ").slice(1);
                            const uvCoords = ((uvs[index[1] - 1] || "vt 0.000000 0.000000").split(" ").slice(1));
                            
                            vertexCoords[0] = -Number(vertexCoords[0]);

                            rngonVerts.push(
                                Rngon.vertex(
                                    Number(vertexCoords[0]),
                                    Number(vertexCoords[1]),
                                    Number(vertexCoords[2]),
                                    Number(uvCoords[0]),
                                    -Number(uvCoords[1])
                                )
                            );
                        }

                        polys.push(
                            Rngon.ngon(rngonVerts, {
                                hasWireframe: true,
                                wireframeColor: Rngon.color.orange,
                                hasFill: false,
                                isTwoSided: true,
                            })
                        );
                    }
                }

                meshes[objectName] = Rngon.mesh(polys);
            }

            resolve(meshes);

            return;
        };

        objFileReader.readAsText(objFile);
    });
}
