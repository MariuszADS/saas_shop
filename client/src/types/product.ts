export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  active: boolean;
  created_at: string;
  image_url: string | null;
}