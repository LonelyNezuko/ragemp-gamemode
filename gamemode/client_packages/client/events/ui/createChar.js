const logger = require('./client/_modules/logger')
const user = require('./client/user/index')

mp.events.add({
	'ui::createChar:update': data => {
		mp.events.callRemote('client::user:createChar:update', data)
	},
	'ui::createChar:random': () => {
		mp.events.callRemote('client::user:createChar:random')
	},
	'ui::createChar:submit': data => {
		if(JSON.parse(data).name[0].length < 2 || JSON.parse(data).name[1].length < 2)return user.notify('А как нам тебя звать то?', 'error')
		mp.events.callRemote('client::user:createChar:submit', data)
	},
	'ui::createChar:changeType': data => {
		mp.events.callRemote('client::user:createChar:changeType', JSON.parse(data).type)
	}
})