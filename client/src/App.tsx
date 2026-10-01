import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "@/components/NavBar";
import ProductsPage from "@/pages/ProductsPage";
import CartPage from "@/pages/CartPages";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/products"
              replace
            />
          }
        />

        <Route
          path="/products"
          element={<ProductsPage />}
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />

        <Route
          path="*"
          element={
            <h1>404 - Page not found</h1>
          }
        />
      </Routes>
    </>
  );
}

export default App;