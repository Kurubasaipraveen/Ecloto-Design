import React, { useState, useEffect } from "react";
import "../styles/cart.css";
import products from "./data";

const FREE_GIFT = { id: 999, name: "Wireless Mouse", price: 0 };

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const remaining = Math.max(0, 1000 - subtotal);

  useEffect(() => {
    setCart((prevCart) => {
      const hasGift = prevCart.some((item) => item.id === FREE_GIFT.id);

      if (subtotal >= 1000 && !hasGift) {
        return [...prevCart, { ...FREE_GIFT, quantity: 1 }];
      } else if (subtotal < 1000 && hasGift) {
        return prevCart.filter((item) => item.id !== FREE_GIFT.id);
      }
      return prevCart;
    });
  }, [subtotal]);
  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  
  const decreaseQuantity = (id) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
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

      {/* Cart Summary */}
      <div className="cart-summary">
  <h2>Cart Summary</h2>
  <div className="RowTwo">
  <p className="subtotal">Subtotal:</p>
  <p className="total">$ {subtotal}</p>
</div>

  <hr/>
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
      style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
    ></div>
  </div>
  </div>

  <ul className="cart-items">
  {cart.map((item) => (
    <li key={item.id} className={`cart-item ${item.id === FREE_GIFT.id ? "free-gift" : ""}`}>
      <span>{item.name} <br/>
      ${item.price} X {item.quantity} = $ {item.price * item.quantity}</span>
      

      {/* Increase & Decrease Buttons */}
      {item.id !== FREE_GIFT.id && (
        <div className="quantity-controls">
          <button className="decrease-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
          <span>{item.quantity}</span>
          <button className="increase-btn" onClick={() => increaseQuantity(item.id)}>+</button>
        </div>
      )}

      {/* Free Gift Badge */}
      {item.id === FREE_GIFT.id && <span className="gift-badge">FREE GIFT</span>}
    </li>
  ))}
</ul>

</div>

    </div>
  );
};

export default ShoppingCart;
