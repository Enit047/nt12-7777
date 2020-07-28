const {body} = require('express-validator')
const User = require('../modules/user')
const bcryptJs = require('bcryptjs')

exports.validationForSignUp = [
    body('email').isEmail().withMessage('Your email is wrong..').custom( async (value, {req}) => {
        const user = await User.findOne({email: value})

        if(!user) {
            return true
        } else {
            throw new Error('This email is already existed')
        }
    }),
    body('name').isString().withMessage('Name have to contain only letters').isLength({min: 2, max: 100}).withMessage('Min length of name is 2 characters'),
    body('password').isLength({min: 6, max: 100}).withMessage('Min length of password is 6 characters'),
    body('confirm').isLength({min: 6, max: 100}).withMessage('Min length of confirm password is 6 characters').custom((value, {req}) => {
        if(value === req.body.password) {
            return true
        } else {
            throw new Error('Password dont compare')
        }
    })
]

exports.validationForSignIn = [
    body('password', 'Min length of password is 6 characters').isLength({min: 6, max: 100}),
    body('email').isEmail().withMessage('Your email is wrong..').custom( async (value, {req}) => {
        const candidat = await User.findOne({email: value})
        if(candidat) {
            const passwordHash = await bcryptJs.compare(req.body.password, candidat.password)
            if(passwordHash) {
                return true
            } else {
                throw new Error('Password is wrong')
            }
        } else {
            throw new Error('User doesnt exist..')
        }
    }),
]

exports.formValidation = [
    body('title').isLength({min: 10, max: 400}).withMessage('Min amount of letters is 10'),
    body('price', 'Price have to be number').isNumeric(),
    body('desc').isLength({min: 10, max: 1000}).withMessage('Min amount of letters is 10'),
    body('url', 'That dont look like URL').isURL()
]