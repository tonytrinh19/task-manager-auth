const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {
    userTestId,
    userTest,
    userTestId_2,
    userTest_2,
    taskOne,
    taskTwo,
    taskThree,
    populateDatabase
} = require('./fixtures/db')

beforeEach(populateDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send({
            description: 'Find a job'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
    expect(task.description).toBe('Find a job')
    expect(task.creator).toStrictEqual(userTestId)
})

test('Should return all tasks for userTest', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not be able to delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTest_2.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should be able to delete own task', async () => {
    await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userTest_2.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(taskThree._id)
    expect(task).toBeNull()
})