module.exports = {
	log: (text, ...message) => {
		console.log(`\x1b[32m[ LOG ] \x1b[39m${text}`, message)
	},
	error: (text, ...message) => {
		console.log(`\x1b[31m[ ERROR ] \x1b[39m${text}`, message)
	},
	debug: (text, ...message) => {
		console.log(`\x1b[90m[ DEBUG ] ${text}`, message)
	},
	mysql: (text, ...message) => {
		console.log(`\x1b[5m\x1b[91m[ MYSQL ERROR ] \x1b[39m${text}`, message)
	},
}