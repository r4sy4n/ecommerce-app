import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loading from '../components/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderScreen = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('')
    const [order, setOrder] = useState('')
    const [checkout_url, setCheckout_Url] = useState('');
    const [checkoutSessionId, setCheckoutSessionId] = useState('');
    const [paymentCreated, setPaymentCreated] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('awaiting_payment_method');
    const [paidData, setPaidData] = useState(false);
    const [datePaid, setDatePaid] = useState('');
    
    // Set the default Axios configuration to include credentials
axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/${id}`).then(response => {
            console.log(response.data.orders)
            setOrder(response.data.orders)
            setPaymentCreated(response.data.orders.paymentResult.created);
            setTimeout(() => {
                setIsLoading(false)
            }, 3000);
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
            setIsLoading(false)
            const checkoutSessionId = response.data.data.id;

            // Send the checkout session ID to the server to save in the database
            axios.put(`${import.meta.env.VITE_API_URL}/api/v1/orders/${id}/saveCheckoutSession`, {
                checkoutSessionId: checkoutSessionId
            }).then(savedResponse => {
                console.log('Checkout session ID saved:', savedResponse);
                setOrder(savedResponse.data.savedOrder)
                setPaymentCreated(savedResponse.data.savedOrder.paymentResult.created)
                setIsLoading(false)
            }).catch(error => {
                console.log('Error saving checkout session ID:', error);
            });
        }).catch(error => {
            console.log(error.response.data)
        })
    };
console.log(paymentCreated)
console.log(checkoutSessionId)

    useEffect(() => {
        if (checkout_url) {
            // Open the checkout URL in a new window
            window.open(checkout_url, '_blank');
        }
    },[checkout_url])

    useEffect(() => {
        if(paymentCreated){
            setCheckoutSessionId(order.paymentResult.id)
            const fetchAndUpdateStatus = () => {
                axios.get(`${import.meta.env.VITE_API_URL}/api/v1/createCheckoutSession/${checkoutSessionId}`).then(response => {
                    console.log(response)
                    setPaymentStatus(response.data.data.attributes.payment_intent.attributes.status)
                    setIsLoading(false)
                    if (response.data.data.attributes.payment_intent.attributes.status === 'succeeded') {
                        clearInterval(intervalId);
                        toast.success('Payment Successful')
                        setDatePaid(new Date(response.data.data.attributes.paid_at * 1000).toLocaleString())
                    }
                }).catch(error => {
                    console.log(error.response)
                })
            }
            const intervalId = setInterval(fetchAndUpdateStatus, 3000);
        
              // Clear the interval when the component unmounts
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [checkoutSessionId, paymentCreated]);

    useEffect(() => {
        if(paymentStatus === 'succeeded'){
            const date = {
                datePaid: datePaid,
            };
            axios.put(`${import.meta.env.VITE_API_URL}/api/v1/orders/${id}/pay`, {date}).then(response => {
                console.log('res:', response)
                setPaidData(response.data)
            })
        } 
    },[id, paymentStatus, datePaid])

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
                                    Paid on {paidData.paymentResult.datePaid.date.datePaid}
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
                                        disabled={paymentCreated === true}
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