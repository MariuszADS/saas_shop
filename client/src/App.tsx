import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "@/components/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";

import ProductsPage from "@/pages/ProductsPage";
import CartPage from "@/pages/CartPages";
import LoginPage from "@/pages/loginPage";
import RegisterPage from "@/pages/registerPage";

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
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/cart"
            element={<CartPage />}
          />
        </Route>

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