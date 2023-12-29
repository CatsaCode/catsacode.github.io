class GameScreen {
    constructor(domNode, tickFunctions = []) {
        // DOM node to activate
        this.domNode = domNode;
        // Functions to run while active
        this.tickFunctions = tickFunctions;
    }
}

// Disable all screens, enable new one
GameScreen.Load = (screen) => {
    for(let value of Object.values(screens)) value.domNode.style.display = "none";
    screen.domNode.style.display = "block";

    currentScreen = screen;
};

// Call all tick functions on the current game screen
GameScreen.Tick = () => {
    currentScreen.tickFunctions.forEach(elem => elem());
}

const screens = {};
let currentScreen;

GameScreen.InitScreens = () => {
    screens.mainMenu = new GameScreen(document.getElementById("mainMenuScreen"));
    screens.difficulty = new GameScreen(document.getElementById("difficultyScreen"));
    screens.gameplay = new GameScreen(document.getElementById("gameplayScreen"), [GameLoop]);
    screens.fail = new GameScreen(document.getElementById("failScreen"), [DrawFailBackground]);
    screens.patterns = new GameScreen(document.getElementById("patternsScreen"));
    screens.settings = new GameScreen(document.getElementById("settingsMenu"));
}