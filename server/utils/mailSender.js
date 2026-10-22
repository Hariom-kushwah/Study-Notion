const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
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
}

module.exports = mailSender
