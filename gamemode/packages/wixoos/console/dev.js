const logger = require('../_modules/logger')
try {
	const { addConsoleCMD } = require('../_modules/console')

	const user = require('../user/index')

	addConsoleCMD({
		'createveh': {
			settings: {
				devmode: true
			},
			func: (player, args) => {
				
			}
		}
	})
}
catch(e) {
	logger.error('console/dev', e)
}