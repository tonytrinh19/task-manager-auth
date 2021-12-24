const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

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

const userTestId_2 = new mongoose.Types.ObjectId()
const userTest_2 = {
    _id: userTestId_2,
    name: 'Jane',
    email: 'jane@example.com',
    password: 'janedoemail',
    tokens: [{
        token: jwt.sign({
            _id: userTestId_2
        }, process.env.JWT_KEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First',
    completed: false,
    creator: userTestId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second',
    completed: true,
    creator: userTestId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third',
    completed: false,
    creator: userTestId_2
}

const populateDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userTest).save()
    await new User(userTest_2).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userTestId,
    userTest,
    userTestId_2,
    userTest_2,
    taskOne,
    taskTwo,
    taskThree,
    populateDatabase
}