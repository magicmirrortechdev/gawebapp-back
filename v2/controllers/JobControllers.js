const Job = require('../models/JobsV2')

exports.createJob = (req, res, next) => {
  Job.create({ ...req.body })
    .then(job => res.status(200).json({ job }))
    .catch(err => res.status(500).json({ err }))
}

exports.getAllJobs = (req, res, next) => {
  Job.find()
    .lean()
    .populate('clientId')
    .populate({ path: 'workers.workerId' })
    .then(jobs => res.status(200).json({ jobs }))
    .catch(err => res.status(500).json({ err }))
}

exports.getOneJob = (req, res, next) => {
  const { id } = req.params
  Job.findById(id)
    .populate('clientId')
    .populate({ path: 'workers.workerId' })
    .then(job => res.status(200).json({ job }))
    .catch(err => res.status(500).json({ err }))
}

exports.getSentJobs = (req, res, next) => {
  Job.find({ isSent: true })
    .lean()
    .populate('jobId')
    .populate('userId')
    .then(jobs => res.status(200).json({ jobs }))
    .catch(err => res.status(500).json({ err }))
}
exports.getAcceptedJobs = (req, res, next) => {
  Job.find({ isAccepted: true })
    .lean()
    .populate('clientId')
    .populate({ path: 'workers.workerId' })
    .then(jobs => res.status(200).json({ jobs }))
    .catch(err => res.status(500).json({ err }))
}

exports.getIsJob = (req, res, next) => {
  Job.find({ isJob: true })
    .lean()
    .populate('clientId')
    .populate({ path: 'workers.workerId' })
    .then(jobs => res.status(200).json({ jobs }))
    .catch(err => res.status(500).json({ err }))
}

exports.updateJob = async (req, res, next) => {
  const { id } = req.params
  Job.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(Job => res.status(200).json({ Job }))
    .catch(err => res.status(500).json({ err }))
}

exports.deleteJob = (req, res, next) => {
  const { id } = req.params
  Job.findByIdAndDelete(id)
    .then(Job => res.status(200).json({ Job }))
    .catch(err => res.status(500).json({ err }))
}
