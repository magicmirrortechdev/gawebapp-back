const Client = require('../models/Client')
const Estimate = require('../models/Estimate')
const User = require('../models/User')
const { sendEstimate, sendInvoice } = require('../config/nodemailer')

exports.createEstimate = async(req, res, next) => {
    const emailUser = req.body.email
    const name = req.body.name
    const address = req.body.address
    const clientDb = await Client.findOne({ email: emailUser })
    const items = req.body.items

    if (clientDb === null) {
        const newClient = await Client.create({ name, email: emailUser })

        Estimate.create({
                ...req.body,
                addressEstimate: address,
                nameEstimate: name,
                emailEstimate: emailUser,
                clientId: newClient._id,
                jobName: `${name} - ${address}`,
                items: { subtotal: items.rate * items.quantity },
                subtotal: items.reduce((acc, current, i) => acc + current.subtotal, 0),
            })
            .then(estimate => res.status(200).json({ estimate }))
            .catch(err => res.status(500).json({ err }))
    } else if (clientDb) {
        Estimate.create({
                ...req.body,
                addressEstimate: address,
                nameEstimate: name,
                emailEstimate: emailUser,
                clientId: clientDb._id,
                jobName: `${name} - ${address}`,
            })
            .then(estimate => res.status(200).json({ estimate }))
            .catch(err => res.status(500).json({ err }))
    }
}

exports.createJob = async(req, res, next) => {
    const emailUser = req.body.email
    const name = req.body.name
    const address = req.body.address
    const dateStart = req.body.dateStart
    const dateEnd = req.body.dateEnd
    const clientDb = await Client.findOne({ email: emailUser })

    if (clientDb === null) {
        const newClient = await Client.create({ name, email: emailUser })

        Estimate.create({
                ...req.body,
                addressEstimate: address,
                nameEstimate: name,
                emailEstimate: emailUser,
                clientId: newClient._id,
                jobName: `${name} - ${address}`,
                subtotal: 0,
                status: 'Approve',
                isJob: true,
                dateStart,
                dateEnd,
            })
            .then(estimate => res.status(200).json({ estimate }))
            .catch(err => res.status(500).json({ err }))
    } else if (clientDb) {
        Estimate.create({
                ...req.body,
                addressEstimate: address,
                nameEstimate: name,
                emailEstimate: emailUser,
                clientId: clientDb._id,
                status: 'Approve',
                subtotal: 0,
                jobName: `${name} - ${address}`,
                isJob: true,
                dateStart,
                dateEnd,
            })
            .then(estimate => res.status(200).json({ estimate }))
            .catch(err => res.status(500).json({ err }))
    }
}

exports.getAllEstimates = (req, res, next) => {
    Estimate.find({ type: 'Estimate' })
        .populate('clientId')
        .then(estimates => res.status(200).json({ estimates }))
        .catch(err => res.status(500).json({ err }))
}


exports.getUserEstimate = (req, res, next) => {
    const { id } = req.params
    const query = {
        workers: {
            $elemMatch: { workerId: id },
        },
    }
    Estimate.find(query)
        .then(estimates => {
            res.status(200).json({ estimates })
        })
        .catch(err => res.status(500).json({ err }))
}

exports.getAllInvoices = (req, res, next) => {
    Estimate.find({ type: 'Invoice' })
        .populate('clientId')
        .then(invoices => res.status(200).json({ invoices }))
        .catch(err => res.status(500).json({ err }))
}
exports.getAllJobs = (req, res, next) => {
    Estimate.find({ isJob: true })
        .populate('clientId')
        .populate({ path: 'workerId' })
        .then(jobs => res.status(200).json({ jobs }))
        .catch(err => res.status(500).json({ err }))
}
exports.getJobsUser = (req, res, next) => {
    const { id } = req.params
    const query = {
        isJob: true,
        workers: {
            $elemMatch: { workerId: id },
        },
    }
    Estimate.find(query)
        .populate('clientId')
        .populate({ path: 'workerId' })
        .then(jobs => res.status(200).json({ jobs }))
        .catch(err => res.status(500).json({ err }))
}
exports.getJobsOpen = (req, res, next) => {
    Estimate.find({ isJob: true, status: 'Approve' })
        .populate('clientId')
        .populate({ path: 'workerId' })
        .then(jobs => res.status(200).json({ jobs }))
        .catch(err => res.status(500).json({ err }))
}

