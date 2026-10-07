import {
  useState,
  type FormEvent,
} from "react";

import type {
  CheckoutData,
  PaymentMethod,
} from "@/types/checkout";

interface CheckoutFormProps {
  onCheckout: (
    data: CheckoutData
  ) => Promise<void>;

  isLoading: boolean;
}

export default function CheckoutForm({
  onCheckout,
  isLoading,
}: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] =
    useState("");
  const [country, setCountry] =
    useState("Norway");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("vipps");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    await onCheckout({
      shippingAddress: {
        name,
        address,
        city,
        postalCode,
        country,
      },
      paymentMethod,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section>
        <h2 className="text-lg font-semibold text-gray-950">
          Shipping address
        </h2>

        <div className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(event) =>
              setAddress(event.target.value)
            }
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Postal code"
              value={postalCode}
              onChange={(event) =>
                setPostalCode(
                  event.target.value
                )
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />
          </div>

          <input
            type="text"
            value={country}
            onChange={(event) =>
              setCountry(event.target.value)
            }
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-950">
          Payment method
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="cursor-pointer rounded-xl border border-gray-200 p-4">
            <input
              type="radio"
              name="payment"
              value="vipps"
              checked={
                paymentMethod === "vipps"
              }
              onChange={() =>
                setPaymentMethod("vipps")
              }
            />

            <div className="mt-2">
              <p className="font-semibold">
                Vipps
              </p>

              <p className="text-sm text-gray-500">
                Pay securely with Vipps
              </p>
            </div>
          </label>

          <label className="cursor-pointer rounded-xl border border-gray-200 p-4">
            <input
              type="radio"
              name="payment"
              value="klarna"
              checked={
                paymentMethod === "klarna"
              }
              onChange={() =>
                setPaymentMethod("klarna")
              }
            />

            <div className="mt-2">
              <p className="font-semibold">
                Klarna
              </p>

              <p className="text-sm text-gray-500">
                Pay later with Klarna
              </p>
            </div>
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-700 disabled:bg-gray-300"
      >
        {isLoading
          ? "Processing payment..."
          : "Place order"}
      </button>
    </form>
  );
}