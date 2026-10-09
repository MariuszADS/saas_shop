import {
  useState,
  type FormEvent,
} from "react";

interface AdminProductFormProps {
  onCreate: (product: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
  }) => Promise<void>;
}

export default function AdminProductForm({
  onCreate,
}: AdminProductFormProps) {
  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      await onCreate({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
      });

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImageUrl("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-950">
          Create Product
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add a new product to the store.
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
                  setPrice(
                    event.target.value
                  )
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
                  setStock(
                    event.target.value
                  )
                }
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Image URL

            <input
              type="url"
              value={imageUrl}
              onChange={(event) =>
                setImageUrl(
                  event.target.value
                )
              }
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </label>

          {imageUrl && (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img
                src={imageUrl}
                alt="Product preview"
                className="h-48 w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isSubmitting
              ? "Creating..."
              : "Create Product"}
          </button>
        </div>
      </form>
    </section>
  );
}