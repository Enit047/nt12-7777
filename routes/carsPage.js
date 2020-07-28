const {Router} = require('express')
const Cars = require('../modules/cars')
const authAllow = require('../middlewares/auth')
const router = Router()
const {formValidation} = require('../utls/validation')
const { validationResult } = require('express-validator')

function isValid(userIdCar, idUser) {
    return userIdCar.toString() === idUser._id.toString()
}

router.get('/', async (req, resp) => {
    const cars = await Cars.find().lean()
    resp.render('cars', {
        title: 'Cars',
        isCars: true,
        cars,
        userId: req.session.user ? req.session.user._id : null
    })
})
router.get('/:id', async (req, resp) => {
    try {
        const carData = await Cars.findById(req.params.id).lean()
        resp.render('carInf', {
            title: 'Information about car',
            inf: carData,
            layout: 'sthLayout'
        })
    } catch (e) {
        resp.redirect('/cars')
    }
})
router.get('/:id/edit', authAllow, async (req, resp) => {
    if(!req.query.allow) {
        return resp.redirect('/cars')
    }

    const car = await Cars.findById(req.params.id).lean()

    if(!isValid(car.userId, req.session.user)) {
        return resp.redirect('/cars')
    }

    resp.render('carEdit', {
        title: 'Edit car',
        car
    })
})
router.post('/edit', authAllow, formValidation, async (req, resp) => {
    try {
        const car = await (await Cars.findOne({ _id: req.body.id })).toObject()
        const error = validationResult(req)
        if(!error.isEmpty()) {
            resp.render('carEdit', {
                title: 'Edit car',
                car,
                error: error.array()[0].msg
            })
        } else {
            if(!isValid(car.userId, req.session.user)) {
                return resp.redirect('/cars')
            }
            await Cars.findByIdAndUpdate(req.body.id, req.body)
            resp.redirect('/cars')
       }
    } catch (e) {
        console.log(e)
    }
})

router.post('/delete', authAllow, async (req, resp) => {
    await Cars.deleteOne({
        _id: req.body.id,
        userId: req.session.user._id
    })
    resp.redirect('/cars')
})

module.exports = router