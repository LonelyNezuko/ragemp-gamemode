const logger = require('./client/_modules/logger')
const CEF = require('./client/_modules/cef')

const user = require('./client/user/index')

mp.events.add({
	'ui::hud:chat:close': data => {
		user.cursor(false, true)
		user.removeOpened('chat')
	},
	'ui::hud:chat:send': data => {
		mp.events.callRemote('client::user:chat:send', data)
	}
})