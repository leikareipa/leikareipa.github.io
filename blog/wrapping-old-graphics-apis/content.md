<post-date date="3 March 2025"/>

# Wrapping old graphics APIs

It's been an interesting start to the year as I've been exploring something I haven't done before: writing wrappers for (retro) graphics APIs. The idea is that you create a replacement DLL for a given rendering library that routes the render calls to some other method of rendering, maybe to improve compatibility and maybe just because you can.

Interesting stuff, and you learn a bit about how particular games and APIs work under the hood.

## Destruction Derby (1995)

A racing game originally for the PlayStation and later ported to PC, for which there was a software-rendered MS-DOS version followed by a hardware-accelerated Windows version exclusive to the Diamond Stealth 3D 2000 (S3 ViRGE) using S3's proprietary S3d rendering API. The Windows version, with its high-resolution graphics and enhanced features compared to the DOS version, has never been available outside of the S3 platform.

I quite like the S3d API. It's probably the simplest of the proprietary rendering APIs with just ~10 endpoints, and it doesn't try to get fancy with anything. It's not a particularly mature API, but pleasant enough to work with.

For this game, I decided to write an S3d-to-software wrapper. Not much to it as the game doesn't use a depth buffer, limits its texture formats to ARGB1555 and ARGB4444, and generally is quite simple and old-school in its rendering. Actually most things on the screen are just stretched and blitted 2D surfaces. But there was one surprise: the terrain plane is rendered in software, a kind of Mode 7 effect. In fact the game is basically a glorified Mode 7 racer, maybe the most advanced ever released. This isn't common knowledge, but the sort of thing you can expect to learn writing wrappers.

> Destruction Derby running with the software wrapper (left) and in the original S3d mode (right).
![{image}{headerless}{no-border-rounding}](./dd1.jpg)

I was able to optimize the software renderer to the extent that it can run acceptably all the way down to the Pentium MMX, albeit at half the resolution. This previously S3d exclusive version can now be played on basically anything.

## Destruction Derby 2 (1996)

A sequel to the above demolition racer, this time with a Windows version exclusive to the Matrox Mystique using its proprietary Matrox Simple Interface (MSI) API.

The graphics engine has now ditched the Mode 7 terrain of the original and renders everything through the MSI API. That the API also handles all window creation makes this a very friendly setup for graphics wrappers. But, as always, there has to be a caveat, and this time it's the fact that the game makes heavy use of 4-bit paletted textures, with multiple palettes per texture and no way to know beforehand which parts of a texture use which palette. I don't think 4-bit textures are widely supported at all on the hardware level, so your wrapper will need to do extra work to get around it.

Luckily, paletted rendering is easily emulated in software, so I chose to write an MSI-to-software wrapper for this game. I would've liked to do one for OpenGL 1.1, but there you go.

Adapting my S3d-to-software wrapper, it only took a couple of evenings to make an MSI wrapper happen. The API itself has about twice as many endpoints, but the game only uses about half of them. Again no depth buffer needed, but now we need to deal with textures in RGB565, ARGB1555, 8-bit paletted, and 4-bit paletted formats. Texturing is clearly where Matrox put their eggs with this API, as it not only supports the uncommon 4-bit format but also allows textures in system memory and gives the application full autonomy over video memory. Not ideal for wrapping but otherwise generous.

> Destruction Derby 2 running on original Mystique hardware (left) and with the software wrapper (right). Differences in color balance are mianly due to VGA capture.
![{image}{headerless}{no-border-rounding}](./dd2.jpg)

## Ignition (1997)

Another popular racing game, Ignition was released first as a software-only title but later patched to support hardware rendering via the 3dfx Glide API.

Glide was a fairly popular proprietary API for 3dfx's Voodoo graphics cards, which in recent years have seen high levels of appreciation from retro enthusiasts. I personally think the API is quite bloated and the hardware fragile and overpriced, so it's just as well to be making wrappers for it.

I decided to write a Glide-to-S3d wrapper for this game. The game doesn't make too much use of the Voodoo's advanced features, so the lesser-featured ViRGE is able to replicate these scenes fairly well. The lack of proper support for 8-bit paletted textures means they need to be converted to 16 bits, which requires twice the memory, which means that texture resolution must be halved since the ViRGE has at most as much memory as the Voodoo. There are also some combinations of chroma keying and alpha blending that the ViRGE doesn't support, but you can mostly emulate them with pre-computed alpha stippling etc.

> Ignition running with the S3d wrapper on original ViRGE hardware with 2 MB of video memory.
![{image}{headerless}{no-border-rounding}](./ignition.jpg)
