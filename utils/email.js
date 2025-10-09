const nodeemailer = require('nodemailer')

// CREATE A TRANSPORTER
const sendEmail = async options=>{


const transporter = nodeemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
    }
})


// CDefine the email options

const mailOptions={
    from: 'Hamid iqbal <hamid.iqbal00123@gmail.com>',
    to:options.email,
    subject:options.subject,
    text:options.message

}

//SEND IT
 await transporter.sendEmail(mailOptions)

}


module.exports = sendEmail