const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

const Task = require('../models/task')

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        creator: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
    // task.save().then(task => res.status(201).send(task)).catch(error => res.status(400).send(error))
})

// GET /tasks?completed=true. Add filtering to the request pararms.
// GET /tasks?limit=10&skip=10. Limit: number of queries per page, skip: number of queries skipped.
// GET /tasks/sortBy=createdAt:asc. Sort params.
router.get('/tasks', auth, async (req, res) => {
    try {
        // authenticate the user logged in, only show tasks that belong to currently logged in user
        // const tasks = await Task.find({creator: req.user._id})

        const match = {}
        const sort = {}

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy) {
            const strings = req.query.sortBy.split(':')
            sort.strings[0] = strings[1] === 'asc' ? 1 : -1 
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }

    // Task.find({}).then(tasks => res.send(tasks)).catch(error => res.status(500).send())
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // task = await Task.findById(_id)
        const task = await Task.findOne({
            _id,
            creator: req.user._id
        })
        res.status(200).send(task)
    } catch (error) {
        res.status(404).send(error)
    }
    // Task.findById(_id).then(task => res.send(task)).catch(error => res.status(404).send())
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({
            error: 'Invalid Updates'
        })
    }

    try {
        // const task = await Task.findByIdAndUpdate(_id, req.body, {
        //     new: true,
        //     runValidators: true
        // })
        const task = await Task.findOne({
            _id,
            creator: req.user._id
        })
        updates.forEach(update => task[update] = req.body[update])
        task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {

        const task = await Task.findOneAndDelete({
            _id,
            creator: req.user._id
        })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router