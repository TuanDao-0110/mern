const jwt = require("jsonwebtoken")
require('dotenv').config()
const verifyJWT = (req, res, next) => {
    // get reconigze authorization. 
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    const token = authHeader.split(' ')[1]
    // check token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ msg: 'Forbidden' })
            req.user = decoded.userInfor.username;
            req.roles = decoded.userInfor.roles;
            next()
        }
    )
}


module.exports = verifyJWT