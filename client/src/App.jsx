import './App.css';
import SharedLayout from './pages/SharedLayout';
import { 
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SharedLayout/>} >
            <Route index element={<HomeScreen />} />
            <Route path='products/:id' element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App;