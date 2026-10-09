import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import { useCart } from "@/hooks/useCart";
import { getProductById } from "@/services/product.service";

import type { Product } from "@/types/product";

export default function ProductDetailsPage() {
    const { id } = useParams();

    const { addItem } = useCart();

    const [product, setProduct] =
        useState<Product | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        async function loadProduct() {
            const productId = Number(id);

            if (
                !Number.isSafeInteger(productId) ||
                productId <= 0
            ) {
                setError("Invalid product id");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const data =
                    await getProductById(productId);

                setProduct(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadProduct();
    }, [id]);

    if (isLoading) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-8">
                <p className="text-sm text-gray-600">
                    Loading product...
                </p>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error || "Product not found"}
                </div>
            </main>
        );
    }

    function handleAddToCart(product: any) {
        addItem({
            productId: product.id,
            name: product.name,
            price: Number(product.price),
        });
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <Link
                to="/products"
                className="text-sm font-medium text-gray-600 hover:text-gray-950"
            >
                ← Back to products
            </Link>

            <section className="mt-6 grid gap-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
                <div className="flex min-h-80 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                    <div className="overflow-hidden rounded-xl bg-gray-100">
                        <img
                            src={product.image_url || "/laptop.jpeg"}
                            alt={product.name}
                            className="h-80 w-full object-contain"
                        />
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Product #{product.id}
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
                        {product.name}
                    </h1>

                    {product.description && (
                        <p className="mt-4 leading-7 text-gray-600">
                            {product.description}
                        </p>
                    )}

                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <dl className="space-y-4">
                            <div className="flex justify-between">
                                <dt className="text-gray-500">
                                    Price
                                </dt>

                                <dd className="font-semibold text-gray-950">
                                    {Number(product.price).toFixed(2)}
                                </dd>
                            </div>

                            <div className="flex justify-between">
                                <dt className="text-gray-500">
                                    Stock
                                </dt>

                                <dd className="font-medium text-gray-900">
                                    {product.stock}
                                </dd>
                            </div>

                            <div className="flex justify-between">
                                <dt className="text-gray-500">
                                    Availability
                                </dt>

                                <dd className="font-medium text-gray-900">
                                    {product.active &&
                                        product.stock > 0
                                        ? "Available"
                                        : "Unavailable"}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={
                            !product.active ||
                            product.stock <= 0
                        }
                        className="mt-8 w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {product.stock > 0
                            ? "Add to cart"
                            : "Out of stock"}
                    </button>
                </div>
            </section>
        </main>
    );
}