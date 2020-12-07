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
