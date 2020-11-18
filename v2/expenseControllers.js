const Expense = require('../denormalized_models/Expense')

exports.createExpense = (req, res, next) => {
  Expense.create({ ...req.body })
    .then(expense => res.status(200).json({ expense }))
    .catch(err => res.status(500).json({ err }))
}

exports.getAllExpenses = (req, res, next) => {
  Expense.find()
    .lean()
    .populate('jobId')
    .populate('userId')
    .then(expenses => res.status(200).json({ expenses }))
    .catch(err => res.status(500).json({ err }))
}

exports.getOneExpense = (req, res, next) => {
  const { id } = req.params
  Expense.findById(id)
    .populate('jobId')
    .populate('userId')
    .then(expense => res.status(200).json({ expense }))
    .catch(err => res.status(500).json({ err }))
}

exports.updateExpense = async (req, res, next) => {
  const { id } = req.params
  Expense.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(expense => res.status(200).json({ expense }))
    .catch(err => res.status(500).json({ err }))
}

exports.deleteExpense = (req, res, next) => {
  const { id } = req.params
  Expense.findByIdAndDelete(id)
    .then(expense => res.status(200).json({ expense }))
    .catch(err => res.status(500).json({ err }))
}
