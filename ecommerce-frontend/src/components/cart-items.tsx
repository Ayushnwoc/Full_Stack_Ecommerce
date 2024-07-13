import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type cartItmesProps = {
	cartItem: any;
};

const CartItem = ({ cartItem }: cartItmesProps) => {
	const { name, price, image, quantity, stock, productId } = cartItem;
	return (
		<div className="cart-item">
			<img src={image} alt={name} />
			<article>
				<Link to={`/product/${productId}`}>{name}</Link>
				<span>Rs.{price}</span>
			</article>
			<div>
				<button>-</button>
				<span>{quantity}</span>
				<button>+</button>
			</div>
			<button>
				<FaTrash />
			</button>
		</div>
	);
};

export default CartItem;
