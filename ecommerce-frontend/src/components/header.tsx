import {
	FaSearch,
	FaShoppingBag,
	FaSignInAlt,
	FaSignOutAlt,
	FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";


type PropsType = {
	user: User | null;
};

const Header = ({user} : PropsType) => {
	const [isOpen, setIsOpen] = useState(false);
    
    const logoutHandler = async () => {
        try{
			await signOut(auth);
			toast.success("Logged Out");
			setIsOpen(false);
		}catch(error){
			toast.error("Failed to logout");
		}
        
    }

	return (
		<nav className="header">
			<Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
			<Link to="/search" onClick={() => setIsOpen(false)}>
				<FaSearch />
			</Link>
			<Link to="/cart" onClick={() => setIsOpen(false)}>
				<FaShoppingBag />
			</Link>
			{user?._id ? (
				<>
					<button onClick={() => setIsOpen((prev) => !prev)}>
						<FaUser />
					</button>
					<dialog open={isOpen}>
						<div>
							{user.role == "admin" && (
								<Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>Admin</Link>
							)}
							<Link to="/orders" onClick={() => setIsOpen(false)}>Orders</Link>
							<button onClick={logoutHandler}>
								<FaSignOutAlt />
							</button>
						</div>
					</dialog>
				</>
			) : (
				<Link to="/login">
					<FaSignInAlt />
				</Link>
			)}
		</nav>
	);
};

export default Header;
