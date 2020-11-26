const { Router } = require('express')
const router = Router()
const {
  createInvoice,
  deleteInvoice,
  updateInvoice,
  sendInvoice2,
  acceptPayment,
} = require('../controllers/InvoiceControllers')

router.patch('/convertinvoice/:id', createInvoice)
router.patch('/invoicedelete/:estimateId/:id', deleteInvoice)
router.patch('/invoiceupdate/:estimateId/:invoiceId', updateInvoice)
router.post('/sendinvoice', sendInvoice2)
router.patch('/pay-invoice/:id/:invoiceId', acceptPayment)

module.exports = router
