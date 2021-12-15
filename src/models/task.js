const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Create reference so other can call it
        ref: 'User'
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task