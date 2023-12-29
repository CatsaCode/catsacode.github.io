function StartGame() {
    path = new Path(mouse.pos);
    gameRuntime = 0;
    score.time = 0;
    score.risk = 0;
    gameRunning = true;

    GameScreen.Load(screens.gameplay);
}