import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const { cart } = useCart();

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
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
    </nav>
  );
}