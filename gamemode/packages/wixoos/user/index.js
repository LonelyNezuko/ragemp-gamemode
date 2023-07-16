const logger = require('../_modules/logger')
try {
	const user = {}
	const chat = require('./chat')

	const STORAGE = require('../_modules/storage')
	const func = require('../_modules/func')
	const CEF = require('../_modules/cef')

	const mysql = require('../_mysql/index')

	const CONFIG_USER = require('../configs/user')
	const CONFIG_SPAWN = require('../configs/spawn')
	const CONFIG_ENUMS = require('../configs/enums')
	const CONFIG_ADMIN = require('../configs/admin')
	const CONFIG_INVENTORY = require('../configs/inventory')

	user.isLogged = player => {
		return STORAGE.get('user', player.id, 'logged')
	}
	user.kick = (player, reason) => {
		player.kick()
		// тут место логам
	}

	user.spawn = player => {
		if(!user.isLogged(player))return

		user.setCash(player, STORAGE.get('user', player.id, 'c_cash'))
		user.setCash(player, STORAGE.get('user', player.id, 'c_bankCash'), 1)

		user.resetSkin(player)
		user.setClothes(player)

		user.freeze(player, false)
        user.setPos(player, CONFIG_SPAWN[0][0], CONFIG_SPAWN[0][1], CONFIG_SPAWN[0][2], CONFIG_SPAWN[0][3], CONFIG_SPAWN[0][4])

        player.health = 100
        player.armour = 0

        player.clearDecorations()
        player.stopAnimation()

        user.cursor(player, false)
        user.toggleHud(player, true)
        user.destroyCamera(player)

        user.loadScreen(player, false)
	}


	user.loadAccount = player => {
		if(user.isLogged(player) === true)return
		mysql.query('select * from accounts where uid = ?', [ STORAGE.get('user', player.id, 'uid') ], (err, res) => {
			if(err)return logger.mysql('user.loadAccount', err)
			if(!res.length)return user.kick(player)

			CONFIG_USER.accountData.map(item => STORAGE.set('user', player.id, item, func.isJSON(res[0][item]) ? JSON.parse(res[0][item]) : res[0][item]))

			const keyssettings = JSON.parse(res[0]['keyBinds'])
            for(var key in CONFIG_ENUMS.keysSettings)
            {
                if(keyssettings[key] === undefined) keyssettings[key] = CONFIG_ENUMS.keysSettings[key]
            }
            STORAGE.set('user', player.id, 'keyBinds', keyssettings)

			player.name = STORAGE.get('user', player.id, 'login')

			player.call('server::user:setUID', [ STORAGE.get('user', player.id, 'uid') ])
			player.call('server::user:setAdmin', [ STORAGE.get('user', player.id, 'admin') ])
			player.call('server::user:setKeyBinds', [ JSON.stringify(STORAGE.get('user', player.id, 'keyBinds')) ])

			STORAGE.set('user', player.id, 'openeds', {})
			STORAGE.set('user', player.id, 'nears', {})

			STORAGE.set('user', player.id, 'npcDialogTrigger', null)
			STORAGE.set('user', player.id, 'radialTrigger', null)

			// здесь логи
			user.choiceCharacter(player)
		})
	}
	user.loadCharacter = player => {
		if(user.isLogged(player) === true)return
		mysql.query('select * from characters where id = ?', [ STORAGE.get('user', player.id, 'c_id') ], (err, res) => {
			try {
				if(err)return logger.mysql('user.loadCharacter', err)
				if(!res.length)return user.choiceCharacter(player)

				CONFIG_USER.characterData.map(item => STORAGE.set('user', player.id, 'c_' + item, func.isJSON(res[0][item]) ? JSON.parse(res[0][item]) : res[0][item]))
				STORAGE.set('user', player.id, 'logged', true)

				player.name = STORAGE.get('user', player.id, 'c_name')[0] + ' ' + STORAGE.get('user', player.id, 'c_name')[1]

				if(!STORAGE.get('user', player.id, 'c_inv').length) STORAGE.set('user', player.id, 'c_inv', new Array(60).fill([]))
				if(!STORAGE.get('user', player.id, 'c_invBackpack').length) STORAGE.set('user', player.id, 'c_invBackpack', new Array(40).fill([]))

				let itemsInv = STORAGE.get('user', player.id, 'c_inv')
				itemsInv.map((item, i) => {
					if(item.id) {
						CONFIG_INVENTORY.map(inv => {
							if(inv.id === item.id) {
								for(var key in inv) {
									if(item[key] === undefined) itemsInv[i][key] = inv[key]
								}
							}
						})
					}
				})
				STORAGE.set('user', player.id, 'c_inv', itemsInv)

				itemsInv = STORAGE.get('user', player.id, 'c_invBackpack')
				itemsInv.map((item, i) => {
					if(item.id) {
						CONFIG_INVENTORY.map(inv => {
							if(inv.id === item.id) {
								for(var key in inv) {
									if(item[key] === undefined) itemsInv[i][key] = inv[key]
								}
							}
						})
					}
				})
				STORAGE.set('user', player.id, 'c_invBackpack', itemsInv)

				player.call('server::user:setCID', [ STORAGE.get('user', player.id, 'c_id') ])
				player.call('server::user:setMute', [ STORAGE.get('user', player.id, 'c_mute') ])
				player.call('server::user:setKeysToggle', [ STORAGE.get('user', player.id, 'c_keysToggle') ])

				player.call('server::user:createPeds', [ STORAGE.all('npc') ])

				// здесь логи

				CEF.emit(player, 'client::choiceChar', 'toggle', { status: false })
				user.spawn(player)

				chat.push(player, `Рады видеть тебя на ${CONFIG_ENUMS.projectName}`)
				if(user.getAdminLevel(player) > 0) chat.push(player, `Ты вошел как ${user.getAdminName(player)}`, 'system')
			}
			catch(e) {
				logger.error('user.loadCharacter', e)
			}
		})
	}
	user.choiceCharacter = player => {
		if(user.isLogged(player) === true)return

		user.setPos(player, -1815.242431640625, -1203.771484375, 13.01736068725586, -41.2353515625, player.id + 1)
		user.setCamera(player, new mp.Vector3(-968.2666625976562, -2435.315185546875, 223.9071044921875), [ -580.9144897460938, -1692.084228515625, 36.439208984375 ])

		mysql.query(`select id, name, cash, bankCash from characters where uid = ?`, [ STORAGE.get('user', player.id, 'uid') ], (err, res) => {
			if(err)return logger.mysql('user.choiceCharacter', err)

			const characters = []
			for(let i = 0; i < 3; i ++) {
				if(!res[i]) characters[i] = {}
				else characters[i] = {
					name: JSON.parse(res[i]['name'])[0] + ' ' + JSON.parse(res[i]['name'])[1],
					id: res[i]['id'],
					level: 1,

					data: {
						cash: res[i]['cash'],
						bank: res[i]['bankCash'],
						fraction: 'Неимеется',
						family: 'Неимеется'
					}
				}
			}
			characters[2] = { donate: true }

			user.cursor(player, true)

			CEF.emit(player, 'client::choiceChar', 'setCharacters', characters)
			CEF.emit(player, 'client::choiceChar', 'toggle', { status: true })
		})
	}
	user.save = player =>
	{
		if(!user.isLogged(player))return

        try
        {
    		let query = 'update characters set '
    		const args = []

    		// Сохранение персонажа
    		CONFIG_USER.characterData.forEach((item, i) =>
    		{
                if(item !== 'id' && item !== 'uid' && item !== 'createDate')
                {
        			query += `${item} = ?`
        			if(item === 'createDate')
        			{
        				let date = new Date(STORAGE.get('user', player.id, 'c_' + item))
        				args.push(moment(date).format('YYYY-MM-DD hh:mm:ss'))
        			}
        			else
        			{
        				if(typeof STORAGE.get('user', player.id, 'c_' + item) === 'object') args.push(JSON.stringify(STORAGE.get('user', player.id, 'c_' + item)).replace("\\", ""))
        				else if(typeof STORAGE.get('user', player.id, 'c_' + item) === 'string') args.push(STORAGE.get('user', player.id, 'c_' + item).replace('"', ''))
        				else args.push(STORAGE.get('user', player.id, 'c_' + item))
        			}

                    if(i === CONFIG_USER.characterData.length - 1) query += ' '
                    else query += ', '
                }
    		})

    		query += `where id = ?`
            args.push(STORAGE.get('user', player.id, 'c_id'))

    		// logger.log('user.save', {
    		// 	message: query,
    		// 	args: args
    		// })
    		mysql.query(query, args, err =>
    		{
    			if(err)return logger.error('user.save', err)
    		})

    		// Сохранение аккаута
    		mysql.query(`update accounts set login = ?, password = ?, email = ?, promo = ?, admin = ?, adminData = ?, keyBinds = ? where uid = ?`, [
    			STORAGE.get('user', player.id, 'login'),
    			STORAGE.get('user', player.id, 'password'),
    			STORAGE.get('user', player.id, 'email'),
    			STORAGE.get('user', player.id, 'promo'),
                STORAGE.get('user', player.id, 'admin'),
                JSON.stringify(STORAGE.get('user', player.id, 'adminData')),
                JSON.stringify(STORAGE.get('user', player.id, 'keyBinds')),
    			STORAGE.get('user', player.id, 'uid')
    		], err =>
    		{
    			if(err)return logger.error('user.save', err)
    		})
        }
        catch(e)
        {
            logger.error('user.save', e)
        }
	}


	user.setDimension = (player, dimension) =>
	{
	    player.dimension = dimension || 0
	}
	user.freeze = (player, status) => player.call('server::user:freeze', [ status ])
	user.setPos = (player, x, y, z, a = -1, dimension) =>
	{
	    player.position = new mp.Vector3(x, y, z)
	    player.heading = a
	    player.dimension = dimension || 0
	}
	user.cursor = (player, status, toggleESC = false) => player.call('server::user:cursor', [ status, toggleESC ])
	user.toggleHud = (player, status) => player.call('server::user:toggleHud', [ status ])
	user.setCamera = (player, position, atCoord, data = {}) => player.call('server::user:setCamera', [ position, atCoord, data ])
	user.destroyCamera = (player, data = {}) => player.call('server::user:destroyCamera', [ data ])
	user.setCameraToPlayer = (player, data = {}) => player.call('server::user:setCameraToPlayer', [ data ])
	user.loadScreen = (player, status, duration = 500) => player.call('server::user:loadScreen', [ status, duration ])
	user.notify = (player, text, type = 'info', time = 5000) => player.call('server::user:notify', [ text, type, time ])
	user.updateHud = (player) => player.call('server::user:updateHud')


	user.resetSkin = (player, data = {}) =>
	{
		let viewData = STORAGE.get('user', player.id, 'c_viewData')

		if(data.viewData) viewData = data.viewData
		if(!viewData) viewData = CONFIG_USER.viewDataDefault

        player.setCustomization(viewData.gender === 0 ? true : false,
            viewData.genetic.mother,
			viewData.genetic.father,
			0,

            viewData.genetic.mother,
            viewData.genetic.father,
            0,

            viewData.genetic.similarity,
            viewData.genetic.skinTone,
            0,

            viewData.appearance[0],
            viewData.hair.head_color,

            0,
            viewData.face
        )
        player.setClothes(2, viewData.hair.head, 0, 0) // Волосы на голове

        player.setHeadOverlay(1, [ viewData.hair.beard, !viewData.hair.beard ? 0.0 : 100.0, viewData.hair.beard_color, viewData.hair.beard_color ]) // Волосы на лице
        player.setHeadOverlay(2, [ viewData.hair.eyebrow, !viewData.hair.eyebrow ? 0.0 : 100.0, viewData.hair.eyebrow_color, viewData.hair.eyebrow_color ]) // Брови
        player.setHeadOverlay(10, [ viewData.hair.breast, !viewData.hair.breast ? 0.0 : 100.0, viewData.hair.breast_color, viewData.hair.breast_color ]) // Волосы на теле

        player.setHeadOverlay(0, [ viewData.appearance[1], !viewData.appearance[1] ? 0 : 100.0, 0, 0 ]) // Пятна на лице
        player.setHeadOverlay(3, [ viewData.appearance[2], !viewData.appearance[2] ? 0 : 100.0, 0, 0 ]) // Старение
        player.setHeadOverlay(6, [ viewData.appearance[3], !viewData.appearance[3] ? 0 : 100.0, 0, 0 ]) // Цвет лица
        player.setHeadOverlay(7, [ viewData.appearance[4], !viewData.appearance[4] ? 0 : 100.0, 0, 0 ]) // Повреждения кожи
        player.setHeadOverlay(8, [ viewData.appearance[5], !viewData.appearance[5] ? 0.0 : 100.0, viewData.appearance[6], 0 ]) // Губная помада (цвет помады)
        player.setHeadOverlay(9, [ viewData.appearance[7], !viewData.appearance[7] ? 0 : 100.0, 0, 0 ]) // Родинки
        player.setHeadOverlay(11, [ viewData.appearance[8], !viewData.appearance[8] ? 0 : 100.0, 0, 0 ]) // Пятна на теле
	}
	user.setClothes = (player, data = {}) =>
	{
		let clothes = STORAGE.get('user', player.id, 'c_clothes')

		let gender = user.getGender(player)
		if(data.gender) gender = data.gender

		if(data.clothes) clothes = data.clothes
		if(!clothes) clothes = CONFIG_ENUMS.clothesDefault[gender]

		const clearedProp = [
			{
                hat: 8,
                glasess: 6,
                ears: 6,
                watch: 2,
                bracelet: 9
            },
            {
                hat: 120,
                glasess: 5,
                ears: 12,
                watch: 1,
                bracelet: 16
            }
		]

        for(var key in clothes) {
        	if(key === 'props') {
        		for(var key in clothes.props) {
        			if(clothes.props[key] === -1) {
        				player.setProp(CONFIG_ENUMS.clothesComponentID.props[key], clearedProp[gender][key], 0)
        			}
        			else player.setProp(CONFIG_ENUMS.clothesComponentID.props[key], clothes.props[key], 0)
        		}
        	}
        	else player.setClothes(CONFIG_ENUMS.clothesComponentID[key], clothes[key], 0, 0)
        }

		if(data.save)
		{
			let saveClothes = STORAGE.get('user', player.id, 'c_clothes')
			if(!saveClothes) saveClothes = CONFIG_ENUMS.clothesDefault[gender]

			for(var key in clothes) {
				if(key === 'props') {
					for(var key in clothes.props) saveClothes.props[key] = clothes.props[key]
				}
				else saveClothes[key] = clothes[key]
			}

			STORAGE.set('user', player.id, 'c_clothes', saveClothes)
			if(!data.notSaveMysql) user.save(player)
		}
	}


	user.getGender = player => {
		const viewData = STORAGE.get('user', player.id, 'c_viewData')

		if(!viewData)return 0
		return viewData.gender || 0
	}
	user.getName = player => {
		return STORAGE.get('user', player.id, 'c_name')[0] + ' ' + STORAGE.get('user', player.id, 'c_name')[1]
	}
	user.getLogin = player => {
		return STORAGE.get('user', player.id, 'login')
	}


	user.getOpened = player =>
    {
        return STORAGE.get('user', player.id, 'openeds')
    }
    user.isOpened = (player, name) =>
    {
        return STORAGE.get('user', player.id, 'openeds')[name]
    }
    user.isOnFoot = player =>
    {
        if(STORAGE.get('user', player.id, '_death') === true)return false
        return JSON.stringify(STORAGE.get('user', player.id, 'openeds')) === '{}'
    }
    user.addOpened = (player, name) =>
    {
        const openeds = STORAGE.get('user', player.id, 'openeds')

        openeds[name] = true
        STORAGE.set('user', player.id, 'openeds', openeds)
    }
    user.removeOpened = (player, name) =>
    {
        const openeds = STORAGE.get('user', player.id, 'openeds')

        delete openeds[name]
        STORAGE.set('user', player.id, 'openeds', openeds)
    }



	user.isAdmin = player => {
		if(STORAGE.get('user', player.id, 'admin') > 0)return true
		return false
	}
	user.getAdminLevel = player => {
		return STORAGE.get('user', player.id, 'admin')
	}
	user.getAdminName = player => {
		return CONFIG_ADMIN.levelName[user.getAdminLevel(player)]
	}


	user.isMute = player => {
		return STORAGE.get('user', player.id, 'c_mute')
	}



	// Inventory
	user.inventory = {
		add: (player, id, count = 1, settings = {}) => {
			if(!user.isLogged(player))return

			let messageItem = {}
			let messageCount = count

			while(count > 0) {
				const items = STORAGE.get('user', player.id, 'c_inv')

				let item = {}
				let slot = -1
				let status = false

				items.map((i, s) => {
					if(i.id && !status
						&& i.id === id
						&& i.count < i.maxCount) {
						item = i
						slot = s

						status = true
					}
				})

				if(!status) {
					CONFIG_INVENTORY.map(i => {						
						if(i.id === id && !status) {
							item = i
							status = true
						}
					})
				}
				if(!status)
				{
					count = 0
					return user.notify(player, `ERROR INVENTORY ADD: Предмет не найден`, 'error')
				}

				if(item.count === undefined) item.count = 0
				if(item.status === undefined) item.status = 100

				messageItem = item

				if(count + item.count < item.maxCount) {
					item.count += count
					count = 0
				}
				else {
					if(slot !== -1) count -= item.maxCount - item.count
					else count -= item.maxCount

					item.count = item.maxCount
				}

				if(slot === -1) {
					status = false
					items.map((i, s) => {
						if(!i.id && !status) {
							slot = s
							status = true
						}
					})
				}
				if(slot === -1)
				{
					count = 0
					return user.notify(player, `В Вашем инвентаре нет места для нового предмета`, 'error') // добавить выброс предмета на землю
				}

				items[slot] = item
				STORAGE.set('user', player.id, 'c_inv', items)
			}

			user.save(player)
			if(!settings.notMessage) user.notify(player, `В Ваш инвентарь был добавлен новый предмет: ${messageItem.name} [${messageCount}]`)
		},
		remove: (player, id, count = 1, settings = {}) => {
			if(!user.isLogged(player))return

			while(count > 0) {
				const items = STORAGE.get('user', player.id, 'c_inv')

				let item = {}
				let slot = -1
				let status = false

				items.map((i, s) => {
					if(i.id && !status
						&& i.id === id) {
						item = i
						slot = s

						status = true
					}
				})
				if(!status) {
					count = 0
					return
				}

				if(item.count - count > 0) {
					item.count -= count
					count = 0
				}
				else {
					count = count - item.count
					item = {}
				}

				items[slot] = item
				STORAGE.set('user', player.id, 'c_inv', items)
			}
		},

		hasSlot: (player, type, slot) => {
			if(!user.isLogged(player))return false

			if(STORAGE.get('user', player.id, `c_inv${type}`)[slot].id)return true
			return false
		},

		updateUI: player => {
			if(!user.isLogged(player)
				|| !user.isOpened(player, 'menu'))return

			let nearby = []
			const drops = STORAGE.all('drop')

			for(var key in drops) {
				if(func.distance2D(player.position, { x: drops[key].position[0], y: drops[key].position[1], z: drops[key].position[2] }) <= 2) {
					nearby = drops[key].items
				}
			}
			CEF.emit(player, 'client::menu:inventory', 'setItems', {
				items: STORAGE.get('user', player.id, 'c_inv'),
				backpack: STORAGE.get('user', player.id, 'c_invBackpack'),
				nearby: nearby
			})
			CEF.emit(player, 'client::menu:inventory', 'setData', {
				main: {
					weight: 15
				},
				backpack: {
					weight: 15
				}
			})
		}
	}



	user.setNear = (player, nearName, nearData) =>
	{
		if(!user.isLogged(player))return

		const nears = user.getNears(player)

		nears[nearName] = nearData
		STORAGE.set('user', player.id, 'nears', nears)
	}
	user.removeNear = (player, nearName) =>
	{
		if(!user.isLogged(player))return

		const nears = user.getNears(player)
        if(nears[nearName] !== undefined)
        {
    		delete nears[nearName]
    		STORAGE.set('user', player.id, 'nears', nears)
        }
	}
	user.getNears = player =>
	{
		if(!user.isLogged(player))return {}
		return STORAGE.get('user', player.id, 'nears')
	}


	user.actionText = (player, text, key) => {
		player.call('server::user:actionText', [ text, key ])
	}
	user.actionTextHide = player => {
		player.call('server::user:actionTextHide')
	}


	user.npcDialog = (player, name, desc, text, btn = [], trigger = null) =>
	{
	    CEF.emit(player, 'client::npcDialog', 'setData', {
	        name, desc, text, btn
	    })
	    CEF.emit(player, 'client::npcDialog', 'toggle', {
	        status: true
	    })

	    user.cursor(player, true)
	    user.toggleHud(player, false)

	    STORAGE.set('user', player.id, 'npcDialogTrigger', trigger)
	    user.addOpened(player, 'npcDialog')
	}
	user.npcDialogHide = player =>
	{
	    CEF.emit(player, 'client::npcDialog', 'toggle', {
	        status: false
	    })

	    user.cursor(player, false)
	    user.toggleHud(player, true)

	    STORAGE.set('user', player.id, 'npcDialogTrigger', null)
	    user.removeOpened(player, 'npcDialog')
	}


	user.setCash = (player, cash, type = 0) => {
		if(!user.isLogged(player))return

		if(!type) STORAGE.set('user', player.id, 'c_cash', parseInt(cash))
		else STORAGE.set('user', player.id, 'c_bankCash', parseInt(cash))

		user.save(player)
		player.call('server::user:setCash', [ STORAGE.get('user', player.id, 'c_cash'), STORAGE.get('user', player.id, 'c_bankCash') ])
	}
	user.giveCash = (player, cash, type = 0) => {
		if(!user.isLogged(player))return

		if(!type) STORAGE.set('user', player.id, 'c_cash', STORAGE.get('user', player.id, 'c_cash') + parseInt(cash))
		else STORAGE.set('user', player.id, 'c_bankCash', STORAGE.get('user', player.id, 'c_bankCash') + parseInt(cash))

		user.save(player)
		player.call('server::user:setCash', [ STORAGE.get('user', player.id, 'c_cash'), STORAGE.get('user', player.id, 'c_bankCash') ])
	}


	user.openRadial = (player, type, name, btn, trigger = null) => {
		CEF.emit(player, 'client::radial', 'setData', {
            type,
            name,
            btn
        })
        
        user.addOpened(player, 'radial')
        user.cursor(player, true)

        STORAGE.set('user', player.id, 'radialTrigger', trigger)
	}
	user.hideRadial = player => {
		CEF.emit(player, 'client::radial', 'setData', {
            type: '',
            name: '',
            btn: []
        })

        user.removeOpened(player, 'radial')
        user.cursor(player, false, true)

        STORAGE.set('user', player.id, 'radialTrigger', null)
	}

	module.exports = user
}
catch(e) {
	logger.error('user/index', e)
}