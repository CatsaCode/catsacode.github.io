// Object to contain anything related to the mouse trail
const mouseTrail = {
    // Milliseconds a path vertex will last for
    duration: 300,
    // List of Vec2 that make up the trail
    vertices: [],
    // List of Date.now() that go with each trail vertex
    timestamps: [],
    // Width in pixels of the trail
    width: 5,

    lengthInput: document.getElementById("trailLengthInput"),
    widthInput: document.getElementById("trailWidthInput"),

    SetDuration(seconds) {
        if(seconds == "" || seconds < 0) {
            seconds = 0;
            this.lengthInput.value = 0;
        }
        this.duration = seconds * 1000;
        window.localStorage.setItem("trailLength", seconds);
    },

    SetWidth(pixels) {
        if(pixels == "" || pixels < 1) {
            pixels = 1;
            this.widthInput.value = 1;
        }
        this.width = pixels;
        window.localStorage.setItem("trailWidth", pixels);
    },

    GetSettings() {
        this.SetDuration(window.localStorage.getItem("trailLength"));
        this.SetWidth(window.localStorage.getItem("trailWidth"));
        this.lengthInput.value = this.duration / 1000;
        this.widthInput.value = this.width;
    },

    Tick() {
        this.NextPoint();
        this.Draw();
    },

    // Add the mouse position to the trail, delete old trail
    NextPoint() {
        // Append mouse to trail vertices
        this.vertices.push(mouse.pos.clone);
        this.timestamps.push(Date.now());
        // Delete trail if too long
        while(this.timestamps[0] < Date.now() - this.duration) {
            this.vertices.splice(0, 1);
            this.timestamps.splice(0, 1);
        }
    },

    Draw() {
        ctx.beginPath();
        this.vertices.forEach(elem => ctx.lineTo(elem.x, elem.y));
        ctx.strokeStyle = currentTrail.canvasColor;
        ctx.lineWidth = this.width;
        ctx.stroke();
    }

};