const logger = require('../_modules/logger')
try {
	const chat = {}

	const STORAGE = require('../_modules/storage')
	const CEF = require('../_modules/cef')
	const func = require('../_modules/func')

	chat.push = (player, message, type, settings = {}) => {
		CEF.emit(player, 'client::hud:chat', 'addMessage', {
			text: message,
			type,
			settings
		})
	}
	chat.clear = player => {
		CEF.emit(player, 'client::hud:chat', 'clear')
		chat.push(player, 'Чат очищен', 'system')
	}
	chat.radius = (player, text, type, settings = {}) =>
    {
        mp.players.forEach(pl =>
        {
            if(STORAGE.get('user', pl.id, 'logged') === true
                && func.distance2D(player.position, pl.position) < 30) chat.push(pl, text, type, settings)
        })
    }

	chat.setTypeList = player => {
		const typeList = [
			'',
		]

		if(STORAGE.get('user', player.id, 'admin') > 0) typeList.push('admin')

		typeList.push('ooc')
		typeList.push('me')
		typeList.push('do')
		typeList.push('try')
		typeList.push('todo')

		CEF.emit(player, 'client::hud:chat', 'setTypeList', typeList)
	}

	chat.pushAdmin = (message, settings = {}) => {
		mp.players.forEach(pl => {
			if(STORAGE.get('user', pl.id, 'admin') > 0) chat.push(pl, message, 'admin', settings)
		})
	}

	module.exports = chat
}
catch(e) {
	logger.error('user/chat', e)
}