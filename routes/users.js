
const express=require('express')
const router=express.Router()

//feature to allow potential users to create a new account
router.post('/create-account',(req,res)=>{
    const username=req.body.username
    const password=req.body.password

    console.log(username,password)
    bcrypt.genSalt(10,function(error,salt){
        if(!error){
            bcrypt.hash(password,salt,function(error,hash){
                if(!error){
                    //code to push to username & password to database
                    console.log('username & password successfully saved to db!')
                    // db.none('')
                    // .then(()=>{
                    //     console.log('New usersuccessfully created!')
                    //     res.redirect('/')
                    // })
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
    const username=req.body.username
    const password=req.body.password

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

module.exports=router