import { useContext, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
    const { shippingAddress, saveShippingAddress } = useContext(CartContext);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const navigate = useNavigate();

     // Check if shippingAddress exists in localStorage and set the initial state accordingly
  useEffect(() => {
    if (shippingAddress) {
      setAddress(shippingAddress.address || '');
      setCity(shippingAddress.city || '');
      setZipCode(shippingAddress.zipCode || '');
      setPhoneNumber(shippingAddress.phoneNumber || '');
      setCountry(shippingAddress.country || '');
    }
  }, [shippingAddress]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(address === '' || city === '' || zipCode === '' || phoneNumber === '' || country === ''){
            toast.error('All fields required')
        }else{
            const shippingAddress = {
                address,
                city,
                zipCode,
                phoneNumber,
                country,
              };
              // Dispatch the action to add the shipping address
              saveShippingAddress(shippingAddress);
              navigate('/payment')
        }
    }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Shipping</h1>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='address' className='my-2'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='city' className='my-2'>
                <Form.Label>City</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter city'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='zipCode' className='my-2'>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter zip code'
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='phoneNumber' className='my-2'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    type='number'
                    placeholder='Enter phone number'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='country' className='my-2'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter country'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='warning' className='my-2'>Continue</Button>
        </Form>
    </FormContainer>
  )
}

export default ShippingScreen;