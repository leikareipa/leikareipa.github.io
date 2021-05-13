/*
 * Most recent known filename: js/poly_fill_bary.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * A triangle filler with barycentric coordinate-based rasterization onto a HTML5 Canvas.
 * 
 */

"use strict"

const polygon_fill_bary_n = {}
{
    // Computes barycentric coordinates across each triangle's (triangle's) face to
    // figure out whether a given pixel on the screen is inside a triangle. Simple,
    // but slow.
    polygon_fill_bary_n.fill_polygons = function(triangles = [geometry_n.polygon_o])
    {
        k_assert((this instanceof render_surface_n.render_surface_o), "Expected the function to be bound to a render surface.");
        k_assert(((triangles[0] instanceof geometry_n.polygon_o) &&
                  (triangles[0].v.length === 3)), "Expected triangles.");
        k_assert((triangles.length > 0), "Received an empty list of triangles to rasterize.");

        const surface = this;
        const width = surface.width;
        const height = surface.height;

        // We'll rasterize the triangles into the canvas's pixel array.
        const pixelMap = surface.exposed().getImageData(0, 0, width, height);

        for (let i = 0; i < triangles.length; i++)
        {
            k_assert(((triangles[i] instanceof geometry_n.polygon_o) && (triangles[i].v.length === 3)),
                     "Expected triangles only.");

            const triangle = triangles[i];

            // Get the polygon's bounding box, inside which we'll test the pixels to
            // see which fall on the polygon.
            const rect = new geometry_n.bounding_rect_o(triangle);
            rect.clip_to_viewport(0, 0, width, height);

            // If the box has neither width nor height, its triangle is fully outside
            // of the screen, and can thus be ignored.
            if ((rect.width() <= 0) &&
                (rect.height() <= 0))
            {
                continue;
            }

            // Pre-compute barycentric coordinates for the sides of the bounding box, so
            // we can lerp them across rather than computing them separately for each pixel.
            {
                var bcTopLeft = triangle.to_barycentric_coords(rect.left(), rect.top());
                const bcTopRight = triangle.to_barycentric_coords(rect.right(), rect.top());
                const bcBottomLeft = triangle.to_barycentric_coords(rect.left(), rect.bottom());

                const sx = (1 / rect.width());
                const sy = (1 / rect.height());
        
                var xStep = new geometry_n.vector3_o((k_lerp(bcTopLeft.x, bcTopRight.x, sx) - bcTopLeft.x),
                                                     (k_lerp(bcTopLeft.y, bcTopRight.y, sx) - bcTopLeft.y),
                                                     (k_lerp(bcTopLeft.z, bcTopRight.z, sx) - bcTopLeft.z));
                var yStep = new geometry_n.vector3_o((k_lerp(bcTopLeft.x, bcBottomLeft.x, sy) - bcTopLeft.x),
                                                     (k_lerp(bcTopLeft.y, bcBottomLeft.y, sy) - bcTopLeft.y),
                                                     (k_lerp(bcTopLeft.z, bcBottomLeft.z, sy) - bcTopLeft.z));

                var yPos = new geometry_n.vertex_o();
                var xPos = new geometry_n.vertex_o();
            }

            // Loop over each pixel in the bounding rectangle to find which of them are
            // inside the polygon. Those that are get painted on the screen.
            yPos.x = bcTopLeft.x;
            yPos.y = bcTopLeft.y;
            yPos.z = bcTopLeft.z;
            for (let y = rect.top(); y <= rect.bottom(); y++)
            {
                yPos.x += yStep.x;
                yPos.y += yStep.y;
                yPos.z += yStep.z;

                // For early stopping.
                let triFound = false;

                xPos.x = yPos.x;
                xPos.y = yPos.y;
                xPos.z = yPos.z;
                for (let x = rect.left(); x <= rect.right(); x++)
                {
                    xPos.x += xStep.x;
                    xPos.y += xStep.y;
                    xPos.z += xStep.z;

                    // If this pixel isn't inside the triangle, move on to the next one.
                    if (xPos.x < 0 ||
                        xPos.y < 0 ||
                        xPos.z < 0)
                    {
                        // If the previous pixel was inside the triangle, and since this
                        // one isn't, none of the rest on this row will be, so we can quit
                        // the row entirely and move onto the next one.
                        if (triFound)
                        {
                            break;
                        }

                        continue;
                    }

                    triFound = true;

                    // Draw the pixel, if it's not beneath a previous one.
                    {
                        const depth = (triangle.v[0].z * xPos.x) +
                                      (triangle.v[1].z * xPos.y) +
                                      (triangle.v[2].z * xPos.z);

                        if (surface.depthBuffer[x + y * width] >= depth)
                        {
                            surface.depthBuffer[x + y * width] = depth;

                            const pixelIdx = ((x + y * width) * 4);
                            pixelMap.data[pixelIdx + 0] = triangle.color.r;
                            pixelMap.data[pixelIdx + 1] = triangle.color.g;
                            pixelMap.data[pixelIdx + 2] = triangle.color.b;
                            pixelMap.data[pixelIdx + 3] = triangle.color.a;
                        }
                    }
                }
            }
        }

        surface.exposed().putImageData(pixelMap, 0, 0);
    }
}
