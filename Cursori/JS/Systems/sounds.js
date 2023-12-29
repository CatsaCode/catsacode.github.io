const sounds = {
    riskTick: new Audio("./Sounds/riskTick.wav"),
    hoverButton: new Audio("./Sounds/hoverButton.wav"),
    locked: new Audio("./Sounds/locked.wav"),
};

// Audio.play() will throw an error if the user hasn't interacted with the document
let soundsEnabled = false;
function EnableSound() {
    soundsEnabled = true; 
    document.getElementById("audioNotice").style.display = "none";
    Object.values(sounds).forEach(elem => elem.preservesPitch = false);
    document.removeEventListener("mousedown", EnableSound);
}
document.addEventListener("mousedown", EnableSound);

// Reset current time then play
sounds.StopPlay = (sound, speed = 1) => {
    if(!soundsEnabled) return;
    sound.currentTime = 0;
    sound.playbackRate = speed;
    sound.play();
};

// Create new audio object and play that
sounds.NewPlay = (sound, speed = 1) => {
    if(!soundsEnabled) return;
    const tmpSound = new Audio(sound.src);
    tmpSound.preservesPitch = false;
    tmpSound.playbackRate = speed;
    tmpSound.play();
}