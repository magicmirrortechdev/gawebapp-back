const { Router } = require('express')
const router = Router()
const passport = require('../config/passport')
const { signup, login, addHours, logout, oneWorker, deleteWorker, updateWorker, createUser, workerUsers, pmUsers, getAllUsers } = require('../controllers/userControllers')

router.post('/signup', signup);

router.post('/login', passport.authenticate('local'), login);

router.post('/addworker', createUser)
router.get('/getusers', getAllUsers)
router.get('/workers', workerUsers)
router.get('/projectm', pmUsers)
router.get('/workerdetail/:id', oneWorker)
router.patch('/updateworker/:id', updateWorker)
router.delete('/deleteworker/:id', deleteWorker)

router.get('/logout', logout);

router.get('/profile', isAuth, (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => res.status(200).json({ user }))
        .catch((err) => res.status(500).json({ err }));
});

function isAuth(req, res, next) {
    req.isAuthenticated() ? next() : res.status(401).json({ msg: 'Log in first' });
}

module.exports = router;