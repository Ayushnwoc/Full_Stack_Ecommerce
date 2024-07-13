import { FaPlusCircle } from "react-icons/fa";

type ProductProps = {
	name: string;
	price: number;
	image: string;
	stock: number;
	productId: string;
	handler: () => void;
};

const server = import.meta.env.VITE_SERVER;

const ProductCard = ({
	name,
	price,
	image,
	stock,
	productId,
	handler,
}: ProductProps) => {
	return (
		<div className="product-card">
			<img src={`${server}/${image}`} alt={name} />
			<p>{name}</p>
			<span>Rs. {price}</span>
			<div>
				<button onClick={() => handler()}>
					<FaPlusCircle />
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
