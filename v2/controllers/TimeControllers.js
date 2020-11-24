const Time = require('../models/TimeV2')

exports.createTime = (req, res, next) => {
  const { jobId, userId, date, vendor, category, description, image, total } = req.body
  Time.create({ jobId, userId, date, vendor, category, description, image, total })
    .then(time => res.status(200).json({ time }))
    .catch(err => res.status(500).json({ err }))
}

exports.getAllTimes = (req, res, next) => {
  Time.find()
    .lean()
    .populate('jobId')
    .populate('userId')
    .then(times => res.status(200).json({ times }))
    .catch(err => res.status(500).json({ err }))
}

exports.getOneTime = (req, res, next) => {
  const { id } = req.params
  Time.findById(id)
    .populate('jobId')
    .populate('userId')
    .then(time => res.status(200).json({ time }))
    .catch(err => res.status(500).json({ err }))
}

exports.updateTime = async (req, res, next) => {
  const { id } = req.params
  Time.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(time => res.status(200).json({ time }))
    .catch(err => res.status(500).json({ err }))
}

exports.deleteTime = (req, res, next) => {
  const { id } = req.params
  Time.findByIdAndDelete(id)
    .then(time => res.status(200).json({ time }))
    .catch(err => res.status(500).json({ err }))
}
