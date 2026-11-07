
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Navbar({ cartItems, searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const count = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  function search(e) {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    navigate(`/?search=${encodeURIComponent(searchTerm)}#products`);
    setTimeout(() => setIsSearching(false), 700);
  }

  return (
    <>
      <div className="top-bar">
        <span>Free Shipping on Eligible Orders</span>
        <span>Price Adjustment</span>
        <span>Great Deals Every Day</span>
      </div>

      <header className="navbar">
        <Link to="/" className="logo">TEMU</Link>

        <form className="search-form" onSubmit={search}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <button type="submit" disabled={isSearching}>
            {isSearching ? (
              <span className="search-spinner"></span>
            ) : "⌕"}
          </button>
        </form>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/account">Account</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/support">Support</Link>
          <Link to="/cart">🛒 Cart ({count})</Link>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
