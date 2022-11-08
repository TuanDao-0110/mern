const User = require("../models/User")
const Note = require("../models/Node")
// use async handler
const asyncHandler = require('express-async-handler')
// hashing our user password
const bcrypt = require('bcrypt')
const { el } = require("date-fns/locale")
const { findOne } = require("../models/User")


// @desc Get all notes 
// @route GET /notes
// @access Private

const getAllNotes = asyncHandler(async (req, res, next) => {
    const notes = await Note.find().lean()
    if (!notes?.length) {
        return res.status(400).json({ msg: 'No note found' })
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})


// @desc Create new note
// @route POST /notes
// @access Private

const createNewNote = asyncHandler(async (res, req, next) => {
    const { user, title, text } = req.body
    //  confirm data: 
    if (!user || !title || !text) {
        return res.status(400).json({ msg: "All fields are reuired" })
    }
    // check for duplicate title 
    // lean() to make sure that will return a plain object 
    // 
    const duplicate = await Note.findOne({ title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ msg: 'Duplicate note title' })
    }

    // create and store new user
    const note = Note.create({
        user, title, text
    })

    if (note) {
        return res.status(201).json({ msg: 'new note created' })
    }
    return res.status(400).json({ msg: 'invalid note data received' })
})