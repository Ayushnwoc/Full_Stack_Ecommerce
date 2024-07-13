import { useState } from "react";
import ProductCard from "../components/product-card";

import {
	useCategoriesQuery,
	useSearchProductsQuery,
} from "../redux/api/productAPI";
import { Product } from "../types/types";
import Loader from "../components/loader";
import toast from "react-hot-toast";

const Search = () => {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("asc");
	const [category, setCategory] = useState("");
	const [maxPrice, setMaxPrice] = useState("10000");
	const [page, setPage] = useState(1);
	const {
		data: categories,
		isLoading: categoriesLoading,
		isError: categoriesError,
		error: categoriesErrorData,
	} = useCategoriesQuery("");

	const { data: products, isLoading: searchLoading, isError: searchError, error:searchErrorData } = useSearchProductsQuery(
		{ search, price: maxPrice, category, sort, page }
	);

	if(categoriesError){
		toast.error(categoriesErrorData?.data?.message);
	}

	if(searchError){
		toast.error(searchErrorData?.data?.message);
	}

	const addToCartHandler = () => {
		return;
	};

	return (
		<div className="product-search-page">
			<aside>
				<h1>Filters</h1>
				<div>
					<h4>Sort</h4>
					<select
						value={sort}
						onChange={(e) => setSort(e.target.value)}
					>
						<option value="">None</option>
						<option value="asc">Price (Low to High)</option>
						<option value="dsc">Price (High to Low)</option>
					</select>
				</div>
				<div>
					<h4>MaxPrice: {maxPrice || ""}</h4>
					<input
						type="range"
						min={100}
						max={100000}
						value={maxPrice}
						onChange={(e) => setMaxPrice(e.target.value)}
					/>
				</div>
				<div>
					<h4>Category</h4>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					>
						<option value="">All</option>
						{!categoriesLoading &&
							categories?.data?.map((category: string) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
					</select>
				</div>
			</aside>
			<main>
				<h1>Products</h1>
				<input
					type="text"
					placeholder="Search by name..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div className="search-product-list">
					{searchLoading ? (
						<Loader />
					) : (
						products?.data.map((product: Product) => (
							<ProductCard
								key={product._id}
								name={product.name}
								price={product.price}
								stock={product.stock}
								productId={product._id}
								handler={addToCartHandler}
								image={product.photo}
							/>
						))
					)}
					{products?.data.length === 0 && (
						<span>No products found</span>
					)}
				</div>
				{!searchLoading && products?.totalPage > 1 && (
					<article>
						<button
							onClick={() => setPage(page - 1)}
							disabled={page === 1}
						>
							Previous
						</button>
						<span>
							{page} of {products?.totalPage}
						</span>
						<button onClick={() => setPage(page + 1)}>Next</button>
					</article>
				)}
			</main>
		</div>
	);
};

export default Search;
