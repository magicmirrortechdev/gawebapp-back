const { Router } = require('express')
const router = Router()
const { getAllInvoices } = require('../controllers/invoiceControllers')

router.get('/checkinvoices', getAllInvoices);


module.exports = router;