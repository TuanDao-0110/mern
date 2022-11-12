const User = require("../models/User")
const Note = require("../models/Node")
// use async handler
const asyncHandler = require('express-async-handler')
// hashing our user password
const bcrypt = require('bcrypt')
const { el } = require("date-fns/locale")
const { findOne } = require("../models/User")

// @desc Get all users
// @route GET /users
// @access Private


const getAllUsers = asyncHandler(async (req, res, next) => {
    // password will be exclude 
    const users = await User.find().select('-password').lean()
    if (!users || users?.length == 0) {
        return res.status(400).json({ msg: 'no user found' })
    }
    res.status(200).json({ users })
})

// @desc create new user
// @route POST /user
// @access Private


const createNewUser = asyncHandler(async (req, res, next) => {
    const { userName: username, password, roles } = req.body
    // confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ msg: 'all fields are required' })
    }
    // check for duplicate ==> make sure that no user have same name 
    // use lean ==> make sure that we are not save on this method
    // exec() ==> to make sure it return null in case can not find anything or to use callback function
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ msg: 'duplicate user name' })
    }

    // hash password
    const hashedPWD = await bcrypt.hash(password, 10)
    // defined user object
    const userObject = { username, "password": hashedPWD, roles }
    // Create and store new user
    const user = await User.create(userObject)
    if (user) {
        return res.status(201).json({ msg: `New user ${username} created` })
    } else {
        return res.status(400).json({ msg: 'Invalid user data receive' })
    }
})

// @desc update  user
// @route PATCH /user
// @access Private


const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body
    if (!id || !username || !roles || typeof active !== 'boolean' || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ msg: 'all field are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ msg: 'user not found' })
    }
    // check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    // allow update to origin user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ msg: 'duplicate user name' })
    }
    // now we update it 
    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // hashing password
        user.password = await bcrypt.hash(password, 10)
    }
    // now update it by using save
    const updateUser = await user.save()
    // 
    res.json({ msg: `${username} updated` })
})

// @desc delete  user
// @route DELETE /user
// @access Private


const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ msg: "user id required" })
    }
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ msg: 'user has assigned notes' })
    }
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ msg: `no user have found` })
    }
    const result = await user.deleteOne({})
    const reply = `User name ${result.username} with Id ${result._id} deleted`
    res.json(reply)
})


module.exports = { deleteUser, getAllUsers, createNewUser, updateUser }