const express = require('express')
const router = express.Router()
const { deleteNote, updateNote, createNewNote, getAllNotes } = require('../controllers/noteController')
router.route('/')
    .get(getAllNotes)
    .post(createNewNote)
    .patch(updateNote)
    .delete(deleteNote)
module.exports = router