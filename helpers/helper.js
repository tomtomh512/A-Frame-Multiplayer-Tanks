function calculateDistance(object1, object2, obj1yOffset, obj2yOffset) {
    const dx = object2.x - object1.x;
    const dy = (object2.y + obj2yOffset) - (object1.y + obj1yOffset);
    const dz = object2.z - object1.z;
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
    // Convert from degrees to radians
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