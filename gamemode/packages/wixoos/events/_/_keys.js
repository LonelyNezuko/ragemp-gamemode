const logger = require('../../_modules/logger')
try {
	const STORAGE = require('../../_modules/storage')
	const { keys } = require('../../_modules/keys')
	
	mp.events.add('client::key', (player, data) => {
		data = JSON.parse(data)
	    for(var key in STORAGE.get('user', player.id, 'keyBinds'))
	    {
	        if(STORAGE.get('user', player.id, 'keyBinds')[key].keyCode === data.keyCode
	            || STORAGE.get('user', player.id, 'keyBinds')[key].keyCode === data.keyCode[0]
	            || (typeof STORAGE.get('user', player.id, 'keyBinds')[key].keyCode === 'object'
	                && STORAGE.get('user', player.id, 'keyBinds')[key].keyCode.length >= 2
	                && STORAGE.get('user', player.id, 'keyBinds')[key].keyCode[0] === data.keyCode[0]
	                && STORAGE.get('user', player.id, 'keyBinds')[key].keyCode[1] === data.keyCode[1])
	            || (typeof data.keyCode === 'object'
	                && data.keyCode.indexOf(STORAGE.get('user', player.id, 'keyBinds')[key].keyCode) !== -1)) keys[key].func(player, data.up)
	    }
	})
}
catch(e) {
	logger.error('events/_keys', e)
}