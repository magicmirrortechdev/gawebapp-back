const Client = require('../models/Client')
const Estimate = require('../models/Estimate')
const User = require('../models/User')
const Invoice = require('../models/Invoice')

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
    Estimate.find({ isJob: true }).populate('clientId').populate({ path: 'workerId' })
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

exports.convertInvoice = async(req, res, next) => {
    const { id } = req.params
    console.log(id)
    const estimate = await Estimate.findByIdAndUpdate(id, { isInvoice: true, status: 'Unpaid' }, { new: true })
    const { clientId, items, subtotal, tax, isInvoice, dateCreate, discount, paid, total, jobName, dateStart, dateEnd, comments, img, status, projectManager, workers, expenses } = estimate
    Invoice.create({ clientId, items, subtotal, tax, isInvoice, dateCreate, discount, paid, total, jobName, dateStart, dateEnd, comments, img, status, projectManager, workers, expenses })
        .then(invoice => res.status(200).json({ invoice }))
        .catch(err => res.status(500).json({ err }))
}
exports.convertJob = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findByIdAndUpdate(id, { isJob: true, status: 'Approve' }, { new: true })
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

exports.addTime = (req, res, next) => {
    const { id, workerId } = req.params
    const { time } = req.body
    const query = {
        workers: {
            $elemMatch: { _id: id }
        }
    }
    Estimate.findOneAndUpdate(query, { query, $push: { "workers.$.time": time } }, { new: true })
        .then(estimate => {
            User.findOne({ _id: workerId }).exec(function (err, data) {
                var arreglo = data.works;
                for (var i = 0; i < arreglo.length ; i++){
                    if(arreglo[i].workId.toString() == estimate._id.toString()){
                        arreglo[i].time.push(time);
                    }
                }

                data.save().then(function(savedPost) {
                    res.status(200).json({ estimate });
                }).catch(function(err) {
                    res.status(500).send(err);
                });
            });
        }
    )
    .catch(err => res.status(500).json({ err }));

};