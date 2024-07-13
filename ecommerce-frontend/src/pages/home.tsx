import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { Product } from "../types/types";
import toast from "react-hot-toast";
import Loader from "../components/loader";

const Home = () => {
	const {data , isLoading, isError }  = useLatestProductsQuery("");
	console.log(data);

	if(isError){
		toast.error("Failed to fetch products");
	}

	const addToCartHandler = () => {
		return;
	};

	return (
		<div className="home">
			<section></section>
			<h1>
				Latest Products
				<Link to="/search" className="findmore">
					More
				</Link>
			</h1>
			<main>
				{
					isLoading ? <Loader /> :
					data?.products.map((product: Product) => (
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
				}
			</main>
		</div>
	);
};

export default Home;
