const { Router } = require('express')
const router = Router()
const { addExpense, updateExpense, deleteExpense } = require('../controllers/ExpenseControllers')

router.patch('/addexpense/:id', addExpense)
router.patch('/expenseupdate/:estimateId/:expenseId', updateExpense)
router.patch('/expensedelete/:estimateId/:expenseId', deleteExpense)

module.exports = router
