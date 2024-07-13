import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
	mongoose
		.connect(uri, {
			dbName: "Ecommerce_1",
		})
		.then(() => {
			console.log("Connected to database");
		})
		.catch((err) => {
			console.log(err);
			console.log(err.message);
		});
};

export const invalidateCache = ({
	product,
	order,
	admin,
	user,
	orderId,
	productId,
}: InvalidateCacheProps) => {
	if (product) {
		const productKeys: string[] = [
			"latest-products",
			"admin-products",
			"categories",
		];

		if (typeof productId === "string") {
			productKeys.push(`product-${productId}`);
		}

		if (typeof productId === "object") {
			productId.forEach((id) => {
				productKeys.push(`product-${id}`);
			});
		}

		myCache.del(productKeys);
	}

	if (order) {
		const orderKeys: string[] = [
			"all-orders",
			`myorders-${user}`,
			`order-${orderId}`,
		];

		myCache.del(orderKeys);
	}

	if(admin){
		const adminKeys: string[] = [
			"admin-line-charts",
			"admin-pie-charts",
			"admin-bar-charts",
			"admin-stats",
		];
		myCache.del(adminKeys);
	
	}
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
	orderItems.forEach(async (item) => {
		const product = await Product.findById(item.productId);
		if (!product) {
			throw new Error("Product not found");
		}
		product.stock -= item.quantity;
		await product.save();
	});
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
	if (lastMonth === 0) return thisMonth * 100;
	const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
	return percent.toFixed(0);
};


export const getChartData = ({length, data}: {length:number , data:any}) => {
	const today = new Date();
	const chartData = new Array(length).fill(0);
	data.forEach((item: { createdAt: Date; }) => {
		const diff = today.getMonth() - item.createdAt.getMonth();
		chartData[length - diff -1] += 1;
	});
	return chartData;
};
