const express = require('express')
const app = express()

require('./db/mongoose.js')
const userRouter = require('./routers/user-router.js')
const taskRouter = require('./routers/task-router.js')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app