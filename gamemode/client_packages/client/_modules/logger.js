const logger = {
	log: (text, save = true) => {
		mp.console.logInfo(`[ LOG ] ${text}`, save, false)
	},
	console: (text, save = true) => {
		mp.console.logInfo(`[ CONSOLE ] ${text}`, save, false)
	},
	error: (text, save) => {
		mp.console.logError(`[ ERROR ] ${text}`, save, false)
	},
	fatal: (text, save) => {
		mp.console.logError(`[ FATAL ERROR ] ${text}`, save, false)
	},

}

exports = logger