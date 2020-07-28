const User = require('../modules/user')
module.exports = async function(req, resp, next) {
    if(req.session.user) {
        req.user = await User.findById(req.session.user._id)
    }
    next()
}