// Loads a PNG image of a parrot via the Canvas API into an ImageData object,
// and returns a promise that resolves with the object.
function get_parrot_pixels() {
    return new Promise(resolve=>{
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const drawing = new Image();
        drawing.src = "../parrot.png";
        drawing.onload = function() {
            ctx.drawImage(drawing, 0, 0, canvas.width , canvas.height);
            resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
    });
}

// Passes with a customizable delay an image as an ImageData object of a parrot
// to the given callback function, which is presumably a function that applies a
// 2D image effect on the pixel data.
async function do_with_parrot(callback_fn, timeoutMs = 500) {
    console.assert(typeof callback_fn === "function");
    const parrotImage = await get_parrot_pixels();
    setTimeout(()=>callback_fn(parrotImage), timeoutMs);
}
