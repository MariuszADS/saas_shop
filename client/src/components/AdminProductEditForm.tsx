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
    <section>
      <h2>
        Edit Product #{product.id}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </label>
        </div>

        <div>
          <label>
            Description
            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
            />
          </label>
        </div>

        <div>
          <label>
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
            />
          </label>
        </div>

        <div>
          <label>
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
            />
          </label>
        </div>

        <div>
          <label>
            Active
            <input
              type="checkbox"
              checked={active}
              onChange={(event) =>
                setActive(
                  event.target.checked
                )
              }
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : "Save changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </section>
  );
}