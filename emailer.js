const nodemailer = require("nodemailer")
const axios = require('axios').default
let nonsense = "u4THPP4vuzi5mkdw6zBqFAeF"
const Op = require('sequelize').Op;
global.models=require('./models')
let qodauthor = ""
let qod = ""
let useremail =""
// async..await is not allowed in global scope, must use a wrapper
async function main(useremail, qod, qodauthor) { 
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'findyourmotivationgems@gmail.com',
      pass: "project2021", 
    },
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'findyourmotivationgems@gmail.com', 
    to: useremail, 
    subject: `Hello ${useremail}, here is today's quote`, 
    text: `${qod} - ${qodauthor}`, // plain text body
    html: `<b>${qod} - ${qodauthor}</b>`, // html body
  })

  console.log("Message sent: %s", info.messageId)

}

function getinfo() {
  axios.get('https://quotes.rest/qod?language=en', {
    headers: {'X-TheySaidSo-Api-Secret': nonsense}})
  .then(function (response) {
    const qodquotes = response.data.contents.quotes
    qodauthor = qodquotes[0].author
    qod = qodquotes[0].quote
    models.User.findAll({
      where:{
        email:{[Op.ne]: null}
      }
    })
    .then(useremails=>{
      for(let i=0;i<useremails.length;i++){
      useremail= useremails[i].dataValues.email
    //run a for loop that makes each user get an email with the QOD
      main(useremail, qod, qodauthor).catch(console.error)
      }
    })
  })
}

getinfo()
