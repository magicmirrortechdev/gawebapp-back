const { Router } = require('express')
const router = Router()
const { createEstimate, addPM, addWorkers, paidInvoice, estimateUpdate, deleteAll, getOneEstimate, getAllEstimates, getAllInvoices, getAllJobs, convertInvoice, convertJob, decline, addExpense } = require('../controllers/estimateControllers')



router.post('/addestimate', createEstimate);
router.get('/checkestimates', getAllEstimates);
router.get('/checkinvoices', getAllInvoices);
router.get('/checkjobs', getAllJobs);
router.patch('/convertinvoice/:id', convertInvoice);
router.patch('/convertjob/:id', convertJob);
router.patch('/estimatedecline/:id', decline);
router.delete('/estimatedelete/:id', deleteAll)
router.patch('/addexpense/:id', addExpense)
router.get('/estimatedetail/:id', getOneEstimate);
router.patch('/estimateupdate/:id', estimateUpdate)
router.patch('/paidinvoice/:id', paidInvoice)
router.patch('/addworkers/:id', addWorkers)
router.patch('/addpm/:id', addPM)



module.exports = router;