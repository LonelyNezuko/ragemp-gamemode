const logger = require('../../_modules/logger')
try {
	const user = require('../../user/index')
	const chat = require('../../user/chat')

	const STORAGE = require('../../_modules/storage')
	const { chatCommand } = require('../../_modules/chatCommand')
	const func = require('../../_modules/func')

	const CONFIG_ENUMS = require('../../configs/enums')

	mp.events.add({
		'client::user:chat:send': (player, data) => {
			if(!user.isLogged(player))return

			data = JSON.parse(data)

			if(data.text[0] === '/') {
				const cmd = data.text.split(' ')[0].replace('/', '')
				const args = data.text.split(' ').splice(1, data.text.length)

				if(chatCommand[cmd]) {
					if(chatCommand[cmd].settings) {
						if(chatCommand[cmd].settings.admin && chatCommand[cmd].settings.admin > user.getAdminLevel(player))return
						if(chatCommand[cmd].settings.devmode && CONFIG_ENUMS.devMode.indexOf(STORAGE.get('user', player.id, 'login')) === -1)return
					}

					chatCommand[cmd].func(player, args, data.text.replace(data.text.split(' ')[0], ''))
				}
				else chat.push(player, 'Такой команды не существует!', 'system')
			}
			else {
				if(user.isMute(player) > 0)return

				switch(data.type) {
					case '': {
						chat.radius(player, `${user.getName(player)} [${player.id}] говорит: ${data.text}`)
						break
					}
					case 'ooc': {
						chat.radius(player, `(( ${user.getName(player)} [${player.id}]: ${data.text} ))`, 'ooc')
						break
					}
					case 'admin': {
						chat.pushAdmin(`[A] ${user.getAdminName(player)} ${user.getName(player)} [${player.id}]: ${data.text}`)
						break
					}
					case 'me': {
						chat.radius(player, `{FF99FF}${user.getName(player)}[${player.id}] ${data.text}`, '')
						break
					}
					case 'do': {
						chat.radius(player, `{4276b5}${data.text} - ${user.getName(player)}[${player.id}]`, '')
						break
					}
					case 'try': {
						chat.radius(player, `{FF99FF}${user.getName(player)}[${player.id}] ${data.text} - ${func.random(0, 1) === 0 ? '{47cf4f}Удачно' : '{cf4646}Не удачно'}`, '')
						break
					}
					case 'todo': {
						const text = data.text.split('*')[0]
						const me = data.text.split('*')[1]

						if((!me || !text)
							|| (!me.length || !text.length))return chat.push(player, 'Ты не правильно это используешь! Делай так: Твоя фраза*Действие', 'system')

						chat.radius(player, `${text} - сказал(а) ${user.getName(player)} [${player.id}], {FF99FF}${me}`, '')
						break
					}
				}
			}
		},
	})
}
catch(e) {
	logger.error('events/user/chat', e)
}