import express, { type Express, type Request, type Response } from 'express';
import productRoutes from './routes/product.routes.ts';


const app: Express = express();

//CONTROLLERS
app.use(express.json());
app.use('/api/products', productRoutes)

app.listen(3000, () => {
  console.log("servers is running on http://localhost:3000");
})