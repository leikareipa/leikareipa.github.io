/*
 * Most recent known filename: js/main.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Draws a bunch of spinning 3d cubes using various methods of rendering.
 *
 */

"use strict"

const cube_renderer_n = {};
{
    // The names of the renderers that're available. Note that these strings are user-facing.
    k_const_property(cube_renderer_n,
                     "RENDERER_NAMES", Object.freeze(["SVG", "Canvas 2D", "Barycentric"]));

    // A list of the polygonal meshes that make up the scene we'll render.
    cube_renderer_n.sceneMeshes = [];
    cube_renderer_n.sceneMeshes.push(new geometry_n.polygon_mesh_o(geometry_n.triangle_objects_n.cube(100),
                                                                   new geometry_n.vector3_o(0, 0, 0),
                                                                   new geometry_n.vector3_o(0, 0, 0)));

    // The angle, in radians, by which we'll rotate the cube(s) each frame. Depends on
    // the rate of screen refresh.
    cube_renderer_n.cubeRotAngle = 0;
    
    // Index in the list of available renderers of the renderer we're currently using
    // to draw the scene.
    cube_renderer_n.activeRenderer = 0;

    cube_renderer_n.add_random_cube = function()
    {
        const size = (20 + (Math.random() * 80));

        const pos = new geometry_n.vector3_o((Math.random() * 200) - (Math.random() * 200),
                                             (Math.random() * 200) - (Math.random() * 200),
                                             (Math.random() * 50));

        const rot = new geometry_n.vector3_o((Math.random() * (Math.PI * 2)),
                                             (Math.random() * (Math.PI * 2)),
                                             (Math.random() * (Math.PI * 2)));

        cube_renderer_n.sceneMeshes.push(new geometry_n.polygon_mesh_o(geometry_n.triangle_objects_n.cube(size), pos, rot));
    }

    cube_renderer_n.set_active_renderer = function(idx = 0)
    {
        cube_renderer_n.activeRenderer = idx;

        // The unit calling this function shouldn't assume that we were able to set the
        // renderer to the given index, so return the index we actually did set it to.
        return cube_renderer_n.activeRenderer;
    }

    // Renders one frame of the scene onto the currently-active render surface.
    cube_renderer_n.render_scene = function()
    {
        // Prepare the render surface. The surface doesn't necessarily need to be created
        // anew every frame, but we do that here for simplicity.
        let renderSurface = {};
        {
            switch (cube_renderer_n.activeRenderer)
            {
                case 0:
                {
                    renderSurface = new render_surface_n.render_surface_o("render_surface_svg", "svg", "main_render_container",
                                                                          polygon_fill_svg_n.fill_polygons);
                    break;
                }
                case 1:
                {
                    renderSurface = new render_surface_n.render_surface_o("render_surface_canvas_hw", "canvas", "main_render_container",
                                                                          polygon_fill_canvas_n.fill_polygons);
                    break;
                }
                case 2:
                {
                    renderSurface = new render_surface_n.render_surface_o("render_surface_canvas_bary", "canvas", "main_render_container",
                                                                          polygon_fill_bary_n.fill_polygons);
                    break;
                }
                default:
                {
                    k_assert(0, "Unknown renderer.");
                    break;
                }
            }

            // Prepare the render surface for the next frame.
            renderSurface.update_size();
            renderSurface.wipe_clean();
        }

        // Transform and render the scene's meshes.
        {
            // Position the camera.
            const cameraMatrix = matrix44_n.multiply_matrices(matrix44_n.translation_matrix(0, 0, 180),
                                                              matrix44_n.rotation_matrix(0, 0, 0));

            // Create a master list of the scene's polygons in screen-space, by iterating over all of the
            // meshes and transforming their polygons.
            let polyList = [];
            for (let i = 0; i < cube_renderer_n.sceneMeshes.length; i++)
            {
                const mesh = cube_renderer_n.sceneMeshes[i];

                mesh.rotationVec.x += cube_renderer_n.cubeRotAngle;
                mesh.rotationVec.y += cube_renderer_n.cubeRotAngle;
                mesh.rotationVec.z += 0;

                const transformedPolys = polygon_transform_n.transform_polygons(mesh.polygons, mesh.object_space_matrix(),
                                                                                cameraMatrix, renderSurface.width, renderSurface.height);

                polyList.push(...transformedPolys);
            }

            renderSurface.render_polygons(polyList);
        }
    }

    // Starts the rendering.
    cube_renderer_n.main = function()
    {
        window.requestAnimationFrame(repaint_callback);

        let prevTimestamp = 0;
        function repaint_callback(timestamp)
        {
            const msSinceLastUpdate = (timestamp - prevTimestamp);
            prevTimestamp = timestamp;
            
            const rotIncPerMs = 0.00035;
            cube_renderer_n.cubeRotAngle = (rotIncPerMs * msSinceLastUpdate);
            
            cube_renderer_n.render_scene();

            window.requestAnimationFrame(repaint_callback);
        };
    }();
}
