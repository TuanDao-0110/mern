const express = require('express')
const router = express.Router()
const path = require('path')
// this path will help to route indexhtml in case we can find correct router
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})


module.exports = router