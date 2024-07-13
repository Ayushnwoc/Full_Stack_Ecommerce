import mongoose from "mongoose";


const schema = new mongoose.Schema(
    {
        shippingInfo: {
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            pinCode: {
                type: Number,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
        },
        user: {
            type: String,
            required: true,
            ref: "User",
        },
        subtotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            required: true,
        },
        shippingCharges: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered"],
            default: "Processing",
        },
        orderItems: [
            {
                name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                photo: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                productId: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                    ref: "Product",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", schema);