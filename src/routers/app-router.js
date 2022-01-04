const express = require('express')
const auth = require('../middleware/auth')
const router   = new express.Router()

// Displays login page
router.get('/', (req, res) => {
    res.render('login');
})

// Displays signup page
router.get('/signup', async (req, res) => {
    res.render('signup')
})

router.get('*', (req, res) => {
    res.render('error')
})

module.exports = router