
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";

function ProductDetails({ products, addToCart, favorites = [], toggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(item => String(item.id) === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const money = amount =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2
    }).format(amount);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || product.thumbnail);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <main className="details-message">
        <h2>Product not found</h2>
        <Link to="/">Back to Shopping</Link>
      </main>
    );
  }

  const saved = favorites.some(item => item.id === product.id);
  const images = product.images?.length
    ? product.images
    : [product.thumbnail];

  function handleAddToCart() {
    addToCart(product, quantity);
  }

  function handleBuyNow() {
    addToCart(product, quantity);
    navigate("/cart");
  }

  return (
    <main className="product-details">
      <div className="details-gallery">
        <div className="details-image">
          <img src={selectedImage || product.thumbnail} alt={product.title} />
        </div>

        <div className="details-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={selectedImage === image ? "active-thumb" : ""}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt={`${product.title} ${index + 1}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="details-info">
        <p className="details-category">{product.category}</p>

        <h1>{product.title}</h1>

        <div className="details-rating">
          <span>★ {product.rating || "New"}</span>
          <span>{product.brand || "Quality Product"}</span>
        </div>

        <h2 className="details-price">{money(product.price)}</h2>

        {product.discountPercentage > 0 && (
          <p className="details-discount">
            {Math.round(product.discountPercentage)}% off
          </p>
        )}

        <p className="details-description">{product.description}</p>

        <p className="details-stock">
          {product.stock > 0
            ? `${product.stock} items available`
            : "Stock information unavailable"}
        </p>

        <div className="quantity-section">
          <strong>Quantity:</strong>
          <div className="quantity-control">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>
        </div>

        <div className="details-buttons">
          <button className="details-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="details-buy-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>

        <button
          className="details-favorite"
          onClick={() => toggleFavorite(product)}
        >
          {saved ? "♥ Saved to Favourites" : "♡ Add to Favourites"}
        </button>

        <Link to="/" className="details-back">
          ← Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default ProductDetails;
