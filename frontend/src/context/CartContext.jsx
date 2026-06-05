import { createContext, useContext, useState, useEffect } from "react";
import { getAccessToken } from "../utils/auth";

const CartContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const token = getAccessToken();

  // Load Cart From Backend
  const fetchCart = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setCartItems([]);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/Cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Frontend update after Add To Cart API success
  const addToCart = (product) => {
    const exist = cartItems.find((item) => item.product === product.id);

    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          item.product === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          product: product.id,
          Product_name: product.name,
          product_price: product.price,
          product_image: product.image,
          product_stock: product.stocks,
          quantity: 1,
        },
      ]);
    }
    fetchCart();
  };

  // Remove Item From Backend
  const removeFromCart = async (id) => {
    try {
      const token = getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Cart/remove/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: id }),
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Increase Quantity with Stock Protection
  const increaseQuantity = async (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    try {
      const token = getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Cart/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: id,
          quantity: item.quantity + 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchCart();
      } else {
        alert(data.error || "Cannot increase quantity. Stock limit reached.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Decrease Quantity
  const decreaseQuantity = async (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    try {
      const token = getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Cart/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: id,
          quantity: item.quantity - 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchCart();
      } else {
        alert(data.error || "Cannot decrease quantity.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.product_price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        totalPrice,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);