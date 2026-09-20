import express, { type Express, type Request, type Response } from 'express';
import { createProduct } from '@/db/sql/createProduct.ts';
import productRoutes from './routes/product.routes.ts';

const app: Express = express();

//MIDDLEWARE
app.use(express.json());
app.use('/api/products', productRoutes)

// GET method route
app.get('/', (req: Request, res: Response) => {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/api/products', async (req: Request, res: Response, next) => {
  try {
    const product = await createProduct({
      name: req.body.name,
      description: req.body.description ?? null,
      price: req.body.price,
      stock: req.body.stock,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});


app.listen(3000, () => {
  console.log("servers is running on http://localhost:3000");
})