import {
    useEffect,
    useState,
} from "react";

import { useAuth } from "@/hooks/useAuth";
import {
    getAdminOrders,
    updateAdminOrderStatus,
} from "@/services/order.service";

import type { AdminOrder } from "@/types/order";

export default function AdminDashboardPage() {
    const { token } = useAuth();

    const [orders, setOrders] =
        useState<AdminOrder[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        async function loadOrders() {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const data =
                    await getAdminOrders(token);

                setOrders(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadOrders();
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

    if (isLoading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.total),
        0
    );

    const pendingOrders = orders.filter(
        (order) => order.status === "pending"
    ).length;

    const processingOrders = orders.filter(
        (order) => order.status === "processing"
    ).length;

    return (
        <main>
            <h1>Admin Dashboard</h1>

            <section>
                <p>
                    Orders: {orders.length}
                </p>

                <p>
                    Revenue: {totalRevenue.toFixed(2)}
                </p>

                <p>
                    Pending: {pendingOrders}
                </p>

                <p>
                    Processing: {processingOrders}
                </p>
            </section>

            {orders.map((order) => (
                <article key={order.id}>
                    <h2>
                        Order #{order.id}
                    </h2>

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
        </main>
    );
}