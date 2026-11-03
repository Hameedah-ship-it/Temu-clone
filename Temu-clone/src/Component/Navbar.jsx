
import { Link, useNavigate } from "react-router";

function Navbar({ cartItems, searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function search(e) {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
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
          <button>⌕</button>
        </form>

        <nav className="nav-links">
          <Link to="/account">Account</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/support">Support</Link>
          <Link to="/cart">🛒 Cart ({count})</Link>
        </nav>
      </header>

      <div className="category-nav">
        <Link to="/">Home</Link>
        <Link to="/?category=clothing">Clothing</Link>
        <Link to="/?category=shoes">Shoes</Link>
        <Link to="/?category=accessories">Accessories</Link>
        <Link to="/?category=beauty">Beauty</Link>
        <Link to="/?category=fragrances">Fragrances</Link>
        <Link to="/?category=home">Home & Living</Link>
        <Link to="/favorites">Favourites</Link>
      </div>
    </>
  );
}

export default Navbar;
