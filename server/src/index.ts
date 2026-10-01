// import express, { type Express, type Request, type Response } from 'express';
// import productRoutes from './routes/product.routes.ts';
// import authRoutes from "@/routes/auth.routes.ts";
// import orderRoutes from "@/routes/order.routes.ts";
// import adminOrderRoutes from "@/routes/adminOrder.routes.ts";
// import cors from "cors"

// export const app: Express = express();

// //CONTROLLERS
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// })
// );
// app.use(express.json());
// app.use('/api/products', productRoutes)
// app.use("/api/auth", authRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/admin/orders", adminOrderRoutes);

// app.listen(3000, () => {
//   console.log("servers is running on http://localhost:3000");
// })

import express from "express";
import cors from "cors";

import authRoutes from "@/routes/auth.routes.ts";
import productRoutes from "@/routes/product.routes.ts";
import orderRoutes from "@/routes/order.routes.ts";
import adminOrderRoutes from "@/routes/adminOrder.routes.ts";

export const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});