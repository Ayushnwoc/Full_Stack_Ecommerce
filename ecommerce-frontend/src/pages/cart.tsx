import { set } from "firebase/database";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-items";
import { RiH1 } from "react-icons/ri";

const cartItems = [
	{
		name: "Thar",
		price: 40000,
		stock: 14,
		quantity: 10,
		productId: "2",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAjj6axXQMcB63E9yHawBYAcFYOVL8t3sV2mvs1wUDldMt7C4ujyv4evgqm3FF2MDp-74&usqp=CAU",
	},
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 100;
const discount = 200;
const total = subtotal + tax + shippingCharges;

const Cart = () => {
	const [couponCode, setCouponCode] = useState("");
	const [isValidCouponCode, setIsValidCouponCode] = useState(false);

	useEffect(() => {
		const timeOutId = setTimeout(() => {
			if (Math.random() > 0.5) {
				setIsValidCouponCode(true);
			} else {
				setIsValidCouponCode(false);
			}
		}, 1000);
		return () => {
			clearTimeout(timeOutId);
			setIsValidCouponCode(false);
		};
	}, [couponCode]);

	return (
		<div className="cart">
			<main>
				{cartItems.length > 0 ? (
					cartItems.map((item, index) => (
						<CartItem key={index} cartItem={item} />
					))
				) : (
					<h1>No Items Added</h1>
				)}
			</main>
			<aside>
				<p>Subtotal: Rs.{subtotal}</p>
				<p>Shipping: Rs.{shippingCharges}</p>
				<p>Tax: Rs.{tax}</p>
				<p>
					Discount: - <em className="red">Rs.{discount}</em>
				</p>
				<p>
					<b>Total: Rs.{total}</b>
				</p>
				<input
					type="text"
					placeholder="Coupon Code"
					value={couponCode}
					onChange={(e) => setCouponCode(e.target.value)}
				/>
				{couponCode &&
					(isValidCouponCode ? (
						<span className="green">
							Rs.{discount} off using <code>{couponCode}</code>
						</span>
					) : (
						<span className="red">
							Invalid Coupon <VscError />
						</span>
					))}
				{cartItems.length > 0 && <button>Checkout</button>}
			</aside>
		</div>
	);
};

export default Cart;
