const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const verify = require('../middlewares/auth');
const restrict = require('../middlewares/admin');

//POST Endpoint to create new order
router.post('/', verify, ( request, response ) => {
    const { 
        orderItems,
        shippingInfo,
        itemsPrice,
        totalPrice,
        paymentMethod
    } = request.body
    if(orderItems && orderItems === 0){
        response.status( 400 ).send('No order items')
    }else{
        const newOrder = new Order ({
            orderItems: orderItems.map((order) => ({
                ...order, _id: undefined
            })),
            user: request.user._id,
            shippingInfo,
            itemsPrice,
            totalPrice,
            paymentMethod
        })
        newOrder.save().then(dbResponse => {
            response.status( 201 ).send({ message: 'Order placed successfully!', dbResponse})
        })
    }
})

//GET Endpoint to get logged in users orders
router.get('/myorders', verify, ( request, response ) => {
    Order.find({ user: request.user._id }).then(order => {
        response.status( 200 ).send({ myOrders: order, count: order.length })
    })
})

//GET Endpoint to get orders by id (order id)
router.get('/:id', verify, ( request, response ) => {
    Order.findById( request.params.id ).populate('user', 'username email').then(order => {
        if(order){
            response.status( 200 ).send({ orders: order, count: order.length })
        }else{
            response.status( 404 ).send({ message: 'Order not found'})
        }
    })
})

//PUT Endpoint to update order to paid
router.put('/:id/pay', verify, ( request, response ) => {
    Order.findOne( request.params.id ).then(order => {
        response.status( 200 ).send({ orders: order, count: order.length })
    })
})

//PUT Endpoint to update order to delivered
router.put('/:id/deliver', verify, restrict, ( request, response ) => {
    Order.findOne( request.params.id ).then(order => {
        response.status( 200 ).send({ orders: order, count: order.length })
    })
})

//GET Endpoint to get all orders
router.get('/', verify, restrict, ( request, response ) => {
    Order.find().then(order => {
        response.status( 200 ).send({ orders: order, count: order.length })
    })
})

module.exports = router;