const logger = require('../../_modules/logger')
try {
	const sha256 = require('js-sha256')
	const user = require('../../user/index')

	const STORAGE = require('../../_modules/storage')
	const CEF = require('../../_modules/cef')

	const mysql = require('../../_mysql/index')

	mp.events.add({
		'client::user:authReg': (player, login, password, email, promo, save, auto) => {
			mysql.query('select uid from accounts where login = ?', [ login ], (err, res) => {
				if(err)return logger.mysql('client::user:authReg', err)
				if(res.length)return CEF.emit(player, 'client::auth', 'errorMessage', { id: 'authRegLogin', message: 'Данный логин уже занят' })

				// Изменить когда будут промокоды
				if(promo.length)return CEF.emit(player, 'client::auth', 'errorMessage', { id: 'authRegPromo', message: 'Промокод не найден' })

				mysql.query('insert into accounts (login, password, email, promo) values (?, ?, ?, ?)', [ login, sha256(password), email, promo ], (err, res) => {
					if(err)return logger.mysql('client::user:authReg', err)

					CEF.emit(player, 'client::auth', 'toggle', { status: false })
					user.loadScreen(player, true)

					STORAGE.set('user', player.id, 'uid', res.insertId)
					user.loadAccount(player)

					if(save) player.call('server::user:authDataSave', [ login, password, auto ])
				})
			})
		},
		'client::user:auth': (player, login, password, save, auto) => {
			mysql.query('select uid, password from accounts where login = ?', [ login ], (err, res) => {
				if(err)return logger.mysql('client::user:auth', err)
				if(!res.length)return CEF.emit(player, 'client::auth', 'errorMessage', { id: 'authLogin', message: 'Аккаунт с таким логином не найден' })

				if(sha256(password) !== res[0]['password'])return CEF.emit(player, 'client::auth', 'errorMessage', { id: 'authPassword', message: 'Не верный пароль' })

				CEF.emit(player, 'client::auth', 'toggle', { status: false })
				STORAGE.set('user', player.id, 'uid', res[0]['uid'])

				user.loadAccount(player)

				if(save === true) player.call('server::user:authDataSave', [ login, password, auto ])
				else player.call('server::user:authDataSave:delete')
			})
		}
	})
}
catch(e) {
	logger.error('events/user/auth', e)
}