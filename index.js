const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');

require('dotenv').config();

// mongoose.connect('mongodb://localhost:27017/databasenamedb')

const app = express();
app.use( bodyParser.json() );
app.use( cors() );
app.use( morgan('dev') );
app.use( helmet() );

app.get( '/', ( request, response ) => {
    response.send({ message: `Express server for Ecommerce App V2`});
});

app.listen( PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});