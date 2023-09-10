import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import axios from 'axios';
import Loading from '../components/Loading';
import { useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pageNumber } = useParams();
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/page/${pageNumber}`).then( response => {
      setProducts(response.data.products)
      setPage(response.data.page)
      setPages(response.data.pages)
      setLoading(false)
      console.log(response)
    }).catch((error) => {
      console.log(error)
      setLoading(false)
    })
  }, [pageNumber]);

  return (
    <>
      {loading ? <Loading/> : (
        <div>
          <h1>Latest Products</h1>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={pages} page={page} />
        </div>
      )}
    </>
  );
};

export default HomeScreen;