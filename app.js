const express=require('express')
const app=express()
const mustacheExpress=require('mustache-express')
const session=require('express-session')
const bcrypt=require('bcryptjs')

const PORT=3000
const usersRouter=require('./routes/users')

app.use(express.urlencoded())

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

app.use(session({
    secret:'keyword',
    resave:false,
    saveUninitialized:true
}))

app.use('/users',usersRouter)

//path to render the user page.
app.get('/',(req,res)=>{
    console.log('Hello World')
})

app.listen(PORT,()=>{
    console.log('Server is running...')
})