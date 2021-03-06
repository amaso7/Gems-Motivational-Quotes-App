
const bcrypt = require('bcryptjs/dist/bcrypt')
const express = require('express')
const { ReadyForQueryMessage } = require('pg-protocol/dist/messages')
const router=express.Router()
const axios = require('axios').default
const authenticate=require('../authentication/authenticate')


let nonsense = "u4THPP4vuzi5mkdw6zBqFAeF"
function validateEmail(email){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return (email)
    }
        return "false"
}

function validatePassword(password){
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$/.test(password)){
        return (password)
    }
        return "false"
}

//feature to allow users to login into their existing accounts
router.post('/register',(req,res)=>{
    const username=validateEmail(req.body.username)
    const password=req.body.password
    const rdo=req.body.rdo
    let email = ""
    console.log(req.body.rdo)
    if (rdo == "yes" ){
        email = req.body.username
    }

    models.User.findOne({
        where:{
            username:username
        }
    })
    .then(duplicateUser=>{
        if(username=="false" || password=="false"){
            res.render('signup',{errorMessage:"Please enter a valid email address domain and password (ex. email: johndoe@gmail.com password: 1agdA*$#)."})
        }else if(duplicateUser != null ){
            res.render('signup',{errorMessage:"An account already exist with this email."})
        }else{
            bcrypt.genSalt(10,function(error,salt){
                if(!error){
                    bcrypt.hash(password,salt,function(error,hash){
                        if(!error){
                            //code to push to username & password to database
                            console.log('username & password successfully saved to db!')
                            const user=models.User.build({
                                username:username,
                                password:hash,
                                email: email
                            })
                            user.save()
                            .then(savedUser=>{
                                console.log('New account created!')
                                if(req.session){
                                    req.session.username=savedUser.username
                                }
                                res.render('newuser',{message:'You have successfully created a new account!'})
                            }).catch(function (error) {
                                console.log(error);
                            })
                        }else{
                            res.render('newuser',{message:'Failed to create new account! Try again later.'})
                        }
                    })
                }else{
                    res.render('newuser',{message:'Failed to create new account! Try again later.'})
                }
            })
        }
    }).catch(function (error) {
            console.log(error);
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
    }).catch(function (error) {
        console.log(error);
    })
})

//displays the homepage + QOD
router.get('/home',authenticate,(req,res)=>{
    if (req.query.category){
        let category = req.query.category
        axios.get(`https://quotes.rest/quote/search?category=${category}`, {
            headers: {'X-TheySaidSo-Api-Secret': nonsense}})
        .then(function (response) {
            const quotes = response.data.contents.quotes
            let author = quotes[0].author
            if (quotes[0].author == null) {
                author = "Unknown"
            }
            axios.get('https://quotes.rest/qod?language=en', {
                headers: {'X-TheySaidSo-Api-Secret': nonsense}})
            .then(function (response) {
                const qodquotes = response.data.contents.quotes
                let qodauthor = qodquotes[0].author
                if (qodquotes[0].author == null) {
                    author = "Unknown"
                }
                res.render('home', {
                    header: `Here is a quote from ${category}`, 
                    qodheader: "Here is your daily quote", 
                    quote: quotes[0].quote, author: author, 
                    id: quotes[0].id, 
                    qodquote: qodquotes[0].quote, 
                    qodauthor: qodauthor, 
                    qodid: qodquotes[0].id,userID:req.session.user_id, 
                    showButton: true})
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }else {
        axios.get('https://quotes.rest/qod?language=en', {
            headers: {'X-TheySaidSo-Api-Secret': nonsense}})
        .then(function (response) {
            const qodquotes = response.data.contents.quotes
            let qodauthor = qodquotes[0].author
            if (qodquotes[0].author == null) {
                author = "Unknown"
            }
            console.log('hello')
            res.render('home', {
                qodheader: "Here is your daily quote", 
                qodquote: qodquotes[0].quote, 
                qodauthor: qodauthor, 
                qodid: qodquotes[0].id,userID:req.session.user_id,  
                showButton: false})
        })
    }
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

router.post('/remove-favorite',authenticate,(req,res)=>{
    const quoteID=req.body.quoteID
    const userID=req.body.userID

    const removeFavoriteQuote=models.FavoriteQuote.destroy({
        where:{
            quoteID:quoteID,
            userID:userID
        }
    })
    .then(removedFavorite=>{
        res.redirect('/users/favorites')
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
                        let quoteObj={
                            quote: response.data.contents.quote, 
                            author: response.data.contents.author, 
                            quoteID: response.data.contents.id,
                            userID:req.session.user_id
                        }
                        favoriteQuote.push(quoteObj)

                        console.log(favoriteQuote)
                        if(i==favoriteQuotes.length-1){
                            res.render('favorites', {favHeader: "Your favorite ", favQuotes: favoriteQuote})
                        }
                    })
                .catch(function (error) {
                    console.log(error);
                })
            }
    }).catch(function (error) {
        console.log(error);
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
    
router.post('/remove-user', (req, res) => {
    console.log("need to remove the user from the database")
    const userID=req.session.user_id
    
    models.FavoriteQuote.findAll({
        where:{
            userID:userID
        }
    })
    .then(favoriteQuotes=>{
        for(let i=0;i<favoriteQuotes.length;i++){
            const removeFavoriteQuote=models.FavoriteQuote.destroy({
                where:{
                    quoteID:favoriteQuotes[i].quoteID,
                    userID:userID
                }
            })
            .then(removedFavorite=>{
                console.log(`removed ${favoriteQuotes[i].quoteID}`)
            })
        }
        console.log("we removed all of their favorites first")
        const removeuser=models.User.destroy({
            where:{
                id:userID
            }
        })
        .then(removeduser=>{
            console.log("then we can remove the user")
            res.redirect('/users/logout')
        })
    })
})

router.post('/remove-email',(req,res)=>{
    console.log("need to remove the email from the database")
    const userID=req.session.user_id
    models.User.findOne({
        where:{
            id:userID
        }
    })
    .then(user=>{
        user.update({
            email: null
        })
        .then(update=>{
            res.render('home', {
                header: "You have successfully unsubscribed"
            })
        })
    })
})


router.get('/logout', authenticate, (req, res) => {
    req.session.destroy(function (error) {
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
})

module.exports = router
