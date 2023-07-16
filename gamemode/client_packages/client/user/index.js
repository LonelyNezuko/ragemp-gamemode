const logger = require('./client/_modules/logger')

const user = {}

user.uid = -1
user.cid = -1
user.admin = 0

user.keyBinds = []
user.keysToggle = 1

user.mute = 0

user.consoleOpen = false

user.minimap = 0
user.minimapTimer = null

user.cash = 0
user.bankCash = 0

const CEF = require('./client/_modules/cef')
const func = require('./client/_modules/func')

user.toggleHud = toggle =>
{
    if(toggle === true) user.updateHud()
    CEF.emit('client::hud', 'toggle', {
        status: toggle
    })

    mp.game.ui.displayRadar(toggle)
}
user.updateHud = () => {
    CEF.emit('client::hud', 'setData', {
        online: mp.players.length,
        id: mp.players.local.id,

        accountName: mp.players.local.name,
        accountID: user.cid,

        cash: user.cash,
        bank: user.bankCash,

        needs: [100, 100]
    })
    CEF.emit('client::hud', 'setAccountData', {
        mute: user.mute
    })

    const keyBinds = []
    for(var key in user.keyBinds)
    {
        if(user.keyBinds[key].hudVisible === true) keyBinds.push([ user.keyBinds[key].key, user.keyBinds[key].name ])
    }

    CEF.emit('client::hud', 'setKeys', keyBinds)
    CEF.emit('client::hud', 'setKeysToggle', { status: user.keysToggle })
}


user.camera = null
user.setCamera = (position, atCoord, data = {}) =>
{
	if(user.camera) user.destroyCamera()

	user.camera = mp.cameras.new('default', position, new mp.Vector3(0, 0, 0), data.fov ? data.fov : 40)
	user.camera.pointAtCoord(atCoord[0], atCoord[1], atCoord[2])

	user.camera.setActive(true)
	if(data.render === undefined
        || data.render === true) mp.game.cam.renderScriptCams(true, data.ease ? true : false, data.ease ? data.ease : 0, false, false)

    user.toggleHud(false)
}
user.destroyCamera = (data = {}) =>
{
    if(!user.camera)return
    if(!data.renderDisable || data.renderDisable === false) mp.game.cam.renderScriptCams(false, data.ease ? true : false, data.ease ? data.ease : 0, false, false)

    user.camera.destroy()
    user.camera = null

    user.toggleHud(true)
}
user.setCameraToPlayer = (data = {}) =>
{
    const playerPosition = mp.players.local.position
    const cameraPosition = func.getCameraOffset(new mp.Vector3(playerPosition.x, playerPosition.y, playerPosition.z + (data.height || 0.5)), mp.players.local.getHeading() + (data.angle || 90), data.dist || 1.5)

    user.setCamera([ cameraPosition.x, cameraPosition.y, cameraPosition.z ], [ playerPosition.x, playerPosition.y, playerPosition.z + (data.height || 0.5)], {
        ease: data.ease
    })
}



user.cursorStatus = false
user.escStatus = true
user.escStatusTimer = null

user.cursor = (toggle, toggleESC = false) =>
{
    mp.gui.cursor.show(toggle, toggle)
    user.cursorStatus = toggle

    if(toggleESC === true)
    {
        if(user.escStatusTimer) clearTimeout(user.escStatusTimer)
        user.escStatus = false

        user.escStatusTimer = setTimeout(() =>
        {
            user.escStatus = true

            clearTimeout(user.escStatusTimer)
            user.escStatusTimer = null
        }, 1500)
    }
}


user.setDimension = dimension =>
{
    mp.events.callRemote('client::user:setDimension', dimension)
}
user.loadScreen = (toggle, duration = 500) =>
{
    user.toggleHud(!toggle)
    toggle ? mp.game.cam.doScreenFadeOut(duration) : mp.game.cam.doScreenFadeIn(duration)
}

user.freeze = status =>
{
    mp.players.local.freezePosition(status)
}


user.setPos = (x, y, z, a = -1, dimension) =>
{
    mp.events.callRemote('client::user:setPos', x, y, z, a, dimension)
}


user.notify = (text, type = 'info', time = 5000) => {
    CEF.emit('client::notify', 'add', {
        text,
        type,
        time
    })
}


user.actionText = (text, key) => {
    CEF.emit('client::hud', 'setAction', {
        key: key || user.keyBinds.action.key,
        text
    })
}
user.actionTextHide = () => {
    CEF.emit('client::hud', 'setAction', {
        key: 'E',
        text: ''
    })
}


user.removeOpened = name => {
    mp.events.callRemote('client::user:removeOpened', name)
}
user.addOpened = name => {
    mp.events.callRemote('client::user:addOpened', name)
}


exports = user