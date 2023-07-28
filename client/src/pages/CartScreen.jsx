import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { useContext } from 'react';

const CartScreen = () => {
  const { cart, updateCartItemQty  } = useContext(CartContext);
  // const { addToCart } = useContext(CartContext);

  // const navigate = useNavigate();

  const handleQtyChange = (item, newQty) => {
    updateCartItemQty(item._id, newQty);
  };
  
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
                  ₱{item.price}
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
              ₱{cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button type='button' className='btn-block btn-warning'>
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