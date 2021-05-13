/*
 * Most recent known filename: js/geometry.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Functions to do with space; like polygons, vectors, etc.
 *
 */

 "use strict"

const geometry_n = {};
{
    // A 2d bounding rectangle that encloses a given polygon.
    geometry_n.bounding_rect_o = function(polygon = geometry_n.polygon_o)
    {
        k_assert((polygon instanceof geometry_n.polygon_o) &&
                 (polygon.v.length >= 3), "Expected a polygon with at least three vertices.");

        this.min = new geometry_n.vector2_o(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        this.max = new geometry_n.vector2_o(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

        // Find the minima and maxima of the given polygon.
        // (We use floor() and ceil() to prevent precision issues in barycentric rendering.)
        for (let i = 0; i < polygon.v.length; i++)
        {
            // Horizontal.
            if (Math.floor(polygon.v[i].x) < this.min.x) this.min.x = Math.floor(polygon.v[i].x);
            if (Math.ceil(polygon.v[i].x) > this.max.x) this.max.x = Math.ceil(polygon.v[i].x);
            
            // Vertical.
            if (Math.floor(polygon.v[i].y) < this.min.y) this.min.y = Math.floor(polygon.v[i].y);
            if (Math.ceil(polygon.v[i].y) > this.max.y) this.max.y = Math.ceil(polygon.v[i].y);
        }

        // Clips this bounding rectangle against a normal rectangle of the given size and position.
        // Note that if the bounding rectangle was fully outside of the clip region, its geometry
        // will become invalid, with a width and/or height of 0.
        this.clip_to_viewport = function(x = 0, y = 0, width = 0, height = 0)
        {
            if (this.min.x < x) this.min.x = x;
            if (this.max.x < x) this.max.x = x;
            if (this.min.x >= width) this.min.x = (width - 1);
            if (this.max.x >= width) this.max.x = (width - 1);
            if (this.min.y < y) this.min.y = y;
            if (this.max.y < y) this.max.y = y;
            if (this.min.y >= height) this.min.y = (height - 1);
            if (this.max.y >= height) this.max.y = (height - 1);
        }

        this.width = function()
        {
            return Math.abs(this.max.x - this.min.x);
        }
        
        this.height = function()
        {
            return Math.abs(this.max.y - this.min.y);
        }

        this.top = function()
        {
            return this.min.y;
        }

        this.bottom = function()
        {
            return this.max.y;
        }

        this.left = function()
        {
            return this.min.x;
        }

        this.right = function()
        {
            return this.max.x;
        }
    }

    geometry_n.vector2_o = function(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    geometry_n.vector3_o = function(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;

        this.cross = function(other = geometry_n.vector3_o)
        {
            k_assert((other instanceof geometry_n.vector3_o), "Expected a vector.");

            const c = new geometry_n.vector3_o();

            c.x = ((this.y * other.z) - (this.z * other.y));
            c.y = ((this.z * other.x) - (this.x * other.z));
            c.z = ((this.x * other.y) - (this.y * other.x));

            return c;
        }
    }

    geometry_n.vertex_o = function(x = 0, y = 0, z = 0, w = 1, u = 0, v = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        
        // Texture coordinates.
        this.u = u;
        this.v = v;

        // Transform the vertices by the given matrix.
        this.transform = function(m = [])
        {
            k_assert((m.length === 16), "Expected a 4 x 4 matrix to transform the vertex by.");
            
            const x_ = ((m[0] * this.x) + (m[4] * this.y) + (m[ 8] * this.z) + (m[12] * this.w));
            const y_ = ((m[1] * this.x) + (m[5] * this.y) + (m[ 9] * this.z) + (m[13] * this.w));
            const z_ = ((m[2] * this.x) + (m[6] * this.y) + (m[10] * this.z) + (m[14] * this.w));
            const w_ = ((m[3] * this.x) + (m[7] * this.y) + (m[11] * this.z) + (m[15] * this.w));

            this.x = x_;
            this.y = y_;
            this.z = z_;
            this.w = w_;
        };
    }

    geometry_n.polygon_o = function(numVertices = 3)
    {
        k_assert((numVertices > 2) && (numVertices < 10), "Bad vertex count.");

        this.v = [];
        for (let i = 0; i < numVertices; i++)
        {
            this.v.push(new geometry_n.vertex_o());
        }
        
        this.color = new color_n.rgba_o();
        
        // Duplicates the given polygon's relevant properties onto this one.
        this.clone_from = function(otherPolygon = {})
        {
            k_assert(((otherPolygon instanceof geometry_n.polygon_o) &&
                      (this.v.length === otherPolygon.v.length)), "Incompatible polygons for cloning.");

            for (let i = 0; i < otherPolygon.v.length; i++)
            {
                this.v[i] = Object.assign({}, otherPolygon.v[i]);
            }
            
            this.color = Object.assign({}, otherPolygon.color);
        };

        // Back-face culling.
        this.is_facing_camera = function()
        {
            if (this.v.length === 3) // For triangles.
            {
                // Based on https://stackoverflow.com/a/35280392.
                {
                    const ax = (this.v[0].x - this.v[1].x);
                    const ay = (this.v[0].y - this.v[1].y);
                    const bx = (this.v[0].x - this.v[2].x);
                    const by = (this.v[0].y - this.v[2].y);
                    const cz = ((ax * by) - (ay * bx));

                    return (cz >= 0);
                }
            }
            else
            {
                k_assert(0, "Unsupported number of vertices for backface culling.");
            }
        };
        
        // Transform the polygon's vertices by the given matrix.
        this.transform = function(m = [])
        {
            k_assert((m.length === 16), "Expected a 4 x 4 matrix to transform the polygon by.");
            
            for (let i = 0; i < this.v.length; i++)
            {
                this.v[i].transform(m);
            }
        };
        
        this.perspective_divide = function()
        {
            for (let i = 0; i < this.v.length; i++)
            {
                this.v[i].x /= this.v[i].w;
                this.v[i].y /= this.v[i].w;
                this.v[i].z /= this.v[i].w;
            }
        };

        // Transforms the given x,y screen coordinates into barycentric coordinates
        // relative to this polygon (must be a triangle). Note that the triangle's
        // vertices need to be in screen-space for the result to be valid.
        /*
         *      Adapted from code written originally by Dmitry V. Sokolov for his 3d
         *      software renderer (https://github.com/ssloy/tinyrenderer). Attribution:
         *      {
         *          Copyright Dmitry V. Sokolov
         *
         *          This software is provided 'as-is', without any express or implied warranty. In
         *          no event will the authors be held liable for any damages arising from the use
         *          of this software. Permission is granted to anyone to use this software for any
         *          purpose, including commercial applications, and to alter it and redistribute it
         *          freely, subject to the following restrictions:
         *
         *          1. The origin of this software must not be misrepresented; you must not claim that
         *              you wrote the original software. If you use this software in a product, an
         *              acknowledgment in the product documentation would be appreciated but is not
         *              required.
         *          2. Altered source versions must be plainly marked as such, and must not be
         *              misrepresented as being the original software.
         *          3. This notice may not be removed or altered from any source distribution.
         *      }
         * 
         */
        this.to_barycentric_coords = function(x = 0, y = 0)
        {
            k_assert((this.v.length === 3), "Can derive barycentric coordinates only for triangles.");

            const v1 = new geometry_n.vector3_o((this.v[2].x - this.v[0].x),
                                                (this.v[1].x - this.v[0].x),
                                                (this.v[0].x - x));

            const v2 = new geometry_n.vector3_o((this.v[2].y - this.v[0].y),
                                                (this.v[1].y - this.v[0].y),
                                                (this.v[0].y - y));
                                        
            const v3 = v2.cross(v1);

            // Degenerate case.
            if (Math.abs(v3.z < 1))
            { 
                return new geometry_n.vector3_o(-1, -1, -1);
            }

            const zc = (1 / v3.z);
            return new geometry_n.vector3_o((1 - ((v3.x + v3.y) * zc)),
                                            (v3.y * zc),
                                            (v3.x * zc));
        };
    }

    // A mesh of polygons.
    geometry_n.polygon_mesh_o = function(polygons = [],
                                         translation = new geometry_n.vector3_o(0, 0, 0),
                                         rotation = new geometry_n.vector3_o(0, 0, 0))
    {
        k_assert((polygons.length > 0), "Expected a non-empty list of polygons.");
        k_assert((translation instanceof geometry_n.vector3_o), "Expected a translation vector.");
        k_assert((rotation instanceof geometry_n.vector3_o), "Expected a rotation vector.");

        this.polygons = [];
        for (let i = 0; i < polygons.length; i++)
        {
            k_assert((polygons[i] instanceof geometry_n.polygon_o), "Expected a polygon.");

            const newPoly = new geometry_n.polygon_o(polygons[i].v.length);
            newPoly.clone_from(polygons[i]);

            this.polygons.push(newPoly);
        }

        this.rotationVec = rotation;
        this.translationVec = translation;

        // Returns a matrix by which the polygons of this mesh can be transformed into the mesh's object-space.
        this.object_space_matrix = function()
        {
            const m = matrix44_n.multiply_matrices(matrix44_n.translation_matrix(this.translationVec.x, this.translationVec.y, this.translationVec.z),
                                                   matrix44_n.rotation_matrix(this.rotationVec.x, this.rotationVec.y, this.rotationVec.z));

            k_assert((m.length === 16), "Expected to return a 4 x 4 object space matrix.");
            return m;
        }

        // Sorts the mesh's polygons from farthest to closest.
        this.sort_vertices_by_depth = function()
        {
            const sort_by_z = function(a, b)
            {
                const d1 = (a.v[0].z + a.v[1].z + a.v[2].z);
                const d2 = (b.v[0].z + b.v[1].z + b.v[2].z);

                return (d1 < d2);
            };

            this.polygons.sort(sort_by_z);
        }
    }

    // Templates for various basic 3d shapes that can be inserted into meshes.
    geometry_n.triangle_objects_n = {};
    {
        geometry_n.triangle_objects_n.cube = function(size = 1)
        {
            let triangles = [];

            // For centering the object.
            const sizeHalf = (size / 2);

            // Front.
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(-sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(-sizeHalf, sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(180, 180, 180);
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(-sizeHalf, sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(sizeHalf, sizeHalf, -sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(180, 180, 180);

            // Back.
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(sizeHalf, -sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(-sizeHalf, -sizeHalf, sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(170, 170, 170);
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(-sizeHalf, -sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(-sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(170, 170, 170);

            // Left.
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(-sizeHalf, -sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(-sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(-sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(135, 135, 135);
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(-sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(-sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(-sizeHalf, sizeHalf, -sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(135, 135, 135);

            // Right.
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(sizeHalf, sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(110, 110, 110);
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(sizeHalf, -sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(110, 110, 110);

            // Top.
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(sizeHalf, -sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(-sizeHalf, -sizeHalf, sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(200, 200, 200);
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(-sizeHalf, -sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(-sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(sizeHalf, -sizeHalf, -sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(200, 200, 200);

            // Bottom.
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(-sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(-sizeHalf, sizeHalf, -sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(160, 160, 160);
            triangles.push(new geometry_n.polygon_o(3));
            triangles[triangles.length-1].v[0] = new geometry_n.vertex_o(-sizeHalf, sizeHalf, -sizeHalf);
            triangles[triangles.length-1].v[1] = new geometry_n.vertex_o(sizeHalf, sizeHalf, sizeHalf);
            triangles[triangles.length-1].v[2] = new geometry_n.vertex_o(sizeHalf, sizeHalf, -sizeHalf);
            triangles[triangles.length-1].color = new color_n.rgba_o(160, 160, 160);

            return triangles;
        }
    }
}
