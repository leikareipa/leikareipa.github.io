/*
 * 2023 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

export function dither_shader(renderContext) {
    const app = w95.windowManager.apps.find(a=>a.id === renderContext.contextName);
    const colorLevels = (w95.registry[`${app.id}-display-color-count`] || 24e6);

    if (colorLevels > 16) {
        return;
    }

    const ditherIntensity = ((colorLevels === 2)? 0.55 : 0.65);
    const {width, height, data:pixels} = renderContext.pixelBuffer;

    for (const region of (app._dirtyRegion || [])) {
        for (let y = region.y; y < (region.y + region.height); y++) {
            for (let x = region.x; x < (region.x + region.width); x++) {
                const idx = ((x + y * width) * 4);

                if (colorLevels === 2) {
                    pixels[idx+2] = pixels[idx+1] = pixels[idx+0];
                }

                for (let channel = 0; channel < 3; channel++) { // Apply only to R, G, B channels
                    const oldPixel = pixels[idx + channel];
                    const newPixel = reduceColorDepth(oldPixel, colorLevels);
                    pixels[idx + channel] = newPixel;

                    const quantError = (oldPixel - newPixel) * ditherIntensity;

                    // Spread the quantization error to neighboring pixels
                    if (x + 1 < width) pixels[idx + 4 + channel] += quantError * 7 / 16;
                    if (y + 1 < height) {
                        if (x > 0) pixels[idx + width * 4 - 4 + channel] += quantError * 3 / 16;
                        pixels[idx + width * 4 + channel] += quantError * 5 / 16;
                        if (x + 1 < width) pixels[idx + width * 4 + 4 + channel] += quantError * 1 / 16;
                    }
                }
            }
        }
    }

    function reduceColorDepth(color, levels) {
        const factor = (255 / (levels - 1));
        return (Math.round(color / factor) * factor);
    }
}
