import type { Product } from "@/types/product";

interface AdminProductListProps {
  products: Product[];
  onDelete: (productId: number) => void;
  onEdit: (product: Product) => void;
}

export default function AdminProductList({
  products,
  onDelete,
  onEdit,
}: AdminProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-950">
          Products
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage existing products in the store.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-950">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {product.description}
                  </p>
                )}
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  product.active
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {product.active
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Price
                </span>

                <span className="font-medium text-gray-900">
                  {Number(product.price).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Stock
                </span>

                <span className="font-medium text-gray-900">
                  {product.stock}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(product.id)
                }
                className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}