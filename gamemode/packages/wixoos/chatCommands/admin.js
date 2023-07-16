const logger = require('../_modules/logger')
try {
	const { addChatCommand } = require('../_modules/chatCommand')

	const user = require('../user/index')
	const chat = require('../user/chat')

	const vehicle = require('../property/vehicle')

	addChatCommand({
		'veh': {
			settings: {
				admin: 3
			},
			func: (player, args, argsText) => {
				const model = args[0]
				if(!model)return chat.push(player, 'Не верное использование команды: /veh [model]', 'error')

				const veh = vehicle.add(model, [ player.position.x, player.position.y, player.position.z ], {
					heading: player.heading,
					dimension: player.dimension,
					number: 'ADMIN',
					owner: {
						admin: true
					}
				})

				setTimeout(() => {
					player.putIntoVehicle(veh, 0)
				}, 200)
				chat.pushAdmin(`${user.getLogin(player)} [${player.id}] создал транспорт [${model}]`)
			}
		},
		'delveh': {
			settings: {
				admin: 3
			},
			func: (player, args, argsText) => {
				const veh = player.vehicle
				if(!veh)return chat.push(player, 'Ты должен сидеть в транспорте', 'error')
				if(!vehicle.getOwner(veh).admin)return chat.push(player, 'Это не админский транспорт', 'error')

				chat.pushAdmin(`${user.getLogin(player)} [${player.id}] удалил админский транспорт [${veh.id}]`)
				vehicle.destroy(veh)
			}
		},

		'cveh': {
			settings: {
				admin: 10
			},
			func: (player, args, argsText) => {
				const model = args[0]
				if(!model)return chat.push(player, 'Не верное использование команды: /cveh [model]', 'error')

				const veh = vehicle.add(model, [ player.position.x, player.position.y, player.position.z ], {
					heading: player.heading,
					dimension: player.dimension,
					save: true
				})
				setTimeout(() => {
					player.putIntoVehicle(veh, 0)
				}, 200)
			}
		},
		'dveh': {
			settings: {
				admin: 10
			},
			func: (player, args, argsText) => {
				const veh = player.vehicle
				if(!veh)return chat.push(player, 'Ты должен сидеть в транспорте', 'error')

				vehicle.destroy(veh)
			}
		}
	})
}
catch(e) {
	logger.error('chatCommands/dev', e)
}