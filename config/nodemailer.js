require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: process.env.SGUSER,
        pass: process.env.SGPASSWORD
    }
})

exports.sendEmail = (email, name, msg, password) => {
    return transporter.sendMail({
        from: '"Green Acorn" <contact@greenacorn.com>',
        to: email,
        subject: 'Welcome to Green Acorn App',
        html: `<h1>Hello ${name}</h1>
        <p>
        Your password is: ${password}
        Ryan has added you to the Green Acorn application shortly will contact you to provide your password
        </p>
        `

    })
  }