const Expense = require('../models/ExpenseV2')
const User = require('../models/UserV2')

exports.createExpense = (req, res, next) => {
  Expense.create({ ...req.body })
    .then(expense => res.status(200).json({ expense }))
    .catch(err => res.status(500).json({ err }))
}

exports.getAllExpenses = async (req, res, next) => {
  const { id } = req.params
  let data = {}
  let user = null
  if (id) {
    user = await User.findById(id)
  }
  if (user && user.level !== 4) {
    data = { userId: id }
  }
  Expense.find(data)
    .lean()
    .then(expenses => res.status(200).json({ expenses }))
    .catch(err => res.status(500).json({ err }))
}

exports.addExpense = async (req, res, next) => {
  const { id } = req.params
  const { date, vendor, category, description, img, total, workerId } = req.body

  const estimate = await Estimate.findByIdAndUpdate(
    id,
    { $push: { expenses: { date, vendor, category, description, img, total, workerId } } },
    { new: true }
  )
    .populate('clientId')
    .populate({ path: 'workerId' })
  Expense.create(workerId, {
    $push: { expenses: { jobName: estimate.jobName, date, vendor, category, description, img, total } },
  })
    .then(user => res.status(200).json({ estimate, user }))
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
