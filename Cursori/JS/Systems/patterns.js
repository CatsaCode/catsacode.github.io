class Pattern {
    constructor(color, unlockRequirement = (score, riskPercent, duration, difficulty) => true, unlockMessage = "No description") {
        this.color = color;
        // Set canvas draw function and GUI image, different when a picture or custom selector is loaded
        if(color[0] == "#") {
            this.iconColor = color;
            this.canvasColor = color;

        } else if (color == "customColor") {
            this.iconColor = "#ff00ff";
            this.canvasColor = "#ff00ff";

        } else if (color == "customImage") {
            this.iconColor = "#ff00ff";
            this.canvasColor = "#ff00ff";

        } else {
            this.LoadImage(color);
        }

        // This pattern's unlock requirements
        this.GetUnlocked = unlockRequirement;
        this.unlockMessage = unlockMessage;
        
        // DOM node that this pattern is selected with
        this.domDiv;
        // Background / path / trail
        this.type;
        this.localStorageDigit;
    }

    LoadImage(url) {
        this.iconColor = `url(${url})`;

        // Set temporary color while loading image
        this.canvasColor = "#000000";
        const img = new Image();
        img.src = url;
        img.onload = () => {
            this.canvasColor = ctx.createPattern(img, "repeat");
        };
    }

    TryUnlock(score, riskPercent, duration, difficulty) {
        // Test if unlocked
        if(!this.GetUnlocked(score, riskPercent, duration, difficulty)) return;

        // Update the local storage
        const localStorageName = "unlocked" + (this.type[0].toUpperCase() + this.type.slice(1)) + "Patterns";
        const currentBinaryArr = window.localStorage.getItem(localStorageName).split("");
        currentBinaryArr[this.localStorageDigit] = "1";
        window.localStorage.setItem(localStorageName, currentBinaryArr.join(""));

        // Enable button
        this.domDiv.querySelector("button").disabled = false;
        // Hide lock image
        const lockImg = this.domDiv.querySelector("div");
        if(!lockImg.classList.contains("unlockedPattern")) lockImg.classList.add("unlockedPattern");
    }
}

