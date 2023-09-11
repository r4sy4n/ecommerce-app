import { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loading from '../components/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import MetaData from '../components/MetaData';

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { pageNumber } = useParams();
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);

    // Set the default Axios configuration to include credentials
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/page/${pageNumber}`).then( response => {
          setProducts(response.data.products)
          setPage(response.data.page)
          setPages(response.data.pages)
          console.log(response)
          setIsLoading(false)
        }).catch((error) => {
          console.log(error)
          setIsLoading(false)
        })
      }, [pageNumber]);

    const deleteHandler = (id) => {
      setIsLoading(true)
      if(window.confirm('Delete this product?')){
        axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/products/${id}`).then(response => {
          console.log(response)
          toast.success(response.data.message)
          const updatedProducts = products.filter((product) => product._id !== id);
          setProducts(updatedProducts); // Update products state here
          setIsLoading(false)
        }).catch(error => {
          console.log(error)
        })
      }
    };

    const createProductHandler = () => {
      setIsLoading(true)
      if(window.confirm('Create new product?')){
        axios.post(`${import.meta.env.VITE_API_URL}/api/v1/products`).then(response => {
          setProducts((existingProducts) => [...existingProducts, response.data.dbResponse]);
          toast.success(response.data.message)
          setIsLoading(false)
        }).catch(error => {
          console.log(error)
        })
      }
    };

    return (
      <>
        <MetaData title='Product List' />
        <Row className='align-items-center'>
          <Col>
            <h1>Products</h1>
          </Col>
          <Col className='text-end'>
            <Button className='btn-sm m-3' onClick={ createProductHandler }>
              <FaEdit /> Create Product
            </Button>
          </Col>
        </Row>
        {isLoading ? <Loading /> : (
          <>
            <Table striped hover bordered responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  {/* <th>BRAND</th> */}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.productName}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    {/* <td>{}</td> */}
                    <td>
                      <LinkContainer to={`/admin/products/${product._id}/edit`}>
                        <Button variant='light' className='btn-sm mx-2'>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash style={{ color: 'white' }}/>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginate pages={pages} page={page} isAdmin={true} />
          </>
        )}
      </>
    )
}

export default ProductListScreen;