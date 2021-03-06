const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        if (!decoded) throw new Error()
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if (!user) {
            throw new Error()
        }
        // set params for req
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({
            error: 'Token expired, please log in again!'
        })
    }
}

module.exports = auth