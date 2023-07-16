const logger = require('../_modules/logger')
try {
	const { addChatCommand } = require('../_modules/chatCommand')

	const user = require('../user/index')

	addChatCommand({
		'test_save': {
			settings: {
				devmode: true
			},
			func: player => {
				user.save(player)
			}
		},
		'test_addInvItem': {
			settings: {
				devmode: true
			},
			func: (player, args, argsText) => {
				const id = parseInt(args[0] || 1)
				const count = parseInt(args[1] || 1)

				user.inventory.add(player, id, count)
			}
		}
	})
}
catch(e) {
	logger.error('chatCommands/dev', e)
}