const logger = require('../../_modules/logger')
try {
	const user = require('../../user/index')
	const STORAGE = require('../../_modules/storage')

	const sys_drop = require('../../systems/drop')

	mp.events.add({
		// 'client::user:inventory:update:items': (player, data) => {
		// 	data = JSON.parse(data)
		// 	if(!user.isLogged(player))return

		// 	STORAGE.set('user', player.id, 'c_inv', data)
		// 	user.save(player)
		// },
		// 'client::user:inventory:update:backpack': (player, data) => {
		// 	data = JSON.parse(data)
		// 	if(!user.isLogged(player))return

		// 	STORAGE.set('user', player.id, 'c_invBackpack', data)
		// 	user.save(player)
		// }

		'client::user:inventory:transfer': (player, data) => {
			data = JSON.parse(data)
			if(!user.isLogged(player))return

			const
				targetSlot = data.targetID,
				targetParent = data.targetParent,

				draggableSlot = data.draggableID,
				draggableParent = data.draggableParent,

				itemsInv = STORAGE.get('user', player.id, 'c_inv'),
				itemsBackpack = STORAGE.get('user', player.id, 'c_invBackpack'),


				_names = {
					'#inventoryMain': '',
					'#inventoryBackpack': 'Backpack'
				}

			if(targetParent === '#inventoryChar'
				|| draggableParent === '#inventoryChar'
				|| targetParent === '#inventoryFast'
				|| draggableParent === '#inventoryFast')return

			if(targetParent === draggableParent) {
				if(!user.inventory.hasSlot(player, _names[targetParent], targetSlot)
					&& !user.inventory.hasSlot(player, _names[draggableParent], draggableSlot))return user.inventory.updateUI(player)

				if(draggableParent === '#inventoryMain') {
					const target = itemsInv[targetSlot]

					itemsInv[targetSlot] = itemsInv[draggableSlot]
					itemsInv[draggableSlot] = target
				}
				else if(draggableParent === '#inventoryBackpack') {
					const target = itemsBackpack[targetSlot]

					itemsBackpack[targetSlot] = itemsBackpack[draggableSlot]
					itemsBackpack[draggableSlot] = target
				}
			}
			else if(draggableParent === '#inventoryMain'
				&& targetParent === '#inventoryBackpack') {
				if(!user.inventory.hasSlot(player, _names[targetParent], targetSlot)
					&& !user.inventory.hasSlot(player, _names[draggableParent], draggableSlot))return user.inventory.updateUI(player)

				const target = itemsBackpack[targetSlot]

				itemsBackpack[targetSlot] = itemsInv[draggableSlot]
				itemsInv[draggableSlot] = target
			}
			else if(draggableParent === '#inventoryBackpack'
				&& targetParent === '#inventoryMain') {
				if(!user.inventory.hasSlot(player, _names[targetParent], targetSlot)
					&& !user.inventory.hasSlot(player, _names[draggableParent], draggableSlot))return user.inventory.updateUI(player)

				const target = itemsInv[targetSlot]

				itemsInv[targetSlot] = itemsBackpack[draggableSlot]
				itemsBackpack[draggableSlot] = target
			}
			else if(draggableParent === '#inventoryNearby') {
				if(targetParent !== '#inventoryMain'
					&& targetParent !== '#inventoryBackpack')return
				
				let status = false
				if(targetParent === '#inventoryMain') {
					let slot = -1
					itemsInv.map((item, i) => {
						if(!item.id && slot === -1) slot = i
					})

					if(slot !== -1) {
						const l = data.draggableItem

						delete l.dropID
						delete l.hash

						itemsInv[slot] = l
						status = true
					}
				}
				else {
					let slot = -1
					itemsBackpack.map((item, i) => {
						if(!item.id && slot === -1) slot = i
					})

					if(slot !== -1) {
						const l = data.draggableItem

						delete l.dropID
						delete l.hash

						itemsBackpack[slot] = l
						status = true
					}
				}

				if(status === true) sys_drop.delete(data.draggableItem.dropID, data.draggableItem)
				else user.notify(player, 'Не хватает места', 'error')
			}

			STORAGE.set('user', player.id, 'c_inv', itemsInv)
			STORAGE.set('user', player.id, 'c_invBackpack', itemsBackpack)

			user.save(player)
			user.inventory.updateUI(player)
		},
		'client::user:inventory:trash': (player, data) => {
			data = JSON.parse(data)
			if(!user.isLogged(player))return

			const
				draggableSlot = data.draggableID,
				draggableParent = data.draggableParent,

				itemsInv = STORAGE.get('user', player.id, 'c_inv'),
				itemsBackpack = STORAGE.get('user', player.id, 'c_invBackpack'),


				_names = {
					'#inventoryMain': '',
					'#inventoryBackpack': 'Backpack'
				}

			if(draggableParent === '#inventoryChar'
				|| draggableParent === '#inventoryFast')return

			let item = {}
			if(draggableParent === '#inventoryMain') {
				item = itemsInv[draggableSlot]
				itemsInv[draggableSlot] = {}
			}
			else if(draggableParent === '#inventoryBackpack') {
				item = itemsBackpack[draggableSlot]
				itemsBackpack[draggableSlot] = {}
			}
			if(item.id) sys_drop.drop(player, item, [ player.position.x + 1, player.position.y + 1, player.position.z ], player.dimension)

			STORAGE.set('user', player.id, 'c_inv', itemsInv)
			STORAGE.set('user', player.id, 'c_invBackpack', itemsBackpack)

			user.save(player)
			user.inventory.updateUI(player)
		}
	})
}
catch(e) {
	logger.error('events/user/inventory', e)
}