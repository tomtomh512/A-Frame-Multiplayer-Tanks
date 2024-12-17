let milliseconds = 30;
let maxAmmo = 100;

window.onload = function() {
    let playerId;
    let playerRef;
    let players = {};
    let playerElements = {};
    let projectiles = {};
    let projectileElements = {};
    let nameTagAngles = {};

    let scene = document.querySelector("a-scene");
    const playerNameInput = document.querySelector("#player-name");

    // set initial conditions of rig
    let rig = document.getElementById("camera");
    rig.setAttribute("position", { x: Math.random() * 10 - 5, y: 0, z: 0});
    rig.setAttribute("rotation", { x: 0, y: getCameraAngle(rig.getAttribute("position").x, rig.getAttribute("position").z), z: 0 });

    try {
        rig.components["look-controls"].yawObject.rotation.y = rig.getAttribute("rotation").y * Math.PI / 180;
    } catch (error) {
        location.reload();
    }

    let count = 0;
    function createBullet() {
        if (players[playerId].ammo > 0) {
            let rigX = rig.getAttribute("position").x;
            let rigY = rig.getAttribute("position").y;
            let rigZ = rig.getAttribute("position").z;
            let rigRx = rig.getAttribute("rotation").x;
            let rigRy = rig.getAttribute("rotation").y;
            let rigRz = rig.getAttribute("rotation").z;

            let offset = 1.27155;
            // let offset = 2;

            let yComponent = offset * sinInDegrees(rigRx);
            let groundLength = offset * cosInDegrees(rigRx);
            let xComponent =  groundLength * sinInDegrees(rigRy);
            let zComponent = groundLength * cosInDegrees(rigRy);

            let position = {
                x: rigX - xComponent,
                y: rigY + yComponent,
                z: rigZ - zComponent,
            }
            let rotation = {
                x: rigRx,
                y: rigRy,
                z: rigRz,
            }

            let uniqueId = playerId + count.toString();
            const projectileRef = firebase.database().ref(`projectiles/${uniqueId}`);

            projectileRef.set({
                id: uniqueId,
                from: playerId,
                position,
                rotation,
            })

            count++;
            playerRef.update({
                ammo: players[playerId].ammo - 1,
            })

        }
    }

    function moveBullet(currentProjectile, projectileRef, magnitude) {
        if (currentProjectile) {
            let pitch = currentProjectile.rotation.x;
            let yaw = currentProjectile.rotation.y;

            let dx = cosInDegrees(pitch) * sinInDegrees(yaw);
            let dy = sinInDegrees(pitch);
            let dz = cosInDegrees(pitch) * cosInDegrees(yaw);

            dx /= magnitude;
            dy /= magnitude;
            dz /= magnitude;

            currentProjectile.position.x -= dx;
            currentProjectile.position.y += dy;
            currentProjectile.position.z -= dz;
            projectileRef.set(currentProjectile);
        }
    }

    function collideBullet(currentProjectile, projectileRef){
        if (currentProjectile) {

            if (Math.abs(currentProjectile.position.x) > 10 ||
                Math.abs(currentProjectile.position.y) > 10 ||
                Math.abs(currentProjectile.position.z) > 10) {
                projectileRef.remove();
            }

            for (let playerKey in players) {
                let currentPlayer = players[playerKey];
                if (currentPlayer){
                    let currentPlayerRef = firebase.database().ref(`players/${currentPlayer.id}`);

                    if (calculateDistance(currentProjectile.position, currentPlayer.position, 0, -0.25) < 0.75) {
                        projectileRef.remove();
                        currentPlayerRef.update({
                            health: currentPlayer.health - 5,
                        })
                    }
                    // let playerX = currentPlayer.position.x;
                    // let playerY = currentPlayer.position.y;
                    // let playerZ = currentPlayer.position.z;
                    //
                    // if (projectileX > (playerX - 0.275) && projectileX < (playerX + 0.275) &&
                    //     projectileY > (playerY + 0.275 - 0.8) && projectileY < (playerY + 0.275) &&
                    //     projectileZ > (playerZ - 0.275) && projectileZ < (playerZ + 0.275) &&
                    //     currentProjectile.from !== currentPlayerId
                    // ) {
                    //     projectileRef.remove();
                    //     playerElements[currentPlayerId].playHurtSound();
                    //
                    //     currentPlayerRef.update({
                    //         health: currentPlayer.health - 5,
                    //     })
                    // }

                }
            }
        }
    }

    function refill() {
        if (players[playerId]) {
            if (players[playerId].ammo < maxAmmo){
                players[playerId].ammo = players[playerId].ammo + 1;
            }
        }
    }

    function updateInfoTag() {
        for (let key in players) {
            let currentPlayer = players[key];
            if (currentPlayer && currentPlayer.position && key !== playerId) {
                let id = currentPlayer.id;
                let tagX = currentPlayer.position.x;
                let tagZ = currentPlayer.position.z;

                let userX = players[playerId].position.x;
                let userZ = players[playerId].position.z;

                let longitude = userX - tagX;
                let latitude = userZ - tagZ;

                let angle = 0;
                if (longitude !== 0 && latitude !== 0) {
                    if (latitude > 0) {
                        angle = atanInDegrees(longitude, latitude);
                    } else if (latitude < 0) {
                        angle = 180 + atanInDegrees(longitude, latitude);
                    }
                }

                nameTagAngles[key] = angle;
            }
        }
    }

    let refillCounter = 0;
    let refillFrequency = 0.75;
    function loop() {
        let currentPlayer = players[playerId];
        if (currentPlayer) {

            refillCounter ++;
            if (refillCounter >= (refillFrequency * 1000 / milliseconds)) {
                refill();
                refillCounter = 0;
            }

            // set player position and rotation to user position and rotation
            players[playerId].position.x = rig.getAttribute("position").x;
            players[playerId].position.y = rig.getAttribute("position").y;
            players[playerId].position.z = rig.getAttribute("position").z;
            players[playerId].rotation.x = rig.getAttribute("rotation").x;
            players[playerId].rotation.y = rig.getAttribute("rotation").y;
            players[playerId].rotation.z = rig.getAttribute("rotation").z;
            playerRef.set(currentPlayer);

            updateInfoTag();

            if (currentPlayer.health <= 0){
                playerRef.remove();
            }
        }

        for (let key in projectiles) {
            let currentProjectile = projectiles[key];
            if (currentProjectile) {
                let projectileRef = firebase.database().ref(`projectiles/${key}`);

                moveBullet(currentProjectile, projectileRef, 5);
                collideBullet(currentProjectile, projectileRef);

                // if (Math.abs(currentProjectile.position.x) < 2.5 &&
                //     Math.abs(currentProjectile.position.z) < 2.5) {
                //     projectileRef.remove();
                // }

                // if (currentProjectile && projectileElements[currentProjectile.id]) {
                //     projectileElements[currentProjectile.id].projectileModel.addEventListener("obbcollisionstarted", () => {
                //         console.log("Hit");
                //         projectileRef.remove();
                //     })
                // }
            }
        }

        setTimeout(loop, milliseconds);
    }

    function initGame() {
        loop();
        new KeyHoldListener("Space", () => createBullet());

        const allPlayersRef = firebase.database().ref(`players`);
        const allProjectilesRef = firebase.database().ref(`projectiles`);

        allPlayersRef.on("value", (snapshot) => {
            players = snapshot.val() || {};
            for (const key in players) {
                const characterState = players[key];
                let element = playerElements[key];

                if (key === playerId){
                    if (characterState.health > 0) {
                        document.getElementById("health-value").innerHTML = `Health: ${characterState.health}`;
                        document.getElementById("healthbar").style.width = `${characterState.health}%`;
                        document.getElementById("healthbar-trailing").style.width = `${characterState.health}%`;
                        document.getElementById("ammo-bar-count").style.width = `${characterState.ammo / maxAmmo * 100}%`;

                        if (characterState.health > 50){
                            document.getElementById("healthbar").style.backgroundColor = "#16A800FF";
                        } else if (characterState.health > 25){
                            document.getElementById("healthbar").style.backgroundColor = "#A8A500FF";
                        } else {
                            document.getElementById("healthbar").style.backgroundColor = "#A80000FF";
                        }
                        document.getElementById("ammo-value").innerHTML = `Ammo: ${characterState.ammo}`;
                    }

                } else {
                    if (element && characterState && characterState.position) {
                        element.updateTagAngle(nameTagAngles[key]);
                        element.updateTagHealth(characterState.health);
                        element.updateTagName(characterState.name);
                        element.updatePosition(characterState.position.x, characterState.position.y, characterState.position.z);
                        element.updateHeadRotation(characterState.rotation.x, characterState.rotation.y, characterState.rotation.z);
                        element.updateBodyRotation(characterState.rotation.y, characterState.rotation.z);
                    }
                }
            }
        })

        allPlayersRef.on("child_added", (snapshot) => {
            const addedPlayer = snapshot.val();
            let model= new Tank(addedPlayer, "red");
            playerElements[addedPlayer.id] = model;
            
            // Only render other users' models
            if (addedPlayer.id != playerId) {
                scene.appendChild(model.characterEntity);
            }

        })

        allPlayersRef.on("child_removed", (snapshot) => {
            const id = snapshot.val().id;

            // only remove elements if removed player is not user
            // *** user's elements does not exist ***
            if (id != playerId) {
                if (playerElements[id]) {
                    scene.removeChild(playerElements[id].characterEntity);
                }
                delete playerElements[id];
            } else {
                delete playerElements[id];
                window.location.href = "google.com";
            }
        });

        allProjectilesRef.on("value", (snapshot) => {
            projectiles = snapshot.val() || {};
            for (const key in projectiles) {
                const projectileState = projectiles[key];
                let element = projectileElements[key];

                element.updatePosition(projectileState.position.x, projectileState.position.y, projectileState.position.z);
            }
        })

        allProjectilesRef.on("child_added", (snapshot) => {
            const addedProjectile = snapshot.val();
            let model = new Missile(addedProjectile);

            projectileElements[addedProjectile.id] = model;
            scene.appendChild(model.projectileModel);
        })

        allProjectilesRef.on("child_removed", (snapshot) => {
            const id = snapshot.val().id;
            scene.removeChild(projectileElements[id].projectileModel);
            delete projectileElements[id];
        })

        playerNameInput.addEventListener("change", (e) => {
            const newName = e.target.value;
            playerNameInput.value = newName;

            // only update keys given
            playerRef.update({
                name: newName,
            });
        })
    }

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            playerId = user.uid;
            playerRef = firebase.database().ref(`players/${playerId}`);

            let position = {
                x: rig.getAttribute("position").x,
                y: rig.getAttribute("position").y,
                z: rig.getAttribute("position").z,
            }
            let rotation = {
                x: rig.getAttribute("rotation").x,
                y: rig.getAttribute("rotation").y,
                z: rig.getAttribute("rotation").z,
            }

            playerRef.set({
                id: playerId,
                name: playerNameInput.value,
                health: 100,
                ammo: maxAmmo,
                position,
                rotation,
            })

            playerRef.onDisconnect().remove();

            //Begin the game now that we are signed in
            initGame();

        } else {
            // logged out
        }
    })
    firebase.auth().signInAnonymously().catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
    })
}