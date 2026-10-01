import { Link } from "react-router-dom";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { cart } = useCart();
  const {
    user,
    logout,
  } = useAuth();

  const itemCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  return (
    <nav>
      <Link to="/products">
        Products
      </Link>

      <Link to="/cart">
        Cart ({itemCount})
      </Link>

      {user ? (
        <>
          <Link to="/orders">
            My Orders
          </Link>
          <span>{user.email}</span>

          <button onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>
        </>
      )}
    </nav>

  );
}