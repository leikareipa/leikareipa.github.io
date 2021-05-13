/*
 * Most recent known filename: js/poly_fill_canvas.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * A polygon filler with HTML5 Canvas-native drawing.
 * 
 */

"use strict"

const polygon_fill_canvas_n = {}
{
    polygon_fill_canvas_n.fill_polygons = function(polygons = [])
    {
        k_assert((this instanceof render_surface_n.render_surface_o), "Expected the function to be bound to a render surface.");
        k_assert((polygons.length > 0), "Expected a non-empty list of polygons.");

        const renderContext = this.exposed();
        
        for (let i = 0; i < polygons.length; i++)
        {
            k_assert((polygons[i] instanceof geometry_n.polygon_o), "Expected a polygon.");

            const polygon = polygons[i];

            renderContext.fillStyle = polygon.color.to_hex();
            
            renderContext.beginPath();
            renderContext.moveTo(polygon.v[0].x, polygon.v[0].y);
            for (let p = 1; p < polygon.v.length; p++)
            {
                renderContext.lineTo(polygon.v[p].x, polygon.v[p].y);
            }

            // Fill three times, to reduce polygon seam artefacts that result from anti-aliasing.
            renderContext.fill();
            renderContext.fill();
            renderContext.fill();
        }
    }
}
