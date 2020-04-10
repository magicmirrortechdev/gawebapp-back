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

exports.sendEstimate = (name, items, total, comments, tags, address) => {
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
        const nameOne = nameItems.map((e, i) => {
            return e
        })
        console.log('ElName', nameOne)

        let dataTable = "";
        items.map((e,i) => {
            dataTable +=`
            <tr style="border: 0.5px solid black;">
                <td style="border: 0.5px solid black;">${e.quantity}</td>
                <td style="border: 0.5px solid black;">${e.itemName}</td>
                <td style="border: 0.5px solid black;">${e.description}</td>
                <td style="border: 0.5px solid black;">${e.rate}</td>
                <td style="border: 0.5px solid black;">${e.rate*e.quantity}</td>
                <td style="border: 0.5px solid black;"> - - - </td>
            </tr>`;
        });

    return transporter.sendMail({
        from: '"Green Acorn" <contact@greenacorn.com>',
        to: email,
        subject: 'Your Estimate',
        html: `
        <div style="width: 100%; text-align: center; position: absolute;">
        <div style="background-color: white; width: 100%;">
            <img src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585294569/ImagesGA/Captura_de_pantalla_2020-03-24_a_la_s_19.26.09_dtiixu.png" alt="logo">
            <p style="color: rgb(34, 161, 242); font-size: 30px; font-family: Arial, Helvetica, sans-serif; margin-top: 0;">Sent you an estimate</p>
        </div>
        <div style="display: table; width:100%;">
            <div style="display: table-cell; width: 25%;">
                <p style="padding-left: 50%; font-family:Arial, Helvetica, sans-serif; font-size: 14px; ">
                    To:
                </p>
                <p style="padding-left: 60%; font-family:Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold;">
                    ${name}
                </p>
                <p style="padding-left: 60%; font-family:Arial, Helvetica, sans-serif; font-size: 14px">
                    ${address}
                </p>
            </div>
            <div style="display: table-cell; width: 25%;">
                <p style="padding-right: 40%; font-family:Arial, Helvetica, sans-serif; font-size: 14px">
                    From:
                </p>
                <p style="padding-right: 40%; font-family:Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold;">
                    Green Acorn Contracting LLC
                </p>
                <p style="padding-right: 50%; font-family:Arial, Helvetica, sans-serif; font-size: 14px">
                    514 Daniels St, #217 <br> Raleigh, NC 27605
                </p>
            </div>
        </div>
        <br>
        <div style="display: table; width:100%;">
            <div style="display: table-cell; width: 25%;">
                <p style="padding-left: 50%; font-family:Arial, Helvetica, sans-serif; font-size: 14px; ">
                    Description of work:
                </p>
            </div>
            <div style="display: table-cell; width: 25%;">
                <p style="padding-right:60%; margin-bottom: 0px;font-family:Arial, Helvetica, sans-serif; font-size: 14px">
                    Total Estimate:
                </p>
                <p style="padding-right:60%; margin-top: 0px;  font-family:Arial, Helvetica, sans-serif; font-size: 24px; font-weight: bold; color:rgb(34, 161, 242)">
                    $ ${total} USD
                </p>
            </div>
        </div>
        <br>
        <br>
        <div style="display: table; width:100%; ">
            <table style="border-collapse:collapse; margin-left: 30%">
                <thead>
                    <tr style="font-family:Arial, Helvetica, sans-serif; background-color: rgb(243, 243, 243);">
                        <th style="border: 0.5px black solid;">Qty</th>
                        <th style="border: 0.5px black solid;">Name</th>
                        <th style="border: 0.5px black solid;">Description</th>
                        <th style="border: 0.5px black solid;">Rate</th>
                        <th style="border: 0.5px black solid;">Amount</th>
                        <th style="border: 0.5px black solid;">Tax</th>
                    </tr>
                </thead>
                <tbody>
                   ${dataTable}
                </tbody>
            </table>
        </div>
        <br>
        <div>
            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 18px;">
                If this estimate meets your approval, please click the "Approve" button below.<br> Otherwise, you can reply to this email with any questions.
            </p>
        </div>
        <br>
        <div>
            <button style="border: none; font-family: Arial, Helvetica, sans-serif; width: 300px; height: 70px; background-color: rgb(34, 161, 242); color: white; font-size: 18px;">Approve Estimate</button>
        </div>
        <br>
        <br>
        <hr style="width:45%">
        <div>
            <span style="font-family: Arial, Helvetica, sans-serif; font-size: 30px; ">          
              THANK YOU
          </span>
            <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: rgb(34, 161, 242); ">for considering Green Acorn Contracting LLC</span>
        </div>
        <hr style="width:45%">


    </div>
        `

    })

}

