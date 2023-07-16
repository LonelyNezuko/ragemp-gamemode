window.eventManager = {}
window.eventTrigger = (eventname, cmd, params = '{}') =>
{
    if(typeof params !== 'object') params = JSON.parse(params)

    if(window.eventManager[eventname]) window.eventManager[eventname](cmd, params)
    else console.error(`event ${eventname} notfound`)

    console.log(`event trigger: ${eventname} - cmd: ${cmd}`, params)
}

let sendTime = 0
const ragemp =
{
    eventCreate: (eventname, callback) =>
    {
        window.eventManager[eventname] = callback
    },
    send: (eventname, params = {}, noTime = false) =>
    {
        if(sendTime > +new Date()
            && !noTime)return

        if(global.mp) global.mp.trigger(eventname, JSON.stringify(params))
        console.log(`event send: ${eventname}`, params)

        if(!noTime) sendTime = +new Date() + 700
    },
    trigger: (eventname, cmd, params) => {
        window.eventManager[eventname](cmd, params)
    }
}

export default ragemp