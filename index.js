require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(`${MONGO_URI}`);

const baseURL = '/api/v1';
const ProductRoutes = require('./routes/ProductRoutes');
const AuthRoutes = require('./routes/AuthRoutes');

const app = express();
app.use( bodyParser.json() );
app.use( cors() );
app.use( morgan('dev') );
app.use( helmet() );

app.use( `${baseURL}/products`, ProductRoutes );
app.use( `${baseURL}/auth`, AuthRoutes );

app.get( '/', ( request, response ) => {
    response.send({ message: `Express server for Ecommerce App V2`});
});

app.listen( PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});