exports.getJobsClose = (req, res, next) => {
    Estimate.find({ isJob: true, status: 'Closed' })
        .populate('clientId')
        .populate({ path: 'workerId' })
        .then(jobs => res.status(200).json({ jobs }))
        .catch(err => res.status(500).json({ err }))
}

exports.deleteAll = (req, res, next) => {
    const { id } = req.params
    Estimate.findByIdAndDelete(id)
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.convertInvoice = async(req, res, next) => {
    const { id } = req.params
    var fecha = new Date()
    var mes = fecha.getMonth() + 1
    var dia = fecha.getDate()
    var ano = fecha.getFullYear()
    if (dia < 10) dia = '0' + dia //agrega cero si es menor de 10
    if (mes < 10) mes = '0' + mes //agrega cero si es menor de 10
    Estimate.findByIdAndUpdate(
            id, {
                isJob: true,
                status: 'Approve',
                dateStart: `${ano}-${mes}-${dia}`,
                $push: { invoices: {...req.body } },
            }, { new: true }
        )
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}
exports.createInvoice = async(req, res, next) => {
    const { id } = req.params
    const { date, description, total } = req.body
    var fecha = new Date()
    var mes = fecha.getMonth() + 1
    var dia = fecha.getDate()
    var ano = fecha.getFullYear()
    if (dia < 10) dia = '0' + dia //agrega cero si es menor de 10
    if (mes < 10) mes = '0' + mes //agrega cero si es menor de 10

    Estimate.findByIdAndUpdate(
            id, {
                isJob: true,
                status: 'Approve',
                dateStart: `${ano}-${mes}-${dia}`,
                $push: { invoices: { date, total, description } },
            }, { new: true }
        )
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.convertJob = (req, res, next) => {
    const { id } = req.params
    var fecha = new Date()
    var mes = fecha.getMonth() + 1
    var dia = fecha.getDate()
    var ano = fecha.getFullYear()
    if (dia < 10) dia = '0' + dia //agrega cero si es menor de 10
    if (mes < 10) mes = '0' + mes //agrega cero si es menor de 10
    Estimate.findByIdAndUpdate(id, { isJob: true, status: 'Approve', dateStart: `${ano}-${mes}-${dia}` }, { new: true })
        .then(estimate => res.render('approve.hbs'))
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
    Estimate.findByIdAndUpdate(id, { status: 'Decline' }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.addExpense = async(req, res, next) => {
    const { id } = req.params
    const { date, vendor, category, description, img, total, workerId } = req.body

    const estimate = await Estimate.findByIdAndUpdate(
        id, { $push: { expenses: { date, vendor, category, description, img, total, workerId } } }, { new: true }
    )
    User.findByIdAndUpdate(
            workerId, { $push: { expenses: { jobName: estimate.jobName, date, vendor, category, description, img, total } } }, { new: true }
        )
        .then(user => res.status(200).json({ estimate, user }))
        .catch(err => res.status(500).json({ err }))
}
exports.addWorkers = (req, res, next) => {
    const { id } = req.params
    const { id2 } = req.body
    Estimate.findByIdAndUpdate(id, { $push: { workers: { workerId: id2 } } }, { new: true })
        .then(estimate =>
            User.findByIdAndUpdate(id2, { $push: { works: { workId: id } } }, { new: true })
            .then(user => res.status(200).json({ estimate, user }))
            .catch(err => res.status(500).json({ err }))
        )
        .catch(err => res.status(500).json({ err }))
}

exports.addPM = (req, res, next) => {
    const { id } = req.params
    const { id2 } = req.body
    Estimate.findByIdAndUpdate(id, { $push: { projectManager: { projectId: id2 } } }, { new: true })
        .then(estimate =>
            User.findByIdAndUpdate(id2, { $push: { works: { workId: id } } }, { new: true })
            .then(user => res.status(200).json({ estimate, user }))
            .catch(err => res.status(500).json({ err }))
        )
        .catch(err => res.status(500).json({ err }))
}

exports.getOneEstimate = async(req, res, next) => {
    const { id } = req.params
    Estimate.findById(id)
        .populate('clientId')
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.estimateUpdate = (req, res, next) => {
    const { id } = req.params
    const emailUser = req.body.email
    const name = req.body.name
    const address = req.body.address
    Estimate.findByIdAndUpdate(
            id, {...req.body, addressEstimate: address, nameEstimate: name, emailEstimate: emailUser }, { new: true }
        )
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.paidInvoice = (req, res, next) => {
    const { id } = req.params
    Estimate.findByIdAndUpdate(id, { status: 'Paid' }, { new: true })
        .then(estimate => res.status(200).json({ estimate }))
        .catch(err => res.status(500).json({ err }))
}

exports.addTime = (req, res, next) => {
    const { id, workerId } = req.params
    const { time, date } = req.body
    const query = {
        workers: {
            $elemMatch: { _id: id },
        },
    }
    Estimate.findOneAndUpdate(
            query, { query, $push: { 'workers.$.time': { hours: time, date }, 'workers.$.date': date } }, { new: true }
        )
        .then(estimate => {
            User.findById(workerId).exec(function(err, data) {
                var arreglo = data.works
                for (var i = 0; i < arreglo.length; i++) {
                    if (estimate._id != null && arreglo[i].workId.toString() == estimate._id.toString()) {
                        arreglo[i].time.push({ hours: time, date })
                    }
                }

                data
                    .save()
                    .then(function(savedPost) {
                        res.status(200).json({ estimate })
                    })
                    .catch(function(err) {
                        res.status(500).send(err)
                    })
            })
        })
        .catch(err => res.status(500).json({ err }))
}

exports.acceptPayment = (req, res, next) => {
    const { id } = req.params
    const { paid, date } = req.body
    const query = {
        invoices: {
            $elemMatch: { _id: id },
        },
    }
    Estimate.findOneAndUpdate(query, { query, $push: { 'invoices.$.payment': { paid, date } } }, { new: true })
        .then(estimate => {
            res.status(200).json({ estimate })
        })
        .catch(err => res.status(500).json({ err }))
}

exports.updateInvoice = (req, res, next) => {
    const { invoiceId, estimateId } = req.params
    const query = {
        invoices: {
            $elemMatch: { _id: invoiceId },
        },
    }
    const { date, description, total } = req.body
    Estimate.findOneAndUpdate(query, { query, $set: { 'invoices.$': { date, description, total } } }, { new: true })
        .then(estimate => {
            res.status(200).json(estimate)
        })
        .catch(err => res.status(500).json({ err }))
}

exports.updateExpense = (req, res, next) => {
    const { expenseId, estimateId } = req.params
    const query = {
        expenses: {
            $elemMatch: { _id: expenseId },
        },
    }
    const { date, vendor, category, description, img, total } = req.body
    const date2 = new Date(date)
    Estimate.findOneAndUpdate(
            query, { query, $set: { 'expenses.$': { date: date2, vendor, category, description, img, total } } }, { new: true }
        )
        .then(estimate => {
            res.status(200).json(estimate)
        })
        .catch(err => res.status(500).json({ err }))
}

exports.filterDate = async(req, res, next) => {
    let { startDate, endDate } = req.body
    let start = new Date(startDate)
    let end = new Date(endDate)

    const resultWorkers = await User.aggregate([{
            $match: { role: { $in: ['WORKER', 'PROJECT MANAGER'] } }
        },
        {
            $project: {
                name: 1,
                effective: 1,
                payment: 1,
                works: {
                    $filter: {
                        input: {
                            $map: {
                                input: '$works',
                                as: 'works',
                                in: {
                                    workId: '$$works.workId',
                                    time: {
                                        $filter: {
                                            input: '$$works.time',
                                            as: 'time',
                                            cond: {
                                                $and: [{ $gte: ['$$time.date', start] }, { $lte: ['$$time.date', end] }],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        as: 'works',
                        cond: { $gte: [{ $size: '$$works.time' }, 1] },
                    },
                },
                expenses: {
                    $filter: {
                        input: '$expenses',
                        cond: {
                            $and: [{ $gte: ['$$expenses.date', start] }, { $lte: ['$$expenses.date', end] }],
                        },
                        as: 'expenses',
                    },
                },
            },
        },


    ])

    const result = await Estimate.aggregate([{
            $match: {
                status: 'Approve',
            },
        },
        {
            $project: {
                name: 1,
                jobName: '$jobName',
                items: '$items',
                invoices: {
                    $filter: {
                        input: '$invoices',
                        cond: {
                            $and: [{ $gte: ['$$this.date', start] }, { $lte: ['$$this.date', end] }],
                        },
                    },
                },
                workers: {
                    $filter: {
                        input: {
                            $map: {
                                input: '$workers',
                                as: 'workers',
                                in: {
                                    workerId: '$$workers.workerId',
                                    time: {
                                        $filter: {
                                            input: '$$workers.time',
                                            as: 'time',
                                            cond: {
                                                $and: [{ $gte: ['$$time.date', start] }, { $lte: ['$$time.date', end] }],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        as: 'workers',
                        cond: { $gt: [{ $size: '$$workers.time' }, 0] },
                    },
                },
                clientId: '$clientId',
                expenses: {
                    $filter: {
                        input: '$expenses',
                        cond: {
                            $and: [{ $gte: ['$$this.date', start] }, { $lte: ['$$this.date', end] }],
                        },
                    },
                },
            },
        },
    ])
    const resultFinal = await User.populate(resultWorkers, { path: 'works.workId' })
    Estimate.populate(result, {
            path: 'workers.workerId',
        })
        .then(jobs => {
            res.status(200).json({ jobs: jobs, workers: resultFinal })
        })
        .catch(err => res.status(500).json({ err }))
}

exports.deleteInvoice = (req, res, next) => {
    const { id, estimateId } = req.params
    const query = {
        invoices: {
            $elemMatch: { _id: id },
        },
    }
    Estimate.findOneAndUpdate(query, { query, $pull: { invoices: { _id: id } } }, { new: true })
        .then(estimate => {
            res.status(200).json({ estimate })
        })
        .catch(err => res.status(500).json({ err }))
}

exports.deleteWorker = (req, res, next) => {
    const { workerId, estimateId } = req.params
    const { worker } = req.body
    const query = {
        workers: {
            $elemMatch: { _id: workerId },
        },
    }
    Estimate.findOneAndUpdate(query, { query, $pull: { workers: { _id: workerId } } }, { new: true })
        .then(estimate => {
            User.findById(worker).exec(function(err, data) {
                var arreglo = data.works
                for (var i = 0; i < arreglo.length; i++) {
                    if (estimate._id != null && arreglo[i].workId.toString() == estimate._id.toString()) {
                        arreglo.pull(arreglo[i]._id)
                    }
                }

                data
                    .save()
                    .then(function(savedPost) {
                        res.status(200).json({ estimate })
                    })
                    .catch(function(err) {
                        res.status(500).send(err)
                    })
            })
        })
        .catch(err => res.status(500).json({ err }))
}

exports.deleteExpense = (req, res, next) => {
    const { expenseId, estimateId } = req.params
    const query = {
        expenses: {
            $elemMatch: { _id: expenseId },
        },
    }
    Estimate.findOneAndUpdate(query, { query, $pull: { expenses: { _id: expenseId } } }, { new: true })
        .then(estimate => {
            res.status(200).json({ estimate })
        })
        .catch(err => res.status(500).json({ err }))
}

exports.sendEstimate = (req, res, next) => {
    const { name, items, total, comments, tags, address, estimateId } = req.body

    sendEstimate(name, items, total, comments, tags, address, estimateId)
        .then(info => {
            Estimate.findByIdAndUpdate(estimateId, { status: 'Sent' }, { new: true })
                .then(estimate => {
                    res.send('Email sent')
                })
                .catch(err => res.status(500).json({ err }))
        })
        .catch(err => {
            res.send(err)
        })
}

exports.sendInvoice2 = (req, res, next) => {
    const { name, date, total, description, tags, urlPay, invoiceId, jobId } = req.body
    const query = {
        invoices: {
            $elemMatch: { _id: invoiceId },
        },
    }

    sendInvoice(name, date, total, description, tags, urlPay)
        .then(info => {
            Estimate.findOneAndUpdate(query, { query, $set: { 'invoices.$.status': 'Sent' } }, { new: true })
                .then(estimate => {
                    res.send('Email sent')
                })
                .catch(err => {
                    res.send(err)
                })
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}