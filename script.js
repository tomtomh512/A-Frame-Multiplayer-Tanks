let milliseconds = 30;
let maxAmmo = 100;

window.onload = function() {
    let playerId;
    let playerRef;
    // Buckets to keep track of elements
    let players = {};
    let playerElements = {};
    let projectiles = {};
    let projectileElements = {};
    let nameTagAngles = {};

    let scene = document.querySelector("a-scene");
    const playerNameInput = document.querySelector("#player-name");

    // let d = 5; // distance from 0
    // let h = 2.5; // platform height
    // let color1 = "#233133"; // platform color
    // let color2 = "#1d1d1d"; // ramp and bridge color

    // let platform1 = new Platform(d, -d, 0, h, color1, color2)
    // let platform2 = new Platform(-d, -d, 0, h, color1, color2);
    // let platform3 = new Platform(d, d, 180, h, color1, color2);
    // let platform4 = new Platform(-d, d, 180, h, color1, color2);
    // scene.appendChild(platform1.platformEntity);
    // scene.appendChild(platform2.platformEntity);
    // scene.appendChild(platform3.platformEntity);
    // scene.appendChild(platform4.platformEntity);
    //
    // let elevatedPlatform1 = new ElevatedPlatform(d, 0, 0, h, d, color2);
    // let elevatedPlatform2 = new ElevatedPlatform(-d, 0, 0, h, d, color2);
    // let elevatedPlatform3 = new ElevatedPlatform(0, d, 90, h, d, color2);
    // let elevatedPlatform4 = new ElevatedPlatform(0, -d, 90, h, d, color2);
    // scene.appendChild(elevatedPlatform1.platformEntity);
    // scene.appendChild(elevatedPlatform2.platformEntity);
    // scene.appendChild(elevatedPlatform3.platformEntity);
    // scene.appendChild(elevatedPlatform4.platformEntity);

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
        // Only generate projectile if ammo is greater than 0
        if (players[playerId].ammo > 0) {
            let rigX = rig.getAttribute("position").x;
            let rigY = rig.getAttribute("position").y;
            let rigZ = rig.getAttribute("position").z;
            let rigRx = rig.getAttribute("rotation").x;
            let rigRy = rig.getAttribute("rotation").y;
            let rigRz = rig.getAttribute("rotation").z;

            // let offset = 1.27155;
            let offset = 1.75;

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

            // Generate id = playerId + count
            let uniqueId = playerId + count.toString();
            const projectileRef = firebase.database().ref(`projectiles/${uniqueId}`);
            count++;

            // Create projectile
            projectileRef.set({
                id: uniqueId,
                from: playerId,
                position,
                rotation,
            })

            // Update ammo count
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
            // const ground = document.getElementById("ground");
            // const fieldWidth = ground.getAttribute('width');
            // const fieldDepth = ground.getAttribute('height');

            let fieldWidth = 20;
            let fieldDepth = 40;

            // Hard boundaries
            if (Math.abs(currentProjectile.position.x) > fieldWidth / 2 ||
                currentProjectile.position.y < -4 || currentProjectile.position.y > 7 ||
                Math.abs(currentProjectile.position.z) > fieldDepth / 2) {

                console.log("boundary hit");
                projectileRef.remove();
            }

            // Collision with players
            for (let playerKey in players) {
                let currentPlayer = players[playerKey];
                if (currentPlayer){
                    let currentPlayerRef = firebase.database().ref(`players/${currentPlayer.id}`);

                    if (playerElements[currentPlayer.id] && playerElements[currentPlayer.id].bodyEntity && playerElements[currentPlayer.id].bodyEntity.hitbox) {
                        playerElements[currentPlayer.id].bodyEntity.hitbox.addEventListener("obbcollisionstarted", (event) => {
                            projectileRef.remove();
                            currentPlayerRef.update({
                                health: currentPlayer.health - 5,
                            })
                        })
                    }


                    // if (calculateDistance(
                    //     currentProjectile.position.x,
                    //     currentProjectile.position.y,
                    //     currentProjectile.position.z,
                    //     currentPlayer.position.x,
                    //     currentPlayer.position.y,
                    //     currentPlayer.position.z,
                    // ) < 0.7) {
                    //     projectileRef.remove();
                    //     currentPlayerRef.update({
                    //         health: currentPlayer.health - 5,
                    //     })
                    // }
                }
            }

            // Collision with environment
            if (projectileElements[currentProjectile.id] && projectileElements[currentProjectile.id].projectileTip) { // Checks
                projectileElements[currentProjectile.id].projectileTip.addEventListener("obbcollisionstarted", (event) => {
                    projectileRef.remove();
                });
            }

        }
    }

    function refill() {
        if (players[playerId]) {
            // If ammo is less than max, refill
            if (players[playerId].ammo < maxAmmo){
                players[playerId].ammo = players[playerId].ammo + 1;
            }
        }
    }

    function updateInfoTag() {
        for (let key in players) {
            let currentPlayer = players[key];
            // Update other players' tags
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

            // Use refillCounter to control refill frequency
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

        // Cycle through existing projectiles
        for (let key in projectiles) {
            let currentProjectile = projectiles[key];
            if (currentProjectile) {
                let projectileRef = firebase.database().ref(`projectiles/${key}`);

                moveBullet(currentProjectile, projectileRef, 5);
                collideBullet(currentProjectile, projectileRef);
            }
        }

        setTimeout(loop, milliseconds);
    }

    function initGame() {
        // Start loop
        loop();

        // Create projectile
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
            scene.appendChild(model.projectileEntity);
        })

        allProjectilesRef.on("child_removed", (snapshot) => {
            const id = snapshot.val().id;
            scene.removeChild(projectileElements[id].projectileEntity);
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