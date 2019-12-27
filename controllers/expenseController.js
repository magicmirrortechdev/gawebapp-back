const Expense = require('../models/Expense')


exports.getAllExpenses = (req, res, next) => {
    Expense.find()
        .then(expenses => res.status(200).json({ expenses }))
        .catch(err => res.status(500).json({ err }))
}