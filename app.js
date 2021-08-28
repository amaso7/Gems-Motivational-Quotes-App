const express=require('express')
const app=express()
const mustacheExpress=require('mustache-express')
const session=require('express-session')
global.bcrypt=require('bcryptjs')

const PORT=3000
const usersRouter=require('./routes/users')
const quotesRouter = require('./routes/quotes.js')


app.use(express.urlencoded())

app.use(express.static('styles'))

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

app.use(session({
    secret:'keyword',
    resave:false,
    saveUninitialized:true
}))

function checklogin(req, res, next) {
    
    if(req.session){
        if(req.session.username){
            next()
        }else {
            res.render('login', {Message: 'Not currently logged in'})
        }
    }else {
        res.render('login', {Message: 'Not currently logged in'})
    }
}

app.use('/users',usersRouter)
app.use('/quotes', checklogin, quotesRouter)


//path to render the user page.
app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/s',(req,res)=>{
    res.json({message:"Sign in"})
})

app.get('/logout', (req, res) => {
    req.session.destroy(error => {
        res.render('login', {message: "Successfully logged out"})
    })
})

app.listen(PORT,()=>{
    console.log('Server is running...')
})
