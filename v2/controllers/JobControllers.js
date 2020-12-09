const Job = require('../models/JobsV2')
const User = require('../models/UserV2')
const Client = require('../models/ClientV2')
const { sendEstimate } = require('../../config/nodemailer')

exports.createJob = (req, res, next) => {
  Job.create({ ...req.body })
    .then(job => res.status(200).json({ job }))
    .catch(err => res.status(500).json({ err }))
}

exports.getAllJobs = (req, res, next) => {
  Job.find()
    .lean()
    .then(jobs => res.status(200).json({ jobs }))
    .catch(err => res.status(500).json({ err }))
}

exports.getOneJob = (req, res, next) => {
  const { id } = req.params
  Job.findById(id)
    .then(job => res.status(200).json({ job }))
    .catch(err => res.status(500).json({ err }))
}

exports.getSentJobs = (req, res, next) => {
  Job.find({ isSent: true })
    .lean()
    .then(jobs => res.status(200).json({ jobs }))
    .catch(err => res.status(500).json({ err }))
}
exports.getAcceptedJobs = (req, res, next) => {
  Job.find({ isAccepted: true })
    .lean()
    .then(jobs => res.status(200).json({ jobs }))
    .catch(err => res.status(500).json({ err }))
}

exports.getIsJob = (req, res, next) => {
  Job.find({ isJob: true })
    .lean()
    .then(jobs => res.status(200).json({ jobs }))
    .catch(err => res.status(500).json({ err }))
}

exports.updateJob = async (req, res, next) => {
  const { id } = req.params
  Job.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(job => res.status(200).json({ job }))
    .catch(err => res.status(500).json({ err }))
}

exports.deleteJob = (req, res, next) => {
  const { id } = req.params
  Job.findByIdAndDelete(id)
    .then(job => res.status(200).json({ job }))
    .catch(err => res.status(500).json({ err }))
}

exports.createEstimate = async (req, res, next) => {
  const emailUser = req.body.email
  const name = req.body.name
  const address = req.body.address
  const clientDb = await Client.findOne({ email: emailUser })
  const items = req.body.items

  const subTotal = items.reduce((acc, current, i) => acc + current.subtotal, 0)
  const total = subTotal + (req.body.estimateTax * subTotal) / 100 - req.body.estimateDiscount - req.body.estimatePaid

  const firstName = name.split(' ')[0]
  const lastName = name.replace(firstName, '').trim()
  if (clientDb === null) {
    const newClient = await Client.create({ firstName, lastName, email: emailUser })

    Job.create({
      ...req.body,
      jobAddress: address,
      estimateName: name,
      emailEstimate: emailUser,
      clientId: newClient._id,
      jobName: `${name} - ${address}`,
      isSent: false,
      isAccepted: false,
      isJob: false,
      status: 'Unsent',
      estimateSubtotal: subTotal,
      estimateTotal: total,
    })
      .then(job => res.status(200).json({ job }))
      .catch(err => res.status(500).json({ err }))
  } else if (clientDb) {
    Job.create({
      ...req.body,
      jobAddress: address,
      estimateName: name,
      emailEstimate: emailUser,
      clientId: clientDb._id,
      jobName: `${name} - ${address}`,
      isSent: false,
      isAccepted: false,
      isJob: false,
      status: 'Unsent',
      estimateSubtotal: items.reduce((acc, current, i) => acc + current.subtotal, 0),
      estimateTotal: total,
    })
      .then(job => res.status(200).json({ job }))
      .catch(err => res.status(500).json({ err }))
  }
}

