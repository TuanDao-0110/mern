const express = require("express")
const router = express.Router()

// create method
router.route('/')
    .get((req,res)=> { 
        res.send('user hello')
    })
    .post()
    .patch()
    .delete()

module.exports = router