const { Router } = require('express')
const router = Router()
const { getAllExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/ExpenseControllers')

router.get('/getexpenses/:id', getAllExpenses)
router.patch('/addexpense/', createExpense)
router.patch('/expenseupdate/:id', updateExpense)
router.patch('/expensedelete/:id', deleteExpense)

module.exports = router
