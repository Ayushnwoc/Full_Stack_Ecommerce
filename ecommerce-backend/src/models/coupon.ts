import mongoose from "mongoose";

const schema = new mongoose.Schema(
	{
		couponCode: {
			type: String,
			required: [true, "Please provide a coupon code"],
			unique: true,
		},
		amount: {
			type: Number,
			required: [true, "Please provide a discount amount"],
		},
	},
	{
		timestamps: true,
	}
);

export const Coupon = mongoose.model("Coupon", schema);
