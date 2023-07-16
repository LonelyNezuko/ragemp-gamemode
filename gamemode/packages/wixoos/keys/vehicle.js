const logger = require('../_modules/logger')
try {
	const user = require('../user/index')
	const chat = require('../user/chat')

	const CEF = require('../_modules/cef')
	const STORAGE = require('../_modules/storage')
	const func = require('../_modules/func')
	const { addKey } = require('../_modules/keys')

	const vehicle = require('../property/vehicle')

	addKey({
		'engineVehicle': {
			keyCode: 78,
			func: player => {
				if(!user.isOnFoot(player))return

				const veh = player.vehicle
				if(!veh)return

				if(player.seat !== 0)return
				vehicle.setEngine(veh, !veh.engine)
			}
		},
		'lockedVehicle': {
			keyCode: 76,
			func: player => {
				if(!user.isOnFoot(player))return

				let veh = player.vehicle
				if(!veh)
                {
                    mp.vehicles.forEach(v =>
                    {
                        if(func.distance2D(player.position, v.position) < 2.0
                        	&& !veh) veh = v
                    })
                }
                if(!veh)return

				if(!vehicle.isOwner(player, veh))return user.notify(player, 'У тебя нет ключей от данного транспорта', 'error')

				chat.push(player, `${user.getName(player)}[${player.id}] ${!veh.locked ? 'закрыл(а)' : 'открыл(а)'} транспорт`, 'me')
				user.notify(player, `Транспорт ${!veh.locked ? "закрыт" : "открыт"}`)

				vehicle.setLocked(veh, !veh.locked)
			}
		},
		'beltVehicle': {
			keyCode: 75,
			func: player => {
				if(!user.isOnFoot(player))return

				const veh = player.vehicle
				if(!veh)return

				STORAGE.set('user', player.id, '_vehBelt', !STORAGE.get('user', player.id, '_vehBelt'))
                if(player.seat === 0) vehicle.updatePlayerData(player, veh)

                chat.push(player, `${user.getName(player)}[${player.id}] ${!STORAGE.get('user', player.id, '_vehBelt') ? 'отстегнул(а)' : 'пристегнул(а)'} ремень безопастности`, 'me')
                player.call('server::user:setVehBelt', [ STORAGE.get('user', player.id, '_vehBelt') ])
			}
		}
	})
}
catch(e) {
	logger.error('keys/vehicle', e)
}