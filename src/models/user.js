const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be non-negative number!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word password!!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// Virtual property, not actual data stored in db but relationship between 2 entities
// users and tasks in this case.
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'creator'
})

// Controls what will be sent back when sending back
// user's information.
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    // hide private data
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({
        token
    })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    if (!user) throw new Error('Unable to log in')
    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new Error('Incorrect password!')
    return user
}

// Hash the plain text password before saving in the database
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({
        creator: user._id
    })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User