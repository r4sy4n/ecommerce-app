const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;
const COOKIE_EXPIRE_TIME = process.env.COOKIE_EXPIRE_TIME;



//POST Endpoint to login user
router.post('/login', ( request, response ) => {
    User.findOne({ email: request.body.email }).select('+password').then( dbResponse => {
        if( !dbResponse ){
            return response.status( 404 ).send({ error: 'Email does not exist' });
        }
        bcrypt.compare( request.body.password, dbResponse.password ).then( isValid => {
            if( !isValid ){
                response.status( 400 ).send({ error: 'Invalid email or password!' });
            }else{
                //create token
                const token = jwt.sign( { 
                    id: dbResponse._id, 
                    name: dbResponse.username, 
                    email: dbResponse.email, 
                   isAdmin: dbResponse.isAdmin 
                }, SECRET, {
                    expiresIn: JWT_EXPIRE_TIME
                } );
                     // Set the expiration time for the cookie (e.g., 1 day)
                const expirationTime = 24 * 60 * 60 * 1000; // 1 day in milliseconds
                const expirationDate = new Date(Date.now() + COOKIE_EXPIRE_TIME * expirationTime);
                response.cookie('token', token, { httpOnly: true, sameSite: 'strict', expiresIn: expirationDate }).status( 200 ).send({ 
                    message: 'Login Successful',
                    success: true });
            };
        });
    });
});


module.exports = router;