import express from 'express';
import { connectDB } from './utils/features.js';
import { Request, Response, NextFunction } from 'express';
import { errorMiddleWare } from './middlewares/error.js';
import NodeCache from 'node-cache';
import { config } from 'dotenv';
import morgan from 'morgan';


import orderRoute from './routes/order.js';
import userRoute from './routes/user.js';
import productRoute from './routes/product.js';
import paymentRoute from './routes/payment.js';
import dashboard from './routes/stats.js';
import Stripe from 'stripe';
import cors from 'cors';

config({
    path: "./.env"
});

const port = process.env.PORT || 5000;
const mongo_uri = process.env.MONGO_URI || "";
const stripe_key = process.env.STRIPE_KEY || "";

// for db connection
connectDB(mongo_uri);

const app = express();

// for stripe
export const stripe = new Stripe(stripe_key);

// for caching
export const myCache = new NodeCache();

// middleware to call before any api
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


app.use("/api/v1/user", userRoute)

app.use("/api/v1/product", productRoute);

app.use("/api/v1/order", orderRoute);

app.use("/api/v1/payment", paymentRoute);

app.use("/api/v1/dashboard", dashboard); 


// for making upload folder static so that it should be accesible and not trated as api
app.use("/uploads", express.static("uploads"));

// for any invalid route
app.use(errorMiddleWare);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});