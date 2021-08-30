const express=require('express')
const app=express()
const mustacheExpress=require('mustache-express')
const session=require('express-session')
global.bcrypt=require('bcryptjs')
global.models=require('./models')
const checklogin=require('./authentication/authenticate')

const port = process.env.PORT || 80
const usersRouter=require('./routes/users')
const quotesRouter = require('./routes/quotes.js')


app.use(express.urlencoded())

app.use(express.static('styles'))

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:false
}))

app.use('/users',usersRouter)
app.use('/quotes', checklogin, quotesRouter)

//path to render the user page.
app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/home',(req,res)=>{
    res.render('home')
})

app.get('/about', (req,res)=>{
    res.render('about')
})

app.listen(port,()=>{
    console.log('Server is running...')
})
