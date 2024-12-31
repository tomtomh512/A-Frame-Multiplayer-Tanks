class Platform {
    constructor(x, z, ry) {
        let height = 3;
        let width = 7;
        let depth = 7;
        let yOffset = -0.35;
        let color = "grey"
        let rampAngle = 15;

        this.platformEntity = document.createElement("a-entity");
        this.platformEntity.setAttribute("position", {x: x, y: 0, z: z});
        this.platformEntity.setAttribute("rotation", {x: 0, y: ry, z: 0});

        this.box = document.createElement("a-box");
        this.box.setAttribute("height", height);
        this.box.setAttribute("width", width);
        this.box.setAttribute("depth", depth);
        this.box.setAttribute("position", {x: 0, y: height / 2 + yOffset, z: 0})
        this.box.setAttribute("shader", "flat");
        this.box.setAttribute("color", color);
        this.box.setAttribute("static-body", "");
        this.platformEntity.append(this.box);

        this.boxCollision = document.createElement("a-plane");
        this.boxCollision.setAttribute("height", width);
        this.boxCollision.setAttribute("width", width);
        this.boxCollision.setAttribute("opacity", 0);
        this.boxCollision.setAttribute("rotation", {x: -90, y: 0, z: 0});
        this.boxCollision.setAttribute("position", {x: 0, y: height, z: 0});
        this.boxCollision.setAttribute("static-body", "");
        this.platformEntity.append(this.boxCollision);

        this.ramp = document.createElement("a-box");
        this.ramp.setAttribute("rotation", {x: 90 - rampAngle, y: 0, z: 0})
        this.ramp.setAttribute("position", {x: 0, y: yOffset + height / 2 - 0.125, z: -depth / 2 - 5.55})
        this.ramp.setAttribute("height", 11.59);
        this.ramp.setAttribute("width", width - 3);
        this.ramp.setAttribute("depth", 0.25);
        this.ramp.setAttribute("static-body", "");
        this.ramp.setAttribute("color", "black");
        this.ramp.setAttribute("shader", "flat");
        this.platformEntity.append(this.ramp);

        this.rampCollision = document.createElement("a-plane");
        this.rampCollision.setAttribute("rotation", {x: -90 - rampAngle, y: 0, z: 0})
        this.rampCollision.setAttribute("position", {x: 0, y: height / 2 - 0.125, z: -depth / 2 - 6.2});
        this.rampCollision.setAttribute("height", 12.9)
        this.rampCollision.setAttribute("width", width - 3);
        this.rampCollision.setAttribute("opacity", 0);
        this.rampCollision.setAttribute("static-body", "");
        this.platformEntity.append(this.rampCollision);
    }
}