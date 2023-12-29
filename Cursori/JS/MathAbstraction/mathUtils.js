// Linear interpolate between two numbers
function Lerp(a, b, t) {
    return a + (b - a) * t;
}

// a % b except negative numbers aren't just mirrored positive numbers
function Mod(a, b) {
    return ((a % b) + b) % b;
}

// Force n into a range between min and max
function Clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}

// Linear map n from the range min1 - max1 to min2 - max2
function Map(n, min1, max1, min2, max2) {
    return (n - min1) / (max1 - min1) * (max2 - min2) + min2;
}