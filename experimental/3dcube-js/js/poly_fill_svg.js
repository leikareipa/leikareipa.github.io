/*
 * Most recent known filename: js/poly_fill_svg.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Routines for filling in polygons into an SVG canvas.
 *
 */

"use strict"

const polygon_fill_svg_n = {};

// Fills polygons using SVG into an <svg> element.
polygon_fill_svg_n.fill_polygons = function(polygons = [])
{
    k_assert((this instanceof render_surface_n.render_surface_o), "Expected the function to be bound to a render surface.");
    k_assert((polygons.length > 0), "Expected a non-empty list of polygons.");

    const svgElement = this.exposed();
    k_assert((svgElement != null), "Did not receive a proper SVG element for rendering.");

    for (let i = 0; i < polygons.length; i++)
    {
        k_assert((polygons[i] instanceof geometry_n.polygon_o), "Expected a polygon.");

        // Create the SVG element that defines this polygon.
        const polyElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        {
            k_assert((polyElement != null), "Failed to create an SVG polygon element.");

            polyElement.setAttribute("id", ("ply" + i));
            polyElement.setAttribute("points", function()
                                    { // Create a string containing all the polygon's vertices' x,y coordinates.
                                        let pointString = "";

                                        for (let p = 0; p < polygons[i].v.length; p++)
                                        {
                                            pointString += polygons[i].v[p].x + "," + polygons[i].v[p].y + " ";
                                        }

                                        return pointString;
                                    }());
        }

        polyElement.style.strokeWidth = 0;
        polyElement.style.fill = polygons[i].color.to_hex();

        // Anti-aliasing can lead to seams between polygons, so disable it.
        polyElement.style.shapeRendering = "crispedges";

        svgElement.appendChild(polyElement);
    }
}
