import type { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({
  order,
}: OrderCardProps) {
  return (
    <article>
      <h2>Order #{order.id}</h2>

      <p>Status: {order.status}</p>

      <p>
        Total: {order.total}
      </p>

      <p>
        Date:{" "}
        {new Date(
          order.created_at
        ).toLocaleString()}
      </p>

      <h3>Items</h3>

      <ul>
        {order.items.map((item) => (
          <li
            key={item.productId}
          >
            Product #{item.productId}
            {" — "}
            {item.quantity} ×{" "}
            {item.unitPrice}
          </li>
        ))}
      </ul>
    </article>
  );
}