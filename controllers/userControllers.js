const User = require('../models/User')
const { createToken, createTokenU } = require('../config/jwt')
const { sendEmail } = require('../config/nodemailer')


exports.signup = (req, res, next) => {
    User.register({...req.body }, req.body.password)
        .then(user => { res.status(201).json({ user }) })
        .catch(err => res.status(500).json({ err }))
}
exports.createUser = (req, res, next) => {
    const { name, email, msg, password } = req.body
    User.register({...req.body }, req.body.password)
        .then(user => {
            sendEmail(email, name, msg, password)
                .then(info => {
                    res.status(200)
                })
                .catch(err => {

                    res.send(err)
                })
            res.status(201).json({ user })
        })
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

exports.workerUsers = (req, res, next) => {
    User.find({ role: 'WORKER' })
        .then(users => res.status(200).json({ users }))
        .catch(err => res.status(500).json({ err }))
}

exports.pmUsers = (req, res, next) => {
    User.find({ role: 'PROJECT MANAGER' })
        .then(users => res.status(200).json({ users }))
        .catch(err => res.status(500).json({ err }))
}

exports.addHours = (req, res, next) => {
    const { id2 } = req.body
    const { id } = req.params
    const time = req.body.time

    User.findOneAndUpdate(({
            $and: [{
                "works._id": {
                    $eq: id2
                }
            }]

        }), {
            $and: [{ "works._id": { $eq: id2 } }, { $push: { "works.time": time } }]
        }, { new: true })
        .then(user => res.status(200).json({ user }))
        .catch(err => res.status(500).json({ err }))

}