const logger = require('./client/_modules/logger')
const CEF = require('./client/_modules/cef')

mp.events.add({
	'ui::radial:close': data => {
		mp.events.callRemote('client::user:hideRadial')
	},
	'ui::radial': data => {
		data = JSON.parse(data)
		mp.events.callRemote('client::user:radialTrigger', data.btn)
	}
})