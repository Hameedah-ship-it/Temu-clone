
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router";
import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
import ProductList from "./Component/ProductList";
import ProductDetails from "./Component/ProductDetails";
import Cart from "./Component/Cart";
import Orders from "./Component/Orders";
import Support from "./Component/Support";
import Footer from "./Component/Footer";
import "./App.css";

const API = "https://dummyjson.com/products?limit=0";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("orders")) || []);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetch(API)
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then(data => setProducts(data.products || []))
      .catch(error => console.error("Product fetching error:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(""), 2500);
    return () => clearTimeout(timer);
  }, [notification]);

  function addToCart(product) {
    setCartItems(old => {
      const found = old.find(item => item.id === product.id);
      return found
        ? old.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...old, { ...product, quantity: 1 }];
    });
    setNotification(product.title);
  }

  function removeFromCart(id) {
    setCartItems(old => old.filter(item => item.id !== id));
  }

  function changeQuantity(id, amount) {
    setCartItems(old =>
      old.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, amount) }
          : item
      )
    );
  }

  function toggleFavorite(product) {
    setFavorites(old =>
      old.some(item => item.id === product.id)
        ? old.filter(item => item.id !== product.id)
        : [...old, product]
    );
  }

  function placeOrder(details) {
    const order = {
      id: "TM" + Date.now(),
      date: new Date().toLocaleString(),
      items: cartItems,
      details,
      total: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    };

    setOrders(old => [...old, order]);
    setCartItems([]);
    return order;
  }

  return (
    <>
      <Navbar
        cartItems={cartItems}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {notification && (
        <div className="cart-notification">
          <span className="notification-check">✓</span>
          <div className="notification-info">
            <strong>Added to cart!</strong>
            <p>{notification}</p>
          </div>
          <Link to="/cart">View Cart</Link>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <ProductList
                products={products}
                loading={loading}
                addToCart={addToCart}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                searchTerm={searchTerm}
              />
            </>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              products={products}
              addToCart={addToCart}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              changeQuantity={changeQuantity}
              placeOrder={placeOrder}
            />
          }
        />

        <Route path="/account" element={<Account orders={orders} />} />

        <Route
          path="/orders"
          element={<Orders orders={orders} />}
        />

        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              addToCart={addToCart}
            />
          }
        />

        <Route path="/support" element={<Support />} />

        <Route
          path="*"
          element={<h2 className="not-found">Page not found</h2>}
        />
      </Routes>

      <Footer />
    </>
  );
}

/* ACCOUNT */
function Account({ orders }) {
  const [name, setName] = useState(localStorage.getItem("customerName") || "");
  const [email, setEmail] = useState(localStorage.getItem("customerEmail") || "");
  const [editing, setEditing] = useState(!localStorage.getItem("customerName"));

  function save(e) {
    e.preventDefault();
    localStorage.setItem("customerName", name);
    localStorage.setItem("customerEmail", email);
    setEditing(false);
  }

  return (
    <main className="page account-page">
      <div className="account-box">
        <h2>My Account</h2>
        {editing ? (
          <form className="account-form" onSubmit={save}>
            <label>Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button className="main-btn">Save Details</button>
          </form>
        ) : (
          <div className="account-details">
            <h3>{name}</h3>
            <p>{email}</p>
            <button className="main-btn" onClick={() => setEditing(true)}>
              Edit Details
            </button>
          </div>
        )}
        <Link to="/orders" className="account-orders">
          My Orders ({orders.length})
        </Link>
      </div>
    </main>
  );
}

/* FAVOURITES */
function Favorites({ favorites, toggleFavorite, addToCart }) {
  return (
    <main className="page">
      <h1>My Favourites</h1>
      {favorites.length === 0 ? (
        <p>No favourite products yet.</p>
      ) : (
        <div className="products-grid">
          {favorites.map(product => (
            <div className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`}>
                <img src={product.thumbnail} alt={product.title} />
                <h3>{product.title}</h3>
              </Link>
              <p className="product-price">${product.price}</p>
              <button className="main-btn" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
              <button
                className="remove-btn"
                onClick={() => toggleFavorite(product)}
              >
                Remove Favourite
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
