const logger = require('../_modules/logger')
try {
	const sys_drop = {}

	const STORAGE = require('../_modules/storage')
	const random = require('../_modules/random')
	const func = require('../_modules/func')

	sys_drop.drop = (player, item, position, dimension = 0, data = {}) => {
		const drops = STORAGE.all('drop')

		let id = -1
		let status = false

		for(var key in drops) {
			if(func.distance2D(player.position, { x: drops[key].position[0], y: drops[key].position[1], z: drops[key].position[2] }) <= 2
				&& id === -1) {
				id = parseInt(key)
				status = true
			}
		}
		if(id === -1) id = STORAGE.free('drop')

		if(!status) {
			const object = mp.objects.new('prop_tool_box_02', new mp.Vector3(position[0], position[1], position[2]), {
				dimension: dimension
			})
			object.setVariable('drop', id)

			STORAGE.set('drop', id, 'status', true)
			STORAGE.set('drop', id, 'object', object)
			STORAGE.set('drop', id, 'position', position)
			STORAGE.set('drop', id, 'dimension', dimension)
			STORAGE.set('drop', id, 'items', [])
			STORAGE.set('drop', id, 'label', mp.labels.new(`Какой-то ящик\n~c~Откройте инвентарь, чтобы посмотреть, что там`, new mp.Vector3(position[0], position[1], position[2]), {
	            los: false,
	            font: 0,
	            drawDistance: 4,
	            dimension: dimension
	        }))
		}

		const items = STORAGE.get('drop', id, 'items')

		item.dropID = id
		item.hash = random.textNumber(32)

		items.push(item)
		STORAGE.set('drop', id, 'items', items)

		logger.log('', item.dropID)
	}
	sys_drop.delete = (id, item) => {
		logger.log('', id)
		if(!STORAGE.get('drop', id, 'status') || item.hash === undefined)return

		const items = STORAGE.get('drop', id, 'items')
		items.map((l, i) => {
			if(l.hash === item.hash) items.splice(i, 1)
		})

		logger.log('items', items)
		if(!items.length) {
			const object = STORAGE.get('drop', id, 'object')
			const label = STORAGE.get('drop', id, 'label')

			mp.objects.forEach(item => {
				if(item.id === STORAGE.get('drop', id, 'object').id) item.destroy()
			})
			mp.labels.forEach(item => {
				if(item.id === STORAGE.get('drop', id, 'label').id) item.destroy()
			})

			STORAGE.delete('drop', id)
		}
		else STORAGE.set('drop', id, 'items', items)
	}

	module.exports = sys_drop
}
catch(e) {
	logger.error('systems/drop', e)
}