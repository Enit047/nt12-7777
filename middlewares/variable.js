module.exports = function(req, resp, next){
    resp.locals.isAuthUser = req.session.isAuth
    resp.locals.csrf = req.csrfToken()
    next()
}