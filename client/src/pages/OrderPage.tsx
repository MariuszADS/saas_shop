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
        setIsLoading(false);
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
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-sm text-gray-600">
          Loading orders...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          My Orders
        </h1>

        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            You have no orders yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          My Orders
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Review your previous orders and their current status.
        </p>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
          />
        ))}
      </div>
    </main>
  );
}