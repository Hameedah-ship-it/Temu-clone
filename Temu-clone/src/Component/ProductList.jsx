
import { Link, useNavigate, useLocation } from "react-router";

function ProductList({ products, loading, addToCart, searchTerm = "" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "all";
  const urlSearch = params.get("search") ?? searchTerm;
  const searching = urlSearch.trim().length > 0;

  const categories = {
    clothing: ["tops", "mens-shirts", "womens-dresses"],
    shoes: ["mens-shoes", "womens-shoes"],
    accessories: [
      "mens-watches", "womens-watches", "womens-bags",
      "womens-jewellery", "sunglasses", "mobile-accessories",
      "sports-accessories"
    ],
    beauty: ["beauty", "skin-care"],
    fragrances: ["fragrances"],
    home: ["furniture", "home-decoration", "kitchen-accessories"],
    electronics: ["smartphones", "laptops", "tablets"],
    groceries: ["groceries"]
  };

  const formatPrice = price =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2
    }).format(price);

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      searching ||
      category === "all" ||
      (categories[category]
        ? categories[category].includes(product.category)
        : product.category === category);

    const matchesSearch =
      product.title.toLowerCase().includes(urlSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(urlSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function handleBuyNow(product) {
    addToCart(product);
    navigate("/cart");
  }

  if (loading) {
    return <h2 className="loading">Loading products...</h2>;
  }

  return (
    <section className="products-section" id="products">
      <h2>
        {searching
          ? `Search Results for "${urlSearch}"`
          : category === "all"
          ? "All Products"
          : category === "home"
          ? "Home & Living"
          : category.charAt(0).toUpperCase() + category.slice(1)}
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`} className="product-link">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="product-image"
                />
                <h3>{product.title}</h3>
              </Link>

              <p className="product-category">{product.category}</p>
              <p className="product-price">{formatPrice(product.price)}</p>

              <div className="product-buttons">
                <button
                  className="add-cart-btn"
                  onClick={() => addToCart(product)}
                  title="Add to Cart"
                >
                  🛒
                </button>

                <button
                  className="buy-now-btn"
                  onClick={() => handleBuyNow(product)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
