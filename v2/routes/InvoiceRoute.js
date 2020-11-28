const { Router } = require('express')
const router = Router()
const {
  getInvoices,
  createInvoice,
  deleteInvoice,
  updateInvoice,
  sendInvoice2,
  acceptPayment,
} = require('../controllers/InvoiceControllers')

router.get('/getInvoices/:id', getInvoices)
router.patch('/convertinvoice/:id', createInvoice)
router.patch('/invoicedelete/:id', deleteInvoice)
router.patch('/invoiceupdate/:id', updateInvoice)
router.post('/sendinvoice', sendInvoice2)
router.patch('/pay-invoice/:id', acceptPayment)

module.exports = router
