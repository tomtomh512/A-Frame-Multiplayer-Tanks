class Tank {
    constructor(addedPlayer, color) {
        let x = addedPlayer.position.x;
        let y = addedPlayer.position.y;
        let z = addedPlayer.position.z;
        let rx = addedPlayer.rotation.x;
        let ry = addedPlayer.rotation.y;
        let rz = addedPlayer.rotation.z;

        let scale = 0.5;

        this.characterEntity = document.createElement("a-entity");
        this.characterEntity.setAttribute("position", {x: x, y: y + 0.5, z: z});

        this.headEntity = document.createElement("a-entity");
        this.headEntity.setAttribute("id", "headEntity");
        this.headEntity.setAttribute("rotation", {x: rx, y: ry, z: rz});
        this.headEntity.setAttribute("scale", {x: scale, y: scale, z: scale});

        this.barrel = document.createElement("a-cylinder");
        this.barrel.setAttribute("color", "#545e4b");
        this.barrel.setAttribute("height", 2.85);
        this.barrel.setAttribute("radius", 0.1);
        this.barrel.setAttribute("position", {x: 0, y: 0, z: -1.2});
        this.barrel.setAttribute("rotation", {x: 90, y: 0, z: 0});
        this.barrel.setAttribute("shader", "flat");
        this.headEntity.append(this.barrel);

        this.tip = document.createElement("a-cylinder");
        this.tip.setAttribute("color", "#485040");
        this.tip.setAttribute("height", 0.5);
        this.tip.setAttribute("radius", 0.15);
        this.tip.setAttribute("position", {x: 0, y: 0, z: -2.5431});
        this.tip.setAttribute("rotation", {x: 90, y: 0, z: 0});
        this.tip.setAttribute("shader", "flat");
        this.headEntity.append(this.tip);

        this.redRing = document.createElement("a-cylinder");
        this.redRing.setAttribute("color", color);
        this.redRing.setAttribute("height", 0.05);
        this.redRing.setAttribute("radius", 0.175);
        this.redRing.setAttribute("position", {x: 0, y: 0, z: -2.4});
        this.redRing.setAttribute("rotation", {x: 90, y: 0, z: 0});
        this.redRing.setAttribute("shader", "flat");
        this.headEntity.append(this.redRing);

        this.hole = document.createElement("a-cylinder");
        this.hole.setAttribute("color", "black");
        this.hole.setAttribute("height", 0.5);
        this.hole.setAttribute("radius", 0.1);
        this.hole.setAttribute("position", {x: 0, y: 0, z: -2.55062});
        this.hole.setAttribute("rotation", {x: 90, y: 0, z: 0});
        this.hole.setAttribute("shader", "flat");
        this.headEntity.append(this.hole);

        this.characterEntity.append(this.headEntity);

        this.bodyEntity = document.createElement("a-entity");
        this.bodyEntity.setAttribute("id", "bodyEntity");
        this.bodyEntity.setAttribute("position", {x: 0, y: -1.26642 * scale, z: 0});
        this.bodyEntity.setAttribute("scale", {x: scale, y: scale, z: scale});

        this.mainBody = document.createElement("a-box");
        this.mainBody.setAttribute("color", "#545e4b");
        this.mainBody.setAttribute("height", 0.75);
        this.mainBody.setAttribute("width", 2.25);
        this.mainBody.setAttribute("depth", 1.75);
        this.mainBody.setAttribute("position", {x: 0, y: 0.5, z: 0.25});
        this.mainBody.setAttribute("shader", "flat");
        this.bodyEntity.append(this.mainBody);

        this.frontHitBox = document.createElement("a-plane");
        this.frontHitBox.setAttribute("static-body", "");
        this.frontHitBox.setAttribute("opacity", 0);
        this.frontHitBox.setAttribute("width", 2.75);
        this.frontHitBox.setAttribute("height", 2);
        this.frontHitBox.setAttribute("position", {x: 0, y: 0.55, z: 2});
        this.frontHitBox.setAttribute("rotation", {x: 0, y: 180, z: 0});
        this.bodyEntity.append(this.frontHitBox);

        this.leftHitBox = document.createElement("a-plane");
        this.leftHitBox.setAttribute("static-body", "");
        this.leftHitBox.setAttribute("opacity", 0);
        this.leftHitBox.setAttribute("width", 3.5);
        this.leftHitBox.setAttribute("height", 2);
        this.leftHitBox.setAttribute("position", {x: 1.375, y: 0.55, z: 0.25});
        this.leftHitBox.setAttribute("rotation", {x: 0, y: 270, z: 0});
        this.bodyEntity.append(this.leftHitBox);

        this.rightHitBox = document.createElement("a-plane");
        this.rightHitBox.setAttribute("static-body", "");
        this.rightHitBox.setAttribute("opacity", 0);
        this.rightHitBox.setAttribute("width", 3.5);
        this.rightHitBox.setAttribute("height", 2);
        this.rightHitBox.setAttribute("position", {x: -1.375, y: 0.55, z: 0.25});
        this.rightHitBox.setAttribute("rotation", {x: 0, y: 90, z: 0});
        this.bodyEntity.append(this.rightHitBox);

        this.backHitBox = document.createElement("a-plane");
        this.backHitBox.setAttribute("static-body", "");
        this.backHitBox.setAttribute("opacity", 0);
        this.backHitBox.setAttribute("width", 2.75);
        this.backHitBox.setAttribute("height", 2);
        this.backHitBox.setAttribute("position", {x: 0, y: 0.55, z: -1.5});
        this.backHitBox.setAttribute("rotation", {x: 0, y: 0, z: 0});
        this.bodyEntity.append(this.backHitBox);

        this.front = document.createElement("a-box");
        this.front.setAttribute("color", "#545e4b");
        this.front.setAttribute("height", 0.25);
        this.front.setAttribute("width", 2.25);
        this.front.setAttribute("depth", 1.1);
        this.front.setAttribute("rotation", {x: 315, y: 0, z: 0});
        this.front.setAttribute("position", {x: 0, y: 0.38959, z: -0.92321});
        this.front.setAttribute("shader", "flat");
        this.bodyEntity.append(this.front);

        this.frontFiller = document.createElement("a-box");
        this.frontFiller.setAttribute("color", "#545e4b");
        this.frontFiller.setAttribute("height", 0.25);
        this.frontFiller.setAttribute("width", 2.25);
        this.frontFiller.setAttribute("depth", 1);
        this.frontFiller.setAttribute("rotation", {x: 315, y: 0, z: 0});
        this.frontFiller.setAttribute("position", {x: 0, y: 0.19558, z: -0.92321});
        this.frontFiller.setAttribute("shader", "flat");
        this.bodyEntity.append(this.frontFiller);

        this.back = document.createElement("a-box");
        this.back.setAttribute("color", "#545e4b");
        this.back.setAttribute("height", 0.25);
        this.back.setAttribute("width", 2.25);
        this.back.setAttribute("depth", 1);
        this.back.setAttribute("rotation", {x: 45, y: 0, z: 0});
        this.back.setAttribute("position", {x: 0, y: 0.42643, z: 1.39083});
        this.back.setAttribute("shader", "flat");
        this.bodyEntity.append(this.back);

        this.base = document.createElement("a-box");
        this.base.setAttribute("color", "#3c4336");
        this.base.setAttribute("height", 0.25);
        this.base.setAttribute("width", 2.5);
        this.base.setAttribute("depth", 3.5);
        this.base.setAttribute("shader", "flat");
        this.bodyEntity.append(this.base);

        this.sphere = document.createElement("a-sphere");
        this.sphere.setAttribute("color", "#485040");
        this.sphere.setAttribute("radius", 0.75);
        this.sphere.setAttribute("position", {x: 0, y: 0.875, z: 0.25});
        this.sphere.setAttribute("shader", "flat");
        this.bodyEntity.append(this.sphere);

        this.antennaeBody = document.createElement("a-cylinder");
        this.antennaeBody.setAttribute("color", "#242820");
        this.antennaeBody.setAttribute("radius", 0.05);
        this.antennaeBody.setAttribute("height", 1);
        this.antennaeBody.setAttribute("position", {x: 0.96886, y: 1.25, z: 1});
        this.antennaeBody.setAttribute("shader", "flat");
        this.bodyEntity.append(this.antennaeBody);

        this.antennaeTip = document.createElement("a-cylinder");
        this.antennaeTip.setAttribute("color", color);
        this.antennaeTip.setAttribute("radius", 0.075);
        this.antennaeTip.setAttribute("height", 0.2);
        this.antennaeTip.setAttribute("position", {x: 0.96886, y: 1.75, z: 1});
        this.antennaeTip.setAttribute("shader", "flat");
        this.bodyEntity.append(this.antennaeTip);

        this.characterEntity.append(this.bodyEntity);

        this.createArm = (x, z) => {
            let arm = document.createElement("a-entity");
            arm.setAttribute("position", {x: x, y: 0, z: z});

            let armBase = document.createElement("a-box");
            armBase.setAttribute("color", "#485040");
            armBase.setAttribute("depth", 1.8);
            armBase.setAttribute("height", 0.5);
            armBase.setAttribute("shader", "flat");
            arm.append(armBase);

            let armFront = document.createElement("a-box");
            armFront.setAttribute("color", "#485040");
            armFront.setAttribute("height", 0.5);
            armFront.setAttribute("width", 1);
            armFront.setAttribute("depth", 1.25);
            armFront.setAttribute("rotation", {x: 155, y: 0, z: 0});
            armFront.setAttribute("position", {x: 0, y: 0.25622, z: -0.45498});
            armFront.setAttribute("shader", "flat");
            arm.append(armFront);

            let armBack = document.createElement("a-box");
            armBack.setAttribute("color", "#485040");
            armBack.setAttribute("height", 0.5);
            armBack.setAttribute("width", 1);
            armBack.setAttribute("depth", 1);
            armBack.setAttribute("rotation", {x: 30, y: 0, z: 0});
            armBack.setAttribute("position", {x: 0, y: 0.28354, z: 0.31586});
            armBack.setAttribute("shader", "flat");
            arm.append(armBack);

            let hoverPadBack = document.createElement("a-cylinder");
            hoverPadBack.setAttribute("color", color);
            hoverPadBack.setAttribute("height", 0.25);
            hoverPadBack.setAttribute("radius", 0.45);
            hoverPadBack.setAttribute("position", {x: 0, y: -0.266, z: 0.4});
            hoverPadBack.setAttribute("shader", "flat");
            arm.append(hoverPadBack);

            let hoverPadFront = document.createElement("a-cylinder");
            hoverPadFront.setAttribute("color", color);
            hoverPadFront.setAttribute("height", 0.25);
            hoverPadFront.setAttribute("radius", 0.45);
            hoverPadFront.setAttribute("position", {x: 0, y: -0.266, z: -0.4});
            hoverPadFront.setAttribute("shader", "flat");
            arm.append(hoverPadFront);

            let hoverPadMiddle = document.createElement("a-box");
            hoverPadMiddle.setAttribute("color", color);
            hoverPadMiddle.setAttribute("height", 0.25);
            hoverPadMiddle.setAttribute("width", 0.9);
            hoverPadMiddle.setAttribute("depth", 0.822);
            hoverPadMiddle.setAttribute("position", {x: 0, y: -0.266, z: 0});
            hoverPadMiddle.setAttribute("shader", "flat");
            arm.append(hoverPadMiddle);

            return arm;
        };

        this.bodyEntity.append(this.createArm(1, -1));
        this.bodyEntity.append(this.createArm(-1, -1));
        this.bodyEntity.append(this.createArm(1.25, 1.5));
        this.bodyEntity.append(this.createArm(-1.25, 1.5));

        this.infoTagEntity = document.createElement("a-entity");
        this.infoTagEntity.setAttribute("id", "infoTagEntity");
        this.infoTagEntity.setAttribute("position", {x: 0, y: 0.4, z: 0});

        this.background = document.createElement("a-plane");
        this.background.setAttribute("id", "background");
        this.background.setAttribute("height", 0.275);
        this.background.setAttribute("width", 0.6);
        this.background.setAttribute("opacity", 0.5);
        this.background.setAttribute("color", "black");
        this.background.setAttribute("shader", "flat");
        this.background.setAttribute("position", {x: 0, y: 0, z: 0});
        this.infoTagEntity.append(this.background);

        this.name = document.createElement("a-text");
        this.name.setAttribute("id", "name");
        this.name.setAttribute("value", addedPlayer.name);
        this.name.setAttribute("color", "white");
        this.name.setAttribute("scale", {x: 0.5, y: 0.5, z: 0.5});
        this.name.setAttribute("position", {x: -0.275, y: 0.175, z: 0});
        this.infoTagEntity.append(this.name);

        this.health = document.createElement("a-text");
        this.health.setAttribute("id", "health");
        this.health.setAttribute("value", addedPlayer.health + "♡");
        this.health.setAttribute("color", "white");
        this.health.setAttribute("position", {x: -0.3, y: 0, z: 0});
        this.infoTagEntity.append(this.health);

        this.characterEntity.append(this.infoTagEntity);
    }

    updateTagAngle(angle) {
        this.characterEntity.querySelector('#infoTagEntity').setAttribute("rotation", {x: 0, y: angle, z: 0})
    }

    updateTagName(name) {
        this.characterEntity.querySelector('#infoTagEntity').querySelector('#name').setAttribute("value", name);
        if (name === "") {
            this.characterEntity.querySelector('#infoTagEntity').querySelector('#background').setAttribute("height", 0.275);
            this.characterEntity.querySelector('#infoTagEntity').querySelector('#background').setAttribute("position", {x: 0, y: 0, z: 0});
        } else {
            this.characterEntity.querySelector('#infoTagEntity').querySelector('#background').setAttribute("height", 0.4);
            this.characterEntity.querySelector('#infoTagEntity').querySelector('#background').setAttribute("position", {x: 0, y: 0.06, z: 0});
        }
    }

    updateTagHealth(health) {
        this.characterEntity.querySelector('#infoTagEntity').querySelector('#health').setAttribute("value", health + "%");
    }

    updatePosition(x,y,z) {
        this.characterEntity.setAttribute("position", {x: x, y: y + 0.5, z: z});
    }

    updateHeadRotation(x,y,z) {
        this.characterEntity.querySelector('#headEntity').setAttribute("rotation", {x: x, y: y, z: z});
    }

    updateBodyRotation(y,z) {
        this.characterEntity.querySelector('#bodyEntity').setAttribute("rotation", {x: 0, y: y, z: z});
    }
}