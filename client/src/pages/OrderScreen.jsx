import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loading from '../components/Loading';
import axios from 'axios';

const OrderScreen = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('')
    const [order, setOrder] = useState('')
    const [checkout_url, setCheckout_Url] = useState('');
    const {paymentStatus, setPaymentStatus, checkoutSessionId, setCheckoutSessionId} = useContext(CartContext);
    const [paidData, setPaidData] = useState(false);
    
    // Set the default Axios configuration to include credentials
axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/${id}`).then(response => {
            console.log(response.data.orders)
            setOrder(response.data.orders)
            setIsLoading(false)
        }).catch(error => {
            setError(error)
        })
    }, [id])

    const payNowHandler = () => {
        const addTwoZeros = (amount) => {
            return parseInt(`${amount}00`);
        }
        const lineItems = order.orderItems.map((item) => ({
            currency: "PHP",
            amount: addTwoZeros(item.price),
            name: item.name,
            quantity: item.quantity,
            images: item.image,
        }))
        const paymentMethodsArray = order.paymentMethod.map((orders) => orders.toLowerCase());
        const requestBody = {
            attributes: {
                billing: {
                    name: order.user.username, 
                    email: order.user.email, 
                    phone: order.shippingInfo.phoneNumber,
                    address: {
                        city: order.shippingInfo.city,
                        country: order.shippingInfo.country.toUpperCase(),
                        line1: order.shippingInfo.address,
                        postal_code: order.shippingInfo.zipCode
                    }
                },
                // cancel_url: `${import.meta.env.VITE_API_URL}/api/v1/orders/${id}`,
                // success_url: `${import.meta.env.VITE_API_URL}/api/v1/orders/${id}`,
                reference_number: `${id}`,
                payment_method_types: paymentMethodsArray,
                show_description: false,
                customer_email: order.user.email,
                line_items: lineItems
            },
        };

    axios.post(`${import.meta.env.VITE_API_URL}/api/v1/createCheckoutSession`, requestBody).then(response => {
            console.log(response)
            setCheckout_Url(response.data.data.attributes.checkout_url)
            setPaymentStatus(response.data.data.attributes.payment_intent.attributes.status)
            setCheckoutSessionId(response.data.data.id)
            console.log(response.data.data.attributes.payment_intent.attributes.status)
            console.log(response.data.data.id)
        }).catch(error => {
            console.log(error.response.data)
        })
    };

    useEffect(() => {
        localStorage.setItem("checkoutSessionId", JSON.stringify(checkoutSessionId));
        localStorage.setItem("paymentStatus", JSON.stringify(paymentStatus));
    }, [checkoutSessionId, paymentStatus])

    useEffect(() => {
        if (checkout_url) {
            // Open the checkout URL in a new window
            window.open(checkout_url, '_blank');
        }
    },[checkout_url])

    useEffect(() => {
        if(checkoutSessionId){
            const fetchAndUpdateStatus = () => {
                axios.get(`${import.meta.env.VITE_API_URL}/api/v1/createCheckoutSession/${checkoutSessionId}`).then(response => {
                    console.log(response)
                    setPaymentStatus(response.data.data.attributes.payment_intent.attributes.status)
                    setIsLoading(false)
                    if (response.data.data.attributes.payment_intent.attributes.status === 'succeeded') {
                        clearInterval(intervalId);
                    }
                }).catch(error => {
                    console.log(error.response)
                })
            }
            const intervalId = setInterval(fetchAndUpdateStatus, 5000);
        
              // Clear the interval when the component unmounts
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [order, checkoutSessionId]);

    useEffect(() => {
        if(paymentStatus === 'succeeded'){
            axios.put(`${import.meta.env.VITE_API_URL}/api/v1/orders/${id}/pay`).then(response => {
                console.log('res:', response)
                setPaidData(response.data)
            })
        } 
    },[id, paymentStatus])

console.log(paymentStatus)

return (
    isLoading ? <Loading /> : error ? <Message variant='danger'>{error}</Message> : (
        <>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {order.user.username}</p>
                            <p><strong>Email: </strong> {order.user.email}</p>
                            <p><strong>Address: </strong> {order.shippingInfo.address},{' '}{order.shippingInfo.city}{' City '}{order.shippingInfo.zipCode}{' '}{order.shippingInfo.country}</p>
                            <p><strong>Phone Number</strong> {order.shippingInfo.phoneNumber}</p>
                            {paidData.isDelivered ? (
                                <Message variant='success'>
                                    Delivered on {order.deliveredAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>
                                    Not Yet Delivered
                                </Message>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {paidData.isPaid ? (
                                <Message variant='success'>
                                    Paid on {paidData.paidAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>
                                    Not Yet Paid
                                </Message>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col>
                                            <Link to={`/products/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col md={4}>
                                            {item.quantity} x ₱{item.price} = ₱{item.quantity * item.price}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
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
                                    <Col>Total Price:</Col>
                                    <Col>₱{order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!paidData.isPaid && (
                                <ListGroup.Item>
                                    {isLoading && <Loading />}
                                {isLoading ? <Loading/> : (
                                    <Button
                                        type='button'
                                        className='btn-block'
                                        variant='warning'
                                        onClick={ payNowHandler }
                                        >
                                            Pay Now
                                    </Button>
                                )}    
                                
                            </ListGroup.Item>
                            )}
                            
                            {/* MARK AS DELIVERED PLACEHOLDER */}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
  )
}

export default OrderScreen;