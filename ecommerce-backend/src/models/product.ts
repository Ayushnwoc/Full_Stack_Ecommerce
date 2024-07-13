import mongoose from "mongoose";
import { trim } from "validator";

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name']
        },
        price: {
            type: Number,
            required: [true, 'Please provide a product price']
        },
        stock: {
            type: Number,
            required: [true, 'Please provide a product stock']
        },
        photo: {
            type: String,
            required: [true, 'Please provide a product photo']
        },
        category: {
            type: String,
            required: [true, 'Please provide a product category'],
            trim: true
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model("Product", schema);