import exp from "constants";
import { Request, Response, NextFunction } from "express";

export interface NewUserRequestBody {
	name: string;
	email: string;
	photo: string;
	gender: string;
	_id: string;
	dob: Date;
}

export interface NewProductRequestBody {
	name: string;
	price: number;
	stock: number;
	category: string;
}

export type OrderItemType = {
	name: string;
	quantity: number;
	photo: string;
	price: number;
	productId: string;
};

export type ShippingInfoType = {
	address: string;
	city: string;
	state: string;
	pinCode: string;
	country: string;
};

export interface NewOrderRequestBody {
	orderItems: OrderItemType[],
	shippingInfo: ShippingInfoType,
	user: string;
	subtotal: number;
	tax: number;
	shippingCharges: number;
	discount: number;
	total: number;
}

// controller type for not typing this again and again
export type ControllerType = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
	search?: string;
	price?: string;
	category?: string;
	sort?: string;
	page?: string;
};

export interface BaseQuery {
	name?: {
		$regex: string;
		$options: string;
	};
	price?: {
		$lte: number;
	};
	category?: string;
}

export type InvalidateCacheProps = {
	product?: boolean;
	order?: boolean;
	admin?: boolean;
	user?: string;
	orderId?: string;
	productId?: string | string[];
};