const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userTestId, userTest, populateDatabase } = require('./fixtures/db')

beforeEach(populateDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Toni',
        email: 'toni@example.com',
        password: 'tonimail'
    }).expect(201)

    // Assert that the database actually created the document
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Toni',
            email: 'toni@example.com'
        },
        token: user.tokens[0].token
    })

    // Checks if the password has been hashed
    expect(user.password).not.toBe('tonimail')
})

test('Should log in existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userTest.email,
        password: userTest.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'thisEmailIsNotInTheDatabase@gmail.com',
        password: 'userTest.password'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userTest._id)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

// attach from supertest allow us attaching files.
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.png')
        .expect(200)

    const user = await User.findById(userTestId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send({
            name: 'Toni'
        }).expect(200)

    const user = await User.findById(userTestId)
    expect(user.name).toBe('Toni')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send({
            nickname: 'Bob'
        })
        .expect(400)
})