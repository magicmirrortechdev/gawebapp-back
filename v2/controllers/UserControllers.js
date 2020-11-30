const UserV2 = require('../models/UserV2')
const { createToken } = require('../../config/jwt')
const { sendEmail } = require('../../config/nodemailer')

exports.signup = (req, res, next) => {
  UserV2.register({ ...req.body }, req.body.password)
    .then(user => {
      res.status(201).json({ user })
    })
    .catch(err => res.status(500).json({ err }))
}

exports.createUser = (req, res, next) => {
  const { name, email, msg, password } = req.body
  UserV2.register({ ...req.body }, req.body.password)
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
    maxAge: 1000 * 60 * 30,
    secure: true,
  })
  res.cookie('signature', signature, {
    httpOnly: true,
    secure: true,
  })
  res.status(200).json({ user })
}

exports.logout = (req, res, next) => {
  res.clearCookie('headload')
  res.clearCookie('signature')
  res.status(200).json({ msg: 'Logged out' })
}

exports.getAllUsers = (req, res, next) => {
  UserV2.find()
    .sort({ name: 1 })
    .lean()
    .then(users => res.status(200).json({ users }))
    .catch(err => res.status(500).json({ err }))
}

exports.oneWorker = (req, res, next) => {
  const { id } = req.params
  UserV2.findById(id)
    .then(user => res.status(200).json({ user }))
    .catch(err => res.status(500).json({ err }))
}

exports.updateWorker = (req, res, next) => {
  const { id } = req.params
  UserV2.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(user => res.status(200).json({ user }))
    .catch(err => res.status(500).json({ err }))
}

exports.deleteWorker = (req, res, next) => {
  const { id } = req.params
  console.log(id)
  UserV2.findByIdAndDelete(id)
    .then(user => res.status(200).json({ user }))
    .catch(err => res.status(500).json({ err }))
}

exports.workerUsers = (req, res, next) => {
  UserV2.find({ role: { $in: ['WORKER', 'PROJECT MANAGER', 'ADMIN'] } })
    .populate({
      path: 'works.workId',
      select: 'expenses jobName dateStart dateEnd',
    })
    .sort({ name: 1 })
    .then(users => {
      res.status(200).json({ users })
    })
    .catch(err => res.status(500).json({ err }))
}

exports.pmUsers = (req, res, next) => {
  UserV2.find({ role: 'PROJECT MANAGER' })
    .then(users => res.status(200).json({ users }))
    .catch(err => res.status(500).json({ err }))
}
