const {Schema, model} = require('mongoose')

const orderSchema = new Schema({
    cars: [
        {
            carId: {
                type: Schema.Types.ObjectId,
                ref: 'Cars',
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = model('order', orderSchema)