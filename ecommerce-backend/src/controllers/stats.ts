import { start } from "repl";
import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { calculatePercentage, getChartData } from "../utils/features.js";

export const getStats = TryCatch(async (req, res, next) => {
	let stats;

	if (myCache.has("admin-stats")) {
		stats = JSON.parse(myCache.get("admin-stats") as string);
	} else {
		const today = new Date();
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(today.getMonth() - 6);

		const thisMonth = {
			start: new Date(today.getFullYear(), today.getMonth(), 1),
			end: today,
		};

		const lastMonth = {
			start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
			end: new Date(today.getFullYear(), today.getMonth(), 0),
		};

		const thisMonthProductsPromise = Product.find({
			createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
		});

		const lastMonthProductsPromise = Product.find({
			createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
		});

		const thisMonthUserPromise = User.find({
			createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
		});

		const lastMonthUserPromise = User.find({
			createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
		});

		const thisMonthOrderPromise = Order.find({
			createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
		});

		const lastMonthOrderPromise = Order.find({
			createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
		});

		const lastSixMonthOrderPromise = Order.find({
			createdAt: {
				$gte: sixMonthsAgo,
				$lte: today,
			},
		});

		const latestTransactionPromise = Order.find()
			.select(["orderItems", "discount", "total", "status"])
			.limit(5);

		const [
			thisMonthProducts,
			lastMonthProducts,
			thisMonthUser,
			lastMonthUser,
			thisMonthOrder,
			lastMonthOrder,
			productsCount,
			usersCount,
			allOrders,
			lastSixMonthOrder,
			categories,
			femaleUserCount,
			latestTransaction,
		] = await Promise.all([
			thisMonthProductsPromise,
			lastMonthProductsPromise,
			thisMonthUserPromise,
			lastMonthUserPromise,
			thisMonthOrderPromise,
			lastMonthOrderPromise,
			Product.countDocuments(),
			User.countDocuments(),
			Order.find().select("total"),
			lastSixMonthOrderPromise,
			Product.distinct("category"),
			User.countDocuments({ gender: "female" }),
			latestTransactionPromise,
		]);

		const modifiedLatestTransaction = latestTransaction.map((order) => {
			return {
				id: order._id,
				quantity: order.orderItems.length,
				discount: order.discount,
				amount: order.total,
				status: order.status,
			};
		});

		const thisMonthRevenue = thisMonthOrder.reduce(
			(total, order) => total + order.total,
			0
		);
		const lastMonthRevenue = lastMonthOrder.reduce(
			(total, order) => total + order.total,
			0
		);

		const categoriesCountPromise = categories.map((category) => {
			return Product.countDocuments({ category });
		});

		const categoriesCount = await Promise.all(categoriesCountPromise);

		const categoryCount = categories.map((category, i) => {
			return {
				[category]: Math.round(
					(categoriesCount[i] / productsCount) * 100
				),
			};
		});

		const changePercent = {
			revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
			user: calculatePercentage(
				thisMonthUser.length,
				lastMonthUser.length
			),
			product: calculatePercentage(
				thisMonthProducts.length,
				lastMonthProducts.length
			),
			order: calculatePercentage(
				thisMonthOrder.length,
				lastMonthOrder.length
			),
		};

		const revenue = allOrders.reduce(
			(total, order) => total + order.total,
			0
		);

		const count = {
			revenue: revenue,
			products: productsCount,
			users: usersCount,
			orders: allOrders.length,
		};

		const orderMonthCount = new Array(6).fill(0);
		const orderMonthlyRevenue = new Array(6).fill(0);

		lastSixMonthOrder.forEach((order) => {
			const monthdiff =
				(today.getMonth() - order.createdAt.getMonth() + 12) % 12;

			if (monthdiff < 6) {
				orderMonthCount[6 - monthdiff - 1]++;
				orderMonthlyRevenue[6 - monthdiff - 1] += order.total;
			}
		});

		const userRatio = {
			male: Math.round(
				((usersCount - femaleUserCount) / usersCount) * 100
			),
			female: Math.round((femaleUserCount / usersCount) * 100),
		};

		stats = {
			categoryCount,
			changePercent,
			count,
			chart: {
				order: orderMonthCount,
				revenue: orderMonthlyRevenue,
			},
			userRatio,
			latestTransactions: modifiedLatestTransaction,
		};

		myCache.set("admin-stats", JSON.stringify(stats));
	}
	res.status(200).json({
		success: true,
		data: stats,
	});
});

