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
        Ryan has added you to the Green Acorn application. 
        Click below to access your account
        </p>
        `

    })
}

exports.sendEstimate = (name, items, total, comments, tags) => {
    let addresses = tags.map((e, i) => {
        return e.id
    })
    const nameItems = items.map((e, i) => {
        return e.itemName
    })
    const description = items.map((e, i) => {
        return e.description
    })
    const quantity = items.map((e, i) => {
        return e.quantity
    })
    const rate = items.map((e, i) => {
        return e.rate
    })
    const subtotal = items.reduce((acc, current, i) => acc + current.subtotal, 0)

    let email = addresses.map((e, i) => {
        return e
    })
    return transporter.sendMail({
        from: '"Green Acorn" <contact@greenacorn.com>',
        to: email,
        subject: 'Your Estimate',
        html: `<h2>Hello ${name}</h2>
        <p>
        This email contains the estimate information you requested from Green Acorn
        </p>
        <h4>Comments:</h4> 
        <p>${comments}</p>
        <h4>Total Estimate:</h4> <p>$ ${total} USD</p>
        `

    })

}

exports.sendInvoice = (name, date, total, description, tags) => {
    let addresses = tags.map((e, i) => {
        return e.id
    })
    let email = addresses.map((e, i) => {
        return e
    })
    return transporter.sendMail({
        from: '"Green Acorn" <contact@greenacorn.com>',
        to: email,
        subject: 'Your Invoice',
        html: `<h2>Hello ${name}</h2>
        <p>
        Date: ${date}
        </p>
        <p>
        This email contains the details of the invoice for the work done
        </p>
        <h4>Description:</h4> 
        <p>${description}</p>
        <h4>Total Invoice:</h4> <p>$ ${total} USD</p>
        `
    })
}