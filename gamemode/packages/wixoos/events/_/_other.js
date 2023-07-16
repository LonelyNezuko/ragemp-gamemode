const logger = require('../../_modules/logger')

try {
	const fs = require('fs')
	const { consoleCMD } = require('../../_modules/console')

	const STORAGE = require('../../_modules/storage')

	const user = require('../../user/index')

	const CONFIG_ENUMS = require('../../configs/enums')

	mp.events.add({
		'client::other:noclip:saveCamCoords': (player, coords, pointDistance, name) => {
			coords = JSON.parse(coords)
			pointAtCoord = JSON.parse(pointDistance)

			if(pointAtCoord === undefined
				|| pointAtCoord === 'undefined') pointAtCoord = {}
			else pointAtCoord = pointAtCoord.position

			fs.appendFile('files/noclip.txt', `${name} --- COORDS: ${coords.x}, ${coords.y}, ${coords.z}; pointAtCoord: ${pointAtCoord.x}, ${pointAtCoord.y}, ${pointAtCoord.z};\r\n`, err =>
	        {
	            if(err) logger.error('client::other:noclip:saveCamCoords', err)
	        });
		},
		'client::other:saveCoords': (player, name) => {
			coords = player.position
			fs.appendFile('files/coords.txt', `${name} --- ${coords.x}, ${coords.y}, ${coords.z}, ${player.heading};\r\n`, err =>
	        {
	            if(err) logger.error('client::other:saveCoords', err)
	        });
		}
	})

	mp.events.add('client::console', (player, cmd, args, textArgs) => {
		if(consoleCMD[cmd]) {
			if(consoleCMD[cmd].settings) {
				if(consoleCMD[cmd].settings.admin
					&& consoleCMD[cmd].settings.admin < user.getAdminLevel(player))return
				if(consoleCMD[cmd].devmode && CONFIG_ENUMS.devMode.indexOf(STORAGE.get('user', player.id, 'login')) === -1)return
			}
			consoleCMD[cmd].func(player, args, textArgs)
		}
	})
}
catch(e) {
	logger.error('events/other', e)
}