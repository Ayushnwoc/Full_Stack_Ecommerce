import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoryResponse, ProductResponse, searchProductResponse } from "../../types/api-types";
import { SearchQuery } from "../../types/types";

export const productAPI = createApi({
	reducerPath: "productAPI",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
	}),
	endpoints: (builder) => ({
		latestProducts: builder.query<ProductResponse, string>({
			query: () => "latest",
		}),
		allProducts: builder.query<ProductResponse, string>({
			query: (id) => `admin-products?id=${id}`,
		}),
		categories: builder.query<CategoryResponse, string>({
			query: () => `categories`,
		}),
		searchProducts: builder.query<searchProductResponse, SearchQuery>({
			query: ({ search, price, category, sort, page }) =>
				`all?search=${search}&price=${price}&category=${category}&sort=${sort}&page=${page}`,
		}),
	}),
});

export const {
	useLatestProductsQuery,
	useAllProductsQuery,
    useCategoriesQuery,
	useSearchProductsQuery,
}: any = productAPI;
