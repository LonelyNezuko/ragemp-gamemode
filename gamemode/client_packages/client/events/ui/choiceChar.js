const logger = require('./client/_modules/logger')
const CEF = require('./client/_modules/cef')

mp.events.add({
	'ui::user:choiceChar': data => {
		data = JSON.parse(data)
		mp.events.callRemote('client::user:loadCharacter', data.id)
	},
	'ui::user:choiceChar:create': () => {
		mp.events.callRemote('client::user:goToCreateChar')
		CEF.emit('client::choiceChar', 'toggle', { status: false })
	}
})