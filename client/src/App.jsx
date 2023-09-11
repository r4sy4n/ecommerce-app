import './App.css';
import SharedLayout from './pages/SharedLayout';
import { 
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoutes from './components/PrivateRoutes';
import AdminRoutes from './components/AdminRoutes';
import HomeScreen from './pages/HomeScreen';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ShippingScreen from './pages/ShippingScreen';
import PaymentScreen from './pages/PaymentScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import OrderScreen from './pages/OrderScreen';
import ProfileScreen from './pages/ProfileScreen';
import OrderListScreen from './pages/OrderListScreen';
import ProductListScreen from './pages/ProductListScreen';
import ProductEditScreen from './pages/ProductEditScreen';
import UserListScreen from './pages/UserListScreen';
import UserEditScreen from './pages/UserEditScreen';

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SharedLayout/>} >
            <Route index element={<HomeScreen />} />
            <Route path='/search/:keyword' element={<HomeScreen />} />
            <Route path='/page/:pageNumber' element={<HomeScreen />} />
            <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
            <Route path='products/:id' element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />

            <Route path='' element={<PrivateRoutes />}>
              <Route path='/shipping' element={<ShippingScreen />} />
              <Route path='/payment' element={<PaymentScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
              <Route path='/orders/:id' element={<OrderScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />
            </Route>
            
            <Route path='' element={<AdminRoutes />}>
              <Route path='/admin/orderlist' element={<OrderListScreen />} />
              <Route path='/admin/productlist' element={<ProductListScreen />} />
              <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />} />
              <Route path='/admin/products/:id/edit' element={<ProductEditScreen />} />
              <Route path='/admin/userlist' element={<UserListScreen />} />
              <Route path='/admin/users/:id/edit' element={<UserEditScreen />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer autoClose='3000' />
      </BrowserRouter>
  )
}

export default App;