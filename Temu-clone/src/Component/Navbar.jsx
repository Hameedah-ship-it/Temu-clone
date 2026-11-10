
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Navbar({ cartItems, searchTerm, setSearchTerm, currentUser, logout }) {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const count = cartItems.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}#products`);
  }

  return (
    <>
      <div className="top-bar">
        Free Shipping on All Orders | Great Deals Every Day
      </div>

      <header className="navbar">
        <Link to="/" className="logo">SHOPHUB</Link>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="search"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/support">Support</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/cart">Cart ({count})</Link>

          {currentUser ? (
            <>
              <Link to="/account">{currentUser.name}</Link>
              <button className="logout-nav" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/account">Account / Login</Link>
          )}
        </nav>
      </header>
    </>
  );
}

export default Navbar;
