
import { Link, useLocation } from "react-router";

function Orders({ orders = [] }) {
  const location = useLocation();
  const order = location.state?.order || orders[0];

  const money = amount =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2
    }).format(amount);

  if (!order) {
    return (
      <div className="orders-container">
        <h2>My Orders</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Order Confirmed!</h2>
      <p>Thank you for shopping with us.</p>

      <div className="receipt">
        <h3>Order Receipt</h3>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Date:</strong> {order.date}</p>
        <p><strong>Customer:</strong> {order.details.name}</p>
        <p><strong>Email:</strong> {order.details.email}</p>
        <p><strong>Customer Type:</strong> {order.customerType}</p>

        <hr />

        <h3>Products</h3>
        {order.products.map(item => (
          <p key={item.id}>
            {item.title} × {item.quantity} — {money(item.price * item.quantity)}
          </p>
        ))}

        <hr />

        <p><strong>Total:</strong> {money(order.total)}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p><strong>Delivery Address:</strong> {order.details.address}</p>
        <p><strong>Phone:</strong> {order.details.phone}</p>

        <p className="demo-payment-note">
          Demo receipt only. No real payment was processed.
        </p>
      </div>

      <Link to="/">Continue Shopping</Link>

      <h2>Order History</h2>
      {orders.map(item => (
        <div className="order-history" key={item.id}>
          <p>Order #{item.id}</p>
          <p>Customer: {item.details.name}</p>
          <p>Total: {money(item.total)}</p>
          <p>{item.paymentStatus}</p>
        </div>
      ))}
    </div>
  );
}

export default Orders;
