const mongoose = require('mongoose');

const CartItemSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cartItem: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            productName: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            qty: {
                type: Number,
                default: 0
            }
        }
    ]
})

module.exports = mongoose.model( 'CartItem', CartItemSchema )