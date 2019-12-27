const User = require('../models/User')
const { createToken, createTokenU } = require('../config/jwt')


exports.signup = (req, res, next) => {
    User.register({...req.body }, req.body.password)
        .then(user => { res.status(201).json({ user }) })
        .catch(err => res.status(500).json({ err }))
}
exports.createUser = (req, res, next) => {
    User.create({...req.body })
        .then(user => { res.status(201).json({ user }) })
        .catch(err => res.status(500).json({ err }))
}

exports.login = (req, res, next) => {
    const { user } = req
    const [header, payload, signature] = createToken(user)
    res.cookie('headload', `${header}.${payload}.`, {
        //maxAge: 1000 * 60 * 30,
        //secure: true
    })
    res.cookie('signature', signature, {
        //httpOnly: true,
        //secure: true
    })
    res.status(200).json({ user })
}

exports.getAllUsers = (req, res, next) => {
    User.find()
        .then(users => res.status(200).json({ users }))
        .catch(err => res.status(500).json({ err }))
}