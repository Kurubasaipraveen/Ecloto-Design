import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Products.css";
import PRODUCTS from "./data"; // Import PRODUCTS from data.js

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

const ProductList = () => {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const calculateSubtotal = (items) =>
    items
      .filter((item) => item.id !== FREE_GIFT.id)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;

    setCart((prevCart) => {
      let updatedCart = [...prevCart];
      const productIndex = updatedCart.findIndex((item) => item.id === product.id);

      if (productIndex !== -1) {
        // Update quantity if product already in cart
        updatedCart[productIndex].quantity += quantity;
      } else {
        // Add new product
        updatedCart.push({ ...product, quantity });
      }

      // Recalculate subtotal (excluding gift)
      const subtotal = calculateSubtotal(updatedCart);

      // Free gift logic
      const hasGift = updatedCart.some((item) => item.id === FREE_GIFT.id);

      if (subtotal >= THRESHOLD && !hasGift) {
        updatedCart.push({ ...FREE_GIFT, quantity: 1 });
      } else if (subtotal < THRESHOLD && hasGift) {
        updatedCart = updatedCart.filter((item) => item.id !== FREE_GIFT.id);
      }

      return updatedCart;
    });
  };

  const RedirectCart = () => {
    navigate("/cart", { state: { cart } });
  };

  return (
    <div className="product-list-container">
      <h1>E-Commerce Store</h1>
      <div className="cart-icon" onClick={RedirectCart}>
        🛒 <span>Cart ({cart.filter((item) => item.id !== FREE_GIFT.id).length})</span>
      </div>
      <ul className="product-list">
        {PRODUCTS.map((product) => (
          <li key={product.id} className="product-item">
            <img src={product.image} alt={product.name} className="product-image" />
            <span className="product-name">{product.name}</span>
            <span className="product-price">${product.price}</span>
            <div className="quantity-controls">
              <button
                className="quantity-btn-first"
                onClick={() => handleQuantityChange(product.id, -1)}
              >
                -
              </button>
              <span>{quantities[product.id] || 1}</span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(product.id, 1)}
              >
                +
              </button>
            </div>
            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
