import express, { type Express, type Request, type Response } from 'express';
import productRoutes from './routes/product.routes.ts';
import authRoutes from "@/routes/auth.routes.ts";
import orderRoutes from "@/routes/order.routes.ts";
import adminOrderRoutes from "@/routes/adminOrder.routes.ts";

export const app: Express = express();

//CONTROLLERS
app.use(express.json());
app.use('/api/products', productRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/api/admin/orders",
  adminOrderRoutes);

app.listen(3000, () => {
  console.log("servers is running on http://localhost:3000");
})