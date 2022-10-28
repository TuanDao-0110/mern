const mongoose = require('mongoose')
const {logEvents} =require('../middleware/logger')
const connectDB = async()=> { 
    try {
        await mongoose.connect(process.env.DATABASE_URI,{
            // userNewUrlParser: true,
            // where to locate database from clust
            dbName: 'TASK',
            // userFindAndModify: false,
            useUnifiedTopology: true  
        })
        console.log('connect db success ...')
    } catch (err) {
        console.log('connect DB fail....')
    logEvents(`error : ${err.hostname}\t${err.code}\t${err.syscall}\t`, 'mongoErr.log')

    }
}


module.exports = connectDB