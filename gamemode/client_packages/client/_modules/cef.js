const logger = require('./client/_modules/logger')

let browser = null
let cefActive = false

exports = {
    init: (callback) =>
    {
        browser = mp.browsers.new('http://localhost:3000/index.html')
        // browser = mp.browsers.new('package://ui/index.html')
        mp.events.add('browserDomReady', () =>
        {
            cefActive = true
            logger.log('CEF init')

            callback()
        })
    },
    emit: (eventname, cmd, data = {}, log = true) =>
    {
        if(!cefActive)return logger.error('cef not init')

        browser.execute(`window.eventTrigger('${eventname}', '${cmd}', '${JSON.stringify(data)}')`)
        // if(log === true) logger.log(`window.eventTrigger('${eventname}', '${cmd}', '${JSON.stringify(data)}')`)
    }
}