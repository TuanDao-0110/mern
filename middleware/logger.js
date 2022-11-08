const { format } = require('date-fns')
// or we can use Common JS syntax
const { v4: uuid } = require('uuid')
// use ES6 syntax
// import { v4 as uuid } from 'uuid';
// 
const fs = require('fs')
const fsPromise = require('fs').promises
const path = require("path")

// this will record all the call request form to our server. 
const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    // console.log('data time ' + dateTime)
    // logItem include = dateitime vs uuid which create specific id ,actual message. 
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            // check that logs folder exist or not ==> if not ==> we created it
            await fsPromise.mkdir(path.join(__dirname, '..', 'logs'))
        }
        // append a new file name logFileName to the logs's folder
        await fsPromise.appendFile(path.join(__dirname, '..', 'logs', logFileName)
            , logItem)
    } catch (err) {
        
        console.log(err)
    }
}
const logger = (req, res, next) => {
    // this could log every request that coming as middleware
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    // help to check request method vs request path
    console.log(` middleware logger middleware\t${req.method} ${req.path}`)
    // next () to next 
    next()
}

module.exports = { logger, logEvents }
