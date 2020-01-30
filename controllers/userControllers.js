const User = require('../models/User')
const Estimate = require('../models/Estimate')
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
    User.find({ role: 'WORKER' }).populate({
        path: 'works.workId',
        select: 'expenses jobName dateStart dateEnd'
    })
        .then(users => {
            res.status(200).json({ users })
        })
        .catch(err => res.status(500).json({ err }))
}

exports.pmUsers = (req, res, next) => {
    User.find({ role: 'PROJECT MANAGER' })
        .then(users => res.status(200).json({ users }))
        .catch(err => res.status(500).json({ err }))
}

exports.oneWorker = (req, res, next) => {
    const { id } = req.params
    User.findById(id)
        .then(user => res.status(200).json({ user }))
        .catch(err => res.status(500).json({ err }))
}

exports.updateWorker = (req, res, next) => {
    const { id } = req.params
    User.findByIdAndUpdate(id, {...req.body }, { new: true })
        .then(user => res.status(200).json({ user }))
        .catch(err => res.status(500).json({ err }))
}

exports.deleteWorker = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    User.findByIdAndDelete(id)
        .then(user => res.status(200).json({ user }))
        .catch(err => res.status(500).json({ err }))
}