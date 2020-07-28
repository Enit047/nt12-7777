const {
    Schema,
    model
} = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateRegistration: {
        type: Date,
        default: Date.now()
    },
    userAvatar: String,
    resetToken: String,
    resetTokenTime: Date,
    cart: {
        items: [{
            carId: {
                type: Schema.Types.ObjectId,
                ref: "Cars",
                required: true
            },
            amount: {
                type: Number,
                required: true,
                default: 1
            }
        }]
    }
})

userSchema.methods.addToCart = function (id) {
    const items = [...this.cart.items]
    const index = items.findIndex(i => i.carId.toString() === id)

    if (index >= 0) {
        items[index].amount++
    } else {
        items.push({
            carId: id,
            amount: 1
        })
    }

    this.cart = {
        items
    }
    return this.save()
}

userSchema.methods.deleteCar = function (id) {
    let items = [...this.cart.items]
    const index = items.findIndex(i => i.carId.toString() === id)

    if (items[index].amount === 1) {
        items = items.filter(i => i.carId.toString() !== id)
    } else {
        items[index].amount--
    }

    this.cart = {
        items
    }
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)