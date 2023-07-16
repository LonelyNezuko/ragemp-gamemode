const logger = require('../_modules/logger')
try {
	const user = require('../user/index')
	const chat = require('../user/chat')

	const CEF = require('../_modules/cef')
	const STORAGE = require('../_modules/storage')
	const func = require('../_modules/func')
	const { addKey } = require('../_modules/keys')

	const sys_npc = require('../systems/npc')

	addKey({
		'chatOpen': {
			keyCode: 84,
			func: player => {
				if(!user.isOnFoot(player))return

				chat.setTypeList(player)
				CEF.emit(player, 'client::hud:chat', 'setOpen', { status: true })

				user.cursor(player, true)
				user.addOpened(player, 'chat')
			}
		},

		'keysToggle': {
			keyCode: 120,
			func: player => {
				if(!STORAGE.get('user', player.id, 'c_keysToggle')) STORAGE.set('user', player.id, 'c_keysToggle', 1)
				else STORAGE.set('user', player.id, 'c_keysToggle', 0)

				user.save(player)
				player.call('server::user:setKeysToggle', [ STORAGE.get('user', player.id, 'c_keysToggle') ])
			}
		},
		'action': {
			keyCode: 69,
			func: player => {
				if(!user.isOnFoot(player))return

				sys_npc.action(player)
			}
		},
		'actionRadial': {
			keyCode: 71,
			func: player => {
				if(!user.isOnFoot(player))return
				player.call('server::user:actionRadial')
			}
		},
		'changeMinimap': {
			keyCode: 90,
			func: player => {
				if(!user.isOnFoot(player))return
				player.call('server::user:changeMinimap')
			}
		}
	})
}
catch(e) {
	logger.error('keys/hud', e)
}