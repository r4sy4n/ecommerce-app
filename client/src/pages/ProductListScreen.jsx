import { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loading from '../components/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products`).then( response => {
          setProducts(response.data.products)
          console.log(response)
          setIsLoading(false)
        }).catch((error) => {
          console.log(error)
          setIsLoading(false)
        })
      }, []);

    const deleteHandler = (id) => {
      console.log('delete:', id)
    };
    // Set the default Axios configuration to include credentials
    axios.defaults.withCredentials = true;

    const createProductHandler = () => {
      if(window.confirm('Create new product?')){
        axios.post(`${import.meta.env.VITE_API_URL}/api/v1/products`).then(response => {
          setProducts((existingProducts) => [...existingProducts, response.data.dbResponse]);
          toast.success(response.data.message)
        }).catch(error => {
          console.log(error)
        })
      }
    };

    return (
      <>
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
          </>
        )}
      </>
    )
}

export default ProductListScreen;