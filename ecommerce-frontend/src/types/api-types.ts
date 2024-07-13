import { Product, User } from "./types";


export type MessageResponse = {   
    message: string,
    success: boolean,
};

export type UserResponse = {
   success: boolean,
   data: User,
}

export type ProductResponse = {
    success: boolean,
    data : Product[],
}

export type CategoryResponse = {
    success: boolean,
    data: string[],
}

export type searchProductResponse = ProductResponse & {
    totalPage: number,
}