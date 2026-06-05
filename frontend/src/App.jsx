import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import SingUp from "./pages/SingUp";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<SingUp />} />

        <Route path="/" element={<ProductList />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
