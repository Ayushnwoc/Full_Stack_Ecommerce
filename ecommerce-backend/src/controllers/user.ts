import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = TryCatch(
	async (
		req: Request<{}, {}, NewUserRequestBody>,
		res: Response,
		next: NextFunction
	) => {
		const { name, email, photo, gender, _id, dob } = req.body;

		let user = await User.findById(_id);

		if (user) {
			return res.status(200).json({
				success: true,
				message: `Welcome ${user.name}! Your account already exists.`,
			});
		}

		if (!name || !email || !photo || !gender || !_id || !dob) {
			return next(
				new ErrorHandler("Please provide all the details", 400)
			);
		}

		user = await User.create({
			name,
			email,
			photo,
			gender,
			_id,
			dob: new Date(dob),
		});

		return res.status(201).json({
			success: true,
			message: `Welcome ${user.name}! Your account has been created successfully.`,
		});
	}
);

export const getAllUsers = TryCatch(async (req, res, next) => {
	const users = await User.find();
	return res.status(201).json({
		success: true,
		data: users,
	});
});

export const getUser = TryCatch(async (req, res, next) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (!user) {
		return next(new ErrorHandler("User not found", 404));
	}
	return res.status(201).json({
		success: true,
		data: user,
	});
});

export const deleteUser = TryCatch(async (req, res, next) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (!user) {
		return next(new ErrorHandler("User not found", 404));
	}
	await User.findByIdAndDelete(id);
	return res.status(201).json({
		success: true,
		message: "User deleted successfully",
	});
});
