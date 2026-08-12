import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Products from "./pages/Products";
import Customize from "./pages/Customize";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Tracking from "./pages/Tracking";
import AdminOrders from "./pages/AdminOrders";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          padding: "15px 30px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Link
          to="/products"
          style={{ marginRight: "20px" }}
        >
          Products
        </Link>

        <Link
          to="/"
          style={{ marginRight: "20px" }}
        >
          Customize
        </Link>

        <Link
          to="/cart"
          style={{ marginRight: "20px" }}
        >
          Cart
        </Link>

        <Link
          to="/checkout"
          style={{ marginRight: "20px" }}
        >
          Checkout
        </Link>

        <Link
          to="/orders"
          style={{ marginRight: "20px" }}
        >
          My Orders
        </Link>

        <Link
          to="/tracking"
          style={{ marginRight: "20px" }}
        >
          Tracking
        </Link>

        <Link to="/admin/orders">
          Admin Orders
        </Link>
      </div>

      <Routes>
        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/"
          element={<Customize />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/tracking"
          element={<Tracking />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;