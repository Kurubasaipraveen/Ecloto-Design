import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/cart.css";
import products from "./data";

const FREE_GIFT = { id: 999, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

const ShoppingCart = () => {
  const location = useLocation();
  const initialCart = location.state?.cart || [];
  const [cart, setCart] = useState(initialCart);

  const subtotal = cart
    .filter((item) => item.id !== FREE_GIFT.id)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const remaining = Math.max(0, THRESHOLD - subtotal);

  useEffect(() => {
    const hasGift = cart.some((item) => item.id === FREE_GIFT.id);
    if (subtotal >= THRESHOLD && !hasGift) {
      setCart((prevCart) => [...prevCart, { ...FREE_GIFT, quantity: 1 }]);
    } else if (subtotal < THRESHOLD && hasGift) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== FREE_GIFT.id));
    }
  }, [subtotal]); // react only when subtotal changes

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div className="container">
      <h1 className="title">🛒 Shopping Cart</h1>

      {/* Products Section */}
      <h2 className="section-title">Products</h2>
      <div className="product-grid">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="product-card">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">₹{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="add-to-cart-btn"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

        
<div className="cart-summary">
  <h2>Cart Summary</h2>
  <div className="RowTwo">
    <p className="subtotal">Subtotal:</p>
    <p className="total">₹{subtotal}</p>
  </div>

  <hr />
  <div className="progress-card">
    {remaining > 0 ? (
      <p className="info-message">
        Add ₹{remaining} more to get a FREE Wireless Mouse!
      </p>
    ) : (
      <p className="success-message">
        🎉 You've unlocked a FREE Wireless Mouse!
      </p>
    )}
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${Math.min((subtotal / THRESHOLD) * 100, 100)}%` }}
      ></div>
    </div>
  </div>
  {cart.length === 0 && (
    <div className="empty-cart">
      <p>Your cart is empty 🛒</p>
      <p>Add some items to see them here.</p>
    </div>
  )}

  {cart.length > 0 && (
    <ul className="cart-items">
      {cart.map((item) => (
        <li
          key={item.id}
          className={`cart-item ${item.id === FREE_GIFT.id ? "free-gift" : ""}`}
        >
          <span>
            {item.name} <br />
            ₹{item.price} × {item.quantity} = ₹
            {item.price * item.quantity}
          </span>

          {item.id !== FREE_GIFT.id && (
            <div className="quantity-controls">
              <button
                className="decrease-btn"
                onClick={() => decreaseQuantity(item.id)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="increase-btn"
                onClick={() => increaseQuantity(item.id)}
              >
                +
              </button>
            </div>
          )}

          {item.id === FREE_GIFT.id && (
            <span className="gift-badge">FREE GIFT</span>
          )}
        </li>
      ))}
    </ul>
  )}
</div>

    </div>
  );
};

export default ShoppingCart;
