import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';


const CartScreen = () => {
  const { cart, totalCartPrice, updateCartItemQty  } = useContext(CartContext);
  // const { addToCart } = useContext(CartContext);
  const [cartItems, setCartItems] = useState();
  const navigate = useNavigate();

  // Set the default Axios configuration to include credentials
axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/cartitems`).then( response => {
      setCartItems(response.data.cart)
    }).catch((error) => {
      console.log(error)
    })
  }, [cart])

  const handleQtyChange = (item, newQty) => {
    updateCartItemQty(item._id, newQty);
  };
  
  // console.log(totalCartPrice)

const checkOutHandler = () => {
  navigate('/login?redirect=/shipping')
}

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px'}}>Shopping Cart</h1>
        {cart.length === 0 ? (
        <div>Cart Empty <Link to='/'>Go Back</Link></div>
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
                  <Button type='button' className='btn-danger' disabled={item.length === 0}>
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
              <Button type='button' className='btn-block btn-warning' onClick={ checkOutHandler }>
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen;