import express from "express";
import { get } from "http";
import { newProduct, getLatestProducts, getAllCategories, getAdminProducts, getSingleProduct, updateProduct, deleteProduct, getAllProducts } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";


const app = express.Router();

app.post("/new", adminOnly, singleUpload, newProduct);

app.get("/all", getAllProducts);

app.get("/latest", getLatestProducts);

app.get("/categories", getAllCategories);

app.get("/admin-products", adminOnly, getAdminProducts);

app.route("/:id").get(getSingleProduct).put(adminOnly, singleUpload, updateProduct).delete(adminOnly, deleteProduct);




export default app;