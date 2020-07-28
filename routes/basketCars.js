const {
    Router
} = require('express')
const authAllow = require('../middlewares/auth')
const Cars = require('../modules/cars')
const router = Router()

function countPrice(cars) {
    return cars.reduce((acc, curValue) => acc + (curValue.amount * curValue.price), 0)
}
function getCars(cars) {
    return cars.map(i => ({
        ...i.carId._doc,
        amount: i.amount
    }))
}

router.post('/add', authAllow, async (req, resp) => {
    await req.user.addToCart(req.body.id)

    resp.redirect('/basket')
})

router.get('/', authAllow, async (req, resp) => {
    const user = await req.user.populate('cart.items.carId').execPopulate()
    const cart = getCars(user.cart.items)
    resp.render('basket', {
        title: 'basket',
        isBasket: true,
        cart,
        price: countPrice(cart)
    })
})

router.delete('/delete/:id', authAllow, async (req, resp) => {
    await req.user.deleteCar(req.params.id)

    const user = await req.user.populate('cart.items.carId').execPopulate()
    const cart = getCars(user.cart.items)
    const data = {cart, price: countPrice(cart)}

    resp.status(200).json(data)
})

module.exports = router