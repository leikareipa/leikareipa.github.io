"use strict";

import {Luu} from "../../../distributable/luujanko.js";

// A 3d model exported from Blender via the retro n-gon renderer's exporter.
//
// Usage:
//	- call .initialize(), which populates the .ngons array
//	- now you can access the n-gons via .ngons
//	- if you need .initialize() to finish before you start rendering, call it with await inside an async()=>{} wrapper
export const cubeModel =
{
	ngons:[],
	initialize: async function()
	{
		// Shorthands, for a smaller file size.
		const n = Luu.ngon;
		const v = Luu.vertex;
		const c = Luu.color;

		// Set up the materials.
		const m = {
			"crate":{color:c(255,255,255),crispEdges:true},
		};

		// N-gons.
		this.ngons = Object.freeze(
		[
			// Parent mesh: Cube.
			n([v(1.0000,1.0000,-1.0000,1,1),v(1.0000,-1.0000,-1.0000,1,0),v(-1.0000,-1.0000,-1.0000,0,0),v(-1.0000,1.0000,-1.0000,0,1),],m["crate"]),
			n([v(1.0000,1.0000,1.0000,0,1),v(-1.0000,1.0000,1.0000,1,1),v(-1.0000,-1.0000,1.0000,1,0),v(1.0000,-1.0000,1.0000,0,0),],m["crate"]),
			n([v(1.0000,1.0000,-1.0000,0,1),v(1.0000,1.0000,1.0000,1,1),v(1.0000,-1.0000,1.0000,1,0),v(1.0000,-1.0000,-1.0000,0,0),],m["crate"]),
			n([v(1.0000,-1.0000,-1.0000,1,1),v(1.0000,-1.0000,1.0000,1,0),v(-1.0000,-1.0000,1.0000,0,0),v(-1.0000,-1.0000,-1.0000,0,1),],m["crate"]),
			n([v(-1.0000,-1.0000,-1.0000,0,1),v(-1.0000,-1.0000,1.0000,1,1),v(-1.0000,1.0000,1.0000,1,0),v(-1.0000,1.0000,-1.0000,0,0),],m["crate"]),
			n([v(1.0000,1.0000,1.0000,1,1),v(1.0000,1.0000,-1.0000,1,0),v(-1.0000,1.0000,-1.0000,0,0),v(-1.0000,1.0000,1.0000,0,1),],m["crate"]),
		]);
	}
};
