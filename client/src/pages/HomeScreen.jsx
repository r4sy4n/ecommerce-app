import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import axios from 'axios';
import Loading from '../components/Loading';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products`).then( response => {
      setProducts(response.data.products)
      setLoading(false)
    }).catch((error) => {
      console.log(error)
      setLoading(false)
    })
  }, []);

  // useEffect(() => {
  //   // This will log the updated cart value whenever it changes
  //   console.log(cart);
  //   localStorage.setItem('cart', JSON.stringify(cart))
  // }, [cart]);


  // const handleClick = (product) => {
  //   setCart([...cart, product])
  //   localStorage.setItem('cart', JSON.stringify(cart))
  // }

  return (
    <>
      {loading ? <Loading/> : (
        <div>
          <h1>Latest Products</h1>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} 
                // handleClick={handleClick}
                 />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  );
};

export default HomeScreen;