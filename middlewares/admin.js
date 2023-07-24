const restrict = ( request, response, next ) => {

    if( request.user && request.user.isAdmin ){
        next();
    }else{
        response.status( 401 ).send({ error: 'Unauthorized' });
    };
};

module.exports = restrict;
