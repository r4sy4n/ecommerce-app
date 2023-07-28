import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from "../components/Rating";
import { useEffect, useState, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { CartContext } from "../context/CartContext";


const ProductScreen = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/${id}`).then((response) => {
        setProducts(response.data.products);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    // Prepare the item to add to the cart
    const itemToAdd = {
      _id: products._id,
      productName: products.productName,
      price: products.price * qty,
      qty: qty,
      image: products.images,
      stock: products.stock,
    };
    // Dispatch the action to add the item to the cart
    addToCart(itemToAdd);
    setAddedToCart(true);
  };

   // Navigate to the cart page after the cart state is updated
   useEffect(() => {
    if (addedToCart) {
      navigate('/cart');
    }
  }, [addedToCart, navigate]);

  return (
    <>
        {loading ? <Loading/> : (
            <div>
                <Link className="btn btn-dark my-3" to='/'>
                    Back
                </Link>
                <Row>
                    <Col md={5}>
                        <Card className="my-3 p-3 rounded">
                            <Card.Img src={products.images} alt={products.productName} fluid='true' />
                        </Card>
                    </Col>
                    <Col md={4}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{products.productName}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating value={products.ratings} text={`${products.numOfReviews} Reviews`} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: ₱{products.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: {products.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>
                                            <strong>₱{products.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            <strong>{products.stock === 0 ? '' : products.stock} {products.stock > 0 ? 'In Stock' : 'Out Of Stock'}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {products.stock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col>
                                                <Form.Control
                                                as="select"
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}>
                                                    {[...Array(products.stock).keys()].map((x) => (
                                                        <option key={ x + 1} value={ x + 1 }>
                                                            { x + 1 }
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Button 
                                        className="btn-block btn-warning"
                                        type="button"
                                        disabled={products.stock === 0}
                                        onClick={handleAddToCart}>
                                        Add To Cart
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
        )}
        
    </>
  )
}

export default ProductScreen;