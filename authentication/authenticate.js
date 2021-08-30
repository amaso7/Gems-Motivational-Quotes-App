function checklogin(req, res, next) {
    if(req.session){
        if(req.session.username){
            next()
        }else {
            res.redirect('/')
        }
    }else {
        res.redirect('/')
    }
}

function nonsense() {
    return "u4THPP4vuzi5mkdw6zBqFAeF"
}
module.exports=checklogin