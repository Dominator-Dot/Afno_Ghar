import { Link } from "react-router-dom";
import "./RentalInfo.css";

function RentalInfo() {
  return (
    <section id="rental" className="rental-section section">
      <div className="container rental-grid">
        <div className="rental-copy">
          <span className="section-eyebrow">Rental Service</span>
          <h2 className="section-title">Rent premium furniture with easy verification</h2>
          <p>
            Enjoy flexible furniture rental for your home or office. Our rental
            process is designed for fast approval, clear requirements, and
            delivery right to your address.
          </p>

          <ul className="rental-list">
            <li>
              <strong>Simple booking</strong> — choose the furniture and submit your details.
            </li>
            <li>
              <strong>Identity verification</strong> — provide a citizen number or proof of identity.
            </li>
            <li>
              <strong>Delivery-ready</strong> — tell us the address where the furniture will be used.
            </li>
            <li>
              <strong>Post-login access</strong> — rental requests are available after signing in.
            </li>
          </ul>

          <Link to="/products" className="btn btn-primary">
            Browse rental furniture
          </Link>
        </div>

        <div className="rental-visual">
          <h3>What to expect</h3>
          <p>
            Once you select a product, the rental form will ask for your name,
            phone number, identity proof, and the address where the furniture
            will be placed.
          </p>
          <div className="rental-visual-list">
            <div>
              <strong>Step 1</strong>
              <p>Sign in and select the item you want to rent.</p>
            </div>
            <div>
              <strong>Step 2</strong>
              <p>Submit your verification details in the rental form.</p>
            </div>
            <div>
              <strong>Step 3</strong>
              <p>Receive confirmation and wait for delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RentalInfo;
