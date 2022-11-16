const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const asyncHandler = require('express-async-handler')


// @desc login
// @route POST/auth
// @access Pulic

const login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body
    // check all field done
    if (!username || !password) {
        return res.status(400).json({ msg: 'all field are required' })
    }
    // check user on active or exists
    const foundUser = await User.findOne({ username }).exec()
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ msg: 'unauthorized' })
    }
    // compare pwd 
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
        return res.status(401).json({ msg: 'unauthorized' })
    }
    // send access token 
    const accessToken = jwt.sign(
        // 1st factor for token required ==> by object/string/number type
        {
            "userInfor": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        // 2nd factor for token required ==> secret key
        process.env.ACCESS_TOKEN_SECRET,
        // 3rd option ==> 
        { expiresIn: '15m' }
    )

    const refeshToken = jwt.sign(
        {
            "username": foundUser.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
    // create secure cookie with refesh token ==> this cookie will go along with response when send back to user. 
    res.cookie('jwt', refeshToken, {
        httpOnly: true,
        secure: true,// accessible only by web server
        sameSite: 'none', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry : Convenient option for setting the expiry time relative to the current time in milliseconds.
    })
    // send accessToken containing username and roles ==> 
    res.json({ accessToken })
})

// @desc Refresh
// @route GET/auth/refresh
// @access Pulic -- because access token has expired

const refresh = asyncHandler(async (req, res, next) => {
    // if login success ==> they will have cookie with refresh token
    const cookie = req.cookies
    // in case refresh token ==> if cookie dont have cookie name jwt 
    if (!cookie.jwt) {
        return res.status(401).json({ msg: 'unathorized' })
    }
    // in case we request have cookie name which name jwt 
    // we take that token from cookie
    const refreshToken = cookie.jwt
    jwt.verify(
        // 1. factor is refreshToken from cookie
        refreshToken,
        // 2nd factor is secret key
        process.env.REFRESH_TOKEN_SECRET,
        // 3rd call back function
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ msg: 'Forbidden' })
            const foundUser = await User.findOne({ username: decoded.username }).exec()
            if (!foundUser) {
                return res.status(401).json({ msg: 'unauthorized' })
            }
            // create new token
            const accessToken = jwt.sign(
                {
                    "userInfor": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )
            res.json({ accessToken })
        })
    )
})

// @desc logout
// @route POST/auth/logout
// @access Public just to clear cookie if exists

const logout = asyncHandler(async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) // no Content
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    })
    res.json({ msg: 'Cookie cleared' })
})


module.exports = { login, refresh, logout }