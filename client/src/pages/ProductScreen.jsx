import { useParams, Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from 'react-bootstrap';
import Rating from "../components/Rating";
import products from "../products";

const ProductScreen = () => {
    const { id } = useParams();
    const productId = Number(id);
    const product = products.find((p) => p._id === productId);
    console.log(product)
  return (
    <>
        <Link className="btn btn-light my-3" to='/'>
            Back
        </Link>
        <Row>
            <Col md={5}>
                <Image src={product.images} alt={product.productName} fluid />
            </Col>
            <Col md={4}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h3>{product.productName}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value={product.ratings} text={`${product.numOfReviews} Reviews`} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Price: ₱{product.price}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Description: {product.description}
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
                                    <strong>₱{product.price}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Status:</Col>
                                <Col>
                                    <strong>{product.stock === 0 ? '' : product.stock} {product.stock > 0 ? 'In Stock' : 'Out Of Stock'}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button 
                                className="btn-block"
                                type="button"
                                disabled={product.stock === 0}>
                                Add To Cart
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default ProductScreen;