const { Router } = require('express')
const router = Router()
const {
  createEstimate,
  getJobsUser,
  getUserEstimate,
  getAllEstimates,
  deleteWorker,
  createJob,
  closeJob,
  sendEstimateC,
  getOneJob,
  addPM,
  addWorkers,
  paidInvoice,
  estimateUpdate,
  deleteAll,
  getAllJobs,
  convertJob,
  decline,
} = require('../controllers/JobControllers')

router.post('/addestimate', createEstimate)
router.post('/createjob', createJob)
router.get('/checkestimates/', getAllEstimates)
router.get('/checkestimates/:id', getUserEstimate)
router.get('/checkjobs', getAllJobs)
router.get('/checkjobs/:id', getJobsUser)

router.patch('/closejob/:id', closeJob)
router.get('/convertjob/:id', convertJob)

router.patch('/estimatedecline/:id', decline)
router.delete('/estimatedelete/:id', deleteAll)
router.post('/sendestimate', sendEstimateC)
router.get('/estimatedetail/:id', getOneJob)
router.patch('/estimateupdate/:id', estimateUpdate)
router.patch('/addworkers/:id', addWorkers)
router.patch('/addpm/:id', addPM)
router.patch('/workerdelete/:estimateId/:workerId', deleteWorker)
router.patch('/paidinvoice/:id', paidInvoice)

module.exports = router
