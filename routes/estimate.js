const { Router } = require('express')
const router = Router()
const { createEstimate, deleteAll, getAllEstimates, getAllInvoices, getAllJobs, convertInvoice, convertJob, decline, addExpense } = require('../controllers/estimateControllers')



router.post('/addestimate', createEstimate);
router.get('/checkestimates', getAllEstimates);
router.get('/checkinvoices', getAllInvoices);
router.get('/checkjobs', getAllJobs);
router.patch('/convertinvoice/:id', convertInvoice);
router.patch('/convertjob/:id', convertJob);
router.patch('/estimatedecline/:id', decline);
router.delete('/estimatedelete/:id', deleteAll)
router.patch('/addexpense/:id', addExpense)


module.exports = router;