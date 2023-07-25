const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');

//GET Endpoint to get all product
router.get('/', ( request, response) => {
    Product.find().then( product => {
        response.status( 200 ).send({ count: product.length, products: product })
    });
})

//GET Endpoint to get specific product
router.get('/:id', ( request, response ) => {
    Product.findOne({ _id: request.params.id }).then( dbResponse => {
        if( dbResponse ){
            response.status( 200 ).send({ products: dbResponse, success: true });
        }else{
            response.status( 404 ).send({ error: 'Product not found' });
        };
    }).catch( (e) => {
            response.status( 404 ).send({ error: e.message });
    });
});

module.exports = router;