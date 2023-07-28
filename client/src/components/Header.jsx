import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/images/logo.png';
import { CartContext } from '../context/CartContext';
import { useContext, useEffect, useState } from 'react';

const Header = () => {
    const { cart } = useContext(CartContext);
    const [cartItems, setCartItems] = useState(0);

    useEffect(() => {
        setCartItems(cart.reduce((total, item) => total + item.qty, 0))
    },[cartItems, cart])
    
  return (
    <header>
        <Navbar bg='info' data-bs-theme='light' expand='md' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand>
                        <img src={logo} className='logo' alt='logo' />
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <LinkContainer to='/cart'>
                            <Nav.Link>
                                <FaShoppingCart/> Cart
                                {
                                    <Badge pill bg='danger' style={{marginLeft: '5px'}}>
                                        {cartItems}
                                    </Badge>
                                }
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/login'>
                            <Nav.Link>
                                <FaUser/> Sign In
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
};

export default Header;