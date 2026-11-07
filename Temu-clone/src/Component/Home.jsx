
import { Link } from "react-router";

function Home() {
  const categories = [
    { name: "All Products", slug: "all" },
    { name: "Clothing", slug: "clothing" },
    { name: "Shoes", slug: "shoes" },
    { name: "Accessories", slug: "accessories" },
    { name: "Beauty", slug: "beauty" },
    { name: "Fragrances", slug: "fragrances" },
    { name: "Home & Living", slug: "home" },
    { name: "Electronics", slug: "electronics" },
    { name: "Groceries", slug: "groceries" }
  ];

  return (
    <>
      <section className="home-banner">
        <div>
          <p className="sale-label">EARLY BLACK FRIDAY DEALS</p>
          <h1>UP TO 70% OFF</h1>
          <p>Discover amazing deals on products you love.</p>
          <Link to="/?category=all#products" className="shop-now">
            SHOP NOW
          </Link>
        </div>
      </section>

      <section className="benefits-bar">
        <span>✓ Great Everyday Prices</span>
        <span>✓ Easy Shopping</span>
        <span>✓ Free Shipping</span>
      </section>

      <section className="quick-categories">
        {categories.map(category => (
          <Link
            key={category.slug}
            to={`/?category=${category.slug}#products`}
          >
            {category.name}
          </Link>
        ))}
      </section>
    </>
  );
}

export default Home;
