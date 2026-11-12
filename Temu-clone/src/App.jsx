
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
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

  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );

  const [orders, setOrders] = useState(
    () => JSON.parse(localStorage.getItem("orders")) || []
  );

  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );

  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(API)
      .then(res => {
        if (!res.ok) throw new Error("Unable to load products");
        return res.json();
      })
      .then(data => setProducts(data.products || []))
      .catch(error => console.error(error))
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
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  function addToCart(product, quantity = 1) {
    setCartItems(old => {
      const found = old.find(item => item.id === product.id);

      if (found) {
        return old.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...old, { ...product, quantity }];
    });
  }

  function removeFromCart(id) {
    setCartItems(old => old.filter(item => item.id !== id));
  }

  function changeQuantity(id, amount) {
    setCartItems(old =>
      old.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
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

  function registerAccount(name, email, password) {
    const accounts = JSON.parse(localStorage.getItem("demoAccounts")) || [];
    const cleanEmail = email.trim().toLowerCase();

    if (accounts.some(account => account.email === cleanEmail)) {
      return "An account with this email already exists.";
    }

    const account = {
      name: name.trim(),
      email: cleanEmail,
      password
    };

    localStorage.setItem(
      "demoAccounts",
      JSON.stringify([...accounts, account])
    );

    setCurrentUser({
      name: account.name,
      email: account.email
    });

    return "success";
  }

  function loginAccount(email, password) {
    const accounts = JSON.parse(localStorage.getItem("demoAccounts")) || [];
    const cleanEmail = email.trim().toLowerCase();

    const account = accounts.find(
      item => item.email === cleanEmail && item.password === password
    );

    if (!account) {
      return "Incorrect email or password.";
    }

    setCurrentUser({
      name: account.name,
      email: account.email
    });

    return "success";
  }

  function logoutAccount() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  }

  function placeOrder(details, paymentMethod) {
    if (cartItems.length === 0) return false;

    const order = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      products: cartItems,
      total: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      details,
      customerName: currentUser ? currentUser.name : details.name,
      customerEmail: currentUser ? currentUser.email : details.email,
      paymentMethod,
      paymentStatus: "Demo payment successful",
      customerType: currentUser ? "Registered customer" : "Guest"
    };

    setOrders(old => [order, ...old]);
    setCartItems([]);

    return order;
  }

  return (
    <>
      <Navbar
        cartItems={cartItems}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentUser={currentUser}
        logout={logoutAccount}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              loading={loading}
              addToCart={addToCart}
              searchTerm={searchTerm}
            />
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
              currentUser={currentUser}
            />
          }
        />

        <Route
          path="/account"
          element={
            <Account
              currentUser={currentUser}
              registerAccount={registerAccount}
              loginAccount={loginAccount}
              logoutAccount={logoutAccount}
            />
          }
        />

        <Route path="/orders" element={<Orders orders={orders} />} />

        <Route
          path="/favorites"
          element={<Favorites favorites={favorites} />}
        />

        <Route path="/support" element={<Support />} />

        <Route
          path="*"
          element={
            <Home
              products={products}
              loading={loading}
              addToCart={addToCart}
              searchTerm={searchTerm}
            />
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

function Account({
  currentUser,
  registerAccount,
  loginAccount,
  logoutAccount
}) {
  const [signup, setSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setName("");
      setEmail("");
      setPassword("");
      setError("");
      setShowPassword(false);
      setSignup(false);
      setConfirmLogout(false);
    }
  }, [currentUser]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const result = signup
      ? registerAccount(name, email, password)
      : loginAccount(email, password);

    if (result !== "success") {
      setError(result);
    }
  }

  function handleLogout() {
    setConfirmLogout(false);
    logoutAccount();
  }

  if (currentUser) {
    return (
      <div className="account-page">
        <div className="account-dashboard">
          <div className="account-avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>

          <p className="account-tag">MY ACCOUNT</p>
          <h2>Welcome back, {currentUser.name}!</h2>
          <p className="account-email">{currentUser.email}</p>

          <div className="account-info">
            <p>
              <strong>Account Name</strong>
              <span>{currentUser.name}</span>
            </p>

            <p>
              <strong>Email Address</strong>
              <span>{currentUser.email}</span>
            </p>

            <p>
              <strong>Account Status</strong>
              <span>Active</span>
            </p>
          </div>

          {!confirmLogout ? (
            <button
              className="logout-button"
              onClick={() => setConfirmLogout(true)}
            >
              Log Out
            </button>
          ) : (
            <div className="logout-confirm">
              <p>Are you sure you want to log out?</p>

              <button onClick={handleLogout}>
                Yes, Log Out
              </button>

              <button onClick={() => setConfirmLogout(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-card">
        <div className="account-brand">SHOPHUB</div>

        <h2>{signup ? "Create Your Account" : "Welcome Back!"}</h2>

        <p className="account-subtitle">
          {signup
            ? "Join us and enjoy easy shopping."
            : "Log in to continue shopping."}
        </p>

        <div className="account-tabs">
          <button
            className={!signup ? "active" : ""}
            onClick={() => {
              setSignup(false);
              setError("");
            }}
          >
            Login
          </button>

          <button
            className={signup ? "active" : ""}
            onClick={() => {
              setSignup(true);
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {signup && (
            <label>
              Full Name
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </label>
          )}

          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                minLength={6}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && <p className="account-error">{error}</p>}

          <button className="account-submit" type="submit">
            {signup ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="account-switch">
          {signup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            onClick={() => {
              setSignup(!signup);
              setError("");
              setName("");
              setEmail("");
              setPassword("");
            }}
          >
            {signup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Favorites({ favorites }) {
  const money = amount =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2
    }).format(amount);

  return (
    <div className="products-grid">
      {favorites.map(product => (
        <div className="product-card" key={product.id}>
          <img src={product.thumbnail} alt={product.title} />
          <h3>{product.title}</h3>
          <p>{money(product.price)}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
