const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {
    userTestId,
    userTest,
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

