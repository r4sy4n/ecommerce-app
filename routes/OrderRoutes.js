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
                ...order, _id: undefined,
            })),
            paymentResult: {id: '', datePaid: ''},
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
    Order.findById( request.params.id ).then(order => {
        if(order){
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult.datePaid = request.body;
            order.save();
            response.status( 200 ).send( order )
        }
    }).catch(error => {
        console.log(error)
        response.status( 404 ).send( error )
    })
})

//PUT Endpoint to update checkoutSession Id from paymongo
router.put('/:id/saveCheckoutSession', verify, (request, response) => {
    const orderId = request.params.id;
    const { checkoutSessionId } = request.body;

    Order.findById(orderId).then(order => {
        if (order) {
            order.paymentResult.id = checkoutSessionId;
            order.paymentResult.created = true;
            order.save().then(savedOrder => {
                response.status( 200 ).send({ savedOrder, message: 'Checkout session ID saved successfully' });
            }).catch(error => {
                console.log(error);
                response.status( 500 ).send({ error: 'An error occurred while saving checkout session ID' });
            });
        } else {
            response.status( 404 ).send({ error: 'Order not found' });
        }
    }).catch(error => {
        console.log(error);
        response.status( 500 ).send({ error: 'An error occurred' });
    });
});

//PUT Endpoint to update order to delivered
router.put('/:id/deliver', verify, restrict, ( request, response ) => {
    Order.findById( request.params.id ).then(order => {
        console.log('order:', order)
        if(order){
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.save();
            response.status( 200 ).send( order )
        }
    }).catch(error => {
        console.log(error)
        response.status( 404 ).send( error )
    })
})

//GET Endpoint to get all orders
router.get('/', verify, restrict, ( request, response ) => {
    Order.find().populate('user', 'id username').then(order => {
        response.status( 200 ).send({ orders: order, count: order.length })
    })
})

module.exports = router;