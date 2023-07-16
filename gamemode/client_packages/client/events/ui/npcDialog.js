const logger = require('./client/_modules/logger')
const CEF = require('./client/_modules/cef')

mp.events.add({
	'ui::npcDialog': data => {
		data = JSON.parse(data)
		mp.events.callRemote('client::user:npcDialog', data.btn)
	}
})