const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const noteSchema = new mongoose.Schema(
    {
        user: {
            // it help to check User schema by id
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
        timestamps: true,

    }
)
// 
noteSchema.plugin(AutoIncrement, { inc_field: 'ticket', id: 'ticketNums', start_seq: 500 })
module.exports = mongoose.model('Note', noteSchema)