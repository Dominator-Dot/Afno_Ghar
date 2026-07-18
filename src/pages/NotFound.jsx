import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="section notfound-page">
      <div className="container">
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
