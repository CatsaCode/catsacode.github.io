// Time from game start until player must be on the path
const graceMilliseconds = 1000;

// Draw a circle around the mouse to show how much grace time is left
function DrawGrace() {
    ctx.beginPath();
    ctx.arc(mouse.pos.x, mouse.pos.y, Map(gameRuntime * 1000, 0, graceMilliseconds, 0.3 * dmin, 0), 0, Math.PI * 2);
    ctx.fillStyle = currentPath.canvasColor;
    ctx.fill();
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.stroke();
}