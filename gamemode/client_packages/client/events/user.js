const logger = require('./client/_modules/logger')
const CEF = require('./client/_modules/cef')
const func = require('./client/_modules/func')

const user = require('./client/user/index')

const IS_RADAR_HIDDEN = "0x157F93B036700462"
const IS_RADAR_ENABLED = "0xAF754F20EB5CD51A"

mp.events.add({
	'server::user:cursor': (status, toggleESC) => { user.cursor(status, toggleESC) },
	'server::user:toggleHud': status => { user.toggleHud(status) },
	'server::user:setCamera': (position, atCoord, data) => { user.setCamera(position, atCoord, data) },
	'server::user:destroyCamera': data => { user.destroyCamera(data) },
	'server::user:setCameraToPlayer': data => { user.setCameraToPlayer(data) },
	'server::user:freeze': status => { user.freeze(status) },
	'server::user:loadScreen': (status, duration) => { user.loadScreen(status, duration) },
	'server::user:notify': (text, type, time) => { user.notify(text, type, time) },
	'server::user:updateHud': () => { user.updateHud() },
	'server::user:actionText': (text, key) => { user.actionText(text, key) },
	'server::user:actionTextHide': () => { user.actionTextHide() },

	'server::user:setUID': uid => { user.uid = uid },
	'server::user:setCID': cid => { user.cid = cid },
	'server::user:setAdmin': admin => { user.admin = admin },
	'server::user:setMute': mute => { user.mute = mute },
	'server::user:setKeyBinds': keyBinds => { user.keyBinds = JSON.parse(keyBinds) },
	'server::user:setKeysToggle': keysToggle => { user.keysToggle = keysToggle; user.updateHud() },
	'server::user:setCash': (cash, bankCash) => { user.cash = cash; user.bankCash = bankCash; user.updateHud() },

	'server::user:authDataSave': (login, password, auto) => {
		mp.storage.data.authRemember = {
			login,
			password,
			auto
		}
		mp.storage.flush()
	},
	'server::user:authDataSave:delete': () => {
		delete mp.storage.data.authRemember
		mp.storage.flush()
	},

	'server::user:setVehBelt': status =>
    {
        mp.players.local.setConfigFlag(32, !status)
    },


    'server::user:createPeds': npc =>
    {
        for(var key in npc)
        {
            mp.peds.new(mp.game.joaat(npc[key].model),
                new mp.Vector3(npc[key].position.x, npc[key].position.y, npc[key].position.z),
                npc[key].position.a,
                npc[key].position.vw)
        }
    },


    'server::user:changeMinimap': () => {
    	if(mp.game.invoke(IS_RADAR_ENABLED) && !mp.game.invoke(IS_RADAR_HIDDEN)) {
	    	if(user.minimap === 0) {
	    		mp.game.ui.setRadarZoom(0.0)
				user.minimap = 1
			
	            user.minimapTimer = setTimeout(() => {
	                mp.game.ui.setRadarBigmapEnabled(false, false)
	                mp.game.ui.setRadarZoom(1.0)

	                user.minimap = 0
	                user.minimapTimer = null
	            }, 10000)
	    	}
	    	else if(user.minimap === 1) {
	    		if(user.minimapTimer != null) 
				{	
					clearTimeout(user.minimapTimer)
					user.minimapTimer = null
				}

				mp.game.ui.setRadarBigmapEnabled(true, false)
	            mp.game.ui.setRadarZoom(0.0)

	            user.minimap = 2
	            user.minimapTimer = setTimeout(() => {
	                mp.game.ui.setRadarBigmapEnabled(false, false)
	                mp.game.ui.setRadarZoom(1.0)

	                user.minimap = 0
	                user.minimapTimer = null
	            }, 10000)
	    	}
	    	else {
	    		if(user.minimapTimer != null) 
				{	
					clearTimeout(user.minimapTimer)
					user.minimapTimer = null
				}

				mp.game.ui.setRadarBigmapEnabled(false, false)
				mp.game.ui.setRadarZoom(1.0)

	            user.minimap = 0
	    	}
	    }
    },


    'server::user:actionRadial': () => {
    	const entity = func.getLookingAtEntity()
    	if(entity) {
			const xy = mp.game.graphics.world3dToScreen2d(entity.position.x, entity.position.y, entity.position.z)
		    if(xy != null && xy.x != null) {
		    	mp.events.callRemote('client::user:radial', JSON.stringify(entity))
		    }
		}
    }
})


mp.events.add('render', () => {
	let safeZone = mp.game.graphics.getSafeZoneSize();

	let mapPos = [1 + safeZone, 2 + safeZone]
	let keyPos = [1 + safeZone, 14 + safeZone]

	if(mp.game.invoke(IS_RADAR_ENABLED) && !mp.game.invoke(IS_RADAR_HIDDEN)) {
		mapPos = [16 + safeZone, 2 + safeZone]
		keyPos = [1 + safeZone, 21 + safeZone]
	}
	if(user.minimap === 2) {
		mapPos = [25 + safeZone, 2 + safeZone]
		keyPos = [1 + safeZone, 45 + safeZone]
	}
	
	CEF.emit('client::hud', 'setMap', {
		gps: func.getStreetNames(),
		pos: [`${mapPos[0]}%`, `${mapPos[1]}%`]
	}, false)
	CEF.emit('client::hud', 'setKeysPos', [`${keyPos[0]}%`, `${keyPos[1]}%`], false)
})

mp.events.add("consoleCommand", command => {
    if(command[0] !== '!')return

    const cmd = command.split(' ')[0].replace('!', '')
	const args = command.split(' ').splice(0, 1)

	mp.events.callRemote('client::console', cmd, JSON.stringify(args), command.replace(command.split(' ')[0], ''))
});
