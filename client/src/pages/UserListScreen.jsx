import { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaTrash, FaCheck, FaEdit } from 'react-icons/fa';
import Loading from '../components/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';
import MetaData from '../components/MetaData';

const UserListScreen = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/admin`, {withCredentials: true} ).then(response => {
            setUsers(response.data.users)
            console.log(response)
            setIsLoading(false)
        }).catch((error) => {
            console.log(error)
            setIsLoading(false)
        })
    },[])

    const deleteHandler = (id) => {
        setIsLoading(true)
        if(window.confirm('Delete this user?')){
            axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/users/admin/${id}`).then(response => {
                toast.success(response.data.message)
                const updatedUsers = users.filter((user) => user._id !== id);
                setUsers(updatedUsers); // Update user state here
                setIsLoading(false)
            }).catch(error => {
                console.log(error)
            })
        }
    };

    return (
        <>
            <MetaData title='User List' />
            <h1>Users</h1>
            {isLoading ? (
                <Loading />
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USERNAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.username}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>
                                {user.isAdmin ? (
                                    <FaCheck style={{ color: 'green' }}/>
                                ) : (
                                    <FaTimes style={{ color: 'red' }}/>
                                )}
                                </td>
                                <td>
                                <LinkContainer to={`/admin/users/${user._id}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <FaEdit />
                                    </Button>
                                </LinkContainer>
                                <Button
                                    variant='danger'
                                    className='btn-sm'
                                    onClick={() => deleteHandler(user._id)}
                                >
                                    <FaTrash style={{ color: 'white' }}/>
                                </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default UserListScreen;