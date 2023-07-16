require('./_/_keys')
require('./_/_other')

require('./user/index')

const logger = require('../_modules/logger')
try {
	const user = require('../user/index')
	
	const sys_npc = require('../systems/npc')

	const STORAGE = require('../_modules/storage')

	const vehicle = require('../property/vehicle')
	mp.events.add({
		'playerEnterVehicle': (player, veh, seat) => {
			vehicle.onEnter(player, veh, seat)
		},
		'playerExitVehicle': (player, veh) => {
			vehicle.onExit(player, veh)
		}
	})


	mp.events.add('playerDeath', (player, reason, killer) => {
		user.spawn(player)
	})


	mp.events.add({
		 'playerEnterColshape': (player, shape) =>
	    {
	        sys_npc.enterColshape(player, shape)
	    },
	    'playerExitColshape': (player, shape) =>
	    {
	        sys_npc.exitColshape(player, shape)
	    },
	})
}
catch(e) {
	logger.error('events', e)
}