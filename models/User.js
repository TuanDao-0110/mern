const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'please provide user name'],
    }, password: {
        type: String,
        required: [true, 'please provide password '],
    },
    // the role now is arr ==> each element is string
    roles: [{
        type: String,
        default: "Employee",
    }], active: {
        type: Boolean,
        default: true,
    },
})

module.exports = mongoose.model('User', userSchema)