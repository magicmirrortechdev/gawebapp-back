const Client = require('../models/Client')


exports.createClient = (req, res, next) => {

    Client.create({...req.body })
        .then(client => res.status(201).json({ client }))
        .catch(err => res.status(500).json({ err }))
}

exports.getAllClients = (req, res, next) => {
    Client.find()
        .then(clients => res.status(200).json({ clients }))
        .catch(err => res.status(500).json({ err }))
}