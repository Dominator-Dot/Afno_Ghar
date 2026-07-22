import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Customize from "./pages/Customize";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

/*
  App.jsx is the "shell" of the whole website.
  The Navbar and Footer are always visible, no matter which
  page the user is on. The <Routes> block in the middle swaps
  out just the page content based on the current URL.

  Example:
    "/"          -> shows <Home />
    "/products"  -> shows <Products />
    "/about"     -> shows <About />
*/
function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/customize"
            element={
              <ProtectedRoute>
                <Customize />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
