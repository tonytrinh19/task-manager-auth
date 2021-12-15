const express = require('express')
const app = express()

require('./db/mongoose.js')
const userRouter = require('./routers/user-router.js')
const taskRouter = require('./routers/task-router.js')

const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => console.log('Server is up on port ', port))

// Express middleware
// app.use((req, res, next) => {
//     res.status(503).send('Server is under maintenance! Please return at a different time.')
// })