import { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Loading from '../components/Loading';
import axios from 'axios';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders`, {withCredentials: true} ).then(response => {
      setOrders(response.data.orders)
      setIsLoading(false)
    })
  },[])


  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.username}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₱{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                      <span>{new Date(order.paymentResult.datePaid.date.datePaid).toLocaleDateString()}</span>
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
    </>
  )
}

export default OrderListScreen;