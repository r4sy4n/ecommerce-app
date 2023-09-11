import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import axios from 'axios';
import MetaData from '../components/MetaData';

const UserEditScreen = () => {
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/admin/${id}`, {withCredentials: true}).then( response => {
        setUsername(response.data.user)
        setEmail(response.data.email)
        setIsAdmin(response.data.isAdmin)
        setLoading(false)
        }).catch(error => {
        console.log(error)
        })
    },[id]);

    const submitHandler = (e) => {
        e.preventDefault()
        axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/admin/${id}`, { username, email, isAdmin }, {withCredentials: true}).then( response => {
            navigate('/admin/userlist')
            toast.success('User updated')
        })
        .catch(error => {
            console.log(error)
            })
    }

    return (
        <>
            <MetaData title='Edit User' />
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loading ? <Loading /> : (
                <Form onSubmit={ submitHandler }>
                    <Form.Group controlId='username' className='my-2'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        >
                    </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email' className='my-2'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        >
                    </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isAdmin' className='my-2'>
                    <Form.Check
                        type='checkbox'
                        label='Is Admin'
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    ></Form.Check>
                    </Form.Group>

                    <Button type='submit' variant='warning' className='my-2'>
                    Update
                    </Button>
                </Form>
                )}
            </FormContainer>
        </>
    )
};

export default UserEditScreen;