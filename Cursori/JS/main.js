// Initialize a local storage item to a starting value if it's blank
function InitLocalStorage(key, value) {
    if(window.localStorage.getItem(key) == null) window.localStorage.setItem(key, value);
}

function Setup() {
    // Initialize highscores
    Object.values(difficulties).forEach(elem => {
        const storeName = "highScore" + elem.name;
        InitLocalStorage(storeName, "0");
    });
    
    // Initialize selected patterns
    InitLocalStorage("backgroundPattern", "0");
    InitLocalStorage("pathPattern", "0");
    InitLocalStorage("trailPattern", "0");
    // Initialize unlocked patterns
    InitLocalStorage("unlockedBackgroundPatterns", "0".repeat(patterns.backgrounds.length));
    InitLocalStorage("unlockedPathPatterns", "0".repeat(patterns.paths.length));
    InitLocalStorage("unlockedTrailPatterns", "0".repeat(patterns.trails.length));
    // Initialize custom patterns
    InitLocalStorage("customBackgroundColor", "#ff00ff");
    InitLocalStorage("customPathColor", "#ff00ff");
    InitLocalStorage("customTrailColor", "#ff00ff");
    InitLocalStorage("customBackgroundImageData", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABHNCSVQICAgIfAhkiAAAAA1JREFUCFtj+M/w/z8ABv4C/pK9xMUAAAAASUVORK5CYII=");
    InitLocalStorage("customPathImageData", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABHNCSVQICAgIfAhkiAAAAA1JREFUCFtj+M/w/z8ABv4C/pK9xMUAAAAASUVORK5CYII=");
    InitLocalStorage("customTrailImageData", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABHNCSVQICAgIfAhkiAAAAA1JREFUCFtj+M/w/z8ABv4C/pK9xMUAAAAASUVORK5CYII=");
    
    // Initialize custom settings
    InitLocalStorage("trailLength", "0.3");
    InitLocalStorage("trailWidth", "5");

    // Load custom trail settings from local storage
    mouseTrail.GetSettings();

    // Initialize screens
    GameScreen.InitScreens();
    Pattern.InitDOM();
    GameScreen.Load(screens.mainMenu);

    // Add menu sound effects
    Array.from(document.querySelectorAll(".basicMenuButton")).concat(Array.from(document.querySelectorAll(".hoverButtonSFX"))).forEach(elem => elem.addEventListener("mouseenter", () => {if(!elem.disabled) sounds.NewPlay(sounds.hoverButton, Map(Math.random(), 0, 1, 0.9, 1));}));
    document.querySelectorAll(".patternDiv div").forEach(elem => elem.addEventListener("mouseenter", () => sounds.NewPlay(sounds.locked, Map(Math.random(), 0, 1, 0.9, 1))));

    // Add Safari audio warning
    if(navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) document.getElementById("audioNotice").querySelector("p").innerHTML += "<br />Safari does <i>not</i> work well";

    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.animationPlayState = "running";
    setTimeout(() => loadingScreen.remove(), 1000);

    // Start frame loop
    window.requestAnimationFrame(Frame);
}

// Seconds between last frame
let deltaTime;
// Timestamp of previous frame used for deltaTime calculation
let lastFrame = Date.now();
// Current frame number
let frameNum = 0;
function Frame() {
    // Update time counters
    deltaTime = (Date.now() - lastFrame) / 1000;
    lastFrame = Date.now();
    frameNum++

    // Update mouse position variables
    mouse.UpdatePos();

    // Clear visible and collision canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // It's kinda funny how transparency in a custom background image will have a no-draw effect
    collCtx.clearRect(0, 0, collCanvas.width, collCanvas.height);

    // Draw background
    ctx.fillStyle = currentBackground.canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Run any functions such as GameLoop() attatched to current screen
    GameScreen.Tick();

    // Update and draw the mouse trail
    mouseTrail.Tick();

    // Draw the FPS if it's low
    if(1 / deltaTime < 25) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "30px Arial";
        ctx.fillText("FPS: " + Math.round(1 / deltaTime), 0, 30);
    }

    // Call next frame
    window.requestAnimationFrame(Frame);
}

// Run Setup() once DOM has loaded
window.addEventListener("load", Setup);