const Time = require('../models/TimeV2')
const User = require('../models/UserV2')

exports.createTime = (req, res, next) => {
  const { jobId, userId, date, vendor, category, description, image, total } = req.body
  Time.create({ jobId, userId, date, vendor, category, description, image, total })
    .then(time => res.status(200).json({ time }))
    .catch(err => res.status(500).json({ err }))
}

exports.getAllTimes = async (req, res, next) => {
  const { id } = req.params
  let data = {}
  let user = null
  if (id) {
    user = await User.findById(id)
  }
  if (user && user.level !== 4) {
    data = { userId: id }
  }
  Time.find(data)
    .lean()
    .then(times => res.status(200).json({ times }))
    .catch(err => res.status(500).json({ err }))
}

exports.getOneTime = (req, res, next) => {
  const { id } = req.params
  Time.findById(id)
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
    .then(time => res.status(200).json({ ok: 1 }))
    .catch(err => res.status(500).json({ err }))
}
