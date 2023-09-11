import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loading from '../components/Loading';
import axios from 'axios';

const ProductCarousel = () => {
    const [isLoading, setIsLoading] =  useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/top`).then(response => {
            setProducts(response.data.product)
            setIsLoading(false)
            console.log(response)
        })
    },[])


  return (
    isLoading ? <Loading /> : (
        <Carousel pause='hover' className='bg-primary mb-4'>
            {products.map(product => (
                <Carousel.Item key={product._id}>
                    <Link to={`/products/${product._id}`}>
                        <Image src={product.images} alt={product.productName}/>
                        <Carousel.Caption className='carousel-caption'>
                            <h2>{product.productName} (₱{product.price})</h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
  )
}

export default ProductCarousel;