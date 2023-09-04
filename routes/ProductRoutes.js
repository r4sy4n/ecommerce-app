const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');
const verify = require('../middlewares/auth');
const restrict = require('../middlewares/admin');

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

//POST Endpoint to create product
router.post('/', verify, restrict, ( request, response ) => {
        const newProduct = new Product ({
            productName: 'Sample name',
            price: 0,
            user: request.user._id,
            images: 'https://res.cloudinary.com/dbtjl6dcn/image/upload/v1693827017/sample_ygb18y.png',
            category: 'Sample category',
            stock: 0,
            description: 'Sample description'
        })
        newProduct.save().then(dbResponse => {
            response.status( 201 ).send({ message: 'Product created successfully!', dbResponse})
        })
});

//PUT Endpoint to edit specific product
router.put('/:id', verify, restrict, ( request, response ) => {
    const { 
        productName,
        price,
        images,
        category,
        stock,
        description
    } = request.body
    Product.findById(request.params.id).then(product => {
        if (product){
            product.productName = productName;
            product.price = price;
            product.images = images;
            product.category = category;
            product.stock = stock;
            product.description = description;
            product.save();
            response.status( 200 ).send( product )
        }else {
            response.status( 404 ).send({ error: 'Product not found' });
        }
    })
});

//DELETE Endpoint to delete specific product
router.delete('/:id', verify, restrict, ( request, response ) => {
    Product.findOneAndDelete({ _id: request.params.id }).then((deletedProduct) => {
        if (deletedProduct) {
            response.status( 200 ).send({ message: 'Product deleted successfully', deletedProduct });
        }else {
            response.status( 404 ).send({ message: 'Product not found' });
        }
    }).catch((error) => {
        response.status( 500 ).send( error );
    });
})

module.exports = router;