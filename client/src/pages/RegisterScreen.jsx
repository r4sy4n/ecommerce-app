import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { UserContext } from '../context/UserContext';

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [isLoading] = useState(false);
    const { userInfo, setUserInfo } = useContext(UserContext);
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if(userInfo){
      navigate(redirect)
    }
  },[userInfo, redirect, navigate])

// Set the default Axios configuration to include credentials
axios.defaults.withCredentials = true;

    const submitHandler = (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error('Passwords do not match!');
            return
        }else{
            axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, { username: name, email: email, password: password }).then( response => {
                localStorage.setItem('userInfo', JSON.stringify(response.data))
                toast.success(response.data.message)
                navigate(redirect)
                setUserInfo(response.data)
            }).catch(error => {
                console.log(error)
                toast.error(error.response.data.error)
            })
        }
        
    }

  return (
    <FormContainer>
        <h1>Register</h1>

        <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='my-3'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId='password' className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId='confirmPassword' className='my-3'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='warning' className='mt-2' disabled={ isLoading }>
                Register
            </Button>
            { isLoading && <Loading/>}
        </Form>
        <Row className='py-3'>
            <Col>
                Already have an account? <Link to={ redirect ? `/login?redirect=${redirect}` : '/login' }>Login</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen;