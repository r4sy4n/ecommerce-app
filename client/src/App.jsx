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
import HomeScreen from './pages/HomeScreen';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ShippingScreen from './pages/ShippingScreen';
import PaymentScreen from './pages/PaymentScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import OrderScreen from './pages/OrderScreen';

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SharedLayout/>} >
            <Route index element={<HomeScreen />} />
            <Route path='products/:id' element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />

            <Route path='' element={<PrivateRoutes />}>
              <Route path='/shipping' element={<ShippingScreen />} />
              <Route path='/payment' element={<PaymentScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
              <Route path='/orders/:id' element={<OrderScreen />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer autoClose='3000' position='top-center'/>
      </BrowserRouter>
  )
}

export default App;