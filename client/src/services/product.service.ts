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

export async function getAdminProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_URL}/api/products`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch products"
    );
  }

  return data.products ?? data;
}

export async function createAdminProduct(
 product: {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
},
  token: string
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/api/products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create product"
    );
  }

  return data;
}

export async function deleteAdminProduct(
  productId: number,
  token: string
) {
  const response = await fetch(
    `${API_URL}/api/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete product"
    );
  }

  return data;
}

export async function updateAdminProduct(
  productId: number,
  product: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    active?: boolean;
  },
  token: string
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/api/products/${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update product"
    );
  }

  return data;
}

export async function getProductById(
  productId: number
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/api/products/${productId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch product"
    );
  }

  return data;
}