const allowedOrigins = require('./allowOrigin')

const corsOptions = { 
    origin : (origin,callback)=>{ 
        if ( allowedOrigins.indexOf(origin)!==-1 || !origin){
            callback(null,true)
        }
        else{
            callback(new Error('not allow by cors'))
        }
    },
    credentials:true,
    optionsSuccessStatus:200
}

module.exports = corsOptions