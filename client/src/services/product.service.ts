import type { Product } from "@/types/product";

const API_URL = "http://localhost:3000";

interface ProductQuery {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  products: Product[];
}

export async function getProducts(
  query: ProductQuery
): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.minPrice !== undefined) {
    params.set(
      "minPrice",
      String(query.minPrice)
    );
  }

  if (query.maxPrice !== undefined) {
    params.set(
      "maxPrice",
      String(query.maxPrice)
    );
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  if (query.page !== undefined) {
    params.set(
      "page",
      String(query.page)
    );
  }

  if (query.limit !== undefined) {
    params.set(
      "limit",
      String(query.limit)
    );
  }

  const response = await fetch(
    `${API_URL}/api/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch products"
    );
  }

  return response.json();
}