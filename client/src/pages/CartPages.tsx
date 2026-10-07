import { useState } from "react";

import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/services/order.service";

import CheckoutForm from "@/components/CheckoutForm";

import type { CheckoutData } from "@/types/checkout";

export default function CartPage() {
  const {
    cart,
    subtotal,
    removeItem,
    setQuantity,
    clearCart,
  } = useCart();

  const [message, setMessage] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  async function handleCheckout(
    checkoutData: CheckoutData
  ) {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (!token) {
      setMessage(
        "You must be logged in."
      );
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const order =
        await createOrder(
          cart,
          checkoutData,
          token
        );

      clearCart();

      setMessage(
        `Order #${order.id} created successfully. Payment authorized.`
      );
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          Cart
        </h1>

        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            Your cart is empty.
          </p>

          {message && (
            <p className="mt-3 text-sm text-gray-700">
              {message}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
        Cart
      </h1>

      <div className="mt-8 space-y-4">
        {cart.map((item) => (
          <article
            key={item.productId}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Price: {item.price}
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  Item total:{" "}
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      item.productId,
                      item.quantity - 1
                    )
                  }
                  className="h-9 w-9 rounded-lg border border-gray-300"
                >
                  -
                </button>

                <span className="min-w-10 text-center text-sm font-medium">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      item.productId,
                      item.quantity + 1
                    )
                  }
                  className="h-9 w-9 rounded-lg border border-gray-300"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() =>
                    removeItem(
                      item.productId
                    )
                  }
                  className="ml-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Subtotal
          </span>

          <span className="text-xl font-semibold text-gray-950">
            {Number(
              subtotal
            ).toFixed(2)}
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <CheckoutForm
          onCheckout={handleCheckout}
          isLoading={isLoading}
        />

        {message && (
          <p className="mt-4 text-sm text-gray-700">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}