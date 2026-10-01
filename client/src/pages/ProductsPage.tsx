import { useEffect, useState } from "react";

import ProductList from "@/components/ProductList";
import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProducts({
          search,
          sort,
          page,
          limit: 8,
        });

        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [search, sort, page]);

  return (
    <main>
      <h1>Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
      />

      <select
        value={sort}
        onChange={(event) => {
          setSort(event.target.value);
          setPage(1);
        }}
      >
        <option value="newest">
          Newest
        </option>

        <option value="price_asc">
          Price: low to high
        </option>

        <option value="price_desc">
          Price: high to low
        </option>
      </select>

      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <ProductList products={products} />
      )}

      <div>
        <button
          disabled={page <= 1}
          onClick={() =>
            setPage((currentPage) => currentPage - 1)
          }
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() =>
            setPage((currentPage) => currentPage + 1)
          }
        >
          Next
        </button>
      </div>
    </main>
  );
}