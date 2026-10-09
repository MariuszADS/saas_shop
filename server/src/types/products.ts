export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  active: boolean;
  image_url: string | null;
  created_at: string;
}

export interface ProductQuery {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?:
    | "price_asc"
    | "price_desc"
    | "newest";
  page: number;
  limit: number;
}