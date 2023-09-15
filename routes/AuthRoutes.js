const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;
const COOKIE_EXPIRE_TIME = process.env.COOKIE_EXPIRE_TIME;


//POST Endpoint to create user
router.post('/register', ( request, response ) => {
    User.find({ $or: [ { username: request.body.username }, { email: request.body.email } ]}).then(dbResponse => {
        if( dbResponse.length > 0 ){
            //  db has record of response
            response.status( 400 ).send({ error: 'User already exists' });
        }else{
            bcrypt.hash( request.body.password, 10 ).then((hash, err) => {
                const newUser = new User({ 
                    username: request.body.username, 
                    email: request.body.email,  
                    password: hash,
                    isAdmin: request.body.isAdmin
                });
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
                newUser.save().then( dbResponse => {
                    response.cookie('token', token, { httpOnly: true, sameSite: 'strict', expiresIn: expirationDate, secure: true, domain: '.onrender.com', path:'/' }).status( 201 ).send({ message: 'Registration Successful', username: dbResponse.username, email: dbResponse.email, isAdmin: dbResponse.isAdmin, success: true });
                });
            });
        };
    })
});

//POST Endpoint to login user
router.post('/login', ( request, response ) => {
    User.findOne({ email: request.body.email }).select('+password').then( dbResponse => {
        if( !dbResponse ){
            return response.status( 404 ).send({ error: 'Invalid email or password!' });
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
                response.cookie('token', token, { httpOnly: true, sameSite: 'strict', expiresIn: expirationDate, secure: true, domain: '.onrender.com', path:'/' }).status( 200 ).send({
                    username: dbResponse.username,
                    email: dbResponse.email,
                    message: 'Login Successful',
                    isAdmin: dbResponse.isAdmin,
                    success: true });
            };
        });
    });
});

router.post('/logout', ( request, response ) => {
    response.clearCookie('token', { httpOnly: true, sameSite: 'strict' } ).status( 200 ).send({
        message: 'Logout Successful',
        success: true
    });
});


module.exports = router;