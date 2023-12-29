const canvas = document.getElementById("mainCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const collCanvas = document.createElement("canvas");
/** @type {CanvasRenderingContext2D} */
const collCtx = collCanvas.getContext("2d", {
    willReadFrequently: true
});

// Maximum screen dimension
let dmax;
// Minimum screen dimension
let dmin;

// Update width and height of each canvas to fill screen
function ResizeMainCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    collCanvas.width = window.innerWidth;
    collCanvas.height = window.innerHeight;

    // Update min and max screen dimension variables
    dmax = Math.max(window.innerWidth, window.innerHeight);
    dmin = Math.min(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", ResizeMainCanvas);
// Make the canvases fill the screen from the start
ResizeMainCanvas();