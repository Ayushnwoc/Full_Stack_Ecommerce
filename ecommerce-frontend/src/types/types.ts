export interface User {
    _id: string,
    name: string,
    email: string,
    photo: string,
    role: string,
    gender: string,
    dob: string,
}

export interface Product {
    _id: string,
    name: string,
    price: number,
    stock: number,
    category: string,
    photo: string,
}

export interface SearchQuery {
    search: string,
    price: string,
    category: string,
    sort: string,
    page: string,
}