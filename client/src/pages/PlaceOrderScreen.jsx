import { useEffect, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
// import { UserContext } from '../context/UserContext';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import axios from 'axios';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { cart, shippingAddress, paymentMethod, totalCartPrice, clearCart } = useContext(CartContext);
    // const { userInfo } = useContext(UserContext);

    useEffect(() => {
        if(!shippingAddress.address){
            navigate('/shipping')
        }else if(!paymentMethod){
            navigate('/payment')
        }
    }, [paymentMethod, shippingAddress.address, navigate])

    const placeOrderHandler = () => {
        setLoading(true);
    
        const orderData = {
            orderItems: cart.map(item => ({
                name: item.productName,  // Make sure to adjust this based on your cart data
                quantity: item.qty,
                image: item.image,
                price: item.price,
                product: item._id,
                _id: undefined
            })),
            shippingInfo: {
                address: shippingAddress.address,
                city: shippingAddress.city,
                phoneNumber: shippingAddress.phoneNumber,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country
            },
            paymentMethod: paymentMethod,
            itemsPrice: totalCartPrice,
            // shippingPrice: 0, // You might want to adjust this
            totalPrice: totalCartPrice, // You might want to adjust this
            isPaid: false, // You might want to adjust this
            isDelivered: false // You might want to adjust this
        };
    
        axios.post(`${import.meta.env.VITE_API_URL}/api/v1/orders`, orderData).then((response) => {
                console.log(response.data);
                clearCart();
                setLoading(false);
                toast.success(response.data.message);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
                toast.error('An error occurred while placing the order.');
            });
    };
// console.log(userInfo)
  return (
    <>
        <CheckoutSteps step1 step2 step3 step4 />
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {shippingAddress.address},{' '}{shippingAddress.city}{' '}{shippingAddress.zipCode},{' '}{shippingAddress.country}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <strong>Method: </strong>
                        {paymentMethod}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {cart.length === 0 ? (
                            'Your cart is Empty'
                        ) : (
                            <ListGroup variant='flush'>
                                {cart.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={2}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/products/${item._id}`}>
                                                    {item.productName}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x ₱{item.price} = ₱{item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items:</Col>
                                <Col>
                                    ₱{totalCartPrice}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cart.length === 0}
                                variant='warning'
                                onClick={ placeOrderHandler }>
                                    Place Order
                            </Button>
                            {loading && <Loading />}
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default PlaceOrderScreen;