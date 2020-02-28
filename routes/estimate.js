const { Router } = require('express')
const router = Router()
const { createEstimate, acceptPayment, deleteInvoice, createInvoice, addPM, oneJob, addTime, addWorkers, paidInvoice, estimateUpdate, deleteAll, getOneEstimate, getAllEstimates, getAllInvoices, getAllJobs, convertInvoice, convertJob, decline, addExpense } = require('../controllers/estimateControllers')



router.post('/addestimate', createEstimate);
router.get('/checkestimates', getAllEstimates);
router.get('/checkjobs', getAllJobs);
router.patch('/convertinvoice/:id', createInvoice);
router.patch('/convertjob/:id', convertJob);
router.patch('/estimatedecline/:id', decline);
router.delete('/estimatedelete/:id', deleteAll)
router.patch('/invoicedelete/:estimateId/:id', deleteInvoice)
router.patch('/addexpense/:id', addExpense)
router.get('/estimatedetail/:id', getOneEstimate);
router.patch('/estimateupdate/:id', estimateUpdate)
router.patch('/paidinvoice/:id', paidInvoice)
router.patch('/addworkers/:id', addWorkers)
router.patch('/addpm/:id', addPM)
router.patch('/addtime/:id/:workerId', addTime)
router.patch('/pay-invoice/:id/:invoiceId', acceptPayment)



module.exports = router;