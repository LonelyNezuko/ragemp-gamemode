const logger = require('./client/_modules/logger')
const CONFIG_DEFAULT = require('./client/_configs/default')
const CEF = require('./client/_modules/cef')
const func = require('./client/_modules/func')

const user = require('./client/user/index')

require('./client/events/index')

require('./client/_modules/_noclip')

mp.gui.chat.show(false)
mp.game.ui.displayCash(false)
mp.game.ui.displayAmmoThisFrame(false)
mp.game.ui.displayHud(false)
mp.game.gameplay.setFadeOutAfterDeath(false)
mp.game.gameplay.setFadeOutAfterArrest(false)
mp.game.gameplay.setFadeInAfterDeathArrest(false)
mp.game.gameplay.setFadeInAfterLoad(false)
mp.game.audio.startAudioScene("CHARACTER_CHANGE_IN_SKY_SCENE")

mp.game.vehicle.defaultEngineBehaviour = false
mp.players.local.setConfigFlag(429, true)

mp.nametags.enabled = false
mp.game.gxt.set("PM_PAUSE_HDR", CONFIG_DEFAULT.projectName)

mp.game.ui.setRadarZoom(1.0)
mp.game.ui.setRadarBigmapEnabled(false, false)

user.freeze(true)
user.loadScreen(true)
user.cursor(false)

user.setPos(-1815.242431640625, -1203.771484375, 13.01736068725586, -41.2353515625, mp.players.local.id + 1)
user.setCamera(new mp.Vector3(-968.2666625976562, -2435.315185546875, 223.9071044921875), [ -580.9144897460938, -1692.084228515625, 36.439208984375 ])

CEF.init(() => {
    user.toggleHud(false)

    CEF.emit('client::auth', 'toggle', { status: true })
    user.cursor(true)

    if(mp.storage.data.authRemember) CEF.emit('client::auth', 'setData', mp.storage.data.authRemember)
})