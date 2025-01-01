class ElevatedPlatform {
    constructor(x, z, ry, elevation, depth, color) {
        let yOffset = -0.35;

        this.platformEntity = document.createElement("a-entity");
        this.platformEntity.setAttribute("position", {x: x, y: elevation, z: z});
        this.platformEntity.setAttribute("rotation", {x: 0, y: ry, z: 0});

        this.platform = document.createElement("a-box");
        this.platform.setAttribute("color", color);
        this.platform.setAttribute("height", 0.25);
        this.platform.setAttribute("width", 3);
        this.platform.setAttribute("depth", depth);
        this.platform.setAttribute("position", {x: 0, y: -0.125 + yOffset, z: 0});
        this.platform.setAttribute("shader", "flat");
        this.platform.setAttribute("obb-collider", "");
        this.platformEntity.append(this.platform);

        this.boxCollision = document.createElement("a-plane");
        this.boxCollision.setAttribute("height", depth);
        this.boxCollision.setAttribute("width", 3);
        this.boxCollision.setAttribute("opacity", 0);
        this.boxCollision.setAttribute("rotation", {x: 270, y: 0, z: 0});
        this.boxCollision.setAttribute("static-body", "");
        this.platformEntity.append(this.boxCollision);
    }
}