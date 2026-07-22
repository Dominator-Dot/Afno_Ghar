import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <h3>✦ AfnoGhar</h3>
          <p>
            Handcrafted furniture, made in Kathmandu, built to last a
            lifetime. The Power to make your vision true.
            With distribution throughout the valley.
          </p>
        </div>

        <div className="footer-column">
          <h4>Shop</h4>
          <ul>
            <li>Sofas &amp; Sectionals</li>
            <li>Beds &amp; Mattresses</li>
            <li>Dining Tables</li>
            <li>Wardrobes</li>
            <li>Side table</li>
            <li>Bookshelf</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Contact</li>
            <li>Careers</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <ul>
            <li>Kathmandu, Nepal</li>
            <li>+977-01234567</li>
            <li>afnoghar@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AfnoGhar. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
