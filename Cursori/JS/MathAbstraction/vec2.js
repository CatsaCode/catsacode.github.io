class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get clone() {
        return new Vec2(this.x, this.y);
    }

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    get lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    
    // Add a Vec2 or number to this Vec2
    add(b) {
        if(b instanceof Vec2) {
            this.x += b.x;
            this.y += b.y;
        } else {
            this.x += b;
            this.y += b;
        }
        return this;
    }

    // Subtract a Vec2 or number to this Vec2
    sub(b) {
        if(b instanceof Vec2) {
            this.x -= b.x;
            this.y -= b.y;
        } else {
            this.x -= b;
            this.y -= b;
        }
        return this;
    }

    // Multiply this Vec2 by a Vec2 or number
    mul(b) {
        if(b instanceof Vec2) {
            this.x *= b.x;
            this.y *= b.y;
        } else {
            this.x *= b;
            this.y *= b;
        }
        return this;
    }

    // Divide this Vec2 by a Vec2 or number
    div(b) {
        if(b instanceof Vec2) {
            this.x /= b.x;
            this.y /= b.y;
        } else {
            this.x /= b;
            this.y /= b;
        }
        return this;
    }

    normalize() {
        return this.div(this.length);
    }
}

// Return a new Vec2 from (cos(rads), sin(rads))
Vec2.FromRadians = (rads) => {
    return new Vec2(Math.cos(rads), Math.sin(rads));
};

// Return the dot product of two Vec2
Vec2.Dot = (a, b) => {
    return a.x * b.x + a.y * b.y;
};

// Linear interpolate both axies of two 2D vectors
Vec2.Lerp = (a, b, t) => {
    return new Vec2(
        Lerp(a.x, b.x, t),
        Lerp(a.y, b.y, t)
    );
};