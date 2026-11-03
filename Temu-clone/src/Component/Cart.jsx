
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Cart({ cartItems, removeFromCart, changeQuantity, placeOrder }) {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function checkout(e) {
    e.preventDefault();
    const order = placeOrder(form);
    navigate("/orders", { state: { order } });
  }

  return (
    <main className="page">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add products to see them here.</p>
          <Link to="/" className="main-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.images?.[0] || item.thumbnail} alt={item.title} />

                <div>
                  <h3>{item.title}</h3>
                  <b>${item.price}</b>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="quantity">
                  <button
                    onClick={() => changeQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => changeQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <p>
              Subtotal: <b>${total.toFixed(2)}</b>
            </p>

            <p>
              Delivery: <b>Free</b>
            </p>

            <hr />

            <h3>Total: ${total.toFixed(2)}</h3>

            <button
              className="main-btn"
              onClick={() => setShowCheckout(true)}
            >
              Checkout
            </button>
          </aside>
        </div>
      )}

      {showCheckout && cartItems.length > 0 && (
        <div className="checkout-box">
          <h2>Checkout Details</h2>
          <p>Enter your delivery information.</p>

          <form onSubmit={checkout} className="checkout-form">
            {[
              ["name", "Full name"],
              ["email", "Email address"],
              ["phone", "Phone number"],
              ["address", "Delivery address"]
            ].map(([key, label]) => (
              <label key={key}>
                {label}

                <input
                  required
                  type={
                    key === "email"
                      ? "email"
                      : key === "phone"
                      ? "tel"
                      : "text"
                  }
                  value={form[key]}
                  onChange={e =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              </label>
            ))}

            <div className="checkout-total">
              <span>Total Amount</span>
              <b>${total.toFixed(2)}</b>
            </div>

            <button className="main-btn" type="submit">
              Confirm Order
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowCheckout(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

export default Cart;
