const express = require('express')
const app = express()
const path = require('path')

const publicDirectory = path.join(__dirname, '../public')
const viewsDirectory = path.join(__dirname, '../templates/views')
const partialsDirectory = path.join(__dirname, '../templates/partials')

app.use(express.static(publicDirectory))
app.set('view engine', 'ejs')
app.set('views', viewsDirectory)

require('./db/mongoose.js')
const appRouter  = require('./routers/app-router')
const userRouter = require('./routers/user-router')
const taskRouter = require('./routers/task-router')

app.use(express.json())
app.use(express.urlencoded())
app.use(appRouter)
app.use(userRouter)
app.use(taskRouter)

module.exports = app