const logger = require('./client/_modules/logger')
const CEF = require('./client/_modules/cef')

const user = require('./client/user/index')

mp.events.add({
	'ui::menu:close': data => {
		user.toggleHud(true)
		user.cursor(false, true)

		user.removeOpened('menu')
	},


	// Inventory
	'ui::client:menu:inventory:transfer': data => {
		mp.events.callRemote('client::user:inventory:transfer', data)
	},
	'ui::client:menu:inventory:trash': data => {
		mp.events.callRemote('client::user:inventory:trash', data)
	}
})