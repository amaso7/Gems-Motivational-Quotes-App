
const bcrypt = require('bcryptjs/dist/bcrypt')
const express=require('express')
const { ReadyForQueryMessage } = require('pg-protocol/dist/messages')
const router=express.Router()
const authenticate=require('../authentication/authenticate')

router.use(express.static('styles'))

//feature to allow potential users to create a new account
router.post('/register',(req,res)=>{
    const username=req.body.username
    const password=req.body.password

    console.log(username,password)
    bcrypt.genSalt(10,function(error,salt){
        if(!error){
            bcrypt.hash(password,salt,function(error,hash){
                if(!error){
                    //code to push to username & password to database
                    console.log('username & password successfully saved to db!')
                    const user=models.User.build({
                        username:username,
                        password:hash
                    })
                    user.save()
                    .then(savedUser=>{
                        console.log('New account created!')
                        if(req.session){
                            req.session.username=savedUser.username
                        }
                        res.render('login',{message:'You have successfully created a new account!'})
                    })
                }else{
                    res.render('login',{message:'Failed to create new account! Try again later.'})
                }
            })
        }else{
            res.render('login',{message:'Failed to create new account! Try again later.'})
        }
    })
})

//feature to allow users to login into their existing accounts
router.post('/login',(req,res)=>{
    const username=req.body.username
    const password=req.body.password

    models.User.findOne({
        where:{
            username:username
        }
    })
    .then(user=>{
        bcrypt.compare(password,user.password,function(error,result){
            if(result){
                if(req.session){
                    req.session.user_id=user.id
                    req.session.username=user.username
                }
                console.log("User successfully logged in! On user homepage")
                res.redirect('/users/home')
            }else{
                //render the login/create account page with error message
                console.log("Invalid username or password! Reload login page")
                res.render('login',{message:'Invalid username or password!'})
            }
        })
    })
})

router.get('/home',authenticate,(req,res)=>{
    if(req.session){
        if(req.session.username){
             res.render('home',{userID:req.session.user_id})
        }
    }else{
        res.redirect('/')
    }
})

router.get('/add-favorite',(req,res)=>{
    // const userID=parseInt(req.body.userID)
    // const quoteID=req.body.id
    // const quoteText=req.body.text
    // const quoteAuthor=req.body.author
    // const quoteTag=req.body.tag

    const userID=req.body.userID
    const quoteID=req.body.id
    const quoteText=req.body.quote
    const quoteAuthor=req.body.author
    const quoteTag=req.body.category

    const favorite=models.FavoriteQuote.build({
        quote:quoteText,
        author:quoteAuthor,
        tag:quoteTag,
        quoteID:quoteID,
        userID:userID
    })

    favorite.save()
    .then(savedQuote=>{
        console.log("Quote saved!")
        res.json('home')
    })
})

router.get('/favorites',(req,res)=>{
    const userID=req.body.userID

    models.FavoriteQuote.findAll({
        where:{
            userID:userID
        }
    })
    .then(favoriteQuote=>{
        console.log(favoriteQuote)
        res.redirect('/users/home')
    })
})

router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.get('/logout',authenticate,(req,res)=>{
    req.session.destroy(function(error){
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
})

module.exports=router