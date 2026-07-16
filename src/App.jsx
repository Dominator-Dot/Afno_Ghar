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
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
