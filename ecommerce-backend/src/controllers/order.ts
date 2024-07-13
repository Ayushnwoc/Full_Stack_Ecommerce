import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody, OrderItemType } from "../types/types.js";
import { Request } from "express";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/user.js";
import { myCache } from "../app.js";

export const newOrder = TryCatch(
	async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
		const {
			orderItems,
			shippingInfo,
			user,
			subtotal,
			tax,
			shippingCharges,
			discount,
			total,
		} = req.body;

		if (
			!orderItems ||
			!shippingInfo ||
			!user ||
			!subtotal ||
			!tax ||
			!total
		) {
			return next(new ErrorHandler("Please fill all the fields", 400));
		}

		const mainUser = await User.findById(user);

		if (!mainUser) {
			return next(new ErrorHandler("User not found", 404));
		}

		await Order.create({
			orderItems,
			shippingInfo,
			user,
			subtotal,
			tax,
			shippingCharges,
			discount,
			total,
		});

		await reduceStock(orderItems);

		invalidateCache({ product: true, order: true, admin: true, user: user, productId: orderItems.map((item) => item.productId)});

		return res.status(201).json({
			success: true,
			message: "Order placed successfully",
		});
	}
);

export const myOrders = TryCatch(async (req: Request, res, next) => {
	const { id } = req.query;

	let orders;

	if (myCache.has(`myorders-${id}`)) {
		orders = JSON.parse(myCache.get(`myorders-${id}`) as string);
	} else {
		orders = await Order.find({ user: id });
		myCache.set(`myorders-${id}`, JSON.stringify(orders));
	}

	return res.status(200).json({
		success: true,
		data: orders,
	});
});

export const allOrders = TryCatch(async (req: Request, res, next) => {
    let orders;

    if (myCache.has("all-orders")) {
        orders = JSON.parse(myCache.get("orders") as string);
    } else {
        orders = await Order.find({}).populate("user", "name");
        myCache.set("all-orders", JSON.stringify(orders));
    }

    return res.status(200).json({
        success: true,
        data: orders,
    });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const key = `order-${id}`;
    let order;

    if(myCache.has(key)){
        order = JSON.parse(myCache.get(key) as string);
    }else{
        order = await Order.findById(id).populate("user", "name");
        if(!order){
            return next(new ErrorHandler("Order not found", 404));
        }
        myCache.set(key, JSON.stringify(order));
    }

    return res.status(200).json({
        success: true,
        data: order,
    });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }

    await order.deleteOne();
    invalidateCache({ product: true, order: true, admin: true, user: order.user, orderId: id});
    return res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});

export const processOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }
    switch(order.status){
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }

    await order.save();
    invalidateCache({ product: false, order: true, admin: true, user: order.user, orderId: id});
    return res.status(200).json({
        success: true,
        message: "Order processed successfully",
    });
});