import express from "express";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";



const app = express.Router();

app.post("/new", newOrder);

app.get("/my", myOrders);

app.get("/all",adminOnly, allOrders);

app.route("/:id").get(getSingleOrder).put(processOrder).delete(adminOnly, deleteOrder);

export default app;