const nodemailer = require("nodemailer")
global.models=require('./models')

// async..await is not allowed in global scope, must use a wrapper
async function main() {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'findyourmotivationgems@gmail.com',
      pass: "project2021", 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'findyourmotivationgems@gmail.com', 
    to: "shabbypenguin@gmail.com", 
    subject: "Hello ✔", 
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

}

main().catch(console.error);