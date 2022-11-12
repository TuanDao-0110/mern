const User = require("../models/User")
const Note = require("../models/Node")
// use async handler
const asyncHandler = require('express-async-handler')
// hashing our user password
const bcrypt = require('bcrypt')
const { el } = require("date-fns/locale")
const { findOne, findById } = require("../models/User")
const { use } = require("../routes/userRoutes")


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

const createNewNote = asyncHandler(async (req, res, next) => {
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

    // create and store new user make sure always using await for call API
    const note = await Note.create({
        user, title, text
    })

    if (note) { // Created 
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

})

// @desc Update a note
// @route PATCH /notes
// @access Private

const updateNote = asyncHandler(async (req, res, next) => {
    const { id, user, title, text, completed } = req.body
    // confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ msg: 'all fields are required' })
    }
    // confirm not e exist to updata 
    // id in this case is create at model
    const note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({ msg: 'note not found' })
    }
    // check for duplicate 
    // we have to use lean to remove save option from Note Schema ==> to make sure that our note findbyId is work without any duplication
    const duplicate = await Note.findOne({ title }).lean().exec()
    // Allow renaming of the orgiginal note
    if (duplicate && duplicate._id.toString()) {
        return res.status(409).json({ msg: "Duplicate note title" })
    }
    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()
    res.json(`${updatedNote.title} updated`)
})


// @desc Delete a note
// @route DELETE /notes
// @access Private

const deleteNote = asyncHandler(async (req, res, next) => {
    const { id } = req.body
    // confirm data 
    if (!id) {
        return res.status(400).json({ msg: 'Note Id required' })
    }
    // confirm note exist to delete 
    const note = await findById(id).exec()
    if (!note) {
        return res.status(400).json({ msg: 'Note not found' })
    }
    const successDelete = note.deleteOne()
    if (successDelete) {

        return res.status(200).json({ msg: `Delete success note id :${id}` })
    }
})
module.exports = { deleteNote, updateNote, createNewNote, getAllNotes }
