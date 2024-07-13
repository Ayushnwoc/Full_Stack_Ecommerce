// import { GoogleAuthProvider} from "firebase/auth/web-extension";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";

const Login = () => {
	const [gender, setGender] = useState("");
	const [date, setDate] = useState("");
	const [login] = useLoginMutation();

	const loginHandler = async () => {
		try {

			const provider = new GoogleAuthProvider();
			const { user } = await signInWithPopup(auth, provider);

			const res = await login({
				email: user.email,
				name: user.displayName,
				photo: user.photoURL,
				role:"user",
				_id: user.uid,
				gender,
				dob: date,
			});

			if (res.data) {
				toast.success(res.data.message);
			} else {
				const error = res.error as FetchBaseQueryError;
				const message = (error.data as MessageResponse).message;
				toast.error(message);
			}

		} catch (error) {
			toast.error("Sign In Failed!");
			console.error(error);
		}
	};

	return (
		<div className="login">
			<main>
				<h1>Login</h1>
				<div>
					<label>Gender</label>
					<select
						value={gender}
						onChange={(e) => setGender(e.target.value)}
						required
					>
						<option value="">Select Gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>
                <div>
					<label>Date Of Birth</label>
					<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
				</div>
                <div>
                    <p>Already Have an Account</p>
                    <button onClick={loginHandler}>
                        <FcGoogle />
                        <span>Sign In with Google</span>
                    </button>
                </div>
			</main>
		</div>
	);
};

export default Login;
