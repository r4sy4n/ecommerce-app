import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/images/logo.png';

const Header = () => {
    const { cart } = useContext(CartContext);
    const [cartItems, setCartItems] = useState(0);
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

// console.log(userInfo)
    useEffect(() => {
        setCartItems(cart.reduce((total, item) => total + item.qty, 0))
    },[cartItems, cart])
    
    const logoutHandler = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`).then( response => {
            localStorage.removeItem('userInfo')
            setUserInfo(null);
            toast.success(response.data.message)
            navigate('/login')
        }).catch(error => {
            toast.error(error.response.data.error)
        })
    }

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
                        { userInfo ? (
                            <NavDropdown title={userInfo.username} id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>Profile</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={ logoutHandler }>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <LinkContainer to='/login'>
                            <Nav.Link>
                                <FaUser/> Sign In
                            </Nav.Link>
                            </LinkContainer>
                        )}
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
};

export default Header;