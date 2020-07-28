const {Router} = require('express')
const Order = require('../modules/order')
const authAllow = require('../middlewares/auth')
const router = Router()

const priceCars = (price) => price.reduce((acc, cur) => acc + (cur.amount * cur.carId.price), 0)

router.get('/', authAllow, async (req, resp) => {
    const ordersUser = await Order.find({
        'userId': req.user._id
    }).populate('cars.carId userId').lean()
    const order = ordersUser.map(i => ({...i, price: priceCars(i.cars)}))
    resp.render('order', {
        title: 'Order',
        isOrder: true,
        order
    })
})
router.post('/', authAllow, async (req, resp) => {
    const user = await req.user.populate('cart.items.carId').execPopulate()
    const orderCars = user.cart.items.map(i => ({
        amount: i.amount,
        carId: i.carId._id
    }))
    const order = new Order({
        userId: req.user._id,
        cars: orderCars
    })
    await order.save()
    await req.user.clearCart()
    resp.redirect('/order')
})

module.exports = router