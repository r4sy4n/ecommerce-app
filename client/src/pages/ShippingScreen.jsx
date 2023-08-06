import { useContext, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const ShippingScreen = () => {
    const { shippingAddress, saveShippingAddress } = useContext(CartContext);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const navigate = useNavigate();

     // Check if shippingAddress exists in localStorage and set the initial state accordingly
  useEffect(() => {
    if (shippingAddress) {
      setAddress(shippingAddress.address || '');
      setCity(shippingAddress.city || '');
      setZipCode(shippingAddress.zipCode || '');
      setCountry(shippingAddress.country || '');
    }
  }, [shippingAddress]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(address === '' || city === '' || zipCode === '' || country === ''){
            toast.error('All fields required')
        }else{
            const shippingAddress = {
                address,
                city,
                zipCode,
                country,
              };
              // Dispatch the action to add the shipping address
              saveShippingAddress(shippingAddress);
              navigate('/payment')
        }
        
    }

  return (
    <FormContainer>
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