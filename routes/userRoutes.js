const express = require("express")
const router = express.Router()


// get our controller: 

const { deleteUser, getAllUsers, createNewUser, updateUser } = require('../controllers/userController')

const verifyJWT = require('../middleware/verifyJWT')
// with router.use ==> this will apply to all the route inside this router
router.use(verifyJWT)
// create method
router.route('/')
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router