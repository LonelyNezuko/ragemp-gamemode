const logger = require('../_modules/logger')
try {
	const user = require('../user/index')
	const chat = require('../user/chat')

	const CEF = require('../_modules/cef')
	const STORAGE = require('../_modules/storage')
	const func = require('../_modules/func')
	const { addKey } = require('../_modules/keys')

	addKey({
		'menuOpen': {
			keyCode: 9,
			func: player => {
				if(!user.isOnFoot(player))return

				user.toggleHud(player, false)
				user.cursor(player, true)

				CEF.emit(player, 'client::menu', 'setHeaderNav', { id: 0 })
				CEF.emit(player, 'client::menu', 'setBodyNav', { id: 0 })

				CEF.emit(player, 'client::menu', 'toggle', { status: true, accountData: {
					id: STORAGE.get('user', player.id, 'uid'),
					admin: user.getAdminLevel(player),
					char: {
						id: STORAGE.get('user', player.id, 'c_id'),
						name: user.getName(player),
						cash: [ 0, 0 ],
						fraction: undefined,
						family: undefined
					},
					avatar: 'https://kartinkin.net/uploads/posts/2022-10/1665514701_46-kartinkin-net-p-nezuko-demon-art-vkontakte-51.jpg'
				} })

				user.addOpened(player, 'menu')
			}
		},
		'inventoryOpen': {
			keyCode: 73,
			func: player => {
				if(!user.isOnFoot(player))return

				user.toggleHud(player, false)
				user.cursor(player, true)

				user.addOpened(player, 'menu')

				CEF.emit(player, 'client::menu', 'setHeaderNav', { id: 1 })
				CEF.emit(player, 'client::menu', 'setBodyNav', { id: 0 })

				user.inventory.updateUI(player)
				CEF.emit(player, 'client::menu:inventory', 'setNearbyName', {
					name: 'Окружение'
				})

				CEF.emit(player, 'client::menu', 'toggle', { status: true, accountData: {
					id: STORAGE.get('user', player.id, 'uid'),
					admin: user.getAdminLevel(player),
					char: {
						id: STORAGE.get('user', player.id, 'c_id'),
						name: user.getName(player),
						cash: [ 0, 0 ],
						fraction: undefined,
						family: undefined
					},
					avatar: 'https://kartinkin.net/uploads/posts/2022-10/1665514701_46-kartinkin-net-p-nezuko-demon-art-vkontakte-51.jpg',

					googleAuth: false,
					email: '',
					onlySCID: false
				} })
			}
		},
	})
}
catch(e) {
	logger.error('keys/user', e)
}