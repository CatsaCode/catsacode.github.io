const mouse = {
    // Position on current frame
    pos: new Vec2(),
    // Position on last frame
    lastPos: new Vec2(),
    // Position from event handler
    exactPos: new Vec2(window.innerWidth / 2, window.innerHeight / 2),
    // Color under collision ctx
    collCols: [],

    // Update mouse frame positions
    UpdatePos() {
        this.lastPos = this.pos.clone;
        this.pos = this.exactPos.clone;
    },

    // Update collCols with samples of collCtx between lastPos and pos
    UpdateCollCols() {
        // Clear what's already in collCols
        this.collCols = [];
        // Calculate slope to find if looping X or Y axis has denser samples
        const slope = (this.lastPos.y - this.pos.y) / (this.lastPos.x - this.pos.x);
        if(slope >= -1 && slope <= 1) { // Loop X axis for highest density
            // Loop through each X coordinate from lastPos towards pos
            for(let i = this.lastPos.x; i != this.pos.x; i += Math.sign(this.pos.x - this.lastPos.x)) {
                // Get percentage of line pixels traversed so far
                const perc = Math.abs(i - this.lastPos.x) / Math.abs(this.pos.x - this.lastPos.x);
                // Get coordinate via linear interpolation
                const samplePos = new Vec2(i, Lerp(this.lastPos.y, this.pos.y, perc));
                // Sample color at samplePos and append it to collCols
                this.collCols.push(collCtx.getImageData(samplePos.x, samplePos.y, 1, 1).data);
            }
        } else { // Loop Y axis for highest density
            // Loop through each Y coordinate from lastPos towards pos
            for(let i = this.lastPos.y; i != this.pos.y; i += Math.sign(this.pos.y - this.lastPos.y)) {
                // Get percentage of line pixels traversed so far
                const perc = Math.abs(i - this.lastPos.y) / Math.abs(this.pos.y - this.lastPos.y);
                // Get coordinate via linear interpolation
                const samplePos = new Vec2(Lerp(this.lastPos.x, this.pos.x, perc), i);
                // Sample color at samplePos and append it to collCols
                this.collCols.push(collCtx.getImageData(samplePos.x, samplePos.y, 1, 1).data);
            }
        }

        // Don't let the cursor hide by not moving to create a line
        if(this.collCols.length == 0) this.collCols.push(collCtx.getImageData(this.pos.x, this.pos.y, 1, 1).data);
    },
};

// Update the mouse exactPos
document.addEventListener("mousemove", event => {
    mouse.exactPos.x = event.clientX;
    mouse.exactPos.y = event.clientY;
});

// Touchscreen support for a mouse game could be interesting
// DO NOT ENABLE THE DEVIL CODE
// document.addEventListener("touchmove", event => {
//     mouse.exactPos.x = event.touches[0].clientX;
//     mouse.exactPos.y = event.touches[0].clientY;
// });