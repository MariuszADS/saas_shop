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
  }) => Promise<void>;
}

export default function AdminProductForm({
  onCreate,
}: AdminProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

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
      });

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Create Product</h2>

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

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating..."
            : "Create Product"}
        </button>
      </form>
    </section>
  );
}