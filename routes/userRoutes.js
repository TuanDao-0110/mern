const express = require("express")
const router = express.Router()
// get our controller: 

const { deleteUser, getAllUsers, createNewUser, updateUser } = require('../controllers/userController')
// create method
router.route('/')
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router