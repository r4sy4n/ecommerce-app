const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItemModel');
const verify = require('../middlewares/auth');

//POST Endpoint to create cart items
router.post('/addtocart', verify, (request, response) => {
    CartItem.findOne({ user: request.user._id }).then(cart => {
        console.log(cart)
        if (cart) {
            // Find the cart for the current user.

            // Check if the product already exists in the cart.
            const existingProduct = cart.cartItem.find(item => item.productName === request.body.productName);

            if (existingProduct) {
                // If the product exists in the cart, update its quantity.
                existingProduct.qty += request.body.qty;
            } else {
                // If the product doesn't exist in the cart, add it as a new item.
                cart.cartItem.push({
                    productName: request.body.productName,
                    image: request.body.image,
                    price: request.body.price,
                    qty: request.body.qty
                });
            }
            // Save the updated cart to the database.
            cart.save().then(updatedCart => {
                response.status( 200 ).send({ cart: updatedCart, message: 'Cart updated' });
            }).catch(err => {
                response.status( 404 ).send({ err, error: 'Failed to update cart' });
            });
        } else {
            // If the cart doesn't exist for the user, create a new cart and add the item.
            const newCartItem = new CartItem({
                user: request.user._id,
                cartItem: [
                    {
                        productName: request.body.productName,
                        image: request.body.image,
                        price: request.body.price,
                        qty: request.body.qty
                    }
                ]
            });
            newCartItem.save().then(savedCart => {
                response.status( 201 ).send({ cart: savedCart, message: 'Item Added to Cart' });
            }).catch(err => {
                response.status( 404 ).send({ err, error: 'Failed to add item to Cart' });
            });
        }
    }).catch(err => {
        response.status( 500 ).send({ err, error: 'Error accessing the database' });
    });
});

//GET Endpoint to get all items in cart of current logged in user
router.get('/', verify, (request, response) => {
    const userId = request.user._id;
console.log(request)
    CartItem.find({ user: userId }).then(items => {
        response.status( 200 ).send({ cart: items, count: items.length });
    }).catch(err => {
        response.status( 500 ).send({ err, error: 'Error accessing the database' });
    });
});


module.exports = router;