// Add each button to the patterns screen
Pattern.InitDOM = () => {
    const patternsScreen = document.getElementById("patternsScreen");
    // Loop through the background, path, and trail patterns
    Object.entries(patterns).forEach(patternList => {
        // Create the row of patterns
        const patternsRow = document.createElement("div");
        patternsScreen.appendChild(patternsRow);
        patternsRow.classList.add("patternsRow");

        // Add a title to the row
        const rowTitle = document.createElement("h1");
        patternsRow.appendChild(rowTitle);
        rowTitle.innerText = patternList[0][0].toUpperCase() + patternList[0].slice(1);

        // Loop through each pattern in the row
        patternList[1].forEach((pattern, i) => {
            pattern.type = patternList[0].slice(0, -1);
            pattern.localStorageDigit = i;
            // Create a div to contain the separate button and lock image
            const patternDiv = document.createElement("div");
            patternsRow.appendChild(patternDiv);
            pattern.domDiv = patternDiv;
            patternDiv.classList.add("patternDiv");

            // Create the button for selecting the pattern
            const patternButton = document.createElement("button");
            patternDiv.appendChild(patternButton);
            patternButton.classList.add("basicMenuButton");
            patternButton.style.background = pattern.iconColor;
            // Disable the button if not unlocked in local storage
            const patternListLocalStorageTitle = patternList[0][0].toUpperCase() + patternList[0].slice(1, -1);
            if(window.localStorage.getItem("unlocked" + patternListLocalStorageTitle + "Patterns")[i] == "0") patternButton.disabled = true;
            // Set up event listeners depending on what the button does
            switch(pattern.color) {
                case "customColor":
                    // Create invisible input color element
                    const colorInput = document.createElement("input");
                    patternButton.appendChild(colorInput);
                    colorInput.type = "color";
                    // Link patternButton to click the invisible input element
                    if(patternList[0] == "backgrounds") patternButton.addEventListener("click", () => {Pattern.SetBackground(i); colorInput.click();});
                    else if(patternList[0] == "paths") patternButton.addEventListener("click", () => {Pattern.SetPath(i); colorInput.click();});
                    else if(patternList[0] == "trails") patternButton.addEventListener("click", () => {Pattern.SetTrail(i); colorInput.click();});
                    // Add input color change events
                    colorInput.addEventListener("input", () => {
                        // Display color
                        pattern.iconColor = colorInput.value;
                        pattern.canvasColor = colorInput.value;
                        patternButton.style.background = pattern.iconColor;
                        // Save color in local storage
                        window.localStorage.setItem("custom" + patternListLocalStorageTitle + "Color", colorInput.value);
                    });
                    // To continue setting up the DOM, pull the custom color from local storage
                    const localStorageColor = window.localStorage.getItem("custom" + patternListLocalStorageTitle + "Color");
                    pattern.iconColor = localStorageColor;
                    pattern.canvasColor = localStorageColor;
                    patternButton.style.background = pattern.iconColor;
                    colorInput.value = localStorageColor;
                    break;
                case "customImage":
                    // Create invisible input file element
                    const imageInput = document.createElement("input");
                    patternButton.appendChild(imageInput);
                    imageInput.type = "file";
                    imageInput.accept = "image/*";
                    // Link patternButton to click the invisible input element
                    if(patternList[0] == "backgrounds") patternButton.addEventListener("click", () => {Pattern.SetBackground(i); imageInput.click();});
                    else if(patternList[0] == "paths") patternButton.addEventListener("click", () => {Pattern.SetPath(i); imageInput.click();});
                    else if(patternList[0] == "trails") patternButton.addEventListener("click", () => {Pattern.SetTrail(i); imageInput.click();});
                    // Handle the image upload
                    imageInput.addEventListener("change", () => {
                        // Make sure a file was selected
                        if(imageInput.files.length != 1) return;
                        // Create image variable
                        const uploadedImage = new Image();
                        uploadedImage.src = URL.createObjectURL(imageInput.files[0]);
                        uploadedImage.onload = () => {
                            // Draw image on canvas to get its image data
                            const tmpCanvas = document.createElement("canvas");
                            tmpCanvas.width = uploadedImage.width;
                            tmpCanvas.height = uploadedImage.height;
                            tmpCanvas.getContext("2d").drawImage(uploadedImage, 0, 0);
                            const imageData = tmpCanvas.toDataURL();
                            tmpCanvas.remove();
                            // Display image
                            pattern.LoadImage(imageData);
                            patternButton.style.background = pattern.iconColor;
                            patternButton.style.backgroundSize = "100% 100%";
                            // Save image data in local storage
                            window.localStorage.setItem("custom" + patternListLocalStorageTitle + "ImageData", imageData);
                        };
                    });
                    // To continue setting up the DOM, pull the custom image data from local storage
                    const localStorageImageData = window.localStorage.getItem("custom" + patternListLocalStorageTitle + "ImageData");
                    pattern.LoadImage(localStorageImageData);
                    patternButton.style.background = pattern.iconColor;
                    patternButton.style.backgroundSize = "100% 100%";
                    break;
                default: 
                    // Add the click event, a different function needed for each row
                    if(patternList[0] == "backgrounds") patternButton.addEventListener("click", () => Pattern.SetBackground(i));
                    else if(patternList[0] == "paths") patternButton.addEventListener("click", () => Pattern.SetPath(i));
                    else if(patternList[0] == "trails") patternButton.addEventListener("click", () => Pattern.SetTrail(i));
                    break;
            }

            // Create the lock image on each pattern
            const lockImg = document.createElement("div");
            patternDiv.appendChild(lockImg);
            // Hide lock if unlocked in localStorage
            if(!patternButton.disabled) lockImg.classList.add("unlockedPattern");

            // Create unlock tooltip
            const tooltipSpan = document.createElement("span");
            lockImg.appendChild(tooltipSpan);
            tooltipSpan.innerHTML = pattern.unlockMessage;
            tooltipSpan.classList.add("tooltipSpan");
            // Make sure tooltip doesn't go off screen. This doesn't seem possible in CSS as far as I can tell
            const TooltipOverflow = () => {
                // Remove properties that mess with bounding rectangle
                tooltipSpan.style.display = "inline-block";
                tooltipSpan.style.left = "";
                // Get tooltip right side screen position
                const tooltipRightEdge = tooltipSpan.getBoundingClientRect().right;
                // Reset properties, adding left shift to keep on screen
                if(tooltipRightEdge > window.innerWidth) tooltipSpan.style.left = window.innerWidth - tooltipRightEdge + "px";
                tooltipSpan.style.display = "";
            };
            TooltipOverflow();
            window.addEventListener("resize", () => setInterval(TooltipOverflow, 100)); // Slight delay when waiting on fullscreen
        });
    });

    // Set current pattern from local storage
    currentBackground = patterns.backgrounds[window.localStorage.getItem("backgroundPattern")];
    currentPath = patterns.paths[window.localStorage.getItem("pathPattern")];
    currentTrail = patterns.trails[window.localStorage.getItem("trailPattern")];
};

Pattern.SetBackground = (index) => {
    currentBackground = patterns.backgrounds[index];
    window.localStorage.setItem("backgroundPattern", index)
};

