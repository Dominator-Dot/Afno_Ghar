import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
