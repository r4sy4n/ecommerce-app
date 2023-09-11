import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import MetaData from '../components/MetaData';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('Gcash');
    const { savePaymentMethod } = useContext(CartContext);
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod(paymentMethod)
        navigate('/placeorder')
    }

  return (
    <>
        <MetaData title='Payment Method' />
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={ submitHandler }>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            className='my-2'
                            label='Gcash'
                            id='gcash'
                            name='paymentMethod'
                            value='gcash'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}>
                        </Form.Check>
                    </Col>
                </Form.Group>
                <Button type='submit' variant='warning'>
                    Continue
                </Button>

            </Form>
        </FormContainer>
    </>
  )
}

export default PaymentScreen;