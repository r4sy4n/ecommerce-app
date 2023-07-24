const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const verify = require('../middlewares/auth');
const restrict = require('../middlewares/admin');

//Admin

//GET Endpoint to get all users
router.get('/', verify, restrict, ( request, response ) => {
    User.find().then( user => {
        response.status( 200 ).send({ users: user, count: user.length })
    });
});

//GET Endpoint to get specific user
router.get('/:id', verify, restrict, ( request, response ) => {
    User.findOne({ _id: request.params.id }, { password: 0 }).then( dbResponse => {
        if( dbResponse ){
            response.status( 200 ).send({ user: dbResponse.username, email: dbResponse.email });
        }else{
            response.status( 404 ).send({ error: 'No user found' });
        };
    }).catch( (e) => {
            response.status( 404 ).send({ error: e });
    })
});

//DELETE Endpoint to delete user
router.delete('/:id', verify, restrict, ( request, response ) => {
    const userId = request.params.id;

    User.findOneAndDelete({ _id: userId }).then(dbResponse => {
        if (!dbResponse) {
            response.status( 404 ).send({ error: 'User not found' });
        } else {
            response.status( 200 ).send({ message: 'User has been deleted' });
        }
    }).catch(error => {
            response.status( 500 ).send({ error: 'An error occurred while deleting the user' });
        });
});

//PUT Endpoint to edit specific user
router.put('/:id', verify, restrict, ( request, response ) => {
    User.findByIdAndUpdate( request.params.id, request.body, { new: true } ).then( dbResponse => {
        response.status( 200 ).send({ user: dbResponse, message: 'Changes Saved' });
    });
});

module.exports = router;