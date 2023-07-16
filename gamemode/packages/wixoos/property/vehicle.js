const logger = require('../_modules/logger')
try {
	const vehicle = {}

    const user = require('../user/index')
    const chat = require('../user/chat')

	const STORAGE = require('../_modules/storage')
    const CEF = require('../_modules/cef')

    const mysql = require('../_mysql/index')

    const CONFIG_VEHICLE = require('../configs/vehicles')

    vehicle.load = () =>
    {
        mysql.query('select * from vehicles', [], (err, res) =>
        {
            if(err)return logger.mysql('vehicle.load', err)

            let veh
            let count = 0

            res.forEach(item =>
            {
                veh = vehicle.add(item.model, [ JSON.parse(item.position).x, JSON.parse(item.position).y, JSON.parse(item.position).z ], {
                    number: item.number,
                    color: JSON.parse(item.color),
                    locked: item.locked,
                    heading: item.heading,
                    fuel: item.fuel,
                    owner: JSON.parse(item.owner),
                    dimension: item.dimension
                })

                if(veh)
                {
                    count ++

                    STORAGE.set('vehicle', veh.id, 'id', item.id)
                    STORAGE.set('vehicle', veh.id, 'save', true)
                }
            })

            logger.log(`[ MYSQL LOAD ] Транспорта загружено: ${res.length}, из них ${count} создано`)
        })
    }
	vehicle.add = (model, position, data = {}) => {
        const config = CONFIG_VEHICLE[model] || CONFIG_VEHICLE.none
        const settingsVeh = {}

        settingsVeh.numberPlate = data.number || 'NONE'
        if(data.color === undefined) data.color = [[ 255, 255, 255 ], [ 255, 255, 255 ]]

        if(data.alpha) settingsVeh.alpha = data.alpha
        settingsVeh.locked = data.locked === undefined ? false : data.locked
        settingsVeh.engine = data.engine === undefined ? false : data.engine
        if(data.heading) settingsVeh.heading = data.heading
        if(data.dimension) settingsVeh.dimension = data.dimension

        const veh = mp.vehicles.new(mp.joaat(model), new mp.Vector3(position[0], position[1], position[2]), settingsVeh)
        STORAGE.delete('vehicle', veh.id)

        veh.setColorRGB(data.color[0][0], data.color[0][1], data.color[0][2], data.color[1][0], data.color[1][1], data.color[1][2])
        veh.setVariable('engine', settingsVeh.engine)

        STORAGE.set('vehicle', veh.id, 'model', model)
        STORAGE.set('vehicle', veh.id, 'name', config.name)

        STORAGE.set('vehicle', veh.id, 'engine', settingsVeh.engine)
        STORAGE.set('vehicle', veh.id, 'locked', settingsVeh.locked)

        STORAGE.set('vehicle', veh.id, 'number', settingsVeh.numberPlate)
        STORAGE.set('vehicle', veh.id, 'color', data.color)

        STORAGE.set('vehicle', veh.id, 'mileage', data.mileage || 0.0)
        STORAGE.set('vehicle', veh.id, 'fuel', data.fuel || config.fuel.spawn)

        STORAGE.set('vehicle', veh.id, 'position', {
            x: position[0],
            y: position[1],
            z: position[2]
        })
        STORAGE.set('vehicle', veh.id, 'heading', data.heading || 0)
        STORAGE.set('vehicle', veh.id, 'dimension', data.dimension || 0)

        STORAGE.set('vehicle', veh.id, 'owner', data.owner || {})
        STORAGE.set('vehicle', veh.id, 'save', data.save || false)

        if(data.save === true)
        {
            mysql.query('insert into vehicles (model, position, heading, dimension, owner, locked, number, color, fuel) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                model,
                JSON.stringify(STORAGE.get('vehicle', veh.id, 'position')),
                STORAGE.get('vehicle', veh.id, 'heading'),
                STORAGE.get('vehicle', veh.id, 'dimension'),
                JSON.stringify(STORAGE.get('vehicle', veh.id, 'owner')),
                STORAGE.get('vehicle', veh.id, 'locked'),
                STORAGE.get('vehicle', veh.id, 'number'),
                JSON.stringify(STORAGE.get('vehicle', veh.id, 'color')),
                STORAGE.get('vehicle', veh.id, 'fuel')
            ], (err, res) =>
            {
                if(err)return logger.error('vehicle.create', err)
                STORAGE.set('vehicle', veh.id, 'id', res.insertId)
            })
        }

        return veh
	}
	vehicle.destroy = veh =>
    {
        veh.destroy()

        if(STORAGE.get('vehicle', veh.id, 'save')) mysql.query('delete from vehicles where id = ?', [ STORAGE.get('vehicle', veh.id, 'id') ])
        STORAGE.delete('vehicle', veh.id)
    }


    vehicle.getOwner = veh => {
        if(!veh)return {}
        return STORAGE.get('vehicle', veh.id, 'owner')
    }
    vehicle.isOwner = (player, veh) => {
        if(!veh)return false
        return true
    }


    vehicle.getObject = vehid => {
        let veh = null
        mp.vehicles.forEach(item => {
            if(item.id === vehid) veh = item
        })

        return veh
    }


    vehicle.getLocked = veh => {
        if(!veh)return true
        return STORAGE.get('vehicle', veh.id, 'locked')
    }
    vehicle.getEngine = veh => {
        if(!veh)return false
        return STORAGE.get('vehicle', veh.id, 'engine')
    }
    vehicle.getFuel = veh => {
        if(!veh)return false
        return STORAGE.get('vehicle', veh.id, 'fuel')   
    }


    vehicle.setEngine = (veh, status) => {
        if(!veh)return

        let errors = 0

        if(status === true
            && vehicle.getFuel(veh) <= 0) errors = 1
        if(status === true
            && veh.engineHealth <= 300) errors = 2

        if(!errors) {
            STORAGE.set('vehicle', veh.id, 'engine', status)

            veh.engine = status
            veh.setVariable('engine', status)

            logger.log('', veh.getVariable('engine'))
        }

        mp.players.forEach(pl =>
        {
            if(user.isLogged(pl) === true
                && pl.vehicle === veh
                && pl.seat === 0)
            {
                if(errors === 1) user.notify(pl, 'В данном транспорте нет топлива. Вызовите механика для заправки', 'error')
                if(errors === 2) user.notify(pl, 'В данном транспорте сломан двигатель. Вызовите механика для его починки', 'error')

                if(!errors) vehicle.updatePlayerData(pl, veh)
            }
        })
    }
    vehicle.setLocked = (veh, status, player = null) =>
    {
        if(!veh)return

        STORAGE.set('vehicle', veh.id, 'locked', status)
        veh.locked = status

        mp.players.forEach(pl =>
        {
            if(user.isLogged(pl) === true
                && pl.vehicle === veh
                && pl.seat === 0) vehicle.updatePlayerData(pl, veh)
        })
    }


    vehicle.updatePlayerData = (player, veh) =>
    {
        if(!veh)return
        const config = CONFIG_VEHICLE[veh.model] || CONFIG_VEHICLE.none

        // let lights = vehicle.getLightsState(1, 1)
        CEF.emit(player, 'client::speedometr', 'update', {
            data: {
                fuel: vehicle.getFuel(veh),
                maxFuel: config.fuel.max,

                belt: STORAGE.get('user', player.id, '_vehBelt'),
                engine: vehicle.getEngine(veh),
                lights: false,
                doors: vehicle.getLocked(veh)
            },
            keys: {
                belt: STORAGE.get('user', player.id, 'keyBinds').beltVehicle.key,
                engine: STORAGE.get('user', player.id, 'keyBinds').engineVehicle.key,
                lights: 'H',
                doors: STORAGE.get('user', player.id, 'keyBinds').lockedVehicle.key
            }
        })
    }



    // Events
    vehicle.onEnter = (player, veh, seat) =>
    {
        if(vehicle.getLocked(veh) === true)return player.removeFromVehicle()

        player.call('server::user:setVehBelt', [ false ])
        STORAGE.set('user', player.id, '_vehBelt', false)

        if(seat === 0)
        {
            vehicle.engine = vehicle.getEngine(veh)

            vehicle.updatePlayerData(player, veh)
            CEF.emit(player, 'client::speedometr', 'toggle', {
                status: true
            })
        }
    }
    vehicle.onExit = (player, vehicle) =>
    {
        CEF.emit(player, 'client::speedometr', 'toggle', {
            status: false
        })

        // if(STORAGE.get('user', player.id, '_plveh'))
        // {
        //     vehicle.destroy(STORAGE.get('user', player.id, '_plveh').id)
        //     STORAGE.clear('user', player.id, '_plveh')
        // }

        if(STORAGE.get('user', player.id, '_vehBelt') === true)
        {
            chat.push(player, 'отстегнул(а) ремень безопастности', 'me')
            player.call('server::user:setVehBelt', [ false ])
        }
    }

    vehicle.radial = (player, vehid) => {
        const veh = vehicle.getObject(vehid)
        if(!veh)return

        user.openRadial(player, 'vehicle', STORAGE.get('vehicle', veh.id, 'name'), [ vehicle.getLocked(veh) ? 'Открыть' : 'Закрыть' ], (player, btn) => {
            if(btn === 'Открыть' || btn === 'Закрыть') {
                if(!vehicle.isOwner(player, veh))return user.notify(player, 'У тебя нет ключей от данного транспорта', 'error')

                chat.push(player, `${user.getName(player)}[${player.id}] ${btn === 'Закрыть' ? 'закрыл(а)' : 'открыл(а)'} транспорт`, 'me')
                user.notify(player, `Транспорт ${btn === 'Закрыть' ? "закрыт" : "открыт"}`)

                vehicle.setLocked(veh, btn === 'Открыть' ? false : true)
                user.hideRadial(player)
            }
        })
    }

	module.exports = vehicle
}
catch(e) {
	logger.error('property/vehicle', e)
}