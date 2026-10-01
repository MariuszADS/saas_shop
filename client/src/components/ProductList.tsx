import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({
  products,
}: ProductListProps) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <section>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </section>
  );
}