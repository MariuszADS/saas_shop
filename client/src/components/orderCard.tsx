import type { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
}

function getStatusClasses(
  status: Order["status"]
) {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 ring-yellow-200";

    case "processing":
      return "bg-blue-50 text-blue-700 ring-blue-200";

    case "shipped":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";

    case "delivered":
      return "bg-green-50 text-green-700 ring-green-200";

    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-200";

    default:
      return "bg-gray-50 text-gray-700 ring-gray-200";
  }
}

export default function OrderCard({
  order,
}: OrderCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">
            Order #{order.id}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {new Date(
              order.created_at
            ).toLocaleString()}
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusClasses(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-5">
        <h3 className="text-sm font-semibold text-gray-900">
          Items
        </h3>

        <ul className="mt-3 divide-y divide-gray-100">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className="flex items-center justify-between py-3 text-sm"
            >
              <div>
                <p className="font-medium text-gray-900">
                  Product #{item.productId}
                </p>

                <p className="mt-1 text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-medium text-gray-900">
                {item.quantity} ×{" "}
                {Number(item.unitPrice).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
        <span className="text-sm font-medium text-gray-600">
          Total
        </span>

        <span className="text-lg font-semibold text-gray-950">
          {Number(order.total).toFixed(2)}
        </span>
      </div>
    </article>
  );
}