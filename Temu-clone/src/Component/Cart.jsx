
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

function Cart({
  cartItems,
  removeFromCart,
  changeQuantity,
  placeOrder,
  currentUser
}) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Paystack Demo");
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
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleCheckout(e) {
    e.preventDefault();

    if (processing) return;

    setProcessing(true);

    try {
      // School project payment simulation only.
      const order = placeOrder(form, paymentMethod);

      navigate("/orders", {
        state: { order }
      });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
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
            <p>${item.price}</p>

            <button
              type="button"
              onClick={() => changeQuantity(item.id, -1)}
            >
              -
            </button>

            <span> {item.quantity} </span>

            <button
              type="button"
              onClick={() => changeQuantity(item.id, 1)}
            >
              +
            </button>

            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <h3>Total: ${total.toFixed(2)}</h3>

      {!showCheckout ? (
        <button
          type="button"
          onClick={() => setShowCheckout(true)}
        >
          Proceed to Checkout
        </button>
      ) : (
        <form className="checkout-form" onSubmit={handleCheckout}>
          <h2>Delivery Information</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Delivery Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <h2>Choose Payment Method</h2>

          <div className="payment-methods">
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="Paystack Demo"
                checked={paymentMethod === "Paystack Demo"}
                onChange={e => setPaymentMethod(e.target.value)}
              />

              <strong>Paystack</strong>
              <span>Demo payment</span>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="OPay Demo"
                checked={paymentMethod === "OPay Demo"}
                onChange={e => setPaymentMethod(e.target.value)}
              />

              <strong>OPay</strong>
              <span>Demo payment</span>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="Card Demo"
                checked={paymentMethod === "Card Demo"}
                onChange={e => setPaymentMethod(e.target.value)}
              />

              <strong>Card</strong>
              <span>Demo payment</span>
            </label>
          </div>

          {paymentMethod === "Paystack Demo" && (
            <div className="demo-payment-note">
              <h3>Paystack Demo Checkout</h3>
              <p>
                You selected Paystack for this demo order.
                Click the button below to simulate a successful payment.
              </p>
            </div>
          )}

          <p className="demo-payment-note">
            This is a school project demonstration.
            No real payment will be processed.
            Do not enter card details, PINs or banking passwords.
          </p>

          <button
            type="submit"
            disabled={processing}
          >
            {processing
              ? "Processing Demo..."
              : paymentMethod === "Paystack Demo"
                ? "Pay with Paystack (Demo)"
                : "Confirm Demo Payment"}
          </button>

          <button
            type="button"
            onClick={() => setShowCheckout(false)}
          >
            Back to Cart
          </button>
        </form>
      )}
    </div>
  );
}

export default Cart;
