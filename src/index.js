const express = require('express')
const app = express()

require('./db/mongoose.js')
const userRouter = require('./routers/user-router.js')
const taskRouter = require('./routers/task-router.js')

const port = process.env.PORT || 3000

// Express middleware
// app.use((req, res, next) => {
//     res.status(503).send('Server is under maintenance! Please return at a different time.')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => console.log('Server is up on port ', port))

const User = require('./models/user')
const Task = require('./models/task.js')

const main = async () => {
    // const user = await User.findById('60ef2a0e5514461c8c3e5939')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)
    
    // const task = await Task.findById('60b7a27b13caad21dc0beb4a')
    // await task.populate('creator').execPopulate()
    // console.log(task.creator)
}

main()