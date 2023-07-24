const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const verify = require('../middlewares/auth');
const bcrypt = require('bcrypt');


//Users Endpoint
//GET Endpoint to get user profile
router.get('/profile', verify, ( request, response ) => {
    User.findById( request.user._id ).then( dbResponse => {
        if( dbResponse ){
            response.status( 200 ).send({ user: dbResponse.username, email: dbResponse.email, isAdmin: dbResponse.isAdmin });
        }else{
            response.status( 404 ).send({ error: 'No user found' });
        };
    }).catch( (e) => {
            response.status( 404 ).send({ error: e.message });
    })
});

//PUT Endpoint to edit/update user profile
router.put('/profile', verify, ( request, response ) => {
    User.findByIdAndUpdate( request.user._id, request.body, { new: true } ).then( dbResponse => {
        if(request.body.password){
            bcrypt.hash( request.body.password, 10 ).then((hash, err) => {
                response.status( 200 ).send({ 
                    updatedUser: { 
                        username: dbResponse.username, 
                        email: dbResponse.email, 
                        password: hash, 
                        isAdmin: dbResponse.isAdmin 
                    },
                    message: 'Changes Saved'});
            });
        }else{
            response.status( 200 ).send({ user: dbResponse, message: 'Changes Saved' });
        }
    }).catch( (e) => {
        response.status( 404 ).send({ error: e.message });
    })
});


module.exports = router;