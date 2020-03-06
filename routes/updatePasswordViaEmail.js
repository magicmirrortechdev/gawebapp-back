const User = require('../models/User')


module.exports = app => {

    app.put('/updatepasswordviaemail', (req, res) => {
        console.log(req.body.password)
        User.findOne({
                resetPasswordToken: req.body.resetPasswordToken,
                resetPasswordExpires: {
                    $gt: Date.now(),
                }
            })
            .then((u) => {
                u.setPassword(req.body.password, (err, u) => {
                    if (err) return next(err);
                    u.save();
                    res.status(200).json({ message: 'password change successful' });
                });
            })
    });
};