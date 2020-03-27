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
        html: `
        <div style="width:100%; display: flex; flex-direction: column; align-items: center; padding-top:40px; padding-bottom: 40px;">
        <img src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585294569/ImagesGA/Captura_de_pantalla_2020-03-24_a_la_s_19.26.09_dtiixu.png" />
        <div style="width: 522px;">
            <p style="font-weight: bold; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 22px">Hello, ${name}</p>
            <p style="color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                This e-mail contains the estimate information that you requested from Green Acorn
            </p>
            <p style="font-weight: bold; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 22px">Comments:</p>
            <p style="color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                ${comments}
            </p>
            <p style="font-weight: bold; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 22px">Total Estimate:</p>

            <p style="color: #00A863; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                ${total} USD
            </p>
        </div>
        <hr style="width: 400px; border: 1px solid #DDDDDD; opacity: 1;">
        <div style="margin-top:0px">
            <p style="text-decoration: none; color: #00A863; font-family: Arial, Helvetica, sans-serif; font-size: 20px" href="http://">Want to make another estimate?</p>

        </div>
        <div style="width: 490px;">
            <p style="letter-spacing: 0;
            color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                Click on the following button to send us a request for another estimate.
            </p>
        </div>
        <button onclick="window.location.href='https://www.greenacorn.com/'" style="background-color: #00A863; font-size: 20px; color: white; border-radius: 4px; width: 214px; height: 43px;">Get free quote</button>
        <br>
        <br>
        <br>
        <hr style="width: 400px; border: 1px solid #DDDDDD; opacity: 1;">
        <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; align-content: space-around; ">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_2_snkfws.png" alt="elite">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_3_gveepq.png" alt="houzz">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_4_zkdowq.png" alt="accredited">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_5_uapttm.png" alt="accredited">

        </div>
        <br>
        <br>
        <br>
        <br>

        <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; align-content: space-around; ">
            <a href="https://www.facebook.com/GreenAcornContracting/">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_6_tdwknw.png" alt="elite">
            </a>
            <a href="https://www.instagram.com/greenacorncontracting/">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_7_oozhoi.png" alt="houzz">
            </a>
            <a href="https://twitter.com/GreenAcornC/">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_8_t6zdai.png" alt="accredited">
            </a>
            <a href="https://www.pinterest.com.mx/greenacorncontracting/">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297018/ImagesGA/assets/Imagen_9_o7ixka.png" alt="accredited">
            </a>
        </div>
        <br>
        <br>
        <div style="font-family: Arial, Helvetica, sans-serif; text-align: center; flex-direction: column; width: 230px; display: flex; justify-content: center; align-items: center; align-content: center;">
            <p style="font-size: 12px; color:#707070;">Green Acorn</p>
            <p style="font-size: 12px; color:#707070;">809 N. West St</p>
            <p style="font-size: 12px; color:#707070;">Raleigh, NC 27603 (919) 600-0199</p>
            <p style="font-size: 12px; color:#707070;"><a href="https://www.greenacorn.com/privacy-policy">Privacy Policy</a> | <a href="https://www.greenacorn.com/terms">Terms of Use</a> </p>
            <p style="font-size: 12px; color:#707070;">©2020 Green Acorn</p>
        </div>

    </div>

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
        html: `
        
        <p style="color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
        Date: ${date}
        </p>
        <div style="width:100%; display: flex; flex-direction: column;align-items: center; padding-top:40px; padding-bottom: 40px;">
        <img src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585294569/ImagesGA/Captura_de_pantalla_2020-03-24_a_la_s_19.26.09_dtiixu.png" />
        <div style="width: 522px;">
            <p style="font-weight: bold; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 22px">Hello, ${name}</p>
            <p style="color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                This e-mail contains the details of the invoice for the work done.
            </p>
            <p style="font-weight: bold; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 22px">Comments:</p>
            <p style="color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                ${description}
            </p>
            <p style="font-weight: bold; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 22px">Total Invoice:</p>

            <p style="color: #00A863; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                ${total} USD
            </p>
        </div>
        <hr style="width: 400px; border: 1px solid #DDDDDD; opacity: 1;">
        <div style="margin-top:0px">
            <p style="text-decoration: none; color: #00A863; font-family: Arial, Helvetica, sans-serif; font-size: 20px" href="http://">Want to quote another job?</p>

        </div>
        <div style="width: 490px;">
            <p style="letter-spacing: 0;
            color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                Click on the following button to send us a request for another estimate.
            </p>
        </div>
        <button onclick="window.location.href='https://www.greenacorn.com/'" style="background-color: #00A863; font-size: 20px; color: white; border-radius: 4px; width: 214px; height: 43px;">Get free quote</button>
        <br>
        <br>
        <br>
        <hr style="width: 400px; border: 1px solid #DDDDDD; opacity: 1;">
        <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; align-content: space-around; ">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_2_snkfws.png" alt="elite">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_3_gveepq.png" alt="houzz">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_4_zkdowq.png" alt="accredited">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_5_uapttm.png" alt="accredited">

        </div>
        <br>
        <br>
        <br>
        <br>

        <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; align-content: space-around; ">
            <a href="https://www.facebook.com/GreenAcornContracting/">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_6_tdwknw.png" alt="elite">
            </a>
            <a href="https://www.instagram.com/greenacorncontracting/">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_7_oozhoi.png" alt="houzz">
            </a>
            <a href="https://twitter.com/GreenAcornC/">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_8_t6zdai.png" alt="accredited">
            </a>
            <a href="https://www.pinterest.com.mx/greenacorncontracting/">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297018/ImagesGA/assets/Imagen_9_o7ixka.png" alt="accredited">
            </a>
        </div>
        <br>
        <br>
        <div style="font-family: Arial, Helvetica, sans-serif; text-align: center; flex-direction: column; width: 230px; display: flex; justify-content: center; align-items: center; align-content: center;">
            <p style="font-size: 12px; color:#707070;">Green Acorn</p>
            <p style="font-size: 12px; color:#707070;">809 N. West St</p>
            <p style="font-size: 12px; color:#707070;">Raleigh, NC 27603 (919) 600-0199</p>
            <p style="font-size: 12px; color:#707070;"><a href="https://www.greenacorn.com/privacy-policy">Privacy Policy</a> | <a href="https://www.greenacorn.com/terms">Terms of Use</a> </p>
            <p style="font-size: 12px; color:#707070;">©2020 Green Acorn</p>
        </div>

    </div>
        `
    })
}