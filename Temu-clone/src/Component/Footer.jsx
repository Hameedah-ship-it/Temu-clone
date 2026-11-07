
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h2>TEMU</h2>
          <p>Discover amazing products at great prices.</p>
        </div>

        <div>
          <h3>Shopping</h3>
          <Link to="/">Home</Link>
          <Link to="/favorites">Favourites</Link>
          <Link to="/cart">Shopping Cart</Link>
        </div>

        <div>
          <h3>Account</h3>
          <Link to="/account">My Account</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/support">Help & Support</Link>
        </div>
      </div>

      <p className="copyright">© 2026 Temu Clone. Cohort 6 Academy Project</p>
    </footer>
  );
}

export default Footer;
