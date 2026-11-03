
import { Link, useParams } from "react-router";

function ProductDetails({ products, addToCart, favorites, toggleFavorite }) {
  const { id } = useParams();
  const product = products.find(item => String(item.id) === id);

  if (!product) {
    return <main className="page"><h2>Loading product or product not found...</h2><Link to="/">Back home</Link></main>;
  }

  const saved = favorites.some(item => item.id === product.id);

  return (
    <main className="product-details">
      <div className="details-image">
        <img src={product.images?.[0]} alt={product.title} />
      </div>

      <div className="details-info">
        <p>{product.category?.name}</p>
        <h1>{product.title}</h1>
        <h2 className="product-price">${product.price}</h2>
        <p>{product.description}</p>
        <button className="main-btn" onClick={() => addToCart(product)}>Add to Cart</button>
        <button className="remove-btn" onClick={() => toggleFavorite(product)}>
          {saved ? "♥ Saved" : "♡ Add to Favourites"}
        </button>
        <p><Link to="/">← Continue Shopping</Link></p>
      </div>
    </main>
  );
}

export default ProductDetails;
