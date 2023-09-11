import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './index.css';
import App from './App.jsx';
import CartProvider from './context/CartContext';
import UserProvider from './context/UserContext';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <UserProvider>
        <CartProvider>
            <App />
        </CartProvider>
      </UserProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
