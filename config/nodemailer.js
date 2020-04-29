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
    items.map((e, i) => {
        dataTable += `
            <tr>
                <td style="text-align:center;">${e.quantity}</td>
                <td style="text-align:center;">${e.itemName}</td>
                <td style="text-align:center;">${e.description}</td>
                <td style="text-align:center;">${e.rate}</td>
                <td style="text-align:center;">${e.rate*e.quantity}</td>
                <td style="text-align:center;"> - - - </td>
            </tr>`;
    });

    return transporter.sendMail({
        from: '"Green Acorn" <contact@greenacorn.com>',
        to: email,
        subject: 'Your Estimate',
        html: `
        <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Estimate</title>
    <style>
        .main {
            position: absolute;
            padding-left: 25%;
            width: 100%;
            padding-top: 40px;
            padding-bottom: 40px;
        }
        
        .secondary {
            width: 522px;
        }
        
        .title1 {
            font-weight: bold;
            color: #707070;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 22px;
        }
        
        .subtitle1 {
            color: #707070;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 20px
        }
        
        .content1 {
            margin-left: 120px;
            margin-top: -5px
        }
        
        .content2 {
            font-family: Arial, Helvetica, sans-serif;
            text-align: center;
            width: 230px;
            margin-left: 100px;
        }
    </style>
</head>

<body>
    <div class="main">
        <img src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585294569/ImagesGA/Captura_de_pantalla_2020-03-24_a_la_s_19.26.09_dtiixu.png" />
        <div class="secondary">
            <p class="title1">Hello, ${name}!</p>
            <p class="subtitle1">
                This e-mail contains the estimate information that you requested from Green Acorn
            </p>
            <p class="title1">Description:</p>
            <table style="text-align:center; width: 100%;border-style: solid; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px;  border-collapse:collapse;">
                <thead>
                    <tr style="text-align:center; border-style: solid; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; font-family:Arial, Helvetica, sans-serif; background-color: rgb(243, 243, 243);">
                        <th style="text-align:center; font-weight:normal;">Qty</th>
                        <th style="text-align:center; font-weight:normal;">Name</th>
                        <th style="text-align:center; font-weight:normal;">Description</th>
                        <th style="text-align:center; font-weight:normal;">Rate</th>
                        <th style="text-align:center; font-weight:normal;">Amount</th>
                        <th style="text-align:center; font-weight:normal;">Tax</th>
                    </tr>
                </thead>       
                <tbody>
                ${dataTable}
                </tbody>
            </table>
            <p class="title1">Total Estimate:</p>
            <p style="color: #00A863; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                ${total} USD
            </p>
        </div>

        <div style="margin-top:0px">
            <br/>
            <p style="text-decoration: none; color: #00A863; font-family: Arial, Helvetica, sans-serif; font-size: 20px" href="http://">Want to make another estimate?</p>
        </div>
        <div style="width: 490px;">
            <p style="letter-spacing: 0; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                Click on the following button to send us a request for another estimate.
            </p>
        </div>
        <button onclick="window.location.href='https://www.greenacorn.com/'" style="background-color: #00A863; margin-left:100px; font-size: 20px; color: white; border-radius: 4px; width: 214px; height: 43px;">Get free quote</button>
        <br>
        <br>
        <br>

        <div>
            <br>
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_2_snkfws.png" alt="elite">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_3_gveepq.png" alt="houzz">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_4_zkdowq.png" alt="accredited">
            <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_5_uapttm.png" alt="accredited">
        </div>
        <br>
        <br>
        <br>
        <br>
        <div class="content1">
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
        <div class="content2">
            <p style="font-size: 12px; color:#707070;">Green Acorn</p>
            <p style="font-size: 12px; color:#707070;">809 N. West St</p>
            <p style="font-size: 12px; color:#707070;">Raleigh, NC 27603 (919) 600-0199</p>
            <p style="font-size: 12px; color:#707070;"><a href="https://www.greenacorn.com/privacy-policy">Privacy Policy</a> | <a href="https://www.greenacorn.com/terms">Terms of Use</a> </p>
            <p style="font-size: 12px; color:#707070;">©2020 Green Acorn</p>
        </div>
    </div>

</body>
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
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Estimate</title>
        <style>
            .main {
                position: absolute;
                padding-left: 25%;
                width: 100%;
                padding-top: 40px;
                padding-bottom: 40px;
            }
            
            .secondary {
                width: 522px;
            }
            
            .title1 {
                font-weight: bold;
                color: #707070;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 22px;
            }
            
            .subtitle1 {
                color: #707070;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 20px
            }
            
            .content1 {
                margin-left: 120px;
                margin-top: -5px
            }
            
            .content2 {
                font-family: Arial, Helvetica, sans-serif;
                text-align: center;
                width: 230px;
                margin-left: 100px;
            }
        </style>
    </head>
    
    <body>
        <div class="main">
            <img src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585294569/ImagesGA/Captura_de_pantalla_2020-03-24_a_la_s_19.26.09_dtiixu.png" />
            <div style="width: 522px;">
                <p style="font-weight: bold; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 22px">Hello, ${name}</p>
                <p style="color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                    This e-mail contains the details of the invoice for the work done.
                </p>
                <p style="font-weight: bold; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 22px">Description:</p>
                <p style="color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                    ${description}
                </p>
                <p style="font-weight: bold; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 22px">Total Invoice:</p>
                <p style="color: #00A863; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                    ${total} USD
                </p>
            </div>
            <br>
    
            <div style="width: 522px;">
                <a href="${urlPay}" style=" margin-left:150px;padding: 20px;text-decoration: none;border: none; font-family: Arial, Helvetica, sans-serif; border-radius: 4px;  background-color: #00A863; color: white; font-size: 18px;">Pay Invoice</a>
                <br>
                <p style="margin-top: 25px; color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 13px">
                    You may pay your invoice here. If you have any questions, please reply to this e-mail or call us at: (919) 600-0199
                </p>
            </div>
            <br>
            <br>
            <div style="margin-top:0px">
                <p style=" margin-left:60px; text-decoration: none; color: #00A863; font-family: Arial, Helvetica, sans-serif; font-size: 20px" href="http://">Want to make another estimate?</p>
            </div>
            <div style="width: 490px;">
                <p style="letter-spacing: 0;
            color: #707070; font-family: Arial, Helvetica, sans-serif; font-size: 20px">
                    Click on the following button to send us a request for another estimate.
                </p>
    
            </div>
            <br>
            <a href="https://www.greenacorn.com/" style=" margin-left:150px;padding: 20px;text-decoration: none;border: none; font-family: Arial, Helvetica, sans-serif; border-radius: 4px;  background-color: #00A863; color: white; font-size: 18px;">Get free quote</a>
            <br>
            <br>
            <br>
            <div>
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_2_snkfws.png" alt="elite">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_3_gveepq.png" alt="houzz">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_4_zkdowq.png" alt="accredited">
                <img style="margin-left: 20px;" src="https://res.cloudinary.com/ironhackjorge/image/upload/v1585297019/ImagesGA/assets/Imagen_5_uapttm.png" alt="accredited">
            </div>
            <br>
            <br>
            <br>
            <br>
            <div class="content1">
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
            <div class="content2">
                <p style="font-size: 12px; color:#707070;">Green Acorn</p>
                <p style="font-size: 12px; color:#707070;">809 N. West St</p>
                <p style="font-size: 12px; color:#707070;">Raleigh, NC 27603 (919) 600-0199</p>
                <p style="font-size: 12px; color:#707070;"><a href="https://www.greenacorn.com/privacy-policy">Privacy Policy</a> | <a href="https://www.greenacorn.com/terms">Terms of Use</a> </p>
                <p style="font-size: 12px; color:#707070;">©2020 Green Acorn</p>
            </div>
        </div>
    
    </body>
        `
    })
}