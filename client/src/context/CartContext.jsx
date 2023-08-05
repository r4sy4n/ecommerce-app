import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Initialize cart state from localStorage
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : [];
  });


   // Calculate the total price based on the cart state
  const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  useEffect(() => {
    // Calculate the total price whenever the cart changes
    const totalCartPrice = calculateTotalPrice(cart);
    // Update localStorage whenever the cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("totalCartPrice", JSON.stringify(totalCartPrice));
  }, [cart]);

  const addToCart = (itemToAdd) => {
    const existingItem = cart.find((item) => item._id === itemToAdd._id);
  
    if (existingItem) {
      // If the item exists, update the quantity
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === itemToAdd._id ? { ...item, qty: item.qty + itemToAdd.qty } : item
        )
      );
    } else {
      // If the item does not exist, add it to the cart without updating the price
      setCart((prevCart) => [...prevCart, { ...itemToAdd, price: itemToAdd.price / itemToAdd.qty }]);
    }
  };

   const updateCartItemQty = (itemId, newQty) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId
          ? { ...item, qty: newQty }
          : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartPrice = calculateTotalPrice(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalCartPrice,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;