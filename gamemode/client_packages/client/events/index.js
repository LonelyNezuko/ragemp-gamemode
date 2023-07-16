require('./client/events/ui/auth')
require('./client/events/ui/choiceChar')
require('./client/events/ui/createChar')
require('./client/events/ui/hud')
require('./client/events/ui/keypressed')
require('./client/events/ui/menu')
require('./client/events/ui/npcDialog')
require('./client/events/ui/radial')

require('./client/events/user')
// require('./client/events/vehicleSync')

const CEF = require('./client/_modules/cef')
const logger = require('./client/_modules/logger')
const func = require('./client/_modules/func')

const user = require('./client/user/index')

let entity = null


mp.events.add('server::cef', (eventname, cmd, data, log) => CEF.emit(eventname, cmd, data, log))

mp.events.add('render', () => {
	if(user.escStatus === false) mp.game.controls.disableControlAction(32, 200, true)

	mp.game.vehicle.defaultEngineBehaviour = false
	mp.players.local.setConfigFlag(429, true)

	if(mp.players.local.vehicle) {
		const speed = mp.players.local.vehicle.getSpeed() * 3.6
		if(mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle)
		{
			CEF.emit('client::speedometr', 'update', {
                speed: speed > 0.5 ? parseInt(speed) : 0
            }, false)
		}

		// user.vehicleMileage += speed / 25 / 3000
		// if(user.vehicleMileage >= 1)
		// {
		// 	user.vehicleMileage = 0.0
		// 	mp.events.callRemote('client::vehicles:giveMileage', JSON.stringify({
		// 		mileage: 1,
		// 		vehicle: mp.players.local.vehicle
		// 	}))
		// }
	}

	if(!mp.players.local.isInAnyVehicle(false)) {
		entity = func.getLookingAtEntity()
	}

	if(entity) {
		const xy = mp.game.graphics.world3dToScreen2d(entity.position.x, entity.position.y, entity.position.z)
	    if (xy != null && xy.x != null) {
	    	mp.game.graphics.drawText("G", [xy.x, xy.y], { 
				font: 4, 
				color: [255, 255, 255, 255], 
				outline: true
			})
	    }
	}
})


mp.events.add('playerEnterVehicle', (vehicle, seat) => {
	vehicle.setEngineOn(vehicle.getVariable('engine'), vehicle.getVariable('engine'), true)
})
mp.events.add('playerStartEnterVehicle', (vehicle, seat) => {
	vehicle.setEngineOn(vehicle.getVariable('engine'), vehicle.getVariable('engine'), true)
})