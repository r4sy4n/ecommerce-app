import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from "../components/Rating";
import { useEffect, useState, useContext, useCallback } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { UserContext } from '../context/UserContext';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import MetaData from "../components/MetaData";

const ProductScreen = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qty] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { userInfo } = useContext(UserContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Implement usecallback hook to memoize the fetchProductData function and prevent unnecessary re-renders.
    const fetchProductData = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/${id}`, {withCredentials:true}).then((response) => {
            setProducts(response.data.products);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        });
    },[id])

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);


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

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_URL}/api/v1/products/${id}/reviews`, {rating : rating, comment: comment}, {withCredentials:true}).then(response => {
            setLoading(false)
            setRating('')
            setComment('')
            fetchProductData();
            toast.success(response.data.message)
        }).catch(error => {
            toast.error(error.response.data.message)
            console.log(error)
        })
    }

    return (
        <>
            {loading ? <Loading/> : (
                <div>
                    <MetaData title={products.productName} />
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

                                    {/* {products.stock > 0 && (
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
                                    )} */}

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
                    <Row className="review">
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {loading ? (<Loading />) : (products.reviews.length === 0 && <Message>No Reviews</Message>)}
                            <ListGroup variant="flush">
                            {loading ? (<Loading />) : (
                                products.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{new Date(review.createdAt).toLocaleString()}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))
                                )}
                                
                                <ListGroup.Item>
                                    <h2>Write A Review</h2>

                                    {loading && <Loading />}
                                    {userInfo ? (
                                        <Form onSubmit={ submitHandler }>
                                            <Form.Group controlId='rating' className='my-2'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                >
                                                    <option value=''>Select...</option>   
                                                    <option value='1'>1 - Poor</option>      
                                                    <option value='2'>2 - Fair</option>      
                                                    <option value='3'>3 - Good</option>      
                                                    <option value='4'>4 - Very Good</option>      
                                                    <option value='5'>5 - Excellent</option>      
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment' className='my-2'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    row='3'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                >    
                                                </Form.Control>
                                            </Form.Group>
                                            <Button
                                                type="submit"
                                                variant="warning"
                                            >
                                                Submit
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Message>
                                            Please <Link to='/login'>sign in</Link> to write a review
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
            )}
            
        </>
    )
}

export default ProductScreen;