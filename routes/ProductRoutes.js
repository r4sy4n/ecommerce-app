const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');

router.get('/', ( request, response) => {
    Product.find().then( product => {
        response.status( 200 ).send({ products: product })
    });

})

module.exports = router;