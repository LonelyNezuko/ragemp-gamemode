const user = require('./client/user')
const logger = require('./client/_modules/logger')

const controlsIds = {
    F5: 327,
    W: 32, // 232
    S: 33, // 31, 219, 233, 268, 269
    A: 34, // 234
    D: 35, // 30, 218, 235, 266, 267
    Space: 321,
    LCtrl: 326,
};

global.fly = {
    flying: false, f: 3.0, w: 3.0, h: 3.0, point_distance: 1000,
};
global.gameplayCam = mp.cameras.new('gameplay');

let direction = null;
let coords = null;

function pointingAt(distance) {
    const farAway = new mp.Vector3((direction.x * distance) + (coords.x), (direction.y * distance) + (coords.y), (direction.z * distance) + (coords.z));

    const result = mp.raycasting.testPointToPoint(coords, farAway, [1, 16]);
    if (result === undefined) {
        return 'undefined';
    }
    return result;
}

mp.events.add('render', () => {
    const controls = mp.game.controls;
    const fly = global.fly;
    direction = global.gameplayCam.getDirection();
    coords = global.gameplayCam.getCoord();

    if(fly.flying) {
        mp.game.graphics.drawText(`Coords: ${JSON.stringify(coords)}`, [0.5, 0.005], {
            font: 0,
            color: [255, 255, 255, 185],
            scale: [0.3, 0.3],
            outline: true,
        });
        mp.game.graphics.drawText(`pointAtCoord: ${JSON.stringify(pointingAt(fly.point_distance).position)}`, [0.5, 0.025], {
            font: 0,
            color: [255, 255, 255, 185],
            scale: [0.3, 0.3],
            outline: true,
        });
    }

    if(user.admin > 0)
    {
        if (controls.isControlJustPressed(0, controlsIds.F5)) {
            fly.flying = !fly.flying;

            const player = mp.players.local;

            player.setInvincible(fly.flying);
            player.freezePosition(fly.flying);
            player.setAlpha(fly.flying ? 0 : 255);

            if (!fly.flying && !controls.isControlPressed(0, controlsIds.Space)) {
                const position = mp.players.local.position;
                position.z = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, 0.0, false);
                mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
            }

            // user.notify(fly.flying ? 'NoClip: Enabled' : 'NoClip: Disabled', 'warning');
        } else if (fly.flying) {
            let updated = false;
            const position = mp.players.local.position;

            if (controls.isControlPressed(0, controlsIds.W)) {
                if (fly.f < 8.0) { fly.f *= 1.025; }

                position.x += direction.x * fly.f;
                position.y += direction.y * fly.f;
                position.z += direction.z * fly.f;
                updated = true;
            } else if (controls.isControlPressed(0, controlsIds.S)) {
                if (fly.f < 8.0) { fly.f *= 1.025; }

                position.x -= direction.x * fly.f;
                position.y -= direction.y * fly.f;
                position.z -= direction.z * fly.f;
                updated = true;
            } else {
                fly.f = 2.0;
            }

            if (controls.isControlPressed(0, controlsIds.A)) {
                if (fly.l < 8.0) { fly.l *= 1.025; }

                position.x += (-direction.y) * fly.l;
                position.y += direction.x * fly.l;
                updated = true;
            } else if (controls.isControlPressed(0, controlsIds.D)) {
                if (fly.l < 8.0) { fly.l *= 1.05; }

                position.x -= (-direction.y) * fly.l;
                position.y -= direction.x * fly.l;
                updated = true;
            } else {
                fly.l = 2.0;
            }

            if (controls.isControlPressed(0, controlsIds.Space)) {
                if (fly.h < 8.0) { fly.h *= 1.025; }

                position.z += fly.h;
                updated = true;
            } else if (controls.isControlPressed(0, controlsIds.LCtrl)) {
                if (fly.h < 8.0) { fly.h *= 1.05; }

                position.z -= fly.h;
                updated = true;
            } else {
                fly.h = 2.0;
            }

            if (updated) {
                mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
            }
        }
    }
});

mp.events.add("consoleCommand", command => {
    if(command.indexOf('!noclip_save') !== -1) {
        const name = command.split(' ')[1] || 'Position'

        mp.events.callRemote('client::other:noclip:saveCamCoords', JSON.stringify(coords), JSON.stringify(pointingAt(fly.point_distance)), name);
        logger.console(`Позиция камеры '${name}' была успешно сохранена`)
    }
    if(command.indexOf('!savecoords') !== -1) {
        const name = command.split(' ')[1] || 'Position'

        mp.events.callRemote('client::other:saveCoords', name);
        logger.console(`Позиция '${name}' была успешно сохранена`)
    }
});
