// Whether or not the game is currently being played
let gameRunning = false;
// Seconds the game has been running for
let gameRuntime = 0;

let score = {
    // Current scores
    time: 0,
    risk: 0,
    // Score calculation variables
    timeWeight: 70,
    riskWeight: 30
};

// The single path that the cursor must stay on top of
let path;

function GameLoop() {
    // Stop a player from cheating by switching tabs
    if(deltaTime > 1.5) {
        alert(`Lagging for ${Math.round(deltaTime)} whole seconds?\nNot even my computer is that slow ;3`);
        failPos = mouse.pos.clone;
        // Reset their score
        score.time = 0;
        score.risk = 0;
        gameRuntime = 0;
        Fail();
        return;
    }

    // Step game runtime
    gameRuntime += deltaTime;

    // Update path
    path.Tick();

    // Play risking sound effect
    const currentRisk = Clamp(1 - Math.pow(Math.min(path.tail[0].clone.sub(mouse.pos).length / path.pos.clone.sub(path.tail[0]).length, 1), 2), 0, 1);
    if(gameRuntime % (0.1 / currentRisk) < deltaTime) sounds.StopPlay(sounds.riskTick, Map(currentRisk, 0, 1, 0.7, 1));

    // Draw the grace period and stop
    if(gameRuntime * 1000 < graceMilliseconds) {DrawGrace(); return;}

    // Points
    // Flat 80 points every second
    score.time += score.timeWeight * deltaTime;
    // Bonus 20 is mouse is near risky tail
    score.risk += score.riskWeight * currentRisk * deltaTime;

    // Debug risk text
    // ctx.fillStyle = "#ffffff";
    // ctx.font = currentRisk * 100 + "px Arial";
    // ctx.fillText(Math.round(currentRisk * 100), mouse.pos.x, mouse.pos.y);
    // ctx.fillStyle = "#00aa00";
    // path.tail.forEach(elem => {
    //     ctx.beginPath();
    //     ctx.arc(elem.x, elem.y, (1 - Math.pow(Math.min(path.tail[0].clone.sub(elem).length / path.pos.clone.sub(path.tail[0]).length, 1), 2)) * 20, 0, Math.PI * 2);
    //     ctx.fill();
    // });
    
    // Check for fail
    mouse.UpdateCollCols();
    CheckFail();
}