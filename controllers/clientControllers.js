const Client = require('../models/Client')

exports.createClient = async (req, res, next) => {
  const emailUser = req.body.email
  const clientDb = await Client.findOne({ email: emailUser })
  if (clientDb === null) {
    Client.create({ ...req.body })
      .then(client => res.status(201).json({ client }))
      .catch(err => res.status(500).json({ err }))
  } else if (clientDb) {
    res.status(500).json({ message: 'A client with the given email is already registered' })
  }
}

exports.getAllClients = (req, res, next) => {
  Client.find()
    .sort({ name: 1 })
    .then(clients => res.status(200).json({ clients }))
    .catch(err => res.status(500).json({ err }))
}

exports.oneClient = (req, res, next) => {
  const { id } = req.params
  Client.findById(id)
    .then(client => res.status(200).json({ client }))
    .catch(err => res.status(500).json({ err }))
}

exports.updateClient = (req, res, next) => {
  const { id } = req.params
  Client.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(client => res.status(200).json({ client }))
    .catch(err => res.status(500).json({ err }))
}

exports.deleteClient = (req, res, next) => {
  const { id } = req.params
  Client.findByIdAndDelete(id)
    .then(client => res.status(200).json({ client }))
    .catch(err => res.status(500).json({ err }))
}
