const keys = require('../keys')

module.exports = function(email) {
    return {
        to: email,
        from: keys.GENERAL_EMAIL,
        subject: 'Your account was successful created',
        html: `
            <h2>Our greetings, you created account in our service we are really glad for that</h2>
            <p>Your email - ${email}</p>
            <hr>
            <a href="${keys.URL_SITE}">Go back on site</a>
        `
    }
}