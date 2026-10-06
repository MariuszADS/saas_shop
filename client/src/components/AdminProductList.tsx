import type { Product } from "@/types/product";


interface AdminProductListProps {
  products: Product[];
  onDelete: (productId: number) => void;
  onEdit: (product: Product) => void;
}

export default function AdminProductList({
  products,
  onDelete,
  onEdit
}: AdminProductListProps) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <section>
      <h2>Products</h2>

      {products.map((product) => (
        <article key={product.id}>
          <h3>{product.name}</h3>

          <p>Price: {product.price}</p>
          <p>Stock: {product.stock}</p>

          <button
            type="button"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(product.id)
            }
          >
            Delete
          </button>
        </article>
      ))}
    </section>
  );
}