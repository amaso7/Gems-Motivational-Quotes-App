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

module.exports=checklogin