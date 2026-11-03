
import { Link, useLocation } from "react-router";

function Orders({ orders }) {
  const location = useLocation();
  const confirmedOrder = location.state?.order;

  return (
    <main className="page">
      {confirmedOrder && (
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p className="thank-you">
            Thank you, {confirmedOrder.details.name}, for shopping with TEMU!
          </p>

          <div className="confirmation-details">
            <h3>Order Information</h3>
            <p>Order Number: <b>{confirmedOrder.id}</b></p>
            <p>Date: {confirmedOrder.date}</p>
            <p>Total Amount: <b>${confirmedOrder.total.toFixed(2)}</b></p>

            <hr />

            <h3>Delivery Information</h3>
            <p><b>{confirmedOrder.details.name}</b></p>
            <p>{confirmedOrder.details.phone}</p>
            <p>{confirmedOrder.details.email}</p>
            <p>{confirmedOrder.details.address}</p>
          </div>

          <p className="delivery-message">
            Your order will be delivered to the address you provided.
            Thank you for your patronage!
          </p>

          <Link to="/" className="main-btn">
            Continue Shopping
          </Link>
        </div>
      )}

      <h2 className="orders-heading">My Orders</h2>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        [...orders].reverse().map(order => (
          <div className="order-card" key={order.id}>
            <h3>Order {order.id}</h3>
            <p>{order.date}</p>
            <p>{order.items.length} product(s)</p>
            <b>${order.total.toFixed(2)}</b>
            <p className="success-text">Demo order confirmed</p>
          </div>
        ))
      )}
    </main>
  );
}

export default Orders;
