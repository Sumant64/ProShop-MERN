import express from "express";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import productRoutes from './routes/productRoutes.js';
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();


const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);


// app.get('/', (req, res) => {
//     res.send('api is running...')
// })

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`app is running in port ${PORT}`))
