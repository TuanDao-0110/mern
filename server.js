require('dotenv').config()
const express = require('express')
const app = express()
// import connect db vs call connetDB fn ==> to connect to our data base
const connectDB = require('./config/dbConnect')
const mongoose = require("mongoose")
connectDB()
// use path 
const path = require('path')
// add PORT
const PORT = process.env.PORT || 4000
// import cookie parser 
const cookieParser = require('cookie-parser')
// add router 
const router = require('./routes/root')
// import middleware
const { logger, logEvents } = require('./middleware/logger')
app.use(logger)
// imoprt vs use cors ==> allow Cross-origin resource sharing (CORS) is a mechanism that allows restricted
//  resources on a web page to be requested from another domain outside the domain from which the first resource was served.[1]
const cors = require('cors')
const corsOptions = require('./config/corsOption')
app.use(cors(corsOptions))
// import error handler 
const errorHanlder = require('./middleware/errorHandler')
// add this path ==> will help to  this also know as middleware
// so this public folder vs server will be the same folder level
// we can use in both ==> it is the same. 
// app.use('/', express.static(path.resolve(__dirname, 'public')))
app.use(express.static('public'))
// add json to that our server can receive json 
app.use(express.json())
// apply cookie parse as middleware
app.use(cookieParser())
// app.use( logger, express.json(), cookieParser())
app.use('/', router)
// use route user note auth
app.use('/auth',require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes',require('./routes/noteRoutes'))
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        return res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ msg: '404 not found' })
    } else {
        res.type('txt').send('404 not found')
    }
})

app.use(errorHanlder)
// open connection
mongoose.connection.once('open', () => {
    console.log('connect to mongoose db')
    app.listen(PORT, () => {
        console.log(`listening on ${PORT} ...`)
    })
})
// check error on our connection
mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`error : ${err.hostname}\t${err.code}\t${err.syscall}\t`, 'mongoErr.log')

})