const { Router } = require('express')
const router = Router()
const passport = require('../config/passport')
const { signup, login, createUser, getAllUsers } = require('../controllers/userControllers')

router.post('/signup', signup);

router.post('/login', passport.authenticate('local'), login);

router.post('/addworker', createUser)
router.get('/getusers', getAllUsers)

router.get('/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({ msg: 'Logged out' });
});

router.get('/profile', isAuth, (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => res.status(200).json({ user }))
        .catch((err) => res.status(500).json({ err }));
});

function isAuth(req, res, next) {
    req.isAuthenticated() ? next() : res.status(401).json({ msg: 'Log in first' });
}

module.exports = router;