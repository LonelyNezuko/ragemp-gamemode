const logger = require('../../_modules/logger')
try {
	const user = require('../../user/index')

	const STORAGE = require('../../_modules/storage')

	const vehicle = require('../../property/vehicle')

	mp.events.add({
		'client::user:radial': (player, entity) => {
			entity = JSON.parse(entity)
			if(!entity || (entity.type !== 'player' && entity.type !== 'vehicle'))return

			if(entity.type === 'vehicle') vehicle.radial(player, entity.id)
		},
		'client::user:hideRadial': player => { user.hideRadial(player) },
		'client::user:radialTrigger': (player, btn) => {
			const trigger = STORAGE.get('user', player.id, 'radialTrigger')
			if(!trigger)return

			trigger(player, btn)
		}
	})
}
catch(e) {
	logger.error('events/user', e)
}