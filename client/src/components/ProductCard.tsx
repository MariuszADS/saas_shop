import type { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
// import image_url from "/laptop.jpg"
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
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex-1">

        <div className="overflow-hidden rounded-xl bg-gray-100">
          <img
            src={product.image_url || "/laptop.jpeg"}
            alt={product.name}
            className="h-80 w-full object-contain"
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {product.name}
        </h2>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>
        )}

        <div className="mt-4 space-y-1 text-sm">
          <p className="font-medium text-gray-900">
            Price: {product.price}
          </p>

          <p
            className={
              product.stock > 0
                ? "text-gray-600"
                : "font-medium text-red-600"
            }
          >
            Stock: {product.stock}
          </p>
        </div>
      </div>
      <Link
        to={`/products/${product.id}`}
        className="mt-4 inline-block text-sm font-medium text-gray-700 hover:text-gray-950 hover:underline"
      >
        View details
      </Link>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className="mt-5 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {product.stock > 0
          ? "Add to cart"
          : "Out of stock"}
      </button>
    </article>
  );
}