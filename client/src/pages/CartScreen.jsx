import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import MetaData from '../components/MetaData';

const CartScreen = () => {
  const { cart, totalCartPrice, updateCartItemQty  } = useContext(CartContext);
  const { removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQtyChange = (item, newQty) => {
    updateCartItemQty(item._id, newQty);
  };
  

  const checkOutHandler = () => {
    navigate('/login?redirect=/shipping')
  }

  return (
    <>
      <MetaData title='Shopping Cart' />
      <Row>
        <Col md={8}>
          <h1 style={{ marginBottom: '20px'}}>Shopping Cart</h1>
          {cart.length === 0 ? (
          <Message variant='danger'>Cart Empty <Link to='/'>Go Back</Link></Message>
          ) : (
          <ListGroup variant='flush'>
            {cart.map((item) => (
              <ListGroup.Item key={ item._id }>
                <Row>
                  <Col md={2}>
                    <Card>
                      <Image src={item.image} alt={item.name} fluid='true' rounded />
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Link to={`{/products/${item._id}}`}>{item.productName}</Link>
                  </Col>
                  <Col md={2}>
                    ₱{item.price * item.qty}
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => {handleQtyChange(item, Number(e.target.value))}}>
                          {[...Array(item.stock).keys()].map((x) => (
                              <option key={ x + 1} value={ x + 1 }>
                                  { x + 1 }
                              </option>
                          ))}
                      </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button type='button' className='btn-danger' onClick={() => removeFromCart(item._id)}>
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
          ))}
          </ListGroup>)}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>
                  Subtotal ({cart.reduce((total, item) => total + item.qty, 0)}) items
                </h2>
                ₱{totalCartPrice.toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button type='button' className='btn-block btn-warning' disabled={cart.length === 0} onClick={ checkOutHandler }>
                  Proceed to Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CartScreen;