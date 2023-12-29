class Path {
    constructor(startPos = new Vec2()) {
        // Path head position
        this.pos = startPos.clone;

        // Generation variables
        // Position that the head is moving towards
        this.goalPos = this.pos.clone;
        this.CreateGoal();
        // Steps that the head moves each frame
        this.speed = dmin * 1;
        this.rot = 0;

        // Size variables
        // Line width of the path stroke
        this.width = dmin * 0.4;
        // this.width = dmin * 0.2;
        // Length of tail in pixels
        this.tailLength = dmin * 1;
        // Vertices that make up the path tail
        this.tail = [];
    }

    Tick() {
        // Step timer
        this.remainingMilliseconds -= deltaTime * 1000;

        // Create a new goal if head is close to the current one
        if(this.pos.clone.sub(this.goalPos).length < dmin * 0.05) this.CreateGoal();
        // Move head towards goal
        this.StepPath();

        // Slowly shrink over time
        // const largestWidth = dmin * 0.4;
        // const smallestWidth = dmin * 0.15;
        // this.width = Clamp(Map(gameRuntime, 0, 60, largestWidth, smallestWidth), smallestWidth, largestWidth);
        this.width = currentDifficulty.GetWidth();

        // Draw path to the screen
        this.Draw();
    };

    // Generate a new goal
    CreateGoal() {
        // Goal can't be a random screen position because wide aspect ratios would create easy cheaty long straight sections
        const maxDistance = 1 * dmin;
        this.goalPos.x = Map(Math.random(), 0, 1, Math.max(0, this.goalPos.x - maxDistance), Math.min(this.goalPos.x + maxDistance, canvas.width));
        this.goalPos.y = Map(Math.random(), 0, 1, Math.max(0, this.goalPos.y - maxDistance), Math.min(this.goalPos.y + maxDistance, canvas.height));
    }

    // Move head towards current goal
    StepPath() {
        // Get vector pointing from head to goal
        const targetVec = this.goalPos.clone.sub(this.pos);
        // Get angle pointing from head to goal
        const targetDir = Mod(Math.atan2(targetVec.y, targetVec.x), Math.PI * 2);
        // Adjust rot if a clockwise or counterclockwise spin is closer
        if(Math.abs(targetDir - (this.rot + Math.PI * 2)) < Math.abs(targetDir - this.rot)) this.rot += Math.PI * 2;
        if(Math.abs(targetDir - (this.rot - Math.PI * 2)) < Math.abs(targetDir - this.rot)) this.rot -= Math.PI * 2;
        // Get distance from head to goal
        const dist = this.pos.clone.sub(this.goalPos).length;
        // Turn towards goal
        const turnStrength = Clamp((0.03 * dmin) / dist, 0, 1);
        // this.rot = Lerp(this.rot, targetDir, turnStrength);
        this.rot = Lerp(this.rot, targetDir, 1 - Math.pow(1 - turnStrength, deltaTime * 60));
        // Move forwards
        // const speed = Map(Vec2.Dot(Vec2.FromRadians(this.rot), targetVec.clone.normalize()), -1, 1, dmin * 0.5, dmin * 1.4);
        // const speed = Map(dist, 0, largerDimension, 500, 500);
        const speed = currentDifficulty.GetSpeed(Vec2.Dot(Vec2.FromRadians(this.rot), targetVec.clone.normalize()));
        this.pos.add(Vec2.FromRadians(this.rot).mul(speed * deltaTime));

        // Ensure the head can't go off screen
        this.pos.x = Clamp(this.pos.x, 0, canvas.width);
        this.pos.y = Clamp(this.pos.y, 0, canvas.height);
        
        // Add head position to the tail
        this.tail.push(this.pos.clone);
        // Remove the first element to keep the tail in size
        // Loop from head backwards and add the length
        let totalLength = 0;
        for(let i = this.tail.length - 2; i >= 0; i--) {
            totalLength += this.tail[i].clone.sub(this.tail[i + 1]).length;
            // Cut the remaining tail if tailLength is exceeded
            if(totalLength < this.tailLength) continue;
            this.tail.splice(0, i);
            break;
        }
    }

    // Draw path to the screen
    Draw() {
        // Draw mouse collision
        collCtx.beginPath();
        this.tail.forEach(elem => collCtx.lineTo(elem.x, elem.y));
        collCtx.lineWidth = this.width;
        collCtx.strokeStyle = "#000000";
        collCtx.stroke();
        
        ctx.beginPath();
        this.tail.forEach(elem => ctx.lineTo(elem.x, elem.y));
        ctx.lineWidth = this.width;
        ctx.strokeStyle = currentPath.canvasColor;
        ctx.stroke();

        // Show current goal as a small square on screen
        // ctx.fillStyle = "#00ff00";
        // ctx.fillRect(this.goalPos.x - 5, this.goalPos.y - 5, 10, 10);
    }
}