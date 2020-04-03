const Client = require('../models/Client')
const Estimate = require('../models/Estimate')
const User = require('../models/User')
const Invoice = require('../models/Invoice')
const { sendEstimate, sendInvoice } = require('../config/nodemailer')


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
                jobName: `${name} - ${address}`,
                items: { subtotal: items.rate * items.quantity },
                subtotal: items.reduce((acc, current, i) => acc + current.subtotal, 0),
            })
            .then(estimate => res.status(200).json({ estimate }))
            .catch(err => res.status(500).json({ err }))

    } else if (clientDb) {
        Estimate.create({...req.body, clientId: clientDb._id, jobName: `${name} - ${address}` })
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
    console.log(req.body)
    let date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    Estimate.findByIdAndUpdate(id, {
            isJob: true,
            status: 'Approve',
            $push: { invoices: {...req.body } }
        }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}
exports.createInvoice = async(req, res, next) => {
    const { id } = req.params
    const { date, description, total } = req.body
    console.log(req.body)

    Estimate.findByIdAndUpdate(id, {
            isJob: true,
            status: 'Approve',
            $push: { invoices: { date, total, description } }
        }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.convertJob = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Estimate.findByIdAndUpdate(id, { isJob: true, status: 'Approve' }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}
exports.closeJob = (req, res, next) => {
    const { id } = req.params
    Estimate.findByIdAndUpdate(id, { status: 'Closed' }, { new: true })
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
    const { date, vendor, category, description, img, total } = req.body

    console.log(id)
    Estimate.findByIdAndUpdate(id, { $push: { expenses: { date, vendor, category, description, img, total } } }, { new: true })
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
            User.findById(workerId).exec(function(err, data) {
                var arreglo = data.works;
                for (var i = 0; i < arreglo.length; i++) {
                    if (estimate._id != null && arreglo[i].workId.toString() == estimate._id.toString()) {
                        arreglo[i].time.push(time);
                    }
                }

                data.save().then(function(savedPost) {
                    res.status(200).json({ estimate });
                }).catch(function(err) {
                    res.status(500).send(err);
                });
            });
        })
        .catch(err => res.status(500).json({ err }));

};

exports.acceptPayment = (req, res, next) => {
    const { id } = req.params
    const { paid, date } = req.body
    const query = {
        invoices: {
            $elemMatch: { _id: id }
        }
    }
    Estimate.findOneAndUpdate(query, { query, $push: { "invoices.$.payment": { paid, date } } }, { new: true })
        .then(estimate => {
            res.status(200).json({ estimate })
        })
        .catch(err => res.status(500).json({ err }));

};


exports.updateInvoice = (req, res, next) => {
    const { invoiceId, estimateId } = req.params
    const query = {
        invoices: {
            $elemMatch: { _id: invoiceId }
        }
    }
    const { date, description, total } = req.body
    Estimate.findOneAndUpdate(query, { query, $set: { "invoices.$": { date, description, total } } }, { new: true })
        .then(estimate => {

            res.status(200).json(estimate)
        })
        .catch(err => res.status(500).json({ err }));

}

exports.updateExpense = (req, res, next) => {
    const { expenseId, estimateId } = req.params
    const query = {
        expenses: {
            $elemMatch: { _id: expenseId }
        }
    }
    const { date, vendor, category, description, img, total } = req.body
    Estimate.findOneAndUpdate(query, { query, $set: { "expenses.$": { date, vendor, category, description, img, total } } }, { new: true })
        .then(estimate => {

            res.status(200).json(estimate)
        })
        .catch(err => res.status(500).json({ err }));

}
exports.deleteInvoice = (req, res, next) => {
    const { id, estimateId } = req.params
    const query = {
        invoices: {
            $elemMatch: { _id: id }
        }
    }
    console.log('invoiceId', id, 'EstimateId', estimateId)
    Estimate.findOneAndUpdate(query, { query, $pull: { invoices: { _id: id } } }, { new: true })
        .then(estimate => {
            res.status(200).json({ estimate })
        })
        .catch(err => res.status(500).json({ err }));

};

exports.deleteExpense = (req, res, next) => {
    const { expenseId, estimateId } = req.params
    const query = {
        expenses: {
            $elemMatch: { _id: expenseId }
        }
    }
    Estimate.findOneAndUpdate(query, { query, $pull: { expenses: { _id: expenseId } } }, { new: true })
        .then(estimate => {
            res.status(200).json({ estimate })
        })
        .catch(err => res.status(500).json({ err }));

};

exports.sendEstimate = (req, res, next) => {
    const {
        name,
        items,
        total,
        comments,
        tags
    } = req.body
    sendEstimate(name, items, total, comments, tags)
        .then(info => {
            res.send('Email sent')
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

exports.sendInvoice = (req, res, next) => {
    const {
        name,
        date,
        total,
        description,
        tags
    } = req.body
    sendInvoice(name, date, total, description, tags)
        .then(info => {
            res.send('Email sent')
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

exports.addArgyleCharge = (req, res, next) => {
    const { invoiceId } = req.params;
    const { argyleChargeId } = req.body;

    const query = {
        invoices: {
            $elemMatch: { _id: invoiceId }
        }
    }

    Estimate.findOneAndUpdate(query, { query, "invoices.$.argyleChargeId": argyleChargeId }, { new: true })
        .then(estimate => {
            res.status(200).json(estimate)
        })
        .catch(err => res.status(500).json({ err }));


}