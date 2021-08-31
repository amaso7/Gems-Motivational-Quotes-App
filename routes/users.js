
const bcrypt = require('bcryptjs/dist/bcrypt')
const express = require('express')
const { ReadyForQueryMessage } = require('pg-protocol/dist/messages')
const router=express.Router()
const axios = require('axios').default
const authenticate=require('../authentication/authenticate')


let nonsense = "u4THPP4vuzi5mkdw6zBqFAeF"

//feature to allow users to login into their existing accounts
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

//displays the homepage + QOD
router.get('/home',authenticate,(req,res)=>{
    axios.get('https://quotes.rest/qod?language=en', {
        headers: {'X-TheySaidSo-Api-Secret': nonsense}})
    .then(function (response) {
        const quotes = response.data.contents.quotes
        let author = quotes[0].author
        console.log("debugging")
        if (quotes[0].author == null) {
            author = "Unknown"
        }
        res.render('home', {header: "Here is the quote of the day", quote: quotes[0].quote, author: author, id: quotes[0].id,userID:req.session.user_id})
    })
    .catch(function (error) {
        console.log(error);
    })
})

router.post('/add-favorite',(req,res)=>{
    const userID=req.body.userID
    const quoteID=req.body.quoteID
    
    const favoriteQuote=models.FavoriteQuote.build({
        quoteID:quoteID,
        userID:userID
    })

    favoriteQuote.save()
    .then(savedQuote=>{
        res.redirect('/users/home')
    })
})

router.get('/favorites',authenticate,(req,res)=>{
    const userID=req.session.user_id

    models.FavoriteQuote.findAll({
        where:{
            userID:userID
        }
    })
    .then(favoriteQuotes=>{
        let favoriteQuote=[]
        for(let i=0;i<favoriteQuotes.length;i++){
             axios.get(`https://quotes.rest/quote?id=${favoriteQuotes[i].quoteID}`,{
                    headers: {'X-TheySaidSo-Api-Secret': nonsense}})
                .then(function (response) {
                    let quoteObj={quote: response.data.contents.quote,author: response.data.contents.author, quoteID: response.data.contents.id}
                    favoriteQuote.push(quoteObj)

                    if(i==favoriteQuotes.length-1){
                        res.render('home', {header: "Here are your favorite quotes", quotelist: favoriteQuote})
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
            }
    })
})


router.get('/signup',(req,res)=>{
    res.render('signup')
})


//Displays Popular categories
router.get('/popular', authenticate, (req, res) => {
    axios.get('https://quotes.rest/quote/categories/popular?start=0&limit=10', {
        headers: {'X-TheySaidSo-Api-Secret': nonsense}})
    .then(function (response) {
        const categories1 = response.data.contents.categories
        axios.get('https://quotes.rest/quote/categories/popular?start=10&limit=10', {
            headers: {'X-TheySaidSo-Api-Secret': 'u4THPP4vuzi5mkdw6zBqFAeF'}})
        .then(function (response) {
            const categories2 = response.data.contents.categories
            res.render('popular', {header: "Here is the most popular categories", categories1: categories1, categories2: categories2})
        })
    })
    .catch(function (error) {
        console.log(error);
    })
})
    
//Allows for search within categories
router.get('/category', authenticate, (req, res) => {
    let category = req.query.category
    axios.get(`https://quotes.rest/quote/search?category=${category}`, {
        headers: {'X-TheySaidSo-Api-Secret': nonsense}})
    .then(function (response) {
        const quotes = response.data.contents.quotes
        let author = quotes[0].author
        if (quotes[0].author == null) {
            author = "Unknown"
        }
        res.render('home', {header: `Here is a quote from ${category}`, quote: quotes[0].quote, author: author, id: quotes[0].id})
    })
    .catch(function (error) {
        console.log(error);
    })
})
    
router.post('/add-quote', (req, res) => {
    //todo
    
    //the format to add a quote to our own private "stash" on the site
    //uses the following params format, not the usual post-body.
    let quote = req.body.quote
    let author = req.body.author
    let category = req.body.category
    axios.post(`https://quotes.rest/quote?quote=${quote}&author=${author}&tags=${category}&language=en`)
})

router.get('/logout', authenticate, (req, res) => {
    req.session.destroy(function (error) {
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
})

module.exports = router
