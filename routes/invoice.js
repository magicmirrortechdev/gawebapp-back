const { Router } = require('express')
const router = Router()
const { getAllInvoices, deleteInvoice } = require('../controllers/invoiceControllers')

router.get('/checkinvoices', getAllInvoices)
router.delete('/deleteinvoice', deleteInvoice);


module.exports = router;