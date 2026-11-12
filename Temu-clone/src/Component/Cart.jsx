
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

function Cart({ cartItems, removeFromCart, changeQuantity, placeOrder, currentUser }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    address: ""
  });
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setForm(old => ({
        ...old,
        name: currentUser.name,
        email: currentUser.email
      }));
    }
  }, [currentUser]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const money = amount => `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCheckout(e) {
    e.preventDefault();
    setShowGateway(true);
  }

  function confirmPayment() {
    if (processing) return;
    setProcessing(true);

    try {
      const order = placeOrder(form, "Paystack Demo");
      if (order === false) throw new Error("Order failed");

      setShowGateway(false);
      navigate("/orders", { state: { order } });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart Is Empty</h2>
        <p>You haven't added any products yet.</p>
        <Link to="/">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {cartItems.map(item => (
        <div className="cart-item" key={item.id}>
          <img src={item.thumbnail} alt={item.title} />

          <div>
            <h3>{item.title}</h3>
            <p>{money(item.price)}</p>

            <button type="button" onClick={() => changeQuantity(item.id, -1)}>−</button>
            <span> {item.quantity} </span>
            <button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button>

            <button type="button" onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <h3>Total: {money(total)}</h3>

      {!showCheckout ? (
        <button type="button" onClick={() => setShowCheckout(true)}>
          Proceed to Checkout
        </button>
      ) : (
        <form className="checkout-form" onSubmit={handleCheckout}>
          <h2>Delivery Information</h2>

          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
          <textarea name="address" placeholder="Delivery Address" value={form.address} onChange={handleChange} required />

          <h2>Payment Method</h2>

          <div className="payment-methods">
            <label className="payment-option">
              <input type="radio" checked readOnly />
              <strong>Paystack</strong>
              <span>Secure payment gateway</span>
            </label>
          </div>

          <p className="demo-payment-note">
            This is a school project demonstration. No real payment will be processed.
          </p>

          <button type="submit">Pay with Paystack</button>

          <button type="button" onClick={() => setShowCheckout(false)}>
            Back to Cart
          </button>
        </form>
      )}

      {showGateway && (
        <div className="gateway-overlay">
          <div className="gateway-box">
            <h2 className="paystack-logo">Paystack</h2>
            <p>ShopHub Payment</p>
            <h2>{money(total)}</h2>

            <div className="gateway-info">
              <p>Merchant: <strong>ShopHub</strong></p>
              <p>Customer: <strong>{form.email}</strong></p>
            </div>

            <p className="demo-payment-note">
              Demo gateway only. No real money will be charged.
            </p>

            <button type="button" onClick={confirmPayment} disabled={processing}>
              {processing ? "Processing..." : "Simulate Successful Payment"}
            </button>

            <button
              type="button"
              className="cancel-payment"
              onClick={() => setShowGateway(false)}
              disabled={processing}
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
