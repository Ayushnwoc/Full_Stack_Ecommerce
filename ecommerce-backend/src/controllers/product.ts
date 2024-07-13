import { TryCatch } from "../middlewares/error.js";
import { Request, Response, NextFunction } from "express";
import {
	NewProductRequestBody,
	SearchRequestQuery,
	BaseQuery,
} from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import { serialize } from "v8";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const newProduct = TryCatch(
	async (
		req: Request<{}, {}, NewProductRequestBody>,
		res: Response,
		next: NextFunction
	) => {
		const { name, price, stock, category } = req.body;
		const photo = req.file;

		if (!photo) {
			return next(new ErrorHandler("Please provide photo.", 400));
		}

		if (!name || !price || !stock || !category) {
			rm(photo.path, () => {
				console.log("File deleted");
			});

			return next(
				new ErrorHandler("Please provide all the details.", 400)
			);
		}

		const product = await Product.create({
			name,
			price,
			stock,
			category: category.toLowerCase(),
			photo: photo.path,
		});

        invalidateCache({ product: true, admin: true});

		return res.status(201).json({
			success: true,
			message: "Product created successfully",
		});
	}
);

export const getLatestProducts = TryCatch(async (req, res, next) => {
	let products ;

	if (myCache.has("latest-products")) {
		products = JSON.parse(myCache.get("latest-products") as string);
	} else {
		products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
		myCache.set("latest-products", JSON.stringify(products));
	}

	return res.status(200).json({
		success: true,
		products,
	});
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products ;

    if(myCache.has("admin-products")) {
        products = JSON.parse(myCache.get("admin-products") as string);
    }
    else{
        products = await Product.find({}).sort({createdAt: -1});
        myCache.set("admin-products", JSON.stringify(products));
    }

	return res.status(200).json({
		success: true,
		products,
	});
});

export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;

    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories") as string);
    } else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }

	return res.status(200).json({
		success: true,
		data: categories,
	});
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;

    if (myCache.has(`product-${req.params.id}`)) {
        product = JSON.parse(myCache.get(`product-${req.params.id}`) as string);
    } else {
        product = await Product.findById(req.params.id);
        myCache.set(`product-${req.params.id}`, JSON.stringify(product));
    }

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	return res.status(200).json({
		success: true,
		data: product,
	});
});

export const updateProduct = TryCatch(async (req, res, next) => {
	const { id } = req.params;
	const { name, price, stock, category } = req.body;
	const photo = req.file;

	const product = await Product.findById(id);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	if (photo) {
		rm(product.photo, () => {
			console.log("File deleted");
		});
		product.photo = photo.path;
	}

	if (name) product.name = name;
	if (price) product.price = price;
	if (stock) product.stock = stock;
	if (category) product.category = category;

	await product.save();

    invalidateCache({ product: true, productId: id, admin: true});

	return res.status(200).json({
		success: true,
		message: "Product updated successfully",
	});
});

export const deleteProduct = TryCatch(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	rm(product.photo, () => {
		console.log("File deleted");
	});

	await product.deleteOne();

    invalidateCache({ product: true, productId: req.params.id, admin: true});

	return res.status(200).json({
		success: true,
		message: "Product deleted successfully",
	});
});

export const getAllProducts = TryCatch(
	async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
		const { search, price, category, sort } = req.query;

		const page = Number(req.query.page) || 1;

		const limit = Number(process.env.PRODUCTS_LIMIT) || 10;
		const skip = (page - 1) * limit;

		const baseQuery: BaseQuery = {};

		if (search) {
			baseQuery.name = {
				$regex: search,
				$options: "i",
			};
		}

		if (category) {
			baseQuery.category = category;
		}

		if (price) {
			baseQuery.price = {
				$lte: Number(price),
			};
		}

		const productsPromise = Product.find(baseQuery)
			.sort(sort && { price: sort === "asc" ? 1 : -1 })
			.limit(limit)
			.skip(skip);

		const [products, filteredOnlyProduct] = await Promise.all([
			productsPromise,
			Product.find(baseQuery),
		]);

		const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

		return res.status(200).json({
			success: true,
			data: products,
			totalPage: totalPage,
		});
	}
);
