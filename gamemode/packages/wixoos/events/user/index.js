require('./auth')
require('./createChar')
require('./chat')
require('./inventory')
require('./npcDialog')
require('./radial')


const logger = require('../../_modules/logger')
try {
	const sha256 = require('js-sha256')

	const user = require('../../user/index')
	const chat = require('../../user/chat')

	const STORAGE = require('../../_modules/storage')
	const CEF = require('../../_modules/cef')
	const { chatCommand } = require('../../_modules/chatCommand')
	const func = require('../../_modules/func')

	const mysql = require('../../_mysql/index')

	const CONFIG_USER = require('../../configs/user')
	const CONFIG_ENUMS = require('../../configs/enums')

	const vehicle = require('../../property/vehicle')

	mp.events.add({
		'playerJoin': player => {
			STORAGE.delete('user', player.id)

			STORAGE.set('user', player.id, 'logged', false)
			STORAGE.set('user', player.id, 'uid', -1)
			STORAGE.set('user', player.id, 'u_id', -1)

			STORAGE.set('user', player.id, '_createChar', false)
		},

		'client::user:setDimension': (player, dimension) => { user.setDimension(player, dimension) },
		'client::user:setPos': (player, x, y, z, a, dimension) => { user.setPos(player, x, y, z, a, dimension) },
		'client::user:addOpened': (player, name) => { user.addOpened(player, name) },
		'client::user:removeOpened': (player, name) => { user.removeOpened(player, name) },


		'client::user:loadCharacter': (player, cid) => {
			STORAGE.set('user', player.id, 'c_id', cid)
			user.loadCharacter(player)
		},
		'client::user:goToCreateChar': (player, cid) => {
			user.setPos(player, -1816.74755859375, -1205.465576171875, 13.017354965209961, -40.66239547729492, player.id + 1)
			user.setCameraToPlayer(player)

			user.cursor(player, true)

			user.resetSkin(player, { viewData: CONFIG_USER.viewDataDefault })
			user.setClothes(player, { clothes: CONFIG_ENUMS.clothesDefault[user.getGender(player)] })

			const ui_setData = CONFIG_USER.viewDataDefault
			ui_setData.clothes = [0,0,0,0]

			let ui_setClothesList = []
			CONFIG_ENUMS.characterCreateClothesList[user.getGender(player)].map((item, i) => {
				ui_setClothesList[i] = []
				item.map(item => ui_setClothesList[i].push(item.name))
			})

			CEF.emit(player, 'client::createChar', 'setData', ui_setData)
			CEF.emit(player, 'client::createChar', 'setType', { type: 0 })
			CEF.emit(player, 'client::createChar', 'setClothesList', ui_setClothesList)
			CEF.emit(player, 'client::createChar', 'toggle', { status: true })

			STORAGE.set('user', player.id, '_createChar', true)
		}
	})
}
catch(e) {
	logger.error('events/user', e)
}