export const getPie = TryCatch(async (req, res, next) => {
	let charts;

	if (myCache.has("admin-pie-charts")) {
		charts = JSON.parse(myCache.get("admin-pie-charts") as string);
	} else {
		const [
			processingOrder,
			shippedOrder,
			deliveredOrder,
			categories,
			productsCount,
			outOfStock,
			allOrders,
			allUsers,
			adminUsers,
			customerUsers,
		] = await Promise.all([
			Order.countDocuments({ status: "Processing" }),
			Order.countDocuments({ status: "Shipped" }),
			Order.countDocuments({ status: "Delivered" }),
			Product.distinct("category"),
			Product.countDocuments(),
			Product.countDocuments({ stock: 0 }),
			Order.find().select([
				"total",
				"discount",
				"shippingCharges",
				"tax",
				"subtotal",
			]),
			User.find().select(["role", "dob"]),
			User.countDocuments({ role: "admin" }),
			User.countDocuments({ role: "user" }),
		]);

		const orderFulfillment = {
			processing: processingOrder,
			shipped: shippedOrder,
			delivered: deliveredOrder,
		};

		const categoriesCountPromise = categories.map((category) => {
			return Product.countDocuments({ category });
		});

		const categoriesCount = await Promise.all(categoriesCountPromise);

		const productCategories = categories.map((category, i) => {
			return {
				[category]: Math.round(
					(categoriesCount[i] / productsCount) * 100
				),
			};
		});

		const stockAvailability = {
			inStock: productsCount - outOfStock,
			outOfStock,
		};

		const [grossIncome, discount, productionCost, burnt] = [
			allOrders.reduce((total, order) => total + order.total, 0),
			allOrders.reduce((total, order) => total + order.discount, 0),
			allOrders.reduce(
				(total, order) => total + order.shippingCharges,
				0
			),
			allOrders.reduce((total, order) => total + order.tax, 0),
		];

		const marketingCost = Math.round(grossIncome * 0.3);

		const netMargin =
			grossIncome - discount - productionCost - burnt - marketingCost;

		const revenueDistribution = {
			netMargin,
			discount,
			productionCost,
			burnt,
			marketingCost,
		};

		const adminCustomer = {
			admin: adminUsers,
			customer: customerUsers,
		};

		const usersAgeGroup = {
			teen: allUsers.filter((user) => user.age <= 18).length,
			adult: allUsers.filter((user) => user.age > 18 && user.age <= 45)
				.length,
			senior: allUsers.filter((user) => user.age > 45).length,
		};

		charts = {
			orderFulfillment,
			productCategories,
			stockAvailability,
			revenueDistribution,
			adminCustomer,
			usersAgeGroup,
		};

		myCache.set("admin-pie-charts", JSON.stringify(charts));
	}
	return res.status(200).json({
		success: true,
		data: charts,
	});
});

export const getLine = TryCatch(async (req, res, next) => {
	let charts;
	const key = "admin-line-charts";

    if(myCache.has(key)){
        charts = JSON.parse(myCache.get(key) as string);
    }else{

        const today = new Date();

		const twelveMonthsAgo = new Date();
		twelveMonthsAgo.setMonth(today.getMonth() - 12);

		const lastTwelveMonthUserPromise = User.find({
			createdAt: {
				$gte: twelveMonthsAgo,
				$lte: today,
			},
		});

		const lastTwelveMonthProductPromise = Product.find({
			createdAt: {
				$gte: twelveMonthsAgo,
				$lte: today,
			},
		});

		const lastTwelveMonthOrderPromise = Order.find({
			createdAt: {
				$gte: twelveMonthsAgo,
				$lte: today,
			},
		});

		const [users, products, orders] = await Promise.all([
			lastTwelveMonthUserPromise,
			lastTwelveMonthProductPromise,
			lastTwelveMonthOrderPromise,
		]);

		const productCounts = getChartData({length: 6,data: products});
		const userCounts = getChartData({ length: 6, data: users });
		const orderCounts = getChartData({ length: 12, data: orders });

        charts = {
            user: userCounts,
            product: productCounts,
            order: orderCounts,
        };

        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        data: charts,
    });
});

export const getBar = TryCatch(async (req, res, next) => {
	let charts;
	const key = "admin-line-charts";

	if (myCache.has(key)) {
		charts = JSON.parse(myCache.get(key) as string);
	} else {
		const today = new Date();

		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(today.getMonth() - 6);

		const twelveMonthsAgo = new Date();
		twelveMonthsAgo.setMonth(today.getMonth() - 12);

		const lastSixMonthUserPromise = User.find({
			createdAt: {
				$gte: sixMonthsAgo,
				$lte: today,
			},
		});

		const lastSixMonthProductPromise = Product.find({
			createdAt: {
				$gte: sixMonthsAgo,
				$lte: today,
			},
		});

		const lastTwelveMonthOrderPromise = Order.find({
			createdAt: {
				$gte: twelveMonthsAgo,
				$lte: today,
			},
		});

		const [users, products, orders] = await Promise.all([
			lastSixMonthUserPromise,
			lastSixMonthProductPromise,
			lastTwelveMonthOrderPromise,
		]);

		const productCounts = getChartData({length: 12,data: products});
		const userCounts = getChartData({ length: 12, data: users });
		const orderCounts = getChartData({ length: 12, data: orders });

        charts = {
            user: userCounts,
            product: productCounts,
            order: orderCounts,
        };

		myCache.set(key, JSON.stringify(charts));
	}

	return res.status(200).json({
		success: true,
		data: charts,
	});
});
