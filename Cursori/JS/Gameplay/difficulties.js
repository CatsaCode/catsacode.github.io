class Difficulty {
    constructor(name, widthFunc, speedFunc) {
        this.name = name;
        this.GetWidth = widthFunc;
        this.GetSpeed = speedFunc;
    }
}

Difficulty.Set = (difficulty) => {
    currentDifficulty = difficulty;
};

let currentDifficulty;
const difficulties = {
    easy: new Difficulty("Easy",
        () => Math.pow(0.987, gameRuntime) * 0.6 * dmin,
        () => 0.5 * dmin),
    medium: new Difficulty("Medium",
        () => Math.pow(0.99, gameRuntime) * 0.3 * dmin,
        dot => Map(dot, -1, 1, 0.5 * dmin, 1.4 * dmin)),
    hard: new Difficulty("Hard",
        () => Math.pow(0.99, gameRuntime) * 0.2 * dmin,
        dot => Map(dot, -1, 1, 0.8 * dmin, 2 * dmin))
};