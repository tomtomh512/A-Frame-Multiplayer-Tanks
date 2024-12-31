class Platform {
    constructor(x, z, ry, height, platformColor, rampColor) {
        let width = 5;
        let depth = 5;
        let yOffset = -0.35;
        let rampAngle = 15;

        this.platformEntity = document.createElement("a-entity");
        this.platformEntity.setAttribute("position", {x: x, y: 0, z: z});
        this.platformEntity.setAttribute("rotation", {x: 0, y: ry, z: 0});

        this.box = document.createElement("a-box");
        this.box.setAttribute("color", platformColor);
        this.box.setAttribute("height", height);
        this.box.setAttribute("width", width);
        this.box.setAttribute("depth", depth);
        this.box.setAttribute("position", {x: 0, y: height / 2 + yOffset, z: 0})
        this.box.setAttribute("shader", "flat");
        this.box.setAttribute("static-body", "");
        this.platformEntity.append(this.box);

        this.boxCollision = document.createElement("a-plane");
        this.boxCollision.setAttribute("height", width);
        this.boxCollision.setAttribute("width", width);
        this.boxCollision.setAttribute("opacity", 0);
        this.boxCollision.setAttribute("rotation", {x: 270, y: 0, z: 0});
        this.boxCollision.setAttribute("position", {x: 0, y: height, z: 0});
        this.boxCollision.setAttribute("static-body", "");
        this.platformEntity.append(this.boxCollision);

        this.ramp = document.createElement("a-box");
        this.ramp.setAttribute("color", rampColor);
        this.ramp.setAttribute("height", 9.65926);
        this.ramp.setAttribute("width", 3);
        this.ramp.setAttribute("depth", 0.25);
        this.ramp.setAttribute("rotation", {x: 90 - rampAngle, y: 0, z: 0})
        this.ramp.setAttribute("position", {x: 0, y: height / 2 - 0.125 + yOffset, z: -depth / 2 - 4.65})
        this.ramp.setAttribute("shader", "flat");
        this.ramp.setAttribute("static-body", "");
        this.platformEntity.append(this.ramp);

        this.rampCollision = document.createElement("a-plane");
        this.rampCollision.setAttribute("height", 11.01155)
        this.rampCollision.setAttribute("width", 3);
        this.rampCollision.setAttribute("opacity", 0);
        this.rampCollision.setAttribute("rotation", {x: 90 - rampAngle, y: 0, z: 0})
        this.rampCollision.setAttribute("position", {x: 0, y: height / 2 - 0.15, z: -depth / 2 - 5.3})
        this.rampCollision.setAttribute("static-body", "");
        this.platformEntity.append(this.rampCollision);
    }
}