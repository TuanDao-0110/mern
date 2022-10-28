const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
    {
    user: {
        // it help to auto generate
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // this will refer to specific user schema that we create
        ref: 'User'
    }, title: {
        type: String,
        required: true,
    },
    // the role now is arr ==> each element is string
    text: {
        type: String,
        require: true
    }, completed: {
        type: Boolean,
        default: false,
    },
},
// option for time stamp
{
    timestamps:true,

}
)



module.exports = mongoose.model('Note', noteSchema)