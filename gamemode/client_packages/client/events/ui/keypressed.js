const user = require('./client/user/index')
const CEF = require('./client/_modules/cef')

const logger = require('./client/_modules/logger')

mp.events.add({
    "ui::keypressed": data =>
    {
        const temp = JSON.parse(data)
        if(temp.keyCode === 122) {
            user.consoleOpen = user.consoleOpen === false ? true : false
        }

        if(!user.consoleOpen) mp.events.callRemote('client::key', data)
    }
})