/*
 * Most recent known filename: js/poly_transform.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Routines for transforming polygons to screen-space.
 *
 */

"use strict"

const polygon_transform_n = {};
{
    // Transforms the given polygons, with their associated object space matrix, into screen-space,
    // also accounting for the given camera orientation.
    polygon_transform_n.transform_polygons = function(polygons = [],
                                                      objectSpaceMatrix = [],
                                                      cameraMatrix = [],
                                                      screenWidth = 0,
                                                      screenHeight = 0)
    {
        k_assert((polygons.length > 0), "Expected a non-empty list of polygons.");
        k_assert((objectSpaceMatrix.length === 16), "Expected a 4 x 4 matrix.");
        k_assert((cameraMatrix.length === 16), "Expected a 4 x 4 matrix.");
        k_assert(((screenWidth > 0) && (screenHeight > 0)), "The screen can't have 0 width or height.");
        
        // Create matrices with which we can transform the polygons, ultimately into
        // screen-space but also into clip-space in the interim.
        let toClipSpace = [];
        let toScreenSpace = [];
        {
            const viewSpace = matrix44_n.multiply_matrices(cameraMatrix, objectSpaceMatrix);
            
            // Clip-space, for clipping triangles against the viewport; although for now,
            // the interim step into clip-space is ignored, as no triangle clipping is to
            // be done.
            toClipSpace = matrix44_n.multiply_matrices(matrix44_n.perspective_matrix(1/*camera fov in radians*/, (screenWidth / screenHeight), 1, 1000),
                                                       viewSpace);

            toScreenSpace = matrix44_n.multiply_matrices(matrix44_n.screen_space_matrix(screenWidth, screenHeight),
                                                         toClipSpace);
        }
        
        // Transform the polygons.
        let transfPolys = [];
        {
            let k = 0;
            for (let i = 0; i < polygons.length; i++)
            {
                k_assert((polygons[i] instanceof geometry_n.polygon_o), "Expected a polygon.");
                
                transfPolys[k] = new geometry_n.polygon_o(polygons[i].v.length);
                transfPolys[k].clone_from(polygons[i]);
                
                transfPolys[k].transform(toScreenSpace);
                transfPolys[k].perspective_divide();
                
                // Ignore triangles that are behind the camera; otherwise, rendering errors will
                // occur. Normally, you'd properly clip the polygons against the frustum, but for
                // this program's purposes this suffices.
                if (transfPolys[k].v[0].w <= 0 ||
                    transfPolys[k].v[1].w <= 0 ||
                    transfPolys[k].v[2].w <= 0)
                {
                    transfPolys.pop();
                    continue;
                }
                
                // Ignore triangles that aren't facing the camera; i.e. do backface
                // culling.
                if (!transfPolys[k].is_facing_camera())
                {
                    transfPolys.pop();
                    continue;
                }
                
                k++;
            }
        }
        
        return transfPolys;
    }
}
