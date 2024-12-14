let milliseconds = 30;
let maxAmmo = 10;

window.onload = function() {
    let playerId;
    let playerRef;
    let players = {};
    let playerElements = {};

    let scene = document.querySelector("a-scene");

    // set initial conditions of rig
    let rig = document.getElementById("camera");
    rig.setAttribute("position", { x: 0, y: 0, z: 0});
    rig.setAttribute("rotation", { x: 0, y: getCameraAngle(rig.getAttribute("position").x, rig.getAttribute("position").z), z: 0 });

    try {
        rig.components["look-controls"].yawObject.rotation.y = rig.getAttribute("rotation").y * Math.PI / 180;
    } catch (error) {
        location.reload();
    }

    function loop() {
        let currentPlayer = players[playerId];
        if (currentPlayer) {
            // set player position and rotation to user position and rotation
            players[playerId].position.x = rig.getAttribute("position").x;
            players[playerId].position.y = rig.getAttribute("position").y;
            players[playerId].position.z = rig.getAttribute("position").z;
            players[playerId].rotation.x = rig.getAttribute("rotation").x;
            players[playerId].rotation.y = rig.getAttribute("rotation").y;
            players[playerId].rotation.z = rig.getAttribute("rotation").z;

            playerRef.set(currentPlayer);
        }

        setTimeout(loop, milliseconds);
    }

    function initGame() {
        loop();
        const allPlayersRef = firebase.database().ref(`players`);
        const allProjectilesRef = firebase.database().ref(`projectiles`);

        allPlayersRef.on("value", (snapshot) => {
            players = snapshot.val() || {};
            for (const key in players) {
                const characterState = players[key];
                let element = playerElements[key];

                if (key === playerId){

                } else {
                    if (element && characterState && characterState.position) {
                        element.updatePosition(characterState.position.x, characterState.position.y, characterState.position.z);
                        element.updateHeadRotation(characterState.rotation.x, characterState.rotation.y, characterState.rotation.z);
                        element.updateBodyRotation(characterState.rotation.y, characterState.rotation.z);
                    }
                }
            }
        })

        allPlayersRef.on("child_added", (snapshot) => {
            const addedPlayer = snapshot.val();
            let model= new Tank(addedPlayer, addedPlayer.id);
            playerElements[addedPlayer.id] = model;
            
            // Only render other users' modelss
            if (addedPlayer.id != playerId) {
                scene.appendChild(model.characterEntity);
            }

        })

        allPlayersRef.on("child_removed", (snapshot) => {
            const id = snapshot.val().id;

            if (playerElements[id] && playerElements[id].characterEntity) {
                scene.removeChild(playerElements[id].characterEntity);
            }

            delete playerElements[id];
        });
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
                name: "Test",
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