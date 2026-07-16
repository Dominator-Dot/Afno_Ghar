import { useState } from "react";
import "./Contact.css";

function Contact() {
  // "Controlled form" pattern: every input's value lives in
  // React state (formData), and every keystroke updates it.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    // In a real app, this is where you'd send `formData` to a server.
    console.log("Form submitted:", formData);
    setSubmitted(true);
  }

  return (
    <section className="section contact-page">
      <div className="container contact-grid">
        <div>
          <span className="section-eyebrow" style={{ textAlign: "left" }}>
            Get In Touch
          </span>
          <h2>We'd Love to Hear From You</h2>
          <p className="contact-text">
            Have a question about a product, an order, or a custom piece?
            Send us a message and our team will get back to you within 24
            hours.
          </p>

          <ul className="contact-details">
            <li>📍 Kathmandu, Nepal</li>
            <li>📞 +977-1-4XXXXXX</li>
            <li>✉️ hello@afnoghar.com</li>
          </ul>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Message
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>

          {submitted && (
            <p className="form-success">
              Thanks! Your message has been sent (this is a demo — no email
              was actually delivered).
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;
