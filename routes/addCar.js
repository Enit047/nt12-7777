const {Router} = require('express')
const router = Router()
const authAllow = require('../middlewares/auth')
const Cars = require('../modules/cars')
const {validationResult} = require('express-validator')
const {formValidation} = require('../utls/validation')

router.get('/', authAllow, (req, resp) => {
    resp.render('addCar', {
        title: 'Add cars',
        isAdd: true
    })
})
router.post('/', authAllow, formValidation, async (req, resp) => {
    try {
        const error = validationResult(req)
        if(!error.isEmpty()) {
            resp.render('addCar', {
                title: 'Add cars',
                isAdd: true,
                error: error.array()[0].msg,
                value: req.body
            })
        } else {
            const {title, desc, price, url} = req.body
            const cars = new Cars({
                title,
                desc,
                price,
                url,
                userId: req.user._id
            })
            await cars.save()

            resp.redirect('/cars')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router