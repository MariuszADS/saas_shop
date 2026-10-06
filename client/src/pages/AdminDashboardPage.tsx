import {
  useEffect,
  useState,
} from "react";

import AdminProductForm from "@/components/AdminProductForm";
import AdminProductList from "@/components/AdminProductList";
import AdminProductEditForm from "@/components/AdminProductEditForm";

import { useAuth } from "@/hooks/useAuth";

import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "@/services/order.service";

import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from "@/services/product.service";

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

      if (
        editingProduct?.id === productId
      ) {
        setEditingProduct(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

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
        currentProducts.map(
          (currentProduct) =>
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

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-gray-600">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </main>
    );
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Manage orders, products and store activity.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Orders
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-950">
            {orders.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Revenue
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-950">
            {totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-950">
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Processing
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-950">
            {processingOrders}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-950">
            Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Review and update customer orders.
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-950">
                    Order #{order.id}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.email}
                  </p>
                </div>

                <p className="text-sm font-semibold text-gray-950">
                  Total:{" "}
                  {Number(
                    order.total
                  ).toFixed(2)}
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Status

                  <select
                    value={order.status}
                    onChange={(event) =>
                      handleStatusChange(
                        order.id,
                        event.target.value
                      )
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:w-56"
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
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <AdminProductForm
          onCreate={handleCreateProduct}
        />
      </section>

      {editingProduct && (
        <section className="mt-8">
          <AdminProductEditForm
            product={editingProduct}
            onUpdate={handleUpdateProduct}
            onCancel={() =>
              setEditingProduct(null)
            }
          />
        </section>
      )}

      <section className="mt-10">
        <AdminProductList
          products={products}
          onDelete={handleDeleteProduct}
          onEdit={setEditingProduct}
        />
      </section>
    </main>
  );
}