exports.sendInvoice = (name, date, total, description, tags, urlPay) => {
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
        html: `
        <div style="width: 100%; text-align: center; position: absolute;">
        <div style="background-color: white; width: 100%;">
            <img src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585294569/ImagesGA/Captura_de_pantalla_2020-03-24_a_la_s_19.26.09_dtiixu.png" alt="logo">
            <p style="color: rgb(34, 161, 242); font-size: 30px; font-family: Arial, Helvetica, sans-serif; margin-top: 0;">Sent you an Invoice</p>
        </div>
        <div style="display: table; width:100%;">
            <div style="display: table-cell; width: 25%;">
                <p style="padding-left: 50%; font-family:Arial, Helvetica, sans-serif; font-size: 14px; ">
                    To:
                </p>
                <p style="padding-left: 60%; font-family:Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold;">
                    ${name}
                </p>
                <p style="padding-left: 60%; font-family:Arial, Helvetica, sans-serif; font-size: 14px">
                    direcc
                </p>
            </div>
            <div style="display: table-cell; width: 25%;">
                <p style="padding-right: 40%; font-family:Arial, Helvetica, sans-serif; font-size: 14px">
                    From:
                </p>
                <p style="padding-right: 40%; font-family:Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold;">
                    Green Acorn Contracting LLC
                </p>
                <p style="padding-right: 50%; font-family:Arial, Helvetica, sans-serif; font-size: 14px">
                    514 Daniels St, #217 <br> Raleigh, NC 27605
                </p>
            </div>
        </div>
        <br>
        <div style="display: table; width:100%;">
            <div style="display: table-cell; width: 25%;">
                <p style="padding-left: 50%; font-family:Arial, Helvetica, sans-serif; font-size: 14px; ">
                    Description of work:
                </p>
            </div>
            <div style="display: table-cell; width: 25%;">
                <p style="padding-right:60%; margin-bottom: 0px;font-family:Arial, Helvetica, sans-serif; font-size: 14px">
                    Total Due:
                </p>
                <p style="padding-right:60%; margin-top: 0px;  font-family:Arial, Helvetica, sans-serif; font-size: 24px; font-weight: bold; color:rgb(34, 161, 242)">
                    $ ${total} USD
                </p>
            </div>
        </div>
        <br>
        <br>
        <div style="display: table; width:100%; ">
            <table style="border-collapse:collapse; margin-left: 40%">
                <thead>
                    <tr style="font-family:Arial, Helvetica, sans-serif; background-color: rgb(243, 243, 243);">
                        <th style="border: 0.5px black solid;">Qty</th>
                        <th style="border: 0.5px black solid;">Name</th>
                        <th style="border: 0.5px black solid;">Description</th>
                        <th style="border: 0.5px black solid;">Rate</th>
                        <th style="border: 0.5px black solid;">Amount</th>
                        <th style="border: 0.5px black solid;">Tax</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="font-family:Arial, Helvetica, sans-serif;">
                        <td style="border: 0.5px solid black;"></td>
                        <td style="border: 0.5px solid black;"></td>
                        <td style="border: 0.5px solid black;"></td>
                        <td style="border: 0.5px solid black;"></td>
                        <td style="border: 0.5px solid black;"></td>
                        <td style="border: 0.5px solid black;">NON</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br>
        <div>
            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 18px;">
                You may pay your invoice here
            </p>
        </div>
        <br>
        <div>
            <a href="${urlPay}" style="padding: 20px;text-decoration: none;border: none; font-family: Arial, Helvetica, sans-serif; width: 300px; height: 70px; background-color: rgb(34, 161, 242); color: white; font-size: 18px;">Pay Online</a>
        </div>
        <br>

        <div>
            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 18px;">
                Questions or concerns? Call us at or reply to this email.
            </p>
        </div>
        <br>
        <br>
        <hr style="width:45%">
        <div>
            <span style="font-family: Arial, Helvetica, sans-serif; font-size: 30px; ">          
              THANK YOU
            </span>
            <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: rgb(34, 161, 242); ">for considering Green Acorn Contracting LLC</span>
        </div>
        <hr style="width:45%">
    </div>
        `
    })
}