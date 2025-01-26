function calculateDistance(x1, y1, z1, x2, y2, z2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function sinInDegrees(angleInDegrees) {
    return Math.sin(angleInDegrees * Math.PI / 180);
}
function cosInDegrees(angleInDegrees) {
    const angleInRadians = angleInDegrees * Math.PI / 180;
    return Math.cos(angleInRadians);
}
function atanInDegrees(y, x) {
    const angleInRadians = Math.atan(y / x);
    // Convert from radians to degrees
    const angleInDegrees = angleInRadians * 180 / Math.PI;

    return angleInDegrees;
}

function getCameraAngle(x, z) {
    let longitude = 0 - x;
    let latitude = 0 - z;

    let angle = 0;
    if (longitude !== 0 && latitude !== 0) {
        if (latitude > 0) {
            angle = 180 + atanInDegrees(longitude, latitude);
        } else if (latitude < 0) {
            angle = atanInDegrees(longitude, latitude);
        }
    }

    return angle;
}