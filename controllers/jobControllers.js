const Job = require('../models/Job')


exports.createJob = (req, res, next) => {

    Job.create({...req.body })
        .then(client => res.status(201).json({ client }))
        .catch(err => res.status(500).json({ err }))
}

exports.getAllJobs = (req, res, next) => {
    Job.find()
        .then(jobs => res.status(200).json({ jobs }))
        .catch(err => res.status(500).json({ err }))
}