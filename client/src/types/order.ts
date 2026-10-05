export interface OrderItem {
    productId: number;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    id: number;
    status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

    total: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}

export interface AdminOrder extends Order {
  user_id: number;
  email: string;
}