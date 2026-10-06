import { Link } from "react-router-dom";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const linkClasses =
    "text-sm font-medium text-gray-700 transition hover:text-gray-950";

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link
            to="/products"
            className="text-lg font-semibold text-gray-950"
          >
            SaaS Shop
          </Link>

          <Link
            to="/products"
            className={linkClasses}
          >
            Products
          </Link>

          <Link
            to="/cart"
            className={linkClasses}
          >
            Cart ({itemCount})
          </Link>

          {user && (
            <Link
              to="/orders"
              className={linkClasses}
            >
              My Orders
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={linkClasses}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-gray-500 md:inline">
                {user.email}
              </span>

              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={linkClasses}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}