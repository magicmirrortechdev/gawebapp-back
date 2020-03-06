const crypto = require('crypto');
require('dotenv').config();
const User = require('../models/User')

const nodemailer = require('nodemailer');

module.exports = (app) => {
    app.post('/forgotpassword', (req, res) => {
        console.log(req.body.email)
        if (req.body.email === '') {
            res.status(400).send('email required');
        }
        console.error(req.body.email);
        User.findOne({ email: req.body.email }, ).then((user) => {
            if (user === null) {
                console.error('email not in database');
                res.status(403).send('email not in db');
            } else {
                const token = crypto.randomBytes(20).toString('hex')


                user.resetPasswordToken = token
                user.resetPasswordExpires = Date.now() + 3600000
                user.save(function(err) {
                    if (err) {
                        console.error('ERROR!');
                    }
                });





                const transporter = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: process.env.SGUSER,
                        pass: process.env.SGPASSWORD
                    },
                });

                const mailOptions = {
                    from: 'info@greenacorn.com',
                    to: `${user.email}`,
                    subject: 'Reset Password',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
                        `http://localhost:3001/reset/${token}\n\n` +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                };

                console.log('sending mail');

                transporter.sendMail(mailOptions, (err, response) => {
                    if (err) {
                        console.error('there was an error: ', err);
                    } else {
                        console.log('here is the res: ', response);
                        res.status(200).json('recovery email sent');
                    }
                });
            }
        });
    });
};