exports.createJob = async (req, res, next) => {
  const emailUser = req.body.email
  const name = req.body.name
  const address = req.body.address
  const dateStart = req.body.dateStart
  const dateEnd = req.body.dateEnd
  const clientDb = await Client.findOne({ email: emailUser })

  if (clientDb === null) {
    const newClient = await Client.create({ name, email: emailUser })

    const estimate = await Job.create({
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

    Job.findById(estimate._id)
      .populate('clientId')
      .populate({ path: 'workerId' })
      .then(estimate => res.status(200).json({ estimate }))
      .catch(err => res.status(500).json({ err }))
  } else if (clientDb) {
    const estimate = await Job.create({
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
    Job.findById(estimate._id)
      .populate('clientId')
      .populate({ path: 'workerId' })
      .then(estimate => res.status(200).json({ estimate }))
      .catch(err => res.status(500).json({ err }))
  }
}

exports.getAllEstimates = (req, res, next) => {
  Job.find({})
    .sort({ createdAt: -1 })
    .lean()
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
  Job.find(query)
    .sort({ createdAt: -1 })
    .then(estimates => {
      res.status(200).json({ estimates })
    })
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
  Job.find(query)
    .populate('clientId')
    .populate({ path: 'workerId' })
    .sort({ jobName: 1 })
    .then(jobs => res.status(200).json({ jobs }))
    .catch(err => res.status(500).json({ err }))
}

exports.closeJob = (req, res, next) => {
  const { id } = req.params
  Job.findByIdAndUpdate(id, { status: 'Closed' }, { new: true })
    .populate('clientId')
    .populate({ path: 'workerId' })
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
  Job.findByIdAndUpdate(id, { isJob: true, status: 'Approve', dateStart: `${ano}-${mes}-${dia}` }, { new: true })
    .then(job => res.status(200).json({ job }))
    .catch(err => res.status(500).json({ err }))
}

exports.decline = (req, res, next) => {
  const { id } = req.params
  Job.findByIdAndUpdate(id, { status: 'Decline' }, { new: true })
    .then(job => res.status(200).json({ job }))
    .catch(err => res.status(500).json({ err }))
}

exports.deleteAll = (req, res, next) => {
  const { id } = req.params
  Job.findByIdAndDelete(id)
    .then(estimate => res.status(200).json({ estimate }))
    .catch(err => res.status(500).json({ err }))
}

exports.addWorkers = (req, res, next) => {
  const { id } = req.params
  const { id2 } = req.body
  Job.findByIdAndUpdate(id, { $push: { workers: { workerId: id2 } } }, { new: true })
    .then(async estimateRes => {
      const estimate = await Job.findById(estimateRes._id).populate('clientId').populate({ path: 'workerId' })
      User.findByIdAndUpdate(id2, { $push: { works: { workId: id } } }, { new: true })
        .then(user => res.status(200).json({ estimate, user }))
        .catch(err => res.status(500).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
}

exports.addPM = (req, res, next) => {
  const { id } = req.params
  const { id2 } = req.body
  Job.findByIdAndUpdate(id, { $push: { projectManager: { projectId: id2 } } }, { new: true })
    .then(async estimateRes => {
      const estimate = await Job.findById(estimateRes._id).populate('clientId').populate({ path: 'workerId' })
      User.findByIdAndUpdate(id2, { $push: { works: { workId: id } } }, { new: true })
        .then(user => res.status(200).json({ estimate, user }))
        .catch(err => res.status(500).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
}

exports.sendEstimateC = (req, res, next) => {
  const { name, items, total, comments, tags, address, estimateId } = req.body

  sendEstimate(name, items, total, comments, tags, address, estimateId)
    .then(info => {
      Job.findByIdAndUpdate(estimateId, { status: 'Sent' }, { new: true })
        .then(estimate => {
          res.send('Email sent')
        })
        .catch(err => res.status(500).json({ err }))
    })
    .catch(err => {
      res.send(err)
    })
}

exports.estimateUpdate = (req, res, next) => {
  const { id } = req.params
  const emailUser = req.body.email
  const name = req.body.name
  const address = req.body.address
  Job.findByIdAndUpdate(
    id,
    { ...req.body, addressEstimate: address, nameEstimate: name, emailEstimate: emailUser },
    { new: true }
  )
    .populate('clientId')
    .populate({ path: 'workerId' })
    .then(estimate => res.status(200).json({ estimate }))
    .catch(err => res.status(500).json({ err }))
}

exports.paidInvoice = (req, res, next) => {
  const { id } = req.params
  Job.findByIdAndUpdate(id, { status: 'Paid' }, { new: true })
    .then(estimate => res.status(200).json({ estimate }))
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
  Job.findOneAndUpdate(query, { query, $pull: { workers: { _id: workerId } } }, { new: true })
    .then(job => {
      User.findById(worker).exec(function (err, data) {
        var arreglo = data.works
        for (var i = 0; i < arreglo.length; i++) {
          if (job._id != null && arreglo[i].workId.toString() == job._id.toString()) {
            arreglo.pull(arreglo[i]._id)
          }
        }

        data
          .save()
          .then(function (savedPost) {
            res.status(200).json({ job })
          })
          .catch(function (err) {
            res.status(500).send(err)
          })
      })
    })
    .catch(err => res.status(500).json({ err }))
}
