const logger = require('./logger')
try
{
    const STORAGE = {}
    STORAGE.data = {
        user: {},
        vehicle: {},
        npc: {},
        drop: {}
    }

    STORAGE.has = (type, id, key) =>
    {
        if(STORAGE.data[type][id] === undefined
            || STORAGE.data[type][id][key] === undefined)return false

        return true
    }
    //
    STORAGE.get = (type, id, key) =>
    {
        if(!STORAGE.has(type, id, key))return null
        return STORAGE.data[type][id][key]
    }
    STORAGE.set = (type, id, key, value) =>
    {
        try
        {
            if(!STORAGE.data[type][id]) STORAGE.data[type][id] = {}
            STORAGE.data[type][id][key] = value

            return STORAGE.data[type][id][key]
        }
        catch(e)
        {
            logger.error('STORAGE.set', e)
        }

        return true
    }
    STORAGE.delete = (type, id) =>
    {
        delete STORAGE.data[type][id]
    }
    STORAGE.clear = (type, id, key) =>
    {
        if(STORAGE.has(type, id, key)) delete STORAGE.data[type][id][key]
    }
    STORAGE.getAll = (type, id) =>
    {
        if(!STORAGE.data[type][id])return null
        return STORAGE.data[type][id]
    }
    STORAGE.deleteAll = type =>
    {
        STORAGE.data[type] = {}
    }
    STORAGE.free = type =>
    {
        let freeID
        for(var key in STORAGE.all(type))
        {
            if(!STORAGE.data[type][parseInt(key) + 1]
                && freeID === undefined) freeID = parseInt(key) + 1
        }

        if(freeID === undefined) freeID = 0
        return freeID
    }
    STORAGE.all = type =>
    {
        return STORAGE.data[type]
    }

    module.exports = STORAGE
}
catch(e)
{
    logger.error('STORAGE.js', e)
}
