const { Router } = require('express')
const router = Router()
const { getAllTimes, createTime, updateTime, deleteTime, getOneTime } = require('../controllers/TimeControllers')

router.get('/gettimes/:id', getAllTimes)
router.patch('/addtime/', createTime)
router.patch('/updatetime/:id', updateTime)
router.patch('/deletetime/:id', deleteTime)

module.exports = router
