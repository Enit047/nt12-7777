const {
    Router
} = require('express')
const bcryptJs = require('bcryptjs')
const User = require('../modules/user')
const router = Router()
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')
const createdEmail = require('../emails/registration')
const emailResetPass = require('../emails/emailResetPass')
const crypto = require('crypto')
const {validationForSignUp, validationForSignIn} = require('../utls/validation')
const { validationResult } = require('express-validator')

const trasport = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.API_EMAIL }
}))

router.get('/login', (req, resp) => {
    resp.render('auth/auth', {
        title: 'Log in',
        isAuth: true,
        errSignIn: req.flash('errSignIn'),
        errSignUp: req.flash('errSignUp')
    })
})
router.post('/signin', validationForSignIn, async (req, resp) => {
    const user = await User.findOne({email: req.body.email})
    const error = validationResult(req)
    if(!error.isEmpty()) {
        req.flash('errSignIn', error.array()[0].msg)
        resp.redirect('/auth/login')
    } else {
        req.session.isAuth = true
        req.session.user = user
        req.session.save(err => {
            if (err) throw err
            resp.redirect('/')
        })
            
    }
})
router.post('/signup', validationForSignUp, async (req, resp) => {
    const {email, name, password, confirm} = req.body

    const error = validationResult(req)
    if(!error.isEmpty()) {
        req.flash('errSignUp', error.array()[0].msg)
        resp.redirect('/auth/login#signup')
    } else {
        const hashPassword = await bcryptJs.hash(password, 15)
        const user = new User({
            name, email, password: hashPassword, cart: {items: []}
        })
        await user.save()
        resp.redirect('/auth/login')
        await trasport.sendMail(createdEmail(email))
    }
})
router.get('/signout', (req, resp) => {
    req.session.destroy((e) => {
        resp.redirect('/')
    })
})

router.get('/reset', (req, resp) => {
    resp.render('auth/reset', {
        title: 'Reset password with email',
        errReset: req.flash('errReset')
    })
})

router.post('/reset', (req, resp) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if(err) {
            req.flash('errReset', 'Something wrong, try agine after some time..')
            return resp.redirect('/auth/reset')
        }

        const userEm = await User.findOne({email: req.body.email})
        const token = buffer.toString('hex')

        if(userEm) {
            userEm.resetToken = token
            userEm.resetTokenTime = Date.now() + (60 * 60 * 1000)
            await userEm.save()
            await trasport.sendMail(emailResetPass(req.body.email, token))
            resp.redirect('/auth/login')
        } else {
            req.flash('errReset', 'Email which you have written doesnt exist..')
            return resp.redirect('/auth/reset')
        }
    })
})

router.get('/change-password/:token', async (req, resp) => {
    if(!req.params.token) {
        return resp.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenTime: {$gt: Date.now()}
        })

        if(user) {
            resp.render('auth/changePassword', {
                title: 'Change password',
                errChange: req.flash('errChange'),
                token: req.params.token,
                userId: user._id,
                errChange: req.flash('errChange')
            })
        } else {
            resp.redirect('/auth/login')
        }
    } catch (e) {
        console.log(e)
    }
})

router.post('/change-passoword', async (req, resp) => {
    try {
        const user = await User.findOne({
            resetToken: req.body.token,
            resetTokenTime: {$gt: Date.now()},
            _id: req.body.userId
        })
        if(user) {
            if(req.body.password === req.body.confirm) {
                user.resetToken = undefined
                user.resetTokenTime = undefined
                user.password = await bcryptJs.hash(req.body.password, 15)
                await user.save()
                resp.redirect('/auth/login')
            } else {
                req.flash('errChange', 'Passwords dont compare..')
                resp.redirect('/auth/change-password/' + req.body.token)
            }
        } else {
            resp.redirect('/auth/login')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router