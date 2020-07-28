module.exports = function(req, resp, next) {
    resp.render('404error', {
        title: 'Error 404'
    })
}