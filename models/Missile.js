class Missile {
    constructor(addedProjectile) {
        let x = addedProjectile.position.x;
        let y = addedProjectile.position.y;
        let z = addedProjectile.position.z;
        let rx = addedProjectile.rotation.x;
        let ry = addedProjectile.rotation.y;
        let rz = addedProjectile.rotation.z;
        let color = "red";

        this.projectileEntity = document.createElement("a-entity");
        this.projectileEntity.setAttribute("rotation", {x: rx, y: ry, z: rz});
        this.projectileEntity.setAttribute("position", {x: x, y: y + 0.5, z: z});


        this.projectileTip = document.createElement("a-sphere");
        this.projectileTip.setAttribute("color", color);
        this.projectileTip.setAttribute("radius", 0.075);
        this.projectileTip.setAttribute("shader","flat");
        this.projectileTip.setAttribute("obb-collider", "");
        this.projectileEntity.append(this.projectileTip)

        this.projectileBody = document.createElement("a-cylinder");
        this.projectileBody.setAttribute("height", 0.15);
        this.projectileBody.setAttribute("radius", 0.075);
        this.projectileBody.setAttribute("color", color);
        this.projectileBody.setAttribute("rotation", {x: 90, y: 0, z: 0});
        this.projectileBody.setAttribute("position", {x: 0, y: 0, z: 0.1});
        this.projectileBody.setAttribute("shader","flat");
        this.projectileEntity.append(this.projectileBody);

    }

    updatePosition(x,y,z) {
        this.projectileEntity.setAttribute("position", {x: x, y: y + 0.5, z: z});
    }
}