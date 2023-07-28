import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Initialize cart state from localStorage
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : [];
  });

    // Calculate the total price of all items in the cart
  const totalCartPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  useEffect(() => {
    // Update localStorage whenever the cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("totalCartPrice", JSON.stringify(totalCartPrice));
  }, [cart, totalCartPrice]);

  const addToCart = (itemToAdd) => {
    const existingItem = cart.find((item) => item._id === itemToAdd._id);

    if (existingItem) {
      // If the item exists, update the quantity
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === itemToAdd._id
            ? {
                ...item,
                qty: item.qty + itemToAdd.qty,
                price: item.price + itemToAdd.price,
              }
            : item
        )
      );
    } else {
      // If the item does not exist, add it to the cart
      setCart((prevCart) => [...prevCart, { ...itemToAdd }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;