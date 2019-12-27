const { Router } = require('express')
const router = Router()
const { getAllExpenses } = require('../controllers/expenseController')



router.get('/checkexpenses', getAllExpenses);


module.exports = router;