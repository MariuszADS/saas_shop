import type { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
    });
  }

  return (
    <article>
      <h2>{product.name}</h2>

      {product.description && (
        <p>{product.description}</p>
      )}

      <p>Price: {product.price}</p>

      <p>Stock: {product.stock}</p>

      <button
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
      >
        {product.stock > 0
          ? "Add to cart"
          : "Out of stock"}
      </button>
    </article>
  );
}