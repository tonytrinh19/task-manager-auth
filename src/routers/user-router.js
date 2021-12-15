const express = require('express')
const router = new express.Router()

const User = require('../models/user')
const auth = require('../middleware/auth')
const { update } = require('../models/user')
const multer = require('multer')
const upload = multer({ dest: 'avatars'})

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send(error)
    }

    // user.save().then(user => {
    //     res.status(201).send(user)
    // }).catch(error => res.status(400).send(error))
})

router.post('/users/login', async (req, res) => {
    res.setHeader('X-Powered-By', 'Tony Trinh\'s Mind')
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// Get user's profile
router.get('/users/me', auth, async (req, res) => {
    res.setHeader('X-Powered-By', 'Toni')
    res.send(req.user)
})

// Get one user with ObjectID, deprecated, for dev only
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         res.status(200).send(user)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid Updates'
        })
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        res.status(200).send(req.user)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    const _id = req.user._id
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {

    res.send()
})

module.exports = router