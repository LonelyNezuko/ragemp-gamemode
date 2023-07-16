mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "vehicle") {
        let typeor = typeof entity.getVariable('VehicleSyncData');
        let actualData = entity.getVariable('VehicleSyncData');

        //Needed to stop vehicles from freaking out
        mp.game.streaming.requestCollisionAtCoord(entity.position.x, entity.position.y, entity.position.z);
        mp.game.invoke('0x566B32CA90C28D2C', entity.position.x, entity.position.y, entity.position.z);
        entity.setLoadCollisionFlag(true);
        entity.trackVisibility();

        if (typeor !== 'undefined' && entity.isSeatFree(-1)) //Only if there is no driver
        {
            entity.position = actualData.Position;
            entity.rotation = actualData.Rotation;
        }

        //Set doors unbreakable for a moment
        let x = 0;
        for (x = 0; x < 8; x++) {
            entity.setDoorBreakable(x, false);
        }

        //Do it anyway
        entity.setUndriveable(true);

        if (typeor !== 'undefined') {
            entity.setEngineOn(actualData.Engine, true, false);
            entity.setUndriveable(true);

            if (actualData.Locked)
                entity.setDoorsLocked(2);
            else
                entity.setDoorsLocked(1);

            entity.setDirtLevel(actualData.Dirt);

            for (x = 0; x < 8; x++) {
                if (actualData.Door[x] === 1)
                    entity.setDoorOpen(x, false, false);
                else if (actualData.Door[x] === 0)
                    entity.setDoorShut(x, true);
                else
                    entity.setDoorBroken(x, true);
            }

            for (x = 0; x < 4; x++) {
                if (actualData.Window[x] === 0) {
                    entity.fixWindow(x);
                }
                else if (actualData.Window[x] === 1) {
                    entity.rollDownWindow(x);
                }
                else {
                    entity.smashWindow(x);
                }
            }

            for (x = 0; x < 8; x++) {
                if (actualData.Wheel[x] === 0) {
                    entity.setTyreFixed(x);
                }
                else if (actualData.Wheel[x] === 1) {
                    entity.setTyreBurst(x, false, 0);
                }
                else {
                    entity.setTyreBurst(x, true, 1000);
                }
            }

            //For trailer mid wheels
            if (actualData.Wheel[8] === 0) {
                entity.setTyreFixed(45);
            }
            else if (actualData.Wheel[8] === 1) {
                entity.setTyreBurst(45, false, 0);
            }
            else {
                entity.setTyreBurst(45, true, 1000);
            }

            if (actualData.Wheel[9] === 0) {
                entity.setTyreFixed(47);
            }
            else if (actualData.Wheel[9] === 1) {
                entity.setTyreBurst(47, false, 0);
            }
            else {
                entity.setTyreBurst(47, true, 1000);
            }
        }

        //Make doors breakable again
        setTimeout(() => {
            for (x = 0; x < 8; x++) {
                entity.setDoorBreakable(x, true);
            }
        }, 1500);
    }
});