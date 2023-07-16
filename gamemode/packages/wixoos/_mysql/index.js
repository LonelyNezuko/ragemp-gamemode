const logger = require('../_modules/logger')
try
{
    let dbhandle = null

    const CONFIG = require('./config.json')
    const mysql2 = require('mysql2')

    module.exports = {
        init: async (callback) =>
        {
            try
            {
                dbhandle = await mysql2.createPool(CONFIG)
                dbhandle.query('set global wait_timeout=172800', [], (err, res) =>
                {
                    if(err)return logger.error('mysql.init', err)
                
                    callback()
                    logger.log('MySQL init: OK!')
                })
            }
            catch(e)
            {
                logger.error('MySQL init: error', e)
            }
        },
        query: (query, args = [], callback = null) =>
        {
            dbhandle.query(query, args, callback)
        }
    }
}
catch(e)
{
    logger.error('mysql.js', e)
}
