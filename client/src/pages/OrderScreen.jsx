import { useEffect, useState } from 'react';
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
                            {order.isDelivered ? (
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
                            {order.isPaid ? (
                                <Message variant='success'>
                                    Paid on {order.paidAt}
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
                            {/* PAY ORDER PLACEHOLDER */}
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