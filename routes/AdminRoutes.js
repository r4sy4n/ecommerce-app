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


module.exports = router;