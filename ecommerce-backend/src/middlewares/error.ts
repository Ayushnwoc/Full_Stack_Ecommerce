import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleWare = (
	err: ErrorHandler,
	req: Request,
	res: Response,
	next: NextFunction
) => {

    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

	if(err.name === "CastError") {
		err.message = "Invalid ID";
	}

	res.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};


// try catch block to use once
export const TryCatch = (fn: ControllerType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
}