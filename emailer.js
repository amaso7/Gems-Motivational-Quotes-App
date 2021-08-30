let cron = require('node-cron')
let nodemailer = require('nodemailer')
let qod = ""


function getQuote(){
  axios.get('https://quotes.rest/qod?language=en', {
        headers: {'X-TheySaidSo-Api-Secret': nonsense}})
    .then(function (response) {
        const quotes = response.data.contents.quotes
        let author = quotes[0].author
        console.log("debugging")
        if (quotes[0].author == null) {
            author = "Unknown"
        }
        qod = quotes[0].quote
    })
    .catch(function (error) {
        console.log(error);
    })
}

cron.schedule('0 2 0 * * *', () => {
  // Send e-mail
  getQuote()
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
})


let mailOptions = {
  from: 'findyourmotivationgems@gmail.com',
  to: '<TO_EMAIL_ADDRESS>',
  subject: 'Here is your Quote of the Day!',
  text: `${qod}`
}

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'findyourmotivationgems@gmail.com',
    pass: 'project2021'
  }
})

