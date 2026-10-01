import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/hooks/useAuth";
import { getMyOrders } from "@/services/order.service";

import OrderCard from "@/components/orderCard";

import type { Order } from "@/types/order";

export default function OrdersPage() {
  const { token } = useAuth();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!token) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data =
          await getMyOrders(token);

        setOrders(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [token]);

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <main>
        <h1>My Orders</h1>
        <p>You have no orders yet.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>My Orders</h1>

      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
        />
      ))}
    </main>
  );
}