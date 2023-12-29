// Text element that shows the score
const scoreText = document.getElementById("scoreText");
// Text element that shows the high score
const highScoreText = document.getElementById("highScoreText");

// Position where the cursor left the path
let failPos = new Vec2();
let failTrail;

// Check if the cursor has left the path
function CheckFail() {
    // Give player a second to get their cursor on the path
    if(gameRuntime * 1000 < graceMilliseconds) return false; 
    for(let i in mouse.collCols) {
        if(mouse.collCols[i][3] != 0) continue;
        failPos = Vec2.Lerp(mouse.lastPos, mouse.pos, i / mouse.collCols.length);
        Fail();
        return true;
    }
    return false;
}

// End the game
function Fail() {
    // Stop game loop
    gameRunning = false;

    // Save fail trail. Hard coded to be the last 300 milliseconds
    failTrail = [];
    setTimeout(() => {failTrail = mouseTrail.vertices.map((elem, i) => mouseTrail.timestamps[i] > Date.now() - 300 ? elem.clone : undefined).filter(elem => elem != undefined);}, 100);

    // Update score text and high score
    score.time = Math.round(score.time);
    score.risk = Math.round(score.risk);
    const riskPercent = Math.round(score.risk / ((gameRuntime - graceMilliseconds / 1000) * score.riskWeight) * 1000) / 10;
    scoreText.innerText = `Score: ${score.time + score.risk} | Time: ${Math.floor(gameRuntime / 60)}:${(Math.floor(gameRuntime % 60) < 10 ? "0" : "") + Math.floor(gameRuntime % 60 * 100) / 100} | Risk: ${riskPercent}%`;
    const highScore = window.localStorage.getItem("highScore" + currentDifficulty.name);
    highScoreText.innerText = currentDifficulty.name + " High Score: " + highScore;
    if(score.time + score.risk > highScore) window.localStorage.setItem("highScore" + currentDifficulty.name, score.time + score.risk);

    // Unlock patterns
    Object.values(patterns).forEach(patternList => patternList.forEach(elem => elem.TryUnlock(score.time + score.risk, riskPercent, gameRuntime, currentDifficulty.name)));
    
    // Load fail screen
    GameScreen.Load(screens.fail);
}

// Draw the fail replay trail
function DrawFailTrail() {
    ctx.beginPath();
    failTrail.forEach(elem => ctx.lineTo(elem.x, elem.y));
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Draw red cross at failPos
function DrawFailCross() {
    const crossSize = 0.05 * dmin;
    ctx.beginPath();
    ctx.moveTo(failPos.x - crossSize, failPos.y - crossSize);
    ctx.lineTo(failPos.x + crossSize, failPos.y + crossSize);
    ctx.moveTo(failPos.x + crossSize, failPos.y - crossSize);
    ctx.lineTo(failPos.x - crossSize, failPos.y + crossSize);
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 8;
    ctx.stroke();
}

// Continue rendering the path and fail cross without gameplay
function DrawFailBackground() {
    path.Draw();
    DrawFailTrail();
    DrawFailCross();
}