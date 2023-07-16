const logger = require('./logger')
try
{
    const consoleCMD = {}
    function addConsoleCMD(keyName, keyCode, func)
    {
        if(typeof keyName === 'object')
        {
            for(var i in keyName) consoleCMD[i] = keyName[i]
        }
        else consoleCMD[keyName] = { keyCode, func }
    }

    module.exports = { addConsoleCMD, consoleCMD }
}
catch(e)
{
    logger.error('modules/consoleCMD', e)
}