Pattern.SetPath = (index) => {
    currentPath = patterns.paths[index];
    window.localStorage.setItem("pathPattern", index);
};

Pattern.SetTrail = (index) => {
    currentTrail = patterns.trails[index];
    window.localStorage.setItem("trailPattern", index);
};

Pattern.UnlockAll = () => {
    Object.values(patterns).forEach(patternList => patternList.forEach(elem => {
        const tmpUnlockFunc = elem.GetUnlocked;
        elem.GetUnlocked = () => true;
        elem.TryUnlock();
        elem.GetUnlocked = tmpUnlockFunc;
    }));

    return "For debugging purposes :D";
};

let currentBackground;
let currentPath;
let currentTrail;
const patterns = {
    backgrounds: [
        new Pattern("#202020", (s,r,t,d) => true, "Fail once :D"),
        new Pattern("#000000", (s,r,t,d) => d == "Easy" && t > 10, "10 seconds on easy"),
        new Pattern("#808080", (s,r,t,d) => d == "Easy" && t > 30, "30 seconds on easy"),
        new Pattern("./Pictures/Patterns/checkeredDark32x32.png", (s,r,t,d) => d == "Easy" && t > 60, "1 minute on easy"),
        new Pattern("./Pictures/Patterns/checkeredLight32x32.png", (s,r,t,d) => d == "Medium" && t > 10, "10 seconds on medium"),
        new Pattern("./Pictures/Patterns/stripesDark32x32.png", (s,r,t,d) => d == "Medium" && t > 30, "30 seconds on medium"),
        new Pattern("./Pictures/Patterns/wavyLight32x32.png", (s,r,t,d) => d == "Medium" && t > 60, "1 minute on medium"),
        new Pattern("customColor", (s,r,t,d) => d == "Easy" && t > 120, "2 minutes on easy"),
        new Pattern("customImage", (s,r,t,d) => d == "Easy" && t > 150, "2 mintes 30 seconds on easy"),
    ],
    paths: [
        new Pattern("#cccccc", (s,r,t,d) => true, "Fail once :3"),
        new Pattern("#101010", (s,r,t,d) => d == "Easy" && s > 1000, "Score 1000 on easy"),
        new Pattern("#cc0000", (s,r,t,d) => d == "Easy" && s > 3000, "Score 3000 on easy"),
        new Pattern("#cc8400", (s,r,t,d) => d == "Easy" && s > 6000, "Score 6000 on easy"),
        new Pattern("#cccc00", (s,r,t,d) => d == "Medium" && s > 1000, "Score 1000 on medium"),
        new Pattern("#00cc00", (s,r,t,d) => d == "Medium" && s > 3000, "Score 3000 on medium"),
        new Pattern("#0000cc", (s,r,t,d) => d == "Medium" && s > 5000, "Score 5000 on medium"),
        new Pattern("#8019c0", (s,r,t,d) => d == "Hard" && t > 5, "5 seconds on hard"),
        new Pattern("customColor", (s,r,t,d) => d == "Medium" && s > 6000, "Score 6000 on medium"),
        new Pattern("customImage", (s,r,t,d) => d == "Medium" && s > 7000, "Score 7000 on medium"),
    ],
    trails: [
        new Pattern("#000000", (s,r,t,d) => true, "Take an L"),
        new Pattern("#ffffff", (s,r,t,d) => d == "Easy" && s > 3000 && r > 70, "Score 3000 with over 70% risk on easy"),
        new Pattern("#ff0000", (s,r,t,d) => d == "Easy" && s > 10000, "Score 10000 on easy"),
        new Pattern("#ffa500", (s,r,t,d) => d == "Medium" && s > 1000 && r > 60, "Score 1000 with over 80% risk on medium"),
        new Pattern("#ffff00", (s,r,t,d) => d == "Medium" && s > 2000 && r > 70, "Score 2000 with over 70% risk on medium"),
        new Pattern("#00ff00", (s,r,t,d) => d == "Medium" && s > 5000 && r > 60, "Score 5000 with over 60% risk on medium"),
        new Pattern("#0000ff", (s,r,t,d) => d == "Hard" && t > 10, "10 seconds on hard"),
        new Pattern("#8019f0", (s,r,t,d) => d == "Hard" && t > 15, "15 seconds on hard"),
        new Pattern("./Pictures/Patterns/checkered16x16.png", (s,r,t,d) => d == "Hard" && t > 10 && r > 70, "10 seconds with over 70% risk on hard"),
        new Pattern("customColor", (s,r,t,d) => d == "Hard" && t > 20, "20 seconds on hard"),
        new Pattern("customImage", (s,r,t,d) => d == "Hard" && t > 30, "30 seconds on hard"),
    ]
};