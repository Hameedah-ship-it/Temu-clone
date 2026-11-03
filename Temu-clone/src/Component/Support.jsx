
import { useState } from "react";
import { Link } from "react-router";

function Support() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How can I track my order?",
      answer: "Visit the My Orders page to see your order history and order details."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery information is provided as part of this demo shopping experience. No real shipment is arranged."
    },
    {
      question: "Can I cancel my order?",
      answer: "This demo does not currently support real order cancellation."
    },
    {
      question: "How can I add products to my cart?",
      answer: "Browse the products, select Add to Cart, and visit your shopping cart to review them."
    },
    {
      question: "How do I save my favourite products?",
      answer: "Select the heart icon on a product to add it to your favourites."
    },
    {
      question: "Is payment available?",
      answer: "This is a demonstration website. Real payments are not currently available."
    }
  ];

  return (
    <main className="support-page">
      <section className="support-hero">
        <h1>How Can We Help You?</h1>
        <p>We're here to make your shopping experience easier.</p>
      </section>

      <section className="support-options">
        <Link to="/orders" className="support-card">
          <span>📦</span>
          <h3>Track Your Orders</h3>
          <p>View your order history and details.</p>
        </Link>

        <Link to="/account" className="support-card">
          <span>👤</span>
          <h3>My Account</h3>
          <p>Manage your personal information.</p>
        </Link>

        <Link to="/cart" className="support-card">
          <span>🛒</span>
          <h3>Shopping Cart</h3>
          <p>Check the products in your cart.</p>
        </Link>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <p className="faq-subtitle">Find answers to common questions.</p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <button
                className="faq-question"
                onClick={() =>
                  setOpenFAQ(openFAQ === index ? null : index)
                }
              >
                {faq.question}
                <span>{openFAQ === index ? "−" : "+"}</span>
              </button>

              {openFAQ === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="support-contact">
        <h2>Still Need Help?</h2>
        <p>Explore the pages above or check our frequently asked questions.</p>
        <Link to="/" className="main-btn">Continue Shopping</Link>
      </section>
    </main>
  );
}

export default Support;
