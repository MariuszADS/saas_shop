import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import type { Product } from "@/types/product";

interface AdminProductEditFormProps {
  product: Product;
  onUpdate: (
    productId: number,
    product: {
      name: string;
      description: string;
      price: number;
      stock: number;
      active: boolean;
    }
  ) => Promise<void>;
  onCancel: () => void;
}

export default function AdminProductEditForm({
  product,
  onUpdate,
  onCancel,
}: AdminProductEditFormProps) {
  const [name, setName] =
    useState(product.name);

  const [description, setDescription] =
    useState(product.description ?? "");

  const [price, setPrice] =
    useState(String(product.price));

  const [stock, setStock] =
    useState(String(product.stock));

  const [active, setActive] =
    useState(product.active);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(String(product.price));
    setStock(String(product.stock));
    setActive(product.active);
  }, [product]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      await onUpdate(
        product.id,
        {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          active,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-950">
          Edit Product #{product.id}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update product details and availability.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Name

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Description

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={4}
              className="mt-1 w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Price

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </label>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Stock

              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) =>
                  setStock(event.target.value)
                }
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </label>
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) =>
              setActive(
                event.target.checked
              )
            }
            className="h-4 w-4 rounded border-gray-300"
          />

          <div>
            <p className="text-sm font-medium text-gray-900">
              Active product
            </p>

            <p className="text-xs text-gray-500">
              Active products can be shown to customers.
            </p>
          </div>
        </label>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isSubmitting
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}