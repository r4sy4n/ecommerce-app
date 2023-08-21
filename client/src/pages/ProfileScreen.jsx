import { useState, useEffect, useContext } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const ProfileScreen = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] =useState('');
    const [password, setPassword] =useState('');
    const [confirmPassword, setConfirmPassword] =useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [myOrders, setMyOrders] = useState([{}]);
    const { userInfo, setUserInfo } = useContext(UserContext);

    useEffect(() => {
        if(userInfo){
            setUserName(userInfo.username)
            setEmail(userInfo.email)
            setIsLoading(false)
        }
    },[userInfo])

    const submitHandler = (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error('Password do not match')
        }else{
            axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/profile`, {username, email, password}, {withCredentials: true}).then(response => {
                console.log(response)
                // Update the userInfo state with new username and email
                setUserInfo(prevUserInfo => ({
                    ...prevUserInfo,
                    username,
                    email
                }));
                 // Show a success message
                toast.success('Profile updated successfully');
            }).catch(error => {
                console.log(error)
            })
        }
    }

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/myorders`, {withCredentials: true}).then(response => {
            console.log(response)
            setMyOrders(response.data.myOrders)
            setIsLoading(false)
        })
    },[])

  return (
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='name'
                        placeholder='Enter name'
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email' className='my-2'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='confirmPassword' className='my-2'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='warning' className='my-2'>
                    Update
                </Button>
                {isLoading && <Loading />}
            </Form>
        </Col>
        <Col md={9}>
            <h2>My Orders</h2>

            {isLoading ? <Loading /> : (
                <Table striped hover bordered responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {myOrders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>₱{order.totalPrice}</td>
                                <td>
                                    {order.isPaid ? (
                                        order.paidAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{ color: 'red' }}/>
                                    )}
                                </td>
                                <td>
                                    {order.isDelivered ? (
                                        order.deliveredAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{ color: 'red' }}/>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/orders/${order._id}`}>
                                        <Button variant='light' className='btn-sm'>
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Col>
    </Row>
  )
}

export default ProfileScreen;