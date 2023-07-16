const logger = require('./logger')
try
{
    const chatCommand = {}
    function addChatCommand(keyName, keyCode, func)
    {
        if(typeof keyName === 'object')
        {
            for(var i in keyName) chatCommand[i] = keyName[i]
        }
        else chatCommand[keyName] = { keyCode, func }
    }

    module.exports = { addChatCommand, chatCommand }
}
catch(e)
{
    logger.error('modules/chatCommand', e)
}