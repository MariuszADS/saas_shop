import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "@/components/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ProductsPage from "@/pages/ProductsPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import CartPage from "@/pages/CartPages";
import LoginPage from "@/pages/loginPage";
import RegisterPage from "@/pages/registerPage";
import OrdersPage from "@/pages/OrderPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";

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
        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={<AdminDashboardPage />}
          />
        </Route>

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
        <Route element={<ProtectedRoute />}>
          <Route
            path="/cart"
            element={<CartPage />}
          />

          <Route
            path="/orders"
            element={<OrdersPage />}
          />
        </Route>
        <Route
          path="/products/:id"
          element={<ProductDetailsPage />}
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