const Client = require('../models/Client')
const Estimate = require('../models/Estimate')
const User = require('../models/User')

exports.createEstimate = async(req, res, next) => {
    const emailUser = req.body.email
    const name = req.body.name
    const address = req.body.address
    const clientDb = await Client.findOne({ email: emailUser })
    const items = req.body.items

    if (clientDb === null) {
        const newClient = await Client.create({ name, email: emailUser, address })

        Estimate.create({...req.body,
                clientId: newClient._id,
                jobName: `${address}${name}`,
                items: { subtotal: items.rate * items.quantity },
                subtotal: items.reduce((acc, current, i) => acc + current.subtotal, 0),
            })
            .then(estimate => res.status(200).json({ estimate }))
            .catch(err => res.status(500).json({ err }))

    } else if (clientDb) {
        Estimate.create({...req.body, clientId: clientDb._id, jobName: `${address}${name}` })
            .then(estimate => res.status(200).json({ estimate }))
            .catch(err => res.status(500).json({ err }))
    }

}

exports.getAllEstimates = (req, res, next) => {
    Estimate.find({ type: 'Estimate' }).populate('clientId')
        .then(estimates => res.status(200).json({ estimates }))
        .catch(err => res.status(500).json({ err }))
}
exports.getAllInvoices = (req, res, next) => {
    Estimate.find({ type: 'Invoice' }).populate('clientId')
        .then(invoices => res.status(200).json({ invoices }))
        .catch(err => res.status(500).json({ err }))
}
exports.getAllJobs = (req, res, next) => {
    Estimate.find({ type: 'Job' }).populate('clientId').populate({ path: 'workerId' })
        .then(jobs => res.status(200).json({ jobs }))
        .catch(err => res.status(500).json({ err }))
}

exports.deleteAll = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findByIdAndDelete(id)
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.convertInvoice = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findByIdAndUpdate(id, { type: 'Invoice', status: 'Unpaid' }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}
exports.convertJob = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findByIdAndUpdate(id, { type: 'Job', status: 'Approve' }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}
exports.decline = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findByIdAndUpdate(id, { status: 'Decline' }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.addExpense = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findByIdAndUpdate(id, { $push: { expenses: {...req.body } } }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}
exports.addWorkers = (req, res, next) => {
    const { id } = req.params
    const { id2 } = req.body
    console.log(id)
    Estimate.findByIdAndUpdate(id, { $push: { workers: { workerId: id2 } } }, { new: true })
        .then(estimate =>
            User.findByIdAndUpdate(id2, { $push: { works: { workId: id } } }, { new: true })
            .then(user => res.status(200).json({ estimate, user }))
            .catch(err => res.status(500).json({ err })))
        .catch(err => res.status(500).json({ err }))
}

exports.addPM = (req, res, next) => {
    const { id } = req.params
    const { id2 } = req.body
    console.log(id)
    Estimate.findByIdAndUpdate(id, { $push: { projectManager: { projectId: id2 } } }, { new: true })
        .then(estimate =>
            User.findByIdAndUpdate(id2, { $push: { works: { workId: id } } }, { new: true })
            .then(user => res.status(200).json({ estimate, user }))
            .catch(err => res.status(500).json({ err })))
        .catch(err => res.status(500).json({ err }))
}

exports.getOneEstimate = async(req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findById(id).populate('clientId')
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))

}

exports.estimateUpdate = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findByIdAndUpdate(id, {...req.body }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.paidInvoice = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findByIdAndUpdate(id, { status: 'Paid' }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}