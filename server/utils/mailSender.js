const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
<<<<<<< HEAD
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    secure: false,
  })

  let info = await transporter.sendMail({
    from: `"Studynotion | CodeHelp" <${process.env.MAIL_USER}>`,
    to: `${email}`,
    subject: `${title}`,
    html: `${body}`,
  })
  console.log(info.response)
  return info
=======
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    })

    let info = await transporter.sendMail({
      from: `"Studynotion | CodeHelp" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log(info.response)
    return info
  } catch (error) {
    console.log(error.message)
    return error.message
  }
>>>>>>> a58fc96640b05e2f3895544f1f3dc8f5c3586eb6
}

module.exports = mailSender
