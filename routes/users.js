
const express=require('express')
const router=express.Router()

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
                        //res.redirect('/login')
                    })
                }else{
                    console.log('Error!')
                    //res.send('Error!')
                }
            })
        }else{
            console.log('Error!')
            //res.send('Error!')
        }
    })
})

//feature to allow users to login into their existing accounts
router.post('/login',(req,res)=>{
    const username=req.body.Username
    const password=req.body.Password

    console.log(username,password)

    bcrypt.compare(password,user.password,function(error,result){
        if(result){
            if(req.session){
                req.session.user_id=user.user_id
                req.session.username=user.username
            }
            console.log("User successfully logged in! On user homepage")
            //res.redirect('/user/homepage')
        }else{
            //render the login/create account page with error message
            console.log("Invalid username or password! Reload login page")
            //res.render('index',{invalidUserMessage:'Invalid username or password!'})
        }
        
    })
})

router.get('/favorites',(req,res)=>{
    const user_id=req.body.user_id
    models.Quotes.findAll({
        where:{
            id:user_id,
            is_favorite:true
        }
    })
    .then(favoriteQuotes=>{
        console.log(favoriteQuotes)
    })
})

router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.get('/s',(req,res)=>{
    res.json({message:"Sign in"})
})

router.post('/logout',(req,res)=>{
    req.session.destroy(error=>{
        console.log('Successfully logged out!')
        //res.clearCookie('connect.sid')
        //res.redirect('/account/login')
    })
})

module.exports=router