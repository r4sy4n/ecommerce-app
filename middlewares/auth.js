const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const User = require('../models/UserModel');

const verify = ( request, response, next ) => {
    const token = request.cookies.token;

    if( token ){
        const decoded = jwt.decode(token, SECRET);
            User.findById(decoded.id).select('-password').then((user) => {
                if (user) {
                    request.user = user;
                    next();
                } else {
                    response.status( 401 ).send({ error: 'Unauthorized' });
                }
                }).catch((error) => {
                    response.status( 500 ).send({ error: 'Internal Server Error' });
                });
    } else {
        response.status( 401 ).send({ error: 'Unauthorized' });
    };
};

module.exports = verify;
