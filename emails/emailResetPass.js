const keys = require('../keys')

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.GENERAL_EMAIL,
        subject: 'Password recovery',
        html: `
            <h2>Do you want to reset password if you want to click the link below if not just ignore</h2>
            <a href="${keys.URL_SITE}/auth/change-password/${token}">Page of reset</a>
            <hr>
            <a href="${keys.URL_SITE}">Go back on site</a>
        `
    }
}