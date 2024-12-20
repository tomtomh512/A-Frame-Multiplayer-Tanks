class Missile {
    constructor(addedProjectile) {
        let x = addedProjectile.position.x;
        let y = addedProjectile.position.y;
        let z = addedProjectile.position.z;
        let rx = addedProjectile.rotation.x;
        let ry = addedProjectile.rotation.y;
        let rz = addedProjectile.rotation.z;

        this.projectileModel = document.createElement("a-sphere");
        this.projectileModel.setAttribute("color", "#1C2F22");
        this.projectileModel.setAttribute("radius", 0.05);
        this.projectileModel.setAttribute("shader","flat");
        this.projectileModel.setAttribute("obb-collider", "");
        this.projectileModel.setAttribute("position", {x: x, y: y + 0.5, z: z});
    }

    updatePosition(x,y,z) {
        this.projectileModel.setAttribute("position", {x: x, y: y + 0.5, z: z});
    }
}