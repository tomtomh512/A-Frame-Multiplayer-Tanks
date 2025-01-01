class Missile {
    constructor(addedProjectile) {
        let x = addedProjectile.position.x;
        let y = addedProjectile.position.y;
        let z = addedProjectile.position.z;
        let rx = addedProjectile.rotation.x;
        let ry = addedProjectile.rotation.y;
        let rz = addedProjectile.rotation.z;

        this.projectileEntity = document.createElement("a-sphere");
        this.projectileEntity.setAttribute("color", "red");
        this.projectileEntity.setAttribute("radius", 0.05);
        this.projectileEntity.setAttribute("shader","flat");
        this.projectileEntity.setAttribute("obb-collider", "");
        this.projectileEntity.setAttribute("position", {x: x, y: y + 0.5, z: z});
    }

    updatePosition(x,y,z) {
        this.projectileEntity.setAttribute("position", {x: x, y: y + 0.5, z: z});
    }
}