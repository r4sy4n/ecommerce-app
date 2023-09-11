const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');
const verify = require('../middlewares/auth');
const restrict = require('../middlewares/admin');

//GET Endpoint to get all product
router.get('/page/:pageNumber', ( request, response) => {
    const pageSize = 4;
    const page = Number(request.params.pageNumber) || 1;
    const keyword = request.query.keyword ? { productName: { $regex: request.query.keyword, $options: 'i' }} : {};

    Product.countDocuments({...keyword}).exec().then(totalCount => {
        Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1)).then( product => {
            response.status( 200 ).send({ keyword, count: totalCount, products: product, page, pages: Math.ceil(totalCount / pageSize) })
        })
    }).catch( error => {
        response.status( 404 ).send({ error: error });
    });
});

//GET Endpoint to get specific product
router.get('/:id', ( request, response ) => {
    Product.findOne({ _id: request.params.id }).then( dbResponse => {
        if( dbResponse ){
            response.status( 200 ).send({ products: dbResponse, success: true });
        }else{
            response.status( 404 ).send({ error: 'Product not found' });
        };
    }).catch( error => {
            response.status( 404 ).send({ error: error });
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
        }).catch( error => {
            response.status( 404 ).send({ error: error });
        });
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
    }).catch( error => {
        response.status( 404 ).send({ error: error });
    });
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
});

//POST Endpoint to create new reviews
router.post('/:id/reviews', verify, ( request, response ) => {
    const { rating, comment } = request.body
    Product.findById({ _id: request.params.id }).then((product) => {
        if(product){
            const alreadyReviewed = product.reviews.find((review) => 
            review.user.toString() === request.user._id.toString())
            if(alreadyReviewed){
                response.status( 400 ).send({ message: 'Product already reviewed' });
                return
            }
            const review = {
                name: request.user.username,
                rating: Number(rating),
                comment,
                user: request.user._id,
                createdAt: Date.now()
            }
            product.reviews.push(review)
            product.numOfReviews =  product.reviews.length;
            product.ratings = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
            product.save();
            response.status( 201 ).send({ message: 'Review added', review})
        }else{
            response.status( 404 ).send({ message: 'Product not found'})
        }
    }).catch((error) => {
        response.status( 500 ).send( error );
    });
});

module.exports = router;