const logger = require('./logger')
try {
	module.exports = {
		emit: (player, eventname, cmd, data = {}, log = true) => {
			player.call('server::cef', [ eventname, cmd, data, log ])
		}
	}
}
catch(e) {
	logger.error('_modules/cef', e)
}