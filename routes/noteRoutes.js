const express = require('express')
const router = express.Router()
const { deleteNote, updateNote, createNewNote, getAllNotes } = require('../controllers/noteController')
const verifyJWT = require('../middleware/verifyJWT')
// with router.use ==> this will apply to all the route inside this router
router.use(verifyJWT)
router.route('/')
    .get(getAllNotes)
    .post(createNewNote)
    .patch(updateNote)
    .delete(deleteNote)
module.exports = router