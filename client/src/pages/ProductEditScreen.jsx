import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductEditScreen = () => {
  const { id } = useParams();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/${id}`).then( response => {
      console.log(response)
      setProductName(response.data.products.productName)
      setPrice(response.data.products.price)
      setImages(response.data.products.images)
      setCategory(response.data.products.category)
      setStock(response.data.products.stock)
      setDescription(response.data.products.description)
      setLoading(false)
    }).catch(error => {
      console.log(error)
    })
  },[id]);

  const submitHandler = (e) => {
    e.preventDefault()
    axios.put(`${import.meta.env.VITE_API_URL}/api/v1/products/${id}`, { productName, price, images, category, stock, description }, {withCredentials: true}).then( response => {
      console.log(response)
      navigate('/admin/productlist')
      toast.success('Product updated')
    })
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loading ? <Loading /> : (
          <Form onSubmit={ submitHandler }>
            <Form.Group controlId='productName' className='my-2'>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter product name'
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='price' className='my-2'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='images' className='my-2'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image link'
                value={images}
                onChange={(e) => setImages(e.target.value)}
                >
              </Form.Control>
            </Form.Group>

          <Form.Group controlId='category' className='my-2'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='stock' className='my-2'>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter stock'
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='description' className='my-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                >
              </Form.Control>
            </Form.Group>

            <Button type='submit' variant='warning' className='my-2'>
              Update
            </Button>
          </Form>
        )}

      </FormContainer>
    </>
  )
}

export default ProductEditScreen;