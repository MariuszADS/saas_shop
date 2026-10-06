import {
    useEffect,
    useState,
} from "react";

import AdminProductForm from "@/components/AdminProductForm";
import AdminProductList from "@/components/AdminProductList";

import { useAuth } from "@/hooks/useAuth";

import {
    getAdminOrders,
    updateAdminOrderStatus,
} from "@/services/order.service";

import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProducts,
    updateAdminProduct
} from "@/services/product.service";
import AdminProductEditForm from "@/components/AdminProductEditForm";
import type { AdminOrder } from "@/types/order";
import type { Product } from "@/types/product";

export default function AdminDashboardPage() {
    const { token } = useAuth();

    const [orders, setOrders] =
        useState<AdminOrder[]>([]);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [editingProduct, setEditingProduct] =
        useState<Product | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function handleCreateProduct(
        product: {
            name: string;
            description: string;
            price: number;
            stock: number;
        }
    ) {
        if (!token) {
            return;
        }

        try {
            setError("");

            const createdProduct =
                await createAdminProduct(
                    product,
                    token
                );

            setProducts((currentProducts) => [
                createdProduct,
                ...currentProducts,
            ]);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    useEffect(() => {
        async function loadDashboard() {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const ordersData =
                    await getAdminOrders(token);

                setOrders(ordersData);

                const productsData =
                    await getAdminProducts();

                setProducts(productsData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboard();
    }, [token]);

    async function handleStatusChange(
        orderId: number,
        status: string
    ) {
        if (!token) {
            return;
        }

        try {
            setError("");

            await updateAdminOrderStatus(
                orderId,
                status,
                token
            );

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === orderId
                        ? {
                            ...order,
                            status:
                                status as AdminOrder["status"],
                        }
                        : order
                )
            );
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    async function handleDeleteProduct(
        productId: number
    ) {
        if (!token) {
            return;
        }

        try {
            setError("");

            await deleteAdminProduct(
                productId,
                token
            );

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) =>
                        product.id !== productId
                )
            );

            if (editingProduct?.id === productId) {
                setEditingProduct(null);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    if (isLoading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totalRevenue = orders.reduce(
        (sum, order) =>
            sum + Number(order.total),
        0
    );

    const pendingOrders = orders.filter(
        (order) =>
            order.status === "pending"
    ).length;

    const processingOrders =
        orders.filter(
            (order) =>
                order.status === "processing"
        ).length;

    async function handleUpdateProduct(
        productId: number,
        product: {
            name: string;
            description: string;
            price: number;
            stock: number;
            active: boolean;
        }
    ) {
        if (!token) {
            return;
        }

        try {
            setError("");

            const updatedProduct =
                await updateAdminProduct(
                    productId,
                    product,
                    token
                );

            setProducts((currentProducts) =>
                currentProducts.map((currentProduct) =>
                    currentProduct.id === productId
                        ? updatedProduct
                        : currentProduct
                )
            );

            setEditingProduct(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <main>
            <h1>Admin Dashboard</h1>

            <section>
                <p>
                    Orders: {orders.length}
                </p>

                <p>
                    Revenue:{" "}
                    {totalRevenue.toFixed(2)}
                </p>

                <p>
                    Pending: {pendingOrders}
                </p>

                <p>
                    Processing:{" "}
                    {processingOrders}
                </p>
            </section>

            <section>
                <h2>Orders</h2>

                {orders.map((order) => (
                    <article key={order.id}>
                        <h3>
                            Order #{order.id}
                        </h3>

                        <p>
                            Customer: {order.email}
                        </p>

                        <label>
                            Status:

                            <select
                                value={order.status}
                                onChange={(event) =>
                                    handleStatusChange(
                                        order.id,
                                        event.target.value
                                    )
                                }
                            >
                                <option value="pending">
                                    Pending
                                </option>

                                <option value="processing">
                                    Processing
                                </option>

                                <option value="shipped">
                                    Shipped
                                </option>

                                <option value="delivered">
                                    Delivered
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>
                            </select>
                        </label>

                        <p>
                            Total: {order.total}
                        </p>
                    </article>
                ))}
            </section>

            <AdminProductForm
                onCreate={handleCreateProduct}
            />

            {editingProduct && (
                <AdminProductEditForm
                    product={editingProduct}
                    onUpdate={handleUpdateProduct}
                    onCancel={() =>
                        setEditingProduct(null)
                    }
                />
            )}

            <AdminProductList
                products={products}
                onDelete={handleDeleteProduct}
                onEdit={setEditingProduct}
            />
        </main>
    );
}