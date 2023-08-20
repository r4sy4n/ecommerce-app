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
router.put('/profile', verify, (request, response) => {
    User.findByIdAndUpdate(request.user._id, request.body, { new: true }).then((updatedUser) => {
        if (request.body.password) {
          bcrypt.hash(request.body.password, 10).then((hash, err) => {
            updatedUser.password = hash; // Set the hashed password in the updatedUser object
            return updatedUser.save(); // Save the updated user with the new hashed password
            })
          } else {
            return updatedUser.save();
          }
        }).then((savedUser) => {
            response.status( 200 ).send({
              savedUser: savedUser,
              message: 'Changes Saved'
            });
          }).catch((error) => {
            response.status( 500 ).send({ error, error: 'Internal Server Error' });
          });
          
    });


module.exports = router;