module.exports = function (req, resp, next) {
    if(!req.session.user) {
        return resp.redirect('/auth/login')
    }
    next()
}

