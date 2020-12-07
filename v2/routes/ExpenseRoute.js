const { Router } = require('express')
const router = Router()
const { getAllExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/ExpenseControllers')

router.get('/getexpenses/:id', getAllExpenses)
router.patch('/addexpense/', createExpense)
router.patch('/expenseupdate/:estimateId/:expenseId', updateExpense)
router.patch('/expensedelete/:estimateId/:expenseId', deleteExpense)

module.exports = router
