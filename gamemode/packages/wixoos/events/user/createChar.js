const logger = require('../../_modules/logger')
try {
	const user = require('../../user/index')

	const STORAGE = require('../../_modules/storage')
	const CEF = require('../../_modules/cef')

	const mysql = require('../../_mysql/index')

	const CONFIG_ENUMS = require('../../configs/enums')

	mp.events.add({
		'client::user:createChar:update': (player, data) => {
			if(!STORAGE.get('user', player.id, '_createChar'))return
			data = JSON.parse(data)

			const clothes = data.clothes
			clothes.map((item, i) => {
				let cl = CONFIG_ENUMS.characterCreateClothesList[data.gender][i][item]
				delete cl.name

				if(i === 0) {
					user.setClothes(player, { clothes: {
						props: {
							hat: cl.id
						}
					}, gender: data.gender})
				}
				else user.setClothes(player, { clothes: cl })
			})

			delete data.clothes
			user.resetSkin(player, { viewData: data })
		},
		'client::user:createChar:submit': (player, data) => {
			if(!STORAGE.get('user', player.id, '_createChar'))return
			data = JSON.parse(data)

			const viewData = data.viewData
			const name = data.name

			const clothes = viewData.clothes
			clothes.map((item, i) => {
				let cl = CONFIG_ENUMS.characterCreateClothesList[viewData.gender][i][item]
				delete cl.name

				if(i === 0) {
					user.setClothes(player, { clothes: {
						props: {
							hat: cl.id
						}
					}, gender: viewData.gender, save: true, notSaveMysql: true })
				}
				else user.setClothes(player, { clothes: cl, save: true, notSaveMysql: true })
			})

			delete viewData.clothes

			mysql.query('select id from characters where name = ?', [ JSON.stringify(name) ], (err, res) => {
				if(err)return logger.mysql('client::user:createChar:submit', err)
				if(res.length)return user.notify(player, 'Данное Имя и Фамилию уже кто-то забрал. Попробуй другой вариант', 'error')

				user.loadScreen(player, true)
				mysql.query(`insert into characters (uid, name, viewData, clothes) values (?, ?, ?, ?)`, [ STORAGE.get('user', player.id, 'uid'), JSON.stringify(name), JSON.stringify(viewData), JSON.stringify(STORAGE.get('user', player.id, 'c_clothes')) ], (err, res) => {
					if(err)return logger.mysql('client::user:createChar:submit', err)

					CEF.emit(player, 'client::createChar', 'toggle', { status: false })
					STORAGE.set('user', player.id, 'c_id', res.insertId)

					user.loadCharacter(player)
				})
			})
		},
		'client::user:createChar:changeType': (player, type) => {
			if(!STORAGE.get('user', player.id, '_createChar'))return

			if(type === 4 || type === 5) {
				user.setCameraToPlayer(player, {
                    height: 0.6,
                    dist: 1
                })
			}
			else if(type === 22) {
				user.setCameraToPlayer(player, {
                    height: -0.3
                })
			}
			else if(type === 23) {
				user.setCameraToPlayer(player, {
                    height: -0.6
                })
			}
			else user.setCameraToPlayer(player)
		},
	})
}
catch(e) {
	logger.error('events/user/createChar', e)
}