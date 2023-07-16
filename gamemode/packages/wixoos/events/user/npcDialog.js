const logger = require('../../_modules/logger')
try {
	const STORAGE = require('../../_modules/storage')
	mp.events.add({
		'client::user:npcDialog': (player, btn) => {
			const trigger = STORAGE.get('user', player.id, 'npcDialogTrigger')
			if(!trigger)return

			trigger(player, btn)
		},
	})
}
catch(e) {
	logger.error('events/user/npcDialog', e)
}