const Client = require('../models/Client')
const Estimate = require('../models/Estimate')



exports.createEstimate = async(req, res, next) => {
    const emailUser = req.body.email
    const name = req.body.clientName
    const address = req.body.address
    const clientDb = await Client.findOne({ email: emailUser })

    if (clientDb === null) {
        const newClient = await Client.create({ name, email: emailUser, address })
        console.log(newClient)
        Estimate.create({...req.body, clientId: newClient._id })
            .then(estimate => res.status(201).json({ estimate }))
            .catch(err => res.status(500).json({ err }))

    } else if (clientDb) {
        await Estimate.create({...req.body, clientId: clientDb._id })
            .then(estimate => res.status(201).json({ estimate }))
            .catch(err => res.status(500).json({ err }))
    }

}

exports.getAllEstimates = (req, res, next) => {
    Estimate.find().populate('clientId')
        .then(estimates => res.status(200).json({ estimates }))
        .catch(err => res.status(500).json({ err }))
}