const logger = require('./client/_modules/logger')
const CEF = require('./client/_modules/cef')

mp.events.add({
	'ui::auth:submitAuth': data => {
		data = JSON.parse(data)

		if(data.login.length < 4 || data.login.length > 32)return CEF.emit('client::auth', 'errorMessage', { id: 'authLogin', message: 'Не верно введен логин' })
		if(data.password.length < 6 || data.password.length > 64)return CEF.emit('client::auth', 'errorMessage', { id: 'authPassword', message: 'Не верно введен пароль' })

		mp.events.callRemote('client::user:auth', data.login, data.password, data.save, data.auto)
	},
	'ui::auth:submitAuthReg': data => {
		data = JSON.parse(data)

		if(data.login.length < 4 || data.login.length > 32)return CEF.emit('client::auth', 'errorMessage', { id: 'authRegLogin', message: 'Допустимая длина логина 4 - 32' })
		if(data.password.length < 6 || data.password.length > 64)return CEF.emit('client::auth', 'errorMessage', { id: 'authRegPassword', message: 'Допустимая длина пароля 6 - 64' })
		if(data.email.length < 6 || data.email.length > 128)return CEF.emit('client::auth', 'errorMessage', { id: 'authRegEmail', message: 'Не верно введен email' })
		if(data.promo.length && data.promo.length > 20)return CEF.emit('client::auth', 'errorMessage', { id: 'authRegPromo', message: 'Не верно введен промокод' })

		mp.events.callRemote('client::user:authReg', data.login, data.password, data.email, data.promo, data.save, data.auto)
	}
})