window.onload = function() {
    let scene = document.querySelector("a-scene");
    let tank = new Tank(123,123);
    scene.appendChild(tank.characterEntity);
}