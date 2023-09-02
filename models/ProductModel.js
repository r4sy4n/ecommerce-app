const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    productName: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        // required: [true, 'Please select category for this product'],
        // enum: {
        //     values: [
        //         'Beauty',
        //         'Wellness',
        //         'Nutrition',
        //         'Beverage'
        //     ],
        //     message: 'Please select correct category for this product'
        // },
    }, 
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        },
        {
            timestamps: true
        }
    ],
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        default: 0
    }, 
}, 
{
    timestamps: true
})

module.exports = mongoose.model( 'Product', ProductSchema );