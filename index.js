require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const MONGO_URI = process.env.MONGO_URI;
const ORIGIN = process.env.ORIGIN;

mongoose.connect(`${MONGO_URI}`);

const baseURL = '/api/v1';
const ProductRoutes = require('./routes/ProductRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const AdminRoutes = require('./routes/AdminRoutes');
const UserRoutes = require('./routes/UserRoutes');
const OrderRoutes = require('./routes/OrderRoutes');
const CartRoutes = require('./routes/CartRoutes');
const PaymongoRoutes = require('./routes/PaymongoRoutes');

const app = express();
app.use( bodyParser.json() );
app.use( cors({ origin: ORIGIN, credentials: true }) );
app.use( morgan('dev') );
app.use( helmet() );
app.use( cookieParser() );

app.use( `${baseURL}/products`, ProductRoutes );
app.use( `${baseURL}/auth`, AuthRoutes );
app.use( `${baseURL}/users/admin`, AdminRoutes );
app.use( `${baseURL}/users`, UserRoutes );
app.use( `${baseURL}/orders`, OrderRoutes );
app.use( `${baseURL}/cartitems`, CartRoutes );
app.use( `${baseURL}/createCheckoutSession`, PaymongoRoutes );

app.get( '/', ( request, response ) => {
    response.send({ message: `Express server for Ecommerce App V2`});
});

app.get('/api/config/paypal', ( request, response ) => {
    response.send({ clientId: process.env.PAYPAL_CLIENT_ID })
})

app.listen( PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});