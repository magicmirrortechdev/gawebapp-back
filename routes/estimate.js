const { Router } = require('express')
const router = Router()
const { createEstimate, deleteWorker, filterDate, createJob, getJobsClose, getJobsOpen, updateExpense, closeJob, sendInvoice, sendEstimate, updateInvoice, deleteExpense, acceptPayment, deleteInvoice, createInvoice, addPM, oneJob, addTime, addWorkers, paidInvoice, estimateUpdate, deleteAll, getOneEstimate, getAllEstimates, getAllInvoices, getAllJobs, convertInvoice, convertJob, decline, addExpense, addArgyleCharge } = require('../controllers/estimateControllers')



router.post('/addestimate', createEstimate);
router.post('/createjob', createJob);
router.get('/checkestimates', getAllEstimates);
router.get('/checkjobs', getAllJobs);
router.get('/openjobs', getJobsOpen);
router.post('/filterdate', filterDate)
router.get('/closejobs', getJobsClose);
router.patch('/closejob/:id', closeJob);
router.patch('/convertinvoice/:id', createInvoice);
router.get('/convertjob/:id', convertJob);
router.patch('/estimatedecline/:id', decline);
router.delete('/estimatedelete/:id', deleteAll)
router.patch('/invoicedelete/:estimateId/:id', deleteInvoice)
router.patch('/invoiceupdate/:estimateId/:invoiceId', updateInvoice)
router.patch('/expenseupdate/:estimateId/:expenseId', updateExpense)
router.patch('/expensedelete/:estimateId/:expenseId', deleteExpense)
router.patch('/workerdelete/:estimateId/:workerId', deleteWorker)
router.patch('/addexpense/:id', addExpense)
router.post('/sendestimate', sendEstimate);
router.post('/sendinvoice', sendInvoice);
router.get('/estimatedetail/:id', getOneEstimate);
router.patch('/estimateupdate/:id', estimateUpdate)
router.patch('/paidinvoice/:id', paidInvoice)
router.patch('/addworkers/:id', addWorkers)
router.patch('/addpm/:id', addPM)
router.patch('/addtime/:id/:workerId', addTime)
router.patch('/pay-invoice/:id/:invoiceId', acceptPayment)

module.exports = router;