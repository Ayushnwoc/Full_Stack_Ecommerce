import express from 'express';
import { createPaymentIntent, deleteCoupon, getAllCoupons, getDiscount, newCoupon } from '../controllers/payment.js';
import { get } from 'http';
import { adminOnly } from '../middlewares/auth.js';
import { create } from 'domain';


const app = express.Router();


app.post("/create", createPaymentIntent );

app.get("/discount", getDiscount );

app.post("/coupon/new", adminOnly, newCoupon);

app.get("/coupon/all", adminOnly, getAllCoupons);

app.route("/coupon/:id").delete(adminOnly, deleteCoupon);


export default app;