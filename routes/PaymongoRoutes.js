const express = require('express');
const router = express.Router();
const axios = require('axios');
const SECRET_API_KEY = process.env.SECRET_API_KEY;

router.post('/', ( request, response ) => {
    const checkoutSessionData = {
      data: {
        attributes: {
          billing: request.body.attributes.billing,
          line_items: request.body.attributes.line_items,
          payment_method_types: request.body.attributes.payment_method_types,
          customer_email: request.body.attributes.billing.email,
          send_email_receipt: true,
          paid_at: request.body.attributes.paid_at,
          reference_number: request.body.attributes.reference_number
          // description: request.body.attributes.description,
          // merchant: request.body.attributes.merchant,
        },
      },
    };
    axios.post(
      'https://api.paymongo.com/v1/checkout_sessions',
      checkoutSessionData,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${SECRET_API_KEY}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(dbResponse => {
      response.status( 200 ).send(dbResponse.data);
    })
    .catch(error => {
      console.error(error.response.data);
      response.status( 500 ).send({ error: 'An error occurred while creating the checkout session.' });
    });
  });

  router.get('/:id', ( request, response ) => {
    const sessionId = request.params.id;
    axios.get(`https://api.paymongo.com/v1/checkout_sessions/${sessionId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${SECRET_API_KEY}:`).toString('base64')}`
      }
    })
    .then(dbResponse => {
      response.status( 200 ).send(dbResponse.data);
    })
    .catch(error => {
      console.error(error);
      response.status( 500 ).send({ error: 'An error occurred while retrieving the checkout session.' });
    })
  })
  
module.exports = router;