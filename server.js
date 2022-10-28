require('dotenv').config()
const express = require('express')
const app = express()
// use path 
const path = require('path')
// add PORT
const PORT = process.env.PORT || 4000
// import cookie parser 
const cookieParser = require('cookie-parser')
// add router 
const router = require('./routes/root')
// import middleware
const { logger } = require('./middleware/logger')
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

app.listen(PORT, () => {
    console.log(`listening on ${PORT} ...`)
})