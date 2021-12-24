const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../src/models/task')

const userTestId = new mongoose.Types.ObjectId()
const userTest = {
    _id: userTestId,
    name: 'John',
    email: 'john@example.com',
    password: 'johndoemail',
    tokens: [{
        token: jwt.sign({
            _id: userTestId
        }, process.env.JWT_KEY)
    }]
}

const populateDatabase = async () => {
    await User.deleteMany()
    await new User(userTest).save()
}

module.exports = {
    userTestId,
    userTest,
    populateDatabase
}