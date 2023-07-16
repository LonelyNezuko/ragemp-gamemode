const logger = require('./_modules/logger')
const mysql = require('./_mysql/index')

require('./events/index')
require('./keys/index')
require('./console/index')
require('./chatCommands/index')

mysql.init(() => {
	try {
		const sys_npc = require('./systems/npc')

		const vehicle = require('./property/vehicle')
		vehicle.load()

		sys_npc.create([ -1687.2764892578125, -1050.7886962890625, 13.154928207397461, -131.2069091796875, 0 ], 'testnpc', 'Джордж', 'g_m_m_armboss_01', {
	        desc: 'Тестовый NPC'
	    })
	}
	catch(e) {
		logger.error('init', e)
	}
})