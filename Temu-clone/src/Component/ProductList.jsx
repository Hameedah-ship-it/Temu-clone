import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";


function ProductList({ addToCart, searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=0")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  function handleBuyNow(product) {
    addToCart(product);
    navigate("/cart");
  }

  if (loading) {
    return <h2 className="loading">Loading products...</h2>;
  }

  return (
    <section className="products-section">
      <h2>Our Products</h2>

      {visibleProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {visibleProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <Link
                to={`/products/${product.id}`}
                className="product-link"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="product-image"
                />

                <h3>{product.title}</h3>
              </Link>

              <p className="product-category">{product.category}</p>

              <p className="product-price">
                ${product.price}
              </p>

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

      {visibleCount < filteredProducts.length && (
        <button
          className="see-more-btn"
          onClick={() => setVisibleCount((prev) => prev + 10)}
        >
          See More
        </button>
      )}
    </section>
  );
}

export default ProductList;