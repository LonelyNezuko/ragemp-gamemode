exports = {
	getStreetNames: () =>
    {
        const position = mp.players.local.position
        let result = [ 'Неизвестно', '' ]

        if(position.z >= -30)
        {
            const zoneHash = mp.game.zone.getNameOfZone(position.x, position.y, position.z)
            const streetHash = mp.game.pathfind.getStreetNameAtCoord(position.x, position.y, position.z, 0, 0)

            result = [
                mp.game.ui.getLabelText(zoneHash),
                mp.game.ui.getStreetNameFromHashKey(streetHash.streetName)
            ]
        }
        return result
    },
    getMinimapAnchor: () => {
        let sfX = 1.0 / 20.0;
        let sfY = 1.0 / 20.0;

        let safeZone = mp.game.graphics.getSafeZoneSize();
        let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
        let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);

        let scaleX = 1.0 / resolution.x;
        let scaleY = 1.0 / resolution.y;

        let minimap = {
            width: scaleX * (resolution.x / (4 * aspectRatio)),
            height: scaleY * (resolution.y / 5.674),
            scaleX: scaleX,
            scaleY: scaleY,
            left: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
            bottom: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
        };

        minimap.right = minimap.leftX + minimap.width;
        minimap.top = minimap.bottomY - minimap.height;

        return minimap;
    },

    getCameraOffset: (pos, angle, dist) => {
        angle = angle * 0.0174533;

        pos.y = pos.y + dist * Math.sin(angle);
        pos.x = pos.x + dist * Math.cos(angle);

        return pos;
    },

    distance: (pos1, pos2) => {
        return Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2) + Math.pow((pos2.z - pos1.z),2)))
    },


    getLookingAtEntity: () => {
        let startPosition = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
        var resolution = mp.game.graphics.getScreenActiveResolution(1, 1);
        let secondPoint = mp.game.graphics.screen2dToWorld3d([resolution.x / 2, resolution.y / 2, (2 | 4 | 8)]);
        if (secondPoint == undefined) return null;

        startPosition.z -= 0.3;
        const result = mp.raycasting.testPointToPoint(startPosition, secondPoint, mp.players.local, (2 | 4 | 8 | 16));

        if (typeof result !== 'undefined') {
            if (typeof result.entity.type === 'undefined') return null;
            if (result.entity.type == 'object' && result.entity.getVariable('TYPE') == undefined) return null;

            let entPos = result.entity.position;
            let lPos = mp.players.local.position;
            if (mp.game.gameplay.getDistanceBetweenCoords(entPos.x, entPos.y, entPos.z, lPos.x, lPos.y, lPos.z, true) > 3) return null;
            if (result.entity.type == "ped" || result.entity.type == "object") return;
            if (mp.players.local.isInAnyVehicle(false)) return;
            
            return result.entity;
        }
        return null;
    }
}