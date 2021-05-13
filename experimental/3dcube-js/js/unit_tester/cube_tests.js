/*
 * Most recent known filename: js/unit_tester/cube_tests.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 * Unit tests for a 3d cube renderer. At some point, these tests should be in
 * individual files, so they can be bundled with their corresponding unit.
 *
 */

"use strict"

const cube_renderer_unit_tests_n = {};
{
    // This function gets passed to the unit tester, which will then execute it.
    cube_renderer_unit_tests_n.unit_tests = function()
    {
        unit_test_n.test_unit("Color", function()
        {
            {
                const c = new color_n.rgba_o(1, 2, 3);
                unit_test_n.require((c.a == 255), "Alpha channel should default to 255.");
            }

            unit_test_n.require(((new color_n.rgba_o(132, 7, 99)).to_hex()==="#840763"),
                                "Color conversion from RGB to hex.");

            unit_test_n.reject(function(){ new color_n.rgba_o(-132, 7, 99); },
                               "Reject invalid color arguments: blue underflow.");
            unit_test_n.reject(function(){ new color_n.rgba_o(132, 256, 0); },
                               "Reject invalid color arguments: green overflow.");
            unit_test_n.reject(function(){ new color_n.rgba_o(132, 989965312314, 0); },
                               "Reject invalid color arguments: green overflow.");
            unit_test_n.reject(function(){ new color_n.rgba_o(0, 0, 0, 256); },
                               "Reject invalid color arguments: alpha overflow.");
        });

        unit_test_n.test_unit("Matrix", function()
        {
            {
                const m = matrix44_n.identity_matrix();
                unit_test_n.require((m.length === 16), "Identity matrix should be 4x4.");
                unit_test_n.require((m[0]===1 && m[4]===0 && m[ 8]===0 && m[12]===0 &&
                                    m[1]===0 && m[5]===1 && m[ 9]===0 && m[13]===0 &&
                                    m[2]===0 && m[6]===0 && m[10]===1 && m[14]===0 &&
                                    m[3]===0 && m[7]===0 && m[11]===0 && m[15]===1),
                                    "Identity matrix.");
            }
            
            {
                const m = matrix44_n.rotation_matrix(1.6572, 0.3457, 874665.5247);
                unit_test_n.require((m.length === 16), "Rotation matrix should be 4x4.");
                unit_test_n.require((unit_test_n.tr4(m[0])===-0.5131 && unit_test_n.tr4(m[4])===-0.7886 && unit_test_n.tr4(m[ 8])===-0.3389 && unit_test_n.tr4(m[12])===0.0000 && 
                                    unit_test_n.tr4(m[1])===0.1118  && unit_test_n.tr4(m[5])===0.3300  && unit_test_n.tr4(m[ 9])===-0.9373 && unit_test_n.tr4(m[13])===0.0000 && 
                                    unit_test_n.tr4(m[2])===0.8510  && unit_test_n.tr4(m[6])===-0.5188 && unit_test_n.tr4(m[10])===-0.0812 && unit_test_n.tr4(m[14])===0.0000 && 
                                    unit_test_n.tr4(m[3])===0.0000  && unit_test_n.tr4(m[7])===0.0000  && unit_test_n.tr4(m[11])===0.0000  && unit_test_n.tr4(m[15])===1.0000),
                                    "Rotation matrix.");
            }

            {
                const m = matrix44_n.translation_matrix(452.8541, 2.5412, 8745.1645);
                unit_test_n.require((m.length === 16), "Translation matrix should be4x4.");
                unit_test_n.require((unit_test_n.tr4(m[0])===1.0000 && unit_test_n.tr4(m[4])===0.0000 && unit_test_n.tr4(m[ 8])===0.0000 && unit_test_n.tr4(m[12])===452.8541  && 
                                    unit_test_n.tr4(m[1])===0.0000 && unit_test_n.tr4(m[5])===1.0000 && unit_test_n.tr4(m[ 9])===0.0000 && unit_test_n.tr4(m[13])===2.5412    && 
                                    unit_test_n.tr4(m[2])===0.0000 && unit_test_n.tr4(m[6])===0.0000 && unit_test_n.tr4(m[10])===1.0000 && unit_test_n.tr4(m[14])===8745.1645 && 
                                    unit_test_n.tr4(m[3])===0.0000 && unit_test_n.tr4(m[7])===0.0000 && unit_test_n.tr4(m[11])===0.0000 && unit_test_n.tr4(m[15])===1.0000),
                                    "Translation matrix.");
            }

            {
                const m = matrix44_n.perspective_matrix(0.7545, 1.7155, 0.9138, 97852.8647);
                unit_test_n.require((m.length === 16), "Perspective matrix should be 4x4.");
                unit_test_n.require((unit_test_n.tr4(m[0])===1.4712 && unit_test_n.tr4(m[4])===0.0000 && unit_test_n.tr4(m[ 8])===0.0000 && unit_test_n.tr4(m[12])===0.0000  && 
                                    unit_test_n.tr4(m[1])===0.0000 && unit_test_n.tr4(m[5])===2.5238 && unit_test_n.tr4(m[ 9])===0.0000 && unit_test_n.tr4(m[13])===0.0000  && 
                                    unit_test_n.tr4(m[2])===0.0000 && unit_test_n.tr4(m[6])===0.0000 && unit_test_n.tr4(m[10])===1.0000 && unit_test_n.tr4(m[14])===-1.8276 && 
                                    unit_test_n.tr4(m[3])===0.0000 && unit_test_n.tr4(m[7])===0.0000 && unit_test_n.tr4(m[11])===1.0000 && unit_test_n.tr4(m[15])===0.0000),
                                    "Perspective matrix.");
            }

            {
                const m = matrix44_n.screen_space_matrix(4567.2434, 3.1284);
                unit_test_n.require((m.length === 16), "Screen-space matrix should be 4x4.");
                unit_test_n.require((unit_test_n.tr4(m[0])===2283.6217 && unit_test_n.tr4(m[4])===0.0000  && unit_test_n.tr4(m[ 8])===0.0000 && unit_test_n.tr4(m[12])===2283.1217 && 
                                    unit_test_n.tr4(m[1])===0.0000    && unit_test_n.tr4(m[5])===-1.5642 && unit_test_n.tr4(m[ 9])===0.0000 && unit_test_n.tr4(m[13])===1.0642    && 
                                    unit_test_n.tr4(m[2])===0.0000    && unit_test_n.tr4(m[6])===0.0000  && unit_test_n.tr4(m[10])===1.0000 && unit_test_n.tr4(m[14])===0.0000    && 
                                    unit_test_n.tr4(m[3])===0.0000    && unit_test_n.tr4(m[7])===0.0000  && unit_test_n.tr4(m[11])===0.0000 && unit_test_n.tr4(m[15])===1.0000),
                                    "Screen-space matrix.");
            }

            {
                const m = matrix44_n.multiply_matrices(matrix44_n.translation_matrix(452.8541, 2.5412, 8745.1645),
                                                        matrix44_n.perspective_matrix(0.7545, 1.7155, 0.9138, 97852.8647));
                unit_test_n.require((m.length === 16), "Result of matrix multiplication should be 4x4.");
                unit_test_n.require((unit_test_n.tr4(m[0])===1.4712 && unit_test_n.tr4(m[4])===0.0000 && unit_test_n.tr4(m[ 8])===452.8541  && unit_test_n.tr4(m[12])===0.0000  && 
                                    unit_test_n.tr4(m[1])===0.0000 && unit_test_n.tr4(m[5])===2.5238 && unit_test_n.tr4(m[ 9])===2.5412    && unit_test_n.tr4(m[13])===0.0000  && 
                                    unit_test_n.tr4(m[2])===0.0000 && unit_test_n.tr4(m[6])===0.0000 && unit_test_n.tr4(m[10])===8746.1645 && unit_test_n.tr4(m[14])===-1.8276 && 
                                    unit_test_n.tr4(m[3])===0.0000 && unit_test_n.tr4(m[7])===0.0000 && unit_test_n.tr4(m[11])===1.0000    && unit_test_n.tr4(m[15])===0.0000),
                                    "Matrix multiplication.");
            }
        });

        unit_test_n.test_unit("Geometry", function()
        {
            // Creation.
            {
                unit_test_n.reject(function(){ new geometry_n.polygon_o(-54852); }, "Reject a polygon with too few vertices.");
                unit_test_n.reject(function(){ new geometry_n.polygon_o(-1); }, "Reject a polygon with too few vertices.");
                unit_test_n.reject(function(){ new geometry_n.polygon_o(0); }, "Reject a polygon with too few vertices.");
                unit_test_n.reject(function(){ new geometry_n.polygon_o(1); }, "Reject a polygon with too few vertices.");
                unit_test_n.reject(function(){ new geometry_n.polygon_o(2); }, "Reject a polygon with too few vertices.");
                unit_test_n.reject(function(){ new geometry_n.polygon_o(12); }, "Reject a polygon with too many vertices.");
                unit_test_n.reject(function(){ new geometry_n.polygon_o(988853); }, "Reject a polygon with too many vertices.");
            }

            // Cloning.
            {
                const tri1 = new geometry_n.polygon_o(3);
                const tri2 = new geometry_n.polygon_o(3);
                const quad = new geometry_n.polygon_o(4);

                tri1.v[0] = new geometry_n.vertex_o(123, 456, 789);
                tri2.v[0] = new geometry_n.vertex_o(987, 654, 321);
                tri1.clone_from(tri2);
                unit_test_n.require(((tri1.v[0].x === tri2.v[0].x) &&
                                    (tri1.v[0].y === tri2.v[0].y) &&
                                    (tri1.v[0].z === tri2.v[0].z)), "Clone a triangle.");

                tri1.v[0] = new geometry_n.vertex_o(111, 222, 333);
                unit_test_n.require(((tri2.v[0].x === 987) && (tri2.v[0].y === 654) && (tri2.v[0].z === 321)) &&
                                    ((tri1.v[0].x === 111) && (tri1.v[0].y === 222) && (tri1.v[0].z === 333)),
                                    "Cloning should be by value, not reference.");

                unit_test_n.reject(function(){ tri1.clone_from(quad); }, "Reject cloning from a quad into a triangle.");
            }

            // Barycentric coordinates for triangles.
            {
                const p = new geometry_n.polygon_o(3);
                p.v[0] = new geometry_n.vertex_o(-248.847, 45.3445, 0.0812);
                p.v[1] = new geometry_n.vertex_o(-7487.3581, -672.1856, 1747.1447);
                p.v[2] = new geometry_n.vertex_o(12321.2142, 798.9778, 4444.5555);
                
                const b = p.to_barycentric_coords(12, 888);
                unit_test_n.require(((unit_test_n.tr4(b.x)===5.5755) && (unit_test_n.tr4(b.y)===-2.9167) && (unit_test_n.tr4(b.z)===-1.6588)),
                                    "Barycentric coordinates.");
        
                unit_test_n.reject(function(){ (new geometry_n.polygon_o(4)).to_barycentric_coords(0, 0); },
                                   "Reject generating barycentric coordinates for non-triangles.");
            }

            // 2d bounding rects.
            {
                const poly = new geometry_n.polygon_o(5);
                poly.v[0] = new geometry_n.vertex_o(0, 0, 86458);
                poly.v[1] = new geometry_n.vertex_o(12, 2, -5);
                poly.v[2] = new geometry_n.vertex_o(-1, -8978, 0);
                poly.v[3] = new geometry_n.vertex_o(874, -8978, 0);
                poly.v[4] = new geometry_n.vertex_o(0, 8, 0);
                
                const rect = new geometry_n.bounding_rect_o(poly);
        
                unit_test_n.require((rect.width() === 875), "Proper bounding width.");
                unit_test_n.require((rect.height() === 8986), "Proper bounding height.");
        
                unit_test_n.require((rect.min.x === poly.v[2].x), "Bounding rect alignment horizontally.");
                unit_test_n.require((rect.max.x === poly.v[3].x), "Bounding rect alignment horizontally.");
                unit_test_n.require((rect.min.y === poly.v[2].y), "Bounding rect alignment vertically.");
                unit_test_n.require((rect.max.y === poly.v[4].y), "Bounding rect alignment vertically.");
            }

            // Polygon meshes.
            {
                // Creating polygon meshes.
                {
                    const poly1 = new geometry_n.polygon_o(3);
                    const poly2 = new geometry_n.polygon_o(6);
                    poly1.v[0].x = 321;
                    
                    const polyList = [poly1, poly2];
                    const mesh = new geometry_n.polygon_mesh_o(polyList);

                    unit_test_n.require((mesh.polygons.length === polyList.length), "Importing all polygons into the mesh.");
                    unit_test_n.require((mesh.polygons[0].v.length === polyList[0].v.length), "Importing all polygon vertices into the mesh.");
                    unit_test_n.require((mesh.polygons[1].v.length === polyList[1].v.length), "Importing all polygon vertices into the mesh.");

                    mesh.polygons[0].v[0].x = 456;
                    unit_test_n.require((mesh.polygons[0].v[0].x !== poly1.v[0].x), "Decoupling mesh polygons from source polygons.");

                    unit_test_n.reject(function(){ new geometry_n.polygon_mesh_o(); }, "Reject creationg null polygon mesh.");
                }
            }
        });

        unit_test_n.test_unit("Transform", function()
        {
            const tri = new geometry_n.polygon_o(3);
            unit_test_n.require((tri.v.length === 3), "Create a triangle polygon.");

            tri.v[0].x = -8.9463;
            tri.v[0].y = 47.5412;
            tri.v[0].z = 3214.871;
            tri.v[1].x = -2.4512;
            tri.v[1].y = 87.37;
            tri.v[1].z = 41.45;
            tri.v[2].x = 2854.9463;
            tri.v[2].y = 964.9463;
            tri.v[2].z = 6.256;

            tri.transform(matrix44_n.rotation_matrix(-7.6977, 2314.2288, 0.0008));
            unit_test_n.require((unit_test_n.tr4(tri.v[0].x)===-2896.7801 && unit_test_n.tr4(tri.v[0].y)===-1369.9333 && unit_test_n.tr4(tri.v[0].z)===-263.9761 && unit_test_n.tr4(tri.v[0].w)===1.0000 &&
                                unit_test_n.tr4(tri.v[1].x)===-36.3117   && unit_test_n.tr4(tri.v[1].y)===-6.3034    && unit_test_n.tr4(tri.v[1].z)===-89.4391  && unit_test_n.tr4(tri.v[1].w)===1.0000 &&
                                unit_test_n.tr4(tri.v[2].x)===-1236.3339 && unit_test_n.tr4(tri.v[2].y)===2691.7072  && unit_test_n.tr4(tri.v[2].z)===-555.0402 && unit_test_n.tr4(tri.v[2].w)===1.0000),
                                "Transform a triangle.");
            
            tri.perspective_divide();
            unit_test_n.require((unit_test_n.tr4(tri.v[0].x)===-2896.7801 && unit_test_n.tr4(tri.v[0].y)===-1369.9333 && unit_test_n.tr4(tri.v[0].z)===-263.9761 && unit_test_n.tr4(tri.v[0].w)===1.0000 &&
                                unit_test_n.tr4(tri.v[1].x)===-36.3117   && unit_test_n.tr4(tri.v[1].y)===-6.3034    && unit_test_n.tr4(tri.v[1].z)===-89.4391  && unit_test_n.tr4(tri.v[1].w)===1.0000 &&
                                unit_test_n.tr4(tri.v[2].x)===-1236.3339 && unit_test_n.tr4(tri.v[2].y)===2691.7072  && unit_test_n.tr4(tri.v[2].z)===-555.0402 && unit_test_n.tr4(tri.v[2].w)===1.0000),
                                "Perspective division.");
        });

        unit_test_n.test_unit("Render surface", function()
        {
            // Creation of a render surface.
            {
                const surfaceName = "render_surface";
                const surfaceType = "svg";
                const containerName = "render_surface_test_container";

                // Make sure the element into which we'll create the render surface doesn't exist yet.
                unit_test_n.require((document.getElementById(containerName) === null), "Temporary test element should not exist yet.");

                // Insert the surface's container element into the HTML.
                const containerElement = document.createElement("div");
                containerElement.setAttribute("id", containerName);
                document.body.appendChild(containerElement)

                // (We pass null as the polygon filler function, since we don't aim to test fill functionality
                // here.)
                const surface = new render_surface_n.render_surface_o(surfaceName, surfaceType, containerName, function(){});
                unit_test_n.require((surface instanceof render_surface_n.render_surface_o), "Creation of a render surface.");

                unit_test_n.reject(function(){ new render_surface_n.render_surface_o(surfaceName, surfaceType, containerName, null); },
                                "Reject creation of a render surface with a null polyfill function.");

                unit_test_n.require((surface.containerId === containerName), "Proper importing of surface container name.");
                unit_test_n.require((surface.elementId === surfaceName), "Proper importing of surface name.");
                unit_test_n.require((surface.elementName === surfaceType), "Proper importing of surface type name.");
                unit_test_n.require((surface.containerElement === containerElement), "Proper assignment of the surface container element.");
                unit_test_n.require((surface.element != null), "Proper creation of the render surface element.");
                unit_test_n.require((surface.element === document.getElementById(surfaceName)), "Proper creation of the render surface element.");

                /// TODO. Test rendering into the surface.
            }
        });
    }

    cube_renderer_unit_tests_n.run_tests = function()
    {
        unit_test_n.run_tests(cube_renderer_unit_tests_n.unit_tests,
                              "Rotating 3d cubes with JavaScript");
    }();
}
